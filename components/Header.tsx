
import React from 'react';
import Logo from './Logo';

interface HeaderProps {
  onToggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  return (
    <header className="bg-white dark:bg-slate-950 border-b border-gray-200 dark:border-slate-800 sticky top-0 z-30 transition-colors">
      <div className="mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={onToggleSidebar}
            className="lg:hidden w-10 h-10 flex items-center justify-center text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-900 rounded-lg transition-colors"
            aria-label="Toggle Sidebar"
          >
            <i className="fa-solid fa-bars text-xl"></i>
          </button>
          
          <div className="flex items-center gap-3">
            <Logo size={36} />
            <div className="hidden sm:block">
              <h1 className="text-lg font-black text-gray-950 dark:text-slate-100 leading-none">SOMONI AI</h1>
              <p className="text-[9px] uppercase tracking-widest text-emerald-700 dark:text-emerald-500 font-black mt-1">Зеҳни Сунъии Миллӣ</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-400 rounded-full text-xs font-bold border border-emerald-100 dark:border-emerald-900/30">
            <span className="w-2 h-2 bg-emerald-600 rounded-full animate-pulse"></span>
            Тоҷикӣ
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
