const faqSections = [
  {
    title: "Free Samples",
    items: [
      {
        question: "What do I get for free?",
        answer:
          "Each AI workspace can generate a free starter sample. That includes a preview image plus a starter PDF that helps you confirm the direction before paying for the full bundle."
      },
      {
        question: "Do I need an account for the free sample?",
        answer:
          "No. Anyone can generate and download a free sample. If you are signed in, the workspace is also saved to your account for later."
      },
      {
        question: "Why does the app sometimes ask me to choose a direction first?",
        answer:
          "Some prompts are broad enough that multiple output families could work. In those cases, the workspace asks you to pick the safest lane before it generates a sample."
      }
    ]
  },
  {
    title: "Full Bundles",
    items: [
      {
        question: "What does the paid bundle unlock?",
        answer:
          "The paid bundle unlocks the full session-specific asset set for the chosen direction. Depending on the request, that can include PDF, PNG, DOCX, and XLSX files."
      },
      {
        question: "Are paid bundles tied to a product page?",
        answer:
          "No. Paid bundles are tied to the exact AI workspace session that created them, not to a public catalog product."
      },
      {
        question: "How do I get my full files after checkout?",
        answer:
          "After successful checkout, the unlocked files appear in the success flow immediately and remain available in your account workspace when you are signed in."
      }
    ]
  },
  {
    title: "Formats & Editing",
    items: [
      {
        question: "Which file formats can the app generate?",
        answer:
          "Phase 1 supports PDF, PNG, DOCX, and XLSX. The exact mix depends on the template family chosen for your request."
      },
      {
        question: "Will every request get all four formats?",
        answer:
          "No. The app chooses the safest formats for the job. Text-heavy outputs lean toward DOCX and PDF, while trackers lean toward XLSX and PDF."
      },
      {
        question: "Are these physical products?",
        answer:
          "No. The Digital Atlas delivers digital files only. Nothing is shipped physically."
      }
    ]
  }
];

export const metadata = {
  title: "FAQ | The Digital Atlas",
  description: "Answers to common questions about AI workspaces, free samples, generated bundles, and account access."
};

export default function FaqPage() {
  return (
    <section className="section-block">
      <div className="page-intro">
        <p className="eyebrow">Support</p>
        <h1>Frequently asked questions for AI-guided digital product generation.</h1>
        <p>
          This page explains how the new workspace works, what is included in the free sample, and how full bundles
          are unlocked and delivered.
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
