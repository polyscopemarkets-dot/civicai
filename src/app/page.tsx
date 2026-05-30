"use client";
import Link from "next/link";
import { MessageSquare, BookOpen, BarChart2, User, ArrowRight, Zap, ShieldCheck, Database } from "lucide-react";
import { useLang, t } from "@/store/language";

const featureIcons = [MessageSquare, BookOpen, BarChart2, User];
const featureHrefs = ["/chat", "/clauses", "/impact", "/profile"];
const featureColors = [
  "bg-green-100 text-green-700",
  "bg-blue-100 text-blue-700",
  "bg-purple-100 text-purple-700",
  "bg-amber-100 text-amber-700",
];

const stats = [
  { icon: Database, keyEn: "stats1" as const, color: "text-green-600" },
  { icon: Zap, keyEn: "stats2" as const, color: "text-purple-600" },
  { icon: ShieldCheck, keyEn: "stats3" as const, color: "text-blue-600" },
];

export default function Home() {
  const { lang } = useLang();
  const tr = t[lang];

  const features = [
    { label: tr.chatFeature, desc: tr.chatDesc },
    { label: tr.clauseFeature, desc: tr.clauseDesc },
    { label: tr.impactFeature, desc: tr.impactDesc },
    { label: tr.profileFeature, desc: tr.profileDesc },
  ];

  return (
    <main className="flex flex-col items-center">
      {/* Hero */}
      <section className="w-full bg-gradient-to-b from-white to-gray-50 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 pt-16 pb-14 text-center">
          <span className="inline-block bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full mb-5 tracking-wide uppercase">
            {tr.tagline}
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 mb-4 leading-tight">
            {tr.heroTitle}{" "}
            <span className="text-green-700">{tr.heroTitleYou}</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            {tr.heroSub}
          </p>

          {/* Stats bar */}
          <div className="flex flex-wrap justify-center gap-6 mb-10">
            {stats.map(({ icon: Icon, keyEn, color }) => (
              <div key={keyEn} className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <Icon size={16} className={color} />
                {(tr as Record<string, string>)[keyEn]}
              </div>
            ))}
          </div>

          <div className="flex gap-3 justify-center flex-wrap">
            <Link
              href="/chat"
              className="flex items-center gap-2 bg-green-700 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-800 transition-colors shadow-sm"
            >
              {tr.startChat} <ArrowRight size={16} />
            </Link>
            <Link
              href="/profile"
              className="flex items-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              <User size={16} /> {tr.setupProfile}
            </Link>
          </div>
        </div>
      </section>

      {/* Feature cards */}
      <section className="max-w-5xl w-full px-6 py-12">
        <div className="grid sm:grid-cols-2 gap-4">
          {features.map((f, i) => {
            const Icon = featureIcons[i];
            return (
              <Link
                key={featureHrefs[i]}
                href={featureHrefs[i]}
                className="group flex items-start gap-4 border border-gray-200 rounded-2xl p-5 bg-white hover:border-green-200 hover:shadow-md transition-all"
              >
                <span className={`p-2.5 rounded-xl ${featureColors[i]} shrink-0`}>
                  <Icon size={20} />
                </span>
                <div>
                  <h2 className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors mb-1">
                    {f.label}
                  </h2>
                  <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <footer className="w-full border-t border-gray-200 py-6 text-center text-xs text-gray-400 px-6">
        {tr.footer}
      </footer>
    </main>
  );
}
