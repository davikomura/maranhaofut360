import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { siteConfig } from "../lib/site";

const navigationLinks = [
  { to: "/", key: "nav.home" },
  { to: "/teams", key: "nav.teams" },
  { to: "/serie-a", key: "nav.serieA" },
  { to: "/serie-b", key: "nav.serieB" },
  { to: "/campeoes", key: "nav.champions" },
];

const institutionalLinks = [
  { to: "/about", key: "nav.about" },
  { to: "/contact", key: "footer.contact" },
];

export const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-red-600 bg-gradient-to-r from-black via-gray-950 to-black text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_0.8fr_0.8fr]">
          <div className="max-w-md">
            <Link to="/" className="inline-flex items-center gap-3">
              <img
                src="/logo/futma360_2.png"
                alt="FutMA 360 Logo"
                className="h-12 object-contain"
              />
              <span className="text-lg font-semibold text-white">{siteConfig.name}</span>
            </Link>
            <p className="mt-4 text-sm leading-7 text-gray-400">{siteConfig.tagline}</p>
            <p className="mt-3 text-sm leading-7 text-gray-500">{t("footer.rights")}</p>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
              {t("footer.navigation")}
            </h2>
            <nav className="mt-4">
              <ul className="space-y-3 text-sm">
                {navigationLinks.map((item) => (
                  <li key={item.to}>
                    <Link to={item.to} className="transition hover:text-white">
                      {t(item.key)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
              {t("footer.institutional")}
            </h2>
            <div className="mt-4 space-y-3 text-sm">
              {institutionalLinks.map((item) => (
                <Link key={item.to} to={item.to} className="block transition hover:text-white">
                  {t(item.key)}
                </Link>
              ))}
              <a
                href={`mailto:${siteConfig.email}`}
                className="block text-blue-400 transition hover:text-blue-300"
              >
                {t("footer.email")}: {siteConfig.email}
              </a>
              <p className="text-gray-500">{siteConfig.location}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-5 text-sm text-gray-500">
          {"\u00A9"} {currentYear} <span className="text-gray-300">{siteConfig.name}</span>.{" "}
          {t("footer.p1")}
        </div>
      </div>
    </footer>
  );
};
