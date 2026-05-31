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
    <footer className="w-full border-t border-slate-200/50 bg-[#F5F2EC] text-slate-600 transition-theme dark:border-zinc-900/60 dark:bg-[#050508] dark:text-zinc-400">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_0.8fr_0.8fr]">
          <div className="max-w-md space-y-4">
            <Link to="/" className="inline-flex items-center gap-3">
              <img
                src="/logo/futma360_2.png"
                alt="FutMA 360 Logo"
                className="h-9 object-contain brightness-95 dark:brightness-100"
              />
              <span className="text-lg font-extrabold tracking-tight text-[#2C2927] dark:text-white font-heading">
                {siteConfig.name}
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-500 dark:text-zinc-500">
              {siteConfig.tagline}
            </p>
            <p className="text-xs text-slate-400 dark:text-zinc-600">
              {t("footer.rights")}
            </p>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#2C2927] dark:text-zinc-300">
              {t("footer.navigation")}
            </h2>
            <nav className="mt-4">
              <ul className="space-y-2.5 text-sm">
                {navigationLinks.map((item) => (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className="transition-colors hover:text-red-600 dark:hover:text-red-400 text-slate-500 dark:text-zinc-500"
                    >
                      {t(item.key)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#2C2927] dark:text-zinc-300">
              {t("footer.institutional")}
            </h2>
            <div className="mt-4 space-y-2.5 text-sm">
              {institutionalLinks.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="block transition-colors hover:text-red-600 dark:hover:text-red-400 text-slate-500 dark:text-zinc-500"
                >
                  {t(item.key)}
                </Link>
              ))}
              <a
                href={`mailto:${siteConfig.email}`}
                className="block text-blue-600 transition-colors hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
              >
                {t("footer.email")}: {siteConfig.email}
              </a>
              <p className="text-xs text-slate-400 dark:text-zinc-600 mt-2">
                {siteConfig.location}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-300/40 pt-6 text-xs text-slate-400 dark:border-zinc-900/60 dark:text-zinc-600">
          {"\u00A9"} {currentYear} <span className="font-semibold text-slate-700 dark:text-zinc-400">{siteConfig.name}</span>.{" "}
          {t("footer.p1")}
        </div>
      </div>
    </footer>
  );
};
