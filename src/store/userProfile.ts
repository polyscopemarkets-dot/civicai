import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserProfile, UserRole, BusinessSize } from "@/types";

interface UserProfileStore extends UserProfile {
  setRole: (role: UserRole) => void;
  setIndustry: (industry: string) => void;
  setBusinessSize: (size: BusinessSize) => void;
  setSalaryRange: (range: string) => void;
  complete: () => void;
  reset: () => void;
}

const initial: UserProfile = {
  role: null,
  industry: null,
  businessSize: null,
  salaryRange: null,
  isComplete: false,
};

export const useUserProfile = create<UserProfileStore>()(
  persist(
    (set) => ({
      ...initial,
      setRole: (role) => set({ role }),
      setIndustry: (industry) => set({ industry }),
      setBusinessSize: (businessSize) => set({ businessSize }),
      setSalaryRange: (salaryRange) => set({ salaryRange }),
      complete: () => set({ isComplete: true }),
      reset: () => set(initial),
    }),
    { name: "civicai-profile" }
  )
);
