import type { DocumentChunk } from "@/types";

interface Props {
  chunks: DocumentChunk[];
}

export function CitationCard({ chunks }: Props) {
  if (!chunks.length) return null;

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Sources</p>
      {chunks.map((c) => (
        <div
          key={c.id}
          className="border border-gray-200 rounded-lg p-3 text-xs text-gray-600 bg-gray-50"
        >
          <div className="font-semibold text-gray-800 mb-1">
            {c.clauseNumber ?? c.sectionTitle ?? "Finance Bill 2026"}
            {c.pageNumber ? <span className="font-normal text-gray-500 ml-1">· Page {c.pageNumber}</span> : null}
          </div>
          <p className="line-clamp-3 leading-relaxed">{c.content}</p>
        </div>
      ))}
    </div>
  );
}
