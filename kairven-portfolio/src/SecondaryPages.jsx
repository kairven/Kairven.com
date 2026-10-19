import { ArrowRight, Check } from "lucide-react";
import { BUSINESS_DESCRIPTION, DISAMBIGUATION, EMAIL, services, WHATSAPP_URL } from "./siteData.js";
import { Eyebrow, FAQList, Footer, Header, PrimaryCTA } from "./App.jsx";

const blogSections = [
  { id: "map-enquiry-path", title: "How do you map the enquiry path?" },
  { id: "define-first-response", title: "What makes a useful first response?" },
  { id: "plan-follow-up", title: "How should booking follow-up work?" },
  { id: "measure-without-guessing", title: "How can you check whether the process works?" },
  { id: "continue-the-conversation", title: "Where can you learn more about Kairven?" },
];

function AboutPage() {
  return (
    <>
      <Header currentPage="about" />
      <main id="main-content" className="inner-page">
        <section className="page-intro">
          <Eyebrow>About Kairven · Kanpur, India</Eyebrow>
          <h1>Digital infrastructure<br /><em>for service businesses.</em></h1>
          <p>{BUSINESS_DESCRIPTION}</p>
        </section>
        <section className="content-card about-copy">
          <h2>What is Kairven?</h2>
          <p>Kairven is a business consulting and services company based in Kanpur, India, founded in October 2021 by Mohd Sameer Khan. It designs and deploys websites, search visibility, lead capture, CRM and enquiry-response systems for service businesses. Kairven works remotely with clients worldwide on a written scope. {DISAMBIGUATION}</p>
          <h2>Who is behind Kairven?</h2>
          <p>Mohd Sameer Khan is Kairven’s founder. The business is based in Kanpur, Uttar Pradesh, India, and serves clients remotely.</p>
          <h2>How Kairven works</h2>
          <p>Projects begin by mapping what needs to change and agreeing deliverables in writing. A typical agreed setup takes about seven days once required access and materials are ready. The schedule, responsibilities and any third-party requirements are confirmed in writing before work begins.</p>
          <p><strong>Business registration:</strong> Proprietorship, Udyam-registered Micro enterprise.</p>
          <p><strong>Public contact:</strong> <a href={`mailto:${EMAIL}`}>{EMAIL}</a> · <a href="tel:+917398948772">+91 73989 48772</a> · <a href={WHATSAPP_URL}>WhatsApp</a></p>
        </section>
        <div className="contact-ribbon">
          <div><Eyebrow>Make the next step clearer</Eyebrow><p>Start with your current enquiry path.</p></div>
          <PrimaryCTA />
        </div>
      </main>
      <Footer />
    </>
  );
}

function FAQPage() {
  return (
    <>
      <Header currentPage="faq" />
      <main id="main-content" className="inner-page">
        <section className="page-intro">
          <Eyebrow>Project questions · Kairven, Kanpur</Eyebrow>
          <h1>Clear answers<br /><em>before you begin.</em></h1>
          <p>Information on Kairven’s services, process, project timing and enquiry handling.</p>
        </section>
        <FAQList />
        <div className="contact-ribbon">
          <div><Eyebrow>Have another question?</Eyebrow><p>Share the part that is unclear.</p></div>
          <PrimaryCTA />
        </div>
      </main>
      <Footer />
    </>
  );
}

function ServicePage({ service }) {
  return (
    <>
      <Header currentPage="services" />
      <main id="main-content" className="inner-page service-page">
        <section className="page-intro">
          <Eyebrow>Service {service.number} / Kairven · Kanpur, India</Eyebrow>
          <h1>{service.title}</h1>
          <p>{service.description}</p>
        </section>
        <div className="content-card service-page__card">
          <p>{service.description} Each project starts with the channels, goals and existing process you share, then follows a written scope agreed before implementation.</p>
          <ul>
            <li><Check size={16} aria-hidden="true" /> Clearer customer journey</li>
            <li><Check size={16} aria-hidden="true" /> Built around your actual workflow</li>
            <li><Check size={16} aria-hidden="true" /> Human-friendly, practical next steps</li>
            <li><Check size={16} aria-hidden="true" /> Typical setup in about seven days*</li>
          </ul>
          <p>Pricing is custom and depends on your enquiry channels, volume, tools and agreed deliverables. No fixed price or performance outcome is promised.</p>
        </div>
        <div className="contact-ribbon">
          <div><Eyebrow>Start with your enquiry path</Eyebrow><p>We'll map the gap together.</p></div>
          <PrimaryCTA />
        </div>
        <p className="related-links">Also see <a href="/blog/">the enquiry follow-up guide</a>, <a href="/faq/">frequently asked questions</a> and <a href="/privacy-policy/">the privacy policy</a>.</p>
      </main>
      <Footer />
    </>
  );
}

