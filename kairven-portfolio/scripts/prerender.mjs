import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createElement, StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { createServer } from "vite";
import { HOME_METADATA, ROUTE_METADATA } from "../src/routeMetadata.js";

const origin = (process.env.SITE_URL || "https://kairven.github.io").replace(/\/+$/, "");
const outputDirectory = new URL("../dist/", import.meta.url);
const routes = [["/", HOME_METADATA], ...Object.entries(ROUTE_METADATA)];
const location = {
  "@type": "PostalAddress",
  addressLocality: "Kanpur",
  addressRegion: "Uttar Pradesh",
  addressCountry: "IN",
};
const areaServed = ["IN", "GB", "US", "AU"].map((country) => ({
  "@type": "Country",
  name: country,
}));

function escapeHtml(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function createStructuredData(path, metadata, services, packages, faqs, socialLinks) {
  const organizationId = `${origin}/#organization`;
  const serviceId = `${origin}/#professional-service`;
  const websiteId = `${origin}/#website`;
  const pageUrl = `${origin}${metadata.path}`;
  const description = "Kairven is a business consulting firm in Kanpur, India, building websites, search visibility and enquiry-response systems for clinics, dental practices and home-service businesses.";
  const sameAs = socialLinks
    .filter(({ name }) => name !== "Email" && name !== "WhatsApp")
    .map(({ href }) => href);
  const graph = [
    {
      "@type": "Organization",
      "@id": organizationId,
      name: "Kairven",
      alternateName: "Kairven Consulting",
      url: `${origin}/`,
      logo: `${origin}/favicon.svg`,
      description,
      disambiguatingDescription: "Business consulting and services firm in Kanpur, India. Not related to any anime or fan-film channel named Kairven.",
      foundingDate: "2021-10",
      founder: { "@type": "Person", name: "Mohd Sameer Khan" },
      address: location,
      email: "kairvenhq@gmail.com",
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "Business enquiries",
        email: "kairvenhq@gmail.com",
      },
      sameAs,
    },
    {
      "@type": "ProfessionalService",
      "@id": serviceId,
      name: "Kairven",
      url: `${origin}/`,
      image: `${origin}/social-preview.png`,
      description,
      address: location,
      areaServed,
      founder: { "@type": "Person", name: "Mohd Sameer Khan" },
      parentOrganization: { "@id": organizationId },
      sameAs,
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Kairven digital infrastructure services and packages",
        itemListElement: [
          ...services.map((service, index) => ({
          "@type": "Offer",
          position: index + 1,
          itemOffered: {
            "@type": "Service",
            "@id": `${origin}/services/${service.slug}/#service`,
            name: service.name,
            description: service.description,
            provider: { "@id": serviceId },
            url: `${origin}/services/${service.slug}/`,
          },
          })),
          ...packages.map((item, index) => ({
            "@type": "Offer",
            position: services.length + index + 1,
            itemOffered: {
              "@type": "Service",
              name: item.name,
              description: item.description,
              provider: { "@id": serviceId },
              url: `${origin}/#packages`,
            },
          })),
        ],
      },
    },
    {
      "@type": "WebSite",
      "@id": websiteId,
      url: `${origin}/`,
      name: "Kairven",
      description,
      publisher: { "@id": organizationId },
      inLanguage: "en",
    },
    {
      "@type": "WebPage",
      "@id": `${pageUrl}#webpage`,
      url: pageUrl,
      name: metadata.title,
      description: metadata.description,
      isPartOf: { "@id": websiteId },
      inLanguage: "en",
    },
  ];

  const service = services.find((item) => path === `/services/${item.slug}`);
  if (service) {
    graph.push({
      "@type": "Service",
      "@id": `${pageUrl}#service`,
      name: service.name,
      description: service.description,
      provider: { "@id": serviceId },
      areaServed,
      url: pageUrl,
    });
  }

  if (path === "/" || path === "/faq") {
    const visibleFaqs = path === "/"
      ? faqs.filter(({ question }) => question !== "Is Kairven related to the anime channel?")
      : faqs;
    graph.push({
      "@type": "FAQPage",
      "@id": `${pageUrl}#faq`,
      url: pageUrl,
      mainEntity: visibleFaqs.map(({ question, answer }) => ({
        "@type": "Question",
        name: question,
        acceptedAnswer: { "@type": "Answer", text: answer },
      })),
    });
  }

  if (path === "/blog") {
    graph.push(
      {
        "@type": "BlogPosting",
        "@id": `${pageUrl}#article`,
        mainEntityOfPage: { "@id": `${pageUrl}#webpage` },
        headline: "What happens after the first enquiry?",
        description: metadata.description,
        datePublished: "2026-10-16",
        dateModified: "2026-10-17",
        author: { "@type": "Person", name: "Mohd Sameer Khan" },
        publisher: { "@id": organizationId },
        image: `${origin}/social-preview.png`,
        inLanguage: "en",
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumbs`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${origin}/` },
          { "@type": "ListItem", position: 2, name: "Insights", item: pageUrl },
        ],
      },
    );
  }

  return { "@context": "https://schema.org", "@graph": graph };
}

