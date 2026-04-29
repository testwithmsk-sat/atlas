import Link from "next/link";
import { absoluteUrl, toJsonLd } from "@/lib/seo";

export const metadata = {
  title: "Contact The Digital Atlas",
  description:
    "Contact The Digital Atlas for help with AI workspaces, generated downloads, editable bundles, and order support.",
  alternates: {
    canonical: "/contact"
  },
  openGraph: {
    title: "Contact The Digital Atlas",
    description:
      "Contact The Digital Atlas for help with AI workspaces, generated downloads, editable bundles, and order support.",
    url: absoluteUrl("/contact")
  }
};

const supportTopics = [
  "Choosing the right AI-generated output direction",
  "Download access after checkout",
  "File format questions for PDF, DOCX, PNG, and XLSX outputs",
  "Saved workspace and account access issues"
];

export default function ContactPage() {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "Contact", item: absoluteUrl("/contact") }
    ]
  };

  return (
    <section className="section-block">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(breadcrumbJsonLd) }} />
      <div className="page-intro">
        <p className="eyebrow">Contact</p>
        <h1>Support that makes AI-generated digital outputs easier to trust.</h1>
        <p>
          Use this page when customers need help choosing an output direction, understanding a generated file format,
          or getting answers about delivery and access after purchase.
        </p>
      </div>

      <div className="split-panel">
        <article className="info-card">
          <p className="eyebrow">Best Way To Reach Out</p>
          <h3>Use the workspace, account, and FAQ pages first, then follow up with support if needed.</h3>
          <ul className="feature-list">
            {supportTopics.map((topic) => (
              <li key={topic}>{topic}</li>
            ))}
          </ul>
        </article>
        <article className="info-card editorial-note">
          <p className="eyebrow">Helpful Links</p>
          <h3>Point customers toward the pages that reduce hesitation and help them act faster.</h3>
          <div className="catalog-chip-list">
            <Link className="catalog-chip" href="/faq">
              Read The FAQ
            </Link>
            <Link className="catalog-chip" href="/account">
              View Account
            </Link>
            <Link className="catalog-chip" href="/">
              Start The Workspace
            </Link>
            <Link className="catalog-chip" href="/guides">
              Read Guidance
            </Link>
          </div>
        </article>
      </div>
    </section>
  );
}
