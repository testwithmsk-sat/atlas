import Link from "next/link";
import { absoluteUrl, toJsonLd } from "@/lib/seo";

export const metadata = {
  title: "About The Digital Atlas",
  description: "The Digital Atlas is an AI-powered digital product generator. Describe your goal, get a free PDF sample, and unlock a full editable bundle in minutes.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About The Digital Atlas",
    description: "AI-powered digital product generator for weddings, events, business, and life planning.",
    url: absoluteUrl("/about")
  }
};

export default function AboutPage() {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "About", item: absoluteUrl("/about") }
    ]
  };

  return (
    <section className="section-block">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <div className="page-intro">
        <p className="eyebrow">About</p>
        <h1>Built for the moments when you need a plan — fast.</h1>
        <p>
          The Digital Atlas is an AI-powered digital product generator. Instead of browsing thousands of generic templates and hoping one fits, you describe exactly what you need and we build it around your goal — in under 60 seconds.
        </p>
      </div>

      <div className="editorial-band">
        <article className="info-card editorial-lead">
          <p className="eyebrow">The Problem We Solve</p>
          <h3>Generic templates don't fit real goals.</h3>
          <p>
            Traditional template marketplaces make you browse, guess, and compromise. You search for "wedding checklist", get 200 results, and still spend hours customising something that's 70% wrong for your situation. The Digital Atlas eliminates that entirely.
          </p>
        </article>
        <article className="info-card editorial-note">
          <p className="eyebrow">How It Works</p>
          <h3>Describe it. Get it. Done.</h3>
          <p>
            You type one sentence — your goal, your event, your deadline. The AI reads your intent, picks the right format (PDF planner, DOCX template, XLSX tracker), and generates a real file tailored to your situation. Free sample first, full bundle when you're ready.
          </p>
        </article>
      </div>

      {/* What we generate */}
      <section className="section-block">
        <div className="section-heading">
          <div>
            <p className="eyebrow">What We Generate</p>
            <h2>Real, downloadable files. Not links to edit online.</h2>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.25rem" }}>
          {[
            { icon: "💍", title: "Weddings", items: ["Budget trackers", "12-month checklists", "Guest list + RSVP", "Seating charts", "Vendor contact sheets"] },
            { icon: "🎉", title: "Events & Parties", items: ["Run sheets", "Invitation templates", "Activity planners", "Welcome signs", "Guest lists"] },
            { icon: "💼", title: "Business", items: ["Client proposals", "Invoice templates", "Onboarding kits", "Pitch deck outlines", "Project trackers"] },
            { icon: "🏠", title: "Life & Home", items: ["Weekly planners", "Habit trackers", "Declutter guides", "Routine systems", "Budget sheets"] },
          ].map(cat => (
            <div key={cat.title} className="catalog-card" style={{ padding: "1.5rem" }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>{cat.icon}</div>
              <h3 style={{ fontWeight: 700, marginBottom: "0.75rem" }}>{cat.title}</h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                {cat.items.map(item => (
                  <li key={item} style={{ fontSize: "0.87rem", color: "var(--muted)", display: "flex", gap: "0.5rem" }}>
                    <span style={{ color: "#C9A84C" }}>→</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* How it's different */}
      <section className="section-block">
        <div className="editorial-band">
          <article className="catalog-card" style={{ padding: "2rem" }}>
            <p className="eyebrow eyebrow--electric">The Digital Atlas</p>
            <h3 style={{ marginBottom: "1rem" }}>✓ Built for your goal</h3>
            {["Describe in one sentence", "AI picks the right format", "Generated for your exact situation", "Free sample before you pay", "Full editable bundle — PDF, DOCX, XLSX"].map(f => (
              <div key={f} style={{ display: "flex", gap: "0.6rem", marginBottom: "0.5rem", fontSize: "0.9rem" }}>
                <span style={{ color: "#7aa186", fontWeight: 700 }}>✓</span> {f}
              </div>
            ))}
          </article>
          <article className="info-card" style={{ padding: "2rem" }}>
            <p className="eyebrow">Generic marketplaces</p>
            <h3 style={{ marginBottom: "1rem" }}>✗ Built for everyone = built for no one</h3>
            {["Browse 200+ templates", "Guess which one fits", "Buy before you see it properly", "Spend hours customising", "Still doesn't match your situation"].map(f => (
              <div key={f} style={{ display: "flex", gap: "0.6rem", marginBottom: "0.5rem", fontSize: "0.9rem", color: "var(--muted)" }}>
                <span style={{ color: "#d97ea2", fontWeight: 700 }}>✗</span> {f}
              </div>
            ))}
          </article>
        </div>
      </section>

      {/* CTA */}
      <section className="section-block" style={{ textAlign: "center", padding: "2.5rem 0" }}>
        <h2 style={{ marginBottom: "0.75rem" }}>Try it free — no account needed.</h2>
        <p style={{ color: "var(--muted)", marginBottom: "1.5rem" }}>
          One sentence. One free sample. Ready in under 60 seconds.
        </p>
        <Link className="button button-primary" href="/#intent-form" style={{ fontSize: "1rem", padding: "13px 28px" }}>
          Generate my free sample →
        </Link>
      </section>
    </section>
  );
}
