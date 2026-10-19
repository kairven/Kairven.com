import { Component, useEffect, useRef, useState } from "react";
import {
  Activity,
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Bot,
  CalendarCheck,
  Check,
  Database,
  Globe2,
  Layers3,
  MapPin,
  Menu,
  MessageCircle,
  Search,
  Sparkles,
  Workflow,
  Wrench,
  X,
  Zap,
} from "lucide-react";
import { HOME_METADATA, ROUTE_METADATA } from "./routeMetadata.js";
import {
  BUSINESS_DESCRIPTION,
  EMAIL,
  faqs,
  infrastructureLayers,
  packages,
  portfolioProjects,
  PRIMARY_CTA,
  services,
  socialLinks,
  WHATSAPP_URL,
} from "./siteData.js";
import "./App.css";

const WEBSITE_URL = (import.meta.env.VITE_SITE_URL || "https://kairven.github.io").replace(/\/+$/, "");

function cleanContactField(value) {
  return String(value ?? "")
    .normalize("NFC")
    .replaceAll("\r\n", "\n")
    .replaceAll("\r", "\n")
    .split("\n")
    .map((line) => line.replace(/\p{Cc}/gu, ""))
    .join("\n")
    .trim();
}

function Brand({ footer = false }) {
  return (
    <a className={footer ? "brand brand--footer" : "brand"} href="/" aria-label="Kairven home">
      <span className="brand__mark" aria-hidden="true">K</span>
      <span className="brand__word">kair<span>ven</span></span>
    </a>
  );
}

export function Header({ currentPage = "home" }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScroll = useRef(0);

  useEffect(() => {
    let frame = 0;
    function updateHeader() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const currentScroll = window.scrollY;
        if (!menuOpen && currentScroll > 160 && currentScroll > lastScroll.current + 4) {
          setHidden(true);
        } else if (currentScroll < lastScroll.current - 4 || currentScroll < 80) {
          setHidden(false);
        }
        lastScroll.current = currentScroll;
      });
    }
    window.addEventListener("scroll", updateHeader, { passive: true });
    return () => {
      window.removeEventListener("scroll", updateHeader);
      cancelAnimationFrame(frame);
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={`site-header${hidden ? " is-hidden" : ""}`}>
      <div className="site-header__inner">
        <Brand />
        <nav id="site-navigation" className={`site-nav${menuOpen ? " is-open" : ""}`} aria-label="Main navigation">
          <a href="/#platform" onClick={closeMenu}>Platform</a>
          <a href="/#packages" onClick={closeMenu}>Packages</a>
          <a href="/#work" onClick={closeMenu}>Work</a>
          <a className={currentPage === "about" ? "is-active" : ""} href="/about/" onClick={closeMenu}>About</a>
          <a className={currentPage === "blog" ? "is-active" : ""} href="/blog/" onClick={closeMenu}>Insights</a>
          <a className="site-nav__cta" href="/#contact" onClick={closeMenu}>{PRIMARY_CTA}</a>
        </nav>
        <button
          className="menu-toggle"
          type="button"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls="site-navigation"
          onClick={() => setMenuOpen((value) => !value)}
        >
          {menuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
        </button>
      </div>
    </header>
  );
}

export function Eyebrow({ children, light = false }) {
  return <p className={`eyebrow${light ? " eyebrow--light" : ""}`}><span aria-hidden="true" />{children}</p>;
}

export function PrimaryCTA({ href = "/#contact", className = "button button--dark" }) {
  return <a className={className} href={href}>{PRIMARY_CTA}<ArrowUpRight size={15} aria-hidden="true" /></a>;
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__main">
        <div>
          <Brand footer />
          <p>{BUSINESS_DESCRIPTION}</p>
        </div>
        <div className="site-footer__contact">
          <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
          <a href="tel:+917398948772">+91 73989 48772</a>
          <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">WhatsApp</a>
        </div>
      </div>
      <div className="site-footer__bottom">
        <span>© {new Date().getFullYear()} Kairven · Kanpur, Uttar Pradesh, India</span>
        <nav aria-label="Footer navigation">
          <a href="/about/">About</a>
          <a href="/blog/">Insights</a>
          <a href="/faq/">FAQ</a>
          <a href="/privacy-policy/">Privacy policy</a>
          <a href="/terms/">Terms</a>
        </nav>
        <span>@kairvenhq</span>
      </div>
    </footer>
  );
}

