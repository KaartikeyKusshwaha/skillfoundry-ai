# SkillFoundry AI

Standalone Next.js prototype for the product development internship assignment.

## Setup

Requirements: Node.js 20.9+ and pnpm (the exact pnpm version is in `package.json`).

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000. Production: `pnpm build`, then `pnpm start`.

## Approach

Built with Next.js App Router, React, TypeScript, Lucide icons and responsive CSS. The interface uses the existing serif/sans fonts, the R1 palette, keyboard focus styles and reduced-motion support. The main page is the root route, so the project can be deployed independently.

## Routes and features

- `/`: programmes, learning path, syllabus download and two-step enquiry dialog.
- `/privacy`: prototype enquiry data notice.
- `/api/leads`: validates enquiry steps and optionally forwards to `LEADS_WEBHOOK_URL`.

Copy `.env.example` to `.env.local` only if configuring optional lead forwarding. Enquiries are temporary in-memory prototype data; no payment, confirmed seat or email delivery is provided. Programme details are sample content.

## Checks

```bash
pnpm lint
pnpm exec tsc --noEmit
pnpm exec playwright install chromium
pnpm test:e2e
pnpm build
```

The browser suite includes axe accessibility scans and the relevant interaction journey. Education API failure responses are simulated in its journey test.

## Deployment

Import this repository into Vercel as a Next.js project. Use the repository root with `pnpm install` and `pnpm build`. The AI carousel is a separate assignment deliverable.
