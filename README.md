# 🖥️ Site Watch

A role-based site-monitoring dashboard built as a personal learning project,
following a structured "Build → Break → Fix" software development brief.
The app lets authenticated users monitor a set of physical or digital
"sites," track sensor readings, and manage alerts — with strict
admin-versus-viewer permissions enforced at the database level.

---

## 📌 Overview

| | |
|---|---|
| **Type** | Full-stack web application |
| **Status** | In development |
| **Purpose** | Practical learning project — authentication, role-based access control, and real-time data handling |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js (App Router), React, Tailwind CSS |
| Backend | Next.js API Routes |
| Database & Auth | Supabase (PostgreSQL, Row-Level Security) |
| Deployment | Vercel — auto-deploys on every push to `master` |

---

## ✨ Features

- 🔐 **Authentication** — secure email/password signup and login via Supabase Auth
- 🛡️ **Role-based access control** — `admin` and `viewer` roles, enforced through PostgreSQL Row-Level Security policies, not just hidden UI elements
- 📊 **Dashboard** — real-time overview of all monitored sites and their current status
- ⚙️ **Site management** — admins can create, edit, and delete monitored sites
- 📈 **Readings log** — displays the most recent sensor readings per site
- 🚨 **Alerts system** — admins can review and resolve active alerts
- 📝 **Audit trail** — every alert resolution is automatically recorded in an append-only audit log for accountability

---

## 🚀 Getting Started

### 1. Clone the repository and install dependencies
```bash
git clone https://github.com/zwananilior/sitewatch.git
cd sitewatch
npm install
```

### 2. Set up Supabase
Create a free project at [supabase.com](https://supabase.com).

In the Supabase **SQL Editor**, run the schema file(s) included in this
repository to create all required tables, roles, and Row-Level Security
policies.

### 3. Configure environment variables
Create a `.env.local` file in the project root:
```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
```
Both values are available in your Supabase project under **Settings → API**.

### 4. Run the development server
```bash
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Create your first account
Sign up through the app. New accounts default to the `viewer` role.

To test admin functionality, open the Supabase **Table Editor**, locate
your row in the `profiles` table, and manually change `role` to `admin`.

---

## 🔒 Security Design

Access control is enforced in the **database layer**, not just the
frontend. Admin-only buttons in the UI are a convenience for the user —
the real protection is PostgreSQL's Row-Level Security. Even a direct
API call bypassing the interface would still be blocked from writing to
`sites`, `alert_rules`, or resolving alerts unless the requesting user
holds the `admin` role.

The `audit_log` table is **append-only by design** — no update or delete
policy exists for it, ensuring resolved-alert records cannot be altered
or removed after the fact.

---

## 🗺️ Roadmap

- [ ] Alert rules management UI (currently read-only)
- [ ] Manual reading submission form, for testing alert thresholds
- [ ] Pagination on the readings table (currently limited to 50 rows)
- [ ] Replace native browser alerts with a proper toast notification system
