const faqSections = [
  {
    title: "Downloads & Access",
    items: [
      {
        question: "How do I get my files after checkout?",
        answer:
          "After successful checkout, your files are connected to your account and available from the account download library."
      },
      {
        question: "What if I lose my download link?",
        answer:
          "Sign back into your account and open the download library. Your available files stay connected to your purchase history there."
      },
      {
        question: "Do I receive files instantly?",
        answer:
          "Yes. This is a digital storefront, so eligible files are delivered immediately after payment is confirmed."
      }
    ]
  },
  {
    title: "Editing & Compatibility",
    items: [
      {
        question: "What file types are included?",
        answer:
          "Products may include printable PDFs, editable spreadsheets, and bundle file sets. Each product page lists the exact format before purchase."
      },
      {
        question: "Do I need special software?",
        answer:
          "Most PDF products work with standard PDF viewers, and spreadsheet products work in compatible spreadsheet software such as Excel or similar tools."
      },
      {
        question: "Can I use these on Mac and Windows?",
        answer:
          "Yes, in most cases. Digital files are delivered in standard formats designed to work across common desktop environments."
      }
    ]
  },
  {
    title: "Store Policies",
    items: [
      {
        question: "Are these physical products?",
        answer:
          "No. The Digital Atlas sells digital products only. Nothing is shipped physically."
      },
      {
        question: "Can I return a digital file?",
        answer:
          "Because digital files are delivered instantly, returns are generally limited. Customers should review the product details, format, and included files before purchase."
      },
      {
        question: "How do I know what is inside a bundle?",
        answer:
          "Each bundle page includes a contents list and format details so customers can see what they are purchasing before checkout."
      }
    ]
  }
];

export const metadata = {
  title: "FAQ | The Digital Atlas",
  description: "Answers to common questions about downloads, file access, editing, and digital product delivery."
};

export default function FaqPage() {
  return (
    <section className="section-block">
      <div className="page-intro">
        <p className="eyebrow">Support</p>
        <h1>Frequently asked questions for digital product buyers.</h1>
        <p>
          Clear answers help the store feel more trustworthy. This page explains delivery, file access, compatibility,
          and what customers should expect after checkout.
        </p>
      </div>

      <div className="faq-grid">
        {faqSections.map((section) => (
          <article className="info-card faq-card" key={section.title}>
            <p className="eyebrow">{section.title}</p>
            <div className="faq-list">
              {section.items.map((item) => (
                <div className="faq-item" key={item.question}>
                  <h3>{item.question}</h3>
                  <p>{item.answer}</p>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
