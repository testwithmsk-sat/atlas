import Link from "next/link";
import { absoluteUrl, toJsonLd } from "@/lib/seo";

export const metadata = {
  title: "About The Digital Atlas",
  description:
    "Learn about The Digital Atlas, a premium digital storefront for templates, printable planners, business documents, and event bundles.",
  alternates: {
    canonical: "/about"
  },
  openGraph: {
    title: "About The Digital Atlas",
    description:
      "Learn about The Digital Atlas, a premium digital storefront for templates, printable planners, business documents, and event bundles.",
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(breadcrumbJsonLd) }} />
      <div className="page-intro">
        <p className="eyebrow">About</p>
        <h1>A digital storefront built for practical, polished downloads.</h1>
        <p>
          The Digital Atlas brings together premium-looking templates, printable resources, business documents, and
          planning tools so shoppers can find useful digital products without digging through generic marketplaces.
        </p>
      </div>

      <div className="editorial-band">
        <article className="info-card editorial-lead">
          <p className="eyebrow">What We Sell</p>
          <h3>Bundles, printable PDFs, editable templates, and planning tools across real buyer use cases.</h3>
          <p>
            The collection is organized around weddings, events, business, productivity, and everyday planning so
            shoppers can browse by outcome instead of file type alone.
          </p>
        </article>
        <article className="info-card editorial-note">
          <p className="eyebrow">Why It Matters</p>
          <h3>Useful digital products earn more trust when the storefront feels curated, clear, and dependable.</h3>
          <p>
            That means better product explanations, stronger previews, instant delivery, category-led shopping, and a
            simpler path from discovery to checkout.
          </p>
        </article>
      </div>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Explore The Store</p>
            <h2>Start with the strongest paths into the catalog.</h2>
          </div>
        </div>
        <div className="catalog-directory">
          <Link className="catalog-card catalog-card--link" href="/shop/wedding">
            <p className="eyebrow">Wedding</p>
            <h2>Wedding Templates</h2>
            <p>Invitations, planners, signage, and wedding-ready printable resources.</p>
          </Link>
          <Link className="catalog-card catalog-card--link" href="/shop/business">
            <p className="eyebrow">Business</p>
            <h2>Business Documents</h2>
            <p>Proposals, onboarding kits, pitch decks, invoices, and branded client materials.</p>
          </Link>
          <Link className="catalog-card catalog-card--link" href="/guides">
            <p className="eyebrow">Guides</p>
            <h2>SEO And Buyer Guides</h2>
            <p>Keyword-rich pages designed to help shoppers discover the right templates faster.</p>
          </Link>
          <Link className="catalog-card catalog-card--link" href="/contact">
            <p className="eyebrow">Support</p>
            <h2>Contact & Help</h2>
            <p>Answers about downloads, access, and which products are the best fit for a use case.</p>
          </Link>
        </div>
      </section>
    </section>
  );
}
