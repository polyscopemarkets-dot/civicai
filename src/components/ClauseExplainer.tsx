"use client";
import { useState } from "react";
import type { DocumentChunk } from "@/types";

interface Props {
  chunk: DocumentChunk;
  onClose: () => void;
}

export function ClauseExplainer({ chunk, onClose }: Props) {
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const explain = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/explain-clause", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clauseId: chunk.id,
          clauseRef: `${chunk.clauseNumber ?? "Section"}, Page ${chunk.pageNumber ?? "?"}`,
        }),
      });
      const data = await res.json();
      setExplanation(data.explanation);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-1 rounded-full">
              {chunk.clauseNumber ?? "Section"}
            </span>
            {chunk.pageNumber && (
              <span className="text-xs text-gray-400 ml-2">Page {chunk.pageNumber}</span>
            )}
            {chunk.sectionTitle && (
              <p className="text-sm font-semibold text-gray-700 mt-2">{chunk.sectionTitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 text-xl leading-none ml-4"
          >
            ×
          </button>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 leading-relaxed mb-4 max-h-48 overflow-y-auto">
          {chunk.content}
        </div>

        {!explanation && (
          <button
            onClick={explain}
            disabled={loading}
            className="w-full py-2.5 bg-green-700 text-white rounded-lg text-sm font-semibold hover:bg-green-800 disabled:opacity-60 transition-colors"
          >
            {loading ? "Explaining..." : "Explain in Plain English"}
          </button>
        )}

        {explanation && (
          <div className="border-t border-gray-200 pt-4 mt-2">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Plain English Explanation</p>
            <p className="text-sm text-gray-800 leading-relaxed">{explanation}</p>
          </div>
        )}
      </div>
    </div>
  );
}