function updateHead(template, path, metadata, structuredData) {
  const canonical = `${origin}${metadata.path}`;
  const image = `${origin}/social-preview.png`;
  const replacements = [
    [/<title>.*?<\/title>/s, `<title>${escapeHtml(metadata.title)}</title>`],
    [/<meta\s+name="description"\s+content="[^"]*"\s*\/>/s, `<meta name="description" content="${escapeHtml(metadata.description)}" />`],
    [/<meta\s+name="robots"\s+content="[^"]*"\s*\/>/s, '<meta name="robots" content="index, follow" />'],
    [/<link\s+rel="canonical"\s+href="[^"]*"\s*\/>/s, `<link rel="canonical" href="${canonical}" />`],
    [/<link\s+rel="alternate"\s+hreflang="en"\s+href="[^"]*"\s*\/>/s, `<link rel="alternate" hreflang="en" href="${canonical}" />`],
    [/<link\s+rel="alternate"\s+hreflang="x-default"\s+href="[^"]*"\s*\/>/s, `<link rel="alternate" hreflang="x-default" href="${canonical}" />`],
    [/<meta\s+property="og:type"\s+content="[^"]*"\s*\/>/s, `<meta property="og:type" content="${metadata.type}" />`],
    [/<meta\s+property="og:url"\s+content="[^"]*"\s*\/>/s, `<meta property="og:url" content="${canonical}" />`],
    [/<meta\s+property="og:title"\s+content="[^"]*"\s*\/>/s, `<meta property="og:title" content="${escapeHtml(metadata.title)}" />`],
    [/<meta\s+property="og:description"\s+content="[^"]*"\s*\/>/s, `<meta property="og:description" content="${escapeHtml(metadata.description)}" />`],
    [/<meta\s+property="og:image"\s+content="[^"]*"\s*\/>/s, `<meta property="og:image" content="${image}" />`],
    [/<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/>/s, `<meta name="twitter:title" content="${escapeHtml(metadata.title)}" />`],
    [/<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/>/s, `<meta name="twitter:description" content="${escapeHtml(metadata.description)}" />`],
    [/<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/>/s, `<meta name="twitter:image" content="${image}" />`],
    [/<script\s+type="application\/ld\+json">.*?<\/script>/s, `<script type="application/ld+json">${JSON.stringify(structuredData)}</script>`],
  ];

  return replacements.reduce((html, [pattern, replacement]) => html.replace(pattern, replacement), template);
}

const server = await createServer({
  appType: "custom",
  logLevel: "error",
  server: { middlewareMode: true },
});

try {
  const [{ default: App }, { faqs, packages, services, socialLinks }, { SecondaryPages }] = await Promise.all([
    server.ssrLoadModule("/src/App.jsx"),
    server.ssrLoadModule("/src/siteData.js"),
    server.ssrLoadModule("/src/SecondaryPages.jsx"),
  ]);
  const template = await readFile(new URL("index.html", outputDirectory), "utf8");

  for (const [path, metadata] of routes) {
    const app = createElement(StrictMode, null, createElement(App, {
      pathname: path,
      RoutePagesComponent: path === "/" ? undefined : SecondaryPages,
    }));
    const markup = renderToString(app);
    const schema = createStructuredData(path, metadata, services, packages, faqs, socialLinks);
    const html = updateHead(template.replace('<div id="root"></div>', `<div id="root">${markup}</div>`), path, metadata, schema);
    const destination = path === "/"
      ? new URL("index.html", outputDirectory)
      : new URL(`${path.slice(1)}/index.html`, outputDirectory);
    await mkdir(new URL("./", destination), { recursive: true });
    await writeFile(destination, html);
  }

  const crawlerAgents = [
    "Googlebot",
    "Bingbot",
    "GPTBot",
    "OAI-SearchBot",
    "ChatGPT-User",
    "ClaudeBot",
    "Claude-SearchBot",
    "PerplexityBot",
    "Google-Extended",
    "Applebot-Extended",
  ];
  const robots = [
    "User-agent: *",
    "Allow: /",
    "Disallow: /admin",
    "Disallow: /login",
    "Disallow: /thank-you",
    "",
    ...crawlerAgents.flatMap((agent) => [
      `User-agent: ${agent}`,
      "Allow: /",
      "Disallow: /admin",
      "Disallow: /login",
      "Disallow: /thank-you",
      "",
    ]),
    `Sitemap: ${origin}/sitemap.xml`,
  ].join("\n");
  const lastmod = new Date().toISOString().slice(0, 10);
  const sitemap = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...routes.map(([, metadata]) => `  <url><loc>${origin}${metadata.path}</loc><lastmod>${lastmod}</lastmod></url>`),
    "</urlset>",
  ].join("\n");
  const llms = (await readFile(new URL("llms.txt", outputDirectory), "utf8"))
    .replaceAll("https://kairven.github.io", origin);

  await Promise.all([
    writeFile(new URL("robots.txt", outputDirectory), `${robots}\n`),
    writeFile(new URL("sitemap.xml", outputDirectory), `${sitemap}\n`),
    writeFile(new URL("llms.txt", outputDirectory), llms),
  ]);
} finally {
  await server.close();
}