function ContactForm() {
  const [status, setStatus] = useState("");
  const [mailHref, setMailHref] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;

    const data = new FormData(form);
    if (String(data.get("website") ?? "").trim()) {
      setMailHref("");
      setStatus(`We could not prepare this message. Please email ${EMAIL} instead.`);
      return;
    }

    const name = cleanContactField(data.get("name"));
    const email = cleanContactField(data.get("email"));
    const message = cleanContactField(data.get("message"));
    const selectedPackage = cleanContactField(data.get("package"));
    if (!name || !email || !message) {
      setMailHref("");
      setStatus("Please complete each field with non-whitespace text.");
      return;
    }

    const subject = encodeURIComponent(`${selectedPackage || "Project"} enquiry from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nPackage: ${selectedPackage || "To be discussed"}\n\nProject details:\n${message}`);
    setMailHref(`mailto:${EMAIL}?subject=${subject}&body=${body}`);
    setStatus("Your email draft is ready. Open it below to review and send; this website does not send or store the message.");
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="contact-form__trap" aria-hidden="true">
        <label htmlFor="contact-website">Leave this field empty</label>
        <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <label htmlFor="contact-name">Your name
        <input id="contact-name" name="name" type="text" autoComplete="name" maxLength={80} required />
      </label>
      <label htmlFor="contact-email">Email address
        <input id="contact-email" name="email" type="email" autoComplete="email" maxLength={254} required />
      </label>
      <label htmlFor="contact-package">Package to explore
        <select id="contact-package" name="package" defaultValue="">
          <option value="">Not sure yet</option>
          {packages.map((item) => <option key={item.name} value={item.name}>{item.name}</option>)}
        </select>
      </label>
      <label htmlFor="contact-message">What would you like to improve?
        <textarea id="contact-message" name="message" rows={4} maxLength={3000} required />
      </label>
      <p className="contact-form__privacy">Submitting prepares an email draft on your device. No message is sent to or stored by this website.</p>
      <button className="button button--dark" type="submit">Prepare enquiry email <ArrowUpRight size={15} aria-hidden="true" /></button>
      <p className="contact-form__status" role="status" aria-live="polite">{status}</p>
      {mailHref && <a className="contact-form__fallback" href={mailHref}>Open email draft to {EMAIL}</a>}
    </form>
  );
}

function ContactSection() {
  return (
    <section className="section contact-section" id="contact">
      <div>
        <Eyebrow>Have a project in mind?</Eyebrow>
        <h2>See the gap.<br /><em>Make the next step clear.</em></h2>
        <p className="contact-section__intro">Share how your business currently handles enquiries and follow-up. We will shape the conversation around your actual workflow.</p>
        <p className="contact-section__direct">Prefer email? <a href={`mailto:${EMAIL}`}>{EMAIL}</a></p>
      </div>
      <ContactForm />
    </section>
  );
}

