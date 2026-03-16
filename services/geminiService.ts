
import { getBaseSystemPrompt, MODEL_NAME } from "../constants";
import { Message, ChatRole, UserPreferences, Attachment } from "../types";

/**
 * SERVICE LAYER SECURITY ARCHITECTURE:
 * The Gemini API key is exclusively sourced from import.meta.env.VITE_GEMINI_API_KEY.
 * This environment variable is managed by the Vite build process from .env.local file.
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

    if (!resp.ok) {
      throw new Error('API_ERROR');
    }

    const json = await resp.json();
    if (!json?.text) throw new Error('EMPTY_RESPONSE');
    return json.text as string;
  } catch (error) {
    console.error('Client generateAiResponse error:', error);
    throw new Error('SEC_GENERIC_API_FAIL');
  }
};
    