import React, { useState } from 'react';
import { MonthlyScheduleItem, ScoutProgram } from '../types/scout';
import { Calendar, Compass, ArrowRight, ChevronRight, CheckCircle2, Clock, BookOpen, Layers } from 'lucide-react';

interface YearlyPlanTimelineProps {
  schedule: MonthlyScheduleItem[];
  allPrograms: ScoutProgram[];
  onOpenProgram?: (program: ScoutProgram) => void;
  interactive?: boolean;
}

export const YearlyPlanTimeline: React.FC<YearlyPlanTimelineProps> = ({
  schedule,
  allPrograms,
  onOpenProgram,
  interactive = true
}) => {
  const [selectedMonthIndex, setSelectedMonthIndex] = useState<number>(1);

  if (!schedule || schedule.length === 0) {
    return (
      <div className="p-6 text-center text-stone-500 bg-stone-50 dark:bg-stone-900/50 rounded-2xl border border-dashed border-stone-200 dark:border-stone-800">
        <Calendar className="w-8 h-8 text-stone-400 mx-auto mb-2" />
        <p className="font-semibold text-sm">Zatím nebyl vytvořen měsíční harmonogram.</p>
      </div>
    );
  }

  const selectedMonth = schedule.find(m => m.monthIndex === selectedMonthIndex) || schedule[0];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-stone-800 dark:text-stone-200 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-emerald-600" />
          <span>Časová osa po měsících (Harmonogram {schedule.length} měsíců)</span>
        </h4>
        <span className="text-xs text-stone-500 dark:text-stone-400">
          Kliknutím vyberte měsíc a prozkoumejte pořadí programů
        </span>
      </div>

      {/* Horizontal Month Selector Strip */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
        {schedule.map((item) => {
          const isSelected = item.monthIndex === selectedMonth.monthIndex;
          const hasPrograms = item.programIds && item.programIds.length > 0;
          return (
            <button
              key={item.monthIndex}
              type="button"
              onClick={() => setSelectedMonthIndex(item.monthIndex)}
              className={`px-3 py-2 rounded-xl text-xs font-bold shrink-0 transition flex flex-col items-center gap-0.5 border ${
                isSelected
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                  : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-emerald-300 hover:bg-stone-50 dark:hover:bg-stone-750'
              }`}
            >
              <span>{item.monthLabel.split(' ')[0]}</span>
              <span className={`text-[10px] font-normal truncate max-w-[80px] ${isSelected ? 'text-emerald-100' : 'text-stone-400'}`}>
                {item.monthLabel.includes('(') ? item.monthLabel.split('(')[1].replace(')', '') : `Měsíc ${item.monthIndex}`}
              </span>
              {hasPrograms && (
                <span className={`w-1.5 h-1.5 rounded-full mt-0.5 ${isSelected ? 'bg-amber-300' : 'bg-emerald-500'}`} />
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Month Detail Card */}
      <div className="bg-stone-50/90 dark:bg-stone-850 p-4 sm:p-5 rounded-2xl border border-stone-200 dark:border-stone-750 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-200 dark:border-stone-700">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              {selectedMonth.monthLabel}
            </span>
            <h5 className="text-base sm:text-lg font-black text-stone-900 dark:text-stone-100">
              {selectedMonth.theme || 'Téma měsíce nestanoveno'}
            </h5>
          </div>
          {selectedMonth.programIds && selectedMonth.programIds.length > 0 && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 self-start sm:self-auto">
              {selectedMonth.programIds.length} {selectedMonth.programIds.length === 1 ? 'program v pořadí' : 'programy v pořadí'}
            </span>
          )}
        </div>

        {selectedMonth.description && (
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
            {selectedMonth.description}
          </p>
        )}

        {/* Means for this month */}
        {selectedMonth.means && selectedMonth.means.length > 0 && (
          <div>
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-1.5">
              Prostředky a formy činnosti v tomto měsíci:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {selectedMonth.means.map((m, idx) => (
                <span
                  key={idx}
                  className="bg-stone-200/80 dark:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs px-2.5 py-1 rounded-lg font-medium"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Programs in Order for this month */}
        <div>
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-2">
            Programy z databáze a jejich pořadí v tomto měsíci:
          </span>

          {(!selectedMonth.programIds || selectedMonth.programIds.length === 0) ? (
            <div className="p-4 rounded-xl bg-white dark:bg-stone-800 text-stone-400 text-xs text-center border border-dashed border-stone-200 dark:border-stone-700">
              K tomuto měsíci zatím nejsou přiřazeny konkrétní programy z databáze.
            </div>
          ) : (
            <div className="space-y-2">
              {selectedMonth.programIds.map((progId, idx) => {
                const program = allPrograms.find(p => p.id === progId);
                const orderNumber = idx + 1;

                if (!program) {
                  return (
                    <div
                      key={`missing-${progId}-${idx}`}
                      className="p-3 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center justify-between text-xs text-stone-500"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[10px]">
                          {orderNumber}
                        </span>
                        <span>Program ID: {progId}</span>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={`${program.id}-${idx}`}
                    onClick={() => onOpenProgram && onOpenProgram(program)}
                    className="p-3 sm:p-3.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 hover:border-emerald-500 dark:hover:border-emerald-600 shadow-xs hover:shadow-md transition-all flex items-center justify-between gap-3 group cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-extrabold flex items-center justify-center text-xs shrink-0 shadow-xs">
                        {orderNumber}
                      </span>
                      <div className="min-w-0">
                        <h6 className="font-bold text-sm text-stone-900 dark:text-stone-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition truncate">
                          {program.title}
                        </h6>
                        <div className="flex items-center gap-2 text-[11px] text-stone-400 mt-0.5 flex-wrap">
                          <span className="flex items-center gap-1 font-medium">
                            <Clock className="w-3 h-3 text-stone-400" />
                            {program.durationMinutes} min
                          </span>
                          <span>•</span>
                          <span className="truncate">Od: {program.authorName}</span>
                          {program.environment && (
                            <>
                              <span>•</span>
                              <span>{program.environment === 'outside' ? 'Venku' : program.environment === 'inside' ? 'V klubovně' : 'Venku i uvnitř'}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="hidden sm:inline text-xs font-semibold text-emerald-600 group-hover:underline">
                        Otevřít program
                      </span>
                      <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-emerald-600 transition" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