function ShaderScene() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    let disposed = false;
    let frame = 0;
    let program;
    let buffer;
    let timeUniform;
    let resolutionUniform;
    let resizeObserver;
    let intersectionObserver;
    let isVisible = false;

    const gl = canvas.getContext("webgl", { alpha: true, antialias: false, powerPreference: "low-power" });
    if (!gl) return undefined;

    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    if (!vertexShader || !fragmentShader) return undefined;
    gl.shaderSource(vertexShader, `
      attribute vec2 aPosition;
      void main() {
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `);
    gl.shaderSource(fragmentShader, `
      precision mediump float;
      uniform vec2 uResolution;
      uniform float uTime;

      float surface(vec3 p) {
        float spin = uTime * 0.16;
        mat2 rotation = mat2(cos(spin), -sin(spin), sin(spin), cos(spin));
        p.xz = rotation * p.xz;
        float angle = atan(p.z, p.x);
        p.y += sin(angle * 3.0 + uTime * 0.28) * 0.11;
        return length(vec2(length(p.xz) - 0.64, p.y)) - 0.17;
      }

      vec3 normalAt(vec3 p) {
        vec2 e = vec2(0.0015, 0.0);
        return normalize(vec3(
          surface(p + e.xyy) - surface(p - e.xyy),
          surface(p + e.yxy) - surface(p - e.yxy),
          surface(p + e.yyx) - surface(p - e.yyx)
        ));
      }

      void main() {
        vec2 uv = (gl_FragCoord.xy / uResolution) * 2.0 - 1.0;
        uv.x *= uResolution.x / uResolution.y;
        vec3 rayOrigin = vec3(0.0, 0.0, 3.0);
        vec3 rayDirection = normalize(vec3(uv, -2.3));
        float distanceTravelled = 0.0;
        float distanceToSurface = 1.0;
        vec3 position = rayOrigin;

        for (int step = 0; step < 38; step++) {
          position = rayOrigin + rayDirection * distanceTravelled;
          distanceToSurface = surface(position);
          if (distanceToSurface < 0.001 || distanceTravelled > 7.0) break;
          distanceTravelled += distanceToSurface * 0.82;
        }

        if (distanceToSurface >= 0.002 || distanceTravelled > 7.0) {
          gl_FragColor = vec4(0.0);
          return;
        }

        vec3 normal = normalAt(position);
        vec3 lightDirection = normalize(vec3(-0.6, 0.75, 1.3));
        float diffuse = max(dot(normal, lightDirection), 0.0);
        float fresnel = pow(1.0 - max(dot(normal, -rayDirection), 0.0), 2.2);
        float bands = 0.5 + 0.5 * sin(atan(position.z, position.x) * 12.0 + uTime * 0.4);
        vec3 bronze = vec3(0.29, 0.19, 0.09);
        vec3 gold = vec3(0.91, 0.72, 0.43);
        vec3 color = mix(bronze, gold, clamp(fresnel * 0.7 + diffuse * 0.25 + bands * 0.12, 0.0, 1.0));
        gl_FragColor = vec4(color, 0.79);
      }
    `);
    gl.compileShader(vertexShader);
    gl.compileShader(fragmentShader);

    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS) || !gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
      console.error("Kairven's decorative 3D shader could not compile.", gl.getShaderInfoLog(vertexShader), gl.getShaderInfoLog(fragmentShader));
      return undefined;
    }

    program = gl.createProgram();
    if (!program) return undefined;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Kairven's decorative 3D shader could not link.", gl.getProgramInfoLog(program));
      return undefined;
    }

    buffer = gl.createBuffer();
    if (!buffer) return undefined;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    gl.useProgram(program);
    const positionAttribute = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(positionAttribute);
    gl.vertexAttribPointer(positionAttribute, 2, gl.FLOAT, false, 0, 0);
    timeUniform = gl.getUniformLocation(program, "uTime");
    resolutionUniform = gl.getUniformLocation(program, "uResolution");
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    function resize() {
      const { width, height } = canvas.getBoundingClientRect();
      if (!width || !height) return;
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.2);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(resolutionUniform, canvas.width, canvas.height);
    }

    resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    resize();

    function animate(now) {
      frame = 0;
      if (disposed || !isVisible || document.hidden) return;
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(timeUniform, now * 0.001);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      frame = requestAnimationFrame(animate);
    }

    function updateVisibility() {
      if (isVisible && !document.hidden && !frame) {
        frame = requestAnimationFrame(animate);
      } else if ((!isVisible || document.hidden) && frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    }

    intersectionObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      updateVisibility();
    });
    intersectionObserver.observe(canvas);
    document.addEventListener("visibilitychange", updateVisibility);

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      resizeObserver?.disconnect();
      intersectionObserver?.disconnect();
      document.removeEventListener("visibilitychange", updateVisibility);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
    };
  }, []);

  return <canvas ref={canvasRef} className="hero-scene" aria-hidden="true" />;
}

