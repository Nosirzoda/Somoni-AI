
import React, { useEffect, useRef } from 'react';
import { Message } from '../types';
import MessageItem from './MessageItem';
import { UI_STRINGS } from '../constants';
import Logo from './Logo';

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
  onSuggestionClick: (text: string) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isLoading, onSuggestionClick }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gray-50 dark:bg-slate-900 transition-colors overflow-y-auto">
        <div className="relative mb-6 flex-shrink-0">
          <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full"></div>
          <div className="relative w-32 h-32 bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-2xl flex items-center justify-center border border-white/50 dark:border-slate-700 backdrop-blur-sm">
            <Logo size={80} />
          </div>
        </div>
        
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-slate-100 mb-3 tracking-tight">
          {UI_STRINGS.WELCOME_TITLE}
        </h2>
        <p className="text-gray-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed text-lg mb-12">
          {UI_STRINGS.WELCOME_SUBTITLE}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
          {[
            "Зеҳни сунъиӣ чист? Содда карда фаҳмон.",
            "Чӣ тавр нақшаи кории худро беҳтар кунам?"
          ].map((suggestion, idx) => (
             <div 
               key={idx} 
               role="button"
               tabIndex={0}
               onClick={() => onSuggestionClick(suggestion)}
               onKeyDown={(e) => e.key === 'Enter' && onSuggestionClick(suggestion)}
               className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-gray-100 dark:border-slate-700 text-sm text-gray-700 dark:text-slate-300 hover:border-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-400 hover:shadow-lg hover:shadow-emerald-500/5 cursor-pointer transition-all flex items-center gap-3 group"
             >
               <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                 <i className="fa-solid fa-arrow-right text-xs"></i>
               </div>
               <span className="font-medium">{suggestion}</span>
             </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={scrollRef}
      className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50 dark:bg-slate-900 scroll-smooth transition-colors"
    >
      <div className="max-w-3xl mx-auto">
        {messages.map((msg) => (
          <MessageItem key={msg.id} message={msg} />
        ))}
        {isLoading && (
          <div className="flex justify-start mb-6">
            <div className="flex flex-row">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mt-1 animate-pulse">
                <Logo size={18} />
              </div>
              <div className="mx-3 px-5 py-4 rounded-2xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-sm rounded-tl-none">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-75"></div>
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-150"></div>
                </div>
                <span className="text-[10px] text-gray-400 dark:text-slate-500 mt-2 block">{UI_STRINGS.LOADING}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatWindow;
