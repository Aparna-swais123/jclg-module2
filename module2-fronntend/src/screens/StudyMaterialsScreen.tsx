import { useState, useEffect } from 'react';
import { FileText, Video, Presentation, FileCheck, ExternalLink } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { StatCard } from '@/components/StatCard';
import { api } from '@/services/api';
import type { StudyMaterial, MaterialType } from '@/types';

const typeConfig: Record<MaterialType, { icon: LucideIcon; bg: string; text: string; badge: string }> = {
  PDF: { icon: FileText, bg: 'bg-red-50', text: 'text-red-500', badge: 'bg-red-50 text-red-600' },
  VIDEO: { icon: Video, bg: 'bg-brand-50', text: 'text-brand-600', badge: 'bg-brand-50 text-brand-600' },
  PPTX: { icon: Presentation, bg: 'bg-orange-50', text: 'text-orange-500', badge: 'bg-orange-50 text-orange-600' },
  DOCX: { icon: FileCheck, bg: 'bg-blue-50', text: 'text-blue-500', badge: 'bg-blue-50 text-blue-600' },
};

export function StudyMaterialsScreen() {
  const [studyMaterials, setStudyMaterials] = useState<StudyMaterial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.getStudyMaterials()
      .then(setStudyMaterials)
      .finally(() => setLoading(false));
  }, []);

  const subjects = new Set(studyMaterials.map((m) => m.subject)).size;
  const recent = studyMaterials.length;

  const handleOpenMaterial = (url?: string, title?: string) => {
    if (!url || url.trim() === '') {
      alert(`No file link available for "${title || 'this resource'}".`);
      return;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div>
      <PageHeader title="Study Materials" subtitle="Reference notes, lectures and resources shared by your faculty" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total Materials" value={loading ? '...' : studyMaterials.length} />
        <StatCard label="Subjects" value={loading ? '...' : subjects} />
        <StatCard label="Recent Uploads" value={loading ? '...' : recent} />
      </div>

      {loading ? (
        <div className="mt-6 rounded-xl bg-white p-8 text-center text-sm text-muted shadow-card">
          Loading study materials...
        </div>
      ) : studyMaterials.length === 0 ? (
        <div className="mt-6 rounded-xl bg-white p-8 text-center text-sm text-muted shadow-card">
          No study materials available
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {studyMaterials.map((m) => {
            const cfg = typeConfig[m.type] || typeConfig.PDF;
            const Icon = cfg.icon;
            return (
              <div key={m.id} className="rounded-xl bg-white p-5 shadow-card transition-shadow hover:shadow-card-hover">
                <div className="mb-4 flex items-start justify-between">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${cfg.bg} ${cfg.text}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className={`rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${cfg.badge}`}>
                    {m.type}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-ink">{m.title}</h3>
                <p className="mt-1 text-xs text-muted">{m.subject}</p>
                <p className="mt-2 text-xs text-muted">{m.size} · {m.date || 'Recent'}</p>
                <button
                  type="button"
                  onClick={() => handleOpenMaterial(m.fileUrl, m.title)}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-brand-50 border border-brand-200 py-2.5 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-100 cursor-pointer"
                >
                  <ExternalLink className="h-4 w-4" />
                  Open Material
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
