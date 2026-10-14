import React from 'react';
import { ScoutProgram } from '../types/scout';
import { AGE_CATEGORIES, SCOUT_EVENT_TYPES, formatDuration } from '../data/constants';
import { MetricRadarOrBars } from './MetricRadarOrBars';
import { 
  Heart, 
  Clock, 
  Star, 
  Trees, 
  Home, 
  Sun, 
  CloudRain, 
  Snowflake, 
  Flame, 
  FileText, 
  ExternalLink,
  Users,
  Compass,
  Trash2,
  Share2,
  Flag,
  Building,
  UserCheck,
  Printer
} from 'lucide-react';

interface ProgramCardProps {
  program: ScoutProgram;
  isFavorite: boolean;
  onToggleFavorite: (e: React.MouseEvent) => void;
  onClick: () => void;
  isAuthorOrAdmin?: boolean;
  isOwner?: boolean;
  onRequestDelete?: (e: React.MouseEvent) => void;
  onShare?: (e: React.MouseEvent) => void;
  onPrint?: (e: React.MouseEvent) => void;
}

export const ProgramCard: React.FC<ProgramCardProps> = ({
  program,
  isFavorite,
  onToggleFavorite,
  onClick,
  isAuthorOrAdmin = false,
  isOwner = false,
  onRequestDelete,
  onShare,
  onPrint
}) => {
  // Find age category metadata
  const primaryAgeCat = AGE_CATEGORIES.find(c => program.ageCategories.includes(c.id)) || AGE_CATEGORIES[1];

  const weatherIcons: Record<string, React.ReactNode> = {
    sunny: <span title="Vhodné pro slunečno"><Sun className="w-3.5 h-3.5 text-amber-500" /></span>,
    rain: <span title="Vhodné do deště"><CloudRain className="w-3.5 h-3.5 text-blue-500" /></span>,
    snow: <span title="Vhodné na sníh"><Snowflake className="w-3.5 h-3.5 text-sky-400" /></span>,
    heat: <span title="Vhodné do horka / k vodě"><Flame className="w-3.5 h-3.5 text-orange-500" /></span>,
  };

  return (
    <div 
      onClick={onClick}
      className="group relative bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-xl hover:border-emerald-600/50 dark:hover:border-emerald-500/50 transition-all duration-150 cursor-pointer flex flex-col justify-between h-full min-h-[340px]"
    >
      <div>
        {/* Top badges row */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {/* Age Category Pills */}
            {program.ageCategories.map((catId) => {
              const cat = AGE_CATEGORIES.find(c => c.id === catId);
              if (!cat) return null;
              return (
                <span 
                  key={catId}
                  className={`text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${cat.badgeBg}`}
                >
                  {cat.label}
                </span>
              );
            })}

            {/* Event Types Pills (Schůzka, Výprava, Tábor, Vzdělávací akce) */}
            {program.eventTypes && program.eventTypes.map((et) => {
              const ev = SCOUT_EVENT_TYPES.find(x => x.id === et);
              if (!ev) return null;
              return (
                <span 
                  key={et}
                  className={`text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-full border ${ev.badgeBg}`}
                >
                  {ev.badgeText}
                </span>
              );
            })}

            {/* Duration Badge */}
            <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
              <Clock className="w-3 h-3 text-stone-500" />
              {formatDuration(program.durationMinutes)}
            </span>

            {/* Owner badge if user created this */}
            {isOwner && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                <UserCheck className="w-3 h-3 text-emerald-600" />
                Můj program
              </span>
            )}
          </div>

          {/* Action buttons: Print, Share, Delete (if author/admin) & Favorite */}
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
                onClick={(e) => {
                  e.stopPropagation();
                  onShare(e);
                }}
                className="p-1.5 sm:p-2 rounded-xl text-stone-400 hover:text-emerald-600 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
                title="Sdílet program"
              >
                <Share2 className="w-4 h-4" />
              </button>
            )}

            {isAuthorOrAdmin && onRequestDelete && (
              <button
                onClick={onRequestDelete}
                className="p-1.5 sm:p-2 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                title="Smazat program"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            <button
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

        {/* Title */}
        <h3 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors line-clamp-2 leading-snug mb-2">
          {program.title}
        </h3>

        {/* Short Summary */}
        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 line-clamp-3 mb-4 leading-relaxed">
          {program.summary}
        </p>

        {/* 5-Metrics Compact Bar */}
        <div className="mb-4">
          <MetricRadarOrBars metrics={program} compact={true} />
        </div>
      </div>

      <div>
        {/* Environment & Weather + Participants tags */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-stone-100 dark:border-stone-800 text-xs text-stone-500 dark:text-stone-400 mb-3">
          
          <div className="flex items-center gap-2">
            {/* Environment */}
            <span className="flex items-center gap-1" title={
              program.environment === 'outside' ? 'Venku' : program.environment === 'inside' ? 'Uvnitř' : 'Venku i uvnitř'
            }>
              {program.environment === 'outside' && <Trees className="w-3.5 h-3.5 text-emerald-600" />}
              {program.environment === 'inside' && <Home className="w-3.5 h-3.5 text-amber-600" />}
              {program.environment === 'both' && (
                <span className="flex items-center text-[11px] font-medium text-stone-600 dark:text-stone-400">
                  <Trees className="w-3 h-3 text-emerald-600 mr-0.5" />
                  <Home className="w-3 h-3 text-amber-600 mr-1" />
                  Libovolné
                </span>
              )}
            </span>

            {/* Weather icons */}
            {program.weather && program.weather.length > 0 && (
              <div className="flex items-center gap-1 pl-1 border-l border-stone-200 dark:border-stone-700">
                {program.weather.map(w => (
                  <span key={w}>{weatherIcons[w]}</span>
                ))}
              </div>
            )}

            {/* Attachment indicator */}
            {(program.attachmentUrl || program.attachmentData) && (
              <span className="inline-flex items-center gap-0.5 text-[11px] text-sky-600 dark:text-sky-400 font-medium bg-sky-50 dark:bg-sky-950/40 px-1.5 py-0.5 rounded border border-sky-200 dark:border-sky-800" title="Obsahuje přílohu (PDF / Google Docs)">
                <FileText className="w-3 h-3" />
                <span>Příloha</span>
              </span>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 font-semibold text-stone-800 dark:text-stone-200">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{program.ratingAverage ? program.ratingAverage.toFixed(1) : '5.0'}</span>
            <span className="text-[10px] text-stone-400 font-normal">
              ({program.ratingCount || 0})
            </span>
          </div>

        </div>

        {/* Footer: Author, Unit & Center, and All Keywords/Tags */}
        <div className="pt-2.5 border-t border-stone-100 dark:border-stone-800 space-y-2">
          <div>
            <div className="flex items-center text-xs gap-1.5">
              <span className="text-stone-400 text-[11px]">Od: </span>
              {isOwner ? (
                <span className="text-emerald-700 dark:text-emerald-400 font-bold truncate">
                  Vy ({program.authorName})
                </span>
              ) : (
                <span className="text-stone-800 dark:text-stone-100 font-bold truncate">
                  {program.authorName}
                </span>
              )}
            </div>
            {(program.authorUnit || program.authorCenter) && (
              <div className="text-[11px] text-emerald-800 dark:text-emerald-300 font-medium truncate flex items-center gap-1.5 flex-wrap mt-0.5">
                {program.authorUnit && (
                  <span className="truncate flex items-center gap-1">
                    <Flag className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span>{program.authorUnit}</span>
                  </span>
                )}
                {program.authorUnit && program.authorCenter && <span className="text-stone-300 dark:text-stone-600">•</span>}
                {program.authorCenter && (
                  <span className="truncate flex items-center gap-1 text-stone-600 dark:text-stone-300">
                    <Building className="w-3 h-3 text-amber-600 shrink-0" />
                    <span>{program.authorCenter}</span>
                  </span>
                )}
              </div>
            )}
          </div>

          {/* All tags / keywords */}
          {program.tags && program.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1 pt-1 border-t border-stone-100 dark:border-stone-800/60">
              {program.tags.map((tag) => (
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
    </div>
  );
};
