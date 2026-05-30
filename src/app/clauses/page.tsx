"use client";
import { useEffect, useState } from "react";
import { Search, BookOpen, FileText, ChevronRight } from "lucide-react";
import { ClauseExplainer } from "@/components/ClauseExplainer";
import { useGamification } from "@/store/gamification";
import { useLang, t } from "@/store/language";
import type { DocumentChunk } from "@/types";

export default function ClausesPage() {
  const [clauses, setClauses] = useState<DocumentChunk[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<DocumentChunk | null>(null);
  const [loading, setLoading] = useState(true);
  const { addPoints, earnBadge } = useGamification();
  const { lang } = useLang();
  const tr = t[lang];

  useEffect(() => {
    fetch("/api/clauses")
      .then((r) => r.json())
      .then((data) => { setClauses(data); setLoading(false); });
  }, []);

  const filtered = clauses.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.clauseNumber?.toLowerCase().includes(q) ||
      c.sectionTitle?.toLowerCase().includes(q) ||
      c.content.toLowerCase().includes(q)
    );
  });

  const handleSelect = (c: DocumentChunk) => {
    setSelected(c);
    earnBadge("clause_explorer");
    addPoints(5);
  };

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <span className="p-2 bg-blue-100 text-blue-700 rounded-xl">
          <BookOpen size={20} />
        </span>
        <h1 className="text-2xl font-bold text-gray-900">{tr.clauseTitle}</h1>
      </div>
      <p className="text-gray-500 text-sm mb-6">
        {tr.clauseSub.replace("all sections", `all ${clauses.length} sections`)}
      </p>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={tr.clauseSearch}
          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-green-400 focus:ring-1 focus:ring-green-200 shadow-sm"
        />
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-28 rounded-2xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <FileText size={40} className="mx-auto mb-3 opacity-30" />
          <p>No clauses found for &ldquo;{search}&rdquo;</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {filtered.map((c) => (
            <button
              key={c.id}
              onClick={() => handleSelect(c)}
              className="text-left bg-white border border-gray-200 rounded-2xl p-4 hover:border-green-300 hover:shadow-md transition-all group flex flex-col gap-2"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  {c.clauseNumber && (
                    <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                      {c.clauseNumber}
                    </span>
                  )}
                  {c.pageNumber && (
                    <span className="text-[11px] text-gray-400">pg. {c.pageNumber}</span>
                  )}
                </div>
                <ChevronRight
                  size={14}
                  className="text-gray-300 group-hover:text-green-600 shrink-0 transition-colors"
                />
              </div>
              {c.sectionTitle && (
                <p className="text-sm font-semibold text-gray-800 leading-snug">{c.sectionTitle}</p>
              )}
              <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{c.content}</p>
            </button>
          ))}
        </div>
      )}

      {selected && (
        <ClauseExplainer chunk={selected} onClose={() => setSelected(null)} />
      )}
    </main>
  );
}
