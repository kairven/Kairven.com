# Kairven website

The site is in [`kairven-portfolio/`](./kairven-portfolio/), built with React and Vite.

Install dependencies once, then use the root scripts:

```sh
npm --prefix kairven-portfolio install
npm run dev
npm run lint
npm run build
npm run preview
```

The development server uses port **5173** and the production preview uses **4173**.

## Production launch status: blocked

This repository is not deployed. The canonical origin is `https://kairven.netlify.app`. Before launch, connect the domain to a selected production host and verify HTTPS, a permanent `www` to apex redirect, deep-link routing, the favicon, privacy and terms pages, the 404 page, sitemap and robots file.

The public `/_redirects` file contains the legacy `/privacy` redirect in Netlify format. Configure the equivalent permanent redirect if another host is selected. Host-level security headers, access/error logs, critical-failure alerts, backups and rollback also depend on the production provider, which is not specified here.

## Security and operations boundary

This project is a static website. It has no API, user accounts, database, server-side form handler, analytics provider or monitoring service. The contact form validates fields in the browser and prepares an email draft; it does not send or store a submission. Browser checks and the honeypot are not a substitute for backend validation, rate limiting, spam controls, access policies, logging or alerting. Supabase submission, row-level security and end-to-end testing remain unconfigured; do not represent them as active or collect sensitive customer data through this site.

No analytics or non-essential cookies are active because no analytics identifier was supplied. The privacy and terms pages describe the site as currently implemented and should receive owner and qualified legal review before production. No Google site-verification values are present in the repository; provide the existing values if these tags need to be restored.
