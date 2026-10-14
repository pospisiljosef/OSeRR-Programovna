import React, { useState, useEffect } from 'react';
import { ScoutProgram, AgeCategoryId, ScoutMethodElementId, WeatherType, EnvironmentType, ScoutEventType } from '../types/scout';
import { 
  AGE_CATEGORIES, 
  SCOUT_METHOD_ELEMENTS, 
  WEATHER_OPTIONS, 
  POPULAR_TAGS, 
  SCOUT_EVENT_TYPES,
  formatDuration 
} from '../data/constants';
import { useAuth } from '../context/AuthContext';
import { 
  X, 
  Upload, 
  FileText, 
  Link, 
  Clock, 
  Sparkles, 
  Activity, 
  Brain, 
  Palette, 
  Users, 
  Compass, 
  Plus, 
  AlertCircle,
  Check,
  Home,
  Tent,
  GraduationCap
} from 'lucide-react';

interface ProgramFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (programData: any) => Promise<void>;
  editingProgram?: ScoutProgram | null;
}

export const ProgramFormModal: React.FC<ProgramFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingProgram
}) => {
  const { currentUser } = useAuth();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [educationalGoals, setEducationalGoals] = useState('');
  const [materials, setMaterials] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [minParticipants, setMinParticipants] = useState<number>(6);
  const [maxParticipants, setMaxParticipants] = useState<number>(24);
  const [ageCategories, setAgeCategories] = useState<AgeCategoryId[]>(['skauti_skautky']);
  const [eventTypes, setEventTypes] = useState<ScoutEventType[]>(['schuzka']);
  const [scoutMethods, setScoutMethods] = useState<ScoutMethodElementId[]>(['druzina', 'uceni_zkusenosti']);
  const [environment, setEnvironment] = useState<EnvironmentType>('outside');
  const [weather, setWeather] = useState<WeatherType[]>(['sunny']);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [attachmentName, setAttachmentName] = useState('');
  const [attachmentData, setAttachmentData] = useState<string | undefined>(undefined);

  // 1-10 Scales
  const [physicalDemand, setPhysicalDemand] = useState(5);
  const [intellectualDemand, setIntellectualDemand] = useState(5);
  const [creativity, setCreativity] = useState(5);
  const [teamwork, setTeamwork] = useState(6);
  const [preparationDemand, setPreparationDemand] = useState(4);

  useEffect(() => {
    if (editingProgram) {
      setTitle(editingProgram.title);
      setSummary(editingProgram.summary);
      setDescription(editingProgram.description);
      setEducationalGoals(editingProgram.educationalGoals || '');
      setMaterials(editingProgram.materials || '');
      setDurationMinutes(editingProgram.durationMinutes);
      setMinParticipants(editingProgram.minParticipants || 6);
      setMaxParticipants(editingProgram.maxParticipants || 24);
      setAgeCategories(editingProgram.ageCategories || ['skauti_skautky']);
      setEventTypes(editingProgram.eventTypes && editingProgram.eventTypes.length > 0 ? editingProgram.eventTypes : ['schuzka']);
      setScoutMethods(editingProgram.scoutMethods || []);
      setEnvironment(editingProgram.environment || 'outside');
      setWeather(editingProgram.weather || ['sunny']);
      setTags(editingProgram.tags || []);
      setAttachmentUrl(editingProgram.attachmentUrl || '');
      setAttachmentName(editingProgram.attachmentName || '');
      setAttachmentData(editingProgram.attachmentData);
      setPhysicalDemand(editingProgram.physicalDemand || 5);
      setIntellectualDemand(editingProgram.intellectualDemand || 5);
      setCreativity(editingProgram.creativity || 5);
      setTeamwork(editingProgram.teamwork || 5);
      setPreparationDemand(editingProgram.preparationDemand || 5);
    } else {
      // Default reset
      setTitle('');
      setSummary('');
      setDescription('');
      setEducationalGoals('');
      setMaterials('');
      setDurationMinutes(60);
      setMinParticipants(6);
      setMaxParticipants(24);
      setAgeCategories(['skauti_skautky']);
      setEventTypes(['schuzka']);
      setScoutMethods(['druzina', 'uceni_zkusenosti', 'priroda']);
      setEnvironment('outside');
      setWeather(['sunny']);
      setTags(['Družinová soudržnost']);
      setAttachmentUrl('');
      setAttachmentName('');
      setAttachmentData(undefined);
      setPhysicalDemand(5);
      setIntellectualDemand(5);
      setCreativity(5);
      setTeamwork(6);
      setPreparationDemand(4);
    }
    setError(null);
  }, [editingProgram, isOpen]);

  if (!isOpen) return null;

  const toggleAgeCategory = (id: AgeCategoryId) => {
    if (ageCategories.includes(id)) {
      if (ageCategories.length > 1) {
        setAgeCategories(ageCategories.filter(c => c !== id));
      }
    } else {
      setAgeCategories([...ageCategories, id]);
    }
  };

  const toggleEventType = (id: ScoutEventType) => {
    if (eventTypes.includes(id)) {
      if (eventTypes.length > 1) {
        setEventTypes(eventTypes.filter(e => e !== id));
      }
    } else {
      setEventTypes([...eventTypes, id]);
    }
  };

  const toggleScoutMethod = (id: ScoutMethodElementId) => {
    if (scoutMethods.includes(id)) {
      setScoutMethods(scoutMethods.filter(m => m !== id));
    } else {
      setScoutMethods([...scoutMethods, id]);
    }
  };

  const toggleWeather = (w: WeatherType) => {
    if (weather.includes(w)) {
      setWeather(weather.filter(x => x !== w));
    } else {
      setWeather([...weather, w]);
    }
  };

  const addTag = (t: string) => {
    const clean = t.trim().replace(/^#/, '');
    if (clean && !tags.includes(clean)) {
      setTags([...tags, clean]);
    }
  };

  const removeTag = (t: string) => {
    setTags(tags.filter(x => x !== t));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('Soubor je příliš velký (max 5 MB). Pro větší soubory prosím vložte odkaz na Google Disk.');
      return;
    }

    setAttachmentName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setAttachmentData(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setError('Pro uložení programu musíte být přihlášeni.');
      return;
    }

    if (!title.trim() || !summary.trim() || !description.trim()) {
      setError('Vyplňte prosím název, anotaci a podrobný popis programu.');
      return;
    }

    if (ageCategories.length === 0) {
      setError('Zvolte alespoň jednu věkovou kategorii.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const payload: any = {
        title: title.trim(),
        summary: summary.trim(),
        description: description.trim(),
        educationalGoals: educationalGoals.trim(),
        materials: materials.trim(),
        durationMinutes: Number(durationMinutes),
        minParticipants: Number(minParticipants) || 1,
        maxParticipants: Number(maxParticipants) || 30,
        ageCategories,
        eventTypes: eventTypes && eventTypes.length > 0 ? eventTypes : ['schuzka'],
        scoutMethods,
        environment,
        weather,
        tags,
        attachmentUrl: attachmentUrl.trim() || '',
        attachmentName: attachmentName.trim() || (attachmentUrl.trim() ? 'Odkaz na dokument' : ''),
        attachmentData: attachmentData || '',
        physicalDemand,
        intellectualDemand,
        creativity,
        teamwork,
        preparationDemand,
        authorId: currentUser.uid,
        authorName: currentUser.displayName || 'Skautský vedoucí',
        authorEmail: currentUser.email || '',
        authorUnit: currentUser.unitName || (editingProgram?.authorUnit || ''),
        authorCenter: currentUser.centerName || (editingProgram?.authorCenter || '')
      };

      if (editingProgram?.id) {
        payload.id = editingProgram.id;
      }

      await onSave(payload);
      onClose();
    } catch (err: any) {
      console.error('Error saving program:', err);
      setError(err?.message || 'Uložení programu se nezdařilo. Zkontrolujte připojení.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-sm flex justify-center items-start p-2 sm:p-4 md:p-6 animate-fadeIn">
      <div className="relative bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50/50 dark:bg-stone-800/50">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-stone-900 dark:text-stone-100">
              {editingProgram ? 'Upravit program' : 'Přidat nový skautský program'}
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Sdílejte ověřenou aktivitu, hru či metodiku s ostatními vedoucími
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mx-6 mt-4 p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 rounded-xl flex items-center gap-2 text-xs text-rose-800 dark:text-rose-200">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* 1. Název & Stručná anotace */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
                Název programu <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="např. Tajemství starého lesníka: Družinový šifrovací orienťák"
                className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-sm font-semibold text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
                Stručná anotace (1-2 věty pro přehledovou kartu) <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={2}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Stručně shrňte podstatu hry či aktivity pro rychlé procházení..."
                className="w-full px-3.5 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs sm:text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* 2. Typ akce (Schůzka, Výprava, Tábor, Vzdělávací akce) */}
          <div className="space-y-2 pt-2 border-t border-stone-100 dark:border-stone-800">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
              Typ akce (kde lze program využít) <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {SCOUT_EVENT_TYPES.map((ev) => {
                const active = eventTypes.includes(ev.id);
                const Icon = ev.id === 'schuzka' ? Home : ev.id === 'vyprava' ? Compass : ev.id === 'tabor' ? Tent : GraduationCap;
                return (
                  <button
                    key={ev.id}
                    type="button"
                    onClick={() => toggleEventType(ev.id)}
                    className={`p-2.5 rounded-xl text-xs font-semibold border text-left transition flex items-center justify-between touch-manipulation active:scale-95 ${
                      active
                        ? `${ev.badgeBg} shadow-xs ring-1 ring-current font-bold`
                        : 'bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <span className="flex items-center gap-1.5 truncate">
                      <Icon className="w-3.5 h-3.5 shrink-0" />
                      <span>{ev.label}</span>
                    </span>
                    {active && <Check className="w-3.5 h-3.5 ml-1 flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Věkové kategorie & Časová dotace */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 border-t border-stone-100 dark:border-stone-800">
            
            {/* Věkové kategorie */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-2">
                Věkové kategorie <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {AGE_CATEGORIES.map((cat) => {
                  const active = ageCategories.includes(cat.id);
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => toggleAgeCategory(cat.id)}
                      className={`p-2.5 rounded-xl text-xs font-semibold border text-left transition flex items-center justify-between ${
                        active
                          ? `${cat.badgeBg} shadow-xs ring-1 ring-current`
                          : 'bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      <span>{cat.badgeText}</span>
                      {active && <Check className="w-3.5 h-3.5 ml-1 flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Časová dotace (po 15 minutách do 240 minut) */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-stone-500" />
                  Časová dotace: <span className="text-emerald-700 dark:text-emerald-400 font-extrabold">{formatDuration(durationMinutes)}</span>
                </label>
              </div>
              <div className="bg-stone-50 dark:bg-stone-800 p-3.5 rounded-xl border border-stone-200 dark:border-stone-700 space-y-2">
                <input
                  type="range"
                  min="15"
                  max="240"
                  step="15"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  className="w-full accent-emerald-600 h-2 bg-stone-200 dark:bg-stone-700 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-stone-400 font-mono">
                  <span>15 min</span>
                  <span>45 m</span>
                  <span>90 m</span>
                  <span>2 h</span>
                  <span>3 h</span>
                  <span>4 h</span>
                </div>
              </div>
            </div>

          </div>

          {/* 3. Skautská výchovná metoda (8 prvků) */}
          <div className="space-y-2 pt-2 border-t border-stone-100 dark:border-stone-800">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-emerald-600" />
              <span>Prvky skautské výchovné metody (vyberte uplatněné prvky)</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {SCOUT_METHOD_ELEMENTS.map((el) => {
                const active = scoutMethods.includes(el.id);
                return (
                  <button
                    key={el.id}
                    type="button"
                    onClick={() => toggleScoutMethod(el.id)}
                    className={`p-2 rounded-xl text-left text-xs border transition ${
                      active
                        ? 'bg-emerald-100/90 text-emerald-950 border-emerald-400 font-bold shadow-xs'
                        : 'bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-emerald-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="truncate">{el.name}</span>
                      {active && <Check className="w-3 h-3 text-emerald-700 ml-1 flex-shrink-0" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Škála náročnosti 1–10 (5 posuvníků) */}
          <div className="space-y-3 pt-2 border-t border-stone-100 dark:border-stone-800">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                Škála náročnosti a zaměření (1 = minimum, 10 = maximum)
              </label>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              
              {/* Fyzická */}
              <div className="bg-stone-50 dark:bg-stone-800 p-3 rounded-xl border border-stone-200 dark:border-stone-700 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-stone-700 dark:text-stone-300 flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5 text-amber-500" /> Fyzická
                  </span>
                  <span className="font-bold text-amber-600">{physicalDemand}/10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={physicalDemand}
                  onChange={(e) => setPhysicalDemand(Number(e.target.value))}
                  className="w-full accent-amber-500 h-1.5 cursor-pointer"
                />
              </div>

              {/* Intelektuální */}
              <div className="bg-stone-50 dark:bg-stone-800 p-3 rounded-xl border border-stone-200 dark:border-stone-700 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-stone-700 dark:text-stone-300 flex items-center gap-1">
                    <Brain className="w-3.5 h-3.5 text-sky-500" /> Intelekt
                  </span>
                  <span className="font-bold text-sky-600">{intellectualDemand}/10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={intellectualDemand}
                  onChange={(e) => setIntellectualDemand(Number(e.target.value))}
                  className="w-full accent-sky-500 h-1.5 cursor-pointer"
                />
              </div>

              {/* Kreativita */}
              <div className="bg-stone-50 dark:bg-stone-800 p-3 rounded-xl border border-stone-200 dark:border-stone-700 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-stone-700 dark:text-stone-300 flex items-center gap-1">
                    <Palette className="w-3.5 h-3.5 text-emerald-500" /> Kreativita
                  </span>
                  <span className="font-bold text-emerald-600">{creativity}/10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={creativity}
                  onChange={(e) => setCreativity(Number(e.target.value))}
                  className="w-full accent-emerald-500 h-1.5 cursor-pointer"
                />
              </div>

              {/* Tým */}
              <div className="bg-stone-50 dark:bg-stone-800 p-3 rounded-xl border border-stone-200 dark:border-stone-700 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-stone-700 dark:text-stone-300 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-purple-500" /> Tým
                  </span>
                  <span className="font-bold text-purple-600">{teamwork}/10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={teamwork}
                  onChange={(e) => setTeamwork(Number(e.target.value))}
                  className="w-full accent-purple-500 h-1.5 cursor-pointer"
                />
              </div>

              {/* Příprava */}
              <div className="bg-stone-50 dark:bg-stone-800 p-3 rounded-xl border border-stone-200 dark:border-stone-700 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-stone-700 dark:text-stone-300 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-rose-500" /> Příprava
                  </span>
                  <span className="font-bold text-rose-600">{preparationDemand}/10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={preparationDemand}
                  onChange={(e) => setPreparationDemand(Number(e.target.value))}
                  className="w-full accent-rose-500 h-1.5 cursor-pointer"
                />
              </div>

            </div>
          </div>

          {/* 5. Prostředí & Počasí */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 border-t border-stone-100 dark:border-stone-800">
            {/* Environment */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-2">
                Prostředí
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'outside', label: 'Venku' },
                  { id: 'inside', label: 'Uvnitř' },
                  { id: 'both', label: 'Obojí / jedno' }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setEnvironment(opt.id as EnvironmentType)}
                    className={`p-2 rounded-xl text-xs font-semibold border transition ${
                      environment === opt.id
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Weather */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-2">
                Vhodné počasí
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {WEATHER_OPTIONS.map((w) => {
                  const active = weather.includes(w.id);
                  return (
                    <button
                      key={w.id}
                      type="button"
                      onClick={() => toggleWeather(w.id)}
                      className={`p-2 rounded-xl text-xs font-semibold border transition text-center ${
                        active
                          ? 'bg-amber-100 dark:bg-amber-950/50 text-amber-900 dark:text-amber-200 border-amber-300 shadow-xs'
                          : 'bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-700'
                      }`}
                    >
                      {w.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 6. Výchovné cíle & Pomůcky */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 border-t border-stone-100 dark:border-stone-800">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
                Výchovné cíle programu
              </label>
              <textarea
                rows={3}
                value={educationalGoals}
                onChange={(e) => setEducationalGoals(e.target.value)}
                placeholder="Co si mají účastníci odnést? Jaké dovednosti, postoje či znalosti se rozvíjí?"
                className="w-full px-3.5 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs sm:text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
                Potřebný materiál a pomůcky
              </label>
              <textarea
                rows={3}
                value={materials}
                onChange={(e) => setMaterials(e.target.value)}
                placeholder="např. buzoly, šátky na oči, lano, fáborky, vytištěné šifry..."
                className="w-full px-3.5 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs sm:text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* 7. Podrobný popis / metodika */}
          <div className="space-y-1.5 pt-2 border-t border-stone-100 dark:border-stone-800">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
              Podrobný popis, pravidla a průběh <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={6}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Podrobně popište fáze programu, pravidla hry, úvodní motivaci, rozdělení do družin a závěrečnou reflexi..."
              className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs sm:text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed font-mono"
            />
          </div>

          {/* 8. Přílohy: Google Dokument / PDF soubor */}
          <div className="p-4 bg-stone-50 dark:bg-stone-800/60 rounded-2xl border border-stone-200 dark:border-stone-700 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>Přílohy (Google Dokument, odkaz nebo nahrání PDF)</span>
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* External URL */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-stone-600 dark:text-stone-400 flex items-center gap-1">
                  <Link className="w-3.5 h-3.5" /> Odkaz na Google Dokument / Disk / Web
                </label>
                <input
                  type="url"
                  value={attachmentUrl}
                  onChange={(e) => setAttachmentUrl(e.target.value)}
                  placeholder="https://docs.google.com/document/d/..."
                  className="w-full px-3 py-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* File upload */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-stone-600 dark:text-stone-400 flex items-center gap-1">
                  <Upload className="w-3.5 h-3.5" /> Nahrát soubor (PDF, metodika)
                </label>
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer px-3 py-2 bg-white dark:bg-stone-900 hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-medium text-stone-700 dark:text-stone-300 transition flex items-center gap-1.5">
                    <span>Vybrat soubor</span>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.txt,image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  {attachmentName && (
                    <span className="text-xs text-stone-500 truncate max-w-[180px]">
                      {attachmentName}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 9. Štítky */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
              Klíčová slova a štítky
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {tags.map((t) => (
                <span
                  key={t}
                  className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs px-2.5 py-1 rounded-lg border border-emerald-300 dark:border-emerald-700 flex items-center gap-1"
                >
                  #{t}
                  <button type="button" onClick={() => removeTag(t)} className="hover:text-rose-600">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (tagInput) {
                      addTag(tagInput);
                      setTagInput('');
                    }
                  }
                }}
                placeholder="Napište štítek a stiskněte Enter..."
                className="flex-1 px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="button"
                onClick={() => {
                  if (tagInput) {
                    addTag(tagInput);
                    setTagInput('');
                  }
                }}
                className="px-3 py-2 bg-stone-200 dark:bg-stone-700 hover:bg-stone-300 text-stone-800 dark:text-stone-200 rounded-xl text-xs font-semibold"
              >
                Přidat
              </button>
            </div>
          </div>

          {/* Submit Footer */}
          <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
            >
              Zrušit
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-md transition"
            >
              {saving ? 'Ukládám program...' : editingProgram ? 'Uložit změny' : 'Publikovat program do databáze'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