function BlogPage() {
  return (
    <>
      <Header currentPage="blog" />
      <main id="main-content" className="inner-page blog-page">
        <article>
          <header className="page-intro blog-header">
            <Eyebrow>Field notes · Enquiry operations</Eyebrow>
            <h1>What happens after<br /><em>the first enquiry?</em></h1>
            <p>A practical way to map response ownership and booking follow-up for a service business, before adding automation.</p>
            <div className="article-dates">
              <span><strong>Published:</strong> <time dateTime="2026-10-16">16 October 2026</time></span>
              <span><strong>Updated:</strong> <time dateTime="2026-10-17">17 October 2026</time></span>
              <span><strong>By:</strong> Mohd Sameer Khan, Kairven</span>
            </div>
          </header>
          <div className="content-card blog-copy">
            <p className="tldr"><strong>TL;DR:</strong> List every enquiry channel, decide who owns the first reply, write down what happens when the team is unavailable, and track whether the enquiry reached a useful next step. Automate only the parts that are repeatable and tested.</p>
            <nav className="table-of-contents" aria-label="Article contents">
              <strong>In this guide</strong>
              <ol>{blogSections.map(({ id, title }) => <li key={id}><a href={`#${id}`}>{title}</a></li>)}</ol>
            </nav>
            <p>For a clinic, coach, agency or home-service business, the first message is only one moment in a longer path. A clear response process helps the team know what arrived, who is responsible and what the customer should expect next. The steps below are a starting point, not a promise that every enquiry will become a booking.</p>
            <h2 id="map-enquiry-path">{blogSections[0].title}</h2>
            <p>Start with a simple list of the places enquiries arrive: a website form, phone call, messaging app, social profile or referral. For each channel, record where the message goes, who can see it, and how the team currently marks it as handled. This makes gaps visible before a new tool is introduced.</p>
            <p>Keep the map factual. If messages are checked only during staffed hours, write that down. If two people share follow-up, define how ownership transfers. Avoid assuming an integration exists until someone has tested it with the account and permissions the business will actually use.</p>
            <h2 id="define-first-response">{blogSections[1].title}</h2>
            <p>A useful first response acknowledges what the person asked, gives an honest expectation for the next step and avoids pretending that a human has reviewed details when they have not. Agree the language and timing with the team. Automated replies should be distinguishable from a personal consultation or confirmed booking.</p>
            <p>For sensitive or urgent requests, route people to the appropriate staffed contact or existing emergency guidance. A website workflow should not imply that an unattended inbox is monitored continuously.</p>
            <h2 id="plan-follow-up">{blogSections[2].title}</h2>
            <p>Write down the event that should trigger a follow-up, the person or role responsible, the permitted channel and when the enquiry should be marked complete. A follow-up can be a reminder for a team member rather than an automatic message. Use the least complicated method that the team will reliably maintain.</p>
            <p>Define what happens outside working hours before enabling automated acknowledgements. The next-business-period plan should match real staffing, channel rules and customer expectations. If a tool or connection is unavailable, document a manual fallback instead of silently dropping the enquiry.</p>
            <h2 id="measure-without-guessing">{blogSections[3].title}</h2>
            <p>Check a small sample of enquiries with the people who handle them. Confirm that each message was visible, that ownership was clear, and that the next step matched what the customer was told. Track missing handoffs and duplicate work, not only response counts.</p>
            <p>Before launch, test the normal path, an after-hours path and a failed-connection path. Record what was tested, who owns the system and where the team can get help. Revisit the process when services, staff or enquiry channels change.</p>
            <h2 id="continue-the-conversation">{blogSections[4].title}</h2>
            <p>Kairven builds websites, search visibility and enquiry-response systems for clinics, dental practices and home-service businesses. A typical agreed setup takes about seven days after required access and materials are ready. Read <a href="/faq/">the project FAQs</a>, learn <a href="/about/">who is behind Kairven</a>, review <a href="/privacy-policy/">the privacy policy</a>, or use the form to <a href="/#contact">share your enquiry path</a>.</p>
          </div>
        </article>
        <div className="contact-ribbon">
          <div><Eyebrow>Make the enquiry path clearer</Eyebrow><p>Start with what happens today.</p></div>
          <PrimaryCTA />
        </div>
      </main>
      <Footer />
    </>
  );
}

