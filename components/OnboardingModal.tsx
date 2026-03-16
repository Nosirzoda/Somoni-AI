
import React, { useState } from 'react';
import Logo from './Logo';
import { UI_STRINGS } from '../constants';

interface OnboardingModalProps {
  onComplete: (name: string) => void;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');

  const next = () => {
    if (step < 3) setStep(s => s + 1);
    else onComplete(name || 'Корбар');
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-emerald-950/90 backdrop-blur-md">
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in duration-300 border dark:border-slate-800">
        <div className="p-8 md:p-12 text-center">
          {step === 1 && (
            <div className="animate-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-center mb-8">
                <div className="p-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-[2rem] shadow-inner">
                  <Logo size={100} />
                </div>
              </div>
              <h2 className="text-3xl font-black text-gray-900 dark:text-slate-100 mb-4 tracking-tight">{UI_STRINGS.WELCOME_TITLE}</h2>
              <p className="text-gray-500 dark:text-slate-400 text-lg leading-relaxed">{UI_STRINGS.WELCOME_SUBTITLE}</p>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in slide-in-from-right-4 duration-500">
              <div className="w-20 h-20 bg-emerald-600 rounded-3xl flex items-center justify-center text-white text-3xl mx-auto mb-8 shadow-xl">
                <i className="fa-solid fa-language"></i>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-4">{UI_STRINGS.ONBOARDING_1_TITLE}</h2>
              <p className="text-gray-500 dark:text-slate-400 mb-8 leading-relaxed">{UI_STRINGS.ONBOARDING_1_DESC}</p>
            </div>
          )}

          {step === 3 && (
            <div className="animate-in slide-in-from-right-4 duration-500 text-left">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-6 text-center">Биёед шинос шавем</h2>
              <div className="space-y-4">
                <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 ml-1">Номи шумо чист?</label>
                <input 
                  autoFocus
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Масалан: Алишер"
                  className="w-full bg-gray-50 dark:bg-slate-950 border-2 border-gray-100 dark:border-slate-800 rounded-2xl p-4 text-lg focus:outline-none focus:border-emerald-500 transition-colors text-gray-950 dark:text-slate-100 font-medium"
                />
                <p className="text-xs text-gray-400 dark:text-slate-500 mt-2 italic">Ин ба ман кӯмак мекунад, ки бо шумо беҳтар муошират кунам.</p>
              </div>
            </div>
          )}

          <div className="mt-12 flex flex-col gap-4">
            <button 
              onClick={next}
              className="w-full py-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-lg transition-all shadow-xl shadow-emerald-200 dark:shadow-none active:scale-95"
            >
              {step < 3 ? 'Давом додан' : UI_STRINGS.ONBOARDING_START}
            </button>
            <div className="flex justify-center gap-2">
              {[1, 2, 3].map(i => (
                <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${step === i ? 'w-8 bg-emerald-600' : 'w-2 bg-gray-200 dark:bg-slate-800'}`} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingModal;
