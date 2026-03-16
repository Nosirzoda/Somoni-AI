
import React from 'react';
import { UI_STRINGS, APP_VERSION } from '../constants';
import Logo from './Logo';
import { UserPreferences, AiMode, UserLevel } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefs: UserPreferences;
  onUpdatePrefs: (p: Partial<UserPreferences>) => void;
  initialTab?: 'general' | 'personalization';
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, prefs, onUpdatePrefs, initialTab = 'general' }) => {
  const [activeTab, setActiveTab] = React.useState<'general' | 'personalization'>(initialTab);

  React.useEffect(() => {
    if (isOpen) setActiveTab(initialTab);
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const handleReset = () => {
    if (confirm("Оё мутмаин ҳастед? Танзимот ба ҳолати аввала бармегарданд.")) {
      onUpdatePrefs({
        name: '',
        level: 'ибтидоӣ',
        mode: 'умумӣ',
        responseStyle: 'simple'
      });
      alert(UI_STRINGS.RESET_PREFS_CONFIRM);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200 border dark:border-slate-800">
        <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between bg-gray-50/50 dark:bg-slate-950/50">
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <Logo size={24} />
              <h2 className="text-xl font-black text-gray-950 dark:text-slate-100">{activeTab === 'general' ? UI_STRINGS.SETTINGS : UI_STRINGS.PERSONALIZATION}</h2>
            </div>
            <div className="flex gap-4 mt-4">
              <button 
                onClick={() => setActiveTab('general')}
                className={`text-[10px] font-black uppercase tracking-widest pb-1 border-b-2 transition-all ${activeTab === 'general' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-400 dark:text-slate-500'}`}
              >
                {UI_STRINGS.SETTINGS}
              </button>
              <button 
                onClick={() => setActiveTab('personalization')}
                className={`text-[10px] font-black uppercase tracking-widest pb-1 border-b-2 transition-all ${activeTab === 'personalization' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-400 dark:text-slate-500'}`}
              >
                {UI_STRINGS.PERSONALIZATION}
              </button>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-200 p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors self-start" aria-label="Close Settings">
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>
        
        <div className="p-6 space-y-8 max-h-[60vh] overflow-y-auto">
          {activeTab === 'general' ? (
            <>
              {/* Profile Section */}
              <section className="space-y-4">
                <h3 className="text-sm font-black text-gray-600 dark:text-slate-500 uppercase tracking-widest">{UI_STRINGS.PROFILE}</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-600 dark:text-slate-400 ml-1">{UI_STRINGS.USER_NAME}</label>
                    <input 
                      type="text"
                      value={prefs.name}
                      onChange={(e) => onUpdatePrefs({ name: e.target.value })}
                      placeholder="Номи худро нависед"
                      className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl p-3 focus:outline-none focus:border-emerald-500 transition-colors text-gray-950 dark:text-slate-100 font-bold"
                    />
                  </div>
                </div>
              </section>

              {/* Modes Section */}
              <section className="space-y-4">
                <h3 className="text-sm font-black text-gray-600 dark:text-slate-500 uppercase tracking-widest">{UI_STRINGS.MODE_SELECT}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(['умумӣ', 'донишҷӯ', 'касбӣ', 'омӯзгор', 'нависанда'] as AiMode[]).map(mode => (
                    <button
                      key={mode}
                      onClick={() => onUpdatePrefs({ mode })}
                      className={`p-3 rounded-xl border-2 text-xs font-black transition-all capitalize
                        ${prefs.mode === mode ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500 text-emerald-800 dark:text-emerald-400 shadow-sm' : 'bg-white dark:bg-slate-950 border-gray-200 dark:border-slate-800 text-gray-600 dark:text-slate-400 hover:border-gray-300 dark:hover:border-slate-700'}
                      `}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </section>

              {/* Level Section */}
              <section className="space-y-4">
                <h3 className="text-sm font-black text-gray-600 dark:text-slate-500 uppercase tracking-widest">{UI_STRINGS.USER_LEVEL}</h3>
                <div className="flex gap-2">
                  {(['ибтидоӣ', 'миёна', 'пешрафта'] as UserLevel[]).map(lvl => (
                    <button
                      key={lvl}
                      onClick={() => onUpdatePrefs({ level: lvl })}
                      className={`flex-1 p-3 rounded-xl border-2 text-[10px] font-black uppercase tracking-tighter transition-all
                        ${prefs.level === lvl ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500 text-emerald-800 dark:text-emerald-400 shadow-sm' : 'bg-white dark:bg-slate-950 border-gray-200 dark:border-slate-800 text-gray-600 dark:text-slate-400 hover:border-gray-300 dark:hover:border-slate-700'}
                      `}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </section>
            </>
          ) : (
            <>
              {/* Personalization Section */}
              <section className="space-y-4">
                <h3 className="text-sm font-black text-gray-600 dark:text-slate-500 uppercase tracking-widest">Намуди зоҳирӣ</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => onUpdatePrefs({ theme: 'light' })}
                    className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all ${prefs.theme === 'light' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-gray-100 dark:border-slate-800 hover:border-gray-200 dark:hover:border-slate-700'}`}
                  >
                    <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center border border-gray-100 dark:border-slate-700">
                      <i className="fa-solid fa-sun text-amber-500 text-xl"></i>
                    </div>
                    <span className="text-xs font-black text-gray-700 dark:text-slate-300">Рӯзона</span>
                  </button>
                  <button 
                    onClick={() => onUpdatePrefs({ theme: 'dark' })}
                    className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all ${prefs.theme === 'dark' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-gray-100 dark:border-slate-800 hover:border-gray-200 dark:hover:border-slate-700'}`}
                  >
                    <div className="w-12 h-12 rounded-full bg-gray-900 shadow-sm flex items-center justify-center">
                      <i className="fa-solid fa-moon text-blue-400 text-xl"></i>
                    </div>
                    <span className="text-xs font-black text-gray-700 dark:text-gray-300">Шабона</span>
                  </button>
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-sm font-black text-gray-600 dark:text-slate-500 uppercase tracking-widest">Услуби ҷавоб</h3>
                <div className="space-y-2">
                  {[
                    { id: 'simple', title: 'Оддӣ', desc: 'Ҷавобҳои кӯтоҳ ва фаҳмо' },
                    { id: 'detailed', title: 'Муфассал', desc: 'Таҳлили амиқ ва мисолҳо' },
                    { id: 'short', title: 'Хеле кӯтоҳ', desc: 'Танҳо маълумоти зарурӣ' }
                  ].map(style => (
                    <button 
                      key={style.id}
                      onClick={() => onUpdatePrefs({ responseStyle: style.id as UserPreferences['responseStyle'] })}
                      className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center justify-between ${prefs.responseStyle === style.id ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-gray-100 dark:border-slate-800 hover:border-gray-200 dark:hover:border-slate-700'}`}
                    >
                      <div>
                        <p className="text-sm font-black text-gray-900 dark:text-slate-100">{style.title}</p>
                        <p className="text-[10px] text-gray-500 dark:text-slate-500 font-bold">{style.desc}</p>
                      </div>
                      {prefs.responseStyle === style.id && <i className="fa-solid fa-circle-check text-emerald-500"></i>}
                    </button>
                  ))}
                </div>
              </section>
            </>
          )}

          <div className="pt-4 border-t border-gray-100 dark:border-slate-800 flex flex-col items-center gap-4">
            <div className="text-[10px] text-gray-400 dark:text-slate-600 font-black uppercase tracking-[0.2em] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              {UI_STRINGS.SYSTEM_VERSION}: {APP_VERSION}
            </div>
            
            <button 
              onClick={handleReset}
              className="w-full text-center text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 py-3 rounded-xl transition-all border border-transparent hover:border-red-100 dark:hover:border-red-900/30"
            >
              {UI_STRINGS.RESET_PREFS}
            </button>
          </div>
        </div>

        <div className="p-6 bg-gray-50/50 dark:bg-slate-950/50 border-t border-gray-100 dark:border-slate-800 flex justify-end">
          <button onClick={onClose} className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black transition-all shadow-lg shadow-emerald-200 dark:shadow-none active:scale-95">{UI_STRINGS.CLOSE}</button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