export function FAQList({ preview = false }) {
  const questions = preview
    ? faqs.filter(({ question }) => question !== "Is Kairven related to the anime channel?")
    : faqs;
  return (
    <div className="faq-list">
      {questions.map(({ question, answer }, index) => (
        <details className="faq-item" key={question} open={index === 0}>
          <summary><strong>{question}</strong><span className="faq-item__toggle"><ArrowDown size={17} aria-hidden="true" /></span></summary>
          <p>{answer}</p>
        </details>
      ))}
    </div>
  );
}

const infrastructureIcons = {
  website: Layers3,
  search: Search,
  ai: Bot,
  crm: Database,
  whatsapp: MessageCircle,
  automation: Zap,
  booking: CalendarCheck,
  maintenance: Wrench,
};

const systemStages = [
  { name: "Discover", tag: "SEO / AEO / GEO", headline: "Show up with context.", detail: "Make your services, locations and expertise easier for people and search systems to understand." },
  { name: "Capture", tag: "WEBSITE / FUNNEL", headline: "Turn attention into action.", detail: "Give every visitor a focused route to ask a question, request a quote or book a next step." },
  { name: "Respond", tag: "WHATSAPP / CRM", headline: "Give every lead an owner.", detail: "Route enquiries into an agreed workflow so your team can see what arrived and what happens next." },
  { name: "Continue", tag: "AUTOMATION / CARE", headline: "Keep the system moving.", detail: "Connect repeatable follow-up, bookings and maintenance to the way your business actually runs." },
];

const journeySteps = [
  { label: "01 / DISCOVER", title: "Be understood before the click.", detail: "Search foundations and clear service information give people and answer engines useful context about what you do.", motif: "signal" },
  { label: "02 / CAPTURE", title: "Make the next step obvious.", detail: "A fast website or focused funnel turns a moment of interest into a message, a lead or a booking request.", motif: "window" },
  { label: "03 / RESPOND", title: "Put every lead in motion.", detail: "WhatsApp, CRM and lead ownership bring the right enquiry to the right person with a defined next action.", motif: "route" },
  { label: "04 / GROW", title: "Build on what is working.", detail: "Automations, reporting and maintenance help your infrastructure evolve as your business and locations grow.", motif: "orbit" },
];

function SystemMap() {
  const [activeStep, setActiveStep] = useState(0);
  const activeStage = systemStages[activeStep];

  return (
    <div className="system-map" role="region" aria-label="Interactive preview of Kairven's connected digital infrastructure">
      <ShaderScene />
      <div className="system-map__chrome">
        <span className="system-map__brand"><span>K</span> KAIRVEN / SYSTEM MAP</span>
        <span className="system-map__status"><Activity size={13} aria-hidden="true" /> ARCHITECTURE PREVIEW</span>
      </div>
      <div className="system-map__body">
        <div className="system-map__stages" aria-label="Explore the system stages">
          {systemStages.map((stage, index) => (
            <button
              className={`system-map__stage${activeStep === index ? " is-active" : ""}`}
              type="button"
              aria-pressed={activeStep === index}
              onClick={() => setActiveStep(index)}
              key={stage.name}
            >
              <span>0{index + 1}</span>
              <strong>{stage.name}</strong>
              <small>{stage.tag}</small>
            </button>
          ))}
        </div>
        <div className="system-map__readout" aria-live="polite">
          <div className="system-map__readout-top"><span>ACTIVE LAYER / 0{activeStep + 1}</span><span>ILLUSTRATIVE FLOW</span></div>
          <div className="system-map__signal" aria-hidden="true">
            <span className="system-map__signal-node">DISCOVER</span><i />
            <span className="system-map__signal-node">CAPTURE</span><i />
            <span className="system-map__signal-node">RESPOND</span><i />
            <span className="system-map__signal-node">CONTINUE</span>
          </div>
          <div className="system-map__detail">
            <p>{activeStage.tag}</p>
            <h2>{activeStage.headline}</h2>
            <p>{activeStage.detail}</p>
          </div>
          <div className="system-map__footer"><span>ONE CONNECTED OPERATING LAYER</span><span>BUILT AROUND YOUR WORKFLOW <ArrowUpRight size={13} aria-hidden="true" /></span></div>
        </div>
      </div>
    </div>
  );
}

