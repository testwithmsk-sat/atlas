import { formatUsdAmount } from "@/lib/currency";
import { generationOptionSchema, normalizedIntentSchema } from "@/lib/ai/schemas";

const familyKeywords = {
  invitation_or_stationery: [
    "invitation",
    "rsvp",
    "save the date",
    "stationery",
    "thank you card",
    "menu card",
    "announcement",
    "invite"
  ],
  sign_or_poster: ["sign", "poster", "seating chart", "welcome board", "banner", "placard", "label", "flyer"],
  planner_or_checklist: ["planner", "checklist", "timeline", "schedule", "itinerary", "worksheet", "guide", "plan"],
  business_document: ["proposal", "invoice", "contract", "resume", "brief", "letterhead", "pitch", "business"],
  tracker_or_workbook: ["tracker", "workbook", "budget", "spreadsheet", "finance", "ledger", "calculator", "xlsx"],
  bundle_pack: ["bundle", "pack", "kit", "full set", "starter kit", "toolkit", "suite"]
};

const defaultFamilies = [
  "planner_or_checklist",
  "invitation_or_stationery",
  "business_document",
  "tracker_or_workbook",
  "sign_or_poster",
  "bundle_pack"
];

const familyTitles = {
  invitation_or_stationery: "Editable stationery set",
  sign_or_poster: "Printable sign and poster set",
  planner_or_checklist: "Guided planner and checklist",
  business_document: "Client-ready business document",
  tracker_or_workbook: "Structured tracker workbook",
  bundle_pack: "Full digital bundle pack"
};

const familyDescriptions = {
  invitation_or_stationery:
    "Best when the request needs polished announcement, RSVP, or guest-facing pieces that should look designed and print beautifully.",
  sign_or_poster:
    "Best when the request centers on signage, visual direction, or display-ready pages that need strong layout and printable impact.",
  planner_or_checklist:
    "Best when the customer needs clarity, steps, routines, or a calm printable system rather than decorative design alone.",
  business_document:
    "Best when the request is text-heavy and needs a professional format customers can edit in Word and print as PDF.",
  tracker_or_workbook:
    "Best when the request depends on rows, numbers, budgeting, or repeatable tracking in an editable spreadsheet.",
  bundle_pack:
    "Best when the request spans multiple deliverable types and should become a coordinated multi-format kit."
};

const familyOutputs = {
  invitation_or_stationery: ["PDF", "PNG"],
  sign_or_poster: ["PDF", "PNG"],
  planner_or_checklist: ["PDF"],
  business_document: ["DOCX", "PDF"],
  tracker_or_workbook: ["XLSX", "PDF"],
  bundle_pack: ["PDF", "PNG", "DOCX", "XLSX"]
};

const bundlePricing = {
  invitation_or_stationery: 12,
  sign_or_poster: 14,
  planner_or_checklist: 11,
  business_document: 15,
  tracker_or_workbook: 16,
  bundle_pack: 24
};

function normalizeText(value) {
  return String(value || "").trim();
}

