import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Plus, 
  Heart, 
  BookOpen, 
  LogIn, 
  LogOut, 
  User, 
  Sparkles,
  Compass,
  FileText
} from 'lucide-react';

import { JunakOfficialLogo } from './JunakLogo';

interface HeaderProps {
  onOpenCreate: () => void;
  onOpenCreatePlan?: () => void;
  activeDatabaseTab?: 'programs' | 'yearly_plans';
  onOpenAuth: () => void;
  onOpenProfile: () => void;
  onOpenMethodInfo: () => void;
  favoritesCount: number;
  showOnlyFavorites: boolean;
  onToggleFavorites: () => void;
  totalProgramsCount: number;
  totalPlansCount?: number;
}

export const ScoutLilieLogo: React.FC<{ className?: string; withBadge?: boolean }> = ({ 
  className = 'w-10 h-10'
}) => {
  return <JunakOfficialLogo className={className} />;
};

export const Header: React.FC<HeaderProps> = ({
  onOpenCreate,
  onOpenCreatePlan,
  activeDatabaseTab = 'programs',
  onOpenAuth,
  onOpenProfile,
  onOpenMethodInfo,
  favoritesCount,
  showOnlyFavorites,
  onToggleFavorites,
  totalProgramsCount,
  totalPlansCount = 0
}) => {
  const { currentUser, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-stone-900/95 backdrop-blur-md text-stone-100 border-b border-stone-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2">
          
          {/* Logo & title */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="relative group cursor-pointer shrink-0" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <ScoutLilieLogo className="w-9 h-9 sm:w-12 sm:h-12 drop-shadow-md" />
              <div className="absolute -bottom-1 -right-1 bg-amber-500 text-stone-950 text-[9px] sm:text-[10px] font-bold px-1 rounded-xs uppercase tracking-wider">
                Junák
              </div>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h1 className="text-base sm:text-xl md:text-2xl font-bold tracking-tight text-white truncate">
                  <span>Skautská Programovna</span>
                </h1>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-900/80 text-emerald-300 border border-emerald-700/60 shrink-0">
                  {activeDatabaseTab === 'yearly_plans' 
                    ? `${totalPlansCount} ${totalPlansCount === 1 ? 'plán' : totalPlansCount < 5 ? 'plány' : 'plánů'}` 
                    : `${totalProgramsCount} ${totalProgramsCount === 1 ? 'program' : totalProgramsCount < 5 ? 'programy' : 'programů'}`}
                </span>
              </div>
              <p className="text-xs text-stone-400 hidden lg:block truncate">
                Sdílená banka výchovných aktivit, her a metodik pro oddíly a družiny
              </p>
            </div>
          </div>

          {/* Right action controls */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Guide to scout method */}
            <button
              onClick={onOpenMethodInfo}
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-stone-300 hover:text-white bg-stone-800/80 hover:bg-stone-700 rounded-lg border border-stone-700 transition"
              title="8 prvků skautské výchovné metody"
            >
              <Compass className="w-4 h-4 text-emerald-400" />
              <span>Skautská metoda</span>
            </button>

            {/* Favorites filter button */}
            <button
              onClick={onToggleFavorites}
              className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg border transition touch-manipulation active:scale-95 ${
                showOnlyFavorites
                  ? 'bg-rose-900/70 text-rose-200 border-rose-600 shadow-sm'
                  : 'bg-stone-800/80 text-stone-300 border-stone-700 hover:bg-stone-700'
              }`}
              title="Zobrazit jen uložené oblíbené programy"
            >
              <Heart className={`w-4 h-4 ${showOnlyFavorites ? 'fill-rose-400 text-rose-400' : 'text-stone-400'}`} />
              <span className="hidden md:inline">Oblíbené</span>
              {favoritesCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] sm:text-[11px] font-bold bg-rose-600 text-white">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* Add button (program or yearly plan) */}
            <button
              onClick={activeDatabaseTab === 'yearly_plans' ? (onOpenCreatePlan || onOpenCreate) : onOpenCreate}
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-md hover:shadow-emerald-900/40 transition active:scale-95 touch-manipulation"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden xs:inline sm:inline">
                {activeDatabaseTab === 'yearly_plans' ? 'Přidat celoroční plán' : 'Přidat program'}
              </span>
              <span className="xs:hidden sm:hidden">Přidat</span>
            </button>

            {/* Auth / User profile */}
            {currentUser ? (
              <div className="flex items-center gap-1 sm:gap-1.5 pl-1 sm:pl-2 border-l border-stone-700">
                <button
                  onClick={onOpenProfile}
                  className="flex items-center gap-1.5 sm:gap-2 p-1 sm:px-2.5 sm:py-1.5 rounded-xl bg-stone-800 hover:bg-stone-750 text-left border border-stone-700 hover:border-emerald-500/50 transition group touch-manipulation"
                  title="Otevřít profil a správu mých programů"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    {currentUser.displayName ? currentUser.displayName[0].toUpperCase() : 'S'}
                  </div>
                  <div className="text-left hidden md:block">
                    <p className="text-xs font-semibold text-stone-200 group-hover:text-emerald-300 transition truncate max-w-[180px]">
                      {currentUser.displayName || 'Bratr / Sestra'}
                    </p>
                    <p className="text-[10px] text-stone-400 truncate max-w-[180px]" title={[currentUser.unitName, currentUser.centerName].filter(Boolean).join(' • ')}>
                      {currentUser.unitName && currentUser.centerName
                        ? `${currentUser.unitName} • ${currentUser.centerName}`
                        : currentUser.unitName || currentUser.centerName || 'Můj profil & programy'}
                    </p>
                  </div>
                </button>
                <button
                  onClick={logout}
                  className="p-1.5 sm:p-2 text-stone-400 hover:text-white bg-stone-800 hover:bg-stone-700 rounded-lg border border-stone-700 transition touch-manipulation"
                  title="Odhlásit se"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-lg bg-amber-600 hover:bg-amber-500 text-stone-950 shadow transition touch-manipulation active:scale-95"
              >
                <LogIn className="w-4 h-4" />
                <span>Přihlásit</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
