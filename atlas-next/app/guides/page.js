import Link from "next/link";
import { absoluteUrl, toJsonLd } from "@/lib/seo";

export const metadata = {
  title: "Digital Template Buying Guides",
  description:
    "Explore keyword-focused buying guides for wedding templates, business documents, event planners, printable PDFs, and spreadsheet downloads.",
  alternates: {
    canonical: "/guides"
  },
  openGraph: {
    title: "Digital Template Buying Guides | The Digital Atlas",
    description:
      "Explore keyword-focused buying guides for wedding templates, business documents, event planners, printable PDFs, and spreadsheet downloads.",
    url: absoluteUrl("/guides")
  }
};

const guideSections = [
  {
    title: "Wedding planner templates and printable wedding bundles",
    copy:
      "Shoppers looking for wedding planner templates often want invitations, RSVP cards, seating charts, signage, and budgeting tools in one place. Category pages and bundle pages should make it obvious when a single printable PDF works, and when a complete wedding bundle is the better-value choice.",
    links: [
      { href: "/shop/wedding", label: "Browse wedding templates" },
      { href: "/bundles", label: "See wedding bundles" },
      { href: "/products/editable-wedding-pdf-template-bundle", label: "View the flagship wedding bundle" }
    ]
  },
  {
    title: "Business proposal templates, invoice templates, and client documents",
    copy:
      "Business buyers search for practical digital assets like proposal templates, invoice templates, onboarding kits, and pitch decks. These buyers respond well to clear format labels, strong summaries, and grouped product collections that make the store feel reliable and worth revisiting.",
    links: [
      { href: "/shop/business", label: "Browse business templates" },
      { href: "/products/complete-business-templates-bundle", label: "View the business bundle" },
      { href: "/products/business-proposal-template", label: "See the proposal template" }
    ]
  },
  {
    title: "Printable event planner templates and party invitation downloads",
    copy:
      "Searches for event planning templates, party invitations, baby shower games, and celebration planners usually come from buyers who want something fast, stylish, and low-friction. Pages that combine printable event language with exact use cases tend to be more discoverable and easier to convert.",
    links: [
      { href: "/shop/events-parties", label: "Browse event and party templates" },
      { href: "/products/event-planning-bundle", label: "View the event planning bundle" },
      { href: "/products/celebration-party-planner-bundle", label: "Explore celebration templates" }
    ]
  },
  {
    title: "Editable PDF templates, printable planners, and spreadsheet downloads",
    copy:
      "Many shoppers search by format first. They want editable PDF templates, printable planners, or spreadsheet downloads that solve a specific problem. Strong internal links by format help both search engines and customers understand how the catalog is organized.",
    links: [
      { href: "/shop?q=pdf", label: "Shop PDF templates" },
      { href: "/shop?q=fillable", label: "Shop fillable templates" },
      { href: "/shop?q=xlsx", label: "Shop spreadsheet downloads" }
    ]
  }
];

const popularSearchLinks = [
  { href: "/shop?q=wedding+template", label: "Wedding template ideas" },
  { href: "/shop?q=printable+planner", label: "Printable planners" },
  { href: "/shop?q=business+template", label: "Business templates" },
  { href: "/shop?q=event+planner", label: "Event planner templates" },
  { href: "/shop?q=fillable+pdf", label: "Fillable PDF templates" },
  { href: "/shop?q=spreadsheet", label: "Spreadsheet downloads" }
];

export default function GuidesPage() {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "Guides", item: absoluteUrl("/guides") }
    ]
  };

  return (
    <section className="section-block">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(breadcrumbJsonLd) }} />
      <div className="page-intro">
        <p className="eyebrow">Guides</p>
        <h1>Keyword-rich buying guides that help customers and search engines understand the store.</h1>
        <p>
          These guides connect popular search phrases with the actual categories, bundles, and digital products inside
          The Digital Atlas.
        </p>
      </div>

      <div className="guide-stack">
        {guideSections.map((section) => (
          <article className="info-card guide-card" key={section.title}>
            <p className="eyebrow">Buying Guide</p>
            <h3>{section.title}</h3>
            <p>{section.copy}</p>
            <div className="catalog-chip-list">
              {section.links.map((link) => (
                <Link className="catalog-chip" key={link.href} href={link.href}>
                  {link.label}
                </Link>
              ))}
            </div>
          </article>
        ))}
      </div>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Popular Searches</p>
            <h2>Quick links built around the phrases shoppers actually use.</h2>
          </div>
        </div>
        <div className="catalog-chip-list popular-search-grid">
          {popularSearchLinks.map((link) => (
            <Link className="catalog-chip catalog-chip--large" key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </div>
      </section>
    </section>
  );
}
