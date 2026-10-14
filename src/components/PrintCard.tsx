import React, { useState, useMemo, useEffect } from 'react';
import { ScoutProgram, YearlyPlan } from '../types/scout';
import { 
  AGE_CATEGORIES, 
  SCOUT_METHOD_ELEMENTS, 
  SCOUT_EVENT_TYPES, 
  PERSONAL_DEVELOPMENT_DIMENSIONS,
  MONTH_NAMES_CZECH,
  formatDuration,
  formatPlanDuration
} from '../data/constants';
import { JunakOfficialLogo } from './JunakLogo';
import { 
  X, 
  Printer, 
  Clock, 
  Users, 
  Target, 
  Package, 
  CheckSquare, 
  Compass, 
  Calendar,
  Sparkles,
  ShieldAlert,
  Lightbulb,
  FileText,
  Sliders,
  Pin,
  Check,
  AlertCircle
} from 'lucide-react';

interface PrintCardProps {
  program?: ScoutProgram | null;
  plan?: YearlyPlan | null;
  allPrograms?: ScoutProgram[];
  onClose: () => void;
}

// Helper to parse materials into individual checklist items
function parseMaterialsList(raw: string): string[] {
  if (!raw || !raw.trim()) return [];
  const lines = raw.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const items: string[] = [];

  for (const line of lines) {
    const cleanLine = line.replace(/^[-*•\d.)\[\]\s]+/, '').trim();
    if (!cleanLine) continue;

    if ((cleanLine.includes(',') || cleanLine.includes(';')) && !cleanLine.toLowerCase().includes('např.')) {
      const parts = cleanLine.split(/[,;]/).map(p => p.trim()).filter(Boolean);
      items.push(...parts);
    } else {
      items.push(cleanLine);
    }
  }

  return items;
}

// Helper to parse educational goals into structured bullet points
function parseGoalsList(raw: string): string[] {
  if (!raw || !raw.trim()) return [];
  const lines = raw.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const goals: string[] = [];

  for (const line of lines) {
    const cleanLine = line.replace(/^[-*•\d.)\s]+/, '').trim();
    if (!cleanLine) continue;

    if (cleanLine.includes(';') && cleanLine.length > 25) {
      const parts = cleanLine.split(';').map(p => p.trim()).filter(Boolean);
      goals.push(...parts);
    } else {
      goals.push(cleanLine);
    }
  }

  return goals;
}

interface ParsedPhase {
  title?: string;
  badge?: string;
  type: 'phase' | 'tip' | 'safety' | 'normal';
  paragraphs: string[];
}

