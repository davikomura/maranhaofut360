import { Link, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LanguageDropdown } from "../components/LanguageDropdown";
import { fixDisplayText } from "../utils/text";

export default function Header() {
  const { t } = useTranslation();

  return (
    <header className="bg-gradient-to-r from-black via-gray-900 to-black text-white shadow-md border-b border-red-600">
      <div className="container mx-auto flex items-center justify-between px-4 md:px-8 py-4">
        <Link to="/" title="FutMA 360 - Página inicial" className="flex items-center gap-3">
          <img
            src="/logo/futma360_2.png"
            alt="FutMA 360 Logo"
            className="h-12 md:h-16 object-contain drop-shadow transition-transform duration-300 hover:scale-105"
          />
        </Link>

        <div className="flex items-center gap-4 md:gap-8">
          <nav>
            <ul className="flex items-center gap-4 md:gap-6 text-sm md:text-lg font-semibold">
              <NavItem to="/" label={t("nav.home")} accentClass="border-red-500 text-red-400" />
              <NavItem to="/teams" label={t("nav.teams")} accentClass="border-blue-500 text-blue-400" />
              <NavItem to="/about" label={t("nav.about")} accentClass="border-yellow-400 text-yellow-300" />
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
  accentClass: string;
};

function NavItem({ to, label, accentClass }: NavItemProps) {
  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) =>
          [
            "text-white border-b-2 transition duration-300",
            isActive
              ? accentClass
              : "border-transparent hover:border-current hover:text-white/80",
          ].join(" ")
        }
      >
        {fixDisplayText(label)}
      </NavLink>
    </li>
  );
}
