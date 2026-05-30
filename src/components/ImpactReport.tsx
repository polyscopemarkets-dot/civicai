import type { DocumentChunk } from "@/types";
import { MarkdownContent } from "./MarkdownContent";

interface Props {
  report: string;
  citations: DocumentChunk[];
}

export function ImpactReport({ report, citations }: Props) {
  return (
    <div className="space-y-6">
      <MarkdownContent content={report} />

      {citations.length > 0 && (
        <div className="border-t border-gray-200 pt-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Sources ({citations.length} clauses)
          </p>
          <div className="grid sm:grid-cols-2 gap-2">
            {citations.map((c) => (
              <div
                key={c.id}
                className="text-xs bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-600"
              >
                <span className="font-semibold text-gray-800">
                  {c.clauseNumber ?? c.sectionTitle ?? "Finance Bill 2026"}
                </span>
                {c.pageNumber && <span className="text-gray-400 ml-1">· Page {c.pageNumber}</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
