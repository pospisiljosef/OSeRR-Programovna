import React, { useState, useEffect } from 'react';
import { 
  YearlyPlan, 
  MonthlyScheduleItem, 
  ScoutProgram, 
  AgeCategoryId, 
  ScoutMethodElementId 
} from '../types/scout';
import { 
  AGE_CATEGORIES, 
  SCOUT_METHOD_ELEMENTS, 
  PERSONAL_DEVELOPMENT_DIMENSIONS,
  MONTH_NAMES_CZECH,
  formatPlanDuration 
} from '../data/constants';
import { useAuth } from '../context/AuthContext';
import { 
  X, 
  Save, 
  Calendar, 
  Sparkles, 
  Target, 
  Layers, 
  Pin, 
  Plus, 
  Trash2, 
  ChevronUp, 
  ChevronDown, 
  Search, 
  Clock, 
  Check, 
  AlertCircle,
  BookOpen,
  Lightbulb
} from 'lucide-react';

const SUGGESTED_MEANS = [
  'Celoroční etapová hra',
  'Družinový systém a rádcovské schůzky',
  'Víkendové výpravy',
  'Skautská stezka a odborky'
];

interface YearlyPlanFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (planData: Partial<YearlyPlan>) => Promise<void>;
  editingPlan?: YearlyPlan | null;
  allPrograms: ScoutProgram[];
}

