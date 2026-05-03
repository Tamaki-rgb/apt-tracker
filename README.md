# APT — Application Budget Tracker

> A bilingual (RU/EN) web app for students tracking expenses during the study abroad application process.

**Live demo:** `your-link.vercel.app`

---

## The Problem

Applying to universities abroad (USA, Europe) involves dozens of hidden costs — standardized tests, application fees, document translations, visa fees. Most students have no structured way to track these expenses, leading to budget overruns or missed payments at critical moments.

## The Solution

APT is a lightweight, privacy-first Progressive Web App that helps students:
- Set a total application budget
- Log real expenses by category
- Track planned vs. actual spending
- Work fully offline — no account, no server, no data collection

## Features

- 🌐 **Bilingual** — full Russian / English interface, switchable in one tap
- 📊 **Dashboard** — visual budget progress with category breakdown
- 📋 **Planned costs** — pre-loaded with typical study abroad expenses (SAT, IELTS, app fees, CSS Profile, translations)
- 🏷 **Editable categories** — rename, recolor, and change icons to match your workflow
- 📱 **PWA** — installable on any phone as a home screen app, works offline
- 🔒 **Privacy-first** — all data stored locally on device via localStorage, zero backend

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 |
| Build tool | Vite 5 |
| PWA | vite-plugin-pwa + Workbox |
| Styling | Inline CSS (zero dependencies) |
| Storage | localStorage (client-side only) |
| Deployment | Vercel |

## Getting Started

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/apt-tracker.git
cd apt-tracker

# Install dependencies
npm install

# Run in development
npm run dev

# Build for production
npm run build
```

## Motivation

I built this tool for myself — a 10th-grade student from Kazakhstan preparing to apply to US and European universities for Fall 2026. The application process involves significant and often unpredictable costs. I wanted a simple tool I could share with other students going through the same process.

---

## Roadmap

- [ ] Export to CSV / PDF summary
- [ ] Multi-currency conversion (live rates)
- [ ] Shared budget mode (for families)
- [ ] Deadline tracker integration

---

## License

MIT — free to use, fork, and build on.

---

*Built by [Your Name] · Kazakhstan · 2025*