function lower(value) {
  return normalizeText(value).toLowerCase();
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function scoreFamilies(text) {
  const normalized = lower(text);

  return defaultFamilies
    .map((templateFamily) => ({
      templateFamily,
      score: familyKeywords[templateFamily].reduce(
        (sum, keyword) => sum + (normalized.includes(keyword) ? keyword.split(" ").length : 0),
        0
      )
    }))
    .sort((left, right) => right.score - left.score);
}

function inferStyleDirection(input) {
  const normalized = lower(`${input.prompt} ${input.style}`);
  if (normalized.includes("luxury") || normalized.includes("elegant")) return "elegant and polished";
  if (normalized.includes("minimal") || normalized.includes("clean")) return "clean and minimal";
  if (normalized.includes("playful") || normalized.includes("party")) return "playful and high-energy";
  if (normalized.includes("formal") || normalized.includes("professional")) return "professional and structured";
  return "clear, polished, and low-friction";
}

function inferAudience(input) {
  if (normalizeText(input.audience)) return normalizeText(input.audience);
  const normalized = lower(`${input.prompt} ${input.useCaseType}`);
  if (normalized.includes("bride") || normalized.includes("wedding")) return "couples, planners, or families managing a wedding";
  if (normalized.includes("business") || normalized.includes("client")) return "founders, freelancers, or small business owners";
  if (normalized.includes("party") || normalized.includes("event")) return "hosts who need guest-facing planning assets";
  return "people who want a digital product that reduces decision fatigue";
}

function inferUseCase(input, family) {
  if (normalizeText(input.useCaseType)) return normalizeText(input.useCaseType);

  const normalized = lower(input.prompt);
  if (normalized.includes("wedding")) return "wedding planning";
  if (normalized.includes("party") || normalized.includes("event")) return "event planning";
  if (normalized.includes("business")) return "small business setup";
  if (family === "tracker_or_workbook") return "budgeting and progress tracking";
  if (family === "business_document") return "client-ready business documentation";
  return "turning a vague idea into an organized digital product";
}

function buildDeliverables(family, input) {
  const base = {
    invitation_or_stationery: ["cover design direction", "editable wording layout", "print-ready PDF", "shareable preview image"],
    sign_or_poster: ["hero layout", "display-ready printable PDF", "matching preview graphic", "clear event copy blocks"],
    planner_or_checklist: ["structured checklist pages", "timeline or routine sections", "guided action prompts", "starter printable PDF"],
    business_document: ["editable document draft", "print-ready PDF export", "section headings and copy prompts", "client-facing layout"],
    tracker_or_workbook: ["editable spreadsheet tabs", "summary sheet", "print-friendly PDF view", "tracking formulas or structured rows"],
    bundle_pack: ["coordinated PDF pack", "preview image", "editable document file", "tracking sheet or workbook"]
  }[family];

  const prompt = lower(input.prompt);
  if (family === "bundle_pack" && prompt.includes("wedding")) {
    return ["invitation layout", "planning checklist", "budget tracker", "preview graphics", "editable master bundle"];
  }

  if (family === "tracker_or_workbook" && (prompt.includes("budget") || prompt.includes("finance"))) {
    return ["budget worksheet", "spend tracker", "summary dashboard", "print-ready PDF snapshot"];
  }

  return base;
}

function buildWhyItFits(family, input) {
  const prompt = lower(input.prompt);
  const messages = [
    "The request is outcome-focused, so the app should generate a structured asset instead of sending the user into a catalog.",
    familyDescriptions[family]
  ];

  if (prompt.includes("budget") || prompt.includes("deadline") || prompt.includes("timeline")) {
    messages.push("The customer is under time or budget pressure, which makes a guided template family more useful than a blank canvas.");
  } else {
    messages.push("The best first version reduces mental clutter by turning a broad ask into one concrete downloadable output.");
  }

  return messages.slice(0, 3);
}

export function getOutputFormatsForFamily(templateFamily, normalizedIntent = null) {
  if (templateFamily === "planner_or_checklist") {
    const deliverableText = lower(normalizedIntent?.deliverables?.join(" "));
    if (deliverableText.includes("tracker") || deliverableText.includes("budget") || deliverableText.includes("worksheet")) {
      return ["PDF", "XLSX"];
    }
  }

  return familyOutputs[templateFamily] || ["PDF"];
}

export function getPaidBundleOffer(templateFamily) {
  const amountUsd = bundlePricing[templateFamily] || 12;

  return {
    bundleName: `Full ${familyTitles[templateFamily]}`,
    description: "Unlock the full editable and printable asset bundle for this generation session.",
    priceLabel: formatUsdAmount(amountUsd),
    amountUsd,
    includedFormats: getOutputFormatsForFamily(templateFamily)
  };
}

export function buildSuggestedOptions(input, rankedFamilies) {
  const prompt = normalizeText(input.prompt);

  return rankedFamilies.slice(0, 3).map((entry, index) =>
    generationOptionSchema.parse({
      id: `option-${index + 1}`,
      title: familyTitles[entry.templateFamily],
      description: `${familyDescriptions[entry.templateFamily]} This option is tuned to the request: "${prompt.slice(0, 72)}${prompt.length > 72 ? "..." : ""}"`,
      templateFamily: entry.templateFamily,
      outputFormats: getOutputFormatsForFamily(entry.templateFamily),
      rationale: `This direction keeps the output focused on ${familyTitles[entry.templateFamily].toLowerCase()} so the first generated asset feels useful immediately.`
    })
  );
}

export function buildFallbackIntent(input) {
  const rankedFamilies = scoreFamilies(
    [input.prompt, input.budget, input.timeline, input.audience, input.style, input.useCaseType].filter(Boolean).join(" ")
  );
  const top = rankedFamilies[0];
  const runnerUp = rankedFamilies[1];
  const templateFamily = top?.templateFamily || "planner_or_checklist";
  const scopeStatus =
    !top?.score || top.score < 2 || (runnerUp?.score || 0) >= Math.max(1, top.score - 1) ? "needs_guidance" : "clear";
  const useCaseType = inferUseCase(input, templateFamily);

  return normalizedIntentSchema.parse({
    intentSummary: `The customer wants an AI-guided digital product that turns "${normalizeText(input.prompt)}" into a clear, editable, and printable output with less mental clutter.`,
    recommendedTitle: familyTitles[templateFamily],
    recommendedDescription: `Start with a ${familyTitles[templateFamily].toLowerCase()} that gives the customer a concrete first output, then expand into a fuller downloadable bundle if they want more depth.`,
    audienceProfile: inferAudience(input),
    useCaseType,
    styleDirection: inferStyleDirection(input),
    deliverables: buildDeliverables(templateFamily, input),
    whyItFits: buildWhyItFits(templateFamily, input),
    scopeStatus,
    templateFamily
  });
}

export function buildPlannerOutput(input) {
  const rankedFamilies = scoreFamilies(
    [input.prompt, input.budget, input.timeline, input.audience, input.style, input.useCaseType].filter(Boolean).join(" ")
  );
  const normalizedIntent = buildFallbackIntent(input);
  const suggestedOptions = buildSuggestedOptions(
    input,
    rankedFamilies.length ? rankedFamilies : defaultFamilies.map((templateFamily) => ({ templateFamily, score: 0 }))
  );

  return {
    normalizedIntent,
    suggestedOptions
  };
}

export function mergePlannerOutput(fallbackOutput, aiOutput) {
  if (!aiOutput) return fallbackOutput;

  const mergedIntent = normalizedIntentSchema.parse({
    ...fallbackOutput.normalizedIntent,
    ...aiOutput.normalizedIntent,
    deliverables:
      Array.isArray(aiOutput.normalizedIntent?.deliverables) && aiOutput.normalizedIntent.deliverables.length
        ? unique(aiOutput.normalizedIntent.deliverables).slice(0, 8)
        : fallbackOutput.normalizedIntent.deliverables,
    whyItFits:
      Array.isArray(aiOutput.normalizedIntent?.whyItFits) && aiOutput.normalizedIntent.whyItFits.length
        ? unique(aiOutput.normalizedIntent.whyItFits).slice(0, 5)
        : fallbackOutput.normalizedIntent.whyItFits
  });

  return {
    normalizedIntent: mergedIntent,
    suggestedOptions:
      Array.isArray(aiOutput.suggestedOptions) && aiOutput.suggestedOptions.length >= 2
        ? aiOutput.suggestedOptions.slice(0, 3)
        : fallbackOutput.suggestedOptions
  };
}