export const YearlyPlanFormModal: React.FC<YearlyPlanFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingPlan,
  allPrograms
}) => {
  const { currentUser } = useAuth();

  // Basic info
  const [title, setTitle] = useState('');
  const [motto, setMotto] = useState('');
  const [summary, setSummary] = useState('');
  const [educationalGoals, setEducationalGoals] = useState('');
  const [vision, setVision] = useState('');
  const [durationMonths, setDurationMonths] = useState<number>(10);
  const [selectedAgeCategories, setSelectedAgeCategories] = useState<AgeCategoryId[]>(['skauti_skautky']);
  const [selectedScoutMethods, setSelectedScoutMethods] = useState<ScoutMethodElementId[]>([
    'druzina', 'symbolicky_ramec', 'slib_a_zakon'
  ]);

  // Means (Prostředky) - initially empty, user chooses to add or click examples
  const [meansList, setMeansList] = useState<string[]>([]);
  const [newMeanInput, setNewMeanInput] = useState('');

  // 1-10 Scales
  const [spiritual, setSpiritual] = useState<number>(8);
  const [physical, setPhysical] = useState<number>(7);
  const [emotional, setEmotional] = useState<number>(8);
  const [mental, setMental] = useState<number>(7);
  const [knowledge, setKnowledge] = useState<number>(8);

  // Tags
  const [tags, setTags] = useState<string[]>(['Celoroční plán', 'Družina', 'Etapovka']);
  const [newTagInput, setNewTagInput] = useState('');

  // Pinned Programs
  const [pinnedProgramIds, setPinnedProgramIds] = useState<string[]>([]);
  const [programSearch, setProgramSearch] = useState('');

  // Monthly Schedule (Timeline)
  const [monthlySchedule, setMonthlySchedule] = useState<MonthlyScheduleItem[]>([]);

  // Validation & Loading
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize or reset form
  useEffect(() => {
    if (editingPlan) {
      setTitle(editingPlan.title || '');
      setMotto(editingPlan.motto || '');
      setSummary(editingPlan.summary || '');
      setEducationalGoals(editingPlan.educationalGoals || '');
      setVision(editingPlan.vision || '');
      setDurationMonths(editingPlan.durationMonths || 10);
      setSelectedAgeCategories(editingPlan.ageCategories || ['skauti_skautky']);
      setSelectedScoutMethods(editingPlan.scoutMethods || ['druzina']);
      setMeansList(editingPlan.means || []);
      setSpiritual(editingPlan.spiritual ?? 7);
      setPhysical(editingPlan.physical ?? 7);
      setEmotional(editingPlan.emotional ?? 7);
      setMental(editingPlan.mental ?? 7);
      setKnowledge(editingPlan.knowledge ?? 7);
      setTags(editingPlan.tags || []);
      setPinnedProgramIds(editingPlan.pinnedProgramIds || []);
      setMonthlySchedule(editingPlan.monthlySchedule || generateDefaultSchedule(editingPlan.durationMonths || 10));
    } else {
      setTitle('');
      setMotto('');
      setSummary('');
      setEducationalGoals('');
      setVision('');
      setDurationMonths(10);
      setSelectedAgeCategories(['skauti_skautky']);
      setSelectedScoutMethods(['druzina', 'symbolicky_ramec', 'slib_a_zakon']);
      setMeansList([]);
      setSpiritual(8);
      setPhysical(7);
      setEmotional(8);
      setMental(7);
      setKnowledge(8);
      setTags(['Celoroční plán', 'Družina']);
      setPinnedProgramIds([]);
      setMonthlySchedule(generateDefaultSchedule(10));
    }
    setErrors({});
  }, [editingPlan, isOpen]);

  // Helper to generate default schedule for N months
  function generateDefaultSchedule(months: number): MonthlyScheduleItem[] {
    const items: MonthlyScheduleItem[] = [];
    for (let i = 1; i <= months; i++) {
      const monthName = MONTH_NAMES_CZECH[(i - 1) % 12];
      items.push({
        monthIndex: i,
        monthLabel: `${i}. měsíc (${monthName})`,
        theme: i === 1 ? 'Zahájení a sestavení družin' : i === months ? 'Závěrečné vyvrcholení' : `Téma ${i}. měsíce`,
        description: '',
        means: ['Schůzky družin', 'Oddílová činnost'],
        programIds: []
      });
    }
    return items;
  }

  // Update schedule when duration changes
  const handleDurationChange = (newMonths: number) => {
    setDurationMonths(newMonths);
    setMonthlySchedule((prev) => {
      const next: MonthlyScheduleItem[] = [];
      for (let i = 1; i <= newMonths; i++) {
        const existing = prev.find(p => p.monthIndex === i);
        if (existing) {
          next.push(existing);
        } else {
          const monthName = MONTH_NAMES_CZECH[(i - 1) % 12];
          next.push({
            monthIndex: i,
            monthLabel: `${i}. měsíc (${monthName})`,
            theme: `Téma ${i}. měsíce`,
            description: '',
            means: ['Schůzky'],
            programIds: []
          });
        }
      }
      return next;
    });
  };

  const handleToggleAge = (catId: AgeCategoryId) => {
    if (selectedAgeCategories.includes(catId)) {
      if (selectedAgeCategories.length > 1) {
        setSelectedAgeCategories(selectedAgeCategories.filter(c => c !== catId));
      }
    } else {
      setSelectedAgeCategories([...selectedAgeCategories, catId]);
    }
  };

  const handleToggleMethod = (methodId: ScoutMethodElementId) => {
    if (selectedScoutMethods.includes(methodId)) {
      if (selectedScoutMethods.length > 1) {
        setSelectedScoutMethods(selectedScoutMethods.filter(m => m !== methodId));
      }
    } else {
      setSelectedScoutMethods([...selectedScoutMethods, methodId]);
    }
  };

  const handleAddMean = () => {
    if (newMeanInput.trim() && !meansList.includes(newMeanInput.trim())) {
      setMeansList([...meansList, newMeanInput.trim()]);
      setNewMeanInput('');
    }
  };

  const handleRemoveMean = (idx: number) => {
    setMeansList(meansList.filter((_, i) => i !== idx));
  };

  const handleAddTag = () => {
    if (newTagInput.trim() && !tags.includes(newTagInput.trim())) {
      setTags([...tags, newTagInput.trim()]);
      setNewTagInput('');
    }
  };

  const handleRemoveTag = (t: string) => {
    setTags(tags.filter(tag => tag !== t));
  };

  const handleTogglePinProgram = (progId: string) => {
    if (pinnedProgramIds.includes(progId)) {
      setPinnedProgramIds(pinnedProgramIds.filter(id => id !== progId));
      // Also remove from any monthly schedule
      setMonthlySchedule(prev => prev.map(m => ({
        ...m,
        programIds: m.programIds.filter(id => id !== progId)
      })));
    } else {
      setPinnedProgramIds([...pinnedProgramIds, progId]);
    }
  };

  // Monthly schedule operations
  const updateMonthTheme = (monthIdx: number, newTheme: string) => {
    setMonthlySchedule(prev => prev.map(m => m.monthIndex === monthIdx ? { ...m, theme: newTheme } : m));
  };

  const updateMonthDesc = (monthIdx: number, newDesc: string) => {
    setMonthlySchedule(prev => prev.map(m => m.monthIndex === monthIdx ? { ...m, description: newDesc } : m));
  };

  const addProgramToMonth = (monthIdx: number, progId: string) => {
    setMonthlySchedule(prev => prev.map(m => {
      if (m.monthIndex === monthIdx) {
        if (!m.programIds.includes(progId)) {
          return { ...m, programIds: [...m.programIds, progId] };
        }
      }
      return m;
    }));
    if (!pinnedProgramIds.includes(progId)) {
      setPinnedProgramIds(prev => [...prev, progId]);
    }
  };

  const removeProgramFromMonth = (monthIdx: number, progId: string) => {
    setMonthlySchedule(prev => prev.map(m => {
      if (m.monthIndex === monthIdx) {
        return { ...m, programIds: m.programIds.filter(id => id !== progId) };
      }
      return m;
    }));
  };

  const moveProgramInMonth = (monthIdx: number, progIdx: number, direction: 'up' | 'down') => {
    setMonthlySchedule(prev => prev.map(m => {
      if (m.monthIndex === monthIdx) {
        const arr = [...m.programIds];
        const targetIdx = direction === 'up' ? progIdx - 1 : progIdx + 1;
        if (targetIdx >= 0 && targetIdx < arr.length) {
          const temp = arr[progIdx];
          arr[progIdx] = arr[targetIdx];
          arr[targetIdx] = temp;
          return { ...m, programIds: arr };
        }
      }
      return m;
    }));
  };

  // Submit validation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Název celoročního plánu je povinný.';
    }
    if (!vision.trim()) {
      newErrors.vision = 'Vize celoroční činnosti je povinná (popište, kam oddíl směřuje a co je cílem).';
    }
    if (!educationalGoals.trim()) {
      newErrors.educationalGoals = 'Výchovné cíle jsou povinné (formulujte konkrétní rozvojové cíle).';
    }
    if (selectedAgeCategories.length === 0) {
      newErrors.age = 'Vyberte alespoň jednu věkovou kategorii.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const planPayload: Partial<YearlyPlan> = {
        id: editingPlan?.id,
        title: title.trim(),
        motto: motto.trim(),
        summary: summary.trim() || vision.trim().substring(0, 150),
        educationalGoals: educationalGoals.trim(),
        vision: vision.trim(),
        durationMonths,
        ageCategories: selectedAgeCategories,
        scoutMethods: selectedScoutMethods,
        means: meansList,
        spiritual,
        physical,
        emotional,
        mental,
        knowledge,
        tags,
        pinnedProgramIds,
        monthlySchedule,
        authorId: editingPlan?.authorId || currentUser?.uid || 'host_vedouci',
        authorName: editingPlan?.authorName || currentUser?.displayName || 'Skautský vedoucí',
        authorEmail: editingPlan?.authorEmail || currentUser?.email || undefined,
        authorUnit: editingPlan?.authorUnit || currentUser?.unitName || '',
        authorCenter: editingPlan?.authorCenter || currentUser?.centerName || ''
      };

      await onSave(planPayload);
      onClose();
    } catch (err: any) {
      console.error('Failed to save yearly plan:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const filteredAvailablePrograms = allPrograms.filter(p =>
    p.title.toLowerCase().includes(programSearch.toLowerCase()) ||
    p.tags?.some(t => t.toLowerCase().includes(programSearch.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-sm flex justify-center items-start p-2 sm:p-6 animate-fadeIn">
      <div className="relative bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden my-2 sm:my-6">
        
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50/50 dark:bg-stone-800/50">
          <div>
            <h3 className="text-lg sm:text-xl font-black text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-600" />
              <span>{editingPlan ? 'Upravit celoroční plán' : 'Přidat nový celoroční plán & činnost'}</span>
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              Sdílejte celoroční plán s vizí, výchovnými cíli a časovou osou s ostatními vedoucími
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-7 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* 1. Title & Motto */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
                Název celoročního plánu <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Např. Rytíři kulatého stolu: Cesta cti a odvahy"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-2xl bg-stone-50 dark:bg-stone-800 border ${
                  errors.title ? 'border-rose-500 ring-1 ring-rose-500' : 'border-stone-200 dark:border-stone-700'
                } text-stone-900 dark:text-stone-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500`}
              />
              {errors.title && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.title}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
                  Motto / Podtitul
                </label>
                <input
                  type="text"
                  placeholder="Např. „Kdo chce vládnout meči, musí nejprve ovládnout sebe.“"
                  value={motto}
                  onChange={(e) => setMotto(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
                  Časový rozsah (měsíc až 2 roky) <span className="text-rose-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <select
                    value={durationMonths}
                    onChange={(e) => handleDurationChange(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value={1}>1 měsíc (Mini projekt)</option>
                    <option value={2}>2 měsíce</option>
                    <option value={3}>3 měsíce (Čtvrtletí)</option>
                    <option value={6}>6 měsíců (Půl roku / Pololetí)</option>
                    <option value={10}>10 měsíců (Školní rok Září–Červen)</option>
                    <option value={12}>12 měsíců (1 celý rok včetně tábora)</option>
                    <option value={18}>18 měsíců (1,5 roku)</option>
                    <option value={24}>24 měsíců (2 roky)</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
                Krátký přehled / Anotace
              </label>
              <textarea
                rows={2}
                placeholder="Stručné shrnutí pro přehled v databázi..."
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full px-4 py-2 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* 2. MANDATORY: Vision & Educational Goals */}
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/80 space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <h4 className="text-sm font-extrabold text-amber-950 dark:text-amber-200">
                Povinné skautské výchovné pilíře
              </h4>
            </div>

            {/* Vision */}
            <div>
              <label className="block text-xs font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider mb-1">
                Vize celoroční činnosti <span className="text-rose-500 font-black">* (POVINNÉ)</span>
              </label>
              <p className="text-[11px] text-amber-700 dark:text-amber-400 mb-1.5">
                Kam celý rok směřujeme? Jaká je celoroční zápletka a jak se děti / rádci v průběhu roku promění?
              </p>
              <textarea
                rows={3}
                placeholder="Např. Družiny v průběhu roku postupně prochází rytířskou stezkou od pážat po pasované rytíře Kulatého stolu..."
                value={vision}
                onChange={(e) => setVision(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-2xl bg-white dark:bg-stone-800 border ${
                  errors.vision ? 'border-rose-500 ring-1 ring-rose-500' : 'border-amber-200 dark:border-amber-800'
                } text-stone-900 dark:text-stone-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500`}
              />
              {errors.vision && <p className="text-xs text-rose-500 mt-1 font-bold">{errors.vision}</p>}
            </div>

            {/* Educational Goals */}
            <div>
              <label className="block text-xs font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider mb-1">
                Výchovné cíle <span className="text-rose-500 font-black">* (POVINNÉ)</span>
              </label>
              <p className="text-[11px] text-amber-700 dark:text-amber-400 mb-1.5">
                Jaké konkrétní dovednosti, postoje a hodnoty si mají účastníci odnést?
              </p>
              <textarea
                rows={3}
                placeholder="1. Osvojení skautského zákona a slibu v praxi.&#10;2. Samostatnost družinových rádců.&#10;3. Zvládnutí první pomoci a tábornictví."
                value={educationalGoals}
                onChange={(e) => setEducationalGoals(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-2xl bg-white dark:bg-stone-800 border ${
                  errors.educationalGoals ? 'border-rose-500 ring-1 ring-rose-500' : 'border-amber-200 dark:border-amber-800'
                } text-stone-900 dark:text-stone-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500`}
              />
              {errors.educationalGoals && <p className="text-xs text-rose-500 mt-1 font-bold">{errors.educationalGoals}</p>}
            </div>
          </div>

          {/* 3. Age Categories & Scout Methods */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Age Categories */}
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-2">
                Věkové kategorie <span className="text-rose-500">*</span>
              </label>
              <div className="flex flex-wrap gap-1.5">
                {AGE_CATEGORIES.map((cat) => {
                  const isSelected = selectedAgeCategories.includes(cat.id);
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleToggleAge(cat.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition border ${
                        isSelected
                          ? `${cat.badgeBg} shadow-xs ring-2 ring-emerald-500/40`
                          : 'bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      {cat.badgeText}
                    </button>
                  );
                })}
              </div>
              {errors.age && <p className="text-xs text-rose-500 mt-1">{errors.age}</p>}
            </div>

            {/* Scout Methods */}
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-2">
                Prvky skautské výchovné metody
              </label>
              <div className="flex flex-wrap gap-1.5">
                {SCOUT_METHOD_ELEMENTS.map((el) => {
                  const isSelected = selectedScoutMethods.includes(el.id);
                  return (
                    <button
                      key={el.id}
                      type="button"
                      onClick={() => handleToggleMethod(el.id)}
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
          </div>

          {/* 4. Means / Prostředky (Použití výchovných prostředků a forem) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-600" />
                <h4 className="text-sm font-bold text-stone-800 dark:text-stone-200">
                  Použití výchovných prostředků a forem činnosti
                </h4>
              </div>
              <span className="text-xs text-stone-500">Volitelné</span>
            </div>

            <div className="space-y-2.5">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Např. Celoroční etapová hra, Družinový systém a rádcovské schůzky, Víkendové výpravy, Skautská stezka a odborky..."
                  value={newMeanInput}
                  onChange={(e) => setNewMeanInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddMean();
                    }
                  }}
                  className="flex-1 px-4 py-2 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs sm:text-sm text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="button"
                  onClick={handleAddMean}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 transition shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Přidat</span>
                </button>
              </div>

              {/* Příklady pro inspiraci – neukládají se automaticky, uživatel je nemusí mazat */}
              <div className="space-y-1.5 pt-0.5">
                <div className="flex items-center gap-1.5 text-[11px] text-stone-500 dark:text-stone-400">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>Příklady pro inspiraci (kliknutím vložíte do plánu):</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTED_MEANS.filter(s => !meansList.includes(s)).map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => {
                        if (!meansList.includes(suggestion)) {
                          setMeansList([...meansList, suggestion]);
                        }
                      }}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-white dark:bg-stone-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-stone-600 hover:text-emerald-700 dark:text-stone-300 dark:hover:text-emerald-300 border border-stone-200 hover:border-emerald-300 dark:border-stone-700 dark:hover:border-emerald-700 transition flex items-center gap-1 shadow-2xs cursor-pointer"
                      title="Kliknutím přidat tento příklad do plánu"
                    >
                      <Plus className="w-3 h-3 text-stone-400" />
                      <span>{suggestion}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Vybrané prostředky (zobrazí se pouze tehdy, když uživatel skutečně nějaký přidá) */}
            {meansList.length > 0 ? (
              <div className="space-y-1.5 pt-2 border-t border-stone-200 dark:border-stone-700">
                <div className="text-[11px] font-semibold text-stone-600 dark:text-stone-400">
                  Přidané prostředky v plánu ({meansList.length}):
                </div>
                <div className="flex flex-wrap gap-2">
                  {meansList.map((mean, idx) => (
                    <span
                      key={idx}
                      className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 text-xs px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5 shadow-xs font-medium"
                    >
                      <span>{mean}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveMean(idx)}
                        className="text-emerald-600 hover:text-rose-600 dark:text-emerald-400 dark:hover:text-rose-400 transition ml-0.5 p-0.5 rounded-full hover:bg-rose-50 dark:hover:bg-rose-950/40"
                        title="Odebrat z plánu"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-[11px] text-stone-400 dark:text-stone-500 italic pt-1">
                Zatím není přidán žádný prostředek. Zadejte vlastní název výše nebo klikněte na libovolný příklad pro rychlé vložení.
              </p>
            )}
          </div>

          {/* 5. 5 stránek skautského rozvoje (1-10) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/80 dark:border-purple-800/80 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <h4 className="text-sm font-bold text-purple-950 dark:text-purple-200">
                  5 stránek skautského rozvoje (škála 1–10)
                </h4>
              </div>
              <span className="text-xs text-stone-500">Míra zacílení plánu na jednotlivé dimenze</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3.5">
              {[
                { key: 'spiritual', label: 'Duchovní', val: spiritual, set: setSpiritual, color: '#8B5CF6', hint: 'Smysl, hodnoty, reflexe' },
                { key: 'physical', label: 'Fyzická', val: physical, set: setPhysical, color: '#10B981', hint: 'Pohyb, zdatnost, příroda' },
                { key: 'emotional', label: 'Emoční', val: emotional, set: setEmotional, color: '#F43F5E', hint: 'City, empatie, sebepoznání' },
                { key: 'mental', label: 'Duševní', val: mental, set: setMental, color: '#3B82F6', hint: 'Intelekt, kritické myšlení' },
                { key: 'knowledge', label: 'Znalostní', val: knowledge, set: setKnowledge, color: '#F59E0B', hint: 'Dovednosti, tábornictví, společnost' }
              ].map((item) => (
                <div key={item.key} className="bg-white dark:bg-stone-800 p-3 rounded-xl border border-stone-200 dark:border-stone-700 space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-stone-700 dark:text-stone-300" title={item.hint}>
                      {item.label}
                    </span>
                    <span className="font-extrabold font-mono text-stone-900 dark:text-stone-100" style={{ color: item.color }}>
                      {item.val}/10
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={item.val}
                    onChange={(e) => item.set(Number(e.target.value))}
                    className="w-full accent-purple-600"
                  />
                  <div className="text-[10px] text-stone-400 dark:text-stone-500 truncate" title={item.hint}>
                    {item.hint}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 6. PIN PROGRAMS FROM DATABASE (Připíchnout programy z databáze) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Pin className="w-4 h-4 text-amber-600" />
                <h4 className="text-sm font-bold text-amber-950 dark:text-amber-200">
                  Připíchnout programy z databáze programů ({pinnedProgramIds.length})
                </h4>
              </div>
              <span className="text-xs text-stone-500">
                Vyberte aktivity, které jsou součástí tohoto plánu
              </span>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Vyhledat aktivitu v databázi programů k připíchnutí..."
                value={programSearch}
                onChange={(e) => setProgramSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs sm:text-sm text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* List of selectable programs */}
            <div className="max-h-48 overflow-y-auto space-y-1.5 p-1">
              {filteredAvailablePrograms.map((prog) => {
                const isPinned = pinnedProgramIds.includes(prog.id);
                return (
                  <div
                    key={prog.id}
                    onClick={() => handleTogglePinProgram(prog.id)}
                    className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 text-xs cursor-pointer transition ${
                      isPinned
                        ? 'bg-amber-100 dark:bg-amber-900/50 border-amber-300 dark:border-amber-700 font-bold text-amber-900 dark:text-amber-100'
                        : 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 hover:border-amber-400 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                        isPinned ? 'bg-amber-600 border-amber-600 text-white' : 'border-stone-300'
                      }`}>
                        {isPinned && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span className="truncate">{prog.title}</span>
                      <span className="text-[10px] text-stone-400 font-normal shrink-0">
                        ({prog.durationMinutes} min, {prog.authorName})
                      </span>
                    </div>

                    <span className="text-[10px] uppercase font-bold shrink-0">
                      {isPinned ? 'Připíchnuto' : 'Připíchnout'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 7. MONTHLY TIMELINE BUILDER (Časová osa po měsících a pořadí) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <h4 className="text-sm font-bold text-stone-800 dark:text-stone-200">
                  Časová osa po měsících a pořadí programů ({monthlySchedule.length} měsíců)
                </h4>
              </div>
              <span className="text-xs text-stone-500">
                Přiřaďte témata a pořadí programů do jednotlivých měsíců
              </span>
            </div>

            <div className="space-y-3.5 max-h-96 overflow-y-auto pr-1">
              {monthlySchedule.map((m) => (
                <div
                  key={m.monthIndex}
                  className="p-3.5 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 space-y-2.5 shadow-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="text-xs font-black text-emerald-700 dark:text-emerald-400">
                      {m.monthLabel}
                    </span>
                    <input
                      type="text"
                      placeholder="Téma měsíce / cíl..."
                      value={m.theme}
                      onChange={(e) => updateMonthTheme(m.monthIndex, e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs font-semibold text-stone-900 dark:text-stone-100"
                    />
                  </div>

                  {/* Monthly programs with reorder buttons */}
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-stone-400 mb-1">
                      <span>Programy v tomto měsíci (v pořadí):</span>
                      {pinnedProgramIds.length > 0 && (
                        <select
                          onChange={(e) => {
                            if (e.target.value) {
                              addProgramToMonth(m.monthIndex, e.target.value);
                              e.target.value = '';
                            }
                          }}
                          className="text-[11px] bg-stone-100 dark:bg-stone-700 rounded-lg px-2 py-0.5 border border-stone-300 dark:border-stone-600"
                        >
                          <option value="">+ Přidat program do tohoto měsíce</option>
                          {pinnedProgramIds.map(pid => {
                            const prog = allPrograms.find(p => p.id === pid);
                            return (
                              <option key={pid} value={pid}>
                                {prog ? prog.title : pid}
                              </option>
                            );
                          })}
                        </select>
                      )}
                    </div>

                    {m.programIds.length === 0 ? (
                      <p className="text-[11px] text-stone-400 italic">Žádné programy nepřiřazeny.</p>
                    ) : (
                      <div className="space-y-1.5">
                        {m.programIds.map((pId, pIdx) => {
                          const prog = allPrograms.find(p => p.id === pId);
                          return (
                            <div
                              key={`${pId}-${pIdx}`}
                              className="p-2 rounded-xl bg-stone-50 dark:bg-stone-750 border border-stone-200 dark:border-stone-700 flex items-center justify-between gap-2 text-xs"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0">
                                  {pIdx + 1}
                                </span>
                                <span className="font-semibold truncate">
                                  {prog ? prog.title : pId}
                                </span>
                              </div>

                              <div className="flex items-center gap-1 shrink-0">
                                <button
                                  type="button"
                                  disabled={pIdx === 0}
                                  onClick={() => moveProgramInMonth(m.monthIndex, pIdx, 'up')}
                                  className="p-1 rounded hover:bg-stone-200 dark:hover:bg-stone-700 disabled:opacity-30"
                                  title="Posunout nahoru v pořadí"
                                >
                                  <ChevronUp className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  disabled={pIdx === m.programIds.length - 1}
                                  onClick={() => moveProgramInMonth(m.monthIndex, pIdx, 'down')}
                                  className="p-1 rounded hover:bg-stone-200 dark:hover:bg-stone-700 disabled:opacity-30"
                                  title="Posunout dolů v pořadí"
                                >
                                  <ChevronDown className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => removeProgramFromMonth(m.monthIndex, pId)}
                                  className="p-1 rounded text-stone-400 hover:text-rose-500"
                                  title="Odebrat z měsíce"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 8. Tags / Klíčová slova */}
          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
              Klíčová slova
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Přidat klíčové slovo (např. Vlčata, Družina, Tábor, Přežití)..."
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                className="flex-1 px-4 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs sm:text-sm text-stone-900 dark:text-stone-100"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-white font-bold text-xs"
              >
                Přidat
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {tags.map((t) => (
                <span
                  key={t}
                  className="bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs px-2.5 py-1 rounded-lg font-mono flex items-center gap-1.5"
                >
                  <span>#{t}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(t)}
                    className="text-stone-400 hover:text-rose-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Form Actions Footer */}
          <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-end gap-3 sticky bottom-0 bg-white/95 dark:bg-stone-900/95 py-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
            >
              Zrušit
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md hover:shadow-lg transition flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Ukládám...' : editingPlan ? 'Uložit změny' : 'Sdílet celoroční plán'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
