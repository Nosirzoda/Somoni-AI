import type { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import { getBaseSystemPrompt } from '../constants'; // MODEL_NAME больше не нужен здесь, так как мы прописали модель напрямую
import { Message, UserPreferences, Attachment, ChatRole } from '../types';

interface GenerateRequestBody {
  history: Message[];
  prompt: string;
  prefs: UserPreferences;
  currentAttachments?: Attachment[];
  specialistId?: string;
}

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { history, prompt, prefs, currentAttachments, specialistId } = req.body as GenerateRequestBody;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('Критическая ошибка: GEMINI_API_KEY не найден в .env');
      return res.status(500).json({ error: 'Missing GEMINI_API_KEY on server' });
    }

    // Инициализируем AI с твоим ключом
    const ai = new GoogleGenAI({ apiKey });

    // 1. Формируем историю сообщений для модели
    const contents = (history || []).map((msg: Message) => {
      const parts: any[] = [{ text: msg.content }];

      // Добавляем изображения из истории, если они есть
      msg.attachments?.forEach((att) => {
        if (att.type?.startsWith('image/')) {
          parts.push({ 
            inlineData: { mimeType: att.type, data: att.data } 
          });
        }
      });

      return { 
        role: msg.role === ChatRole.USER ? 'user' : 'model', 
        parts 
      };
    });

    // 2. Формируем текущее (новое) сообщение пользователя
    const currentParts: any[] = [];
    let finalPromptText = prompt || '';

    // Обрабатываем текстовые файлы и PDF (добавляем их содержимое в текст промпта)
    currentAttachments?.forEach((att) => {
      if (att.type === 'text/plain' || att.type === 'application/pdf') {
        finalPromptText = `[DOCUMENT: ${att.name}]\n${att.data}\n\n${finalPromptText}`;
      }
    });

    currentParts.push({ text: finalPromptText });

    // Добавляем текущие изображения
    currentAttachments?.forEach((att) => {
      if (att.type?.startsWith('image/')) {
        currentParts.push({ 
          inlineData: { mimeType: att.type, data: att.data } 
        });
      }
    });

    contents.push({ role: 'user', parts: currentParts });

    // 3. Вызываем генерацию (Используем Gemini 3.1 Flash Lite)
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite-preview", // Та самая экономичная и мощная модель
      contents: contents,
      config: {
        systemInstruction: getBaseSystemPrompt(prefs, specialistId),
        temperature: 0.6,
        topP: 0.95,
      }
    });

    // ВАЖНО: В новом SDK .text — это свойство, а не метод!
    const text = response.text;

    if (!text) {
      return res.status(502).json({ error: 'Empty response from Gemini' });
    }

    // Возвращаем результат
    return res.status(200).json({ text });

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('Ошибка в /api/generate:', message);
    return res.status(500).json({ error: 'Ошибка сервера при генерации ответа' });
  }
}