function HomePage() {
  return (
    <>
      <Header currentPage="home" />
      <main id="main-content">
        <section className="hero" id="top">
          <div className="hero__copy">
            <Eyebrow><Sparkles size={13} aria-hidden="true" /> Kanpur, India · Working worldwide</Eyebrow>
            <h1>Websites, instant replies and booking follow-up for clinics, dental and home-service businesses.</h1>
            <p className="hero__lede">
              Kairven builds done-for-you websites, search visibility and enquiry-response systems for clinics, dental practices and home-service businesses. Based in Kanpur, India, we plan around your current channels and handle setup. A typical agreed project takes about seven days once required access and materials are ready.
            </p>
            <div className="hero__actions">
              <PrimaryCTA href="#contact" />
              <a className="button button--line" href={WHATSAPP_URL} target="_blank" rel="noreferrer"><MessageCircle size={16} aria-hidden="true" /> Talk on WhatsApp</a>
            </div>
            <p className="hero__note">Clear scope, done-for-you setup and a practical handoff for your team.</p>
          </div>
          <SystemMap />
        </section>

        <section className="identity-strip" aria-label="Business facts">
          <span><Check size={15} aria-hidden="true" /> Custom-built infrastructure</span>
          <span><MapPin size={15} aria-hidden="true" /> Kanpur · Working worldwide</span>
          <span><Globe2 size={15} aria-hidden="true" /> Four tailored packages</span>
          <span><Workflow size={15} aria-hidden="true" /> Typical setup about 7 days</span>
        </section>

        <section className="section services" id="platform">
          <div className="section-heading">
            <div>
              <Eyebrow>One company. Every layer.</Eyebrow>
              <h2>Your digital infrastructure,<br /><em>without the disconnected parts.</em></h2>
            </div>
            <p>Everything your customers encounter online, and the systems your team uses behind the scenes, planned as one joined-up operation.</p>
          </div>
          <div className="infrastructure-grid">
            {infrastructureLayers.map(({ number, name, detail, icon }) => {
              const Icon = infrastructureIcons[icon];
              return (
              <article className="infrastructure-item cascade-item" key={number}>
                <div className="infrastructure-item__top"><span>{number}</span><Icon size={19} strokeWidth={1.6} aria-hidden="true" /></div>
                <h3>{name}</h3>
                <p>{detail}</p>
              </article>
              );
            })}
          </div>
          <nav className="service-page-links" aria-label="Explore Kairven services">
            {services.map((service) => (
              <a href={`/services/${service.slug}/`} key={service.slug}>
                {service.name}<ArrowUpRight size={14} aria-hidden="true" />
              </a>
            ))}
          </nav>
        </section>

        <section className="journey-section" id="journey" aria-labelledby="journey-title">
          <div className="journey-section__heading">
            <div>
              <Eyebrow>Scroll the customer journey</Eyebrow>
              <h2 id="journey-title">One journey.<br /><em>Four connected moments.</em></h2>
            </div>
            <p>From first discovery to ongoing care, each layer hands off to the next instead of leaving your customer in a dead end.</p>
          </div>
          <div className="journey-window">
            <div className="journey-rail">
              {journeySteps.map(({ label, title, detail, motif }) => (
                <article className={`journey-panel journey-panel--${motif}`} key={label}>
                  <div className="journey-panel__visual" aria-hidden="true">
                    <span className="journey-panel__visual-label">KAIRVEN / LAYER {label.slice(0, 2)}</span>
                    <div className="journey-motif"><i /><i /><i /><i /><span>K</span></div>
                    <span className="journey-panel__visual-caption">CONNECTED INFRASTRUCTURE</span>
                  </div>
                  <div className="journey-panel__copy">
                    <span>{label}</span>
                    <h3>{title}</h3>
                    <p>{detail}</p>
                    <a className="text-link" href="#packages">Explore the packages <ArrowRight size={15} aria-hidden="true" /></a>
                  </div>
                </article>
              ))}
            </div>
            <div className="journey-progress" aria-hidden="true"><span /></div>
          </div>
        </section>

        <section className="section packages-section" id="packages">
          <div className="section-heading">
            <div>
              <Eyebrow>Four ways to connect the dots</Eyebrow>
              <h2>Choose your starting point.<br /><em>Build the right system.</em></h2>
            </div>
            <p>Every package is customised around your scope, tools and team. Pricing is confirmed in writing before work begins.</p>
          </div>
          <div className="package-grid">
            {packages.map((item) => (
              <article className="package-card cascade-item" key={item.name}>
                <div className="package-card__top"><span>{item.number} / {item.marker}</span><ArrowUpRight size={17} aria-hidden="true" /></div>
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <ul>{item.includes.map((feature) => <li key={feature}><Check size={15} aria-hidden="true" />{feature}</li>)}</ul>
                <a
                  className="package-card__link"
                  href="#contact"
                  onClick={() => {
                    const packageSelect = document.getElementById("contact-package");
                    if (packageSelect) packageSelect.value = item.name;
                  }}
                >
                  Scope this package <ArrowRight size={15} aria-hidden="true" />
                </a>
              </article>
            ))}
          </div>
          <p className="package-section__note">*Kairven Web delivery begins once the scope, required content, access and 50% advance are confirmed.</p>
        </section>

        <section className="launch-terms" aria-labelledby="terms-title">
          <div className="launch-terms__intro">
            <Eyebrow light>Simple terms. Clear handoff.</Eyebrow>
            <h2 id="terms-title">50% to begin.<br /><em>50% to go live.</em></h2>
            <p>A typical agreed setup takes about seven days after required access and materials are ready. The schedule and responsibilities are confirmed in writing before work begins.</p>
          </div>
          <ol className="launch-steps">
            <li><span>01</span><strong>Confirm the scope</strong><small>Deliverables, timing and any third-party fees in writing.</small></li>
            <li><span>02</span><strong>50% advance</strong><small>Work starts once the agreed scope and advance are in place.</small></li>
            <li><span>03</span><strong>Review and approve</strong><small>See the completed work before deployment.</small></li>
            <li><span>04</span><strong>Balance, then deploy</strong><small>Remaining 50% is due on approval before deployment.</small></li>
          </ol>
        </section>

        <section className="section portfolio-section" id="work">
          <div className="section-heading section-heading--compact">
            <div>
              <Eyebrow>Selected builds and concepts</Eyebrow>
              <h2>Ideas made<br /><em>interactive.</em></h2>
            </div>
            <p>Explore website previews and internal concepts. Each item is labelled accurately; concepts are not presented as client results.</p>
          </div>
          <div className="portfolio-grid">
            {portfolioProjects.map(({ name, platform, href }) => (
              <a className="portfolio-link cascade-item" href={href} key={href} target="_blank" rel="noreferrer">
                <span><strong>{name}</strong><small>{platform}</small></span>
                <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            ))}
          </div>
        </section>

        <section className="founder-section">
          <div className="founder-section__mark" aria-hidden="true">SK</div>
          <div>
            <Eyebrow>Who is behind Kairven</Eyebrow>
            <h2>Mohd Sameer Khan<br /><em>Founder · Kanpur, India</em></h2>
            <p>Kairven connects the public-facing and behind-the-scenes systems businesses rely on: discovery, websites, leads, conversations and operations.</p>
            <a className="text-link" href="/about/">Read about Kairven <ArrowRight size={15} aria-hidden="true" /></a>
          </div>
        </section>

        <section className="section faq-section" id="faq">
          <div className="section-heading section-heading--compact">
            <div><Eyebrow>Useful answers</Eyebrow><h2>Before you<br /><em>get started.</em></h2></div>
            <p>Plain answers about the work, timeline, tools and process.</p>
          </div>
          <FAQList preview />
          <a className="text-link" href="/faq/">See all questions <ArrowRight size={15} aria-hidden="true" /></a>
        </section>

        <section className="section insight-section">
          <div className="insight-card">
            <Eyebrow>Field notes · {new Date("2026-10-16T00:00:00Z").toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" })}</Eyebrow>
            <h2>What happens after the first enquiry?</h2>
            <p>A practical guide to mapping a service-business response path, setting ownership and following up without overpromising automation.</p>
            <a className="text-link" href="/blog/">Read the enquiry follow-up guide <ArrowRight size={15} aria-hidden="true" /></a>
          </div>
          <div className="insight-card insight-card--quiet">
            <Eyebrow>Written scope · Clear handoff</Eyebrow>
            <p className="insight-card__statement">The system is only as useful as the real process behind it.</p>
          </div>
        </section>

        <ContactSection />

        <section className="section social-section" id="connect">
          <div className="section-heading section-heading--compact">
            <div><Eyebrow>Stay connected</Eyebrow><h2>Find us <em>out there.</em></h2></div>
            <p>Choose the channel that works for you.</p>
          </div>
          <div className="social-grid">
            {socialLinks.map(({ name, handle, href, icon: Icon }) => (
              <a className="social-link" href={href} key={name} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noreferrer" : undefined}>
                <Icon size={18} strokeWidth={1.6} aria-hidden="true" />
                <span><strong>{name}</strong><small>{handle}</small></span>
                <ArrowUpRight size={14} className="social-link__arrow" aria-hidden="true" />
              </a>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Kairven page rendering failed.", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main id="main-content" className="error-page" role="alert">
          <Eyebrow>Something went wrong</Eyebrow>
          <h1>This page could not be displayed.</h1>
          <button className="button button--dark" type="button" onClick={() => window.location.reload()}>Reload page</button>
        </main>
      );
    }
    return this.props.children;
  }
}

function ExperienceMotion({ children }) {
  const scope = useRef(null);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    let disposed = false;
    let context;
    let gsap;

    Promise.all([
      import("gsap"),
      import("gsap/ScrollTrigger"),
    ]).then(([gsapModule, scrollModule]) => {
      if (disposed) return;
      gsap = gsapModule.gsap;
      const { ScrollTrigger } = scrollModule;
      gsap.registerPlugin(ScrollTrigger);

      context = gsap.context(() => {
        const motion = gsap.matchMedia();
        motion.add("(prefers-reduced-motion: no-preference)", () => {
          const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
          intro.fromTo(".hero__copy > *", { y: 24, autoAlpha: 0 }, {
            y: 0,
            autoAlpha: 1,
            duration: 0.72,
            stagger: 0.09,
            clearProps: "transform",
          });
          intro.fromTo(".system-map", { y: 22, autoAlpha: 0 }, {
            y: 0,
            autoAlpha: 1,
            duration: 0.8,
            clearProps: "transform",
          }, "<0.12");

          gsap.utils.toArray(".cascade-item", scope.current).forEach((element) => {
            gsap.fromTo(element, { y: 26, autoAlpha: 0 }, {
              y: 0,
              autoAlpha: 1,
              duration: 0.58,
              ease: "power2.out",
              clearProps: "transform",
              scrollTrigger: { trigger: element, start: "top 88%", once: true },
            });
          });

          gsap.to(".hero__copy", {
            yPercent: -7,
            ease: "none",
            scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 0.7 },
          });
          gsap.to(".system-map__signal", {
            x: 14,
            ease: "none",
            scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 0.7 },
          });
          gsap.to(".journey-motif", {
            rotation: 8,
            ease: "none",
            scrollTrigger: { trigger: ".journey-window", start: "top bottom", end: "bottom top", scrub: 0.8 },
          });

          const desktop = gsap.matchMedia();
          desktop.add("(min-width: 900px)", () => {
            const rail = scope.current.querySelector(".journey-rail");
            const viewport = scope.current.querySelector(".journey-window");
            if (!rail || !viewport) return undefined;

            gsap.to(rail, {
              x: () => -(rail.scrollWidth - viewport.clientWidth),
              ease: "none",
              scrollTrigger: {
                trigger: viewport,
                start: "top top",
                end: () => `+=${rail.scrollWidth - viewport.clientWidth}`,
                pin: true,
                scrub: 0.7,
                invalidateOnRefresh: true,
                onUpdate: (self) => gsap.set(".journey-progress > span", { scaleX: self.progress }),
              },
            });
          });
          return () => desktop.revert();
        });
      }, scope.current);
    }).catch((error) => {
      if (!disposed) console.error("Kairven's motion system could not be initialized.", error);
    });

    return () => {
      disposed = true;
      context?.revert();
    };
  }, []);

  return <div ref={scope} className="motion-root">{children}</div>;
}

