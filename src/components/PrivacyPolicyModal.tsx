import React, { useEffect, useMemo, useState } from 'react';
import {
  X,
  Shield,
  AlertTriangle,
  FileText,
  Lock,
  UserCheck,
  Database,
  Globe,
  CheckCircle2,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept?: () => void;
  isMandatory?: boolean;
}

interface PolicySection {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({
  isOpen,
  onClose,
  onAccept,
  isMandatory = false,
}) => {
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isMandatory) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEsc);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, isMandatory, onClose]);

  useEffect(() => {
    if (!isOpen) {
      setAgreed(false);
    }
  }, [isOpen]);

  const handleConfirm = () => {
    if (!agreed) return;
    onAccept?.();
    onClose();
  };

  const handleOverlayClick = () => {
    if (!isMandatory) {
      onClose();
    }
  };

  const sections = useMemo<PolicySection[]>(
    () => [
      {
        id: 'intro',
        title: 'Муқаддима',
        icon: <FileText size={14} />,
        content: (
          <div className="space-y-4">
            <p>
              <strong>Somoni AI</strong> («мо», «аз мо») ба махфият ва ҳифзи маълумоти шахсии
              корбарон эҳтиром мегузорад. Ин Сиёсати ҳифзи махфият тартиби ҷамъоварӣ, истифода,
              нигоҳдорӣ ва ҳифзи маълумоти шуморо ҳангоми истифодаи веб-барнома, барномаи мобилӣ ё
              дигар хизматрасониҳои Somoni AI шарҳ медиҳад.
            </p>
            <p>
              Somoni AI як платформаи зеҳни сунъӣ мебошад, ки барои корбарони Ҷумҳурии Тоҷикистон
              ва бозори байналмилалӣ таҳия шудааст.
            </p>
            <p>Ин сиёсат мутобиқ ба қонунгузории амалкунанда таҳия гардидааст, аз ҷумла:</p>
            <ul className="list-disc space-y-2 pl-5 marker:text-emerald-500">
              <li>Қонуни Ҷумҳурии Тоҷикистон «Дар бораи ҳифзи маълумоти шахсӣ» №1537 аз 3 августи 2018</li>
              <li>Меъёрҳои байналмилалии ҳифзи маълумот, агар хизматрасонӣ ба корбарони хориҷӣ анҷом дода шавад</li>
            </ul>
          </div>
        ),
      },
      {
        id: 'data',
        title: 'Маълумоте, ки мо ҷамъ меоварем',
        icon: <Database size={14} />,
        content: (
          <div className="space-y-6">
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-slate-800 dark:bg-slate-900/60">
              <h4 className="mb-2 text-sm font-extrabold text-gray-900 dark:text-slate-100">
                1. Маълумоти ҳисоб
              </h4>
              <ul className="list-disc space-y-1 pl-5 marker:text-emerald-500">
                <li>Ном</li>
                <li>Суроғаи почтаи электронӣ</li>
                <li>Маълумоти воридшавӣ</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-slate-800 dark:bg-slate-900/60">
              <h4 className="mb-2 text-sm font-extrabold text-gray-900 dark:text-slate-100">
                2. Мундариҷаи воридкардаи корбар
              </h4>
              <ul className="list-disc space-y-1 pl-5 marker:text-emerald-500">
                <li>Саволҳо ва дархостҳо</li>
                <li>Матн ё файлҳое, ки шумо пешниҳод мекунед</li>
                <li>Муоширати дохили платформа</li>
              </ul>
              <p className="mt-3 text-xs text-gray-600 dark:text-slate-400">
                Агар шумо аз режими чати муваққатӣ истифода баред, маълумот пас аз анҷоми ҷаласа
                нигоҳ дошта намешавад.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-slate-800 dark:bg-slate-900/60">
              <h4 className="mb-2 text-sm font-extrabold text-gray-900 dark:text-slate-100">
                3. Маълумоти техникӣ
              </h4>
              <ul className="list-disc space-y-1 pl-5 marker:text-emerald-500">
                <li>Суроғаи IP</li>
                <li>Навъи дастгоҳ ва браузер</li>
                <li>Низоми амалиётӣ</li>
                <li>Сабтҳои техникӣ (logs)</li>
                <li>Омори истифода</li>
              </ul>
            </div>
          </div>
        ),
      },
      {
        id: 'usage',
        title: 'Тарзи истифодаи маълумот',
        icon: <UserCheck size={14} />,
        content: (
          <ul className="list-disc space-y-2 pl-5 marker:text-emerald-500">
            <li>Пешниҳоди ҷавобҳои зеҳни сунъӣ</li>
            <li>Беҳтар кардани сифати хизматрасонӣ</li>
            <li>Таъмини амнияти система</li>
            <li>Пешгирии сӯиистифода ва қаллобӣ</li>
            <li>Риояи уҳдадориҳои ҳуқуқӣ</li>
          </ul>
        ),
      },
      {
        id: 'sharing',
        title: 'Мубодила ва интиқоли маълумот',
        icon: <Globe size={14} />,
        content: (
          <div className="space-y-4">
            <p>
              Somoni AI маълумоти корбаронро намефурӯшад.
            </p>
            <p>Маълумот метавонад дар ҳолатҳои зарурӣ ба ин ҷонибҳо пешниҳод карда шавад:</p>
            <ul className="list-disc space-y-2 pl-5 marker:text-emerald-500">
              <li>Провайдерҳои абрӣ</li>
              <li>Шарикони техникӣ</li>
              <li>Мақомоти давлатӣ дар ҳолатҳои талаботи қонунӣ</li>
            </ul>
            <p>
              Интиқоли байналмилалии маълумот танҳо бо риояи талаботи қонунгузории амалкунанда
              анҷом дода мешавад.
            </p>
          </div>
        ),
      },
      {
        id: 'security',
        title: 'Нигоҳдорӣ ва амният',
        icon: <Lock size={14} />,
        content: (
          <div className="space-y-4">
            <p>Мо барои ҳифзи маълумоти корбарон тадбирҳои зеринро истифода мебарем:</p>
            <ul className="list-disc space-y-2 pl-5 marker:text-emerald-500">
              <li>Рамзгузорӣ тавассути TLS/HTTPS</li>
              <li>Назорати дастрасӣ</li>
              <li>Провайдерҳои боэътимоди абрӣ</li>
              <li>Мониторинги амният</li>
            </ul>

            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/30 dark:bg-amber-900/20">
              <div className="flex gap-3">
                <AlertTriangle className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" size={18} />
                <p className="text-xs font-medium leading-6 text-amber-800 dark:text-amber-200">
                  Мо талаб намекунем, ки шумо маълумоти ҳассос, аз ҷумла маълумот дар бораи
                  саломатӣ, ақидаҳои сиёсӣ, дин, миллат ва дигар маълумоти махсусро пешниҳод намоед.
                  Лутфан аз ворид кардани чунин маълумот худдорӣ кунед.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-slate-800 dark:bg-slate-900/60">
              <h4 className="mb-2 text-sm font-extrabold text-gray-900 dark:text-slate-100">
                Муҳлати нигоҳдорӣ
              </h4>
              <ul className="list-disc space-y-1 pl-5 marker:text-emerald-500">
                <li>Сабтҳои техникӣ: 30–90 рӯз</li>
                <li>Маълумоти ҳисоб: то замони ҳазфи ҳисоб</li>
              </ul>
            </div>
          </div>
        ),
      },
      {
        id: 'rights',
        title: 'Ҳуқуқҳои корбар',
        icon: <Shield size={14} />,
        content: (
          <ul className="list-disc space-y-2 pl-5 marker:text-emerald-500">
            <li>Ба маълумоти худ дастрасӣ пайдо кунед</li>
            <li>Маълумотро ислоҳ намоед</li>
            <li>Ҳисобро ҳазф намоед</li>
            <li>Коркарди маълумотро маҳдуд кунед</li>
            <li>Ризоияти худро бозпас гиред</li>
          </ul>
        ),
      },
      {
        id: 'updates',
        title: 'Тағйирот ба сиёсат',
        icon: <Shield size={14} />,
        content: (
          <p>
            Somoni AI ҳуқуқ дорад ин Сиёсати ҳифзи махфиятро тағйир диҳад. Ҳамаи тағйирот дар
            платформа ё сомонаи расмӣ нашр карда мешаванд. Истифодаи минбаъдаи хизматрасонӣ маънои
            қабул кардани версияи навшудаи сиёсатро дорад.
          </p>
        ),
      },
    ],
    []
  );

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-4 py-6 sm:p-8">
          <motion.button
            type="button"
            aria-label="Close overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleOverlayClick}
            className="absolute inset-0 cursor-default bg-black/60 backdrop-blur-md"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="privacy-policy-title"
            initial={{ opacity: 0, scale: 0.96, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 24 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="relative z-10 flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-[2rem] border border-gray-200 bg-white shadow-[0_24px_80px_rgba(0,0,0,0.18)] dark:border-slate-800 dark:bg-slate-950"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white/90 px-6 py-5 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90 sm:px-8">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400">
                  <Shield size={24} />
                </div>

                <div>
                  <h2
                    id="privacy-policy-title"
                    className="text-xl font-black tracking-tight text-gray-950 dark:text-slate-50 sm:text-2xl"
                  >
                    Сиёсати ҳифзи махфият
                  </h2>
                  <p className="mt-1 text-xs font-semibold text-gray-500 dark:text-slate-400">
                    Somoni AI · Навсозӣ: март 2026
                  </p>
                </div>
              </div>

              {!isMandatory && (
                <button
                  type="button"
                  onClick={onClose}
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-400 transition hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                  aria-label="Пӯшидан"
                >
                  <X size={20} />
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8 sm:py-8">
              <div className="mb-8 grid gap-4 rounded-[1.5rem] border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-5 dark:border-emerald-900/30 dark:from-emerald-950/40 dark:to-slate-950">
                <div className="flex items-start gap-3">
                  <Shield className="mt-0.5 text-emerald-600 dark:text-emerald-400" size={20} />
                  <div>
                    <h3 className="text-sm font-extrabold text-gray-950 dark:text-slate-50">
                      Махфияти шумо барои мо муҳим аст
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-gray-700 dark:text-slate-300">
                      Мо кӯшиш мекунем маълумоти шуморо шаффоф, боэътимод ва бо риояи меъёрҳои ҳуқуқӣ
                      коркард намоем. Ин саҳифа мефаҳмонад, ки кадом маълумот ҷамъ мешавад ва чӣ гуна
                      истифода мешавад.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-8 text-sm leading-7 text-gray-700 dark:text-slate-300">
                {sections.map((section, index) => (
                  <section key={section.id} className="space-y-4">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">
                      {section.icon}
                      {String(index + 1).padStart(2, '0')}. {section.title}
                    </div>

                    <div className="rounded-[1.5rem] border border-gray-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/40">
                      {section.content}
                    </div>
                  </section>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-100 bg-gray-50/80 px-6 py-5 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/70 sm:px-8">
              <div className="flex flex-col gap-5">
                <label className="group flex cursor-pointer items-start gap-3">
                  <div className="relative mt-0.5 flex items-center">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="peer h-5 w-5 appearance-none rounded-md border-2 border-gray-300 transition-all checked:border-emerald-500 checked:bg-emerald-500 dark:border-slate-700"
                    />
                    <CheckCircle2 className="pointer-events-none absolute h-5 w-5 scale-0 text-white transition-transform peer-checked:scale-100" />
                  </div>

                  <span className="select-none text-xs font-bold leading-6 text-gray-700 dark:text-slate-300">
                    Ман Сиёсати ҳифзи махфиятро хондам ва ба шартҳои истифода розӣ ҳастам.
                  </span>
                </label>

                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-gray-400 dark:text-slate-500">
                    © 2026 Somoni AI
                  </p>

                  <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                    {!isMandatory && (
                      <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-xs font-black text-gray-700 transition hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                      >
                        Бекор кардан
                      </button>
                    )}

                    <button
                      type="button"
                      disabled={!agreed}
                      onClick={handleConfirm}
                      className={`flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-xs font-black transition-all ${
                        agreed
                          ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 active:scale-[0.98]'
                          : 'cursor-not-allowed bg-gray-200 text-gray-400 dark:bg-slate-800 dark:text-slate-500'
                      }`}
                    >
                      {isMandatory ? 'Тасдиқ ва оғози кор' : 'Фаҳмидам'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PrivacyPolicyModal;