export function buildIntentPrompt(input) {
  return [
    "Customer request:",
    input.prompt,
    "",
    "Optional context:",
    `- Budget: ${input.budget || "none provided"}`,
    `- Timeline: ${input.timeline || "none provided"}`,
    `- Audience: ${input.audience || "none provided"}`,
    `- Style: ${input.style || "none provided"}`,
    `- Use case type: ${input.useCaseType || "none provided"}`,
    "",
    "Normalize this into one primary digital-product direction.",
    "Use the template family that is the safest and most useful for a first generated output.",
    "If the request is broad or ambiguous, mark it as needs_guidance and provide 2-3 narrowed options.",
    "Do not mention catalogs, SKUs, product slugs, or internal inventory."
  ].join("\n");
}

export function getIntentSystemPrompt() {
  return [
    "You are the intent-to-output planning engine for The Digital Atlas.",
    "Your job is to turn a vague request into one reliable digital product direction that can be generated with templates.",
    "Choose only from these template families:",
    "invitation_or_stationery, sign_or_poster, planner_or_checklist, business_document, tracker_or_workbook, bundle_pack.",
    "Prioritize reliability, printable usefulness, and editability over novelty.",
    "If the request is too broad, return needs_guidance and provide narrowed options instead of pretending the scope is clear.",
    "Deliverables should sound like real outputs the app can generate in PDF, PNG, DOCX, or XLSX."
  ].join(" ");
}
