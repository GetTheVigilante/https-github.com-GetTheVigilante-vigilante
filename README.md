# The Vigilante — Full-Service Family Protection

**The Vigilante** is a React/TypeScript web app that uses AI to protect every member of the family from scams, fraud, and online predators — across email, SMS, phone calls, children's chat platforms, and personal devices.

---

## What It Does

### AI Scam Checker
Paste any message — email, SMS, or phone call transcript — and the AI engine analyzes it for scam indicators. Results include a verdict (safe / suspicious / scam), a confidence score, identified red flags, safe signals, scam type classification, and recommended actions. Logged-in users can save their check history.

### Email Vigilante
Connect a Gmail, Outlook, Yahoo, or AOL account to automatically scan incoming emails for phishing, impersonation, and fraud. Flagged emails are displayed with threat level, red flags, and one-click reporting.

### SMS Vigilante
Scans text messages for common SMS scam patterns — package delivery phishing, bank alerts, lottery fraud, tech support scams, and more. Users can block senders and report threats directly from the interface.

### Call Vigilante
Real-time phone call monitoring that transcribes the conversation and flags suspicious lines as they happen (e.g., IRS impersonation, gift-card demands, isolation tactics, arrest threats). Includes a mock call demo and a call history log with per-call threat summaries.

### Child Shield Dashboard
Parents add children by name and age, then select which platforms to monitor (Roblox, Fortnite, Minecraft, Discord, Instagram, TikTok, Snapchat, YouTube, etc.). The AI scans conversations for grooming phrases, inappropriate content, and stranger-danger signals, generating flagged alerts with threat scores and recommended parental actions.

### Device Shield
Enroll family members' phones, tablets, laptops, and desktops. Per-device monitoring levels (full, metadata, keywords, or off) cover end-to-end encrypted apps like Signal, WhatsApp, and iMessage using on-device scanning so no private content leaves the device. Each family member must give explicit consent before monitoring begins.

### Community Scam Map
An interactive Leaflet map showing crowd-sourced scam reports pinned by location. Users set their home area (city/state/zip) and see nearby incidents color-coded by scam type. A sidebar lists recent reports with filters by category.

### Active Scam Alerts
A live feed of curated, severity-rated scam alerts (critical / high / medium) targeting the local community — e.g., AI voice-clone scams, fake Medicare enrollment calls, package-delivery phishing.

### Scam Types Grid & Quick Tips
Educational panels covering the most common scam categories with concise descriptions and actionable avoidance tips.

### Protection Steps & Scam Quiz
Step-by-step onboarding guide for activating each protection feature, plus an interactive quiz that tests users' ability to spot scam tactics in real-world scenarios.

### Family Toolkit
A practical guide for parents and caregivers: how to start conversations about online safety, set up device protections, enable email/call/SMS monitoring for seniors and kids, and configure parental controls on gaming platforms.

### Report a Scam Form
Users submit scam reports (type, contact method, description, date, financial loss) which are stored in Supabase and surfaced on the Community Scam Map.

### Resource Library
Curated links and downloadable guides covering identity theft, senior fraud, child online safety, and financial recovery after a scam.

### Weekly Protection Reports
Generates a weekly digest of emails scanned, calls monitored, messages checked, and scams blocked. Users can configure the report delivery day and opt into email notifications.

### Profile Dashboard
Authenticated users manage their display name, phone number, location, guardian settings (alert level, auto-scan toggles), and view lifetime protection stats and scam-check history.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build | Vite |
| Styling | Tailwind CSS + shadcn/ui (Radix UI primitives) |
| Backend / Auth | Supabase (PostgreSQL + Auth) |
| State / Data fetching | TanStack Query |
| Routing | React Router v6 |
| Maps | Leaflet |
| Charts | Recharts |
| Mobile | Capacitor (iOS/Android packaging) |
| Deployment | Netlify / Vercel |

---

## Getting Started

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

Type-check without emitting:

```bash
npm run type-check
```

A Supabase project is required. Set your Supabase URL and anon key in the environment (see `src/lib/supabase-client.ts`).
