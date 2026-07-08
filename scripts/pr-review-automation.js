const fs = require("fs");
const path = require("path");

const token = process.env.GITHUB_TOKEN;
const eventPath = process.env.GITHUB_EVENT_PATH;

const VALID_AUTH = ["apiKey", "OAuth", "Bearer", "No", ""];
const VALID_CORS = ["yes", "no", "unknown"];
const VALID_PRICING = ["free", "freemium", "paid", "unknown"];
const REQUIRED_FIELDS = [
  "API Name",
  "Auth",
  "HTTPS",
  "Cors",
  "Documentation Link",
  "Category",
];

async function ghApi(endpoint, options = {}) {
  const url = endpoint.startsWith("https://")
    ? endpoint
    : `https://api.github.com${endpoint}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...options.headers,
    },
  });
  if (!res.ok) {
    throw new Error(`GitHub API ${res.status}: ${await res.text()}`);
  }
  return res.json();
}

async function run() {
  const event = JSON.parse(fs.readFileSync(eventPath, "utf8"));
  const pr = event.pull_request;
  const owner = event.repository.owner.login;
  const repo = event.repository.name;
  const prNumber = pr.number;

  console.log(`Reviewing PR #${prNumber} by ${pr.user.login}`);

  const files = await ghApi(
    `/repos/${owner}/${repo}/pulls/${prNumber}/files?per_page=100`,
  );

  const comments = [];
  const resourcesFile = files.find(
    (f) => f.filename === "db/resources.json" && f.status !== "removed",
  );
  const readmeFile = files.find(
    (f) => f.filename === "README.md" && f.status !== "removed",
  );
  const categoryFiles = files.filter(
    (f) => f.filename.startsWith("categories/") && f.status !== "removed",
  );

  if ((readmeFile || categoryFiles.length > 0) && !resourcesFile) {
    comments.push(
      "⚠️ **Auto-generated files modified**\n\n" +
        "`README.md` and `categories/*.md` are auto-generated from `db/resources.json`. " +
        "Please edit `db/resources.json` instead. See the [contributing guide](CONTRIBUTING.md) for details.",
    );
  }

  if (resourcesFile) {
    const validation = await validateResourcesChange(
      owner,
      repo,
      pr,
      resourcesFile,
    );
    if (validation) {
      comments.push(validation);
    }
  }

  if (comments.length > 0) {
    const body = comments.join("\n\n---\n\n");
    await ghApi(`/repos/${owner}/${repo}/issues/${prNumber}/comments`, {
      method: "POST",
      body: JSON.stringify({ body }),
    });
    console.log("Review comment posted.");
  } else {
    console.log("No issues found.");
  }
}

async function validateResourcesChange(owner, repo, pr, file) {
  const issues = [];
  const info = [];

  const headContent = await ghApi(
    `/repos/${pr.head.repo.owner.login}/${pr.head.repo.name}/contents/db/resources.json?ref=${pr.head.sha}`,
  );
  const decoded = Buffer.from(headContent.content, "base64").toString("utf8");

  let headJson;
  try {
    headJson = JSON.parse(decoded);
  } catch (e) {
    return "❌ **Invalid JSON** in `db/resources.json`: " + e.message;
  }

  const actualCount = headJson.entries.length;
  if (headJson.count !== actualCount) {
    issues.push(
      `\`count\` field is ${headJson.count} but there are ${actualCount} entries`,
    );
  }

  const patch = file.patch || "";
  const newEntries = extractNewEntries(patch);

  if (newEntries.length === 0) {
    if (issues.length > 0) {
      return "### Validation Issues\n\n" + issues.map((i) => `- ${i}`).join("\n");
    }
    return null;
  }

  for (const entry of newEntries) {
    const entryIssues = validateEntry(entry);
    if (entryIssues.length > 0) {
      issues.push(
        ...entryIssues.map((i) => `**${entry["API Name"] || "Unknown"}**: ${i}`),
      );
    }

    info.push(formatEntryInfo(entry));
  }

  const parts = [];

  if (info.length > 0) {
    const header = newEntries.length === 1 ? "### New API" : "### New APIs";
    parts.push(header + "\n\n" + info.join("\n\n"));
  }

  if (issues.length > 0) {
    parts.push(
      "### Validation Issues\n\n" + issues.map((i) => `- ⚠️ ${i}`).join("\n"),
    );
  }

  if (issues.length === 0 && info.length > 0) {
    parts.push("✅ Entry format looks good.");
  }

  return parts.join("\n\n") || null;
}

