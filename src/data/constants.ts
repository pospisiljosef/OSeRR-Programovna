import { AgeCategory, ScoutMethodElement, WeatherOption, FilterState, ScoutEventOption } from '../types/scout';

export const AGE_CATEGORIES: AgeCategory[] = [
  {
    id: 'benjaminci',
    label: 'Benjamínci',
    ageSpan: '4–6 let',
    color: '#EA580C',
    badgeBg: 'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-950/60 dark:text-orange-300 dark:border-orange-700',
    badgeText: 'Benjamínci (4–6)',
    description: 'Nejmladší skautská kategorie pro předškolní děti (4–6 let). Hry, poznávání světa, pohyb, pohádkový rámec a bezpečné prostředí.'
  },
  {
    id: 'vlcata_svetlousky',
    label: 'Vlčata a světlušky',
    ageSpan: '6–10 let',
    color: '#D97706',
    badgeBg: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-700',
    badgeText: 'Vlčata & světlušky (6–10)',
    description: 'Nejmladší skautská věková kategorie, kde dominuje hra, objevování a pohádkový rámec (Kniha džunglí, Kouzelná lucerna).'
  },
  {
    id: 'skauti_skautky',
    label: 'Skauti a skautky',
    ageSpan: '11–15 let',
    color: '#15803D',
    badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-700',
    badgeText: 'Skauti & skautky (11–15)',
    description: 'Družinový život, samostatnost, tábornictví, první velké výzvy, stezky a skautská praxe.'
  },
  {
    id: 'roveri_rangers',
    label: 'Roveři a rangers',
    ageSpan: '15–24 let',
    color: '#B91C1C',
    badgeBg: 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-700',
    badgeText: 'Roveři & rangers (15–24)',
    description: 'Heslo "Sloužím", velké projekty, putovní výpravy, seberozvoj, diskuse a aktivní zapojení do společnosti.'
  },
  {
    id: 'oldskauti',
    label: 'Oldskauti & dospělí',
    ageSpan: '25+ let',
    color: '#1D4ED8',
    badgeBg: 'bg-sky-100 text-sky-800 border-sky-300 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-700',
    badgeText: 'Oldskauti (25+)',
    description: 'Dospělí činovníci a oldskauti, celoživotní přátelství, podpora oddílů a tradice.'
  }
];

export const SCOUT_METHOD_ELEMENTS: ScoutMethodElement[] = [
  {
    id: 'uceni_zkusenosti',
    name: 'Učení se zkušeností',
    shortDesc: 'Učení praxí, pokusem a omylem, vlastní prožitek (Learning by doing).',
    iconName: 'Compass'
  },
  {
    id: 'osobni_rozvoj',
    name: 'Osobní rozvoj',
    shortDesc: 'Postupný růst podle schopností, stezky, odborky, sebereflexe a výzvy.',
    iconName: 'TrendingUp'
  },
  {
    id: 'symbolicky_ramec',
    name: 'Symbolický rámec',
    shortDesc: 'Příběh, celoroční etapovka, kmenová moudrost, rituály, šátky a skautská symbolika.',
    iconName: 'Sparkles'
  },
  {
    id: 'priroda',
    name: 'Příroda',
    shortDesc: 'Pobyt pod širým nebem, táboření, ochrana přírody a vnímání jejího řádu.',
    iconName: 'Trees'
  },
  {
    id: 'druzina',
    name: 'Družina',
    shortDesc: 'Družinový systém, malá parta s vlastním vedením, rovnocennost a dělba rolí.',
    iconName: 'Users'
  },
  {
    id: 'dospeli_pruvodci',
    name: 'Dospělí průvodci',
    shortDesc: 'Vedoucí a rádci jako inspirující starší kamarádi, nikoli autoritativní dozorci.',
    iconName: 'ShieldCheck'
  },
  {
    id: 'slib_a_zakon',
    name: 'Skautský slib a zákon',
    shortDesc: 'Morální kompas, duchovní rozměr, čestnost, přátelství a pomoc bližním.',
    iconName: 'Scroll'
  },
  {
    id: 'zapojeni_spolecnost',
    name: 'Zapojení do společnosti',
    shortDesc: 'Služba komunitě, dobré skutky, občanská angažovanost a pomoc tam, kde je třeba.',
    iconName: 'HeartHandshake'
  }
];

export const WEATHER_OPTIONS: WeatherOption[] = [
  { id: 'sunny', label: 'Slunečno', icon: 'Sun' },
  { id: 'rain', label: 'Déšť & mokro', icon: 'CloudRain' },
  { id: 'snow', label: 'Sněžení & zima', icon: 'Snowflake' },
  { id: 'heat', label: 'Horko & voda', icon: 'Flame' },
];

export const ENVIRONMENT_OPTIONS = [
  { id: 'all', label: 'Všechna prostředí' },
  { id: 'outside', label: 'Venku (les, louka, tábor)' },
  { id: 'inside', label: 'Uvnitř (klubovna, sál)' },
  { id: 'both', label: 'Venku i uvnitř (univerzální)' },
];

export const DURATION_STEPS = Array.from({ length: 16 }, (_, i) => (i + 1) * 15); // 15, 30, ... 240

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  if (remaining === 0) {
    if (hours === 1) return '1 hodina';
    if (hours >= 2 && hours <= 4) return `${hours} hodiny`;
    return `${hours} hodin`;
  }
  return `${hours} h ${remaining} min`;
}