function PrivacyPage() {
  return (
    <>
      <Header currentPage="privacy" />
      <main id="main-content" className="inner-page legal-page">
        <section className="page-intro">
          <Eyebrow>Last reviewed: 17 October 2026</Eyebrow>
          <h1>Privacy<br /><em>policy.</em></h1>
          <p>How this website handles information when you browse or choose to contact Kairven.</p>
        </section>
        <article className="content-card legal-copy">
          <h2>Who is responsible?</h2>
          <p>This website is operated by Kairven, a proprietorship based in Kanpur, Uttar Pradesh, India. For privacy questions, contact <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.</p>
          <h2>Information you enter</h2>
          <p>The enquiry form asks for your name, email address and project message, with an optional package choice. The form checks these fields in your browser and prepares an email draft on your device. It does not submit or store the contents on this website. The message is shared with Kairven only if you open and send the draft using your email provider.</p>
          <h2>Hosting and technical data</h2>
          <p>The website host may process technical request information, such as IP address, browser details and requested pages, to deliver and protect the site. The host's retention and access controls depend on the production hosting provider.</p>
          <h2>Analytics and cookies</h2>
          <p>This website does not currently include analytics, advertising pixels or non-essential tracking cookies.</p>
          <h2>Storage and service providers</h2>
          <p>This static website does not currently send enquiries to Supabase or another website database. If you email Kairven, your email provider and Kairven's mailbox provider process that correspondence under their own terms.</p>
          <h2>Your choices and deletion requests</h2>
          <p>You may choose not to submit the email draft. To ask about or request deletion of enquiry correspondence you have sent to Kairven, email <a href={`mailto:${EMAIL}`}>{EMAIL}</a> with enough information to locate it. Kairven will respond subject to applicable legal obligations.</p>
          <h2>Changes</h2>
          <p>This notice describes the website as it currently operates. It should be updated if a backend form, database, analytics tool or other data collection is added.</p>
          <h2>Governing law</h2>
          <p>This notice is provided for a business based in India. Applicable Indian law governs matters relating to this website, subject to any mandatory legal protections.</p>
          <p>Related: <a href="/terms/">website terms</a>, <a href="/#contact">contact Kairven</a> and <a href="/blog/">the enquiry follow-up guide</a>.</p>
        </article>
      </main>
      <Footer />
    </>
  );
}

function TermsPage() {
  return (
    <>
      <Header currentPage="terms" />
      <main id="main-content" className="inner-page legal-page">
        <section className="page-intro">
          <Eyebrow>Last reviewed: 17 October 2026</Eyebrow>
          <h1>Website terms<br /><em>and conditions.</em></h1>
          <p>Plain-English conditions for browsing this website and enquiring about Kairven services.</p>
        </section>
        <article className="content-card legal-copy">
          <h2>Website information</h2>
          <p>This website provides general information about Kairven, its services and selected work or concepts. It is not a proposal, offer, professional advice or binding service agreement.</p>
          <h2>Project scope and fees</h2>
          <p>Pricing is by custom quote. A project begins only after the parties agree in writing on its scope, deliverables, fees, responsibilities, schedule and any applicable third-party costs.</p>
          <h2>Service expectations</h2>
          <p>A typical agreed setup takes about seven days after required access and materials are ready. Timelines for CRM, automations, integrations and multi-location work depend on the agreed scope and third-party systems. Search rankings, enquiry volume, bookings and revenue depend on factors outside Kairven's control; no fixed outcome is promised.</p>
          <h2>External links and concepts</h2>
          <p>External links lead to services and previews operated by others. Availability and content can change. Items identified as concepts are not presented as confirmed client engagements or client results.</p>
          <h2>Acceptable use</h2>
          <p>Do not misuse this website, interfere with its availability or use it to submit unlawful content. Contact details should be used for genuine business enquiries.</p>
          <h2>Governing law</h2>
          <p>These website terms are governed by the laws of India. Any project-specific terms must be agreed separately in writing. If a provision is unenforceable, the remaining terms continue to apply to the extent permitted by law.</p>
          <p>Questions? Email <a href={`mailto:${EMAIL}`}>{EMAIL}</a>. See also the <a href="/privacy-policy/">privacy policy</a>.</p>
        </article>
      </main>
      <Footer />
    </>
  );
}

function NotFoundPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="error-page">
        <Eyebrow>404 / Page not found</Eyebrow>
        <h1>This address does not lead to a page.</h1>
        <p>Try the Kairven home page or tell us where you expected to go.</p>
        <div className="error-page__actions">
          <a className="button button--cream" href="/">Return home <ArrowRight size={15} aria-hidden="true" /></a>
          <PrimaryCTA />
        </div>
      </main>
      <Footer />
    </>
  );
}

export function SecondaryPages({ path }) {
  const serviceSlug = path.startsWith("/services/") ? path.slice("/services/".length) : "";
  const service = services.find((item) => item.slug === serviceSlug);

  if (path === "/about") return <AboutPage />;
  if (path === "/faq") return <FAQPage />;
  if (path === "/blog") return <BlogPage />;
  if (path === "/privacy-policy") return <PrivacyPage />;
  if (path === "/terms") return <TermsPage />;
  if (service) return <ServicePage service={service} />;
  return <NotFoundPage />;
}
