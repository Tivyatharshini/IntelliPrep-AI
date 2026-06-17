import { NavLink, Outlet } from "react-router-dom";
import { BrainCircuit, FileSearch, Gauge, LayoutDashboard, MessageSquareText, MoonStar, Route, SunMedium } from "lucide-react";
import { ThemeContextProvider, useThemeMode } from "../hooks/useThemeMode.jsx";

const navItems = [
  { to: "/", label: "Home", icon: LayoutDashboard },
  { to: "/jd-analysis", label: "JD Analysis", icon: FileSearch },
  { to: "/ats-analysis", label: "ATS Analysis", icon: Gauge },
  { to: "/skill-gap", label: "Skill Gap", icon: Route },
  { to: "/mock-interview", label: "Mock Interview", icon: MessageSquareText }
];

function Shell() {
  const { isDark, toggleTheme } = useThemeMode();

  return (
    <div className={isDark ? "dark" : ""}>
      <div className="min-h-screen bg-slate-100 text-slate-950 transition-colors dark:bg-slate-950 dark:text-slate-100">
        <header className="border-b border-slate-200 bg-white/90 backdrop-blur dark:border-white/10 dark:bg-slate-950/80">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600 text-white shadow-glow">
                <BrainCircuit className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold">AI Interview Copilot</p>
                <p className="text-xs text-slate-500 dark:text-slate-300">Resume + JD intelligence powered by Gemini</p>
              </div>
            </div>

            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
            >
              {isDark ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
              {isDark ? "Light" : "Dark"}
            </button>
          </div>
        </header>

        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[260px_1fr] lg:px-8">
          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-white/5">
            <nav className="grid gap-2">
              {navItems.map((item) => (
                <SidebarLink key={item.to} {...item} />
              ))}
            </nav>
          </aside>

          <main className="min-h-[calc(100vh-7rem)] rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-slate-900/60 sm:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

function SidebarLink({ to, label, icon: Icon }) {
  return (
    <NavLink
      to={to}
      end={to === "/"}
      className={({ isActive }) =>
        [
          "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition",
          isActive
            ? "bg-brand-600 text-white shadow-glow"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
        ].join(" ")
      }
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </NavLink>
  );
}

export default function Layout() {
  return (
    <ThemeContextProvider>
      <Shell />
    </ThemeContextProvider>
  );
}
