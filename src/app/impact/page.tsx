"use client";
import { useState } from "react";
import { BarChart2, Share2, Check, AlertTriangle } from "lucide-react";
import { useUserProfile } from "@/store/userProfile";
import { useGamification } from "@/store/gamification";
import { useLang, t } from "@/store/language";
import { ImpactReport } from "@/components/ImpactReport";
import type { DocumentChunk } from "@/types";
import Link from "next/link";

export default function ImpactPage() {
  const profile = useUserProfile();
  const { addPoints, earnBadge } = useGamification();
  const { lang } = useLang();
  const tr = t[lang];

  const [type, setType] = useState<"employee" | "business">("employee");
  const [amount, setAmount] = useState("");
  const [report, setReport] = useState<string | null>(null);
  const [citations, setCitations] = useState<DocumentChunk[]>([]);
  const [loading, setLoading] = useState(false);
  const [shared, setShared] = useState(false);

  const calculate = async () => {
    const num = parseFloat(amount.replace(/,/g, ""));
    if (!num || num <= 0) return;
    setLoading(true);
    setReport(null);

    const res = await fetch("/api/impact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, amount: num, userProfile: profile }),
    });
    const data = await res.json();
    setReport(data.report);
    setCitations(data.citations ?? []);
    setLoading(false);
    addPoints(15);
    earnBadge("impact_check");
  };

  const handleShare = () => {
    const text = `My Finance Bill 2026 Impact Report (via CivicAI)\n\n${report?.slice(0, 400)}...\n\nGet yours: civicai.ke`;
    navigator.clipboard.writeText(text);
    setShared(true);
    earnBadge("shared");
    setTimeout(() => setShared(false), 2500);
  };

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <span className="p-2 bg-purple-100 text-purple-700 rounded-xl">
          <BarChart2 size={20} />
        </span>
        <h1 className="text-2xl font-bold text-gray-900">{tr.impactTitle}</h1>
      </div>
      <p className="text-gray-500 text-sm mb-6">{tr.impactSub}</p>

      {!profile.isComplete && (
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-sm text-amber-800">
          <AlertTriangle size={16} className="shrink-0 mt-0.5" />
          <span>
            For more personalised results,{" "}
            <Link href="/profile" className="underline font-semibold">
              set up your profile
            </Link>{" "}
            first.
          </span>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-5">
        {/* Type toggle */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {lang === "en" ? "I am a..." : "Mimi ni..."}
          </label>
          <div className="flex gap-3">
            {(["employee", "business"] as const).map((tp) => (
              <button
                key={tp}
                onClick={() => setType(tp)}
                className={`flex-1 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
                  type === tp
                    ? "border-green-600 bg-green-50 text-green-800"
                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                {tp === "employee"
                  ? lang === "en" ? "Employee / Individual" : "Mfanyakazi"
                  : lang === "en" ? "Business Owner" : "Mfanyabiashara"}
              </button>
            ))}
          </div>
        </div>

        {/* Amount input */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {type === "employee"
              ? lang === "en" ? "Monthly Salary (KES)" : "Mshahara wa Kila Mwezi (KES)"
              : lang === "en" ? "Annual Business Turnover (KES)" : "Mapato ya Biashara kwa Mwaka (KES)"}
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400">KES</span>
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={type === "employee" ? "80,000" : "5,000,000"}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-green-400 focus:ring-1 focus:ring-green-200"
              type="number"
              min="0"
            />
          </div>
        </div>

        <button
          onClick={calculate}
          disabled={loading || !amount}
          className="w-full py-3 bg-green-700 text-white rounded-xl text-sm font-bold hover:bg-green-800 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              {lang === "en" ? "Calculating..." : "Inakokotoa..."}
            </>
          ) : tr.calcBtn}
        </button>
      </div>

      {report && (
        <div className="mt-6 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-gray-900">{tr.yourReport}</h2>
            <button
              onClick={handleShare}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
                shared
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {shared ? <Check size={12} /> : <Share2 size={12} />}
              {shared ? tr.copied : tr.share}
            </button>
          </div>
          <ImpactReport report={report} citations={citations} />
        </div>
      )}
    </main>
  );
}
