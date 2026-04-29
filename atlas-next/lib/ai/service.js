import { NoObjectGeneratedError, Output, generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { aiPlannerOutputSchema, intentRequestSchema, intentResponseSchema } from "@/lib/ai/schemas";
import { buildFallbackIntent, buildPlannerOutput, getPaidBundleOffer, mergePlannerOutput } from "@/lib/ai/matcher";
import { buildIntentPrompt, getIntentSystemPrompt } from "@/lib/ai/prompts";
import { env, hasAIGatewayConfig, hasOpenAIConfig } from "@/lib/env";

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function hasIntentProvider() {
  return hasOpenAIConfig || hasAIGatewayConfig;
}

function resolveIntentModel() {
  if (hasOpenAIConfig) {
    return openai.chat("gpt-5.4", {
      apiKey: env.openaiApiKey
    });
  }

  return "openai/gpt-5.4";
}

async function generatePlannerOutput(requestInput, fallbackOutput) {
  if (!hasIntentProvider()) {
    return {
      output: fallbackOutput,
      generationMode: "fallback"
    };
  }

  try {
    const result = await generateText({
      model: resolveIntentModel(),
      system: getIntentSystemPrompt(),
      prompt: buildIntentPrompt(requestInput),
      output: Output.object({
        schema: aiPlannerOutputSchema
      }),
      providerOptions: {
        openai: {
          reasoningEffort: "low",
          systemMessageMode: "developer"
        }
      }
    });

    return {
      output: mergePlannerOutput(fallbackOutput, result.output),
      generationMode: "ai"
    };
  } catch (error) {
    if (NoObjectGeneratedError.isInstance?.(error)) {
      return {
        output: fallbackOutput,
        generationMode: "fallback"
      };
    }

    return {
      output: fallbackOutput,
      generationMode: "fallback"
    };
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
  const fallbackPlan = buildPlannerOutput(requestInput);
  const { output, generationMode } = await generatePlannerOutput(requestInput, fallbackPlan);
  const normalizedIntent = {
    ...buildFallbackIntent(requestInput),
    ...output.normalizedIntent,
    whyItFits:
      generationMode === "ai"
        ? output.normalizedIntent.whyItFits
        : [...output.normalizedIntent.whyItFits, "A local fallback planner was used because AI generation is not configured in this environment."]
  };
  const sessionId = crypto.randomUUID();
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
