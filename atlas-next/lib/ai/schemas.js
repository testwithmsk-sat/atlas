import { z } from "zod";

export const supportedTemplateFamilies = [
  "invitation_or_stationery",
  "sign_or_poster",
  "planner_or_checklist",
  "business_document",
  "tracker_or_workbook",
  "bundle_pack"
];

export const supportedOutputFormats = ["PDF", "PNG", "DOCX", "XLSX"];
export const supportedSampleStatuses = ["missing", "needs_selection", "ready"];
export const supportedBundleStatuses = ["draft", "ready", "paid"];

export const generationOptionSchema = z.object({
  id: z.string().min(2),
  title: z.string().min(4).max(90),
  description: z.string().min(12).max(220),
  templateFamily: z.enum(supportedTemplateFamilies),
  outputFormats: z.array(z.enum(supportedOutputFormats)).min(1).max(4),
  rationale: z.string().min(12).max(180)
});

export const normalizedIntentSchema = z.object({
  intentSummary: z.string().min(24).max(320),
  recommendedTitle: z.string().min(6).max(100),
  recommendedDescription: z.string().min(32).max(420),
  audienceProfile: z.string().min(4).max(120),
  useCaseType: z.string().min(4).max(120),
  styleDirection: z.string().min(4).max(80),
  deliverables: z.array(z.string().min(3).max(90)).min(3).max(8),
  whyItFits: z.array(z.string().min(8).max(180)).min(2).max(5),
  scopeStatus: z.enum(["clear", "needs_guidance"]),
  templateFamily: z.enum(supportedTemplateFamilies)
});

export const aiPlannerOutputSchema = z.object({
  normalizedIntent: normalizedIntentSchema,
  suggestedOptions: z.array(generationOptionSchema).min(2).max(3)
});

export const intentRequestSchema = z.object({
  prompt: z.string().trim().min(12).max(1600),
  budget: z.string().trim().max(120).optional().or(z.literal("")),
  timeline: z.string().trim().max(120).optional().or(z.literal("")),
  audience: z.string().trim().max(120).optional().or(z.literal("")),
  style: z.string().trim().max(120).optional().or(z.literal("")),
  useCaseType: z.string().trim().max(160).optional().or(z.literal(""))
});

export const paidBundleOfferSchema = z.object({
  bundleName: z.string().min(6).max(120),
  description: z.string().min(12).max(220),
  priceLabel: z.string().min(2).max(24),
  amountUsd: z.number().positive(),
  includedFormats: z.array(z.enum(supportedOutputFormats)).min(1).max(4)
});

export const intentResponseSchema = z.object({
  sessionId: z.string().min(6),
  normalizedIntent: normalizedIntentSchema,
  templateFamily: z.enum(supportedTemplateFamilies),
  suggestedOptions: z.array(generationOptionSchema).min(2).max(3),
  sampleStatus: z.enum(supportedSampleStatuses),
  paidBundleOffer: paidBundleOfferSchema
});

export const generationSessionSchema = z.object({
  sessionId: z.string().min(6),
  customerEmail: z.string().email().optional().or(z.literal("")).or(z.null()),
  prompt: z.string().min(12),
  normalizedIntent: normalizedIntentSchema,
  templateFamily: z.enum(supportedTemplateFamilies),
  suggestedOptions: z.array(generationOptionSchema).min(2).max(3),
  sampleStatus: z.enum(supportedSampleStatuses),
  bundleStatus: z.enum(supportedBundleStatuses),
  createdAt: z.string().min(10)
});

export const generatedAssetSchema = z.object({
  id: z.union([z.number().int().positive(), z.string().min(1)]),
  sessionId: z.string().min(6),
  assetRole: z.string().min(3).max(60),
  format: z.enum(supportedOutputFormats),
  fileName: z.string().min(4).max(180),
  storageBucket: z.string().min(3).max(80),
  storagePath: z.string().min(3).max(220),
  isPaid: z.boolean(),
  createdAt: z.string().min(10)
});
