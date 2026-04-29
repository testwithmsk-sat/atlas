import { generationSessionSchema } from "@/lib/ai/schemas";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

function getMemoryStore() {
  if (!globalThis.__atlasGenerationSessions) {
    globalThis.__atlasGenerationSessions = new Map();
  }

  return globalThis.__atlasGenerationSessions;
}

function toStoredSession(session) {
  return generationSessionSchema.parse({
    sessionId: session.sessionId,
    customerEmail: session.customerEmail || "",
    prompt: session.prompt,
    normalizedIntent: session.normalizedIntent,
    templateFamily: session.templateFamily,
    suggestedOptions: session.suggestedOptions,
    sampleStatus: session.sampleStatus,
    bundleStatus: session.bundleStatus || "draft",
    createdAt: session.createdAt || new Date().toISOString()
  });
}

function fromDatabaseRow(row) {
  if (!row?.session_id) return null;

  return generationSessionSchema.parse({
    sessionId: row.session_id,
    customerEmail: row.customer_email || "",
    prompt: row.prompt || "",
    normalizedIntent: row.normalized_intent || {},
    templateFamily: row.template_family || row.normalized_intent?.templateFamily || "planner_or_checklist",
    suggestedOptions: Array.isArray(row.suggested_options) ? row.suggested_options : [],
    sampleStatus: row.sample_status || "missing",
    bundleStatus: row.bundle_status || "draft",
    createdAt: row.created_at || new Date().toISOString()
  });
}

export async function saveGenerationSession(session) {
  const storedSession = toStoredSession(session);
  getMemoryStore().set(storedSession.sessionId, storedSession);

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return { ok: true, persisted: false };
  }

  const { error } = await supabase.from("generation_sessions").upsert(
    {
      session_id: storedSession.sessionId,
      customer_email: storedSession.customerEmail || null,
      prompt: storedSession.prompt,
      normalized_intent: storedSession.normalizedIntent,
      template_family: storedSession.templateFamily,
      suggested_options: storedSession.suggestedOptions,
      sample_status: storedSession.sampleStatus,
      bundle_status: storedSession.bundleStatus
    },
    { onConflict: "session_id" }
  );

  return {
    ok: !error,
    persisted: !error,
    error
  };
}

export async function getGenerationSession(sessionId) {
  if (!sessionId) return null;

  const memoryMatch = getMemoryStore().get(sessionId);
  if (memoryMatch) return memoryMatch;

  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("generation_sessions")
    .select("session_id, customer_email, prompt, normalized_intent, template_family, suggested_options, sample_status, bundle_status, created_at")
    .eq("session_id", sessionId)
    .single();

  if (error || !data) return null;

  const reconstructed = fromDatabaseRow(data);
  if (reconstructed) {
    getMemoryStore().set(reconstructed.sessionId, reconstructed);
  }

  return reconstructed;
}

export async function listGenerationSessionsForCustomer(email) {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  if (!normalizedEmail) return [];

  const memoryMatches = [...getMemoryStore().values()].filter((session) => session.customerEmail === normalizedEmail);
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return memoryMatches.sort((left, right) => right.createdAt.localeCompare(left.createdAt));
  }

  const { data, error } = await supabase
    .from("generation_sessions")
    .select("session_id, customer_email, prompt, normalized_intent, template_family, suggested_options, sample_status, bundle_status, created_at")
    .eq("customer_email", normalizedEmail)
    .order("created_at", { ascending: false });

  if (error || !data) {
    return memoryMatches.sort((left, right) => right.createdAt.localeCompare(left.createdAt));
  }

  const sessions = data.map(fromDatabaseRow).filter(Boolean);
  sessions.forEach((session) => {
    getMemoryStore().set(session.sessionId, session);
  });

  return sessions;
}
