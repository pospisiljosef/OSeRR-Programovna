import React from 'react';
import { SCOUT_METHOD_ELEMENTS } from '../data/constants';
import { ScoutLilieLogo } from './Header';
import { X, Compass, CheckCircle2, BookOpen } from 'lucide-react';

interface ScoutMethodInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ScoutMethodInfoModal: React.FC<ScoutMethodInfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-sm flex justify-center items-start p-3 sm:p-6 animate-fadeIn">
      <div className="relative bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50/50 dark:bg-stone-800/50">
          <div className="flex items-center gap-3">
            <ScoutLilieLogo className="w-10 h-10" />
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <Compass className="w-5 h-5 text-emerald-600" />
                <span>Skautská výchovná metoda (8 prvků)</span>
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Ucelený systém neformálního vzdělávání Junáka a světového skautingu
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6">
          <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
            Skautská metoda je jedinečný systém, kterým skauting dosahuje svého výchovného cíle: všestranného rozvoje mladého člověka. Každý dobrý skautský program uplatňuje alespoň několik z těchto osmi propojených prvků:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SCOUT_METHOD_ELEMENTS.map((elem, idx) => (
              <div 
                key={elem.id} 
                className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80 space-y-1.5"
              >
                <div className="flex items-center gap-2 font-bold text-sm text-emerald-800 dark:text-emerald-300">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-mono">
                    {idx + 1}
                  </span>
                  <span>{elem.name}</span>
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed pl-7">
                  {elem.shortDesc}
                </p>
              </div>
            ))}
          </div>

          <div className="p-4 bg-emerald-50/70 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 space-y-1">
            <h4 className="font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Tip pro tvůrce programů:
            </h4>
            <p className="leading-relaxed">
              Při vkládání programu označte prvky, které aktivita skutečně rozvíjí. Pomůže to ostatním vedoucím vybrat program přesně podle toho, co jejich družina v daný moment potřebuje posílit (např. družinový systém, sepětí s přírodou či morální zákon).
            </p>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-stone-200 dark:border-stone-800 flex justify-end bg-stone-50/50 dark:bg-stone-800/50">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition shadow-xs"
          >
            Rozumím
          </button>
        </div>

      </div>
    </div>
  );
};
