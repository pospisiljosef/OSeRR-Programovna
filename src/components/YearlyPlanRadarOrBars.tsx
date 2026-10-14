import React, { useState } from 'react';
import { PersonalDevelopmentScales } from '../types/scout';
import { PERSONAL_DEVELOPMENT_DIMENSIONS } from '../data/constants';
import { Sparkles, BarChart2 } from 'lucide-react';

interface YearlyPlanRadarOrBarsProps {
  scales: PersonalDevelopmentScales;
  compact?: boolean;
}

export const YearlyPlanRadarOrBars: React.FC<YearlyPlanRadarOrBarsProps> = ({ scales, compact = false }) => {
  const [viewType, setViewType] = useState<'bars' | 'radar'>('bars');

  const dimensions = PERSONAL_DEVELOPMENT_DIMENSIONS.map(dim => ({
    ...dim,
    value: scales[dim.id] || 5
  }));

  if (compact) {
    return (
      <div className="space-y-1.5 w-full">
        <div className="grid grid-cols-5 gap-1 text-[10px] text-center font-bold">
          {dimensions.map((d) => (
            <div key={d.id} className="truncate" title={`${d.label}: ${d.value}/10`}>
              <div className="text-[9px] text-stone-500 dark:text-stone-400 font-medium truncate">
                {d.label.split(' ')[0]}
              </div>
              <div className="text-stone-800 dark:text-stone-200 font-extrabold">{d.value}/10</div>
              <div className="w-full bg-stone-100 dark:bg-stone-800 h-1.5 rounded-full overflow-hidden mt-0.5">
                <div 
                  className="h-full rounded-full transition-all"
                  style={{ width: `${d.value * 10}%`, backgroundColor: d.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Calculate SVG Radar points for 5 dimensions (Pentagon)
  const size = 200;
  const center = size / 2;
  const radius = size * 0.38;
  const angleStep = (Math.PI * 2) / 5;

  const getCoordinates = (index: number, val: number) => {
    // Start from top (- PI / 2)
    const angle = index * angleStep - Math.PI / 2;
    const r = (val / 10) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  const polygonPoints = dimensions
    .map((d, i) => {
      const { x, y } = getCoordinates(i, d.value);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="bg-stone-50 dark:bg-stone-900/60 p-3 sm:p-4 rounded-2xl border border-stone-200 dark:border-stone-800">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-purple-500" />
          5 stránek skautského rozvoje (1–10)
        </span>
        <div className="flex items-center gap-1 bg-stone-200/60 dark:bg-stone-800 p-0.5 rounded-lg text-[11px]">
          <button
            type="button"
            onClick={() => setViewType('bars')}
            className={`px-2 py-0.5 rounded font-medium transition ${
              viewType === 'bars'
                ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-xs'
                : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            Sloupce
          </button>
          <button
            type="button"
            onClick={() => setViewType('radar')}
            className={`px-2 py-0.5 rounded font-medium transition ${
              viewType === 'radar'
                ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-xs'
                : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            Pavučina
          </button>
        </div>
      </div>

      {viewType === 'bars' ? (
        <div className="space-y-2.5">
          {dimensions.map((dim) => (
            <div key={dim.id}>
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="font-semibold text-stone-700 dark:text-stone-300">
                  {dim.label}
                </span>
                <span className="font-bold text-stone-900 dark:text-stone-100 font-mono text-[11px]">
                  {dim.value}/10
                </span>
              </div>
              <div className="w-full bg-stone-200 dark:bg-stone-800 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{ width: `${dim.value * 10}%`, backgroundColor: dim.color }}
                />
              </div>
              <p className="text-[10px] text-stone-400 dark:text-stone-500 mt-0.5 truncate">
                {dim.shortDesc}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <svg width={size} height={size} className="overflow-visible">
            {/* Background Pentagon Grid lines */}
            {[0.25, 0.5, 0.75, 1.0].map((step) => {
              const ringPoints = dimensions
                .map((_, i) => {
                  const { x, y } = getCoordinates(i, step * 10);
                  return `${x},${y}`;
                })
                .join(' ');
              return (
                <polygon
                  key={step}
                  points={ringPoints}
                  fill="none"
                  stroke="currentColor"
                  className="text-stone-200 dark:text-stone-800"
                  strokeWidth="1"
                />
              );
            })}

            {/* Axis lines */}
            {dimensions.map((_, i) => {
              const { x, y } = getCoordinates(i, 10);
              return (
                <line
                  key={i}
                  x1={center}
                  y1={center}
                  x2={x}
                  y2={y}
                  stroke="currentColor"
                  className="text-stone-200 dark:text-stone-800"
                  strokeWidth="1"
                />
              );
            })}

            {/* Filled Radar Area */}
            <polygon
              points={polygonPoints}
              fill="rgba(139, 92, 246, 0.25)"
              stroke="#8B5CF6"
              strokeWidth="2.5"
            />

            {/* Point circles */}
            {dimensions.map((d, i) => {
              const { x, y } = getCoordinates(i, d.value);
              return (
                <circle
                  key={d.id}
                  cx={x}
                  cy={y}
                  r="4"
                  fill={d.color}
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
              );
            })}
          </svg>

          {/* Legend */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2 w-full text-[11px]">
            {dimensions.map((d) => (
              <div key={d.id} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                <span className="text-stone-600 dark:text-stone-300 truncate">{d.label.split(' ')[0]}: {d.value}/10</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
