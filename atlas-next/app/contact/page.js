import Link from "next/link";
import Image from "next/image";
import { absoluteUrl, toJsonLd } from "@/lib/seo";

export const metadata = {
  title: "Contact The Digital Atlas",
  description:
    "Reach out to The Digital Atlas for help with AI workspaces, generated downloads, editable bundles, and order support.",
  alternates: {
    canonical: "/contact"
  },
  openGraph: {
    title: "Contact The Digital Atlas",
    description:
      "Reach out to The Digital Atlas for help with AI workspaces, generated downloads, editable bundles, and order support.",
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
          Use this page when you need help choosing an output direction, understanding a generated file format,
          or getting answers about delivery and access after purchase.
        </p>
      </div>

      {/* Owner / Personal Card */}
      <div className="contact-owner-card">
        <div className="contact-owner-photo-wrap">
          <Image
            src="/owner-photo.jpg"
            alt="Sathiskumar — Founder of The Digital Atlas"
            width={200}
            height={200}
            className="contact-owner-photo"
            priority
          />
        </div>
        <div className="contact-owner-info">
          <p className="eyebrow">Founder &amp; Creator</p>
          <h2>Sathiskumar</h2>
          <p className="contact-owner-role">Founder &amp; Creator, The Digital Atlas</p>
          <p>
            Whether you have a question about a product, need help with your order, or want to explore a custom
            bundle — reach out directly and I'll get back to you as soon as possible.
          </p>
          <div className="contact-owner-links">
            <a className="contact-owner-link contact-owner-link--phone" href="tel:+917010087906">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12 19.79 19.79 0 0 1 1.07 3.4 2 2 0 0 1 3.04 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16z"/>
              </svg>
              +91 70100 87906
            </a>
            <a className="contact-owner-link contact-owner-link--email" href="mailto:support@thedigitalatlas.com">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect width="20" height="16" x="2" y="4" rx="2"/>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
              support@thedigitalatlas.com
            </a>
          </div>
        </div>
      </div>

      {/* Support Topics + Helpful Links */}
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
          <h3>Pages that reduce hesitation and help you act faster.</h3>
          <div className="catalog-chip-list">
            <Link className="catalog-chip" href="/faq">Read The FAQ</Link>
            <Link className="catalog-chip" href="/account">View Account</Link>
            <Link className="catalog-chip" href="/">Start The Workspace</Link>
            <Link className="catalog-chip" href="/guides">Read Guidance</Link>
          </div>
        </article>
      </div>
    </section>
  );
}
