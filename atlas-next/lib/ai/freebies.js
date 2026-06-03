// Static file lookup removed — all freebies are now generated dynamically by AI.
export async function getFreebieDownloadUrl(_productSlug) {
  return "";
}

export function buildStarterBriefContent({ product, session }) {
  const normalizedIntent = session?.normalizedIntent || {};
  const deliverables = Array.isArray(normalizedIntent.deliverables) ? normalizedIntent.deliverables : [];
  const reasoningNotes = Array.isArray(normalizedIntent.reasoningNotes) ? normalizedIntent.reasoningNotes : [];
  const nextSteps = Array.isArray(normalizedIntent.nextSteps) ? normalizedIntent.nextSteps : [];

  return [
    "The Digital Atlas Starter Brief",
    "",
    `Idea: ${normalizedIntent.productIdeaTitle || product?.name || "Starter kit"}`,
    `Category: ${session?.categorySlug || product?.categorySlug || "wedding"}`,
    "",
    normalizedIntent.intentSummary || product?.summary || "A focused starter recommendation from your AI planning flow.",
    "",
    "Suggested deliverables:",
    ...deliverables.map((item, index) => `${index + 1}. ${item}`),
    "",
    "Why this fits:",
    ...reasoningNotes.map((item, index) => `${index + 1}. ${item}`),
    "",
    "Next steps:",
    ...nextSteps.map((item, index) => `${index + 1}. ${item}`)
  ].join("\n");
}
