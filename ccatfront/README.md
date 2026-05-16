# CCAT Pro Frontend

Frontend for the CCAT preparation platform. Built with Next.js, React, TypeScript, and Tailwind CSS.

## Stack

- `next` 16
- `react` 19
- `typescript`
- `tailwindcss` 4
- `lucide-react`
- `framer-motion`
- `@react-oauth/google`
- `@tiptap/*`

## Features

- Marketing homepage
- Login, registration, email verification, forgot/reset password
- User dashboard with analytics, history, bookmarks, settings, and study plan
- Timed CCAT test flow
- Test review screen
- Admin area for domains, questions, and admin settings

## Routes

| Route | Description |
|---|---|
| `/` | Marketing homepage |
| `/login` | Authentication flow |
| `/dashboard` | User dashboard |
| `/dashboard/test` | Timed test session |
| `/dashboard/review/[sessionId]` | Review a submitted session |
| `/dashboard/history` | Session history |
| `/dashboard/bookmarks` | Saved questions |
| `/dashboard/study` | Study plan |
| `/dashboard/settings` | User profile and password settings |
| `/admin` | Admin dashboard |
| `/admin/domains` | Domain management |
| `/admin/questions` | Question management |
| `/admin/settings` | Admin account overview |

## Project Structure

```text
src/
├── app/
│   ├── admin/
│   ├── dashboard/
│   ├── login/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── auth/
│   ├── layout/
│   └── ui/
├── context/
├── data/
└── lib/
```

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Create your env file:

```bash
cp .env.example .env.local
```

3. Start the dev server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables

The project currently expects these variables:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

Use [`.env.example`](./.env.example) as the base template.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Deployment

Before deploying:

1. Set the production value for `NEXT_PUBLIC_API_URL`.
2. Set the production Google OAuth client in `NEXT_PUBLIC_GOOGLE_CLIENT_ID`.
3. Run `npm run build` to validate the production build.

For Vercel or similar platforms, add the same variables from `.env.example` in the project environment settings.

## Notes

- `.env.local` is ignored and should not be committed.
- `.env.example` is committed to document required variables.
- The app includes both English and French locale files, but the frontend now defaults to English.
