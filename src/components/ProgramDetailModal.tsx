import React, { useState, useEffect } from 'react';
import { ScoutProgram, ProgramReview } from '../types/scout';
import { 
  AGE_CATEGORIES, 
  SCOUT_METHOD_ELEMENTS, 
  WEATHER_OPTIONS, 
  SCOUT_EVENT_TYPES,
  formatDuration 
} from '../data/constants';
import { MetricRadarOrBars } from './MetricRadarOrBars';
import { subscribeToReviews, addProgramReview } from '../firebase/programService';
import { useAuth } from '../context/AuthContext';
import { isUserAuthorOrAdmin, isProgramAuthor } from './ProfileModal';
import { ScoutLilieLogo } from './Header';
import { shareProgram } from '../utils/shareUtils';
import { 
  X, 
  Heart, 
  Clock, 
  Star, 
  FileText, 
  ExternalLink, 
  Download, 
  Printer, 
  Trees, 
  Home, 
  Share2, 
  Check, 
  MessageSquare, 
  Send, 
  User, 
  Sparkles, 
  Compass, 
  BookOpen, 
  Target, 
  Package,
  Calendar,
  AlertCircle,
  Sun,
  CloudRain,
  Snowflake,
  Flame,
  Trash2,
  Edit3,
  Flag,
  Building,
  UserCheck
} from 'lucide-react';

interface ProgramDetailModalProps {
  program: ScoutProgram | null;
  isOpen: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onOpenAuth: () => void;
  onOpenEdit?: (program: ScoutProgram) => void;
  onRequestDelete?: (program: ScoutProgram) => void;
  onPrint: (program: ScoutProgram) => void;
  onToast?: (msg: string) => void;
  onOpenShareModal?: (program: ScoutProgram) => void;
}

