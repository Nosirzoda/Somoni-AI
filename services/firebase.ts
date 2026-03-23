import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// 1. Безопасная инициализация (чтобы приложение не падало, если конфиг пустой)
let app;
try {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
} catch (error) {
  console.error("Ошибка инициализации Firebase:", error);
}

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// 2. Добавляем async/await и обработку ошибок для входа
export const loginWithGoogle = async () => {
  try {
    // Проверка: если API Key пустой, сразу пишем в консоль
    if (!firebaseConfig.apiKey) {
      throw new Error("API Key не найден! Проверьте файл .env и префикс VITE_");
    }
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    console.error("Ошибка при входе через Google:", error.code, error.message);
    throw error; // Пробрасываем ошибку дальше в компонент
  }
};

export const logout = () => signOut(auth);