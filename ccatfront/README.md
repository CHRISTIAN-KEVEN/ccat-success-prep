# CCAT Pro — Frontend

Web application for CCAT (Criteria Cognitive Aptitude Test) preparation. Built with Next.js 15, Tailwind CSS v4, and TypeScript.

## Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4 with CSS custom properties
- **Language**: TypeScript
- **Icons**: lucide-react
- **Font**: Geist (via next/font)

## Pages

| Route | Description |
|---|---|
| `/` | Homepage — hero, features, pricing, testimonials, FAQ |
| `/login` | Login / Create Account (tab switcher) |
| `/dashboard` | Performance Analytics — stats, progression chart, domain breakdown |
| `/dashboard/test` | Full-screen CCAT test simulation — 8 questions, 15-min timer |
| `/dashboard/history` | Test History — past sessions with scores and category breakdown |
| `/dashboard/settings` | Profile Settings — editable user form |

## Project Structure

```
src/
├── app/
│   ├── dashboard/
│   │   ├── history/page.tsx
│   │   ├── settings/page.tsx
│   │   ├── test/page.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── login/page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── layout/
│   │   ├── DashboardNav.tsx
│   │   ├── DashboardSidebar.tsx
│   │   └── Navbar.tsx
│   └── ui/
│       ├── Button.tsx
│       └── PricingCard.tsx
├── context/
│   └── I18nContext.tsx
└── data/
    ├── mockDashboard.ts
    ├── mockQuestions.ts
    └── locales/
        ├── en.json
        └── fr.json
```

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## i18n

English / French language switching built with React Context (no external library). Toggle available in the homepage navbar.

## Dashboard Layout

Fixed layout: header + sidebar are static, only the main content area scrolls (`overflow-y-auto`).

The test page (`/dashboard/test`) uses `fixed inset-0 z-50` to cover the full screen during a session.
