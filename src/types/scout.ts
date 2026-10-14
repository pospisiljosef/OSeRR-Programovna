export type AgeCategoryId = 
  | 'benjaminci'       // 4-6 let
  | 'vlcata_svetlousky' // 6-10 let
  | 'skauti_skautky'    // 11-15 let
  | 'roveri_rangers'    // 15-24 let
  | 'oldskauti';        // dospělí a oldskauti

export interface AgeCategory {
  id: AgeCategoryId;
  label: string;
  ageSpan: string;
  color: string;
  badgeBg: string;
  badgeText: string;
  description: string;
}

export type ScoutMethodElementId =
  | 'uceni_zkusenosti'
  | 'osobni_rozvoj'
  | 'symbolicky_ramec'
  | 'priroda'
  | 'druzina'
  | 'dospeli_pruvodci'
  | 'slib_a_zakon'
  | 'zapojeni_spolecnost';

export interface ScoutMethodElement {
  id: ScoutMethodElementId;
  name: string;
  shortDesc: string;
  iconName: string;
}

export type EnvironmentType = 'inside' | 'outside' | 'both';

export type ScoutEventType = 
  | 'schuzka'          // Skautská schůzka
  | 'vyprava'          // Víkendová výprava
  | 'tabor'            // Tábor
  | 'vzdelavaci_akce'; // Vzdělávací akce

export interface ScoutEventOption {
  id: ScoutEventType;
  label: string;
  badgeBg: string;
  badgeText: string;
  iconName: string;
}

export type WeatherType = 'sunny' | 'rain' | 'snow' | 'heat';

export interface WeatherOption {
  id: WeatherType;
  label: string;
  icon: string;
}

export interface MetricScales {
  physicalDemand: number;     // 1-10: Fyzická zdatnost
  intellectualDemand: number; // 1-10: Intelektuální náročnost
  creativity: number;         // 1-10: Kreativita
  teamwork: number;           // 1-10: Týmová spolupráce
  preparationDemand: number;  // 1-10: Náročnost přípravy
}

export interface ScoutProgram extends MetricScales {
  id: string;
  title: string;
  summary: string;
  description: string;
  educationalGoals: string;
  materials: string;
  durationMinutes: number; // 15 to 240, multiple of 15
  minParticipants?: number;
  maxParticipants?: number;
  ageCategories: AgeCategoryId[];
  scoutMethods: ScoutMethodElementId[];
  environment: EnvironmentType;
  weather: WeatherType[];
  eventTypes?: ScoutEventType[];
  tags: string[];
  attachmentUrl?: string; // Link to Google Doc, PDF, Drive
  attachmentName?: string;
  attachmentData?: string; // Base64 data for directly uploaded file
  attachmentType?: string; // 'pdf' | 'doc' | 'link'
  authorId: string;
  authorName: string;
  authorEmail?: string;
  authorUnit?: string;
  authorCenter?: string;
  createdAt: string; // ISO string
  ratingAverage: number; // 0 to 5
  ratingCount: number;
  favoriteCount: number;
}

export interface ProgramReview {
  id: string;
  programId: string;
  userId: string;
  userName: string;
  userEmail?: string;
  rating: number; // 1 to 5
  comment: string;
  createdAt: string;
}

export interface FilterState {
  searchQuery: string;
  ageCategories: AgeCategoryId[];
  scoutMethods: ScoutMethodElementId[];
  maxDuration: number; // in minutes, up to 240
  minDuration: number;
  environment: EnvironmentType | 'all';
  weather: WeatherType[];
  eventTypes: ScoutEventType[];
  selectedTags: string[];
  minPhysical: number;
  minIntellectual: number;
  minCreativity: number;
  minTeamwork: number;
  maxPreparation: number;
  onlyFavorites: boolean;
  onlyMyPrograms: boolean;
  sortBy: 'newest' | 'rating' | 'duration_asc' | 'duration_desc' | 'popularity';
}

// 5 stránek skautského rozvoje / dimenzí osobnosti (1-10)
export interface PersonalDevelopmentScales {
  spiritual: number;  // 1-10: Duchovní stránka
  physical: number;   // 1-10: Fyzická stránka
  emotional: number;  // 1-10: Emoční stránka
  mental: number;     // 1-10: Duševní stránka
  knowledge: number;  // 1-10: Znalostní stránka
}

// Položka časové osy po měsících (Harmonogram)
export interface MonthlyScheduleItem {
  monthIndex: number;    // 1 až 24
  monthLabel: string;    // např. "1. měsíc (Září)"
  theme: string;         // Téma měsíce / cíl
  description?: string;  // Zaměření, etapa
  means: string[];       // Použité prostředky (např. výprava, oddílová schůzka, stezka)
  programIds: string[];  // ID programů připíchnutých k tomuto měsíci v pořadí provedení
}

export interface YearlyPlan extends PersonalDevelopmentScales {
  id: string;
  title: string;                 // Název celoroční činnosti
  motto?: string;                // Skautské motto / podtitul
  summary: string;              // Krátký přehled
  educationalGoals: string;     // POVINNÉ: Výchovné cíle
  vision: string;               // POVINNÉ: Vize celoroční činnosti
  durationMonths: number;       // Trvání: 1 až 24 měsíců (měsíc až 2 roky)
  ageCategories: AgeCategoryId[]; // Věkové kategorie
  scoutMethods: ScoutMethodElementId[]; // Prvky skautské výchovné metody
  means: string[];              // Jednotlivé prostředky (etapová hra, stezky, výpravy...)
  tags: string[];               // Klíčová slova
  pinnedProgramIds: string[];   // Připíchnuté programy z databáze programů
  monthlySchedule: MonthlyScheduleItem[]; // Časová osa po měsících s pořadím programů
  authorId: string;
  authorName: string;
  authorEmail?: string;
  authorUnit?: string;
  authorCenter?: string;
  createdAt: string;            // ISO datum
  ratingAverage?: number;
  ratingCount?: number;
  favoriteCount?: number;
}

export interface YearlyPlanFilterState {
  searchQuery: string;
  ageCategories: AgeCategoryId[];
  scoutMethods: ScoutMethodElementId[];
  selectedTags: string[];
  minDurationMonths: number; // 1 až 24
  maxDurationMonths: number; // 1 až 24
  // Filtry 1-10 pro jednotlivé stránky rozvoje
  minSpiritual: number;
  minPhysical: number;
  minEmotional: number;
  minMental: number;
  minKnowledge: number;
  onlyFavorites: boolean;
  onlyMyPlans: boolean;
  sortBy: 'newest' | 'duration_asc' | 'duration_desc' | 'rating';
}