function extractNewEntries(patch) {
  const entries = [];
  const lines = patch.split("\n");
  let current = null;
  let buffer = "";
  let inNew = false;

  for (const line of lines) {
    if (!line.startsWith("+") || line.startsWith("+++")) continue;
    const content = line.slice(1);

    if (content.trim() === "{" && !inNew) {
      inNew = true;
      buffer = "{";
      continue;
    }

    if (inNew) {
      buffer += "\n" + content;
      if (content.trim() === "}" || content.trim() === "},") {
        try {
          const clean = buffer.replace(/,\s*$/, "");
          const parsed = JSON.parse(clean);
          if (parsed["API Name"]) {
            entries.push(parsed);
          }
        } catch (e) {
          // Not a complete entry
        }
        inNew = false;
        buffer = "";
      }
    }
  }

  return entries;
}

function validateEntry(entry) {
  const issues = [];

  for (const field of REQUIRED_FIELDS) {
    if (entry[field] === undefined || entry[field] === null) {
      issues.push(`missing required field \`${field}\``);
    }
  }

  if (entry["API Name"] && entry["API Name"].toLowerCase().endsWith("api")) {
    issues.push("name should not end with \"API\"");
  }

  if (
    entry["Description"] &&
    entry["Description"].length > 100
  ) {
    issues.push(
      `description is ${entry["Description"].length} characters (max 100)`,
    );
  }

  if (entry["Auth"] !== undefined && !VALID_AUTH.includes(entry["Auth"])) {
    issues.push(
      `invalid Auth value \`${entry["Auth"]}\` (valid: ${VALID_AUTH.filter(Boolean).join(", ")}, or empty)`,
    );
  }

  if (entry["HTTPS"] !== undefined && typeof entry["HTTPS"] !== "boolean") {
    issues.push(`HTTPS must be \`true\` or \`false\`, got \`${entry["HTTPS"]}\``);
  }

  if (entry["Cors"] && !VALID_CORS.includes(entry["Cors"])) {
    issues.push(
      `invalid Cors value \`${entry["Cors"]}\` (valid: ${VALID_CORS.join(", ")})`,
    );
  }

  if (entry["Pricing"] && !VALID_PRICING.includes(entry["Pricing"])) {
    issues.push(
      `invalid Pricing value \`${entry["Pricing"]}\` (valid: ${VALID_PRICING.join(", ")})`,
    );
  }

  const docLink = entry["Documentation Link"];
  if (docLink && !docLink.startsWith("http://") && !docLink.startsWith("https://")) {
    issues.push("Documentation Link must start with `http://` or `https://`");
  }

  return issues;
}

function formatEntryInfo(entry) {
  const lines = [
    `| Field | Value |`,
    `|-------|-------|`,
    `| Name | **${entry["API Name"]}** |`,
    `| Description | ${entry["Description"] || "(empty)"} |`,
    `| Category | ${entry["Category"]} |`,
    `| Auth | ${entry["Auth"] || "None"} |`,
    `| HTTPS | ${entry["HTTPS"]} |`,
    `| CORS | ${entry["Cors"]} |`,
    `| Docs | ${entry["Documentation Link"]} |`,
    `| Pricing | ${entry["Pricing"] || "unknown"} |`,
  ];
  return lines.join("\n");
}

run().catch((error) => {
  console.error("Error:", error.message);
  process.exit(1);
});
