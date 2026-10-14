/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ScoutProgram, FilterState, YearlyPlan, YearlyPlanFilterState } from './types/scout';
import { INITIAL_FILTER_STATE, INITIAL_YEARLY_PLAN_FILTER, AGE_CATEGORIES } from './data/constants';
import { 
  subscribeToPrograms, 
  saveProgram, 
  deleteProgram, 
  subscribeToUserFavorites, 
  toggleProgramFavorite 
} from './firebase/programService';
import { 
  subscribeToYearlyPlans, 
  saveYearlyPlan, 
  deleteYearlyPlan, 
  toggleYearlyPlanFavorite, 
  subscribeToUserPlanFavorites 
} from './firebase/yearlyPlanService';
import { Header, ScoutLilieLogo } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { ProgramCard } from './components/ProgramCard';
import { ProgramDetailModal } from './components/ProgramDetailModal';
import { ProgramFormModal } from './components/ProgramFormModal';
import { YearlyPlanCard } from './components/YearlyPlanCard';
import { YearlyPlanFilterBar } from './components/YearlyPlanFilterBar';
import { YearlyPlanDetailModal } from './components/YearlyPlanDetailModal';
import { YearlyPlanFormModal } from './components/YearlyPlanFormModal';
import { AuthModal } from './components/AuthModal';
import { ScoutMethodInfoModal } from './components/ScoutMethodInfoModal';
import { PrintCard } from './components/PrintCard';
import { ProfileModal, isUserAuthorOrAdmin, isProgramAuthor } from './components/ProfileModal';
import { ConfirmDeleteModal } from './components/ConfirmDeleteModal';
import { ShareModal } from './components/ShareModal';
import { shareProgram } from './utils/shareUtils';
import { 
  Compass, 
  Plus, 
  Trees, 
  Flame, 
  Heart, 
  Sparkles, 
  BookOpen, 
  RefreshCw, 
  SearchX, 
  CheckCircle2, 
  User, 
  Calendar, 
  Layers, 
  LayoutGrid 
} from 'lucide-react';

