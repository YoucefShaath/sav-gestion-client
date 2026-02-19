# php-api — PHP backend for sav-gestion-client

This folder contains a lightweight PHP backend that replicates the original Next.js API routes so the React frontend can keep using `/api/*` without changes.

Quick start (local dev)

1. Start the PHP API server:
   php -S localhost:8000 -t php-api/public
2. Start the Next.js app in another terminal:
   npm run dev

Notes for cPanel

- Copy the contents of `php-api/public` to your `public_html` (or configure DocumentRoot) and keep other php-api files next to it.
- `.htaccess` is provided to route `/api/*` to `public/index.php`.
- The implementation uses PHP `mail()` by default (works on standard cPanel hosts). For SMTP/SMTP authentication install dependencies with Composer (see below).

Composer / PHPMailer (optional)

- Composer is optional. To enable SMTP via PHPMailer run in the `php-api/` folder:
  composer install
- When `SMTP_HOST` is set and `vendor/autoload.php` exists the code will prefer PHPMailer over `mail()`.

API endpoints implemented (compatible with existing frontend):

- GET/POST/PATCH/DELETE /api/tickets
- GET/POST /api/archives
- GET /api/status
- GET /api/status-history
- GET /api/suggestions
- GET /api/stats
- POST /api/send-invoice
- POST /api/demande
- POST /api/login

Files to review:

- `php-api/api/*.php` — endpoint handlers
- `php-api/src/db.php` — PDO connection
- `php-api/src/mail.php` — simple mail wrapper (uses mail())
- `php-api/src/invoice.php` — invoice HTML renderer

If you want, I can:

- Replace `mail()` with PHPMailer (composer) for SMTP
- Add Docker / supervisor scripts for production
- Port frontend pages to PHP (full-stack conversion)
