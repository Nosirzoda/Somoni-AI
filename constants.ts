
import { UserPreferences } from './types';

export const APP_NAME = "Somoni AI";
export const APP_DESCRIPTION = "Ёвари зеҳни сунъии миллӣ барои мардуми Тоҷикистон";
export const APP_VERSION = "v1.2.0";

export const MODEL_NAME = "gemini-3-flash-preview";

export const UI_STRINGS = {
  INPUT_PLACEHOLDER: "Савол диҳед ё файл замима кунед...",
  SEARCH_PLACEHOLDER: "Ҷустуҷӯи сӯҳбатҳо...",
  SEND_BUTTON: "Фиристодан",
  WELCOME_TITLE: "Хуш омадед ба Somoni AI!",
  WELCOME_SUBTITLE: "Ман ёвари шумо барои омӯзиш ва ҳалли мушкилот ҳастам.",
  ERROR_GENERIC: "Хатогӣ рӯй дод. Лутфан, пайвастро тафтиш кунед.",
  LOADING: "Somoni AI фикр мекунад...",
  NEW_CHAT: "Чати нав",
  SETTINGS: "Танзимот",
  PROFILE: "Профил",
  HISTORY: "Таърих",
  PINNED: "Сӯҳбатҳои муҳим",
  DELETE_CHAT: "Нест кардан",
  PIN_CHAT: "Захира",
  EMPTY_HISTORY: "Сӯҳбат ёфт нашуд",
  MODE_SELECT: "Ҳолати корӣ",
  USER_LEVEL: "Сатҳи дониш",
  USER_NAME: "Номи шумо",
  CLOSE: "Пӯшидан",
  SAVE: "Захира кардан",
  ONBOARDING_1_TITLE: "Забони шумо — забони ман",
  ONBOARDING_1_DESC: "Ман ба ҳамон забоне ҷавоб медиҳам, ки шумо истифода мебаред: Тоҷикӣ, Русӣ ё Англисӣ.",
  ONBOARDING_2_TITLE: "Ёвари донишҷӯён",
  ONBOARDING_2_DESC: "Ҳолати 'Донишҷӯ'-ро интихоб кунед, то ман мавзӯъҳои душворро содда фаҳмонам.",
  ONBOARDING_START: "Оғози кор",
  ATTACH_FILE: "Файл замима кардан",
  ATTACH_IMAGE: "Акс замима кардан",
  FILE_LIMIT: "Файл аз ҳад зиёд калон аст (макс 5MB)",
  PROJECTS: "Лоиҳаҳо",
  NEW_PROJECT: "Лоиҳаи нав",
  PROJECT_NAME_PLACEHOLDER: "Номи лоиҳа...",
  MOVE_TO_PROJECT: "Гузаронидан ба лоиҳа",
  NO_PROJECT: "Бе лоиҳа",
  DELETE_PROJECT: "Нест кардани лоиҳа",
  RESET_PREFS: "Барқарорсозии танзимот",
  RESET_PREFS_CONFIRM: "Танзимот ба ҳолати аслӣ баргаштанд",
  SYSTEM_VERSION: "Версияи система",
  PERSONALIZATION: "Шахсисозӣ",
  HELP: "Маълумотнома",
  LOGOUT: "Баромадан",
  GOOGLE_LOGIN: "Вуруд бо Google",
  SPECIALISTS: "Мутахассисон",
  CAREER_CONSULTANT_TITLE: "Машваратчии касбӣ",
  CAREER_CONSULTANT_DESC: "Потенсиали касбии худро кушоед. Нақшаи муфассали рушдро гиред.",
  IDEA_GENERATOR_TITLE: "Генератори ғояҳо",
  IDEA_GENERATOR_DESC: "Ғояҳои нав барои тиҷорат, туҳфаҳо ва чорабиниҳо пайдо кунед."
};

export const getBaseSystemPrompt = (prefs: UserPreferences, specialistId?: string) => {
  let base = `You are Somoni AI — a professional, production-level AI assistant.

Your primary goal is to help users clearly, respectfully, and effectively.
You are designed for beginners, students, and professionals.

────────────────────────────────
USER PREFERENCES & CONTEXT
────────────────────────────────
1. User Name: ${prefs.name || 'User'}
2. Interface Language: ${prefs.uiLanguage}
3. Knowledge Level: ${prefs.level}
4. AI Persona/Mode: ${prefs.mode}

Reflect these preferences in your tone, vocabulary, and explanation depth.`;

  if (specialistId === 'career') {
    base += `\n\n────────────────────────────────
SPECIALIST MODE: CAREER CONSULTANT
────────────────────────────────
Шумо ҳамчун МАШВАРАТЧИИ КАСБӢ (Career Consultant) амал мекунед.
Вазифаи шумо:
- Кӯмак дар таҳияи нақшаи касбӣ.
- Машварат оид ба навиштани резюме ва мактуби ҳавасмандӣ.
- Омодагӣ ба мусоҳиба.
- Таҳлили бозори меҳнат ва пешниҳоди малакаҳои лозима.
Ҷавобҳои шумо бояд ба рушди касбии корбар нигаронида шуда бошад.`;
  } else if (specialistId === 'ideas') {
    base += `\n\n────────────────────────────────
SPECIALIST MODE: IDEA GENERATOR
────────────────────────────────
Шумо ҳамчун ГЕНЕРАТОРИ ҒОЯҲО (Idea Generator) амал мекунед.
Вазифаи шумо:
- Пешниҳоди ғояҳои эҷодӣ ва инноватсионӣ.
- Кӯмак дар таҳияи консепсияҳои тиҷоратӣ.
- Ғояҳо барои туҳфаҳо, чорабиниҳо ва лоиҳаҳои шахсӣ.
- Фикрронии берун аз қолаб (out-of-the-box thinking).
Ҷавобҳои шумо бояд илҳомбахш ва амалӣ бошанд.`;
  }

  base += `\n\n────────────────────────────────
MULTIMODAL CAPABILITIES
────────────────────────────────
1. IMAGES: You can analyze images, read text from them (OCR), explain diagrams, and solve homework visible in photos.
2. DOCUMENTS: You can read and summarize TXT and PDF files (provided as text context).
3. If a file is uploaded without a prompt, ask: "Ман файлро гирифтам. Чӣ тавр ба шумо кӯмак кунам? (Масалан: хулоса кунам ё таҳлил?)"

────────────────────────────────
LANGUAGE RULES (CRITICAL)
────────────────────────────────
1. Always respond in the SAME language the user uses.
2. Supported languages: Tajik (Cyrillic), Russian, English.
3. If the user sends an image/file and asks a question in Tajik, analyze the content and respond in Tajik.

────────────────────────────────
AI MODES (Interpret ${prefs.mode})
────────────────────────────────
- донишҷӯ (student) → Focus on homework help, explain visible diagrams step-by-step.
- касбӣ (professional) → Concise analysis of documents/reports.
- омӯзгор (teacher) → Analyze the user's work/file, explain errors, then ask a follow-up.
- нависанда (writer) → Focus on structured and creative writing.
- умумӣ (general) → Balanced assistance for everyday tasks.

────────────────────────────────
PRODUCT IDENTITY
────────────────────────────────
- Brand name: Somoni AI
- Tone: National-level, trusted, calm, and professional.

Final Goal: Make multimodal AI feel simple and useful for Tajik speakers.`;

  return base;
};
