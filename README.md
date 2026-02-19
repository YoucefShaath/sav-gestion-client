This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Environment variables

- `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS` — configure outgoing email (used by the PHP backend). If SMTP credentials are not set in development, the application will simulate sends or log them to the console.
- `EMAIL_ON_COMPLETED` — (optional) set to `false` to disable automatic emails when a ticket status changes to **Terminé**. Defaults to enabled.
- `NEXT_PUBLIC_APP_URL` — (optional) base URL used in links inside emails (e.g. `https://example.com`). If not set, the request origin is used.

---

## PHP backend (canonical) ✅

The PHP backend in `php-api/` is now the canonical API implementation. Next.js API routes and the server-side Node helpers for email/invoice rendering have been removed — all `/api/*` requests (including outgoing email) are handled by `php-api`.

Local development:

- Start the PHP API: `npm run php:dev` (serves `http://localhost:8000`)
- Start Next.js: `npm run dev` — `next.config.mjs` rewrites `/api/*` to the PHP server during development.
- To test email delivery, POST to `/api/send-invoice` or call the PHP endpoints directly.

Deployment (cPanel): copy `php-api/public` to your `public_html` and keep the other `php-api` files next to it. `.htaccess` is provided to route `/api/*` to the PHP router.
