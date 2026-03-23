
import { Message, UserPreferences, Attachment } from "../types";

/**
 * SERVICE LAYER SECURITY ARCHITECTURE:
 * This client-side module does not hold the Gemini API key.
 * It sends requests to the server-side `/api/generate` endpoint, which keeps the key secret.
 */
export const generateAiResponse = async (
  history: Message[], 
  prompt: string, 
  prefs: UserPreferences,
  currentAttachments?: Attachment[],
  specialistId?: string
): Promise<string> => {
  // Forward request to serverless API to keep API key secret.
  try {
    const resp = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ history, prompt, prefs, currentAttachments, specialistId })
    });

    const json = await resp.json().catch(() => null);

    if (!resp.ok) {
      const msg = json?.error ?? `HTTP ${resp.status}`;
      throw new Error(`API_ERROR: ${msg}`);
    }

    if (!json?.text) {
      const msg = json?.error ?? 'Empty response from server';
      throw new Error(`EMPTY_RESPONSE: ${msg}`);
    }

    return json.text as string;
  } catch (error) {
    console.error('Client generateAiResponse error:', error);
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(message || 'SEC_GENERIC_API_FAIL');
  }
};
    