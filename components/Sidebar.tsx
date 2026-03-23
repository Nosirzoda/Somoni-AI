import React, { useMemo, useState, useCallback } from 'react';
import { ChatSession, Project, AuthUser, SpecialistId } from '../types';
import { UI_STRINGS } from '../constants';
import Logo from './Logo';

// --- Sub-component: SessionItem ---
interface SessionItemProps {
  session: ChatSession;
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onTogglePin: (id: string) => void;
  onDeleteSession: (id: string) => void;
  onMoveToProject: (sessionId: string, projectId: string | null) => void;
  onToggleSidebar: () => void;
  projects: Project[];
  movingSessionId: string | null;
  setMovingSessionId: (id: string | null) => void;
  isNested?: boolean;
}

const SessionItem: React.FC<SessionItemProps> = ({
  session,
  activeSessionId,
  onSelectSession,
  onTogglePin,
  onDeleteSession,
  onMoveToProject,
  onToggleSidebar,
  projects = [],
  movingSessionId,
  setMovingSessionId,
  isNested = false,
}) => {
  if (!session) return null;
  
  const isActive = activeSessionId === session.id;
  const isMoving = movingSessionId === session.id;

  return (
    <div className={`group relative flex flex-col transition-all ${isNested ? 'pl-4' : 'px-1'}`}>
      <div className="flex items-center w-full">
        <button
          type="button"
          onClick={() => {
            onSelectSession(session.id);
            if (window.innerWidth < 1024) onToggleSidebar();
          }}
          className={`flex-1 text-left px-3 py-2.5 rounded-xl transition-all flex items-center gap-3 ${
            isActive
              ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-400 border-l-4 border-emerald-600'
              : 'text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-900 border-l-4 border-transparent'
          }`}
        >
          <i className={`fa-regular ${session.isPinned ? 'fa-star text-amber-500' : 'fa-message'} text-[10px] ${isActive ? 'text-emerald-500' : 'opacity-50'}`} />
          <span className="text-xs truncate font-bold flex-1">
            {session.title || UI_STRINGS.NEW_CHAT}
          </span>
        </button>

        {/* Actions Menu */}
        <div className="absolute right-2 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity bg-inherit">
          <button
            type="button"
            onClick={(e) => { 
              e.stopPropagation(); 
              setMovingSessionId(isMoving ? null : session.id); 
            }}
            className={`p-1.5 rounded-lg transition-colors ${isMoving ? 'text-emerald-600 bg-emerald-50' : 'text-gray-400 hover:text-emerald-600 hover:bg-gray-50'}`}
            title={UI_STRINGS.MOVE_TO_PROJECT}
          >
            <i className="fa-solid fa-folder-tree text-[10px]" />
          </button>
          
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onTogglePin(session.id); }}
            className="p-1.5 text-gray-400 hover:text-amber-500 transition-colors"
            title={UI_STRINGS.PIN_CHAT}
          >
            <i className={`fa-solid fa-star text-[10px] ${session.isPinned ? 'text-amber-400' : ''}`} />
          </button>
          
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onDeleteSession(session.id); }}
            className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
            title={UI_STRINGS.DELETE_CHAT}
          >
            <i className="fa-solid fa-trash-can text-[10px]" />
          </button>
        </div>
      </div>

      {/* Move to Project Dropdown */}
      {isMoving && (
        <div className="mt-1 mx-3 p-2 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-xl rounded-xl z-50 animate-in fade-in slide-in-from-top-2">
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2 px-2">Интихоби лоиҳа:</p>
          <button
            onClick={() => { onMoveToProject(session.id, null); setMovingSessionId(null); }}
            className="w-full text-left px-2 py-1.5 text-[10px] font-bold text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-md flex items-center gap-2"
          >
            <i className="fa-solid fa-ban text-[8px]" /> {UI_STRINGS.NO_PROJECT}
          </button>
          {projects.map((p) => (
            <button
              key={p.id}
              onClick={() => { onMoveToProject(session.id, p.id); setMovingSessionId(null); }}
              className="w-full text-left px-2 py-1.5 text-[10px] font-bold text-gray-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-md flex items-center gap-2"
            >
              <i className="fa-solid fa-folder text-emerald-500 text-[8px]" /> {p.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// --- Main Component: Sidebar ---
interface SidebarProps {
  sessions: ChatSession[];
  projects: Project[];
  activeSessionId: string | null;
  user: AuthUser | null;
  onLogin: () => void;
  onLogout: () => void;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onNewChatInProject: (projectId: string) => void;
  onDeleteSession: (id: string) => void;
  onTogglePin: (id: string) => void;
  onOpenSettings: (tab?: 'general' | 'personalization') => void;
  onCreateProject: (name: string) => void;
  onDeleteProject: (id: string) => void;
  onMoveToProject: (sessionId: string, projectId: string | null) => void;
  onNewSpecialistChat: (specialistId: SpecialistId) => void;
  onOpenPrivacy: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  sessions = [],
  projects = [],
  activeSessionId,
  user,
  onLogin,
  onLogout,
  onSelectSession,
  onNewChat,
  onNewChatInProject,
  onDeleteSession,
  onTogglePin,
  onOpenSettings,
  onCreateProject,
  onDeleteProject,
  onMoveToProject,
  onNewSpecialistChat,
  onOpenPrivacy,
  isOpen,
  onToggle,
}) => {
  const [search, setSearch] = useState('');
  const [isProjectsExpanded, setIsProjectsExpanded] = useState(true);
  const [isCareerExpanded, setIsCareerExpanded] = useState(true);
  const [isIdeasExpanded, setIsIdeasExpanded] = useState(true);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [movingSessionId, setMovingSessionId] = useState<string | null>(null);

  const safeSearch = useMemo(() => (search || '').trim().toLowerCase(), [search]);

  const filtered = useMemo(() => {
    return sessions.filter((session) => {
      const title = String(session.title || '').toLowerCase();
      const hasMatchInMessages = (session.messages || []).some(m => 
        String(m.content || '').toLowerCase().includes(safeSearch)
      );
      return title.includes(safeSearch) || hasMatchInMessages;
    });
  }, [sessions, safeSearch]);

  const pinnedSessions = filtered.filter(s => s.isPinned);
  const unassignedSessions = filtered.filter(s => !s.isPinned && !s.projectId && !s.specialistId);
  
  const handleProjectSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (newProjectName.trim()) {
      onCreateProject(newProjectName.trim());
      setNewProjectName('');
      setIsCreatingProject(false);
    }
  }, [newProjectName, onCreateProject]);

  const sharedProps = {
    activeSessionId,
    onSelectSession,
    onTogglePin,
    onDeleteSession,
    onMoveToProject,
    onToggleSidebar: onToggle,
    projects,
    movingSessionId,
    setMovingSessionId
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-300" 
          onClick={onToggle} 
        />
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-slate-950 border-r border-gray-100 dark:border-slate-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          
          {/* Logo Section */}
          <div className="p-5 flex items-center justify-between">
            <Logo showText size={32} />
            <button onClick={onToggle} className="lg:hidden p-2 text-gray-400 hover:text-gray-600">
              <i className="fa-solid fa-xmark text-lg" />
            </button>
          </div>

          {/* Main Actions */}
          <div className="px-4 space-y-3">
            <button
              onClick={() => { onNewChat(); if (window.innerWidth < 1024) onToggle(); }}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3 px-4 rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-emerald-100 dark:shadow-none transition-all active:scale-95"
            >
              <i className="fa-solid fa-plus" /> {UI_STRINGS.NEW_CHAT}
            </button>
            
            <div className="relative group">
              <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[10px] group-focus-within:text-emerald-500 transition-colors" />
              <input
                type="text"
                placeholder={UI_STRINGS.SEARCH_PLACEHOLDER}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-gray-50 dark:bg-slate-900 border border-transparent focus:border-emerald-500/30 rounded-xl py-2.5 pl-9 pr-4 text-xs outline-none transition-all font-medium text-gray-700 dark:text-slate-200"
              />
            </div>
          </div>

          {/* Scrollable List */}
          <div className="flex-1 overflow-y-auto px-2 py-6 space-y-8 custom-scrollbar">
            
            {/* Pinned Chats */}
            {pinnedSessions.length > 0 && (
              <div className="space-y-1">
                <h3 className="px-4 text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-2">
                  <i className="fa-solid fa-star text-amber-400 mr-2" /> {UI_STRINGS.PINNED}
                </h3>
                {pinnedSessions.map(s => <SessionItem key={s.id} session={s} {...sharedProps} />)}
              </div>
            )}

            {/* Specialists Section */}
            {user && (
              <div className="space-y-5">
                <h3 className="px-4 text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                  <i className="fa-solid fa-user-tie text-emerald-500 mr-2" /> {UI_STRINGS.SPECIALISTS}
                </h3>
                
                {/* Career Specialist */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between px-4 group/spec">
                    <button 
                      onClick={() => setIsCareerExpanded(!isCareerExpanded)} 
                      className="text-[11px] font-black text-gray-500 dark:text-slate-400 hover:text-emerald-600 flex items-center gap-2 transition-colors"
                    >
                      <i className={`fa-solid fa-chevron-right text-[7px] transition-transform duration-200 ${isCareerExpanded ? 'rotate-90' : ''}`} />
                      <span className="opacity-80">💼</span> {UI_STRINGS.CAREER_CONSULTANT_TITLE}
                    </button>
                    <button onClick={() => onNewSpecialistChat('career')} className="opacity-0 group-hover/spec:opacity-100 text-emerald-600 p-1 hover:bg-emerald-50 rounded-md transition-all">
                      <i className="fa-solid fa-plus text-[10px]" />
                    </button>
                  </div>
                  {isCareerExpanded && filtered.filter(s => s.specialistId === 'career' && !s.isPinned).map(s => (
                    <SessionItem key={s.id} session={s} isNested {...sharedProps} />
                  ))}
                </div>

                {/* Ideas Specialist */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between px-4 group/spec">
                    <button 
                      onClick={() => setIsIdeasExpanded(!isIdeasExpanded)} 
                      className="text-[11px] font-black text-gray-500 dark:text-slate-400 hover:text-emerald-600 flex items-center gap-2 transition-colors"
                    >
                      <i className={`fa-solid fa-chevron-right text-[7px] transition-transform duration-200 ${isIdeasExpanded ? 'rotate-90' : ''}`} />
                      <span className="opacity-80">💡</span> {UI_STRINGS.IDEA_GENERATOR_TITLE}
                    </button>
                    <button onClick={() => onNewSpecialistChat('ideas')} className="opacity-0 group-hover/spec:opacity-100 text-emerald-600 p-1 hover:bg-emerald-50 rounded-md transition-all">
                      <i className="fa-solid fa-plus text-[10px]" />
                    </button>
                  </div>
                  {isIdeasExpanded && filtered.filter(s => s.specialistId === 'ideas' && !s.isPinned).map(s => (
                    <SessionItem key={s.id} session={s} isNested {...sharedProps} />
                  ))}
                </div>
              </div>
            )}

            {/* Projects Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-4">
                <button 
                  onClick={() => setIsProjectsExpanded(!isProjectsExpanded)} 
                  className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2 hover:text-emerald-600 transition-colors"
                >
                  <i className={`fa-solid fa-chevron-right transition-transform duration-200 ${isProjectsExpanded ? 'rotate-90' : ''}`} />
                  <i className="fa-solid fa-folder-open text-emerald-500/70" /> {UI_STRINGS.PROJECTS}
                </button>
                <button 
                  onClick={() => setIsCreatingProject(true)} 
                  className="w-5 h-5 rounded-lg bg-gray-50 dark:bg-slate-900 text-gray-400 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-all"
                >
                  <i className="fa-solid fa-plus text-[10px]" />
                </button>
              </div>

              {isCreatingProject && (
                <form onSubmit={handleProjectSubmit} className="px-4 animate-in slide-in-from-top-2">
                  <input 
                    autoFocus 
                    value={newProjectName} 
                    onChange={e => setNewProjectName(e.target.value)} 
                    onBlur={() => !newProjectName && setIsCreatingProject(false)} 
                    className="w-full bg-gray-50 dark:bg-slate-900 border border-emerald-500/30 rounded-xl px-3 py-2 text-xs outline-none font-bold text-gray-700 dark:text-slate-200" 
                    placeholder="Номи лоиҳа..." 
                  />
                </form>
              )}

              {isProjectsExpanded && projects.map(project => (
                <div key={project.id} className="space-y-1">
                  <div className="flex items-center justify-between px-4 py-1.5 group/project hover:bg-gray-50/50 dark:hover:bg-slate-900/50 rounded-xl mx-1 transition-colors">
                    <span className="text-[11px] font-black text-gray-500 dark:text-slate-400 truncate flex items-center gap-2">
                      <i className="fa-solid fa-circle text-emerald-500 text-[6px]" /> {project.name}
                    </span>
                    <div className="flex items-center gap-1 opacity-0 group-hover/project:opacity-100 transition-opacity">
                      <button onClick={() => onNewChatInProject(project.id)} className="p-1 text-emerald-600 hover:bg-emerald-50 rounded-md"><i className="fa-solid fa-plus text-[10px]" /></button>
                      <button onClick={() => onDeleteProject(project.id)} className="p-1 text-gray-400 hover:text-red-500"><i className="fa-solid fa-trash-can text-[10px]" /></button>
                    </div>
                  </div>
                  {filtered.filter(s => s.projectId === project.id && !s.isPinned).map(s => (
                    <SessionItem key={s.id} session={s} isNested {...sharedProps} />
                  ))}
                </div>
              ))}
            </div>

            {/* General History */}
            <div className="space-y-1">
              <h3 className="px-4 text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-2">
                {UI_STRINGS.HISTORY}
              </h3>
              {unassignedSessions.length > 0 ? (
                unassignedSessions.map(s => <SessionItem key={s.id} session={s} {...sharedProps} />)
              ) : (
                <p className="px-4 py-2 text-[10px] text-gray-400 italic">Таърих холӣ аст</p>
              )}
            </div>
          </div>

          {/* User & Footer Section */}
          <div className="p-4 border-t border-gray-100 dark:border-slate-800 space-y-3 bg-gray-50/30 dark:bg-slate-950/30">
            {user ? (
              <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-2.5 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-3 truncate">
                  <div className="relative">
                    <img 
                      src={user.photoURL || 'https://ui-avatars.com/api/?name=' + (user.displayName || 'U')} 
                      className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-700 shadow-sm" 
                      alt="Avatar"
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
                  </div>
                  <div className="truncate">
                    <p className="text-[11px] font-black text-gray-900 dark:text-slate-100 truncate">{user.displayName || 'Корбар'}</p>
                    <p className="text-[9px] text-gray-500 dark:text-slate-500 truncate">{user.email}</p>
                  </div>
                </div>
                <button 
                  onClick={onLogout} 
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                  title={UI_STRINGS.LOGOUT}
                >
                  <i className="fa-solid fa-right-from-bracket text-xs" />
                </button>
              </div>
            ) : (
              <button 
                onClick={onLogin} 
                className="w-full py-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl font-black text-xs flex items-center justify-center gap-3 hover:bg-gray-50 transition-all shadow-sm active:scale-95"
              >
                <i className="fa-brands fa-google text-emerald-600 text-sm" /> {UI_STRINGS.GOOGLE_LOGIN}
              </button>
            )}
            
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => onOpenSettings()} 
                className="flex items-center justify-center gap-2 py-2.5 text-[10px] font-black text-gray-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-900 hover:text-emerald-600 rounded-xl border border-transparent hover:border-gray-100 dark:hover:border-slate-800 transition-all uppercase tracking-widest"
              >
                <i className="fa-solid fa-gear" /> {UI_STRINGS.SETTINGS}
              </button>
              
              <button 
                onClick={onOpenPrivacy} 
                className="flex items-center justify-center gap-2 py-2.5 text-[10px] font-black text-gray-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-900 hover:text-emerald-600 rounded-xl border border-transparent hover:border-gray-100 dark:hover:border-slate-800 transition-all uppercase tracking-widest"
              >
                <i className="fa-solid fa-shield-halved" /> Махфият
              </button>
            </div>
          </div>
        </div>
      </aside>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1e293b;
        }
      `}</style>
    </>
  );
};

export default Sidebar;