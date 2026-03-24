import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import ChatWindow from './components/ChatWindow';
import MessageInput from './components/MessageInput';
import Sidebar from './components/Sidebar';
import SettingsModal from './components/SettingsModal';
import OnboardingModal from './components/OnboardingModal';
import PrivacyPolicyModal from './src/components/PrivacyPolicyModal';
import Logo from './components/Logo';
import Privacy from './src/Privacy';
import { Analytics } from '@vercel/analytics/react';
import {
  Message,
  ChatRole,
  ChatSession,
  UserPreferences,
  Attachment,
  Project,
  AuthUser,
  SpecialistId,
} from './types';
import { generateAiResponse } from './services/geminiService';
import { auth, loginWithGoogle, logout } from './services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { UI_STRINGS } from './constants';

type FixedUserPreferences = UserPreferences & {
  hasAgreedToPrivacy: boolean;
};

const App: React.FC = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState<'general' | 'personalization'>('general');
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const [prefs, setPrefs] = useState<FixedUserPreferences>(() => ({
    name: '',
    level: 'ибтидоӣ',
    mode: 'умумӣ',
    uiLanguage: 'tg',
    responseStyle: 'simple',
    theme: 'light',
    hasSeenOnboarding: false,
    hasAgreedToPrivacy: false,
  }));

  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
    if (firebaseUser) {
      setUser({
        uid: firebaseUser.uid,
        displayName: firebaseUser.displayName,
        email: firebaseUser.email,
        photoURL: firebaseUser.photoURL,
      });
    } else {
      setUser(null);
    }
    setIsAuthLoading(false);
  });

  const saved = localStorage.getItem('somoni_ai_prefs');
  if (saved) {
    try {
      const parsed = JSON.parse(saved) as Record<string, unknown> & {
        about?: unknown;
      };

      if (parsed.level === 'beginner') parsed.level = 'ибтидоӣ';
      if (parsed.level === 'intermediate') parsed.level = 'миёна';
      if (parsed.level === 'advanced') parsed.level = 'пешрафта';

      if (parsed.mode === 'general') parsed.mode = 'умумӣ';
      if (parsed.mode === 'student') parsed.mode = 'донишҷӯ';
      if (parsed.mode === 'professional') parsed.mode = 'касбӣ';
      if (parsed.mode === 'teacher') parsed.mode = 'омӯзгор';
      if (parsed.mode === 'writer') parsed.mode = 'нависанда';

      if (parsed.hasAgreedToPrivacy === undefined) {
        parsed.hasAgreedToPrivacy = false;
      }

      if ('about' in parsed) {
        delete parsed.about;
      }

      setPrefs((prev) => ({
        ...prev,
        ...(parsed as Partial<FixedUserPreferences>),
      }));
    } catch (e) {
      console.error('Error loading prefs', e);
    }
  }

  const savedProjects = localStorage.getItem('somoni_ai_projects');
  if (savedProjects) {
    try {
      const parsed = JSON.parse(savedProjects);
      if (Array.isArray(parsed)) {
        const uniqueProjects = parsed.reduce((acc: Project[], current: Project) => {
          if (!acc.find((p) => p.id === current.id)) {
            acc.push({
              ...current,
              createdAt: new Date(current.createdAt),
            });
          }
          return acc;
        }, []);
        setProjects(uniqueProjects);
      }
    } catch (e) {
      console.error('Error loading projects', e);
    }
  }

  const savedChats = localStorage.getItem('somoni_ai_sessions');
  if (savedChats) {
    try {
      const parsed = JSON.parse(savedChats);
      if (Array.isArray(parsed)) {
        const uniqueSessions = parsed.reduce((acc: ChatSession[], current: ChatSession) => {
          if (!acc.find((s) => s.id === current.id)) {
            const uniqueMessages = (current.messages || []).reduce(
              (mAcc: Message[], mCurr: Message) => {
                if (!mAcc.find((m) => m.id === mCurr.id)) {
                  mAcc.push({
                    ...mCurr,
                    timestamp: new Date(mCurr.timestamp),
                  });
                }
                return mAcc;
              },
              []
            );

            acc.push({
              ...current,
              updatedAt: new Date(current.updatedAt),
              messages: uniqueMessages,
            });
          }
          return acc;
        }, []);

        setSessions(uniqueSessions);

        if (uniqueSessions.length > 0) {
          setActiveSessionId(uniqueSessions[0].id);
        }
      }
    } catch (e) {
      console.error('Error loading sessions', e);
    }
  }

  return () => {
    unsubscribe();
  };
}, []);

  useEffect(() => {
    if (!prefs.hasAgreedToPrivacy) {
      setIsPrivacyOpen(true);
    }
  }, [prefs.hasAgreedToPrivacy]);

  useEffect(() => {
    try {
      localStorage.setItem('somoni_ai_prefs', JSON.stringify(prefs));
    } catch (e) {
      console.error('Error saving prefs to localStorage', e);
    }

    if (prefs.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [prefs]);

  useEffect(() => {
    try {
      localStorage.setItem('somoni_ai_projects', JSON.stringify(projects));
    } catch (e) {
      console.error('Error saving projects to localStorage', e);
    }
  }, [projects]);

  useEffect(() => {
    try {
      localStorage.setItem('somoni_ai_sessions', JSON.stringify(sessions));
    } catch (e) {
      console.error('Error saving sessions to localStorage', e);
    }
  }, [sessions]);

  const activeSession = useMemo(
    () => sessions.find((s) => s.id === activeSessionId) || null,
    [sessions, activeSessionId]
  );

  const handleUpdatePrefs = useCallback(
    (update: Partial<FixedUserPreferences>) => {
      setPrefs((prev) => ({ ...prev, ...update }));
    },
    []
  );

  const handleAcceptPrivacy = useCallback(() => {
    handleUpdatePrefs({ hasAgreedToPrivacy: true });
    setIsPrivacyOpen(false);
  }, [handleUpdatePrefs]);

  const handleOnboardingComplete = useCallback(
    (name: string) => {
      handleUpdatePrefs({
        name,
        hasSeenOnboarding: true,
      });
    },
    [handleUpdatePrefs]
  );

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (e: unknown) {
      console.error('Login failed', e);
      const message = e instanceof Error ? e.message : 'Хатогӣ ҳангоми воридшавӣ';
      setError(message);
      setTimeout(() => setError(null), 5000);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {
      console.error('Logout failed', e);
    }
  };

  const createChat = useCallback(
    (projectId?: string, specialistId?: SpecialistId) => {
      const newId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

      const newSession: ChatSession = {
        id: newId,
        title:
          specialistId === 'career'
            ? UI_STRINGS.CAREER_CONSULTANT_TITLE
            : specialistId === 'ideas'
            ? UI_STRINGS.IDEA_GENERATOR_TITLE
            : '',
        messages: [],
        updatedAt: new Date(),
        isPinned: false,
        mode: prefs.mode,
        projectId,
        specialistId,
      };

      setSessions((prev) => [newSession, ...prev]);
      setActiveSessionId(newId);
      setError(null);

      return newId;
    },
    [prefs.mode]
  );

  const handleNewChat = useCallback(() => createChat(), [createChat]);

  const handleNewChatInProject = useCallback(
    (projectId: string) => createChat(projectId),
    [createChat]
  );

  const handleNewSpecialistChat = useCallback(
    (specialistId: SpecialistId) => createChat(undefined, specialistId),
    [createChat]
  );

  const handleSendMessage = useCallback(
    async (text: string, currentAttachments: Attachment[]) => {
      let currentId = activeSessionId;

      if (!currentId) {
        currentId = createChat();
      }

      const userMsg: Message = {
        id: `${Date.now()}-user-${Math.random().toString(36).substring(2, 9)}`,
        role: ChatRole.USER,
        content: text,
        timestamp: new Date(),
        attachments: currentAttachments.length > 0 ? currentAttachments : undefined,
      };

      setSessions((prev) =>
        prev.map((s) =>
          s.id === currentId
            ? {
                ...s,
                messages: [...s.messages, userMsg],
                updatedAt: new Date(),
                title: s.messages.length === 0 ? text.slice(0, 30) || s.title : s.title,
              }
            : s
        )
      );

      setIsLoading(true);
      setError(null);

      try {
        const currentSession = sessions.find((s) => s.id === currentId);
        const history = currentSession?.messages || [];
        const specialistId = currentSession?.specialistId;

        const aiResponse = await generateAiResponse(
          history,
          text,
          prefs,
          currentAttachments,
          specialistId
        );

        const aiMsg: Message = {
          id: `${Date.now()}-ai-${Math.random().toString(36).substring(2, 9)}`,
          role: ChatRole.MODEL,
          content: aiResponse,
          timestamp: new Date(),
        };

        setSessions((prev) =>
          prev.map((s) =>
            s.id === currentId
              ? {
                  ...s,
                  messages: [...s.messages, aiMsg],
                  updatedAt: new Date(),
                }
              : s
          )
        );
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : UI_STRINGS.ERROR_GENERIC;
        setError(message);
        setTimeout(() => setError(null), 5000);
      } finally {
        setIsLoading(false);
      }
    },
    [activeSessionId, sessions, prefs, createChat]
  );

  const handleCreateProject = useCallback((name: string) => {
    const newProject: Project = {
      id: `${Date.now()}-proj-${Math.random().toString(36).substring(2, 9)}`,
      name,
      createdAt: new Date(),
    };

    setProjects((prev) => [...prev, newProject]);
  }, []);

  const handleDeleteProject = useCallback((id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    setSessions((prev) =>
      prev.map((s) => (s.projectId === id ? { ...s, projectId: undefined } : s))
    );
  }, []);

  const handleMoveToProject = useCallback((sessionId: string, projectId: string | null) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, projectId: projectId || undefined } : s))
    );
  }, []);

  const handleOpenSettings = (tab: 'general' | 'personalization' = 'general') => {
    setSettingsTab(tab);
    setIsSettingsOpen(true);
  };

  if (isAuthLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-white dark:bg-slate-950">
        <div className="flex flex-col items-center gap-6 animate-in fade-in duration-700">
          <Logo size={80} />
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-1 border-2 border-gray-100 dark:border-slate-800 rounded-full overflow-hidden relative">
              <div className="absolute inset-0 bg-emerald-600 w-1/2 animate-[loading_1.5s_infinite_ease-in-out]"></div>
            </div>
            <p className="text-[10px] font-black text-gray-400 dark:text-slate-600 uppercase tracking-widest">
              Пайвастшавӣ...
            </p>
          </div>
        </div>

        <style>{`
          @keyframes loading {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(200%); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/privacy" element={<Privacy />} />
      <Route
        path="/"
        element={
          <div className="flex h-screen bg-gray-50 dark:bg-slate-900 overflow-hidden font-sans text-gray-950 dark:text-slate-50">
            {!prefs.hasSeenOnboarding && (
              <OnboardingModal onComplete={handleOnboardingComplete} />
            )}

            <Sidebar
              sessions={sessions}
              projects={projects}
              activeSessionId={activeSessionId}
              user={user}
              onLogin={handleLogin}
              onLogout={handleLogout}
              onSelectSession={setActiveSessionId}
              onNewChat={handleNewChat}
              onNewChatInProject={handleNewChatInProject}
              onDeleteSession={(id) => {
                setSessions((prev) => prev.filter((s) => s.id !== id));
                if (activeSessionId === id) {
                  setActiveSessionId(null);
                }
              }}
              onTogglePin={(id) =>
                setSessions((prev) =>
                  prev.map((s) => (s.id === id ? { ...s, isPinned: !s.isPinned } : s))
                )
              }
              onOpenSettings={handleOpenSettings}
              onCreateProject={handleCreateProject}
              onDeleteProject={handleDeleteProject}
              onMoveToProject={handleMoveToProject}
              onNewSpecialistChat={handleNewSpecialistChat}
              onOpenPrivacy={() => setIsPrivacyOpen(true)}
              isOpen={isSidebarOpen}
              onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
            />

            <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-white dark:bg-slate-950 shadow-2xl">
              <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

              <main className="flex-1 flex flex-col relative overflow-hidden">
                <ChatWindow
                  messages={activeSession?.messages || []}
                  isLoading={isLoading}
                  onSuggestionClick={(text) => handleSendMessage(text, [])}
                />

                {error && (
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 px-4 py-3 rounded-2xl border border-red-100 dark:border-red-900/30 shadow-xl text-sm flex items-center gap-3 animate-bounce z-50">
                    <i className="fa-solid fa-circle-exclamation text-red-500"></i>
                    <span>{error}</span>
                  </div>
                )}

                <MessageInput onSendMessage={handleSendMessage} isLoading={isLoading} />
              </main>
            </div>

            <SettingsModal
  isOpen={isSettingsOpen}
  onClose={() => setIsSettingsOpen(false)}
  prefs={prefs}
  onUpdatePrefs={handleUpdatePrefs}
  initialTab={settingsTab}
/>

<PrivacyPolicyModal
  isOpen={isPrivacyOpen}
  onClose={() => {
    if (!prefs.hasAgreedToPrivacy) return;
    setIsPrivacyOpen(false);
  }}
  onAccept={handleAcceptPrivacy}
  isMandatory={!prefs.hasAgreedToPrivacy}
/>

<Analytics />

            <PrivacyPolicyModal
              isOpen={isPrivacyOpen}
              onClose={() => {
                if (!prefs.hasAgreedToPrivacy) return;
                setIsPrivacyOpen(false);
              }}
              onAccept={handleAcceptPrivacy}
              isMandatory={!prefs.hasAgreedToPrivacy}
            />
          </div>
        }
      />
    </Routes>
  );

};

export default App;