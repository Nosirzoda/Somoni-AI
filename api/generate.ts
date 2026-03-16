import { IncomingMessage, ServerResponse } from 'http';
import { GoogleGenAI } from '@google/genai';
import { getBaseSystemPrompt, MODEL_NAME } from '../constants';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { history, prompt, prefs, currentAttachments, specialistId } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      res.status(500).json({ error: 'Missing GEMINI_API_KEY on server' });
      return;
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

    const contents = (history || []).map((msg: any) => {
      const parts: any[] = [{ text: msg.content }];
      if (msg.attachments) {
        msg.attachments.forEach((att: any) => {
          if (att.type && att.type.startsWith('image/')) {
            parts.push({ inlineData: { mimeType: att.type, data: att.data } });
          }
        });
      }
      return { role: msg.role === 'user' ? 'user' : 'model', parts };
    });

    const currentParts: any[] = [];
    let finalPromptText = prompt || '';
    if (currentAttachments) {
      currentAttachments.forEach((att: any) => {
        if (att.type === 'text/plain' || att.type === 'application/pdf') {
          finalPromptText = `[DOCUMENT: ${att.name}]\n${att.data}\n\n${finalPromptText}`;
        }
      });
    }
    currentParts.push({ text: finalPromptText });
    if (currentAttachments) {
      currentAttachments.forEach((att: any) => {
        if (att.type && att.type.startsWith('image/')) {
          currentParts.push({ inlineData: { mimeType: att.type, data: att.data } });
        }
      });
    }

    contents.push({ role: 'user', parts: currentParts });

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents,
      config: {
        systemInstruction: getBaseSystemPrompt(prefs, specialistId),
        temperature: 0.6,
        topP: 0.95,
      }
    });

    const text = response.text;
    if (!text) {
      res.status(502).json({ error: 'Empty response from Gemini' });
      return;
    }

    res.status(200).json({ text });
  } catch (err: any) {
    console.error('API /api/generate error:', err?.message || err);
    res.status(500).json({ error: 'Server error' });
  }
}
