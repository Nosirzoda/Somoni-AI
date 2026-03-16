
import React from 'react';
import Markdown from 'react-markdown';
import { Message, ChatRole } from '../types';
import Logo from './Logo';

interface MessageItemProps {
  message: Message;
}

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const isAi = message.role === ChatRole.MODEL;

  return (
    <div className={`flex w-full mb-6 ${isAi ? 'justify-start' : 'justify-end'}`}>
      <div className={`flex max-w-[90%] md:max-w-[80%] ${isAi ? 'flex-row' : 'flex-row-reverse'}`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mt-1 shadow-sm border transition-colors
          ${isAi ? 'bg-white dark:bg-slate-800 border-emerald-100 dark:border-emerald-900/40' : 'bg-gray-100 dark:bg-slate-900 border-gray-200 dark:border-slate-800 ml-3 mr-0'}
        `}>
          {isAi ? <Logo size={20} /> : <i className="fa-solid fa-user text-sm text-gray-500 dark:text-slate-400"></i>}
        </div>

        {/* Bubble */}
        <div className={`mx-3 px-4 py-3 rounded-2xl shadow-sm border transition-all
          ${isAi 
            ? 'bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 text-gray-800 dark:text-slate-200 rounded-tl-none' 
            : 'bg-emerald-600 dark:bg-emerald-700 border-emerald-500 dark:border-emerald-600 text-white rounded-tr-none'}
        `}>
          {/* Attachments Display */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {message.attachments.map(att => (
                <div key={att.id} className="rounded-lg overflow-hidden border border-white/20 dark:border-slate-700">
                  {att.previewUrl ? (
                    <img src={att.previewUrl} alt={att.name} className="max-w-[200px] max-h-[200px] object-contain bg-black/5 dark:bg-white/5" />
                  ) : (
                    <div className="px-3 py-2 bg-black/10 dark:bg-white/10 flex items-center gap-2 text-xs font-bold">
                      <i className="fa-solid fa-file-pdf"></i>
                      <span className="truncate max-w-[150px]">{att.name}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="text-sm leading-relaxed whitespace-pre-wrap markdown-body">
            <Markdown>{message.content}</Markdown>
          </div>
          <div className={`text-[10px] mt-2 opacity-60 font-black tracking-widest ${isAi ? 'text-gray-400 dark:text-slate-500' : 'text-emerald-100 dark:text-emerald-200'}`}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
