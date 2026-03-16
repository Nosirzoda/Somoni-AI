
import React, { useState } from 'react';
import { ChatSession, Project, AuthUser, SpecialistId } from '../types';
import { UI_STRINGS } from '../constants';
import Logo from './Logo';

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
  projects,
  movingSessionId,
  setMovingSessionId,
  isNested 
}) => {
  const isActive = activeSessionId === session.id;
  
  return (
    <div className={`group relative flex items-center transition-all ${isNested ? 'pl-4' : 'px-1'}`}>
      <button
        onClick={() => {
          onSelectSession(session.id);
          if (window.innerWidth < 1024) onToggleSidebar();
        }}
        className={`flex-1 text-left px-3 py-2.5 rounded-xl transition-all flex items-center gap-3
          ${isActive 
            ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-400 border-l-4 border-emerald-600' 
            : 'text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-900 border-l-4 border-transparent'}
        `}
      >
        <i className={`fa-regular ${session.isPinned ? 'fa-star text-amber-500' : 'fa-message'} text-xs ${isActive ? 'text-emerald-500' : 'text-gray-500 dark:text-slate-500'}`}></i>
        <span className="text-xs truncate font-bold pr-12">
          {session.title || UI_STRINGS.NEW_CHAT}
        </span>
      </button>
      
      <div className="absolute right-3 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all">
        <button 
          onClick={(e) => { e.stopPropagation(); setMovingSessionId(movingSessionId === session.id ? null : session.id); }}
          className="p-1.5 text-gray-400 dark:text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          title={UI_STRINGS.MOVE_TO_PROJECT}
        >
          <i className="fa-solid fa-folder-tree text-[10px]"></i>
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); onTogglePin(session.id); }}
          className="p-1.5 text-gray-400 dark:text-slate-500 hover:text-amber-500 transition-colors"
          title={UI_STRINGS.PIN_CHAT}
        >
          <i className={`fa-solid fa-star text-[10px] ${session.isPinned ? 'text-amber-400' : ''}`}></i>
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); onDeleteSession(session.id); }}
          className="p-1.5 text-gray-400 dark:text-slate-500 hover:text-red-500 transition-colors"
          title={UI_STRINGS.DELETE_CHAT}
        >
          <i className="fa-solid fa-trash-can text-[10px]"></i>
        </button>

        {movingSessionId === session.id && (
          <div className="absolute top-full right-0 mt-1 w-48 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-xl rounded-xl z-50 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="px-3 py-1 text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest border-b border-gray-50 dark:border-slate-800 mb-1">
              {UI_STRINGS.MOVE_TO_PROJECT}
            </div>
            <button 
              onClick={() => { onMoveToProject(session.id, null); setMovingSessionId(null); }}
              className="w-full text-left px-3 py-2 text-xs hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-gray-700 dark:text-slate-300 font-bold flex items-center gap-2"
            >
              <i className="fa-solid fa-ban text-[10px]"></i> {UI_STRINGS.NO_PROJECT}
            </button>
            {projects.map(p => (
              <button 
                key={p.id}
                onClick={() => { onMoveToProject(session.id, p.id); setMovingSessionId(null); }}
                className="w-full text-left px-3 py-2 text-xs hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-gray-700 dark:text-slate-300 font-bold flex items-center gap-2"
              >
                <i className="fa-solid fa-folder text-[10px] text-emerald-500"></i> {p.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

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
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  sessions, 
  projects,
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
  isOpen,
  onToggle
}) => {
  const [search, setSearch] = useState('');
  const [isProjectsExpanded, setIsProjectsExpanded] = useState(true);
  const [isCareerExpanded, setIsCareerExpanded] = useState(true);
  const [isIdeasExpanded, setIsIdeasExpanded] = useState(true);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [movingSessionId, setMovingSessionId] = useState<string | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const filtered = sessions.filter(s => 
    s.title.toLowerCase().includes(search.toLowerCase()) || 
    s.messages.some(m => m.content.toLowerCase().includes(search.toLowerCase()))
  );

  const pinnedSessions = filtered.filter(s => s.isPinned);
  const unassignedSessions = filtered.filter(s => !s.isPinned && !s.projectId && !s.specialistId);
  const careerSessions = filtered.filter(s => s.specialistId === 'career' && !s.isPinned);
  const ideasSessions = filtered.filter(s => s.specialistId === 'ideas' && !s.isPinned);

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProjectName.trim()) {
      onCreateProject(newProjectName.trim());
      setNewProjectName('');
      setIsCreatingProject(false);
    }
  };

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
      {isOpen && <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden" onClick={onToggle} />}

      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-slate-950 border-r border-gray-100 dark:border-slate-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:block ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-4 flex items-center justify-between">
            <Logo showText size={32} />
            <button onClick={onToggle} className="lg:hidden text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200" aria-label="Close Sidebar"><i className="fa-solid fa-xmark text-lg"></i></button>
          </div>

          <div className="px-4 space-y-3">
            <button onClick={() => { onNewChat(); if (window.innerWidth < 1024) onToggle(); }} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-100 group">
              <i className="fa-solid fa-plus transition-transform group-hover:rotate-90"></i>
              {UI_STRINGS.NEW_CHAT}
            </button>
            <div className="relative">
              <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-slate-500 text-xs"></i>
              <input 
                type="text" 
                placeholder={UI_STRINGS.SEARCH_PLACEHOLDER}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 focus:border-emerald-300 dark:focus:border-emerald-700 rounded-xl py-2 pl-9 pr-4 text-xs focus:outline-none transition-all text-gray-950 dark:text-slate-100 font-medium"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
            {/* Pinned Section */}
            {pinnedSessions.length > 0 && (
              <div>
                <h3 className="text-[10px] uppercase tracking-widest text-gray-600 dark:text-slate-500 font-black px-3 mb-2 flex items-center gap-2">
                  <i className="fa-solid fa-star text-amber-500"></i> {UI_STRINGS.PINNED}
                </h3>
                {pinnedSessions.map(s => <SessionItem key={s.id} session={s} {...sharedProps} />)}
              </div>
            )}

            {/* Specialists Section */}
            {user && (
              <div className="space-y-4">
                <h3 className="text-[10px] uppercase tracking-widest text-gray-600 dark:text-slate-500 font-black px-3 flex items-center gap-2">
                  <i className="fa-solid fa-user-tie text-emerald-500"></i> {UI_STRINGS.SPECIALISTS}
                </h3>
                
                {/* Career Consultant */}
                <div className="group/spec">
                  <div className="flex items-center justify-between px-3 py-1 group-hover/spec:bg-gray-50 dark:group-hover/spec:bg-slate-900 rounded-lg transition-colors">
                    <button 
                      onClick={() => setIsCareerExpanded(!isCareerExpanded)}
                      className="flex items-center gap-2 text-[11px] font-black text-gray-500 dark:text-slate-500 hover:text-emerald-600 transition-colors"
                    >
                      <i className={`fa-solid fa-chevron-right text-[8px] transition-transform ${isCareerExpanded ? 'rotate-90' : ''}`}></i>
                      <i className="fa-solid fa-briefcase text-rose-500"></i> {UI_STRINGS.CAREER_CONSULTANT_TITLE}
                    </button>
                    <button 
                      onClick={() => onNewSpecialistChat('career')}
                      className="opacity-0 group-hover/spec:opacity-100 p-1 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-md transition-all"
                      title="Чати нав"
                    >
                      <i className="fa-solid fa-plus text-[10px]"></i>
                    </button>
                  </div>
                  {isCareerExpanded && (
                    <div className="space-y-1 mt-1">
                      {careerSessions.length === 0 ? (
                        <div className="pl-8 py-1 text-[10px] text-gray-400 italic">Сӯҳбат нест</div>
                      ) : careerSessions.map(s => (
                        <SessionItem key={s.id} session={s} isNested {...sharedProps} />
                      ))}
                    </div>
                  )}
                </div>

                {/* Idea Generator */}
                <div className="group/spec">
                  <div className="flex items-center justify-between px-3 py-1 group-hover/spec:bg-gray-50 dark:group-hover/spec:bg-slate-900 rounded-lg transition-colors">
                    <button 
                      onClick={() => setIsIdeasExpanded(!isIdeasExpanded)}
                      className="flex items-center gap-2 text-[11px] font-black text-gray-500 dark:text-slate-500 hover:text-emerald-600 transition-colors"
                    >
                      <i className={`fa-solid fa-chevron-right text-[8px] transition-transform ${isIdeasExpanded ? 'rotate-90' : ''}`}></i>
                      <i className="fa-solid fa-lightbulb text-orange-500"></i> {UI_STRINGS.IDEA_GENERATOR_TITLE}
                    </button>
                    <button 
                      onClick={() => onNewSpecialistChat('ideas')}
                      className="opacity-0 group-hover/spec:opacity-100 p-1 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-md transition-all"
                      title="Чати нав"
                    >
                      <i className="fa-solid fa-plus text-[10px]"></i>
                    </button>
                  </div>
                  {isIdeasExpanded && (
                    <div className="space-y-1 mt-1">
                      {ideasSessions.length === 0 ? (
                        <div className="pl-8 py-1 text-[10px] text-gray-400 italic">Сӯҳбат нест</div>
                      ) : ideasSessions.map(s => (
                        <SessionItem key={s.id} session={s} isNested {...sharedProps} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Projects Section */}
            <div>
              <div className="flex items-center justify-between px-3 mb-2">
                <button 
                  onClick={() => setIsProjectsExpanded(!isProjectsExpanded)}
                  className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-gray-600 dark:text-slate-500 font-black hover:text-emerald-600 transition-colors"
                >
                  <i className={`fa-solid fa-chevron-right transition-transform ${isProjectsExpanded ? 'rotate-90' : ''}`}></i>
                  <i className="fa-solid fa-folder-open text-emerald-500"></i> {UI_STRINGS.PROJECTS}
                </button>
                <button 
                  onClick={() => setIsCreatingProject(true)}
                  className="w-5 h-5 rounded-md bg-gray-100 dark:bg-slate-900 text-gray-600 dark:text-slate-400 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all"
                  title={UI_STRINGS.NEW_PROJECT}
                >
                  <i className="fa-solid fa-plus text-[10px]"></i>
                </button>
              </div>

              {isCreatingProject && (
                <form onSubmit={handleCreateProject} className="px-3 mb-3 animate-in slide-in-from-top-2">
                  <input 
                    autoFocus
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    placeholder={UI_STRINGS.PROJECT_NAME_PLACEHOLDER}
                    className="w-full bg-gray-50 dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700 rounded-lg px-2 py-1.5 text-xs focus:outline-none font-bold text-gray-950 dark:text-slate-100"
                    onBlur={() => !newProjectName && setIsCreatingProject(false)}
                  />
                </form>
              )}

              {isProjectsExpanded && (
                <div className="space-y-4">
                  {projects.map(project => {
                    const projectChats = filtered.filter(s => s.projectId === project.id && !s.isPinned);
                    return (
                      <div key={project.id} className="group/project">
                        <div className="flex items-center justify-between px-3 py-1 group-hover/project:bg-gray-50 dark:group-hover/project:bg-slate-900 rounded-lg transition-colors">
                          <span className="text-[11px] font-black text-gray-500 dark:text-slate-500 flex items-center gap-2">
                             <i className="fa-solid fa-circle text-[6px] text-emerald-400"></i>
                             {project.name}
                          </span>
                          <div className="flex items-center gap-1">
                            <button 
                              onClick={() => onNewChatInProject(project.id)}
                              className="opacity-0 group-hover/project:opacity-100 p-1 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-md transition-all"
                              title="Чати нав дар лоиҳа"
                            >
                              <i className="fa-solid fa-plus text-[10px]"></i>
                            </button>
                            <button 
                              onClick={() => onDeleteProject(project.id)}
                              className="opacity-0 group-hover/project:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all"
                            >
                              <i className="fa-solid fa-xmark text-[10px]"></i>
                            </button>
                          </div>
                        </div>
                        <div className="space-y-1">
                          {projectChats.length === 0 ? (
                            <div className="pl-8 py-1 text-[10px] text-gray-400 italic">Сӯҳбат нест</div>
                          ) : projectChats.map(s => (
                            <SessionItem key={s.id} session={s} isNested {...sharedProps} />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Recent/Unassigned History */}
            <div>
              <h3 className="text-[10px] uppercase tracking-widest text-gray-600 dark:text-slate-500 font-black px-3 mb-2">{UI_STRINGS.HISTORY}</h3>
              {unassignedSessions.length === 0 && projects.length === 0 ? (
                <div className="px-3 py-6 text-center text-xs text-gray-500 dark:text-slate-600 italic font-medium">{UI_STRINGS.EMPTY_HISTORY}</div>
              ) : unassignedSessions.map(s => <SessionItem key={s.id} session={s} {...sharedProps} />)}
            </div>
          </div>

          <div className="p-4 border-t border-gray-100 dark:border-slate-800 space-y-2">
            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl border transition-all
                    ${isUserMenuOpen ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 shadow-sm' : 'bg-gray-50 dark:bg-slate-900 border-gray-100 dark:border-slate-800 hover:bg-gray-100 dark:hover:bg-slate-800'}
                  `}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt={user.displayName || 'User'} className="w-8 h-8 rounded-full border border-white dark:border-slate-700 shadow-sm" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-bold text-xs">
                        {user.displayName?.charAt(0) || 'U'}
                      </div>
                    )}
                    <div className="text-left overflow-hidden">
                      <p className="text-xs font-black text-gray-900 dark:text-slate-100 truncate">{user.displayName || 'Корбар'}</p>
                      <p className="text-[10px] text-gray-500 dark:text-slate-500 truncate">{user.email}</p>
                    </div>
                  </div>
                  <i className={`fa-solid fa-chevron-up text-[10px] text-gray-400 transition-transform ${isUserMenuOpen ? 'rotate-0' : 'rotate-180'}`}></i>
                </button>

                {isUserMenuOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setIsUserMenuOpen(false)} 
                    />
                    <div className="absolute bottom-full left-0 w-full mb-2 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-2xl rounded-2xl py-2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-200">
                      <button 
                        onClick={() => { onOpenSettings('personalization'); setIsUserMenuOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-gray-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors font-bold"
                      >
                        <i className="fa-solid fa-wand-magic-sparkles text-emerald-500 w-4"></i>
                        {UI_STRINGS.PERSONALIZATION}
                      </button>
                      <button 
                        onClick={() => { onOpenSettings('general'); setIsUserMenuOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-gray-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors font-bold"
                      >
                        <i className="fa-solid fa-gear text-gray-400 w-4"></i>
                        {UI_STRINGS.SETTINGS}
                      </button>
                      <div className="h-px bg-gray-100 dark:bg-slate-800 my-1 mx-2" />
                      <button 
                        onClick={() => { onLogout(); setIsUserMenuOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-bold"
                      >
                        <i className="fa-solid fa-right-from-bracket w-4"></i>
                        {UI_STRINGS.LOGOUT}
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button 
                onClick={onLogin}
                className="w-full flex items-center justify-center gap-3 px-3 py-3 text-sm bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-xl transition-all font-black shadow-sm"
              >
                <i className="fa-brands fa-google text-emerald-600"></i> {UI_STRINGS.GOOGLE_LOGIN}
              </button>
            )}
            
            <button onClick={() => onOpenSettings()} className="w-full flex items-center gap-3 px-3 py-3 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-xl transition-colors font-bold">
              <i className="fa-solid fa-user-gear text-gray-500 dark:text-slate-500"></i> {UI_STRINGS.SETTINGS}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
