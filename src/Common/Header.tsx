import { Link } from "react-router-dom";
import { LanguageDropdown } from "../components/LanguageDropdown";
import { useTranslation } from "react-i18next";

export default function Header() {
  const { t } = useTranslation();

  return (
    <header className="bg-gradient-to-r from-black via-gray-900 to-black text-white shadow-md border-b border-red-600">
      <div className="container mx-auto flex items-center justify-between px-4 md:px-8 py-4">
        
        {/* Logo */}
        <Link to="/" title="FutMA 360 - Página inicial" className="flex items-center gap-3">
          <img
            src="/logo/futma360_2.png"
            alt="FutMA 360 Logo"
            className="h-12 md:h-16 object-contain drop-shadow transition-transform duration-300 hover:scale-105"
          />
        </Link>

        {/* Navigation + Language Selector */}
        <div className="flex items-center gap-4 md:gap-8">
          <nav>
            <ul className="flex items-center gap-4 md:gap-6 text-sm md:text-lg font-semibold">
              <NavItem to="/" label={t("nav.home")} hoverColor="red-500" />
              <NavItem to="/teams" label={t("nav.teams")} hoverColor="blue-500" />
              <NavItem to="/about" label={t("nav.about")} hoverColor="yellow-400" />
            </ul>
          </nav>
          <LanguageDropdown />
        </div>
      </div>
    </header>
  );
}

type NavItemProps = {
  to: string;
  label: string;
  hoverColor: string;
};

function NavItem({ to, label, hoverColor }: NavItemProps) {
  return (
    <li>
      <Link
        to={to}
        className={`text-white border-b-2 border-transparent transition duration-300 hover:text-${hoverColor} hover:border-${hoverColor}`}
      >
        {label}
      </Link>
    </li>
  );
}
