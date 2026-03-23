import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Logo from '../components/Logo'; // Исправлен путь и импорт

export const Privacy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 font-sans py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <Link to="/" className="flex items-center gap-2 text-emerald-600 hover:text-emerald-500 transition-colors group">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Баргашт ба асосӣ</span>
          </Link>
          <Logo size={40} />
        </div>

        <article className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 shadow-xl border border-gray-100 dark:border-slate-800 transition-colors">
          <h1 className="text-3xl sm:text-4xl font-black mb-2 tracking-tight uppercase">Сиёсати ҳифзи махфият</h1>
          <p className="text-emerald-600 dark:text-emerald-400 font-medium mb-8">Somoni AI — Санаи навсозӣ: 22 марти соли 2026</p>

          <div className="space-y-8 text-gray-600 dark:text-slate-400 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-4">1. Муқаддима</h2>
              <p>
                Somoni AI («мо», «аз мо») ба махфият ва ҳифзи маълумоти шахсии корбарон эҳтиром мегузорад. Ин Сиёсати ҳифзи махфият тартиби ҷамъоварӣ, истифода, нигоҳдорӣ ва ҳифзи маълумоти шуморо ҳангоми истифодаи веб-барномаи Somoni AI шарҳ медиҳад.
              </p>
              <p className="mt-4">
                Ин Сиёсат мутобиқ ба қонунгузории Ҷумҳурии Тоҷикистон, аз ҷумла Қонуни ҶТ «Дар бораи ҳифзи маълумоти шахсӣ» №1537 таҳия гардидааст.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-4">2. Маълумоте, ки мо ҷамъ меоварем</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-gray-800 dark:text-slate-200 mb-1">Маълумоти ҳисоб:</h3>
                  <p>Ҳангоми воридшавӣ тавассути Google, мо ном, суроғаи почтаи электронӣ ва акси профили шуморо мегирем.</p>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 dark:text-slate-200 mb-1">Мундариҷаи чат:</h3>
                  <p>Саволҳо ва дархостҳои шумо барои пешниҳоди ҷавобҳои зеҳни сунъӣ коркард мешаванд.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-4">3. Тарзи истифодаи маълумот</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Пешниҳоди ҷавобҳои дақиқи зеҳни сунъӣ</li>
                <li>Беҳтар кардани сифати хизматрасонӣ ва интерфейс</li>
                <li>Таъмини амнияти система ва пешгирии қаллобӣ</li>
                <li>Нигоҳ доштани таърихи чатҳои шумо барои дастрасии оянда</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-4">4. Нигоҳдорӣ ва амният</h2>
              <p>
                Мо маълумоти шуморо дар серверҳои боэътимод бо истифода аз рамзгузории муосир (SSL/TLS) нигоҳ медорем. Маълумоти шумо ба шахсони сеюм фурӯхта намешавад.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-4">5. Ҳуқуқҳои шумо</h2>
              <p>Шумо ҳуқуқ доред:</p>
              <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                <li>Маълумоти худро дидан ва ислоҳ кардан</li>
                <li>Таърихи чатҳоро ҳазф кардан</li>
                <li>Ҳисоби худро пурра нест кардан</li>
              </ul>
            </section>

            <section className="pt-8 border-t border-gray-100 dark:border-slate-800">
              <p className="text-sm italic">
                Бо истифода аз Somoni AI, шумо ба шартҳои ин Сиёсати ҳифзи махфият розӣ мешавед.
              </p>
            </section>
          </div>
        </article>

        <footer className="mt-12 text-center text-gray-400 dark:text-slate-600 text-xs">
          © 2026 Somoni AI. Ҳамаи ҳуқуқҳо ҳифз шудаанд.
        </footer>
      </div>
    </div>
  );
};

export default Privacy;