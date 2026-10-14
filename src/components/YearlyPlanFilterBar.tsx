import React, { useState } from 'react';
import { YearlyPlanFilterState, AgeCategoryId, ScoutMethodElementId } from '../types/scout';
import { 
  AGE_CATEGORIES, 
  SCOUT_METHOD_ELEMENTS, 
  PERSONAL_DEVELOPMENT_DIMENSIONS,
  INITIAL_YEARLY_PLAN_FILTER,
  formatPlanDuration
} from '../data/constants';
import { 
  Search, 
  SlidersHorizontal, 
  X, 
  RotateCcw, 
  Heart, 
  UserCheck, 
  Calendar, 
  Sparkles, 
  ChevronDown, 
  ChevronUp,
  Tag
} from 'lucide-react';

interface YearlyPlanFilterBarProps {
  filter: YearlyPlanFilterState;
  onChange: (newFilter: YearlyPlanFilterState) => void;
  availableTags: string[];
  totalPlansCount: number;
  filteredPlansCount: number;
  isLoggedIn: boolean;
}

export const YearlyPlanFilterBar: React.FC<YearlyPlanFilterBarProps> = ({
  filter,
  onChange,
  availableTags,
  totalPlansCount,
  filteredPlansCount,
  isLoggedIn
}) => {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const toggleAgeCategory = (id: AgeCategoryId) => {
    const exists = filter.ageCategories.includes(id);
    const updated = exists
      ? filter.ageCategories.filter(c => c !== id)
      : [...filter.ageCategories, id];
    onChange({ ...filter, ageCategories: updated });
  };

  const toggleScoutMethod = (id: ScoutMethodElementId) => {
    const exists = filter.scoutMethods.includes(id);
    const updated = exists
      ? filter.scoutMethods.filter(m => m !== id)
      : [...filter.scoutMethods, id];
    onChange({ ...filter, scoutMethods: updated });
  };

  const toggleTag = (tag: string) => {
    const exists = filter.selectedTags.includes(tag);
    const updated = exists
      ? filter.selectedTags.filter(t => t !== tag)
      : [...filter.selectedTags, tag];
    onChange({ ...filter, selectedTags: updated });
  };

  const handleReset = () => {
    onChange(INITIAL_YEARLY_PLAN_FILTER);
  };

  const hasActiveFilters = 
    filter.searchQuery !== '' ||
    filter.ageCategories.length > 0 ||
    filter.scoutMethods.length > 0 ||
    filter.selectedTags.length > 0 ||
    filter.minDurationMonths > 1 ||
    filter.maxDurationMonths < 24 ||
    filter.minSpiritual > 1 ||
    filter.minPhysical > 1 ||
    filter.minEmotional > 1 ||
    filter.minMental > 1 ||
    filter.minKnowledge > 1 ||
    filter.onlyFavorites ||
    filter.onlyMyPlans;

  return (
    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-4 sm:p-5 shadow-xs space-y-4">
      {/* Top Search & Primary Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Hledat celoroční plán podle názvu, cílů, vize či klíčových slov..."
            value={filter.searchQuery}
            onChange={(e) => onChange({ ...filter, searchQuery: e.target.value })}
            className="w-full pl-10.5 pr-9 py-2.5 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition"
          />
          {filter.searchQuery && (
            <button
              type="button"
              onClick={() => onChange({ ...filter, searchQuery: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort & Toggle Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <select
            value={filter.sortBy}
            onChange={(e) => onChange({ ...filter, sortBy: e.target.value as any })}
            className="px-3 py-2.5 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs sm:text-sm font-semibold text-stone-700 dark:text-stone-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          >
            <option value="newest">Nejnovější plány</option>
            <option value="rating">Nejlépe hodnocené</option>
            <option value="duration_asc">Čas: Od nejkratších</option>
            <option value="duration_desc">Čas: Od nejdelších</option>
          </select>

          {isLoggedIn && (
            <button
              type="button"
              onClick={() => onChange({ ...filter, onlyMyPlans: !filter.onlyMyPlans })}
              className={`px-3 py-2.5 rounded-2xl text-xs sm:text-sm font-bold border flex items-center gap-1.5 transition ${
                filter.onlyMyPlans
                  ? 'bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-700'
                  : 'bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-stone-100'
              }`}
              title="Zobrazit pouze mé vytvořené plány"
            >
              <UserCheck className="w-4 h-4" />
              <span className="hidden sm:inline">Moje</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => onChange({ ...filter, onlyFavorites: !filter.onlyFavorites })}
            className={`px-3 py-2.5 rounded-2xl text-xs sm:text-sm font-bold border flex items-center gap-1.5 transition ${
              filter.onlyFavorites
                ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-700'
                : 'bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-stone-100'
            }`}
            title="Filtrovat pouze oblíbené celoroční plány"
          >
            <Heart className={`w-4 h-4 ${filter.onlyFavorites ? 'fill-current' : ''}`} />
            <span className="hidden sm:inline">Oblíbené</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
            className={`px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold border flex items-center gap-1.5 transition ${
              isAdvancedOpen
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-200 border-stone-200 dark:border-stone-700 hover:bg-stone-100'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">Filtry</span>
            {isAdvancedOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Age Categories Filter Buttons */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
            Věková kategorie:
          </span>
          {filter.ageCategories.length > 0 && (
            <button
              type="button"
              onClick={() => onChange({ ...filter, ageCategories: [] })}
              className="text-[11px] text-emerald-600 font-semibold hover:underline"
            >
              Zrušit výběr věkovek
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {AGE_CATEGORIES.map((cat) => {
            const isSelected = filter.ageCategories.includes(cat.id);
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => toggleAgeCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition border ${
                  isSelected
                    ? `${cat.badgeBg} shadow-xs scale-102 ring-2 ring-emerald-500/30`
                    : 'bg-stone-50 dark:bg-stone-800/80 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-stone-100'
                }`}
              >
                {cat.badgeText}
              </button>
            );
          })}
        </div>
      </div>

      {/* Duration quick presets */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            Časový rozsah (měsíc až 2 roky):
          </span>
          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
            {filter.minDurationMonths} – {formatPlanDuration(filter.maxDurationMonths)}
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {[
            { label: 'Vše (1 měsíc – 2 roky)', min: 1, max: 24 },
            { label: '1–3 měsíce', min: 1, max: 3 },
            { label: 'Půl roku (6 měsíců)', min: 5, max: 7 },
            { label: 'Školní rok (10 měsíců)', min: 9, max: 11 },
            { label: '1 rok (12 měsíců)', min: 11, max: 13 },
            { label: '1,5 – 2 roky (18–24 měsíců)', min: 17, max: 24 },
          ].map((preset) => {
            const isSelected = filter.minDurationMonths === preset.min && filter.maxDurationMonths === preset.max;
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => onChange({ ...filter, minDurationMonths: preset.min, maxDurationMonths: preset.max })}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition border ${
                  isSelected
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-stone-100'
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Advanced expandable filter options: Scout Methods & 1-10 Personal Development Scales */}
      {isAdvancedOpen && (
        <div className="pt-4 border-t border-stone-200 dark:border-stone-800 space-y-4 animate-fadeIn">
          {/* Duration range sliders */}
          <div className="bg-stone-50 dark:bg-stone-850 p-3.5 rounded-2xl border border-stone-200 dark:border-stone-750">
            <span className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-2">
              Přesné nastavení doby trvání (v měsících):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between text-xs text-stone-500 mb-1">
                  <span>Minimální délka:</span>
                  <span className="font-bold text-stone-800 dark:text-stone-200">{filter.minDurationMonths} měsíc</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="24"
                  value={filter.minDurationMonths}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    onChange({ ...filter, minDurationMonths: val, maxDurationMonths: Math.max(val, filter.maxDurationMonths) });
                  }}
                  className="w-full accent-emerald-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-stone-500 mb-1">
                  <span>Maximální délka:</span>
                  <span className="font-bold text-stone-800 dark:text-stone-200">{formatPlanDuration(filter.maxDurationMonths)}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="24"
                  value={filter.maxDurationMonths}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    onChange({ ...filter, maxDurationMonths: val, minDurationMonths: Math.min(val, filter.minDurationMonths) });
                  }}
                  className="w-full accent-emerald-600"
                />
              </div>
            </div>
          </div>

          {/* 5 Personal Development Scales 1-10 */}
          <div className="bg-stone-50 dark:bg-stone-850 p-3.5 rounded-2xl border border-stone-200 dark:border-stone-750">
            <span className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5 mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              Stránky skautské výchovy – minimální hodnocení (1–10):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {PERSONAL_DEVELOPMENT_DIMENSIONS.map((dim) => {
                const filterKey = `min${dim.id.charAt(0).toUpperCase() + dim.id.slice(1)}` as keyof YearlyPlanFilterState;
                const currentVal = (filter[filterKey] as number) || 1;
                return (
                  <div key={dim.id} className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-stone-700 dark:text-stone-300 truncate" title={dim.label}>
                        {dim.label.split(' ')[0]}
                      </span>
                      <span className="font-bold font-mono text-stone-900 dark:text-stone-100 text-[11px]">
                        min. {currentVal}/10
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={currentVal}
                      onChange={(e) => onChange({ ...filter, [filterKey]: Number(e.target.value) })}
                      className="w-full accent-purple-600"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Scout Methods 8 Elements */}
          <div>
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-1.5">
              Prvky skautské výchovné metody:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {SCOUT_METHOD_ELEMENTS.map((el) => {
                const isSelected = filter.scoutMethods.includes(el.id);
                return (
                  <button
                    key={el.id}
                    type="button"
                    onClick={() => toggleScoutMethod(el.id)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition border ${
                      isSelected
                        ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                        : 'bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    {el.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Keywords / Tags */}
          {availableTags.length > 0 && (
            <div>
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-1.5">
                Klíčová slova celoročních plánů:
              </span>
              <div className="flex flex-wrap gap-1">
                {availableTags.slice(0, 15).map((tag) => {
                  const isSelected = filter.selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`px-2 py-0.5 rounded-lg text-xs font-mono transition border ${
                        isSelected
                          ? 'bg-stone-800 dark:bg-stone-200 text-white dark:text-stone-900 border-stone-800'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-stone-200'
                      }`}
                    >
                      #{tag}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Active filters status & Reset */}
      <div className="flex items-center justify-between pt-2 border-t border-stone-100 dark:border-stone-800 text-xs">
        <span className="text-stone-500 dark:text-stone-400">
          Zobrazeno <strong className="text-stone-800 dark:text-stone-200">{filteredPlansCount}</strong> z celkem {totalPlansCount} celoročních plánů
        </span>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1 text-rose-600 dark:text-rose-400 font-bold hover:underline"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Resetovat filtry</span>
          </button>
        )}
      </div>
    </div>
  );
};
