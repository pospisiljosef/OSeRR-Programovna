import React, { useState } from 'react';
import { YearlyPlan, ScoutProgram } from '../types/scout';
import { AGE_CATEGORIES, SCOUT_METHOD_ELEMENTS, formatPlanDuration } from '../data/constants';
import { YearlyPlanRadarOrBars } from './YearlyPlanRadarOrBars';
import { YearlyPlanTimeline } from './YearlyPlanTimeline';
import { 
  X, 
  Heart, 
  Calendar, 
  Sparkles, 
  Target, 
  Compass, 
  Share2, 
  Edit3, 
  Trash2, 
  Printer, 
  Pin, 
  Check, 
  Flag, 
  Building,
  Layers,
  Clock,
  ChevronRight
} from 'lucide-react';

interface YearlyPlanDetailModalProps {
  plan: YearlyPlan | null;
  isOpen: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  isAuthorOrAdmin: boolean;
  onOpenEdit?: (plan: YearlyPlan) => void;
  onRequestDelete?: (plan: YearlyPlan) => void;
  onOpenProgram?: (program: ScoutProgram) => void;
  allPrograms: ScoutProgram[];
  onPrint?: (plan: YearlyPlan) => void;
  onToast?: (msg: string) => void;
}

export const YearlyPlanDetailModal: React.FC<YearlyPlanDetailModalProps> = ({
  plan,
  isOpen,
  onClose,
  isFavorite,
  onToggleFavorite,
  isAuthorOrAdmin,
  onOpenEdit,
  onRequestDelete,
  onOpenProgram,
  allPrograms,
  onPrint,
  onToast
}) => {
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen || !plan) return null;

  const pinnedPrograms = (plan.pinnedProgramIds || [])
    .map(id => allPrograms.find(p => p.id === id))
    .filter(Boolean) as ScoutProgram[];

  const handleShare = async () => {
    try {
      const url = `${window.location.origin}${window.location.pathname}?plan=${plan.id}`;
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2500);
        if (onToast) onToast('Odkaz na celoroční plán byl zkopírován do schránky!');
      }
    } catch (e) {
      if (onToast) onToast('Nepodařilo se zkopírovat odkaz.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-sm flex justify-center items-start p-2 sm:p-6 animate-fadeIn">
      <div className="relative bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden my-2 sm:my-6">
        
        {/* Top Action Header */}
        <div className="sticky top-0 z-20 px-4 sm:px-6 py-3.5 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
              <Calendar className="w-3.5 h-3.5 text-emerald-600" />
              {formatPlanDuration(plan.durationMonths)}
            </span>
            <span className="text-xs text-stone-400 hidden sm:inline">•</span>
            <span className="text-xs text-stone-500 dark:text-stone-400 font-medium hidden sm:inline">
              Celoroční skautská činnost
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleShare}
              className="p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-700 transition"
              title="Kopírovat odkaz"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={() => onPrint ? onPrint(plan) : handlePrint()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 text-xs font-bold transition shadow-xs"
              title="Zobrazit detailní rozložení tisku pro formát A4"
            >
              <Printer className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="hidden xs:inline sm:inline">Rozložení tisku</span>
            </button>

            <button
              type="button"
              onClick={onToggleFavorite}
              className={`p-2 rounded-xl border transition ${
                isFavorite
                  ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 border-rose-300 dark:border-rose-800'
                  : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 border-stone-200 dark:border-stone-700'
              }`}
              title={isFavorite ? 'Odebrat z oblíbených' : 'Uložit do oblíbených'}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>

            {isAuthorOrAdmin && onOpenEdit && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenEdit(plan);
                }}
                className="p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-700 transition"
                title="Upravit celoroční plán"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            )}

            {isAuthorOrAdmin && onRequestDelete && (
              <button
                type="button"
                onClick={() => onRequestDelete(plan)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900 transition"
                title="Smazat plán"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Smazat</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
              title="Zavřít"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-8 space-y-6">
          
          {/* Title, Motto & Age Categories */}
          <div>
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {plan.ageCategories?.map((catId) => {
                const cat = AGE_CATEGORIES.find(c => c.id === catId);
                if (!cat) return null;
                return (
                  <span
                    key={catId}
                    className={`text-xs font-bold px-3 py-1 rounded-full border ${cat.badgeBg}`}
                  >
                    {cat.badgeText}
                  </span>
                );
              })}
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100 leading-tight mb-2">
              {plan.title}
            </h2>

            {plan.motto && (
              <p className="text-sm sm:text-base text-amber-700 dark:text-amber-400 italic font-semibold border-l-4 border-amber-500 pl-3 my-3">
                {plan.motto}
              </p>
            )}

            <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 leading-relaxed mt-2">
              {plan.summary}
            </p>
          </div>

          {/* Educational Vision & Goals prominent sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Vision */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/30 border border-amber-200 dark:border-amber-800/80 space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-amber-800 dark:text-amber-400 flex items-center gap-1.5">
                <Target className="w-4 h-4 text-amber-600" />
                Vize celoroční činnosti (Kam směřujeme)
              </span>
              <p className="text-xs sm:text-sm text-stone-800 dark:text-stone-200 whitespace-pre-line leading-relaxed font-medium">
                {plan.vision}
              </p>
            </div>

            {/* Goals */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/30 border border-emerald-200 dark:border-emerald-800/80 space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                Výchovné cíle
              </span>
              <p className="text-xs sm:text-sm text-stone-800 dark:text-stone-200 whitespace-pre-line leading-relaxed font-medium">
                {plan.educationalGoals}
              </p>
            </div>
          </div>

          {/* 5 Personal Development Dimensions Visualizer */}
          <div>
            <YearlyPlanRadarOrBars scales={plan} compact={false} />
          </div>

          {/* Means / Prostředky */}
          {plan.means && plan.means.length > 0 && (
            <div className="p-4 sm:p-5 bg-stone-50 dark:bg-stone-850 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-2">
              <h4 className="text-sm font-bold text-stone-800 dark:text-stone-200 flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-600" />
                <span>Použité výchovné prostředky a formy</span>
              </h4>
              <div className="flex flex-wrap gap-2 pt-1">
                {plan.means.map((m, idx) => (
                  <span
                    key={idx}
                    className="bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs px-3 py-1.5 rounded-xl font-medium border border-stone-200 dark:border-stone-700 shadow-xs"
                  >
                    ✓ {m}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Scout Methods 8 Elements */}
          {plan.scoutMethods && plan.scoutMethods.length > 0 && (
            <div className="p-4 sm:p-5 bg-stone-50 dark:bg-stone-850 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-2">
              <h4 className="text-sm font-bold text-stone-800 dark:text-stone-200 flex items-center gap-2">
                <Compass className="w-4 h-4 text-emerald-600" />
                <span>Zapojené prvky skautské výchovné metody</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {plan.scoutMethods.map((mId) => {
                  const el = SCOUT_METHOD_ELEMENTS.find(e => e.id === mId);
                  if (!el) return null;
                  return (
                    <div
                      key={mId}
                      className="p-2.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center gap-2.5"
                    >
                      <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
                        <Compass className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <h6 className="font-bold text-xs text-stone-900 dark:text-stone-100">{el.name}</h6>
                        <p className="text-[11px] text-stone-500 truncate">{el.shortDesc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Pinned Programs from Database */}
          {pinnedPrograms.length > 0 && (
            <div className="p-4 sm:p-5 bg-amber-50/60 dark:bg-amber-950/30 rounded-2xl border border-amber-200 dark:border-amber-800 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-amber-900 dark:text-amber-200 flex items-center gap-2">
                  <Pin className="w-4 h-4 text-amber-600" />
                  <span>Připíchnuté programy z databáze ({pinnedPrograms.length})</span>
                </h4>
                <span className="text-[11px] text-stone-500">Kliknutím otevřete detail aktivity</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {pinnedPrograms.map((prog) => (
                  <div
                    key={prog.id}
                    onClick={() => onOpenProgram && onOpenProgram(prog)}
                    className="p-3 bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 hover:border-amber-500 shadow-xs hover:shadow-md transition cursor-pointer flex items-center justify-between gap-2 group"
                  >
                    <div className="min-w-0">
                      <h6 className="font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-100 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition truncate">
                        {prog.title}
                      </h6>
                      <div className="flex items-center gap-2 text-[11px] text-stone-400 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {prog.durationMinutes} min
                        </span>
                        <span>•</span>
                        <span className="truncate">Od: {prog.authorName}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-amber-600 shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* INTERACTIVE MONTHLY TIMELINE */}
          <div className="pt-2">
            <YearlyPlanTimeline
              schedule={plan.monthlySchedule}
              allPrograms={allPrograms}
              onOpenProgram={onOpenProgram}
            />
          </div>

          {/* Author Card */}
          <div className="p-4 bg-emerald-50/80 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-bold text-base shadow-xs shrink-0">
                {plan.authorName ? plan.authorName[0].toUpperCase() : 'S'}
              </div>
              <div className="min-w-0">
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-800 dark:text-emerald-400 block">
                  Autor celoročního plánu
                </span>
                <h5 className="font-black text-sm sm:text-base text-stone-900 dark:text-stone-100 truncate">
                  {plan.authorName}
                </h5>
                {(plan.authorUnit || plan.authorCenter) && (
                  <p className="text-xs text-emerald-800 dark:text-emerald-300 font-medium truncate flex items-center gap-1.5 mt-0.5">
                    {plan.authorUnit && (
                      <span className="flex items-center gap-1">
                        <Flag className="w-3 h-3 text-emerald-600 shrink-0" />
                        {plan.authorUnit}
                      </span>
                    )}
                    {plan.authorUnit && plan.authorCenter && <span>•</span>}
                    {plan.authorCenter && (
                      <span className="flex items-center gap-1">
                        <Building className="w-3 h-3 text-amber-600 shrink-0" />
                        {plan.authorCenter}
                      </span>
                    )}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => onPrint ? onPrint(plan) : handlePrint()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-md"
                title="Zobrazit rozložení tisku celoročního plánu (A4)"
              >
                <Printer className="w-4 h-4" />
                <span>Rozložení tisku (A4)</span>
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="px-3.5 py-2 rounded-xl bg-white dark:bg-stone-800 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 text-xs font-bold hover:bg-emerald-100 transition shadow-xs"
              >
                {copiedLink ? 'Zkopírováno' : 'Sdílet plán'}
              </button>
            </div>
          </div>

          {/* Tags */}
          {plan.tags && plan.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-2">
              <span className="text-xs text-stone-400 font-medium">Klíčová slova:</span>
              {plan.tags.map(t => (
                <span
                  key={t}
                  className="bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 px-2.5 py-1 rounded-lg text-xs font-mono font-medium"
                >
                  #{t}
                </span>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
