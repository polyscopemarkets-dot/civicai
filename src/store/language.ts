"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Lang = "en" | "sw";

interface LangStore {
  lang: Lang;
  toggle: () => void;
}

export const useLang = create<LangStore>()(
  persist(
    (set, get) => ({
      lang: "en",
      toggle: () => set({ lang: get().lang === "en" ? "sw" : "en" }),
    }),
    { name: "civicai-lang" }
  )
);

export const t = {
  en: {
    appName: "CivicAI",
    tagline: "Finance Bill 2026",
    heroTitle: "How does the Finance Bill affect",
    heroTitleYou: "you?",
    heroSub: "CivicAI reads Kenya's Finance Bill 2026 so you don't have to. Ask questions, explore clauses, get a personalised impact report — all with cited sources.",
    startChat: "Start Chatting",
    setupProfile: "Set Up Profile",
    chatFeature: "Chat with the Bill",
    chatDesc: "Ask any question and get cited, plain-English answers.",
    clauseFeature: "Browse Clauses",
    clauseDesc: "Search and explore all clauses with instant plain-English explanations.",
    impactFeature: "Impact Calculator",
    impactDesc: "Enter your salary or turnover and get a personalised financial impact report.",
    profileFeature: "Your Profile",
    profileDesc: "Tell us who you are so answers are tailored to your role and industry.",
    stats1: "46 sections covered",
    stats2: "Groq-powered AI",
    stats3: "Free to use",
    nav: { chat: "Chat", clauses: "Clauses", impact: "Impact", profile: "Profile" },
    chatEmpty: "Ask anything about the Finance Bill 2026",
    chatEmptyEx: "e.g. \"How does this bill affect VAT for small businesses?\"",
    chatInput: "Ask about the Finance Bill...",
    send: "Send",
    sources: "Sources",
    suggestedPrompts: [
      "What new taxes does this bill introduce?",
      "How does it affect PAYE for employees?",
      "What changes to VAT are proposed?",
      "How does it affect small businesses?",
    ],
    clauseTitle: "Clause Browser",
    clauseSub: "Browse all sections of the Finance Bill 2026. Click any clause for a plain-English explanation.",
    clauseSearch: "Search clauses, sections or keywords...",
    impactTitle: "Impact Calculator",
    impactSub: "Enter your financial details and get a personalised breakdown.",
    calcBtn: "Calculate My Impact",
    yourReport: "Your Impact Report",
    score: "Civic Score",
    badges: "Badges",
    streak: "Day Streak",
    share: "Share",
    copied: "Link copied!",
    footer: "CivicAI · Powered by Groq & Kenya Finance Bill 2026 · For informational purposes only",
  },
  sw: {
    appName: "CivicAI",
    tagline: "Mswada wa Fedha 2026",
    heroTitle: "Mswada wa Fedha unakuathirije",
    heroTitleYou: "wewe?",
    heroSub: "CivicAI inasoma Mswada wa Fedha wa Kenya 2026 badala yako. Uliza maswali, chunguza vipengele, pata ripoti ya athari — yote na vyanzo vilivotajwa.",
    startChat: "Anza Mazungumzo",
    setupProfile: "Weka Wasifu",
    chatFeature: "Zungumza na Mswada",
    chatDesc: "Uliza swali lolote na upate majibu ya wazi na vyanzo.",
    clauseFeature: "Vinjari Vipengele",
    clauseDesc: "Tafuta na chunguza vipengele vyote kwa maelezo ya lugha rahisi.",
    impactFeature: "Kikokotoo cha Athari",
    impactDesc: "Ingiza mshahara au mapato yako na upate ripoti ya athari za kifedha.",
    profileFeature: "Wasifu Wako",
    profileDesc: "Tuambie wewe ni nani ili majibu yalingane na hali yako.",
    stats1: "Sehemu 46 zimefunikwa",
    stats2: "AI ya Groq",
    stats3: "Bila malipo",
    nav: { chat: "Zungumza", clauses: "Vipengele", impact: "Athari", profile: "Wasifu" },
    chatEmpty: "Uliza chochote kuhusu Mswada wa Fedha 2026",
    chatEmptyEx: "mf. \"Je, mswada huu unaathiri vipi VAT kwa biashara ndogo?\"",
    chatInput: "Uliza kuhusu Mswada wa Fedha...",
    send: "Tuma",
    sources: "Vyanzo",
    suggestedPrompts: [
      "Kodi gani mpya zinaletwa na mswada huu?",
      "Unathirije PAYE kwa wafanyakazi?",
      "Ni mabadiliko gani ya VAT yanayopendekezwa?",
      "Unathirije biashara ndogo?",
    ],
    clauseTitle: "Vinjari Vipengele",
    clauseSub: "Tazama sehemu zote za Mswada wa Fedha 2026. Bofya kipengele chochote kwa maelezo ya lugha rahisi.",
    clauseSearch: "Tafuta vipengele, sehemu au maneno...",
    impactTitle: "Kikokotoo cha Athari",
    impactSub: "Ingiza maelezo yako ya kifedha na upate muhtasari wa kibinafsi.",
    calcBtn: "Kokotoa Athari Zangu",
    yourReport: "Ripoti Yako ya Athari",
    score: "Alama za Uraia",
    badges: "Vitambulisho",
    streak: "Siku Mfululizo",
    share: "Shiriki",
    copied: "Kiungo kimekopwa!",
    footer: "CivicAI · Inayoendeshwa na Groq & Mswada wa Fedha wa Kenya 2026 · Kwa madhumuni ya taarifa peke yake",
  },
} as const;
