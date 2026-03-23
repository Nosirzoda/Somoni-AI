import { initializeApp, getApp, getApps, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  Auth,
  User,
} from 'firebase/auth';

type FirebaseConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
};

type ViteEnv = Record<string, string | undefined>;

const env = (import.meta as ImportMeta & { env: ViteEnv }).env;

const firebaseConfig: FirebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY ?? '',
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN ?? '',
  projectId: env.VITE_FIREBASE_PROJECT_ID ?? '',
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET ?? '',
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '',
  appId: env.VITE_FIREBASE_APP_ID ?? '',
};

const requiredEnvKeys: Array<keyof FirebaseConfig> = [
  'apiKey',
  'authDomain',
  'projectId',
  'appId',
];

const validateFirebaseConfig = (): void => {
  const missingKeys = requiredEnvKeys.filter((key) => !firebaseConfig[key]?.trim());

  if (missingKeys.length > 0) {
    throw new Error(
      `Firebase config is missing: ${missingKeys.join(', ')}. Проверь .env файл.`
    );
  }
};

validateFirebaseConfig();

let app: FirebaseApp;
let auth: Auth;

try {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(app);
} catch (error) {
  console.error('Ошибка инициализации Firebase:', error);
  throw error;
}

const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: 'select_account',
});

const mapFirebaseAuthError = (error: unknown): string => {
  const firebaseError = error as { code?: string; message?: string };

  switch (firebaseError?.code) {
    case 'auth/unauthorized-domain':
      return 'Этот домен не разрешён в Firebase Authorized Domains.';
    case 'auth/operation-not-allowed':
      return 'Google вход не включён в Firebase Authentication.';
    case 'auth/popup-closed-by-user':
      return 'Окно входа было закрыто до завершения авторизации.';
    case 'auth/popup-blocked':
      return 'Браузер заблокировал popup вход через Google.';
    case 'auth/network-request-failed':
      return 'Ошибка сети. Проверь подключение к интернету.';
    case 'auth/invalid-api-key':
      return 'Неверный Firebase API key.';
    case 'auth/configuration-not-found':
      return 'Конфигурация Firebase Auth не найдена. Проверь настройки проекта.';
    case 'auth/cancelled-popup-request':
      return 'Предыдущий запрос входа был отменён.';
    case 'auth/internal-error':
      return 'Внутренняя ошибка Firebase Auth. Попробуй ещё раз.';
    default:
      return firebaseError?.message || 'Ошибка входа через Google.';
  }
};

export { auth, googleProvider };

export const loginWithGoogle = async (): Promise<User> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Ошибка при входе через Google:', error);
    throw new Error(mapFirebaseAuthError(error));
  }
};

export const logout = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Ошибка при выходе из аккаунта:', error);
    throw new Error('Не удалось выйти из аккаунта.');
  }
};