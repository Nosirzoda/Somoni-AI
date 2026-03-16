
export enum ChatRole {
  USER = 'user',
  MODEL = 'model'
}

export type AiMode = 'умумӣ' | 'донишҷӯ' | 'касбӣ' | 'омӯзгор' | 'нависанда';
export type UserLevel = 'ибтидоӣ' | 'миёна' | 'пешрафта';

export interface Attachment {
  id: string;
  name: string;
  type: string;
  data: string; // Base64 for images, text for docs
  previewUrl?: string;
}

export interface UserPreferences {
  name: string;
  level: UserLevel;
  mode: AiMode;
  uiLanguage: 'tg' | 'ru' | 'en';
  responseStyle: 'simple' | 'detailed' | 'short';
  theme: 'light' | 'dark';
  hasSeenOnboarding: boolean;
}

export interface Project {
  id: string;
  name: string;
  createdAt: Date;
}

export interface Message {
  id: string;
  role: ChatRole;
  content: string;
  timestamp: Date;
  attachments?: Attachment[];
}

export type SpecialistId = 'career' | 'ideas';

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: Date;
  isPinned?: boolean;
  mode?: AiMode;
  projectId?: string;
  specialistId?: SpecialistId;
}

export interface AuthUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}