function RouteContent({ pathname, RoutePagesComponent }) {
  const path = (pathname ?? window.location.pathname).replace(/\/+$/, "") || "/";

  if (path === "/") return <HomePage />;
  if (RoutePagesComponent) return <RoutePagesComponent path={path} />;
  return <main id="main-content" className="error-page" aria-busy="true"><p>Loading page…</p></main>;
}

export default function App({ pathname, RoutePagesComponent }) {
  const path = (pathname ?? (typeof window === "undefined" ? "/" : window.location.pathname)).replace(/\/+$/, "") || "/";
  const metadata = path === "/" ? HOME_METADATA : ROUTE_METADATA[path];

  useEffect(() => {
    if (!metadata) {
      document.title = "Page not found | Kairven";
      document.querySelector('meta[name="robots"]')?.setAttribute("content", "noindex, follow");
      document.querySelector('meta[name="description"]')?.remove();
      document.querySelector('link[rel="canonical"]')?.remove();
      document.querySelectorAll('link[rel="alternate"][hreflang]').forEach((link) => link.remove());
      return;
    }
    document.querySelector('meta[name="robots"]')?.setAttribute("content", "index, follow");
    document.title = metadata.title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", metadata.description);
    document.querySelector('link[rel="canonical"]')?.setAttribute("href", `${WEBSITE_URL}${metadata.path}`);
    document.querySelector('link[rel="alternate"][hreflang="en"]')?.setAttribute("href", `${WEBSITE_URL}${metadata.path}`);
    document.querySelector('link[rel="alternate"][hreflang="x-default"]')?.setAttribute("href", `${WEBSITE_URL}${metadata.path}`);
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", metadata.title);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", metadata.description);
    document.querySelector('meta[property="og:url"]')?.setAttribute("content", `${WEBSITE_URL}${metadata.path}`);
    document.querySelector('meta[property="og:type"]')?.setAttribute("content", metadata.type);
    document.querySelector('meta[name="twitter:title"]')?.setAttribute("content", metadata.title);
    document.querySelector('meta[name="twitter:description"]')?.setAttribute("content", metadata.description);
  }, [metadata]);

  return (
    <ErrorBoundary>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <ExperienceMotion><RouteContent pathname={pathname} RoutePagesComponent={RoutePagesComponent} /></ExperienceMotion>
    </ErrorBoundary>
  );
}
