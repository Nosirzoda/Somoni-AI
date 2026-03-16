
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import Header from './components/Header';
import ChatWindow from './components/ChatWindow';
import MessageInput from './components/MessageInput';
import Sidebar from './components/Sidebar';
import SettingsModal from './components/SettingsModal';
import OnboardingModal from './components/OnboardingModal';
import Logo from './components/Logo';
import { Message, ChatRole, ChatSession, UserPreferences, Attachment, Project, AuthUser, SpecialistId } from './types';
import { generateAiResponse } from './services/geminiService';
import { auth, loginWithGoogle, logout } from './services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { UI_STRINGS } from './constants';

const App: React.FC = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState<'general' | 'personalization'>('general');
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  
  const [prefs, setPrefs] = useState<UserPreferences>({
    name: '',
    level: 'ибтидоӣ',
    mode: 'умумӣ',
    uiLanguage: 'tg',
    responseStyle: 'simple',
    theme: 'light',
    hasSeenOnboarding: false
  });

  // Load Prefs, Projects, Sessions & Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName,
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL
        });
      } else {
        setUser(null);
      }
      setIsAuthLoading(false);
    });

    const saved = localStorage.getItem('somoni_ai_prefs');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Migrations
        if (parsed.level === 'beginner') parsed.level = 'ибтидоӣ';
        if (parsed.level === 'intermediate') parsed.level = 'миёна';
        if (parsed.level === 'advanced') parsed.level = 'пешрафта';
        if (parsed.mode === 'general') parsed.mode = 'умумӣ';
        if (parsed.mode === 'student') parsed.mode = 'донишҷӯ';
        if (parsed.mode === 'professional') parsed.mode = 'касбӣ';
        if (parsed.mode === 'teacher') parsed.mode = 'омӯзгор';
        if (parsed.mode === 'writer') parsed.mode = 'нависанда';
        
        // Remove 'about' if it exists in old localStorage data
        if ('about' in parsed) delete parsed.about;

        setPrefs(parsed);
      } catch (e) {
        console.error("Error loading prefs", e);
      }
    }
    
    const savedProjects = localStorage.getItem('somoni_ai_projects');
    if (savedProjects) {
      try {
        const parsed = JSON.parse(savedProjects);
        setProjects(parsed.map((p: Project) => ({ ...p, createdAt: new Date(p.createdAt) })));
      } catch {
        console.error("Error loading projects");
      }
    }

    const savedChats = localStorage.getItem('somoni_ai_sessions');
    if (savedChats) {
      try {
        const parsed = JSON.parse(savedChats);
        const hydrated = parsed.map((s: ChatSession) => ({
          ...s,
          updatedAt: new Date(s.updatedAt),
          messages: s.messages.map((m: Message) => ({ ...m, timestamp: new Date(m.timestamp) }))
        }));
        setSessions(hydrated);
        if (hydrated.length > 0) setActiveSessionId(hydrated[0].id);
      } catch {
        console.error("Error loading sessions");
      }
    }
    
    return () => {
      unsubscribe();
    };
  }, []);

  // Persistence
  useEffect(() => {
    localStorage.setItem('somoni_ai_prefs', JSON.stringify(prefs));
    if (prefs.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [prefs]);

  useEffect(() => {
    localStorage.setItem('somoni_ai_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('somoni_ai_sessions', JSON.stringify(sessions));
  }, [sessions]);

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (e) {
      console.error("Login failed", e);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {
      console.error("Logout failed", e);
    }
  };

  const activeSession = useMemo(() => sessions.find(s => s.id === activeSessionId) || null, [sessions, activeSessionId]);

  const handleUpdatePrefs = (update: Partial<UserPreferences>) => setPrefs(prev => ({ ...prev, ...update }));

  const handleOnboardingComplete = (name: string) => {
    handleUpdatePrefs({ name, hasSeenOnboarding: true });
  };

  const createChat = useCallback((projectId?: string, specialistId?: SpecialistId) => {
    const newId = Date.now().toString();
    const newSession: ChatSession = { 
      id: newId, 
      title: specialistId === 'career' ? UI_STRINGS.CAREER_CONSULTANT_TITLE : (specialistId === 'ideas' ? UI_STRINGS.IDEA_GENERATOR_TITLE : ""), 
      messages: [], 
      updatedAt: new Date(), 
      isPinned: false, 
      mode: prefs.mode,
      projectId: projectId,
      specialistId: specialistId
    };
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newId);
    setError(null);
    return newId;
  }, [prefs.mode]);

  const handleNewChat = useCallback(() => createChat(), [createChat]);
  const handleNewChatInProject = useCallback((projectId: string) => createChat(projectId), [createChat]);
  const handleNewSpecialistChat = useCallback((specialistId: SpecialistId) => createChat(undefined, specialistId), [createChat]);

  const handleSendMessage = useCallback(async (text: string, currentAttachments: Attachment[]) => {
    let currentId = activeSessionId;
    if (!currentId) {
      currentId = createChat();
    }

    const userMsg: Message = { 
      id: Date.now().toString(), 
      role: ChatRole.USER, 
      content: text, 
      timestamp: new Date(),
      attachments: currentAttachments.length > 0 ? currentAttachments : undefined
    };
    
    setSessions(prev => prev.map(s => s.id === currentId ? { 
      ...s, 
      messages: [...s.messages, userMsg], 
      updatedAt: new Date(), 
      title: s.messages.length === 0 ? (text.slice(0, 30) || s.title) : s.title 
    } : s));

    setIsLoading(true);
    setError(null);

    try {
      const history = sessions.find(s => s.id === currentId)?.messages || [];
      const specialistId = sessions.find(s => s.id === currentId)?.specialistId;
      const aiResponse = await generateAiResponse(history, text, prefs, currentAttachments, specialistId);
      const aiMsg: Message = { id: (Date.now() + 1).toString(), role: ChatRole.MODEL, content: aiResponse, timestamp: new Date() };
      setSessions(prev => prev.map(s => s.id === currentId ? { ...s, messages: [...s.messages, aiMsg], updatedAt: new Date() } : s));
    } catch {
      setError(UI_STRINGS.ERROR_GENERIC);
    } finally {
      setIsLoading(false);
    }
  }, [activeSessionId, sessions, prefs, createChat]);

  const handleCreateProject = useCallback((name: string) => {
    const newProject: Project = { id: Date.now().toString(), name, createdAt: new Date() };
    setProjects(prev => [...prev, newProject]);
  }, []);

  const handleDeleteProject = useCallback((id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    setSessions(prev => prev.map(s => s.projectId === id ? { ...s, projectId: undefined } : s));
  }, []);

  const handleMoveToProject = useCallback((sessionId: string, projectId: string | null) => {
    setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, projectId: projectId || undefined } : s));
  }, []);

  if (isAuthLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-white dark:bg-slate-950">
        <div className="flex flex-col items-center gap-6 animate-in fade-in duration-700">
          <Logo size={80} />
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-1 border-2 border-gray-100 dark:border-slate-800 rounded-full overflow-hidden relative">
              <div className="absolute inset-0 bg-emerald-600 w-1/2 animate-[loading_1.5s_infinite_ease-in-out]"></div>
            </div>
            <p className="text-[10px] font-black text-gray-400 dark:text-slate-600 uppercase tracking-widest">Пайвастшавӣ...</p>
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

  const handleOpenSettings = (tab: 'general' | 'personalization' = 'general') => {
    setSettingsTab(tab);
    setIsSettingsOpen(true);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-slate-900 overflow-hidden font-sans text-gray-950 dark:text-slate-50">
      {!prefs.hasSeenOnboarding && <OnboardingModal onComplete={handleOnboardingComplete} />}
      
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
        onDeleteSession={id => { setSessions(p => p.filter(s => s.id !== id)); if (activeSessionId === id) setActiveSessionId(null); }}
        onTogglePin={id => setSessions(p => p.map(s => s.id === id ? { ...s, isPinned: !s.isPinned } : s))}
        onOpenSettings={handleOpenSettings}
        onCreateProject={handleCreateProject}
        onDeleteProject={handleDeleteProject}
        onMoveToProject={handleMoveToProject}
        onNewSpecialistChat={handleNewSpecialistChat}
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
          {error && <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 px-4 py-3 rounded-2xl border border-red-100 dark:border-red-900/30 shadow-xl text-sm flex items-center gap-3 animate-bounce z-50">
            <i className="fa-solid fa-circle-exclamation text-red-500"></i> {error}
          </div>}
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
    </div>
  );
};

export default App;
