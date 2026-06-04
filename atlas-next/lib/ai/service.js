import { intentRequestSchema, intentResponseSchema, supportedTemplateFamilies } from "@/lib/ai/schemas";
import { buildFallbackIntent, buildPlannerOutput, getPaidBundleOffer, mergePlannerOutput } from "@/lib/ai/matcher";

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

// ── Claude-powered intent parsing ─────────────────────────────────────────────
async function parseIntentWithClaude(requestInput) {
  const apiKey = process.env.ANTHROPIC_API_KEY || "";
  if (!apiKey) return null;

  const system = `You are the intent engine for The Digital Atlas — an AI-powered digital product generator.

Your job: read a user's request and return a precise JSON object that describes exactly what digital product to generate.

Template families (pick exactly one):
- invitation_or_stationery: invitations, RSVPs, save-the-dates, thank-you cards, menus, announcements
- sign_or_poster: signs, posters, banners, seating charts, welcome boards, display pieces
- planner_or_checklist: planners, checklists, timelines, schedules, itineraries, guides, how-to docs
- business_document: proposals, invoices, contracts, briefs, pitch decks, onboarding kits, reports
- tracker_or_workbook: budget trackers, spreadsheets, habit trackers, finance sheets, data workbooks
- bundle_pack: full kits combining multiple types above

Rules:
- Be HIGHLY SPECIFIC to the user's actual request — extract their event, guest count, timeline, style
- recommendedTitle must include their specific event/goal (e.g. "Sarah & Tom's Wedding Planning Bundle" or "60-Guest Outdoor Wedding Budget Tracker")
- deliverables must be specific real-world documents (e.g. "12-Month Wedding Countdown Checklist" not just "Checklist")
- whyItFits must explain WHY this fits their specific request (mention their details)
- scopeStatus: "clear" if the request is specific enough to generate, "needs_guidance" if truly ambiguous
- suggestedOptions: always provide 2-3 options even when scope is clear (alternatives user might want)
- Return ONLY valid JSON — no markdown, no explanation`;

  const prompt = `User's request: "${requestInput.prompt}"

Additional context:
- Budget: ${requestInput.budget || "not specified"}
- Timeline: ${requestInput.timeline || "not specified"}  
- Audience: ${requestInput.audience || "not specified"}
- Style preference: ${requestInput.style || "not specified"}
- Use case type: ${requestInput.useCaseType || "not specified"}

Return this exact JSON structure:
{
  "normalizedIntent": {
    "intentSummary": "1-2 sentences summarising exactly what this user needs and why",
    "recommendedTitle": "Specific title for their product (use their event/goal details)",
    "recommendedDescription": "2-3 sentences describing what this product will contain and how it helps them",
    "audienceProfile": "Who this is for (be specific: '80-guest outdoor wedding couple' not just 'couple')",
    "useCaseType": "Specific use case (e.g. 'Outdoor wedding planning' not just 'wedding')",
    "styleDirection": "Their style preference or sensible default for this type",
    "deliverables": [
      "Specific deliverable 1 — name it like a real document",
      "Specific deliverable 2",
      "Specific deliverable 3",
      "Specific deliverable 4 (optional)",
      "Specific deliverable 5 (optional)"
    ],
    "whyItFits": [
      "Why this direction fits their specific request",
      "What makes this format ideal for their goal",
      "How this addresses their timeline/budget/audience"
    ],
    "scopeStatus": "clear",
    "templateFamily": "planner_or_checklist"
  },
  "suggestedOptions": [
    {
      "id": "opt-1",
      "title": "Option 1 title",
      "description": "What this option focuses on",
      "templateFamily": "planner_or_checklist",
      "outputFormats": ["PDF"],
      "rationale": "Why someone might pick this option"
    },
    {
      "id": "opt-2", 
      "title": "Option 2 title",
      "description": "What this option focuses on",
      "templateFamily": "tracker_or_workbook",
      "outputFormats": ["XLSX", "PDF"],
      "rationale": "Why someone might pick this option"
    }
  ]
}`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1500,
        system,
        messages: [{ role: "user", content: prompt }]
      })
    });

    if (!response.ok) throw new Error(`Claude API ${response.status}`);
    const data = await response.json();
    const text = data.content?.[0]?.text || "";
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("No JSON in response");

    const parsed = JSON.parse(match[0]);

    // Validate template family
    const tf = parsed.normalizedIntent?.templateFamily;
    if (!supportedTemplateFamilies.includes(tf)) {
      parsed.normalizedIntent.templateFamily = "planner_or_checklist";
    }

    // Ensure suggestedOptions have valid templateFamily
    if (Array.isArray(parsed.suggestedOptions)) {
      parsed.suggestedOptions = parsed.suggestedOptions.map((opt, i) => ({
        ...opt,
        id: opt.id || `opt-${i + 1}`,
        templateFamily: supportedTemplateFamilies.includes(opt.templateFamily)
          ? opt.templateFamily
          : "planner_or_checklist",
        outputFormats: (opt.outputFormats || ["PDF"]).filter(f => ["PDF","PNG","DOCX","XLSX"].includes(f))
      }));
    }

    return parsed;
  } catch (err) {
    console.error("Claude intent parse failed:", err);
    return null;
  }
}

export async function createIntentRecommendation(payload, { customerEmail = "" } = {}) {
  const requestInput = intentRequestSchema.parse({
    prompt: normalizeString(payload?.prompt),
    budget: normalizeString(payload?.budget),
    timeline: normalizeString(payload?.timeline),
    audience: normalizeString(payload?.audience),
    style: normalizeString(payload?.style),
    useCaseType: normalizeString(payload?.useCaseType)
  });

  // Always try Claude first
  const claudeOutput = await parseIntentWithClaude(requestInput);
  const fallbackPlan  = buildPlannerOutput(requestInput);

  const output = claudeOutput
    ? { normalizedIntent: { ...buildFallbackIntent(requestInput), ...claudeOutput.normalizedIntent }, suggestedOptions: claudeOutput.suggestedOptions || fallbackPlan.suggestedOptions }
    : fallbackPlan;

  const normalizedIntent = output.normalizedIntent;
  const sessionId   = crypto.randomUUID();
  const sampleStatus = normalizedIntent.scopeStatus === "clear" ? "ready" : "needs_selection";
  const paidBundleOffer = getPaidBundleOffer(normalizedIntent.templateFamily);

  const response = intentResponseSchema.parse({
    sessionId,
    normalizedIntent,
    templateFamily: normalizedIntent.templateFamily,
    suggestedOptions: output.suggestedOptions,
    sampleStatus,
    paidBundleOffer
  });

  return {
    response,
    session: {
      sessionId,
      customerEmail,
      prompt: requestInput.prompt,
      normalizedIntent,
      templateFamily: response.templateFamily,
      suggestedOptions: response.suggestedOptions,
      sampleStatus: response.sampleStatus,
      bundleStatus: "draft",
      createdAt: new Date().toISOString()
    }
  };
}
