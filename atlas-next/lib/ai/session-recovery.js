// Server-side session recovery from URL token
import { decodeSessionToken, saveGenerationSession, getGenerationSession } from "@/lib/ai/sessions";

export async function getOrRecoverSession(sessionId, token) {
  // Try normal lookup first
  let session = await getGenerationSession(sessionId);
  if (session) return session;

  // Fallback: decode from URL token
  if (token) {
    const recovered = decodeSessionToken(token);
    if (recovered && recovered.sessionId === sessionId) {
      // Re-seed into memory and Supabase for future requests
      await saveGenerationSession(recovered);
      return recovered;
    }
  }

  return null;
}
