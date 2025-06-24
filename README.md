# 🔗 Shortie — URL Shortener App

This is a web application built as part of a technical interview task for Progress. It allows users to shorten long URLs, track their usage, and view access statistics through a secret page.

---

## ✨ Demo

You can try to generate short links by yourself or use these pre-generated links:

- 🔹 [Website](https://shortie.presiyangeorgiev.eu)

- 🔸 [Short URL](https://shortie.presiyangeorgiev.eu/r/uqzsre)
- 🔹 [Statistics URL](https://shortie.presiyangeorgiev.eu/s/1ccd40a7f6be5c1da48d)

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

- ✅ URL shortening with format validation and length limits
- ✅ Secret statistics URL generation (hard to guess)
- ✅ Visit logging with IP address and `X-Forwarded-For` support
- ✅ Unique visits per day tracking
- ✅ Top 10 IPs by total opens
- ✅ JSON API + frontend visualization
- ✅ Fully responsive (mobile + desktop)
- ✅ Dark/light mode support with persistent theme

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

## 📬 Contact

Made by [Presiyan Georgiev](https://presiyangeorgiev.eu)
