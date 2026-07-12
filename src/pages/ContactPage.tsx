import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Mail, MapPin, SendHorizontal } from "lucide-react";
import { siteConfig } from "../lib/site";
import { useSEO } from "../hooks/useSEO";

export const ContactPage = () => {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  // Dynamic Page-level SEO
  useSEO({
    title: t("contact.title"),
    description: t("contact.description"),
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const subject = encodeURIComponent(`${form.name} - FutMA 360`);
    const body = encodeURIComponent(
      [
        `${t("contact.name")}: ${form.name}`,
        `${t("contact.email")}: ${form.email}`,
        "",
        form.message,
      ].join("\n")
    );

    window.location.href = `mailto:${siteConfig.email}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_50%_0%,_rgba(239,68,68,0.03),_transparent_28%)] px-6 py-12 md:py-20 transition-theme animate-fade-in-up">
      <div className="mx-auto max-w-4xl space-y-12">
        
        <div className="max-w-2xl space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white md:text-5xl font-heading leading-tight">
            {t("contact.title")}
          </h1>
          <p className="text-base leading-relaxed text-slate-600 dark:text-zinc-400">
            {t("contact.description")}
          </p>
        </div>

        <div className="grid items-start gap-12 md:grid-cols-[1.1fr_0.9fr] pt-4">
          
          {/* Cardless floating Form with minimal underline inputs */}
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white font-heading">{t("contact.formTitle")}</h2>
              <p className="text-xs text-slate-400 dark:text-zinc-550">{t("contact.helper")}</p>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="name" className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                {t("contact.name")}
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full border-b border-slate-300 dark:border-zinc-800 bg-transparent rounded-none px-1 py-2 text-sm text-slate-800 dark:text-white focus:border-red-500 focus:outline-none transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                {t("contact.email")}
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full border-b border-slate-300 dark:border-zinc-800 bg-transparent rounded-none px-1 py-2 text-sm text-slate-800 dark:text-white focus:border-red-500 focus:outline-none transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="message" className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                {t("contact.message")}
              </label>
              <textarea
                id="message"
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={4}
                required
                className="w-full border-b border-slate-300 dark:border-zinc-800 bg-transparent rounded-none px-1 py-2 text-sm text-slate-800 dark:text-white focus:border-red-500 focus:outline-none transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
            >
              <SendHorizontal size={16} />
              {t("contact.send")}
            </button>
          </form>

          {/* Floating Details panel */}
          <div className="space-y-10 border-t md:border-t-0 md:border-l border-slate-200/60 dark:border-zinc-900/60 pt-10 md:pt-0 md:pl-12">
            
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white font-heading">{t("contact.infoTitle")}</h2>

              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-red-500/10 p-2.5 text-red-600 dark:bg-red-500/15 dark:text-red-400 animate-pulse">
                  <Mail size={18} />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-800 dark:text-zinc-200">{t("contact.directEmail")}</p>
                  <p className="text-xs text-slate-450 dark:text-zinc-500">{t("contact.directEmailDescription")}</p>
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="inline-block text-sm font-bold text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 pt-1"
                  >
                    {siteConfig.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-red-500/10 p-2.5 text-red-600 dark:bg-red-500/15 dark:text-red-400">
                  <MapPin size={18} />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-800 dark:text-zinc-200">{t("contact.location")}</p>
                  <p className="text-xs text-slate-450 dark:text-zinc-550 font-medium">{siteConfig.location}</p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200/60 dark:border-zinc-900/60">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-550">
                {t("contact.responseTime")}
              </p>
              <p className="mt-2.5 text-xs leading-relaxed text-slate-500 dark:text-zinc-400 font-semibold">{t("contact.responseTimeDescription")}</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
export default ContactPage;
