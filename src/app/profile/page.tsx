"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star, Flame, Trophy } from "lucide-react";
import { useUserProfile } from "@/store/userProfile";
import { useGamification } from "@/store/gamification";
import { useLang, t } from "@/store/language";
import type { UserRole, BusinessSize } from "@/types";

const roles: { value: UserRole; label: string; labelSw: string; icon: string }[] = [
  { value: "employee", label: "Employee", labelSw: "Mfanyakazi", icon: "👔" },
  { value: "business_owner", label: "Business Owner", labelSw: "Mfanyabiashara", icon: "🏪" },
  { value: "investor", label: "Investor", labelSw: "Mwekezaji", icon: "📈" },
  { value: "farmer", label: "Farmer", labelSw: "Mkulima", icon: "🌾" },
  { value: "student", label: "Student", labelSw: "Mwanafunzi", icon: "🎓" },
];

const industries = [
  "Retail", "Agriculture", "Construction", "Healthcare", "Education",
  "Transport", "Technology", "Manufacturing", "Finance", "Hospitality",
  "Real Estate", "Other",
];

const businessSizes: { value: BusinessSize; label: string; desc: string }[] = [
  { value: "micro", label: "Micro", desc: "< KES 500K" },
  { value: "small", label: "Small", desc: "500K – 5M" },
  { value: "medium", label: "Medium", desc: "5M – 50M" },
  { value: "large", label: "Large", desc: "> 50M" },
];

const salaryRanges = [
  "Under 30,000", "30,000 – 50,000", "50,000 – 100,000",
  "100,000 – 200,000", "200,000 – 500,000", "Over 500,000",
];

export default function ProfilePage() {
  const router = useRouter();
  const store = useUserProfile();
  const { civicScore, streak, badges } = useGamification();
  const { lang } = useLang();
  const tr = t[lang];
  const [step, setStep] = useState(1);

  const handleComplete = () => {
    store.complete();
    router.push("/chat");
  };

  const earnedBadges = badges.filter((b) => b.earned);
  const lockedBadges = badges.filter((b) => !b.earned);

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      {/* Civic stats bar */}
      <div className="flex items-center gap-4 mb-8 bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-2 flex-1">
          <Star size={18} className="text-yellow-500" />
          <div>
            <p className="text-xs text-gray-400">{tr.score}</p>
            <p className="text-lg font-bold text-gray-900">{civicScore}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-1">
          <Flame size={18} className="text-orange-500" />
          <div>
            <p className="text-xs text-gray-400">{tr.streak}</p>
            <p className="text-lg font-bold text-gray-900">{streak}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-1">
          <Trophy size={18} className="text-blue-500" />
          <div>
            <p className="text-xs text-gray-400">{tr.badges}</p>
            <p className="text-lg font-bold text-gray-900">{earnedBadges.length}/{badges.length}</p>
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="mb-8">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">{tr.badges}</p>
        <div className="flex flex-wrap gap-2">
          {badges.map((b) => (
            <div
              key={b.id}
              title={lang === "en" ? b.label : b.labelSw}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                b.earned
                  ? "bg-green-100 text-green-800 border border-green-200"
                  : "bg-gray-100 text-gray-400 border border-gray-200 opacity-60"
              }`}
            >
              <span>{b.icon}</span>
              <span>{lang === "en" ? b.label : b.labelSw}</span>
              {!b.earned && <span className="text-[10px]">🔒</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Profile wizard */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <div className="mb-6">
          <div className="flex gap-2 mb-4">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  s <= step ? "bg-green-600" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-gray-400 mb-1">Step {step} of 3</p>
          <h1 className="text-xl font-bold text-gray-900">
            {step === 1 && (lang === "en" ? "Who are you?" : "Wewe ni nani?")}
            {step === 2 && (lang === "en" ? "What industry?" : "Sekta gani?")}
            {step === 3 && (lang === "en"
              ? store.role === "employee" || store.role === "student" ? "Salary range?" : "Business size?"
              : store.role === "employee" || store.role === "student" ? "Kiwango cha mshahara?" : "Ukubwa wa biashara?"
            )}
          </h1>
        </div>

        {step === 1 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {roles.map((r) => (
              <button
                key={r.value}
                onClick={() => { store.setRole(r.value); setStep(2); }}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  store.role === r.value
                    ? "border-green-600 bg-green-50"
                    : "border-gray-200 hover:border-green-200 hover:bg-gray-50"
                }`}
              >
                <span className="text-2xl">{r.icon}</span>
                <span className="font-medium text-gray-800 text-sm">
                  {lang === "en" ? r.label : r.labelSw}
                </span>
              </button>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {industries.map((ind) => (
                <button
                  key={ind}
                  onClick={() => { store.setIndustry(ind); setStep(3); }}
                  className={`p-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
                    store.industry === ind
                      ? "border-green-600 bg-green-50 text-green-800"
                      : "border-gray-200 text-gray-700 hover:border-green-200"
                  }`}
                >
                  {ind}
                </button>
              ))}
            </div>
            <button onClick={() => setStep(1)} className="text-xs text-gray-400 hover:text-gray-600 mt-2">
              ← Back
            </button>
          </div>
        )}

        {step === 3 && (store.role === "employee" || store.role === "student") && (
          <div className="space-y-2">
            {salaryRanges.map((r) => (
              <button
                key={r}
                onClick={() => { store.setSalaryRange(r); handleComplete(); }}
                className="w-full text-left px-4 py-3 rounded-xl border-2 border-gray-200 hover:border-green-300 hover:bg-green-50 text-sm font-medium text-gray-700 transition-all"
              >
                KES {r} / month
              </button>
            ))}
            <button onClick={() => setStep(2)} className="text-xs text-gray-400 hover:text-gray-600 mt-2">
              ← Back
            </button>
          </div>
        )}

        {step === 3 && store.role !== "employee" && store.role !== "student" && (
          <div className="space-y-2">
            {businessSizes.map((s) => (
              <button
                key={s.value}
                onClick={() => { store.setBusinessSize(s.value); handleComplete(); }}
                className="w-full text-left px-4 py-3 rounded-xl border-2 border-gray-200 hover:border-green-300 hover:bg-green-50 flex justify-between items-center transition-all"
              >
                <span className="text-sm font-medium text-gray-800">{s.label}</span>
                <span className="text-xs text-gray-400">{s.desc} KES</span>
              </button>
            ))}
            <button onClick={() => setStep(2)} className="text-xs text-gray-400 hover:text-gray-600 mt-2">
              ← Back
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
