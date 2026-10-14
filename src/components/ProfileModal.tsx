import React, { useState, useEffect } from 'react';
import { ScoutProgram, YearlyPlan } from '../types/scout';
import { ScoutUser, useAuth, formatScoutName } from '../context/AuthContext';
import { AGE_CATEGORIES, formatDuration, formatPlanDuration } from '../data/constants';
import { isPlanCreatedLocally } from '../firebase/yearlyPlanService';
import { ScoutLilieLogo } from './Header';
import { 
  X, 
  Trash2, 
  Edit3, 
  Eye, 
  Plus, 
  Heart, 
  Star, 
  Clock, 
  User, 
  ShieldCheck, 
  BookOpen, 
  Compass, 
  LogOut,
  AlertTriangle,
  Save,
  Check,
  Building,
  Flag,
  Sparkles,
  Calendar
} from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: ScoutUser | null;
  programs: ScoutProgram[];
  yearlyPlans?: YearlyPlan[];
  favoriteIds: string[];
  onOpenProgram: (program: ScoutProgram) => void;
  onEditProgram: (program: ScoutProgram) => void;
  onRequestDelete: (program: ScoutProgram) => void;
  onOpenPlan?: (plan: YearlyPlan) => void;
  onEditPlan?: (plan: YearlyPlan) => void;
  onRequestDeletePlan?: (plan: YearlyPlan) => void;
  onOpenCreate: () => void;
  onOpenCreatePlan?: () => void;
  onLogout: () => void;
}

export function isProgramAuthor(
  currentUser: ScoutUser | null, 
  program: { id?: string; authorId?: string; authorEmail?: string }
): boolean {
  if (program?.id && isPlanCreatedLocally(program.id)) {
    return true;
  }
  if (!currentUser) return false;
  // If program has an authorEmail and currentUser has an email, this is the definitive identity
  if (currentUser.email && program.authorEmail) {
    return currentUser.email.trim().toLowerCase() === program.authorEmail.trim().toLowerCase();
  }
  // Fallback to UID only if email is absent
  if (program.authorId && currentUser.uid && program.authorId === currentUser.uid) {
    return true;
  }
  return false;
}

export function isAppAdmin(currentUser: ScoutUser | null): boolean {
  return currentUser?.email === 'pospisiljosef491@gmail.com';
}

export function canUserManageProgram(
  currentUser: ScoutUser | null, 
  program: { id?: string; authorId?: string; authorEmail?: string }
): boolean {
  if (program?.id && isPlanCreatedLocally(program.id)) {
    return true;
  }
  if (!currentUser) return false;
  return isProgramAuthor(currentUser, program) || isAppAdmin(currentUser);
}

