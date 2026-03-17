# Public APIs

<div align="center">
    <a href="https://findapis.com">
        <img src="./assets/findapis-logo.svg" alt="findapis.com" width="64" height="64">
    </a>
    <p>The largest collection of public APIs for developers. Includes free, freemium, and paid APIs.</p>
    <p>
        <a href="https://findapis.com">findapis.com</a> •
        <a href="CONTRIBUTING.md">Contributing Guide</a> •
        <a href="https://github.com/paytience/public-apis/issues">Issues</a> •
        <a href="https://github.com/paytience/public-apis/pulls">Pull Requests</a> •
        <a href="LICENSE">License</a>
    </p>
</div>

## Categories

**15545 APIs** across **53 categories**

| Category | APIs |
|----------|------|
| [Animals](./categories/animals.md) | 33 |
| [Anime](./categories/anime.md) | 19 |
| [Anti-Malware](./categories/anti-malware.md) | 15 |
| [Art & Design](./categories/art-and-design.md) | 21 |
| [Authentication & Authorization](./categories/authentication-and-authorization.md) | 103 |
| [Blockchain](./categories/blockchain.md) | 89 |
| [Books](./categories/books.md) | 52 |
| [Business](./categories/business.md) | 973 |
| [Calendar](./categories/calendar.md) | 17 |
| [Cloud Storage & File Sharing](./categories/cloud-storage-and-file-sharing.md) | 398 |
| [Continuous Integration](./categories/continuous-integration.md) | 7 |
| [Cryptocurrency](./categories/cryptocurrency.md) | 298 |
| [Currency Exchange](./categories/currency-exchange.md) | 44 |
| [Data Validation](./categories/data-validation.md) | 13 |
| [Development](./categories/development.md) | 2209 |
| [Dictionaries](./categories/dictionaries.md) | 11 |
| [Documents & Productivity](./categories/documents-and-productivity.md) | 173 |
| [Email](./categories/email.md) | 275 |
| [Entertainment](./categories/entertainment.md) | 188 |
| [Environment](./categories/environment.md) | 55 |
| [Events](./categories/events.md) | 104 |
| [Finance](./categories/finance.md) | 1535 |
| [Food & Drink](./categories/food-and-drink.md) | 87 |
| [Games & Comics](./categories/games-and-comics.md) | 269 |
| [Geocoding](./categories/geocoding.md) | 582 |
| [Government](./categories/government.md) | 354 |
| [Health](./categories/health.md) | 195 |
| [Jobs](./categories/jobs.md) | 106 |
| [Machine Learning](./categories/machine-learning.md) | 251 |
| [Music](./categories/music.md) | 216 |
| [News](./categories/news.md) | 55 |
| [Open Data](./categories/open-data.md) | 969 |
| [Open Source Projects](./categories/open-source-projects.md) | 45 |
| [Other](./categories/other.md) | 1496 |
| [Patent](./categories/patent.md) | 4 |
| [Personality](./categories/personality.md) | 25 |
| [Phone](./categories/phone.md) | 290 |
| [Photography](./categories/photography.md) | 316 |
| [Podcasts](./categories/podcasts.md) | 7 |
| [Programming](./categories/programming.md) | 9 |
| [Science & Math](./categories/science-and-math.md) | 334 |
| [Security](./categories/security.md) | 339 |
| [Shopping](./categories/shopping.md) | 507 |
| [Social](./categories/social.md) | 755 |
| [Sports & Fitness](./categories/sports-and-fitness.md) | 273 |
| [Test Data](./categories/test-data.md) | 72 |
| [Text Analysis](./categories/text-analysis.md) | 24 |
| [Tracking](./categories/tracking.md) | 278 |
| [Transportation](./categories/transportation.md) | 558 |
| [URL Shorteners](./categories/url-shorteners.md) | 16 |
| [Vehicle](./categories/vehicle.md) | 8 |
| [Video](./categories/video.md) | 300 |
| [Weather](./categories/weather.md) | 173 |

---

## Want to add an API?

### Option 1: Pull Request

Edit [`db/resources.json`](./db/resources.json) and submit a pull request. See the [Contributing Guide](CONTRIBUTING.md).

**Required fields:**
- `API Name` - Name of the API (don't end with "API")
- `Documentation Link` - URL to API documentation

**Optional fields:**
- `Description` - What the API does (can be empty)
- `Category` - One of the categories above
- `Auth` - `apiKey`, `OAuth`, `Bearer`, or empty
- `HTTPS` - `true`, `false`, or empty
- `Cors` - `yes`, `no`, or empty
- `Pricing` - `free`, `freemium`, `paid`, or empty

### Option 2: Via Website

Visit [findapis.com](https://findapis.com) and click **"Suggest an API"**.

<div align="center">
    <img src="./assets/add-api-screenshot.jpg" alt="Suggest an API on findapis.com" width="600">
</div>

---

*Source of truth: [`db/resources.json`](./db/resources.json). Syncs bidirectionally with [Supabase](https://supabase.com).*
