import { Menu, X, Sun, Moon } from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LanguageDropdown } from "../components/LanguageDropdown";
import { useTheme } from "../hooks/useTheme";

export default function Header() {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const desktopNavItems = [
    { to: "/", label: t("nav.home"), activeClass: "text-red-650 dark:text-red-400", hoverClass: "hover:text-red-600 dark:hover:text-red-400" },
    { to: "/teams", label: t("nav.teams"), activeClass: "text-blue-600 dark:text-blue-400", hoverClass: "hover:text-blue-600 dark:hover:text-blue-400" },
    { to: "/mapa", label: t("nav.map"), activeClass: "text-sky-600 dark:text-sky-400", hoverClass: "hover:text-sky-600 dark:hover:text-sky-400" },
    { to: "/campeoes", label: t("nav.champions"), activeClass: "text-amber-600 dark:text-amber-400", hoverClass: "hover:text-amber-600 dark:hover:text-amber-400" },
    { to: "/contact", label: t("nav.contact"), activeClass: "text-emerald-600 dark:text-emerald-400", hoverClass: "hover:text-emerald-600 dark:hover:text-emerald-400" },
  ];

  const mobileNavItems = [
    ...desktopNavItems,
    { to: "/serie-a", label: t("nav.serieA"), activeClass: "text-red-650 dark:text-red-400", hoverClass: "hover:text-red-600 dark:hover:text-red-400" },
    { to: "/serie-b", label: t("nav.serieB"), activeClass: "text-blue-600 dark:text-blue-400", hoverClass: "hover:text-blue-600 dark:hover:text-blue-400" },
    { to: "/about", label: t("nav.about"), activeClass: "text-amber-600 dark:text-amber-400", hoverClass: "hover:text-amber-600 dark:hover:text-amber-400" },
  ];

  return (
    <header className="sticky top-0 z-40 glass-header shadow-sm transition-theme">
      <div className="container mx-auto px-4 py-3.5 md:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" title="FutMA 360 - Pagina inicial" className="flex items-center gap-3">
            <img
              src="/logo/futma360_2.png"
              alt="FutMA 360 Logo"
              className="h-10 object-contain drop-shadow-sm transition-transform duration-300 hover:scale-105 md:h-11 dark:brightness-100 brightness-95"
            />
          </Link>

          <div className="hidden items-center gap-6 md:flex">
            <nav>
              <ul className="flex items-center gap-6 text-sm font-semibold tracking-wide lg:gap-8">
                {desktopNavItems.map((item) => (
                  <NavItem key={item.to} {...item} onNavigate={() => setIsMenuOpen(false)} />
                ))}
              </ul>
            </nav>

            <div className="flex items-center gap-2 border-l border-slate-200/50 pl-4 dark:border-zinc-900/60">
              <button
                type="button"
                onClick={toggleTheme}
                className="flex items-center justify-center rounded-xl p-2 text-slate-500 transition-colors hover:bg-[#F5F2EC]/80 hover:text-slate-800 dark:text-zinc-400 dark:hover:bg-zinc-900/60 dark:hover:text-zinc-100"
                aria-label={theme === "dark" ? t("Ativar tema claro") : t("Ativar tema escuro")}
              >
                {theme === "dark" ? (
                  <Sun size={19} className="text-amber-400 transition-transform duration-500 rotate-0 hover:rotate-45" />
                ) : (
                  <Moon size={19} className="text-slate-700 transition-transform duration-500 rotate-0 hover:-rotate-12" />
                )}
              </button>
              <LanguageDropdown />
            </div>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={toggleTheme}
              className="flex items-center justify-center rounded-xl p-2 text-slate-500 transition-colors hover:bg-[#F5F2EC]/85 dark:text-zinc-400 dark:hover:bg-zinc-900/60"
              aria-label={theme === "dark" ? "Ativar tema claro" : "Ativar tema escuro"}
            >
              {theme === "dark" ? (
                <Sun size={18} className="text-amber-400" />
              ) : (
                <Moon size={18} className="text-slate-700" />
              )}
            </button>
            <LanguageDropdown />
            <button
              type="button"
              onClick={() => setIsMenuOpen((current) => !current)}
              aria-label={isMenuOpen ? t("nav.closeMenu") : t("nav.openMenu")}
              aria-expanded={isMenuOpen}
              className="rounded-xl border border-slate-200/80 bg-[#F5F2EC]/60 p-2 text-slate-700 transition-colors hover:bg-[#F5F2EC] dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-200 dark:hover:bg-zinc-900"
            >
              {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <nav className="mt-3 rounded-2xl border border-slate-200/50 bg-[#FAF8F5]/98 p-3 shadow-xl backdrop-blur-md dark:border-zinc-900/80 dark:bg-[#07070A]/98 md:hidden">
            <ul className="space-y-1 text-sm font-semibold">
              {mobileNavItems.map((item) => (
                <NavItem key={item.to} {...item} mobile onNavigate={() => setIsMenuOpen(false)} />
              ))}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}

type NavItemProps = {
  to: string;
  label: string;
  activeClass: string;
  hoverClass: string;
  mobile?: boolean;
  onNavigate: () => void;
};

function NavItem({ to, label, activeClass, hoverClass, mobile = false, onNavigate }: NavItemProps) {
  return (
    <li>
      <NavLink
        to={to}
        onClick={onNavigate}
        viewTransition
        className={({ isActive }) =>
          [
            "transition-colors duration-200",
            mobile
              ? "block rounded-xl px-4 py-2 border border-transparent"
              : "relative py-1 text-slate-600 dark:text-zinc-400 font-semibold tracking-wide",
            isActive
              ? mobile
                ? "bg-[#F5F2EC] text-[#2C2927] dark:bg-zinc-900/60 dark:text-zinc-100 font-bold border-slate-200/30"
                : `${activeClass} font-bold`
              : mobile
              ? "text-slate-600 dark:text-zinc-400 hover:bg-[#F5F2EC]/50 dark:hover:bg-zinc-900/40"
              : `text-slate-600 dark:text-zinc-400 ${hoverClass}`,
          ].join(" ")
        }
      >
        {({ isActive }) => (
          <>
            {label}
            {!mobile && isActive && (
              <span className="absolute bottom-0 left-0 h-[2px] w-full rounded-full bg-current" />
            )}
          </>
        )}
      </NavLink>
    </li>
  );
}