function ScoutProgramApp() {
  const { currentUser, logout } = useAuth();
  
  // Database Tab State: 'programs' (Jednotlivé programy) | 'yearly_plans' (Celoroční činnosti & plány)
  const [activeDatabaseTab, setActiveDatabaseTab] = useState<'programs' | 'yearly_plans'>('programs');

  // Programs & Favorites State
  const [programs, setPrograms] = useState<ScoutProgram[]>([]);
  const [userFavoriteIds, setUserFavoriteIds] = useState<string[]>([]);
  const [loadingPrograms, setLoadingPrograms] = useState(true);

  // Yearly Plans & Favorites State
  const [yearlyPlans, setYearlyPlans] = useState<YearlyPlan[]>([]);
  const [userPlanFavoriteIds, setUserPlanFavoriteIds] = useState<string[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);

  // Filters State
  const [filter, setFilter] = useState<FilterState>(INITIAL_FILTER_STATE);
  const [yearlyPlanFilter, setYearlyPlanFilter] = useState<YearlyPlanFilterState>(INITIAL_YEARLY_PLAN_FILTER);

  // Modals State - Programs
  const [selectedProgram, setSelectedProgram] = useState<ScoutProgram | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<ScoutProgram | null>(null);
  const [programToDelete, setProgramToDelete] = useState<ScoutProgram | null>(null);
  const [shareProgramModalTarget, setShareProgramModalTarget] = useState<ScoutProgram | null>(null);
  const [printingProgram, setPrintingProgram] = useState<ScoutProgram | null>(null);
  const [printingPlan, setPrintingPlan] = useState<YearlyPlan | null>(null);

  // Modals State - Yearly Plans
  const [selectedPlan, setSelectedPlan] = useState<YearlyPlan | null>(null);
  const [isPlanDetailOpen, setIsPlanDetailOpen] = useState(false);
  const [isCreatePlanOpen, setIsCreatePlanOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<YearlyPlan | null>(null);
  const [planToDelete, setPlanToDelete] = useState<YearlyPlan | null>(null);

  // Common Modals State
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isMethodInfoOpen, setIsMethodInfoOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  // Toast notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Realtime subscription to programs
  useEffect(() => {
    setLoadingPrograms(true);
    const unsubscribe = subscribeToPrograms(
      (loaded) => {
        setPrograms(loaded);
        setLoadingPrograms(false);
      },
      (err) => {
        console.error('Subscription error', err);
        setLoadingPrograms(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // Realtime subscription to yearly plans
  useEffect(() => {
    setLoadingPlans(true);
    const unsubscribe = subscribeToYearlyPlans((loaded) => {
      setYearlyPlans(loaded);
      setLoadingPlans(false);
    });
    return () => unsubscribe();
  }, []);

  // Handle Deep-linking via URL (?p=id or ?program=id or ?plan=id)
  useEffect(() => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const targetPlanId = searchParams.get('plan');
      const targetProgramId = searchParams.get('p') || searchParams.get('program');

      if (targetPlanId && yearlyPlans.length > 0) {
        const matchedPlan = yearlyPlans.find(p => p.id === targetPlanId);
        if (matchedPlan) {
          setActiveDatabaseTab('yearly_plans');
          setSelectedPlan(matchedPlan);
          setIsPlanDetailOpen(true);
          return;
        }
      }

      if (targetProgramId && programs.length > 0) {
        const matched = programs.find(p => p.id === targetProgramId);
        if (matched) {
          setActiveDatabaseTab('programs');
          setSelectedProgram(matched);
          setIsDetailOpen(true);
        }
      }
    } catch (e) {}
  }, [programs, yearlyPlans]);

  // Open & close program with URL synchronization
  const handleOpenProgram = (prog: ScoutProgram) => {
    setSelectedProgram(prog);
    setIsDetailOpen(true);
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('p', prog.id);
      window.history.replaceState(null, '', url.toString());
    } catch (e) {}
  };

  const handleCloseProgram = () => {
    setIsDetailOpen(false);
    setSelectedProgram(null);
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete('p');
      url.searchParams.delete('program');
      window.history.replaceState(null, '', url.pathname + (url.search ? url.search : ''));
    } catch (e) {}
  };

  // Open & close yearly plan with URL synchronization
  const handleOpenPlan = (plan: YearlyPlan) => {
    setSelectedPlan(plan);
    setIsPlanDetailOpen(true);
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('plan', plan.id);
      window.history.replaceState(null, '', url.toString());
    } catch (e) {}
  };

  const handleClosePlan = () => {
    setIsPlanDetailOpen(false);
    setSelectedPlan(null);
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete('plan');
      window.history.replaceState(null, '', url.pathname + (url.search ? url.search : ''));
    } catch (e) {}
  };

  // Handle Share action from card or modal
  const handleShareAction = async (prog: ScoutProgram) => {
    try {
      const res = await shareProgram(prog);
      if (res.success) {
        if (res.method === 'clipboard') {
          showToast('Odkaz na aktivitu byl zkopírován do schránky!');
        }
      } else {
        setShareProgramModalTarget(prog);
      }
    } catch (e) {
      setShareProgramModalTarget(prog);
    }
  };

  // Handle Share action for yearly plan
  const handleSharePlanAction = async (plan: YearlyPlan) => {
    try {
      const url = `${window.location.origin}${window.location.pathname}?plan=${plan.id}`;
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        showToast('Odkaz na celoroční plán byl zkopírován!');
      }
    } catch (e) {
      showToast('Odkaz nelze zkopírovat.');
    }
  };

  // Realtime subscription to user favorites (programs & plans)
  useEffect(() => {
    if (!currentUser) {
      setUserFavoriteIds([]);
      setUserPlanFavoriteIds([]);
      return;
    }
    const unsubFav = subscribeToUserFavorites(currentUser.uid, (favIds) => {
      setUserFavoriteIds(favIds);
    });
    const unsubPlanFav = subscribeToUserPlanFavorites(currentUser.uid, (planFavIds) => {
      setUserPlanFavoriteIds(planFavIds);
    });
    return () => {
      unsubFav();
      unsubPlanFav();
    };
  }, [currentUser]);

  // Enrich programs authored by currentUser
  const resolvedPrograms = useMemo(() => {
    return programs.map((p) => {
      if (currentUser && isProgramAuthor(currentUser, p)) {
        return {
          ...p,
          authorName: currentUser.displayName || p.authorName,
          authorUnit: currentUser.unitName || p.authorUnit || '',
          authorCenter: currentUser.centerName || p.authorCenter || ''
        };
      }
      return p;
    });
  }, [programs, currentUser]);

  // Enrich yearly plans authored by currentUser
  const resolvedYearlyPlans = useMemo(() => {
    return yearlyPlans.map((plan) => {
      if (currentUser && isProgramAuthor(currentUser, plan)) {
        return {
          ...plan,
          authorName: currentUser.displayName || plan.authorName,
          authorUnit: currentUser.unitName || plan.authorUnit || '',
          authorCenter: currentUser.centerName || plan.authorCenter || ''
        };
      }
      return plan;
    });
  }, [yearlyPlans, currentUser]);

  // Keep selected program and plan updated if resolved arrays change
  useEffect(() => {
    if (selectedProgram) {
      const updated = resolvedPrograms.find(p => p.id === selectedProgram.id);
      if (updated) setSelectedProgram(updated);
    }
  }, [resolvedPrograms]);

  useEffect(() => {
    if (selectedPlan) {
      const updated = resolvedYearlyPlans.find(p => p.id === selectedPlan.id);
      if (updated) setSelectedPlan(updated);
    }
  }, [resolvedYearlyPlans]);

  // Handle Favorite toggle - Program
  const handleToggleFavorite = async (programId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!currentUser) {
      setIsAuthOpen(true);
      return;
    }
    const isFav = userFavoriteIds.includes(programId);
    await toggleProgramFavorite(currentUser.uid, programId, isFav);
    showToast(isFav ? 'Odebráno z oblíbených' : 'Uloženo do oblíbených');
  };

  // Handle Favorite toggle - Yearly Plan
  const handleTogglePlanFavorite = async (planId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!currentUser) {
      setIsAuthOpen(true);
      return;
    }
    const isFav = userPlanFavoriteIds.includes(planId);
    await toggleYearlyPlanFavorite(currentUser.uid, planId, isFav);
    showToast(isFav ? 'Plán odebrán z oblíbených' : 'Plán uložen do oblíbených');
  };

  // Handle Save program (create or edit)
  const handleSaveProgram = async (programData: any) => {
    await saveProgram(programData);
    showToast(editingProgram ? 'Program byl úspěšně upraven' : 'Program byl úspěšně přidán do databáze!');
  };

  // Handle Save yearly plan (create or edit)
  const handleSaveYearlyPlan = async (planData: Partial<YearlyPlan>) => {
    await saveYearlyPlan(planData);
    showToast(editingPlan ? 'Celoroční plán byl úspěšně upraven' : 'Celoroční plán byl úspěšně přidán do databáze!');
  };

  // Handle Delete program
  const handleDeleteProgram = async (programId: string) => {
    try {
      await deleteProgram(programId);
      setPrograms(prev => prev.filter(p => p.id !== programId));
      if (selectedProgram?.id === programId) {
        setIsDetailOpen(false);
        setSelectedProgram(null);
      }
      showToast('Program byl úspěšně smazán z databáze.');
    } catch (err: any) {
      showToast('Chyba při mazání programu.');
    }
  };

  // Handle Delete yearly plan
  const handleDeleteYearlyPlan = async (planId: string) => {
    try {
      await deleteYearlyPlan(planId);
      setYearlyPlans(prev => prev.filter(p => p.id !== planId));
      if (selectedPlan?.id === planId) {
        setIsPlanDetailOpen(false);
        setSelectedPlan(null);
      }
      showToast('Celoroční plán byl úspěšně smazán z databáze.');
    } catch (err: any) {
      showToast('Chyba při mazání plánu.');
    }
  };

  // Available tags in yearly plans
  const availablePlanTags = useMemo(() => {
    const set = new Set<string>();
    resolvedYearlyPlans.forEach(p => {
      p.tags?.forEach(t => set.add(t));
    });
    return Array.from(set);
  }, [resolvedYearlyPlans]);

  // Filter & Sort Programs
  const filteredPrograms = useMemo(() => {
    return resolvedPrograms.filter((p) => {
      // 1. Text Search
      if (filter.searchQuery.trim()) {
        const query = filter.searchQuery.toLowerCase().trim();
        const inTitle = p.title.toLowerCase().includes(query);
        const inSummary = p.summary.toLowerCase().includes(query);
        const inDesc = p.description.toLowerCase().includes(query);
        const inGoals = (p.educationalGoals || '').toLowerCase().includes(query);
        const inMaterials = (p.materials || '').toLowerCase().includes(query);
        const inAuthor = p.authorName.toLowerCase().includes(query);
        const inTags = p.tags?.some(t => t.toLowerCase().includes(query));
        if (!inTitle && !inSummary && !inDesc && !inGoals && !inMaterials && !inAuthor && !inTags) {
          return false;
        }
      }

      // 2. Age categories
      if (filter.ageCategories.length > 0) {
        const hasMatchingAge = filter.ageCategories.some(cat => p.ageCategories.includes(cat));
        if (!hasMatchingAge) return false;
      }

      // 3. Scout Methods
      if (filter.scoutMethods.length > 0) {
        const hasMatchingMethod = filter.scoutMethods.some(m => p.scoutMethods.includes(m));
        if (!hasMatchingMethod) return false;
      }

      // 4. Duration
      if (p.durationMinutes > filter.maxDuration || p.durationMinutes < filter.minDuration) {
        return false;
      }

      // 5. Environment
      if (filter.environment !== 'all') {
        if (p.environment !== filter.environment && p.environment !== 'both') {
          return false;
        }
      }

      // 6. Weather
      if (filter.weather.length > 0) {
        const hasWeather = filter.weather.some(w => p.weather?.includes(w));
        if (!hasWeather) return false;
      }

      // 7. Event Types (skautská schůzka, víkendová výprava, tábor, vzdělávací akce)
      if (filter.eventTypes && filter.eventTypes.length > 0) {
        const pEvents = p.eventTypes && p.eventTypes.length > 0 ? p.eventTypes : ['schuzka'];
        const matchesEvent = filter.eventTypes.some(et => pEvents.includes(et));
        if (!matchesEvent) return false;
      }

      // 8. Tags
      if (filter.selectedTags.length > 0) {
        const hasAllTags = filter.selectedTags.every(t => p.tags?.includes(t));
        if (!hasAllTags) return false;
      }

      // 9. 1-10 Scales
      if (p.physicalDemand < filter.minPhysical) return false;
      if (p.intellectualDemand < filter.minIntellectual) return false;
      if (p.creativity < filter.minCreativity) return false;
      if (p.teamwork < filter.minTeamwork) return false;
      if (p.preparationDemand > filter.maxPreparation) return false;

      // 10. Only Favorites
      if (filter.onlyFavorites) {
        if (!userFavoriteIds.includes(p.id)) return false;
      }

      // 11. Only My Programs
      if (filter.onlyMyPrograms && currentUser) {
        if (!isProgramAuthor(currentUser, p)) return false;
      }

      return true;
    }).sort((a, b) => {
      let cmp = 0;
      if (filter.sortBy === 'newest') {
        cmp = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (filter.sortBy === 'rating') {
        cmp = (b.ratingAverage || 0) - (a.ratingAverage || 0);
      } else if (filter.sortBy === 'popularity') {
        cmp = (b.favoriteCount || 0) - (a.favoriteCount || 0);
      } else if (filter.sortBy === 'duration_asc') {
        cmp = a.durationMinutes - b.durationMinutes;
      } else if (filter.sortBy === 'duration_desc') {
        cmp = b.durationMinutes - a.durationMinutes;
      }
      if (cmp !== 0) return cmp;
      return a.id.localeCompare(b.id);
    });
  }, [resolvedPrograms, filter, userFavoriteIds, currentUser]);

  // Filter & Sort Yearly Plans
  const filteredYearlyPlans = useMemo(() => {
    return resolvedYearlyPlans.filter((plan) => {
      // 1. Text Search
      if (yearlyPlanFilter.searchQuery.trim()) {
        const query = yearlyPlanFilter.searchQuery.toLowerCase().trim();
        const inTitle = plan.title.toLowerCase().includes(query);
        const inMotto = (plan.motto || '').toLowerCase().includes(query);
        const inSummary = plan.summary.toLowerCase().includes(query);
        const inGoals = (plan.educationalGoals || '').toLowerCase().includes(query);
        const inVision = (plan.vision || '').toLowerCase().includes(query);
        const inAuthor = plan.authorName.toLowerCase().includes(query);
        const inTags = plan.tags?.some(t => t.toLowerCase().includes(query));
        const inMeans = plan.means?.some(m => m.toLowerCase().includes(query));
        if (!inTitle && !inMotto && !inSummary && !inGoals && !inVision && !inAuthor && !inTags && !inMeans) {
          return false;
        }
      }

      // 2. Age categories
      if (yearlyPlanFilter.ageCategories.length > 0) {
        const hasMatchingAge = yearlyPlanFilter.ageCategories.some(cat => plan.ageCategories?.includes(cat));
        if (!hasMatchingAge) return false;
      }

      // 3. Scout Methods
      if (yearlyPlanFilter.scoutMethods.length > 0) {
        const hasMatchingMethod = yearlyPlanFilter.scoutMethods.some(m => plan.scoutMethods?.includes(m));
        if (!hasMatchingMethod) return false;
      }

      // 4. Tags
      if (yearlyPlanFilter.selectedTags.length > 0) {
        const hasAllTags = yearlyPlanFilter.selectedTags.every(t => plan.tags?.includes(t));
        if (!hasAllTags) return false;
      }

      // 5. Duration (měsíc až 2 roky: 1..24)
      if (plan.durationMonths < yearlyPlanFilter.minDurationMonths || plan.durationMonths > yearlyPlanFilter.maxDurationMonths) {
        return false;
      }

      // 6. 1-10 Personal Development Scales (duchovní, fyzická, emoční, duševní, znalostní)
      if ((plan.spiritual || 5) < yearlyPlanFilter.minSpiritual) return false;
      if ((plan.physical || 5) < yearlyPlanFilter.minPhysical) return false;
      if ((plan.emotional || 5) < yearlyPlanFilter.minEmotional) return false;
      if ((plan.mental || 5) < yearlyPlanFilter.minMental) return false;
      if ((plan.knowledge || 5) < yearlyPlanFilter.minKnowledge) return false;

      // 7. Only Favorites
      if (yearlyPlanFilter.onlyFavorites) {
        if (!userPlanFavoriteIds.includes(plan.id)) return false;
      }

      // 8. Only My Plans
      if (yearlyPlanFilter.onlyMyPlans && currentUser) {
        if (!isProgramAuthor(currentUser, plan)) return false;
      }

      return true;
    }).sort((a, b) => {
      let cmp = 0;
      if (yearlyPlanFilter.sortBy === 'newest') {
        cmp = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (yearlyPlanFilter.sortBy === 'rating') {
        cmp = (b.ratingAverage || 0) - (a.ratingAverage || 0);
      } else if (yearlyPlanFilter.sortBy === 'duration_asc') {
        cmp = a.durationMonths - b.durationMonths;
      } else if (yearlyPlanFilter.sortBy === 'duration_desc') {
        cmp = b.durationMonths - a.durationMonths;
      }
      if (cmp !== 0) return cmp;
      return a.id.localeCompare(b.id);
    });
  }, [resolvedYearlyPlans, yearlyPlanFilter, userPlanFavoriteIds, currentUser]);

  const isLoading = activeDatabaseTab === 'programs' ? loadingPrograms : loadingPlans;

  return (
    <div className="min-h-screen bg-stone-100/60 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col font-sans transition-colors">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-stone-100 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-semibold border border-stone-700 animate-slideUp">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Scout Header */}
      <Header
        activeDatabaseTab={activeDatabaseTab}
        onOpenCreate={() => {
          if (!currentUser) {
            setIsAuthOpen(true);
          } else {
            setEditingProgram(null);
            setIsCreateOpen(true);
          }
        }}
        onOpenCreatePlan={() => {
          if (!currentUser) {
            setIsAuthOpen(true);
          } else {
            setEditingPlan(null);
            setIsCreatePlanOpen(true);
          }
        }}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenMethodInfo={() => setIsMethodInfoOpen(true)}
        favoritesCount={activeDatabaseTab === 'programs' ? userFavoriteIds.length : userPlanFavoriteIds.length}
        showOnlyFavorites={activeDatabaseTab === 'programs' ? filter.onlyFavorites : yearlyPlanFilter.onlyFavorites}
        onToggleFavorites={() => {
          if (activeDatabaseTab === 'programs') {
            setFilter({ ...filter, onlyFavorites: !filter.onlyFavorites });
          } else {
            setYearlyPlanFilter({ ...yearlyPlanFilter, onlyFavorites: !yearlyPlanFilter.onlyFavorites });
          }
        }}
        totalProgramsCount={programs.length}
        totalPlansCount={yearlyPlans.length}
      />

      {/* Hero Banner / Introductory scout quote */}
      <section className="bg-gradient-to-b from-stone-900 to-stone-800 text-stone-100 py-5 sm:py-6 px-4 sm:px-6 lg:px-8 border-b border-stone-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1.5 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-900/60 text-emerald-300 border border-emerald-700/60">
              <Compass className="w-3.5 h-3.5" />
              <span>Ověřené programy & celoroční činnosti pro rádce a vedoucí</span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              Skautská banka aktivit & celoročních plánů
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
              Sdílejte jednotlivé programy na schůzky i komplexní celoroční činnosti s vizí, výchovnými cíli a časovou osou po měsících.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 py-4 sm:py-6 flex-1 pb-24 md:pb-8 space-y-4 sm:space-y-5">
        
        {/* TWO PRIMARY DATABASE TABS: Programy vs. Celoroční činnosti */}
        <div className="bg-white dark:bg-stone-900 p-1.5 rounded-2xl border border-stone-200 dark:border-stone-800 flex items-center gap-1 shadow-xs">
          <button
            type="button"
            onClick={() => setActiveDatabaseTab('programs')}
            className={`flex-1 py-3 px-3 sm:px-5 rounded-xl font-extrabold text-xs sm:text-sm transition flex items-center justify-center gap-2 ${
              activeDatabaseTab === 'programs'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Databáze programů</span>
            <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
              activeDatabaseTab === 'programs'
                ? 'bg-emerald-700 text-white'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
            }`}>
              {programs.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveDatabaseTab('yearly_plans')}
            className={`flex-1 py-3 px-3 sm:px-5 rounded-xl font-extrabold text-xs sm:text-sm transition flex items-center justify-center gap-2 ${
              activeDatabaseTab === 'yearly_plans'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Celoroční činnosti & plány</span>
            <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
              activeDatabaseTab === 'yearly_plans'
                ? 'bg-emerald-700 text-white'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
            }`}>
              {yearlyPlans.length}
            </span>
          </button>
        </div>

        {/* TAB 1: Databáze jednotlivých programů */}
        {activeDatabaseTab === 'programs' && (
          <div className="space-y-4">
            {/* Filter Bar Component */}
            <FilterBar
              filter={filter}
              onChange={setFilter}
              onReset={() => setFilter(INITIAL_FILTER_STATE)}
              totalFilteredCount={filteredPrograms.length}
            />

            {/* Loading State */}
            {loadingPrograms && (
              <div className="py-20 text-center space-y-3">
                <RefreshCw className="w-8 h-8 animate-spin text-emerald-600 mx-auto" />
                <p className="text-sm text-stone-500">Načítám skautskou databázi programů...</p>
              </div>
            )}

            {/* Empty Database State */}
            {!loadingPrograms && programs.length === 0 && (
              <div className="py-20 px-6 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl text-center max-w-xl mx-auto shadow-sm space-y-5">
                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/80 rounded-3xl flex items-center justify-center mx-auto text-emerald-700 dark:text-emerald-300">
                  <Compass className="w-8 h-8" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100">
                    Databáze programů je připravena
                  </h3>
                  <p className="text-sm text-stone-600 dark:text-stone-300 max-w-md mx-auto leading-relaxed">
                    Vložte první skautský program pro schůzky, výpravy či tábory.
                  </p>
                </div>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (!currentUser) setIsAuthOpen(true);
                      else {
                        setEditingProgram(null);
                        setIsCreateOpen(true);
                      }
                    }}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl transition shadow-md"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Přidat první skautský program</span>
                  </button>
                </div>
              </div>
            )}

            {/* Empty Filter Results State */}
            {!loadingPrograms && programs.length > 0 && filteredPrograms.length === 0 && (
              <div className="py-16 px-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl text-center max-w-lg mx-auto shadow-sm space-y-4">
                <div className="w-14 h-14 bg-stone-100 dark:bg-stone-800 rounded-2xl flex items-center justify-center mx-auto text-stone-400">
                  <SearchX className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                    Žádný program neodpovídá zvoleným filtrům
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 max-w-sm mx-auto">
                    Zkuste uvolnit kritéria vyhledávání, snížit minimální náročnost nebo vymazat filtry.
                  </p>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setFilter(INITIAL_FILTER_STATE)}
                    className="px-4 py-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-semibold rounded-xl transition"
                  >
                    Vymazat všechny filtry
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!currentUser) setIsAuthOpen(true);
                      else {
                        setEditingProgram(null);
                        setIsCreateOpen(true);
                      }
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl transition shadow"
                  >
                    Vložit tento typ programu
                  </button>
                </div>
              </div>
            )}

            {/* Programs Grid */}
            {!loadingPrograms && filteredPrograms.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredPrograms.map((prog) => (
                  <ProgramCard
                    key={prog.id}
                    program={prog}
                    isFavorite={userFavoriteIds.includes(prog.id)}
                    isAuthorOrAdmin={isUserAuthorOrAdmin(currentUser, prog)}
                    isOwner={isProgramAuthor(currentUser, prog)}
                    onToggleFavorite={(e) => handleToggleFavorite(prog.id, e)}
                    onShare={(e) => {
                      e.stopPropagation();
                      handleShareAction(prog);
                    }}
                    onRequestDelete={(e) => {
                      e.stopPropagation();
                      setProgramToDelete(prog);
                    }}
                    onPrint={(e) => {
                      e.stopPropagation();
                      setPrintingProgram(prog);
                    }}
                    onClick={() => handleOpenProgram(prog)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Databáze celoročních činností & plánů */}
        {activeDatabaseTab === 'yearly_plans' && (
          <div className="space-y-4">
            {/* Filter Bar for Yearly Plans */}
            <YearlyPlanFilterBar
              filter={yearlyPlanFilter}
              onChange={setYearlyPlanFilter}
              availableTags={availablePlanTags}
              totalPlansCount={yearlyPlans.length}
              filteredPlansCount={filteredYearlyPlans.length}
              isLoggedIn={!!currentUser}
            />

            {/* Loading State */}
            {loadingPlans && (
              <div className="py-20 text-center space-y-3">
                <RefreshCw className="w-8 h-8 animate-spin text-emerald-600 mx-auto" />
                <p className="text-sm text-stone-500">Načítám celoroční plány & činnosti...</p>
              </div>
            )}

            {/* Empty Plans Database State */}
            {!loadingPlans && yearlyPlans.length === 0 && (
              <div className="py-20 px-6 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl text-center max-w-xl mx-auto shadow-sm space-y-5">
                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/80 rounded-3xl flex items-center justify-center mx-auto text-emerald-700 dark:text-emerald-300">
                  <Calendar className="w-8 h-8" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100">
                    Zatím nebyl přidán žádný celoroční plán
                  </h3>
                  <p className="text-sm text-stone-600 dark:text-stone-300 max-w-md mx-auto leading-relaxed">
                    Vytvořte a sdílejte svůj celoroční plán s vizí, cíli, 5 stránkami skautského rozvoje a časovou osou po měsících.
                  </p>
                </div>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (!currentUser) setIsAuthOpen(true);
                      else {
                        setEditingPlan(null);
                        setIsCreatePlanOpen(true);
                      }
                    }}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl transition shadow-md"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Přidat první celoroční plán</span>
                  </button>
                </div>
              </div>
            )}

            {/* Empty Filter Results State */}
            {!loadingPlans && yearlyPlans.length > 0 && filteredYearlyPlans.length === 0 && (
              <div className="py-16 px-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl text-center max-w-lg mx-auto shadow-sm space-y-4">
                <div className="w-14 h-14 bg-stone-100 dark:bg-stone-800 rounded-2xl flex items-center justify-center mx-auto text-stone-400">
                  <SearchX className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                    Žádný celoroční plán neodpovídá zvoleným filtrům
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 max-w-sm mx-auto">
                    Zkuste rozšířit časové rozmezí (1 měsíc až 2 roky), snížit minimální hodnocení stránek rozvoje nebo zrušit filtry.
                  </p>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setYearlyPlanFilter(INITIAL_YEARLY_PLAN_FILTER)}
                    className="px-4 py-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-semibold rounded-xl transition"
                  >
                    Resetovat filtry plánů
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!currentUser) setIsAuthOpen(true);
                      else {
                        setEditingPlan(null);
                        setIsCreatePlanOpen(true);
                      }
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl transition shadow"
                  >
                    Vytvořit celoroční plán
                  </button>
                </div>
              </div>
            )}

            {/* Yearly Plans Grid */}
            {!loadingPlans && filteredYearlyPlans.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredYearlyPlans.map((plan) => (
                  <YearlyPlanCard
                    key={plan.id}
                    plan={plan}
                    isFavorite={userPlanFavoriteIds.includes(plan.id)}
                    isAuthorOrAdmin={isUserAuthorOrAdmin(currentUser, plan)}
                    isOwner={isProgramAuthor(currentUser, plan)}
                    onToggleFavorite={(e) => handleTogglePlanFavorite(plan.id, e)}
                    onShare={(e) => {
                      e.stopPropagation();
                      handleSharePlanAction(plan);
                    }}
                    onRequestDelete={(e) => {
                      e.stopPropagation();
                      setPlanToDelete(plan);
                    }}
                    onPrint={(e) => {
                      e.stopPropagation();
                      setPrintingPlan(plan);
                    }}
                    onClick={() => handleOpenPlan(plan)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="mt-auto bg-stone-900 text-stone-400 text-xs py-8 border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ScoutLilieLogo className="w-8 h-8" />
            <div>
              <p className="font-semibold text-stone-200">Skautská Programovna & Celoroční činnosti</p>
              <p className="text-[11px] text-stone-500">Podpora skautského výchovného programu, metodiky a sdílení dobré praxe</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <button onClick={() => setIsMethodInfoOpen(true)} className="hover:text-stone-200 transition">
              8 prvků skautské metody
            </button>
            <span>•</span>
            <span>Benjamínci (4–6)</span>
            <span>•</span>
            <span>Vlčata & světlušky (6–10)</span>
            <span>•</span>
            <span>Skauti & skautky (11–15)</span>
            <span>•</span>
            <span>Roveři & rangers (15–24)</span>
            <span>•</span>
            <span>Oldskauti (25+)</span>
          </div>
        </div>
      </footer>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-stone-900/95 backdrop-blur-md border-t border-stone-800 text-stone-400 flex items-center justify-around px-2 py-1 shadow-2xl">
        <button
          onClick={() => setActiveDatabaseTab('programs')}
          className={`flex flex-col items-center gap-0.5 text-[10px] transition touch-manipulation py-1 px-2 ${
            activeDatabaseTab === 'programs' ? 'text-emerald-400 font-bold' : 'hover:text-stone-200'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span>Programy</span>
        </button>

        <button
          onClick={() => setActiveDatabaseTab('yearly_plans')}
          className={`flex flex-col items-center gap-0.5 text-[10px] transition touch-manipulation py-1 px-2 ${
            activeDatabaseTab === 'yearly_plans' ? 'text-emerald-400 font-bold' : 'hover:text-stone-200'
          }`}
        >
          <Calendar className="w-5 h-5" />
          <span>Celoroční</span>
        </button>

        {/* Central Add Floating Button */}
        <button
          onClick={() => {
            if (!currentUser) setIsAuthOpen(true);
            else {
              if (activeDatabaseTab === 'programs') {
                setEditingProgram(null);
                setIsCreateOpen(true);
              } else {
                setEditingPlan(null);
                setIsCreatePlanOpen(true);
              }
            }
          }}
          className="flex flex-col items-center justify-center -mt-5 w-12 h-12 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg border-2 border-stone-900 active:scale-95 transition touch-manipulation"
          title={activeDatabaseTab === 'programs' ? 'Přidat nový skautský program' : 'Přidat nový celoroční plán'}
        >
          <Plus className="w-6 h-6" />
        </button>

        <button
          onClick={() => {
            if (activeDatabaseTab === 'programs') {
              setFilter({ ...filter, onlyFavorites: !filter.onlyFavorites });
            } else {
              setYearlyPlanFilter({ ...yearlyPlanFilter, onlyFavorites: !yearlyPlanFilter.onlyFavorites });
            }
          }}
          className={`flex flex-col items-center gap-0.5 text-[10px] relative transition touch-manipulation py-1 px-2 ${
            (activeDatabaseTab === 'programs' ? filter.onlyFavorites : yearlyPlanFilter.onlyFavorites)
              ? 'text-rose-400 font-bold'
              : 'hover:text-stone-200'
          }`}
        >
          <Heart className={`w-5 h-5 ${(activeDatabaseTab === 'programs' ? filter.onlyFavorites : yearlyPlanFilter.onlyFavorites) ? 'fill-rose-400 text-rose-400' : ''}`} />
          <span>Oblíbené</span>
        </button>

        <button
          onClick={() => {
            if (currentUser) setIsProfileOpen(true);
            else setIsAuthOpen(true);
          }}
          className={`flex flex-col items-center gap-0.5 text-[10px] transition touch-manipulation py-1 px-2 ${
            currentUser ? 'text-emerald-400 font-medium' : 'hover:text-stone-200'
          }`}
        >
          <User className="w-5 h-5 text-sky-400" />
          <span>{currentUser ? 'Profil' : 'Přihlásit'}</span>
        </button>
      </nav>

      {/* MODALS */}
      
      {/* 1. Program Detail Modal */}
      <ProgramDetailModal
        program={selectedProgram}
        isOpen={isDetailOpen}
        onClose={handleCloseProgram}
        isFavorite={selectedProgram ? userFavoriteIds.includes(selectedProgram.id) : false}
        onToggleFavorite={() => {
          if (selectedProgram) handleToggleFavorite(selectedProgram.id);
        }}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenEdit={(prog) => {
          handleCloseProgram();
          setEditingProgram(prog);
          setIsCreateOpen(true);
        }}
        onRequestDelete={(prog) => setProgramToDelete(prog)}
        onPrint={(prog) => setPrintingProgram(prog)}
        onToast={showToast}
        onOpenShareModal={(prog) => setShareProgramModalTarget(prog)}
      />

      {/* 2. Program Form (Create / Edit) Modal */}
      <ProgramFormModal
        isOpen={isCreateOpen}
        onClose={() => {
          setIsCreateOpen(false);
          setEditingProgram(null);
        }}
        onSave={handleSaveProgram}
        editingProgram={editingProgram}
      />

      {/* 3. Yearly Plan Detail Modal */}
      <YearlyPlanDetailModal
        plan={selectedPlan}
        isOpen={isPlanDetailOpen}
        onClose={handleClosePlan}
        isFavorite={selectedPlan ? userPlanFavoriteIds.includes(selectedPlan.id) : false}
        onToggleFavorite={() => {
          if (selectedPlan) handleTogglePlanFavorite(selectedPlan.id);
        }}
        isAuthorOrAdmin={selectedPlan ? isUserAuthorOrAdmin(currentUser, selectedPlan) : false}
        onOpenEdit={(plan) => {
          handleClosePlan();
          setEditingPlan(plan);
          setIsCreatePlanOpen(true);
        }}
        onRequestDelete={(plan) => setPlanToDelete(plan)}
        onOpenProgram={(prog) => {
          handleOpenProgram(prog);
        }}
        onPrint={(plan) => setPrintingPlan(plan)}
        allPrograms={resolvedPrograms}
        onToast={showToast}
      />

      {/* 4. Yearly Plan Form (Create / Edit) Modal */}
      <YearlyPlanFormModal
        isOpen={isCreatePlanOpen}
        onClose={() => {
          setIsCreatePlanOpen(false);
          setEditingPlan(null);
        }}
        onSave={handleSaveYearlyPlan}
        editingPlan={editingPlan}
        allPrograms={resolvedPrograms}
      />

      {/* 5. Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      {/* 6. Scout Method Info Modal */}
      <ScoutMethodInfoModal
        isOpen={isMethodInfoOpen}
        onClose={() => setIsMethodInfoOpen(false)}
      />

      {/* 7. Print Program & Plan Card Modal (A4) */}
      {(printingProgram || printingPlan) && (
        <PrintCard
          program={printingProgram}
          plan={printingPlan}
          allPrograms={resolvedPrograms}
          onClose={() => {
            setPrintingProgram(null);
            setPrintingPlan(null);
          }}
        />
      )}

      {/* 8. Profile & My Programs Management Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        currentUser={currentUser}
        programs={resolvedPrograms}
        yearlyPlans={resolvedYearlyPlans}
        favoriteIds={userFavoriteIds}
        onOpenProgram={(prog) => {
          handleOpenProgram(prog);
        }}
        onEditProgram={(prog) => {
          setEditingProgram(prog);
          setIsCreateOpen(true);
        }}
        onRequestDelete={(prog) => setProgramToDelete(prog)}
        onOpenPlan={(plan) => {
          handleOpenPlan(plan);
        }}
        onEditPlan={(plan) => {
          setEditingPlan(plan);
          setIsCreatePlanOpen(true);
        }}
        onRequestDeletePlan={(plan) => setPlanToDelete(plan)}
        onOpenCreate={() => {
          setEditingProgram(null);
          setIsCreateOpen(true);
        }}
        onOpenCreatePlan={() => {
          setEditingPlan(null);
          setIsCreatePlanOpen(true);
        }}
        onLogout={logout}
      />

      {/* 9. Confirm Delete Modal - Program */}
      <ConfirmDeleteModal
        isOpen={!!programToDelete}
        program={programToDelete}
        itemTypeLabel="program"
        onClose={() => setProgramToDelete(null)}
        onConfirm={handleDeleteProgram}
      />

      {/* 10. Confirm Delete Modal - Yearly Plan */}
      <ConfirmDeleteModal
        isOpen={!!planToDelete}
        program={planToDelete}
        itemTypeLabel="celoroční plán"
        onClose={() => setPlanToDelete(null)}
        onConfirm={handleDeleteYearlyPlan}
      />

      {/* 11. Share Program Modal */}
      <ShareModal
        isOpen={!!shareProgramModalTarget}
        program={shareProgramModalTarget}
        onClose={() => setShareProgramModalTarget(null)}
        onToast={showToast}
      />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ScoutProgramApp />
    </AuthProvider>
  );
}
