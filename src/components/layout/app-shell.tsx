"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  CheckCheck,
  ChevronDown,
  ClipboardCheck,
  Home,
  Languages,
  Leaf,
  LogOut,
  Sprout,
  Target,
  Trees,
  UserRound,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useLanguage } from "@/components/providers/language-provider";
import type { SessionUser } from "@/lib/auth/session";

const primaryNavigation = [
  { href: "/", key: "home" as const, icon: Home },
  { href: "/learn", key: "learn" as const, icon: BookOpen },
  { href: "/quiz", key: "quiz" as const, icon: ClipboardCheck },
  { href: "/act", key: "act" as const, icon: Target },
  { href: "/dashboard", key: "dashboard" as const, icon: BarChart3 },
  { href: "/trees", key: "trees" as const, icon: Trees },
] as const;

const mobileNavigation = primaryNavigation.filter((item) =>
  ["learn", "quiz", "act", "dashboard"].includes(item.key),
);

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === href : pathname.startsWith(href);
}

export function AppShell({ user, children }: { user: SessionUser; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { locale, setLocale, t } = useLanguage();
  const [profileOpen, setProfileOpen] = useState(false);
  const canVerify = user.role !== "STUDENT";

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then((registration) => registration.active?.postMessage({ type: "PRECACHE_CORE" }));
    }
  }, []);

  async function logout() {
    if ("serviceWorker" in navigator) {
      const registration = await navigator.serviceWorker.ready;
      registration.active?.postMessage({ type: "CLEAR_PRIVATE_CACHE" });
    }
    localStorage.removeItem("ecoqadam_offline_queue");
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  return (
    <div className="app-frame">
      <aside className="sidebar">
        <Link href="/" className="brand">
          <span className="brand-mark"><Leaf size={24} /></span>
          <span>EcoQadam<small>Climate action</small></span>
        </Link>

        <nav className="sidebar-nav" aria-label="Asosiy navigatsiya">
          {primaryNavigation.map(({ href, key, icon: Icon }) => (
            <Link key={href} href={href} className={isActive(pathname, href) ? "active" : ""}>
              <Icon size={20} />
              <span>{t(key)}</span>
            </Link>
          ))}
          {canVerify && (
            <Link href="/verify" className={isActive(pathname, "/verify") ? "active" : ""}>
              <CheckCheck size={20} />
              <span>{t("verify")}</span>
              <b className="nav-badge">3</b>
            </Link>
          )}
        </nav>

        <div className="sidebar-impact">
          <Sprout size={22} />
          <strong>Bir qadam — katta ta’sir</strong>
          <p>Har bir bajarilgan vazifa Xorazmning yashil kelajagiga hissa.</p>
        </div>
      </aside>

      <div className="app-content">
        <header className="topbar">
          <Link href="/" className="mobile-brand"><Leaf size={20} /> EcoQadam</Link>
          <div className="topbar-spacer" />
          <button className="language-toggle" onClick={() => setLocale(locale === "uz" ? "en" : "uz")} aria-label="Tilni almashtirish">
            <Languages size={17} /> {locale.toUpperCase()}
          </button>
          <div className="profile-menu">
            <button className="profile-trigger" onClick={() => setProfileOpen((value) => !value)} aria-expanded={profileOpen}>
              <span className="avatar">{user.name.slice(0, 1)}</span>
              <span className="profile-copy"><strong>{user.name}</strong><small>{roleLabel(user.role, locale)}</small></span>
              <ChevronDown size={16} />
            </button>
            {profileOpen && (
              <div className="profile-popover">
                <Link href="/profile" onClick={() => setProfileOpen(false)}><UserRound size={17} /> {t("profile")}</Link>
                <button onClick={logout}><LogOut size={17} /> Chiqish</button>
              </div>
            )}
          </div>
        </header>

        <main className="page-content">{children}</main>
      </div>

      <nav className="mobile-nav" aria-label="Mobil navigatsiya">
        {mobileNavigation.map(({ href, key, icon: Icon }) => (
          <Link key={href} href={href} className={isActive(pathname, href) ? "active" : ""}>
            <Icon size={21} />
            <span>{t(key)}</span>
          </Link>
        ))}
        <Link href="/profile" className={isActive(pathname, "/profile") ? "active" : ""}>
          <UserRound size={21} />
          <span>{t("profile")}</span>
        </Link>
      </nav>
    </div>
  );
}

function roleLabel(role: SessionUser["role"], locale: "uz" | "en") {
  const labels = {
    STUDENT: { uz: "O‘quvchi", en: "Student" },
    TEACHER: { uz: "O‘qituvchi", en: "Teacher" },
    SCHOOL_ADMIN: { uz: "Maktab admini", en: "School admin" },
    DISTRICT_ADMIN: { uz: "Tuman admini", en: "District admin" },
  };
  return labels[role][locale];
}
