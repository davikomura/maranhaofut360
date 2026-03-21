import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LanguageDropdown } from "../components/LanguageDropdown";
import { fixDisplayText } from "../utils/text";

export default function Header() {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { to: "/", label: t("nav.home"), accentClass: "border-red-500 text-red-400" },
    { to: "/teams", label: t("nav.teams"), accentClass: "border-blue-500 text-blue-400" },
    { to: "/about", label: t("nav.about"), accentClass: "border-yellow-400 text-yellow-300" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-red-600 bg-gradient-to-r from-black/95 via-gray-900/95 to-black/95 text-white shadow-md backdrop-blur">
      <div className="container mx-auto px-4 py-4 md:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" title={"FutMA 360 - P\u00E1gina inicial"} className="flex items-center gap-3">
            <img
              src="/logo/futma360_2.png"
              alt="FutMA 360 Logo"
              className="h-12 object-contain drop-shadow transition-transform duration-300 hover:scale-105 md:h-16"
            />
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <nav>
              <ul className="flex items-center gap-6 text-lg font-semibold">
                {navItems.map((item) => (
                  <NavItem key={item.to} {...item} onNavigate={() => setIsMenuOpen(false)} />
                ))}
              </ul>
            </nav>
            <LanguageDropdown />
          </div>

          <div className="flex items-center gap-3 md:hidden">
            <LanguageDropdown />
            <button
              type="button"
              onClick={() => setIsMenuOpen((current) => !current)}
              aria-label={isMenuOpen ? t("nav.closeMenu") : t("nav.openMenu")}
              aria-expanded={isMenuOpen}
              className="rounded-xl border border-gray-700 bg-gray-900/80 p-2 text-white transition hover:border-red-500"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <nav className="mt-4 rounded-2xl border border-gray-800 bg-black/90 p-4 md:hidden">
            <ul className="space-y-3 text-base font-semibold">
              {navItems.map((item) => (
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
  accentClass: string;
  mobile?: boolean;
  onNavigate: () => void;
};

function NavItem({ to, label, accentClass, mobile = false, onNavigate }: NavItemProps) {
  return (
    <li>
      <NavLink
        to={to}
        onClick={onNavigate}
        className={({ isActive }) =>
          [
            mobile
              ? "block rounded-xl border px-4 py-3"
              : "border-b-2 transition duration-300",
            isActive
              ? accentClass
              : mobile
              ? "border-gray-800 bg-gray-950 text-white hover:border-gray-600"
              : "border-transparent text-white hover:border-current hover:text-white/80",
          ].join(" ")
        }
      >
        {fixDisplayText(label)}
      </NavLink>
    </li>
  );
}
