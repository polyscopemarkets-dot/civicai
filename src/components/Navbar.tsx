"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageSquare, BookOpen, BarChart2, User, Flame, Star, Globe } from "lucide-react";
import { useLang, t } from "@/store/language";
import { useGamification } from "@/store/gamification";
import { useEffect } from "react";

const navItems = (tr: typeof t.en | typeof t.sw) => [
  { href: "/chat", label: tr.nav.chat, icon: MessageSquare },
  { href: "/clauses", label: tr.nav.clauses, icon: BookOpen },
  { href: "/impact", label: tr.nav.impact, icon: BarChart2 },
  { href: "/profile", label: tr.nav.profile, icon: User },
];

export function Navbar() {
  const pathname = usePathname();
  const { lang, toggle } = useLang();
  const tr = t[lang];
  const { civicScore, streak, tickStreak } = useGamification();

  useEffect(() => { tickStreak(); }, [tickStreak]);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="bg-green-700 text-white text-xs font-bold px-2 py-1 rounded-md">CA</span>
          <span className="font-bold text-gray-900 text-base">{tr.appName}</span>
        </Link>

        {/* Nav links */}
        <div className="hidden sm:flex items-center gap-1">
          {navItems(tr).map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                pathname === href
                  ? "bg-green-50 text-green-700"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <Icon size={14} />
              {label}
            </Link>
          ))}
        </div>

        {/* Right side: score + streak + lang */}
        <div className="flex items-center gap-3">
          {streak > 0 && (
            <span className="hidden sm:flex items-center gap-1 text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
              <Flame size={12} /> {streak}
            </span>
          )}
          <span className="hidden sm:flex items-center gap-1 text-xs font-semibold text-yellow-700 bg-yellow-50 px-2 py-1 rounded-full">
            <Star size={12} /> {civicScore}
          </span>
          <button
            onClick={toggle}
            className="flex items-center gap-1 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 px-2.5 py-1.5 rounded-full transition-colors"
          >
            <Globe size={12} />
            {lang === "en" ? "SW" : "EN"}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      <div className="sm:hidden flex border-t border-gray-100">
        {navItems(tr).map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex-1 flex flex-col items-center gap-0.5 py-2 text-xs font-medium transition-colors ${
              pathname === href ? "text-green-700" : "text-gray-500"
            }`}
          >
            <Icon size={16} />
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
