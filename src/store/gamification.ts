"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Badge {
  id: string;
  label: string;
  labelSw: string;
  icon: string;
  earned: boolean;
}

interface GamificationStore {
  civicScore: number;
  streak: number;
  lastVisit: string | null;
  badges: Badge[];
  addPoints: (n: number) => void;
  earnBadge: (id: string) => void;
  tickStreak: () => void;
}

const INITIAL_BADGES: Badge[] = [
  { id: "first_chat", label: "First Question", labelSw: "Swali la Kwanza", icon: "💬", earned: false },
  { id: "clause_explorer", label: "Clause Explorer", labelSw: "Mchunguzi", icon: "🔍", earned: false },
  { id: "impact_check", label: "Impact Checker", labelSw: "Mkaguzi", icon: "📊", earned: false },
  { id: "streak_3", label: "3-Day Streak", labelSw: "Siku 3 Mfululizo", icon: "🔥", earned: false },
  { id: "civic_100", label: "Civic Scholar", labelSw: "Msomi wa Uraia", icon: "🎓", earned: false },
  { id: "shared", label: "Spread the Word", labelSw: "Sambaza", icon: "📢", earned: false },
];

export const useGamification = create<GamificationStore>()(
  persist(
    (set, get) => ({
      civicScore: 0,
      streak: 0,
      lastVisit: null,
      badges: INITIAL_BADGES,
      addPoints: (n) => {
        const next = get().civicScore + n;
        set({ civicScore: next });
        if (next >= 100) get().earnBadge("civic_100");
      },
      earnBadge: (id) =>
        set((s) => ({
          badges: s.badges.map((b) => (b.id === id ? { ...b, earned: true } : b)),
        })),
      tickStreak: () => {
        const today = new Date().toDateString();
        const last = get().lastVisit;
        if (last === today) return;
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        const newStreak = last === yesterday ? get().streak + 1 : 1;
        set({ streak: newStreak, lastVisit: today });
        if (newStreak >= 3) get().earnBadge("streak_3");
      },
    }),
    { name: "civicai-game" }
  )
);