// Helper to parse program description into organized methodology phases
function parseDescriptionPhases(raw: string): ParsedPhase[] {
  if (!raw || !raw.trim()) return [];

  const lines = raw.split(/\r?\n/);
  const phases: ParsedPhase[] = [];
  let currentPhase: ParsedPhase = {
    type: 'normal',
    paragraphs: []
  };

  const headerRegex = /^(?:(?:\d+[.)]\s*)|(?:[#*]{1,3}\s*))?(Příprava(?: na hru)?|Motivace(?: a uvedení)?|Úvod|Pravidla(?: hry)?|Průběh(?: hry| programu)?|Hlavní část|Reflexe|Závěr|Vyhodnocení|Bezpečnost(?:ní pokyny)?|Tipy(?: pro vedoucího)?|Variace(?: a modifikace)?|Doporučení):?\s*(.*)$/i;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    const match = line.match(headerRegex);
    if (match) {
      if (currentPhase.paragraphs.length > 0 || currentPhase.title) {
        phases.push(currentPhase);
      }

      const rawTitle = match[1];
      const remainder = match[2];
      const titleLower = rawTitle.toLowerCase();

      let phaseType: 'phase' | 'tip' | 'safety' | 'normal' = 'phase';
      let badge = 'Krok';

      if (titleLower.includes('příprava')) {
        badge = 'Příprava';
      } else if (titleLower.includes('motivace') || titleLower.includes('úvod')) {
        badge = 'Úvod';
      } else if (titleLower.includes('pravidla') || titleLower.includes('průběh') || titleLower.includes('hlavní')) {
        badge = 'Průběh';
      } else if (titleLower.includes('reflexe') || titleLower.includes('závěr') || titleLower.includes('vyhodnocení')) {
        badge = 'Reflexe';
      } else if (titleLower.includes('bezpečnost')) {
        phaseType = 'safety';
        badge = 'Bezpečnost';
      } else if (titleLower.includes('tip') || titleLower.includes('variace') || titleLower.includes('doporučení')) {
        phaseType = 'tip';
        badge = 'Tip';
      }

      currentPhase = {
        title: rawTitle,
        badge,
        type: phaseType,
        paragraphs: remainder ? [remainder] : []
      };
    } else {
      currentPhase.paragraphs.push(line);
    }
  }

  if (currentPhase.paragraphs.length > 0 || currentPhase.title) {
    phases.push(currentPhase);
  }

  return phases;
}

export const PrintCard: React.FC<PrintCardProps> = ({ 
  program, 
  plan, 
  allPrograms = [], 
  onClose 
}) => {
  const [compactMode, setCompactMode] = useState(false);
  const [checklistFormat, setChecklistFormat] = useState(true);
  const [printStatus, setPrintStatus] = useState<string | null>(null);

  // Keyboard shortcut: Esc to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Program helpers
  const materials = useMemo(() => program ? parseMaterialsList(program.materials) : [], [program]);
  const goals = useMemo(() => program ? parseGoalsList(program.educationalGoals) : [], [program]);
  const phases = useMemo(() => program ? parseDescriptionPhases(program.description) : [], [program]);

  // Plan helpers
  const planGoals = useMemo(() => plan ? parseGoalsList(plan.educationalGoals) : [], [plan]);

  if (!program && !plan) return null;

  const isProgram = !!program;

  const handlePrint = () => {
    try {
      setPrintStatus('Otevírám dialog tisku...');
      setTimeout(() => setPrintStatus(null), 3000);
      window.print();
    } catch (err) {
      console.warn('Browser print dialog invocation error:', err);
      setPrintStatus('Použijte klávesovou zkratku Ctrl+P pro přímý tisk stránky.');
    }
  };

  const weatherIcons: Record<string, string> = {
    sunny: 'Slunečno',
    rain: 'Déšť & mokro',
    snow: 'Sníh & zima',
    heat: 'Horko / k vodě'
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-stone-950/85 backdrop-blur-md flex justify-center items-start p-2 sm:p-4 md:p-6 print:p-0 print:bg-white print:static animate-fadeIn">
      
      {/* Container styled as exact A4 preview */}
      <div className={`relative bg-white text-stone-900 rounded-3xl w-full max-w-[210mm] shadow-2xl p-5 sm:p-8 md:p-10 my-2 sm:my-4 print:shadow-none print:m-0 print:p-0 print:w-full print:max-w-none transition-all ${
        compactMode ? 'text-[11px]' : 'text-xs'
      }`}>
        
        {/* Screen Action Bar (hidden when printing) */}
        <div className="flex flex-wrap justify-between items-center gap-3 mb-6 pb-4 border-b border-stone-200 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1.5">
              <Printer className="w-3.5 h-3.5 text-emerald-600" />
              <span>Rozložení tisku • Formát A4</span>
            </span>
            <span className="text-xs text-stone-500 hidden md:inline">
              {isProgram ? 'Karta skautského programu' : 'Karta celoročního plánu oddílu'}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Toggle Compact Mode for 1-Page fit */}
            <button
              type="button"
              onClick={() => setCompactMode(!compactMode)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border transition ${
                compactMode 
                  ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-xs' 
                  : 'bg-stone-100 text-stone-700 border-stone-200 hover:bg-stone-200'
              }`}
              title="Kompaktní režim zmenší mezery pro optimální vejití na 1 stranu A4"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{compactMode ? 'Kompaktní (1 strana)' : 'Standardní A4'}</span>
            </button>

            {/* If Program: Toggle Checklist vs Text */}
            {isProgram && (
              <button
                type="button"
                onClick={() => setChecklistFormat(!checklistFormat)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-stone-100 text-stone-700 border border-stone-200 hover:bg-stone-200 transition"
                title="Přepnout zobrazení pomůcek na odškrtávací seznam pro balení"
              >
                <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
                <span>{checklistFormat ? 'Políčka [ ]' : 'Text'}</span>
              </button>
            )}

            {/* Print button */}
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Vytisknout (Ctrl+P)</span>
            </button>

            {/* Close */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-700 rounded-xl hover:bg-stone-100 transition"
              title="Zavřít rozložení tisku (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {printStatus && (
          <div className="mb-4 p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2 print:hidden">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{printStatus}</span>
          </div>
        )}

        {/* ========================================================
            PRINTABLE CONTENT (A4 OPTIMIZED)
           ======================================================== */}
        <div id="printable-a4-document" className="printable-document space-y-4 print:space-y-3">
          
          {/* ==========================================
              A) PROGRAM PRINTABLE LAYOUT
             ========================================== */}
          {program && (
            <>
              {/* Header */}
              <div className="flex items-start justify-between border-b-2 border-stone-900 pb-3 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 shrink-0">
                    <JunakOfficialLogo className="w-12 h-12" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] font-black uppercase tracking-widest text-emerald-900">
                        Junák – český skaut • Skautská programovna
                      </span>
                      <span className="text-stone-300">•</span>
                      <span className="text-[10px] font-bold text-stone-500">
                        Metodická karta programu
                      </span>
                    </div>
                    <h1 className="text-xl sm:text-2xl font-black text-stone-950 leading-tight tracking-tight">
                      {program.title}
                    </h1>
                    {program.summary && (
                      <p className="text-[11px] sm:text-xs text-stone-600 font-medium italic mt-0.5 line-clamp-2">
                        {program.summary}
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0 bg-stone-50 print:bg-transparent p-2.5 rounded-xl border border-stone-200 print:border-none min-w-[130px]">
                  <div className="flex items-center justify-end gap-1 text-xs font-black text-stone-900">
                    <Clock className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{formatDuration(program.durationMinutes)}</span>
                  </div>
                  <div className="text-[11px] font-semibold text-stone-700 mt-0.5">
                    {program.environment === 'outside' ? '🌲 Venku v přírodě' : program.environment === 'inside' ? '🏠 Uvnitř klubovny' : '🌲/🏠 Venku i uvnitř'}
                  </div>
                  <div className="text-[10px] text-stone-500 mt-0.5">
                    {program.minParticipants 
                      ? program.maxParticipants 
                        ? `${program.minParticipants}–${program.maxParticipants} hráčů`
                        : `od ${program.minParticipants} hráčů`
                      : 'Libovolný počet hráčů'}
                  </div>
                </div>
              </div>

              {/* Metadata Ribbon */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 py-2 px-3 bg-stone-50 rounded-xl border border-stone-200 text-[11px] print:bg-stone-50">
                <div>
                  <span className="text-stone-500 block text-[10px] font-semibold uppercase tracking-wider">
                    Věková kategorie:
                  </span>
                  <strong className="text-stone-950 font-bold">
                    {program.ageCategories.map(c => AGE_CATEGORIES.find(x => x.id === c)?.label).filter(Boolean).join(', ')}
                  </strong>
                </div>

                <div>
                  <span className="text-stone-500 block text-[10px] font-semibold uppercase tracking-wider">
                    Typ akce:
                  </span>
                  <strong className="text-stone-950 font-bold">
                    {program.eventTypes && program.eventTypes.length > 0 
                      ? program.eventTypes.map(e => SCOUT_EVENT_TYPES.find(x => x.id === e)?.label).filter(Boolean).join(', ')
                      : 'Schůzka / Výprava'}
                  </strong>
                </div>

                <div>
                  <span className="text-stone-500 block text-[10px] font-semibold uppercase tracking-wider">
                    Počasí & podmínky:
                  </span>
                  <span className="text-stone-950 font-semibold">
                    {program.weather && program.weather.length > 0 
                      ? program.weather.map(w => weatherIcons[w] || w).join(', ')
                      : 'Nezávislé na počasí'}
                  </span>
                </div>

                <div>
                  <span className="text-stone-500 block text-[10px] font-semibold uppercase tracking-wider">
                    Autor & oddíl:
                  </span>
                  <strong className="text-stone-950 font-bold block truncate">
                    {program.authorName}
                  </strong>
                  {(program.authorUnit || program.authorCenter) && (
                    <span className="text-[10px] text-emerald-800 font-semibold block truncate">
                      {[program.authorUnit, program.authorCenter].filter(Boolean).join(' • ')}
                    </span>
                  )}
                </div>
              </div>

              {/* Výchovné cíle */}
              <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200 print:bg-emerald-50/30 break-inside-avoid">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Target className="w-3.5 h-3.5 text-emerald-700" />
                  <h3 className="text-[11px] font-black uppercase tracking-wider text-emerald-950">
                    Výchovné cíle programu (Co si mají účastníci odnést):
                  </h3>
                </div>
                {goals.length > 0 ? (
                  <ul className="space-y-1 text-stone-800">
                    {goals.map((goal, idx) => (
                      <li key={idx} className="flex items-start gap-2 leading-relaxed">
                        <span className="text-emerald-700 font-bold mt-0.5 text-xs">•</span>
                        <span>{goal}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-stone-600 italic">
                    {program.educationalGoals || 'Výchovné cíle nebyly autorem detailně specifikovány.'}
                  </p>
                )}
              </div>

              {/* Seznam pomůcek (Checklist) */}
              <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200 print:bg-amber-50/30 break-inside-avoid">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5 text-amber-800" />
                    <h3 className="text-[11px] font-black uppercase tracking-wider text-amber-950">
                      Potřebný materiál a pomůcky:
                    </h3>
                  </div>
                  <span className="text-[10px] font-semibold text-amber-800 print:text-amber-900">
                    {materials.length > 0 ? `${materials.length} položek k nachystání` : 'Běžné vybavení'}
                  </span>
                </div>

                {materials.length > 0 ? (
                  checklistFormat ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-stone-800">
                      {materials.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 py-0.5">
                          <span className="w-3.5 h-3.5 rounded border border-stone-500 bg-white print:border-black shrink-0 inline-block" />
                          <span className="font-medium leading-snug">{item}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="leading-relaxed text-stone-800">
                      {materials.join(' • ')}
                    </p>
                  )
                ) : (
                  <p className="text-stone-600 italic">
                    Žádné speciální pomůcky nejsou potřeba (pouze běžné skautské vybavení: šátek, tužka, zápisník).
                  </p>
                )}
              </div>

              {/* Průběh a metodika */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between border-b-2 border-stone-800 pb-1.5">
                  <div className="flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-stone-800" />
                    <h3 className="text-xs font-black uppercase tracking-wider text-stone-950">
                      Průběh programu, pravidla & metodika:
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold text-stone-500">
                    Doporučený metodický postup
                  </span>
                </div>

                {phases.length > 0 ? (
                  <div className="space-y-3">
                    {phases.map((phase, pIdx) => {
                      if (phase.type === 'safety') {
                        return (
                          <div key={pIdx} className="p-2.5 bg-rose-50 rounded-xl border border-rose-300 print:border-stone-400 break-inside-avoid">
                            <div className="flex items-center gap-1.5 text-rose-900 font-black text-[11px] mb-1">
                              <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                              <span>{phase.title || 'Bezpečnostní upozornění'}</span>
                            </div>
                            {phase.paragraphs.map((para, paraIdx) => (
                              <p key={paraIdx} className="text-stone-800 leading-relaxed text-[11px]">
                                {para}
                              </p>
                            ))}
                          </div>
                        );
                      }

                      if (phase.type === 'tip') {
                        return (
                          <div key={pIdx} className="p-2.5 bg-sky-50 rounded-xl border border-sky-300 print:border-stone-400 break-inside-avoid">
                            <div className="flex items-center gap-1.5 text-sky-950 font-black text-[11px] mb-1">
                              <Lightbulb className="w-3.5 h-3.5 text-sky-600" />
                              <span>{phase.title || 'Tip a variace pro rádce'}</span>
                            </div>
                            {phase.paragraphs.map((para, paraIdx) => (
                              <p key={paraIdx} className="text-stone-800 leading-relaxed text-[11px]">
                                {para}
                              </p>
                            ))}
                          </div>
                        );
                      }

                      return (
                        <div key={pIdx} className="break-inside-avoid space-y-1">
                          {phase.title && (
                            <div className="flex items-center gap-2 mb-1">
                              <span className="px-2 py-0.5 rounded font-black text-[10px] bg-stone-200 text-stone-800 print:bg-stone-300">
                                {phase.badge || `${pIdx + 1}. Krok`}
                              </span>
                              <h4 className="font-bold text-stone-900 text-xs">
                                {phase.title}
                              </h4>
                            </div>
                          )}
                          {phase.paragraphs.map((para, paraIdx) => {
                            const isBullet = para.startsWith('- ') || para.startsWith('* ') || para.startsWith('• ');
                            if (isBullet) {
                              return (
                                <div key={paraIdx} className="flex items-start gap-2 pl-2 text-stone-800 leading-relaxed">
                                  <span className="text-stone-400 font-bold">•</span>
                                  <span>{para.replace(/^[-*•]\s*/, '')}</span>
                                </div>
                              );
                            }
                            return (
                              <p key={paraIdx} className="text-stone-850 leading-relaxed whitespace-pre-line text-stone-800">
                                {para}
                              </p>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-xs leading-relaxed whitespace-pre-line text-stone-800 font-sans">
                    {program.description}
                  </div>
                )}
              </div>

              {/* Skautská metoda */}
              {program.scoutMethods && program.scoutMethods.length > 0 && (
                <div className="pt-2 border-t border-stone-200 break-inside-avoid">
                  <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                    Uplatněné prvky skautské výchovné metody:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {program.scoutMethods.map((mId) => {
                      const m = SCOUT_METHOD_ELEMENTS.find(x => x.id === mId);
                      if (!m) return null;
                      return (
                        <span 
                          key={mId}
                          className="px-2 py-0.5 bg-stone-100 rounded-md text-[10px] font-semibold text-stone-800 border border-stone-300 print:border-stone-400"
                        >
                          {m.name}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Škála náročnosti */}
              <div className="pt-2 border-t border-stone-200 text-[10px] grid grid-cols-5 gap-2 text-center break-inside-avoid">
                <div className="p-1.5 bg-stone-50 rounded-lg border border-stone-200 print:bg-white print:border-stone-400">
                  <div className="text-stone-500 text-[9px] uppercase font-bold">Fyzická</div>
                  <strong className="text-stone-900 text-xs font-black">{program.physicalDemand}/10</strong>
                </div>
                <div className="p-1.5 bg-stone-50 rounded-lg border border-stone-200 print:bg-white print:border-stone-400">
                  <div className="text-stone-500 text-[9px] uppercase font-bold">Intelekt</div>
                  <strong className="text-stone-900 text-xs font-black">{program.intellectualDemand}/10</strong>
                </div>
                <div className="p-1.5 bg-stone-50 rounded-lg border border-stone-200 print:bg-white print:border-stone-400">
                  <div className="text-stone-500 text-[9px] uppercase font-bold">Kreativita</div>
                  <strong className="text-stone-900 text-xs font-black">{program.creativity}/10</strong>
                </div>
                <div className="p-1.5 bg-stone-50 rounded-lg border border-stone-200 print:bg-white print:border-stone-400">
                  <div className="text-stone-500 text-[9px] uppercase font-bold">Tým</div>
                  <strong className="text-stone-900 text-xs font-black">{program.teamwork}/10</strong>
                </div>
                <div className="p-1.5 bg-stone-50 rounded-lg border border-stone-200 print:bg-white print:border-stone-400">
                  <div className="text-stone-500 text-[9px] uppercase font-bold">Příprava</div>
                  <strong className="text-stone-900 text-xs font-black">{program.preparationDemand}/10</strong>
                </div>
              </div>
            </>
          )}

          {/* ==========================================
              B) YEARLY PLAN PRINTABLE LAYOUT
             ========================================== */}
          {plan && (
            <>
              {/* Header */}
              <div className="flex items-start justify-between border-b-2 border-stone-900 pb-3 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 shrink-0">
                    <JunakOfficialLogo className="w-12 h-12" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] font-black uppercase tracking-widest text-emerald-900">
                        Junák – český skaut • Celoroční plán & činnost
                      </span>
                      <span className="text-stone-300">•</span>
                      <span className="text-[10px] font-bold text-stone-500">
                        Výchovný plán oddílu
                      </span>
                    </div>
                    <h1 className="text-xl sm:text-2xl font-black text-stone-950 leading-tight tracking-tight">
                      {plan.title}
                    </h1>
                    {plan.motto && (
                      <p className="text-xs text-amber-800 font-serif italic mt-0.5">
                        „{plan.motto}“
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0 bg-stone-50 print:bg-transparent p-2.5 rounded-xl border border-stone-200 print:border-none min-w-[130px]">
                  <div className="flex items-center justify-end gap-1 text-xs font-black text-stone-900">
                    <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{formatPlanDuration(plan.durationMonths)}</span>
                  </div>
                  <div className="text-[10px] text-stone-500 mt-0.5">
                    {plan.monthlySchedule?.length || plan.durationMonths} měsíčních etap
                  </div>
                </div>
              </div>

              {/* Metadata Ribbon */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 py-2 px-3 bg-stone-50 rounded-xl border border-stone-200 text-[11px] print:bg-stone-50">
                <div>
                  <span className="text-stone-500 block text-[10px] font-semibold uppercase tracking-wider">
                    Věková kategorie:
                  </span>
                  <strong className="text-stone-950 font-bold">
                    {plan.ageCategories?.map(c => AGE_CATEGORIES.find(x => x.id === c)?.label).filter(Boolean).join(', ')}
                  </strong>
                </div>

                <div>
                  <span className="text-stone-500 block text-[10px] font-semibold uppercase tracking-wider">
                    Délka cyklu:
                  </span>
                  <strong className="text-stone-950 font-bold">
                    {formatPlanDuration(plan.durationMonths)}
                  </strong>
                </div>

                <div>
                  <span className="text-stone-500 block text-[10px] font-semibold uppercase tracking-wider">
                    Připnuté programy:
                  </span>
                  <span className="text-stone-950 font-bold">
                    {plan.pinnedProgramIds?.length || 0} aktivit v databázi
                  </span>
                </div>

                <div>
                  <span className="text-stone-500 block text-[10px] font-semibold uppercase tracking-wider">
                    Autor & oddíl:
                  </span>
                  <strong className="text-stone-950 font-bold block truncate">
                    {plan.authorName}
                  </strong>
                  {(plan.authorUnit || plan.authorCenter) && (
                    <span className="text-[10px] text-emerald-800 font-semibold block truncate">
                      {[plan.authorUnit, plan.authorCenter].filter(Boolean).join(' • ')}
                    </span>
                  )}
                </div>
              </div>

              {/* Summary / Úvodní vize */}
              {plan.summary && (
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs leading-relaxed text-stone-800 break-inside-avoid">
                  <span className="font-bold text-stone-900 block mb-0.5 text-[11px] uppercase tracking-wider">
                    Anotace a záměr celoroční činnosti:
                  </span>
                  <p>{plan.summary}</p>
                </div>
              )}

              {/* Vize a Výchovné cíle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 break-inside-avoid">
                <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200 print:bg-emerald-50/30">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                    <h3 className="text-[11px] font-black uppercase tracking-wider text-emerald-950">
                      Celoroční vize oddílu:
                    </h3>
                  </div>
                  <p className="text-stone-800 leading-relaxed text-xs">
                    {plan.vision}
                  </p>
                </div>

                <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200 print:bg-amber-50/30">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Target className="w-3.5 h-3.5 text-amber-800" />
                    <h3 className="text-[11px] font-black uppercase tracking-wider text-amber-950">
                      Hlavní výchovné cíle:
                    </h3>
                  </div>
                  {planGoals.length > 0 ? (
                    <ul className="space-y-1 text-stone-800 text-xs">
                      {planGoals.map((g, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-amber-700 font-bold">•</span>
                          <span>{g}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-stone-800 leading-relaxed text-xs">
                      {plan.educationalGoals}
                    </p>
                  )}
                </div>
              </div>

              {/* 5 Stránek rozvoje */}
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 break-inside-avoid">
                <span className="text-[10px] font-black uppercase tracking-wider text-stone-700 block mb-2">
                  5 stránek skautského rozvoje (vyváženost 1–10):
                </span>
                <div className="grid grid-cols-5 gap-2 text-center text-[10px]">
                  {PERSONAL_DEVELOPMENT_DIMENSIONS.map((dim) => {
                    const val = (plan as any)[dim.id] || 5;
                    return (
                      <div key={dim.id} className="p-1.5 bg-white rounded-lg border border-stone-200">
                        <div className="text-stone-500 text-[9px] font-bold uppercase truncate" title={dim.label}>
                          {dim.label.split(' ')[0]}
                        </div>
                        <strong className="text-stone-900 text-xs font-black">{val}/10</strong>
                        <div className="w-full bg-stone-100 h-1 rounded-full mt-1 overflow-hidden">
                          <div 
                            className="h-full rounded-full" 
                            style={{ width: `${val * 10}%`, backgroundColor: dim.color }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Měsíční harmonogram činností */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between border-b-2 border-stone-800 pb-1.5">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-stone-800" />
                    <h3 className="text-xs font-black uppercase tracking-wider text-stone-950">
                      Harmonogram etap a témat po měsících:
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold text-stone-500">
                    Časová osa ročníku
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {plan.monthlySchedule?.map((m) => {
                    const monthName = MONTH_NAMES_CZECH[(m.monthIndex - 1) % MONTH_NAMES_CZECH.length];
                    const monthProgs = m.programIds
                      .map(id => allPrograms.find(p => p.id === id))
                      .filter(Boolean) as ScoutProgram[];

                    return (
                      <div key={m.monthIndex} className="p-2.5 bg-stone-50 rounded-xl border border-stone-200 break-inside-avoid text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded font-black text-[10px] bg-emerald-700 text-white">
                            {m.monthIndex}. měsíc ({monthName})
                          </span>
                          {monthProgs.length > 0 && (
                            <span className="text-[10px] font-bold text-emerald-800">
                              {monthProgs.length} {monthProgs.length === 1 ? 'program' : 'programy'}
                            </span>
                          )}
                        </div>
                        <h4 className="font-bold text-stone-900 text-xs pt-0.5">
                          {m.theme}
                        </h4>
                        {m.description && (
                          <p className="text-[11px] text-stone-600 leading-relaxed">
                            {m.description}
                          </p>
                        )}
                        {monthProgs.length > 0 && (
                          <div className="pt-1 border-t border-stone-200 mt-1">
                            <span className="text-[9px] font-bold uppercase text-stone-400 block mb-0.5">
                              Zařazené programy:
                            </span>
                            <div className="space-y-0.5">
                              {monthProgs.map(p => (
                                <div key={p.id} className="text-[10px] font-medium text-stone-800 flex items-center justify-between">
                                  <span>• {p.title}</span>
                                  <span className="text-stone-500">{formatDuration(p.durationMinutes)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Skautská metoda */}
              {plan.scoutMethods && plan.scoutMethods.length > 0 && (
                <div className="pt-2 border-t border-stone-200 break-inside-avoid">
                  <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                    Uplatněné prvky skautské výchovné metody:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {plan.scoutMethods.map((mId) => {
                      const m = SCOUT_METHOD_ELEMENTS.find(x => x.id === mId);
                      if (!m) return null;
                      return (
                        <span 
                          key={mId}
                          className="px-2 py-0.5 bg-stone-100 rounded-md text-[10px] font-semibold text-stone-800 border border-stone-300 print:border-stone-400"
                        >
                          {m.name}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Footer Note */}
          <div className="text-[9px] text-stone-500 flex items-center justify-between pt-2 border-t border-stone-200 break-inside-avoid">
            <span>Vytištěno ze Skautské Programovny • Junák – český skaut</span>
            <span>{isProgram ? `ID programu: #${program?.id}` : `ID plánu: #${plan?.id}`} • Výchova ke cti a službě</span>
          </div>

        </div>

      </div>

      {/* Global CSS for printing optimization */}
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 10mm 12mm 10mm 12mm;
          }
          body {
            background-color: #ffffff !important;
            color: #000000 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body * {
            visibility: hidden;
          }
          #printable-a4-document,
          #printable-a4-document * {
            visibility: visible;
          }
          #printable-a4-document {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            border: none !important;
          }
          .printable-document {
            font-size: ${compactMode ? '10px' : '11px'} !important;
            line-height: 1.35 !important;
          }
          .break-inside-avoid {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }
        }
      `}</style>
    </div>
  );
};
