# Kairven Website

Standalone, prerendered React and Vite website for Kairven.

## Run locally

From this folder:

```sh
npm ci
npm run dev
npm run lint
npm run build
npm run preview
```

Public routes include `/about/`, `/faq/`, `/blog/`, `/privacy-policy/`, `/terms/` and four service pages under `/services/`. The production build prerenders every route and generates route-specific metadata, schema, `robots.txt`, `sitemap.xml` and `llms.txt`.

## Publish free with GitHub Pages

The included workflow publishes this project to the account-level URL `kairven.netlify.app`. It assumes the GitHub account is `kairven` and that the separate public repository is named `kairven.netlify.app`.

1. Put the contents of this folder in a new, separate `kairven.github.io` repository. Do not include `node_modules/` or `dist/`.
2. In that repository, open **Settings > Pages** and choose **GitHub Actions** as the build and deployment source.
3. Push the `main` branch. The included workflow builds and deploys the site.
4. After the site is publicly reachable, add `kairven.netlify.app` to Google Search Console as a **URL prefix** property. Verify ownership using Google's provided HTML verification file, placed in `public/` before rebuilding, or add the exact verification meta tag Google supplies.
5. Submit `https://kairven.netlify.app/sitemap.xml` in Search Console.

A Domain property requires control of a custom domain's DNS. Since this project uses a free GitHub subdomain, add the deployed site as a URL-prefix property instead. The canonical origin is selected at build time through `SITE_URL` and `VITE_SITE_URL`; the Pages workflow sets both to `kairven.netlify.app`.

## Form and data handling

The contact form validates in the browser and prepares a `mailto:` draft. This project has no server endpoint, Supabase connection, stored enquiry rows, email confirmation, server-side validation or server-side rate limit. Update the privacy page before adding any backend or analytics.
