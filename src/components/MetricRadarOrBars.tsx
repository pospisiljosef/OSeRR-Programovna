import React from 'react';
import { MetricScales } from '../types/scout';
import { Activity, Brain, Palette, Users, Clock } from 'lucide-react';

interface Props {
  metrics: MetricScales;
  compact?: boolean;
}

export const METRIC_LABELS = {
  physicalDemand: { label: 'Fyzická zdatnost', icon: Activity, color: 'text-amber-600 dark:text-amber-400', barBg: 'bg-amber-500' },
  intellectualDemand: { label: 'Intelekt / šifry', icon: Brain, color: 'text-sky-600 dark:text-sky-400', barBg: 'bg-sky-500' },
  creativity: { label: 'Kreativita', icon: Palette, color: 'text-emerald-600 dark:text-emerald-400', barBg: 'bg-emerald-500' },
  teamwork: { label: 'Týmová práce', icon: Users, color: 'text-purple-600 dark:text-purple-400', barBg: 'bg-purple-500' },
  preparationDemand: { label: 'Náročnost přípravy', icon: Clock, color: 'text-rose-600 dark:text-rose-400', barBg: 'bg-rose-500' },
};

export const MetricRadarOrBars: React.FC<Props> = ({ metrics, compact = false }) => {
  if (compact) {
    return (
      <div className="grid grid-cols-5 gap-1.5 py-1 text-xs">
        {(Object.keys(METRIC_LABELS) as Array<keyof MetricScales>).map((key) => {
          const item = METRIC_LABELS[key];
          const val = metrics[key] || 5;
          const Icon = item.icon;
          return (
            <div 
              key={key} 
              className="flex flex-col items-center bg-stone-50 dark:bg-stone-800/60 rounded-md p-1 border border-stone-200/70 dark:border-stone-700/60"
              title={`${item.label}: ${val}/10`}
            >
              <div className="flex items-center gap-0.5">
                <Icon className={`w-3 h-3 ${item.color}`} />
                <span className="font-semibold text-stone-700 dark:text-stone-300">{val}</span>
              </div>
              <div className="w-full bg-stone-200 dark:bg-stone-700 h-1 rounded-full mt-1 overflow-hidden">
                <div 
                  className={`h-full ${item.barBg}`} 
                  style={{ width: `${val * 10}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-3 bg-stone-50/80 dark:bg-stone-900/60 p-4 rounded-xl border border-stone-200 dark:border-stone-800">
      <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">
        Škála náročnosti (1–10)
      </h4>
      {(Object.keys(METRIC_LABELS) as Array<keyof MetricScales>).map((key) => {
        const item = METRIC_LABELS[key];
        const val = metrics[key] || 5;
        const Icon = item.icon;
        return (
          <div key={key} className="space-y-1">
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-1.5">
                <Icon className={`w-4 h-4 ${item.color}`} />
                <span className="font-medium text-stone-700 dark:text-stone-200">{item.label}</span>
              </div>
              <span className="font-bold text-stone-800 dark:text-stone-100">
                {val} <span className="text-stone-400 text-xs">/ 10</span>
              </span>
            </div>
            <div className="w-full bg-stone-200 dark:bg-stone-700 h-2 rounded-full overflow-hidden">
              <div 
                className={`h-full ${item.barBg} transition-all duration-300`} 
                style={{ width: `${val * 10}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
