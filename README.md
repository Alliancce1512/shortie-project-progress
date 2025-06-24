# Shortie - URL Shortener with Statistics

Shortie is a full-stack URL shortener built with a modern frontend (via Loveable.dev), n8n backend, and PostgreSQL database. It supports shortened links, secret stat pages, daily uniques, top IPs tracking, and is fully self-hosted on a VPS with SSL.

---

## ✨ Demo

You can try to generate short links by yourself or use these pre-generated links:

- [Live Website](https://shortie.presiyangeorgiev.eu)
- [Short URL](https://shortie.presiyangeorgiev.eu/r/uqzsre)
- [Statistics URL](https://shortie.presiyangeorgiev.eu/s/1ccd40a7f6be5c1da48d)

---

## 🧰 Tech Stack

| Layer        | Tech Used                                        |
|--------------|--------------------------------------------------|
| Frontend     | [Loveable.dev](https://www.loveable.dev/)        |
| Backend      | [n8n](https://n8n.io/) workflows via webhooks    |
| Database     | PostgreSQL                                       |
| Hosting      | Self-hosted VPS (Ubuntu) with NGINX + CI/CD      |
| Deployment   | GitHub Actions + SSH Deploy                      |

---

## 🚀 Features

- URL shortening with format validation and length limits
- Secret statistics URL generation (hard to guess)
- Visit logging with IP address and `X-Forwarded-For` support
- Unique visits per day tracking
- Top 10 IPs by total opens
- Dark/light mode support with persistent theme
- Fully responsive (mobile + desktop)

---

## 🧠 Architecture Overview

- Users submit a long URL via the frontend
- Backend (n8n) generates:
  - A short URL (for redirect)
  - A secret URL (for viewing stats)
- Generated short and secret codes are stored in the `urls` table
- Visits are logged in `visits` table
- Unique IPs per day are stored in `daily_uniques`
- Frontend dynamically loads and visualizes stats

---

## 🗄️ Database Schema

### urls
| Column       | Type    | Description                      |
|--------------|---------|----------------------------------|
| id           | integer | Primary key                      |
| long_url     | text    | Original long URL                |
| short_code   | text    | Short code used in /r/ URLs      |
| secret_code  | text    | Secret code used in /s/ URLs     |
| created_at   | date    | Timestamp of creation            |

### visits
| Column       | Type    | Description                      |
|--------------|---------|----------------------------------|
| url_id       | int     | Foreign key to urls.id           |
| ip_address   | text    | IP address of visitor            |
| visited_at   | date    | When the visit occurred          |

### daily_uniques
| Column       | Type    | Description                      |
|--------------|---------|----------------------------------|
| url_id       | int     | Foreign key to urls.id           |
| ip_address   | text    | Visitor IP (unique per day)      |
| date         | date    | The date the visit occurred      |

---

## 🛠️ Database Setup

To create the necessary database tables, run the following SQL file:

```bash
psql -U <your_db_user> -d <your_db_name> -f schema.sql
```

---

## ▶️ How to Run and Use

To run and use the project locally or on your own VPS:

### 1. **Clone the repository**
```bash
git clone https://github.com/Alliancce1512/shortie-project-progress.git
cd shortie-project-progress
```

### 2. **Install dependencies**
```bash
npm install
```

### 3. **Run the development server**
```bash
npm run dev
```

The app will be available at [http://localhost:5173](http://localhost:5173).

### 4. **Production Build**
```bash
npm run build
```

Then deploy the `dist/` folder to your server (e.g. `/var/www/shortie`)  
CI/CD is already preconfigured via **GitHub Actions + SSH**.

---

## 🔧 Backend (n8n) Workflows (Reference)

The backend logic is implemented via **n8n**, a visual automation tool that acts as a logic layer for link generation, redirection, tracking, and stats. The production instance is self-hosted and not publicly available for security reasons.

> ℹ️ Even though the backend isn't exposed, the system is fully testable via live demo links and well-documented endpoints.

### ✅ Active Workflows

| Workflow               | Method | Path                                       | Purpose                                     |
|------------------------|--------|--------------------------------------------|---------------------------------------------|
| Create Short URL       | POST   | `/shortie/shorten-url`                     | Receives long URL, returns short & stat URLs |
| Redirect to Long URL   | GET    | `/shortie/redirect/:shortCode`             | Logs IP, adds visit, and redirects           |
| Secret Page Redirect   | GET    | `/shortie/stats/:secretCode`               | Redirects to frontend stats page             |
| Return Stats JSON      | GET    | `/shortie/stats/:secretUrl`                | Returns top IPs + daily visits in JSON       |

### 📥 Request / Response (Create URL)

**POST** `/shortie/shorten-url`
```json
{
  "longUrl": "https://example.com"
}
```

**Response:**
```json
{
  "shortUrl": "https://shortie.presiyangeorgiev.eu/r/abc123",
  "secretUrl": "https://shortie.presiyangeorgiev.eu/s/1ccd40a7f6be5c1da48d"
}
```

### 📊 Response (Stats JSON)

**GET** `/shortie/stats/:secretUrl`
```json
[
  {
    "dailyVisits": [
      { "date": "2025-06-23", "count": "2" },
      { "date": "2025-06-22", "count": "2" }
    ],
    "topIps": [
      { "ip": "62.73.73.198", "count": "2" },
      { "ip": "62.73.73.197", "count": "1" }
    ]
  }
]
```

---

## 🔐 Code Generation & Security

### Short Code (`/r/<shortCode>`)
- Generated using a short random alphanumeric string:
  ```js
  Math.random().toString(36).substring(2, 8)
  ```
- Used for redirecting to the original URL
- Example: `https://shortie.presiyangeorgiev.eu/r/uqzsre`

### Secret Code (`/s/<secretCode>`)
- Generated with a hashed SHA256 of the long URL + random salt:
  ```js
  SHA256(longUrl + '-' + Math.random()) → HEX
  ```
- First 20 characters of the hash are taken for brevity:
  ```js
  secretCode = $input.first().json.secretCode.substring(0, 20)
  ```
- This guarantees that even if the same URL is shortened by different users, they get different stats links
- Example: `https://shortie.presiyangeorgiev.eu/s/1ccd40a7f6be5c1da48d`

### SSL Certificate
- All endpoints are secured via HTTPS
- Managed by Let's Encrypt using NGINX configuration on a VPS

### IP Tracking
- IPs are recorded via `X-Forwarded-For` header for accuracy behind proxies
- Tracked for:
  - Total visits
  - Daily unique visits (by IP + day)
  - Top IPs accessing each link

---

## 🚧 Known Limitations

- The backend (n8n) is self-hosted and not accessible for direct public usage
- No authentication or rate limiting implemented
- No UI for managing previously created links beyond session cache

---

## 🔮 Future Improvements

- Rebuild backend in Node.js/Express or NestJS for full-stack control
- Add pagination and filtering for large-scale analytics
- Save short + secret links in browser localStorage or user profiles
- Add automated unit and integration tests
- Add multi-language support
- Add admin panel to moderate or manage all shortened URLs

---

## 📬 Contact

Made by [Presiyan Georgiev](https://www.linkedin.com/in/presiyan-georgiev/)
