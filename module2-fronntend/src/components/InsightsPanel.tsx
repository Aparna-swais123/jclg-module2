import { Sparkles } from 'lucide-react';

interface InsightsPanelProps {
  title?: string;
  insights: string[];
}

export function InsightsPanel({ title = 'AI Assistant / Insights', insights }: InsightsPanelProps) {
  return (
    <div className="rounded-xl bg-white p-5 shadow-card">
      <div className="mb-4 flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-brand-500" />
        <h3 className="text-base font-bold text-brand-600">{title}</h3>
      </div>
      <ul className="space-y-3">
        {insights.map((insight, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-[2px] bg-brand-500" />
            <p className="text-sm leading-relaxed text-muted">{insight}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