export const POPULAR_TAGS = [
  'Šifry', 'Uzlování', 'První pomoc', 'Noční hra', 'Závod', 'Reflexe',
  'Táborový oheň', 'Etapová hra', 'Strategie', 'Orientace s buzolou',
  'Přírodověda', 'Kreativní tvoření', 'Komunikace', 'Družinová soudržnost',
  'Přežití v přírodě', 'Diskuse a etika', 'Zahřívací energizer', 'Voda a koupání'
];

export const SCOUT_EVENT_TYPES: ScoutEventOption[] = [
  {
    id: 'schuzka',
    label: 'Skautská schůzka',
    badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-700',
    badgeText: 'Schůzka',
    iconName: 'Home'
  },
  {
    id: 'vyprava',
    label: 'Víkendová výprava',
    badgeBg: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-700',
    badgeText: 'Výprava',
    iconName: 'Compass'
  },
  {
    id: 'tabor',
    label: 'Tábor',
    badgeBg: 'bg-sky-100 text-sky-800 border-sky-300 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-700',
    badgeText: 'Tábor',
    iconName: 'Tent'
  },
  {
    id: 'vzdelavaci_akce',
    label: 'Vzdělávací akce',
    badgeBg: 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-700',
    badgeText: 'Vzdělávací akce',
    iconName: 'GraduationCap'
  }
];

export const INITIAL_FILTER_STATE: FilterState = {
  searchQuery: '',
  ageCategories: [],
  scoutMethods: [],
  minDuration: 15,
  maxDuration: 240,
  environment: 'all',
  weather: [],
  eventTypes: [],
  selectedTags: [],
  minPhysical: 1,
  minIntellectual: 1,
  minCreativity: 1,
  minTeamwork: 1,
  maxPreparation: 10,
  onlyFavorites: false,
  onlyMyPrograms: false,
  sortBy: 'newest'
};

export interface PersonalDevelopmentDimension {
  id: 'spiritual' | 'physical' | 'emotional' | 'mental' | 'knowledge';
  label: string;
  shortDesc: string;
  color: string;
  badgeBg: string;
  badgeText: string;
  borderColor: string;
}

export const PERSONAL_DEVELOPMENT_DIMENSIONS: PersonalDevelopmentDimension[] = [
  {
    id: 'spiritual',
    label: 'Duchovní stránka',
    shortDesc: 'Hledání smyslu, hodnoty, skautský slib a zákon, úcta a transcendence',
    color: '#8B5CF6',
    badgeBg: 'bg-purple-100 dark:bg-purple-950/60',
    badgeText: 'text-purple-800 dark:text-purple-300',
    borderColor: 'border-purple-300 dark:border-purple-700'
  },
  {
    id: 'physical',
    label: 'Fyzická stránka',
    shortDesc: 'Pohybová zdatnost, odolnost, pobyt v přírodě a péče o zdraví',
    color: '#10B981',
    badgeBg: 'bg-emerald-100 dark:bg-emerald-950/60',
    badgeText: 'text-emerald-800 dark:text-emerald-300',
    borderColor: 'border-emerald-300 dark:border-emerald-700'
  },
  {
    id: 'emotional',
    label: 'Emoční stránka',
    shortDesc: 'Sebepoznání, empatie, prožitek, vyjadřování pocitů a vztahy',
    color: '#F43F5E',
    badgeBg: 'bg-rose-100 dark:bg-rose-950/60',
    badgeText: 'text-rose-800 dark:text-rose-300',
    borderColor: 'border-rose-300 dark:border-rose-700'
  },
  {
    id: 'mental',
    label: 'Duševní stránka',
    shortDesc: 'Kritické myšlení, představivost, řešení problémů a intelektuální rozvoj',
    color: '#3B82F6',
    badgeBg: 'bg-blue-100 dark:bg-blue-950/60',
    badgeText: 'text-blue-800 dark:text-blue-300',
    borderColor: 'border-blue-300 dark:border-blue-700'
  },
  {
    id: 'knowledge',
    label: 'Znalostní stránka',
    shortDesc: 'Praktické dovednosti, skautská praxe, řemeslo, tábornictví a vědomosti',
    color: '#F59E0B',
    badgeBg: 'bg-amber-100 dark:bg-amber-950/60',
    badgeText: 'text-amber-800 dark:text-amber-300',
    borderColor: 'border-amber-300 dark:border-amber-700'
  }
];

export const MONTH_NAMES_CZECH = [
  'Září', 'Říjen', 'Listopad', 'Prosinec', 'Leden', 'Únor', 
  'Březen', 'Duben', 'Květen', 'Červen', 'Červenec', 'Srpen'
];

export function formatPlanDuration(months: number): string {
  if (months === 1) return '1 měsíc';
  if (months >= 2 && months <= 4) return `${months} měsíce`;
  if (months === 6) return '6 měsíců (půl roku)';
  if (months === 10) return '10 měsíců (školní rok)';
  if (months === 12) return '12 měsíců (1 rok)';
  if (months === 18) return '18 měsíců (1,5 roku)';
  if (months === 24) return '24 měsíců (2 roky)';
  if (months > 4 && months < 12) return `${months} měsíců`;
  if (months > 12 && months < 24) return `${months} měsíců`;
  return `${months} měsíců`;
}

export const INITIAL_YEARLY_PLAN_FILTER: import('../types/scout').YearlyPlanFilterState = {
  searchQuery: '',
  ageCategories: [],
  scoutMethods: [],
  selectedTags: [],
  minDurationMonths: 1,
  maxDurationMonths: 24,
  minSpiritual: 1,
  minPhysical: 1,
  minEmotional: 1,
  minMental: 1,
  minKnowledge: 1,
  onlyFavorites: false,
  onlyMyPlans: false,
  sortBy: 'newest'
};