export const isUserAuthorOrAdmin = canUserManageProgram;

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  programs,
  yearlyPlans = [],
  favoriteIds,
  onOpenProgram,
  onEditProgram,
  onRequestDelete,
  onOpenPlan,
  onEditPlan,
  onRequestDeletePlan,
  onOpenCreate,
  onOpenCreatePlan,
  onLogout
}) => {
  const { updateUserProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'programs' | 'plans' | 'edit_profile' | 'favorites'>('programs');

  // Form states for profile editing
  const [firstName, setFirstName] = useState('');
  const [nickname, setNickname] = useState('');
  const [lastName, setLastName] = useState('');
  const [unitName, setUnitName] = useState('');
  const [centerName, setCenterName] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setFirstName(currentUser.firstName || '');
      setNickname(currentUser.nickname || '');
      setLastName(currentUser.lastName || '');
      setUnitName(currentUser.unitName || '');
      setCenterName(currentUser.centerName || '');
    }
  }, [currentUser, isOpen]);

  if (!isOpen || !currentUser) return null;

  const isAdmin = currentUser.email === 'pospisiljosef491@gmail.com';

  // Filter programs and yearly plans authored by user
  const myPrograms = programs.filter(p => isProgramAuthor(currentUser, p));
  const myPlans = yearlyPlans.filter(p => isProgramAuthor(currentUser, p));
  const myFavoritePrograms = programs.filter(p => favoriteIds.includes(p.id));

  const totalReviewsReceived = myPrograms.reduce((acc, p) => acc + (p.ratingCount || 0), 0);
  const totalFavoritesReceived = myPrograms.reduce((acc, p) => acc + (p.favoriteCount || 0), 0);

  // Live preview of formatted scout name
  const previewFormattedName = formatScoutName(firstName, nickname, lastName, currentUser.displayName);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setSavedSuccess(false);
    try {
      await updateUserProfile({
        firstName,
        nickname,
        lastName,
        unitName,
        centerName
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-sm flex justify-center items-start p-2 sm:p-6 animate-fadeIn">
      <div className="relative bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl sm:rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden my-2 sm:my-6">
        
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50/50 dark:bg-stone-800/50">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-base sm:text-lg shadow-sm shrink-0">
              {currentUser.displayName ? currentUser.displayName[0].toUpperCase() : 'S'}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <h2 className="text-base sm:text-xl font-bold text-stone-900 dark:text-stone-100 truncate">
                  {currentUser.displayName || 'Skautský vedoucí'}
                </h2>
                {isAdmin ? (
                  <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-700 shrink-0">
                    <ShieldCheck className="w-3 h-3 text-amber-600" />
                    Správce
                  </span>
                ) : (
                  <span className="text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300 shrink-0">
                    Skaut
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 truncate">
                {currentUser.unitName && currentUser.centerName
                  ? `${currentUser.unitName} • ${currentUser.centerName}`
                  : currentUser.unitName || currentUser.centerName || currentUser.email || 'Člen Junáka'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="p-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition touch-manipulation"
              title="Odhlásit se"
            >
              <LogOut className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition touch-manipulation"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab switchers */}
        <div className="px-3 sm:px-6 pt-2 sm:pt-3 border-b border-stone-200 dark:border-stone-800 flex gap-1 sm:gap-2 overflow-x-auto scrollbar-none bg-stone-50/20 dark:bg-stone-900/40">
          <button
            onClick={() => setActiveTab('programs')}
            className={`py-2.5 px-4 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'programs'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Moje programy ({myPrograms.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('plans')}
            className={`py-2.5 px-4 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'plans'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Moje celoroční plány ({myPlans.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('edit_profile')}
            className={`py-2.5 px-4 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'edit_profile'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Upravit profil & oddíl</span>
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`py-2.5 px-4 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'favorites'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Oblíbené ({myFavoritePrograms.length})</span>
          </button>
        </div>

        {/* Tab 1: Moje programy */}
        {activeTab === 'programs' && (
          <div className="p-6 space-y-6">
            
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-4 bg-stone-50 dark:bg-stone-800/60 rounded-2xl border border-stone-200/80 dark:border-stone-800 text-center">
                <span className="text-2xl font-black text-emerald-700 dark:text-emerald-400 block">
                  {myPrograms.length}
                </span>
                <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                  Vytvořených programů
                </span>
              </div>

              <div className="p-4 bg-stone-50 dark:bg-stone-800/60 rounded-2xl border border-stone-200/80 dark:border-stone-800 text-center">
                <span className="text-2xl font-black text-amber-600 dark:text-amber-400 block">
                  {totalReviewsReceived}
                </span>
                <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                  Získaných recenzí
                </span>
              </div>

              <div className="p-4 bg-stone-50 dark:bg-stone-800/60 rounded-2xl border border-stone-200/80 dark:border-stone-800 text-center">
                <span className="text-2xl font-black text-rose-600 dark:text-rose-400 block">
                  {totalFavoritesReceived}
                </span>
                <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                  Uloženo ostatními
                </span>
              </div>
            </div>

            {/* Section: Moje programy list */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-emerald-600" />
                    <span>Seznam mých přidaných programů</span>
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Upravujte nebo mazejte své programy přímo odtud.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('edit_profile')}
                    className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 rounded-xl text-xs font-semibold transition"
                  >
                    Upravit profil
                  </button>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenCreate();
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-xs transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Přidat program</span>
                  </button>
                </div>
              </div>

              {myPrograms.length === 0 ? (
                <div className="p-8 text-center bg-stone-50 dark:bg-stone-800/40 rounded-2xl border border-dashed border-stone-300 dark:border-stone-700 space-y-3">
                  <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
                    Zatím jste do databáze nevložili žádný vlastní program.
                  </p>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenCreate();
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition"
                  >
                    Vytvořit první program
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
                  {myPrograms.map((prog) => {
                    const cat = AGE_CATEGORIES.find(c => prog.ageCategories.includes(c.id));
                    return (
                      <div
                        key={prog.id}
                        className="p-3.5 sm:p-4 bg-white dark:bg-stone-800/80 rounded-2xl border border-stone-200 dark:border-stone-700/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-stone-300 transition"
                      >
                        <div className="space-y-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                            {cat && (
                              <span className={`font-bold px-2 py-0.5 rounded-full border ${cat.badgeBg}`}>
                                {cat.label}
                              </span>
                            )}
                            <span className="text-stone-500 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatDuration(prog.durationMinutes)}
                            </span>
                            <span className="text-amber-500 font-semibold flex items-center gap-0.5">
                              <Star className="w-3 h-3 fill-amber-400" />
                              {prog.ratingAverage ? prog.ratingAverage.toFixed(1) : '5.0'}
                            </span>
                          </div>

                          <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100 truncate">
                            {prog.title}
                          </h4>
                          <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-1">
                            {prog.summary}
                          </p>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-1.5 self-end sm:self-center flex-shrink-0">
                          {/* View */}
                          <button
                            onClick={() => {
                              onClose();
                              onOpenProgram(prog);
                            }}
                            className="p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-600 transition"
                            title="Prohlédnout program"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Edit */}
                          <button
                            onClick={() => {
                              onClose();
                              onEditProgram(prog);
                            }}
                            className="p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-600 transition"
                            title="Upravit program"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => onRequestDelete(prog)}
                            className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 border border-rose-200 dark:border-rose-900/80 transition"
                            title="Smazat program"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Smazat</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        )}

        {/* Tab: Moje celoroční plány */}
        {activeTab === 'plans' && (
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  <span>Seznam mých celoročních činností & plánů</span>
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Přehled a správa vámi vytvořených celoročních plánů.
                </p>
              </div>

              {onOpenCreatePlan && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenCreatePlan();
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-xs transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Přidat plán</span>
                </button>
              )}
            </div>

            {myPlans.length === 0 ? (
              <div className="p-8 text-center bg-stone-50 dark:bg-stone-800/40 rounded-2xl border border-dashed border-stone-300 dark:border-stone-700 space-y-3">
                <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
                  Zatím jste do databáze nevložili žádný vlastní celoroční plán.
                </p>
                {onOpenCreatePlan && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenCreatePlan();
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition"
                  >
                    Vytvořit první celoroční plán
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
                {myPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className="p-3.5 sm:p-4 bg-white dark:bg-stone-800/80 rounded-2xl border border-stone-200 dark:border-stone-700/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-stone-300 transition"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                        <span className="font-bold px-2 py-0.5 rounded-full border bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-700">
                          {formatPlanDuration(plan.durationMonths)}
                        </span>
                        {plan.pinnedProgramIds && plan.pinnedProgramIds.length > 0 && (
                          <span className="text-stone-500 font-medium">
                            • {plan.pinnedProgramIds.length} {plan.pinnedProgramIds.length === 1 ? 'připíchnutý program' : plan.pinnedProgramIds.length < 5 ? 'připíchnuté programy' : 'připíchnutých programů'}
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100 truncate">
                        {plan.title}
                      </h4>
                      <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-1">
                        {plan.vision || plan.educationalGoals}
                      </p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                      {onOpenPlan && (
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onOpenPlan(plan);
                          }}
                          className="p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-600 transition"
                          title="Prohlédnout celoroční plán"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}

                      {onEditPlan && (
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onEditPlan(plan);
                          }}
                          className="p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-600 transition"
                          title="Upravit celoroční plán"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      )}

                      {onRequestDeletePlan && (
                        <button
                          type="button"
                          onClick={() => onRequestDeletePlan(plan)}
                          className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 border border-rose-200 dark:border-rose-900/80 transition"
                          title="Smazat celoroční plán"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Smazat</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Upravit skautský profil */}
        {activeTab === 'edit_profile' && (
          <form onSubmit={handleSaveProfile} className="p-6 space-y-6">
            
            {/* Live Name Preview Card */}
            <div className="p-4 bg-emerald-50/80 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Náhled, jak se vaše jméno a oddíl zobrazí v aplikaci</span>
              </div>
              <div className="bg-white dark:bg-stone-900 p-3.5 rounded-xl border border-emerald-300 dark:border-emerald-700/80 shadow-xs space-y-1">
                <div className="text-base font-extrabold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <span>{previewFormattedName}</span>
                </div>
                <div className="text-xs text-stone-600 dark:text-stone-300 flex items-center gap-1.5 font-medium">
                  {unitName || centerName ? (
                    <>
                      {unitName && <span className="flex items-center gap-1"><Flag className="w-3 h-3 text-emerald-600" /> {unitName}</span>}
                      {unitName && centerName && <span>•</span>}
                      {centerName && <span className="flex items-center gap-1"><Building className="w-3 h-3 text-amber-600" /> {centerName}</span>}
                    </>
                  ) : (
                    <span className="text-stone-400 italic">Zadejte oddíl a středisko níže</span>
                  )}
                </div>
              </div>
            </div>

            {/* Name Fields: First Name, Nickname in parentheses, Last Name */}
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                Jméno, přezdívka a příjmení
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* First Name */}
                <div>
                  <span className="block text-[11px] font-semibold text-stone-500 mb-1">
                    Jméno
                  </span>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="např. Josef"
                    className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs sm:text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Nickname */}
                <div>
                  <span className="block text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 mb-1 flex items-center gap-1">
                    Přezdívka (v závorce)
                  </span>
                  <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="např. Javor"
                    className="w-full px-3.5 py-2.5 bg-emerald-50/40 dark:bg-stone-800 border border-emerald-300 dark:border-emerald-700 rounded-xl text-xs sm:text-sm font-semibold text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Last Name */}
                <div>
                  <span className="block text-[11px] font-semibold text-stone-500 mb-1">
                    Příjmení
                  </span>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="např. Pospíšil"
                    className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs sm:text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Troop and Center */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-stone-100 dark:border-stone-800">
              
              {/* Unit (Oddíl) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5 flex items-center gap-1.5">
                  <Flag className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Skautský oddíl</span>
                </label>
                <input
                  type="text"
                  value={unitName}
                  onChange={(e) => setUnitName(e.target.value)}
                  placeholder="např. 5. oddíl Vlčat a Světlušek"
                  className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs sm:text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Center (Středisko) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-amber-600" />
                  <span>Středisko / město</span>
                </label>
                <input
                  type="text"
                  value={centerName}
                  onChange={(e) => setCenterName(e.target.value)}
                  placeholder="např. Středisko Blaník Praha"
                  className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs sm:text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

            </div>

            {/* Save Buttons & Status */}
            <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
              <div>
                {savedSuccess && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-3 py-1.5 rounded-xl">
                    <Check className="w-4 h-4" />
                    Profil byl úspěšně uložen!
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('programs')}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
                >
                  Zpět k programům
                </button>
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md transition disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{savingProfile ? 'Ukládám...' : 'Uložit profil'}</span>
                </button>
              </div>
            </div>

          </form>
        )}

        {/* Tab 3: Oblíbené */}
        {activeTab === 'favorites' && (
          <div className="p-6 space-y-4">
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              <span>Vaše uložené oblíbené programy ({myFavoritePrograms.length})</span>
            </h3>

            {myFavoritePrograms.length === 0 ? (
              <p className="text-xs sm:text-sm text-stone-400 italic py-8 text-center">
                Zatím nemáte uloženy žádné oblíbené programy. Uložit si je můžete kliknutím na ikonu srdíčka u kteréhokoliv programu.
              </p>
            ) : (
              <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                {myFavoritePrograms.map((fav) => (
                  <div
                    key={fav.id}
                    onClick={() => {
                      onClose();
                      onOpenProgram(fav);
                    }}
                    className="p-3 bg-stone-50 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 flex items-center justify-between hover:bg-stone-100 dark:hover:bg-stone-750 cursor-pointer transition"
                  >
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-100">
                        {fav.title}
                      </h4>
                      <p className="text-[11px] text-stone-500">
                        Od: {fav.authorName} • {formatDuration(fav.durationMinutes)}
                      </p>
                    </div>
                    <Eye className="w-4 h-4 text-stone-400" />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50/50 dark:bg-stone-800/50 text-xs text-stone-400">
          <span>Skautská Programovna • Váš oddílový profil</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-200 dark:bg-stone-700 hover:bg-stone-300 text-stone-800 dark:text-stone-200 rounded-xl font-semibold transition"
          >
            Zavřít
          </button>
        </div>

      </div>
    </div>
  );
};
