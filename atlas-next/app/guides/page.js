import Link from "next/link";
import { absoluteUrl, toJsonLd } from "@/lib/seo";

export const metadata = {
  title: "AI Workspace Guidance",
  description:
    "Learn how to get the best results from The Digital Atlas AI workspace, from narrowing broad ideas to choosing the right output format.",
  alternates: {
    canonical: "/guides"
  },
  openGraph: {
    title: "AI Workspace Guidance | The Digital Atlas",
    description:
      "Learn how to get the best results from The Digital Atlas AI workspace, from narrowing broad ideas to choosing the right output format.",
    url: absoluteUrl("/guides")
  }
};

const guideSections = [
  {
    title: "How to write a strong first prompt",
    copy:
      "The best prompts name the outcome, the audience, and the pressure point. Instead of asking for 'something for a wedding,' say what needs to happen, who it is for, and what must feel easier after the file exists.",
    links: [
      { href: "/?prompt=I need a printable wedding planning bundle with a budget tracker and a few elegant guest-facing pages.", label: "Try a wedding prompt" },
      { href: "/?prompt=I need a client-ready onboarding and proposal bundle for a new service business.", label: "Try a business prompt" }
    ]
  },
  {
    title: "When the workspace asks you to narrow the direction",
    copy:
      "Some prompts are broad enough that multiple output families could work. When that happens, the app suggests safer lanes like a planner, a sign set, a business document, or a workbook so the first generated sample feels immediately useful.",
    links: [
      { href: "/", label: "Start a fresh workspace" },
      { href: "/faq", label: "See sample and bundle rules" }
    ]
  },
  {
    title: "Choosing the right bundle format",
    copy:
      "PDF is best for printable structure, PNG is best for quick visual proof, DOCX is best for text-heavy edits, and XLSX is best for rows, budgets, and trackers. The workspace chooses the safest mix based on the request.",
    links: [
      { href: "/faq", label: "Read file format answers" },
      { href: "/account", label: "Open your account workspace" }
    ]
  }
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
        <p className="eyebrow">Guidance</p>
        <h1>How to get better results from the AI workspace.</h1>
        <p>
          These notes help customers move from vague intent to a cleaner generated output with less friction and more
          confidence.
        </p>
      </div>

      <div className="guide-stack">
        {guideSections.map((section) => (
          <article className="info-card guide-card" key={section.title}>
            <p className="eyebrow">Workspace Guide</p>
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
    </section>
  );
}