export const ProgramDetailModal: React.FC<ProgramDetailModalProps> = ({
  program,
  isOpen,
  onClose,
  isFavorite,
  onToggleFavorite,
  onOpenAuth,
  onOpenEdit,
  onRequestDelete,
  onPrint,
  onToast,
  onOpenShareModal
}) => {
  const { currentUser } = useAuth();
  const [reviews, setReviews] = useState<ProgramReview[]>([]);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (!program || !isOpen) return;
    const unsub = subscribeToReviews(program.id, (loadedReviews) => {
      setReviews(loadedReviews);
    });
    return () => unsub();
  }, [program, isOpen]);

  if (!isOpen || !program) return null;

  const isAuthor = isUserAuthorOrAdmin(currentUser, program);

  const handleShare = async () => {
    try {
      const res = await shareProgram(program);
      if (res.success) {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2500);
        if (res.method === 'clipboard' && onToast) {
          onToast('Odkaz na aktivitu byl zkopírován do schránky!');
        }
      } else {
        if (onOpenShareModal) {
          onOpenShareModal(program);
        }
      }
    } catch (e) {
      if (onOpenShareModal) {
        onOpenShareModal(program);
      }
    }
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    if (!newComment.trim()) return;

    setSubmittingReview(true);
    try {
      await addProgramReview(program.id, {
        userId: currentUser.uid,
        userName: currentUser.displayName || 'Skautský vedoucí',
        userEmail: currentUser.email || undefined,
        rating: newRating,
        comment: newComment.trim()
      });
      setNewComment('');
      setNewRating(5);
    } catch (err) {
      console.error('Failed to submit review:', err);
    } finally {
      setSubmittingReview(false);
    }
  };

  const weatherIcons: Record<string, React.ReactNode> = {
    sunny: <span className="inline-flex items-center gap-1"><Sun className="w-4 h-4 text-amber-500" /> Slunečno</span>,
    rain: <span className="inline-flex items-center gap-1"><CloudRain className="w-4 h-4 text-blue-500" /> Déšť & mokro</span>,
    snow: <span className="inline-flex items-center gap-1"><Snowflake className="w-4 h-4 text-sky-400" /> Sníh & zima</span>,
    heat: <span className="inline-flex items-center gap-1"><Flame className="w-4 h-4 text-orange-500" /> Letní horko / voda</span>,
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-sm flex justify-center items-start p-2 sm:p-4 md:p-6 animate-fadeIn">
      <div className="relative bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden my-6">
        
        {/* Sticky Header with Action Buttons */}
        <div className="sticky top-0 z-20 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md px-6 py-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ScoutLilieLogo className="w-6 h-6 shrink-0" withBadge={false} />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              Karta programu
            </span>
            <span className="text-stone-300 dark:text-stone-700">•</span>
            <span className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {formatDuration(program.durationMinutes)}
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Print button */}
            <button
              type="button"
              onClick={() => onPrint(program)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 text-xs font-bold transition shadow-xs"
              title="Zobrazit detailní rozložení tisku pro formát A4"
            >
              <Printer className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="hidden xs:inline sm:inline">Rozložení tisku</span>
            </button>

            {/* Share button */}
            <button
              onClick={handleShare}
              className={`p-2 rounded-xl border transition flex items-center gap-1 ${
                copiedLink
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 border-emerald-300 dark:border-emerald-700'
                  : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 border-stone-200 dark:border-stone-700'
              }`}
              title="Sdílet odkaz na aktivitu"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>

            {/* Favorite button */}
            <button
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

            {/* Edit button if author */}
            {isAuthor && onOpenEdit && (
              <button
                onClick={() => onOpenEdit(program)}
                className="p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-700 transition"
                title="Upravit program"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            )}

            {/* Delete button if author or admin */}
            {isAuthor && onRequestDelete && (
              <button
                onClick={() => onRequestDelete(program)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900 transition"
                title="Smazat program"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Smazat</span>
              </button>
            )}

            {/* Close button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 sm:p-8 space-y-8">
          
          {/* Main Title & Badges */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {program.ageCategories.map((catId) => {
                const cat = AGE_CATEGORIES.find(c => c.id === catId);
                return (
                  <span 
                    key={catId} 
                    className={`text-xs font-bold px-3 py-1 rounded-full border ${cat?.badgeBg || 'bg-stone-100'}`}
                  >
                    {cat?.label || catId}
                  </span>
                );
              })}

              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Čas: {formatDuration(program.durationMinutes)}
              </span>

              {program.minParticipants && (
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
                  {program.minParticipants}–{program.maxParticipants || '+'} hráčů
                </span>
              )}

              {/* Event Types Pills */}
              {program.eventTypes && program.eventTypes.map((et) => {
                const ev = SCOUT_EVENT_TYPES.find(x => x.id === et);
                if (!ev) return null;
                return (
                  <span 
                    key={et} 
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${ev.badgeBg}`}
                  >
                    {ev.label}
                  </span>
                );
              })}

              {/* Owner indicator */}
              {isProgramAuthor(currentUser, program) && (
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Váš program
                </span>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100 leading-tight mb-3">
              {program.title}
            </h2>

            <p className="text-base sm:text-lg text-stone-600 dark:text-stone-300 leading-relaxed font-normal">
              {program.summary}
            </p>
          </div>

          {/* Quick Context Bar (Environment, Weather, Rating, Author) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-stone-50 dark:bg-stone-800/60 rounded-2xl border border-stone-200/80 dark:border-stone-800 text-xs">
            <div>
              <span className="text-stone-400 block mb-1">Prostředí:</span>
              <span className="font-semibold text-stone-800 dark:text-stone-200 flex items-center gap-1">
                {program.environment === 'outside' && <><Trees className="w-4 h-4 text-emerald-600" /> Venku v přírodě</>}
                {program.environment === 'inside' && <><Home className="w-4 h-4 text-amber-600" /> Uvnitř v klubovně</>}
                {program.environment === 'both' && <><Trees className="w-4 h-4 text-emerald-600" /> Venku i uvnitř</>}
              </span>
            </div>

            <div>
              <span className="text-stone-400 block mb-1">Vhodné počasí:</span>
              <div className="flex flex-wrap gap-1 font-medium text-stone-700 dark:text-stone-300">
                {program.weather && program.weather.length > 0 ? (
                  program.weather.map(w => (
                    <span key={w} className="mr-1">{weatherIcons[w]}</span>
                  ))
                ) : (
                  <span>Libovolné</span>
                )}
              </div>
            </div>

            <div>
              <span className="text-stone-400 block mb-1">Hodnocení vedoucích:</span>
              <span className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1 text-sm">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                {program.ratingAverage ? program.ratingAverage.toFixed(1) : '5.0'} 
                <span className="text-stone-400 text-xs font-normal">({reviews.length} recenzí)</span>
              </span>
            </div>

            <div>
              <span className="text-stone-400 block mb-1">Autor programu:</span>
              <span className="font-bold text-stone-900 dark:text-stone-100 truncate block">
                {program.authorName}
              </span>
              {(program.authorUnit || program.authorCenter) && (
                <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold truncate block mt-0.5">
                  {[program.authorUnit, program.authorCenter].filter(Boolean).join(' • ')}
                </span>
              )}
            </div>
          </div>

          {/* Scout Author Profile Card */}
          <div className="p-4 bg-emerald-50/80 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-bold text-base shadow-xs shrink-0">
                {program.authorName ? program.authorName[0].toUpperCase() : 'S'}
              </div>
              <div className="min-w-0">
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-800 dark:text-emerald-400 block">
                  Vytvořil(a) skautský vedoucí
                </span>
                <h4 className="font-extrabold text-sm sm:text-base text-stone-900 dark:text-stone-100 truncate">
                  {program.authorName}
                </h4>
                {(program.authorUnit || program.authorCenter) && (
                  <p className="text-xs text-emerald-800 dark:text-emerald-300 font-medium truncate flex items-center gap-1.5 mt-0.5">
                    {program.authorUnit && (
                      <span className="flex items-center gap-1">
                        <Flag className="w-3 h-3 text-emerald-600 shrink-0" />
                        {program.authorUnit}
                      </span>
                    )}
                    {program.authorUnit && program.authorCenter && <span>•</span>}
                    {program.authorCenter && (
                      <span className="flex items-center gap-1">
                        <Building className="w-3 h-3 text-amber-600 shrink-0" />
                        {program.authorCenter}
                      </span>
                    )}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => onPrint(program)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-md"
                title="Zobrazit detailní rozložení tisku optimalizované pro formát A4"
              >
                <Printer className="w-4 h-4" />
                <span>Rozložení tisku (A4)</span>
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white dark:bg-stone-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700 text-xs font-bold transition shadow-xs"
                title="Kopírovat odkaz na program"
              >
                <Share2 className="w-4 h-4 text-emerald-600" />
                <span>{copiedLink ? 'Odkaz zkopírován!' : 'Sdílet odkaz'}</span>
              </button>
            </div>
          </div>

          {/* 5-Metrics Radar/Bars Grid & Scout Method Elements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* 1-10 Metrics Breakdown */}
            <div>
              <MetricRadarOrBars metrics={program} compact={false} />
            </div>

            {/* Scout Method Elements */}
            <div className="space-y-3 bg-stone-50/80 dark:bg-stone-900/60 p-4 rounded-xl border border-stone-200 dark:border-stone-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Prvky skautské metody v tomto programu</span>
              </h4>
              <div className="space-y-2">
                {program.scoutMethods.map((mId) => {
                  const m = SCOUT_METHOD_ELEMENTS.find(el => el.id === mId);
                  if (!m) return null;
                  return (
                    <div key={mId} className="p-2.5 rounded-lg bg-white dark:bg-stone-800 border border-stone-200/70 dark:border-stone-700/60 text-xs">
                      <div className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                        {m.name}
                      </div>
                      <p className="text-stone-600 dark:text-stone-300 mt-0.5 text-[11px] leading-relaxed">
                        {m.shortDesc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Educational Goals (Výchovné cíle) */}
          <div className="p-5 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200/80 dark:border-emerald-800/60 space-y-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
              <Target className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
              <span>Výchovné cíle (Co program rozvíjí)</span>
            </h3>
            <p className="text-sm sm:text-base text-emerald-950 dark:text-emerald-100 leading-relaxed whitespace-pre-line font-medium">
              {program.educationalGoals || 'Výchovný cíl nebyl specifikován.'}
            </p>
          </div>

          {/* Materials & Supplies */}
          <div className="p-5 bg-amber-50/60 dark:bg-amber-950/30 rounded-2xl border border-amber-200/80 dark:border-amber-800/60 space-y-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-900 dark:text-amber-200 flex items-center gap-2">
              <Package className="w-4 h-4 text-amber-700 dark:text-amber-400" />
              <span>Potřebný materiál a pomůcky</span>
            </h3>
            <p className="text-sm text-stone-700 dark:text-stone-200 leading-relaxed whitespace-pre-line">
              {program.materials || 'Žádné zvláštní pomůcky nejsou potřeba.'}
            </p>
          </div>

          {/* Detailed Description / Methodology */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-2">
              <BookOpen className="w-5 h-5 text-emerald-600" />
              <span>Podrobný popis a metodika realizace</span>
            </h3>
            <div className="prose dark:prose-invert max-w-none text-stone-700 dark:text-stone-200 text-sm sm:text-base leading-relaxed whitespace-pre-line">
              {program.description}
            </div>
          </div>

          {/* Attachments Section (Google Doc, PDF, Uploaded file) */}
          {(program.attachmentUrl || program.attachmentData) && (
            <div className="p-4 bg-sky-50 dark:bg-sky-950/40 rounded-2xl border border-sky-200 dark:border-sky-800/60 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-sky-900 dark:text-sky-200 flex items-center gap-2">
                <FileText className="w-4 h-4 text-sky-600" />
                <span>Přílohy a metodické materiály k programu</span>
              </h4>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                {program.attachmentUrl && (
                  <a
                    href={program.attachmentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-stone-800 text-sky-700 dark:text-sky-300 font-semibold text-xs sm:text-sm rounded-xl border border-sky-300 dark:border-sky-700 shadow-xs hover:bg-sky-100 transition"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>{program.attachmentName || 'Otevřít Google Dokument / PDF'}</span>
                  </a>
                )}
                {program.attachmentData && (
                  <a
                    href={program.attachmentData}
                    download={program.attachmentName || 'scout_program_priloha.pdf'}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xs transition"
                  >
                    <Download className="w-4 h-4" />
                    <span>Stáhnout přílohu ({program.attachmentName || 'soubor'})</span>
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Tags */}
          {program.tags && program.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-2">
              <span className="text-xs text-stone-400 font-medium">Štítky:</span>
              {program.tags.map(tag => (
                <span key={tag} className="text-xs bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 px-2.5 py-1 rounded-lg border border-stone-200 dark:border-stone-700">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Reviews & Feedback Section */}
          <div className="pt-6 border-t border-stone-200 dark:border-stone-800 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-emerald-600" />
                  <span>Zkušenosti z realizace a hodnocení ({reviews.length})</span>
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Zpětná vazba od skautských vedoucích, kteří tento program vyzkoušeli v praxi.
                </p>
              </div>
            </div>

            {/* Add Review Form */}
            <div className="bg-stone-50 dark:bg-stone-800/60 p-5 rounded-2xl border border-stone-200/80 dark:border-stone-700/80">
              {currentUser ? (
                <form onSubmit={handleAddReview} className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-bold text-stone-700 dark:text-stone-200">
                      Přidat hodnocení jako: <strong className="text-emerald-700 dark:text-emerald-400">{currentUser.displayName}</strong>
                    </span>

                    {/* Star picker */}
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-stone-500 mr-1">Známka:</span>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewRating(star)}
                          className="p-1 hover:scale-110 transition text-amber-400"
                        >
                          <Star className={`w-5 h-5 ${star <= newRating ? 'fill-amber-400' : 'text-stone-300 dark:text-stone-600'}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <textarea
                    rows={3}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Popište, jak program fungoval s vaší družinou/oddílem. Co doporučujete upravit nebo na co dát pozor?"
                    className="w-full p-3 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={submittingReview || !newComment.trim()}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold text-xs rounded-xl shadow-xs transition"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{submittingReview ? 'Odesílám...' : 'Přidat hodnocení'}</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                    <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300">
                      Hodnotit a komentovat program mohou pouze přihlášení uživatelé.
                    </p>
                  </div>
                  <button
                    onClick={onOpenAuth}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs rounded-xl shadow-xs transition whitespace-nowrap"
                  >
                    Přihlásit se pro vložení recenze
                  </button>
                </div>
              )}
            </div>

            {/* Reviews List */}
            <div className="space-y-3">
              {reviews.length === 0 ? (
                <p className="text-xs text-stone-400 italic text-center py-4">
                  K tomuto programu zatím nikdo nenapsal recenzi. Buďte první, kdo ji vyzkouší a ohodnotí!
                </p>
              ) : (
                reviews.map((rev) => (
                  <div key={rev.id} className="p-4 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs sm:text-sm text-stone-800 dark:text-stone-200">
                          {rev.userName}
                        </span>
                        <div className="flex items-center text-amber-400">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-400" />
                          ))}
                        </div>
                      </div>
                      <span className="text-[10px] text-stone-400">
                        {new Date(rev.createdAt).toLocaleDateString('cs-CZ')}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                      {rev.comment}
                    </p>
                  </div>
                ))
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
