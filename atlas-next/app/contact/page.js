import Link from "next/link";
import { absoluteUrl, toJsonLd } from "@/lib/seo";

export const metadata = {
  title: "Contact The Digital Atlas",
  description:
    "Contact The Digital Atlas for help with digital downloads, product access, printable templates, and order support.",
  alternates: {
    canonical: "/contact"
  },
  openGraph: {
    title: "Contact The Digital Atlas",
    description:
      "Contact The Digital Atlas for help with digital downloads, product access, printable templates, and order support.",
    url: absoluteUrl("/contact")
  }
};

const supportTopics = [
  "Finding the right product or bundle for a use case",
  "Download access after checkout",
  "File format questions for PDF and spreadsheet products",
  "Bundle contents and category recommendations"
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
        <h1>Support that makes digital products easier to trust.</h1>
        <p>
          Use this page when shoppers need help choosing a template, understanding a file format, or getting answers
          about delivery and access after purchase.
        </p>
      </div>

      <div className="split-panel">
        <article className="info-card">
          <p className="eyebrow">Best Way To Reach Out</p>
          <h3>Use the account and FAQ pages first, then follow up with store support if needed.</h3>
          <ul className="feature-list">
            {supportTopics.map((topic) => (
              <li key={topic}>{topic}</li>
            ))}
          </ul>
        </article>
        <article className="info-card editorial-note">
          <p className="eyebrow">Helpful Links</p>
          <h3>Point customers toward answers that reduce purchase hesitation.</h3>
          <div className="catalog-chip-list">
            <Link className="catalog-chip" href="/faq">
              Read The FAQ
            </Link>
            <Link className="catalog-chip" href="/account">
              View Account
            </Link>
            <Link className="catalog-chip" href="/shop">
              Browse The Shop
            </Link>
            <Link className="catalog-chip" href="/guides">
              Read Buying Guides
            </Link>
          </div>
        </article>
      </div>
    </section>
  );
}
