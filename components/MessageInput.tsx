
import React, { useState, useRef, useEffect } from 'react';
import { UI_STRINGS } from '../constants';
import { Attachment } from '../types';

interface MessageInputProps {
  onSendMessage: (text: string, attachments: Attachment[]) => void;
  isLoading: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, isLoading }) => {
  const [inputText, setInputText] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > 5 * 1024 * 1024) {
        alert(UI_STRINGS.FILE_LIMIT);
        continue;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Data = (event.target?.result as string).split(',')[1];
        const newAttachment: Attachment = {
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          type: file.type || 'application/octet-stream',
          data: base64Data,
          previewUrl: file.type.startsWith('image/') ? (event.target?.result as string) : undefined
        };
        setAttachments(prev => [...prev, newAttachment]);
      };

      if (file.type.startsWith('image/') || file.type === 'application/pdf') {
        reader.readAsDataURL(file);
      } else {
        // Text files
        const textReader = new FileReader();
        textReader.onload = (ev) => {
          const newAttachment: Attachment = {
            id: Math.random().toString(36).substr(2, 9),
            name: file.name,
            type: 'text/plain',
            data: ev.target?.result as string
          };
          setAttachments(prev => [...prev, newAttachment]);
        };
        textReader.readAsText(file);
      }
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if ((inputText.trim() || attachments.length > 0) && !isLoading) {
      onSendMessage(inputText.trim(), attachments);
      setInputText('');
      setAttachments([]);
    }
  };

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(a => a.id !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'inherit';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [inputText]);

  return (
    <div className="bg-white dark:bg-slate-950 border-t border-gray-200 dark:border-slate-800 p-4 sticky bottom-0 z-20 transition-colors">
      <div className="max-w-3xl mx-auto mb-3 flex flex-wrap gap-2">
        {attachments.map(att => (
          <div key={att.id} className="relative group animate-in zoom-in duration-200">
            {att.previewUrl ? (
              <img src={att.previewUrl} alt="Preview" className="w-16 h-16 object-cover rounded-xl border-2 border-emerald-500 shadow-sm" />
            ) : (
              <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex flex-col items-center justify-center border-2 border-emerald-500 p-1">
                <i className="fa-solid fa-file-lines text-emerald-600 dark:text-emerald-400"></i>
                <span className="text-[8px] text-emerald-800 dark:text-emerald-300 font-bold truncate w-full text-center mt-1">{att.name}</span>
              </div>
            )}
            <button 
              onClick={() => removeAttachment(att.id)}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-slate-900 hover:bg-red-600 transition-colors"
            >
              <i className="fa-solid fa-xmark text-[10px]"></i>
            </button>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex items-end gap-2">
        <input 
          type="file" 
          multiple 
          ref={fileInputRef} 
          className="hidden" 
          onChange={handleFileSelect}
          accept="image/*,application/pdf,text/plain"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          className="w-12 h-12 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl flex items-center justify-center text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all flex-shrink-0 mb-1"
          title={UI_STRINGS.ATTACH_FILE}
        >
          <i className="fa-solid fa-paperclip"></i>
        </button>

        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            rows={1}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={UI_STRINGS.INPUT_PLACEHOLDER}
            disabled={isLoading}
            className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-800 rounded-2xl py-3 pl-4 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-slate-800 resize-none transition-all text-gray-950 dark:text-slate-100 disabled:opacity-50 font-medium"
          />
        </div>

        <button
          type="submit"
          disabled={( !inputText.trim() && attachments.length === 0 ) || isLoading}
          className="bg-emerald-600 text-white w-12 h-12 rounded-xl flex items-center justify-center hover:bg-emerald-700 disabled:opacity-50 disabled:bg-gray-300 dark:disabled:bg-slate-800 transition-colors shadow-lg shadow-emerald-200 dark:shadow-none flex-shrink-0 mb-1"
        >
          {isLoading ? (
            <i className="fa-solid fa-spinner fa-spin"></i>
          ) : (
            <i className="fa-solid fa-paper-plane"></i>
          )}
        </button>
      </form>
      <p className="text-center text-[10px] text-gray-500 dark:text-slate-600 mt-3 uppercase tracking-widest font-bold">
        Somoni AI метавонад хато кунад. Маълумоти муҳимро тафтиш кунед.
      </p>
    </div>
  );
};

export default MessageInput;
