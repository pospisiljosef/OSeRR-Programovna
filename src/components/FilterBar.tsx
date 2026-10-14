import React, { useState } from 'react';
import { 
  FilterState, 
  AgeCategoryId, 
  ScoutMethodElementId, 
  WeatherType, 
  EnvironmentType,
  ScoutEventType 
} from '../types/scout';
import { 
  AGE_CATEGORIES, 
  SCOUT_METHOD_ELEMENTS, 
  WEATHER_OPTIONS, 
  POPULAR_TAGS, 
  SCOUT_EVENT_TYPES,
  formatDuration 
} from '../data/constants';
import { 
  Search, 
  SlidersHorizontal, 
  X, 
  Clock, 
  Sun, 
  CloudRain, 
  Snowflake, 
  Flame, 
  Trees, 
  Home, 
  RefreshCw,
  Compass,
  Activity,
  Brain,
  Palette,
  Users,
  Tent,
  GraduationCap
} from 'lucide-react';

interface FilterBarProps {
  filter: FilterState;
  onChange: (newFilter: FilterState) => void;
  onReset: () => void;
  totalFilteredCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filter,
  onChange,
  onReset,
  totalFilteredCount
}) => {
  const [expanded, setExpanded] = useState(false);

  // Helper toggle functions
  const toggleAgeCategory = (id: AgeCategoryId) => {
    const next = filter.ageCategories.includes(id)
      ? filter.ageCategories.filter(c => c !== id)
      : [...filter.ageCategories, id];
    onChange({ ...filter, ageCategories: next });
  };

  const toggleEventType = (id: ScoutEventType) => {
    const next = filter.eventTypes.includes(id)
      ? filter.eventTypes.filter(e => e !== id)
      : [...filter.eventTypes, id];
    onChange({ ...filter, eventTypes: next });
  };

  const toggleScoutMethod = (id: ScoutMethodElementId) => {
    const next = filter.scoutMethods.includes(id)
      ? filter.scoutMethods.filter(m => m !== id)
      : [...filter.scoutMethods, id];
    onChange({ ...filter, scoutMethods: next });
  };

  const toggleWeather = (id: WeatherType) => {
    const next = filter.weather.includes(id)
      ? filter.weather.filter(w => w !== id)
      : [...filter.weather, id];
    onChange({ ...filter, weather: next });
  };

  const toggleTag = (tag: string) => {
    const next = filter.selectedTags.includes(tag)
      ? filter.selectedTags.filter(t => t !== tag)
      : [...filter.selectedTags, tag];
    onChange({ ...filter, selectedTags: next });
  };

  const hasActiveFilters = 
    filter.searchQuery.trim() !== '' ||
    filter.eventTypes.length > 0 ||
    filter.ageCategories.length > 0 ||
    filter.scoutMethods.length > 0 ||
    filter.weather.length > 0 ||
    filter.selectedTags.length > 0 ||
    filter.environment !== 'all' ||
    filter.maxDuration < 240 ||
    filter.minDuration > 15 ||
    filter.minPhysical > 1 ||
    filter.minIntellectual > 1 ||
    filter.minCreativity > 1 ||
    filter.minTeamwork > 1 ||
    filter.maxPreparation < 10 ||
    filter.onlyFavorites ||
    filter.onlyMyPrograms;

  const activeFiltersCount = 
    (filter.searchQuery.trim() ? 1 : 0) +
    filter.eventTypes.length +
    filter.ageCategories.length +
    filter.scoutMethods.length +
    filter.weather.length +
    filter.selectedTags.length +
    (filter.environment !== 'all' ? 1 : 0) +
    (filter.maxDuration < 240 ? 1 : 0) +
    (filter.onlyFavorites ? 1 : 0) +
    (filter.onlyMyPrograms ? 1 : 0);

  const weatherIcons: Record<WeatherType, React.ReactNode> = {
    sunny: <Sun className="w-3.5 h-3.5 text-amber-500" />,
    rain: <CloudRain className="w-3.5 h-3.5 text-blue-500" />,
    snow: <Snowflake className="w-3.5 h-3.5 text-sky-400" />,
    heat: <Flame className="w-3.5 h-3.5 text-orange-500" />,
  };

  return (
    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-sm mb-6 transition">
      
      {/* Top Search & Primary Filter Row */}
      <div className="p-3.5 sm:p-5 space-y-3.5 sm:space-y-4">
        
        {/* Search input and sort */}
        <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 items-stretch sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={filter.searchQuery}
              onChange={(e) => onChange({ ...filter, searchQuery: e.target.value })}
              placeholder="Hledat (např. šifry, oheň, buzola, noční hra)..."
              className="w-full pl-10 pr-10 py-2.5 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 rounded-xl border border-stone-200 dark:border-stone-700 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
            />
            {filter.searchQuery && (
              <button
                onClick={() => onChange({ ...filter, searchQuery: '' })}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Sort Dropdown */}
            <select
              value={filter.sortBy}
              onChange={(e) => onChange({ ...filter, sortBy: e.target.value as any })}
              className="flex-1 sm:flex-initial px-3 py-2.5 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-200 rounded-xl border border-stone-200 dark:border-stone-700 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="newest">Nejnovější programy</option>
              <option value="rating">Nejlépe hodnocené ★</option>
              <option value="popularity">Nejoblíbenější</option>
              <option value="duration_asc">Nejkratší čas</option>
              <option value="duration_desc">Nejdelší čas</option>
            </select>

            {/* Toggle Detailed Filters */}
            <button
              onClick={() => setExpanded(!expanded)}
              className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border transition active:scale-95 touch-manipulation ${
                expanded || hasActiveFilters
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                  : 'bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-stone-100'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline">{expanded ? 'Skrýt filtry' : 'Podrobné filtry'}</span>
              <span className="sm:hidden">Filtry</span>
              {activeFiltersCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-emerald-600 text-white">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* 1. Typ akce Filter: Skautská schůzka, Víkendová výprava, Tábor, Vzdělávací akce */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-1 border-t border-stone-100 dark:border-stone-800">
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mr-1 flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Typ akce:</span>
          </span>
          {SCOUT_EVENT_TYPES.map((ev) => {
            const active = filter.eventTypes.includes(ev.id);
            const Icon = ev.id === 'schuzka' ? Home : ev.id === 'vyprava' ? Compass : ev.id === 'tabor' ? Tent : GraduationCap;
            return (
              <button
                key={ev.id}
                onClick={() => toggleEventType(ev.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 touch-manipulation active:scale-95 ${
                  active
                    ? `${ev.badgeBg} shadow-sm ring-2 ring-stone-900/10 dark:ring-stone-100/10 font-bold`
                    : 'bg-stone-50 dark:bg-stone-800/80 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-700 hover:border-stone-300'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{ev.label}</span>
              </button>
            );
          })}
        </div>

        {/* 2. Věk: Age Categories Pills (Vlčata, Skauti, Roveři, Oldskauti) */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-1">
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mr-1">
            Věk:
          </span>
          {AGE_CATEGORIES.map((cat) => {
            const active = filter.ageCategories.includes(cat.id);
            return (
              <button
                key={cat.id}
                onClick={() => toggleAgeCategory(cat.id)}
                className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 touch-manipulation active:scale-95 ${
                  active
                    ? `${cat.badgeBg} shadow-sm ring-2 ring-stone-900/10 dark:ring-stone-100/10 font-bold`
                    : 'bg-stone-50 dark:bg-stone-800/80 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-700 hover:border-stone-300'
                }`}
              >
                <span>{cat.badgeText}</span>
              </button>
            );
          })}

          {/* Quick weather options in top bar */}
          <div className="h-4 w-px bg-stone-200 dark:bg-stone-700 mx-1 hidden sm:block" />
          <div className="hidden sm:flex items-center gap-1.5">
            {WEATHER_OPTIONS.map((w) => {
              const active = filter.weather.includes(w.id);
              return (
                <button
                  key={w.id}
                  onClick={() => toggleWeather(w.id)}
                  className={`p-1.5 rounded-lg border text-xs font-medium transition flex items-center gap-1 ${
                    active
                      ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-400 text-stone-900 dark:text-stone-100 ring-1 ring-amber-400'
                      : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:bg-stone-100'
                  }`}
                  title={`Vhodné pro počasí: ${w.label}`}
                >
                  {weatherIcons[w.id]}
                  <span className="text-[11px] hidden md:inline">{w.label}</span>
                </button>
              );
            })}
          </div>

          {/* Reset button if active */}
          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="ml-auto flex items-center gap-1 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline transition p-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Vymazat filtry</span>
            </button>
          )}
        </div>

      </div>

      {/* Expandable Detailed Filter Drawer */}
      {expanded && (
        <div className="border-t border-stone-200 dark:border-stone-800 p-4 sm:p-6 bg-stone-50/50 dark:bg-stone-900/50 space-y-6 animate-fadeIn">
          
          {/* 1. Skautská výchovná metoda (8 prvků) */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Skautská výchovná metoda (8 prvků)</span>
              </label>
              {filter.scoutMethods.length > 0 && (
                <button 
                  onClick={() => onChange({ ...filter, scoutMethods: [] })}
                  className="text-[11px] text-stone-400 hover:text-stone-600 underline"
                >
                  zrušit výběr metody
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {SCOUT_METHOD_ELEMENTS.map((el) => {
                const active = filter.scoutMethods.includes(el.id);
                return (
                  <button
                    key={el.id}
                    onClick={() => toggleScoutMethod(el.id)}
                    className={`p-2 rounded-xl text-left text-xs font-medium border transition ${
                      active
                        ? 'bg-emerald-100/90 text-emerald-950 border-emerald-400 font-semibold shadow-xs'
                        : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-emerald-300'
                    }`}
                    title={el.shortDesc}
                  >
                    <div className="font-semibold text-stone-900 dark:text-stone-100 leading-tight">
                      {el.name}
                    </div>
                    <div className="text-[10px] text-stone-500 dark:text-stone-400 line-clamp-1 mt-0.5">
                      {el.shortDesc}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Časová dotace (po 15 minutách až do 4 hodin) & Prostředí */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-stone-200/60 dark:border-stone-800">
            
            {/* Duration slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-stone-500" />
                  Časová dotace (max: {formatDuration(filter.maxDuration)})
                </span>
                <span className="font-semibold text-stone-700 dark:text-stone-300">
                  15 min – {formatDuration(filter.maxDuration)}
                </span>
              </div>
              <input
                type="range"
                min="15"
                max="240"
                step="15"
                value={filter.maxDuration}
                onChange={(e) => onChange({ ...filter, maxDuration: Number(e.target.value) })}
                className="w-full accent-emerald-600 h-2 bg-stone-200 dark:bg-stone-700 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400">
                <span>15 min</span>
                <span>45 min (družinovka)</span>
                <span>90 min (schůzka)</span>
                <span>2 h</span>
                <span>3 h</span>
                <span>4 h (půlden)</span>
              </div>
            </div>

            {/* Prostředí (uvnitř / venku / jedno) */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 block">
                Prostředí
              </span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'all', label: 'Všechna', icon: null },
                  { id: 'outside', label: 'Venku', icon: Trees },
                  { id: 'inside', label: 'Uvnitř', icon: Home },
                ].map((item) => {
                  const Icon = item.icon;
                  const active = filter.environment === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onChange({ ...filter, environment: item.id as EnvironmentType | 'all' })}
                      className={`p-2 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition ${
                        active
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                          : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      {Icon && <Icon className="w-3.5 h-3.5" />}
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* 3. Škála 1-10 (Fyzická zdatnost, Intelektuální náročnost, Kreativita, Týmová spolupráce, Náročnost přípravy) */}
          <div className="space-y-3 pt-2 border-t border-stone-200/60 dark:border-stone-800">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 block">
              Škála náročnosti a zaměření (1–10)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              
              {/* Fyzická */}
              <div className="bg-white dark:bg-stone-800 p-3 rounded-xl border border-stone-200 dark:border-stone-700 space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-stone-700 dark:text-stone-300 flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5 text-amber-500" /> Fyzická min.
                  </span>
                  <span className="font-bold text-amber-600">{filter.minPhysical}/10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={filter.minPhysical}
                  onChange={(e) => onChange({ ...filter, minPhysical: Number(e.target.value) })}
                  className="w-full accent-amber-500 h-1.5 bg-stone-100 dark:bg-stone-700 rounded-lg cursor-pointer"
                />
              </div>

              {/* Intelektuální */}
              <div className="bg-white dark:bg-stone-800 p-3 rounded-xl border border-stone-200 dark:border-stone-700 space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-stone-700 dark:text-stone-300 flex items-center gap-1">
                    <Brain className="w-3.5 h-3.5 text-sky-500" /> Intelekt min.
                  </span>
                  <span className="font-bold text-sky-600">{filter.minIntellectual}/10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={filter.minIntellectual}
                  onChange={(e) => onChange({ ...filter, minIntellectual: Number(e.target.value) })}
                  className="w-full accent-sky-500 h-1.5 bg-stone-100 dark:bg-stone-700 rounded-lg cursor-pointer"
                />
              </div>

              {/* Kreativita */}
              <div className="bg-white dark:bg-stone-800 p-3 rounded-xl border border-stone-200 dark:border-stone-700 space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-stone-700 dark:text-stone-300 flex items-center gap-1">
                    <Palette className="w-3.5 h-3.5 text-emerald-500" /> Kreativita min.
                  </span>
                  <span className="font-bold text-emerald-600">{filter.minCreativity}/10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={filter.minCreativity}
                  onChange={(e) => onChange({ ...filter, minCreativity: Number(e.target.value) })}
                  className="w-full accent-emerald-500 h-1.5 bg-stone-100 dark:bg-stone-700 rounded-lg cursor-pointer"
                />
              </div>

              {/* Týmová spolupráce */}
              <div className="bg-white dark:bg-stone-800 p-3 rounded-xl border border-stone-200 dark:border-stone-700 space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-stone-700 dark:text-stone-300 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-purple-500" /> Tým min.
                  </span>
                  <span className="font-bold text-purple-600">{filter.minTeamwork}/10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={filter.minTeamwork}
                  onChange={(e) => onChange({ ...filter, minTeamwork: Number(e.target.value) })}
                  className="w-full accent-purple-500 h-1.5 bg-stone-100 dark:bg-stone-700 rounded-lg cursor-pointer"
                />
              </div>

              {/* Náročnost přípravy */}
              <div className="bg-white dark:bg-stone-800 p-3 rounded-xl border border-stone-200 dark:border-stone-700 space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-stone-700 dark:text-stone-300 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-rose-500" /> Příprava max.
                  </span>
                  <span className="font-bold text-rose-600">{filter.maxPreparation}/10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={filter.maxPreparation}
                  onChange={(e) => onChange({ ...filter, maxPreparation: Number(e.target.value) })}
                  className="w-full accent-rose-500 h-1.5 bg-stone-100 dark:bg-stone-700 rounded-lg cursor-pointer"
                />
              </div>

            </div>
          </div>

          {/* 4. Štítky / klíčová slova */}
          <div className="space-y-2 pt-2 border-t border-stone-200/60 dark:border-stone-800">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 block">
              Oblíbené štítky a témata
            </span>
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_TAGS.map((tag) => {
                const active = filter.selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition ${
                      active
                        ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 border-stone-900 dark:border-stone-100 font-semibold'
                        : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    #{tag}
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* Results counter line */}
      <div className="px-4 py-2.5 bg-stone-50 dark:bg-stone-800/40 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 rounded-b-2xl">
        <span>
          Nalezeno <strong className="text-stone-900 dark:text-stone-100 font-semibold">{totalFilteredCount}</strong> programů
        </span>
        {hasActiveFilters && (
          <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
            Aktivní filtry zapnuty
          </span>
        )}
      </div>

    </div>
  );
};
