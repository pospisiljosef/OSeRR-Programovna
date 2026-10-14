import React from 'react';
import { YearlyPlan } from '../types/scout';
import { AGE_CATEGORIES, SCOUT_METHOD_ELEMENTS, formatPlanDuration } from '../data/constants';
import { YearlyPlanRadarOrBars } from './YearlyPlanRadarOrBars';
import { 
  Heart, 
  Calendar, 
  Target, 
  Sparkles, 
  Pin, 
  Share2, 
  Trash2, 
  UserCheck, 
  Flag, 
  Building, 
  ChevronRight,
  BookOpen,
  Printer
} from 'lucide-react';

interface YearlyPlanCardProps {
  plan: YearlyPlan;
  isFavorite: boolean;
  isAuthorOrAdmin: boolean;
  isOwner?: boolean;
  onToggleFavorite: (e: React.MouseEvent) => void;
  onShare?: (e: React.MouseEvent) => void;
  onRequestDelete?: (e: React.MouseEvent) => void;
  onPrint?: (e: React.MouseEvent) => void;
  onClick: () => void;
}

export const YearlyPlanCard: React.FC<YearlyPlanCardProps> = ({
  plan,
  isFavorite,
  isAuthorOrAdmin,
  isOwner = false,
  onToggleFavorite,
  onShare,
  onRequestDelete,
  onPrint,
  onClick
}) => {
  const pinnedCount = plan.pinnedProgramIds ? plan.pinnedProgramIds.length : 0;
  const monthsCount = plan.monthlySchedule ? plan.monthlySchedule.length : plan.durationMonths;

  return (
    <div
      onClick={onClick}
      className="group bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 hover:border-emerald-500/70 dark:hover:border-emerald-500/70 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer relative"
    >
      {/* Top Banner & Badges */}
      <div className="p-4 sm:p-5 pb-3">
        <div className="flex items-start justify-between gap-2 mb-2.5">
          {/* Duration Badge & Owner Badge */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
              <Calendar className="w-3.5 h-3.5 text-emerald-600" />
              {formatPlanDuration(plan.durationMonths)}
            </span>

            {isOwner && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 border border-purple-300 dark:border-purple-700">
                <UserCheck className="w-3 h-3 text-purple-600" />
                Můj celoroční plán
              </span>
            )}

            {pinnedCount > 0 && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                <Pin className="w-3 h-3 text-amber-600" />
                {pinnedCount} {pinnedCount === 1 ? 'program' : pinnedCount < 5 ? 'programy' : 'programů'}
              </span>
            )}
          </div>

          {/* Action buttons: Print, Share, Delete, Favorite */}
          <div className="flex items-center gap-0.5 -mr-1 -mt-1">
            {onPrint && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onPrint(e);
                }}
                className="p-1.5 sm:p-2 rounded-xl text-stone-400 hover:text-emerald-600 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
                title="Rozložení tisku (A4)"
              >
                <Printer className="w-4 h-4" />
              </button>
            )}

            {onShare && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onShare(e);
                }}
                className="p-1.5 sm:p-2 rounded-xl text-stone-400 hover:text-emerald-600 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
                title="Sdílet plán"
              >
                <Share2 className="w-4 h-4" />
              </button>
            )}

            {(isAuthorOrAdmin || isOwner) && onRequestDelete && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRequestDelete(e);
                }}
                className="p-1.5 sm:p-2 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                title="Smazat plán"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={onToggleFavorite}
              className={`p-1.5 sm:p-2 rounded-xl transition ${
                isFavorite
                  ? 'text-rose-500 hover:text-rose-600 bg-rose-50 dark:bg-rose-950/40'
                  : 'text-stone-400 hover:text-rose-500 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
              title={isFavorite ? 'Odebrat z oblíbených' : 'Uložit do oblíbených'}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Age Categories Badges */}
        <div className="flex flex-wrap gap-1 mb-2">
          {plan.ageCategories?.map((catId) => {
            const cat = AGE_CATEGORIES.find(c => c.id === catId);
            if (!cat) return null;
            return (
              <span
                key={catId}
                className={`text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-full border ${cat.badgeBg}`}
              >
                {cat.badgeText}
              </span>
            );
          })}
        </div>

        {/* Title & Motto */}
        <h3 className="text-base sm:text-lg font-black text-stone-900 dark:text-stone-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors line-clamp-2 leading-snug mb-1">
          {plan.title}
        </h3>

        {plan.motto && (
          <p className="text-xs text-amber-700 dark:text-amber-400 italic font-medium line-clamp-1 mb-2">
            {plan.motto}
          </p>
        )}

        {/* Summary */}
        <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-2 mb-3 leading-relaxed">
          {plan.summary}
        </p>

        {/* Educational Goals & Vision highlights */}
        <div className="bg-stone-50 dark:bg-stone-800/60 p-2.5 rounded-xl border border-stone-200/80 dark:border-stone-800 text-[11px] space-y-1.5 mb-3">
          <div className="line-clamp-1">
            <span className="font-bold text-emerald-800 dark:text-emerald-400">Vize: </span>
            <span className="text-stone-700 dark:text-stone-300">{plan.vision}</span>
          </div>
          <div className="line-clamp-1">
            <span className="font-bold text-emerald-800 dark:text-emerald-400">Cíle: </span>
            <span className="text-stone-700 dark:text-stone-300">{plan.educationalGoals}</span>
          </div>
        </div>

        {/* 5 Personal Development Scales */}
        <div className="mb-2">
          <YearlyPlanRadarOrBars scales={plan} compact={true} />
        </div>

        {/* Scout Methods Icons */}
        {plan.scoutMethods && plan.scoutMethods.length > 0 && (
          <div className="flex flex-wrap items-center gap-1 text-[10px] text-stone-500 pt-2 border-t border-stone-100 dark:border-stone-800">
            <span className="font-semibold text-stone-400">Metoda: </span>
            {plan.scoutMethods.slice(0, 4).map((mId) => {
              const el = SCOUT_METHOD_ELEMENTS.find(e => e.id === mId);
              if (!el) return null;
              return (
                <span key={mId} className="bg-stone-100 dark:bg-stone-800 px-1.5 py-0.5 rounded text-stone-600 dark:text-stone-400">
                  {el.name}
                </span>
              );
            })}
            {plan.scoutMethods.length > 4 && (
              <span className="text-[10px] text-stone-400 font-bold">+{plan.scoutMethods.length - 4}</span>
            )}
          </div>
        )}
      </div>

      {/* Footer: Author, Unit & Center, and ALL keywords */}
      <div className="p-4 sm:p-5 pt-3 bg-stone-50/50 dark:bg-stone-900 border-t border-stone-100 dark:border-stone-800 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div>
            <span className="text-stone-400 text-[11px]">Od: </span>
            {isOwner ? (
              <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                Vy ({plan.authorName})
              </span>
            ) : (
              <span className="text-stone-800 dark:text-stone-200 font-bold">
                {plan.authorName}
              </span>
            )}
            {(plan.authorUnit || plan.authorCenter) && (
              <div className="text-[10px] text-stone-500 flex items-center gap-1 mt-0.5">
                {plan.authorUnit && <span>{plan.authorUnit}</span>}
                {plan.authorUnit && plan.authorCenter && <span>•</span>}
                {plan.authorCenter && <span>{plan.authorCenter}</span>}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold group-hover:translate-x-1 transition-transform">
            <span>Zobrazit plán</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>

        {/* ALL Tags / Keywords */}
        {plan.tags && plan.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1 pt-1.5 border-t border-stone-100 dark:border-stone-800/80">
            {plan.tags.map((tag) => (
              <span
                key={tag}
                className="bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 px-2 py-0.5 rounded-md font-mono text-[10px] font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
