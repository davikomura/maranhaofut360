import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Mail, MapPin, SendHorizontal } from "lucide-react";
import { siteConfig } from "../lib/site";

export const ContactPage = () => {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: "", email: "", message: "" });

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
    <div className="min-h-screen bg-gradient-to-r from-black via-gray-900 to-black px-6 py-16 text-gray-100">
      <div className="mx-auto max-w-5xl space-y-10">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold text-red-500 drop-shadow-md">{t("contact.title")}</h1>
          <p className="mt-4 text-base leading-7 text-gray-300">{t("contact.description")}</p>
        </div>

        <div className="grid items-start gap-10 md:grid-cols-[1.1fr_0.9fr]">
          <form
            onSubmit={handleSubmit}
            className="space-y-6 rounded-[1.75rem] border border-gray-800 bg-gray-950 p-8 shadow-xl"
          >
            <div>
              <h2 className="text-xl font-semibold text-white">{t("contact.formTitle")}</h2>
              <p className="mt-2 text-sm text-gray-400">{t("contact.helper")}</p>
            </div>

            <div>
              <label htmlFor="name" className="mb-1 block text-sm text-gray-400">
                {t("contact.name")}
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full rounded-lg bg-gray-800 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-1 block text-sm text-gray-400">
                {t("contact.email")}
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full rounded-lg bg-gray-800 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label htmlFor="message" className="mb-1 block text-sm text-gray-400">
                {t("contact.message")}
              </label>
              <textarea
                id="message"
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={6}
                required
                className="w-full rounded-lg bg-gray-800 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 py-3 font-bold text-white transition hover:bg-red-700"
            >
              <SendHorizontal size={18} />
              {t("contact.send")}
            </button>
          </form>

          <div className="space-y-6 text-sm">
            <div className="space-y-4 rounded-[1.75rem] border border-gray-800 bg-gray-950 p-6 shadow-lg">
              <h2 className="text-xl font-semibold text-blue-400">{t("contact.infoTitle")}</h2>

              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-5 w-5 text-red-400" />
                <div>
                  <p className="font-medium text-white">{t("contact.directEmail")}</p>
                  <p className="mt-1 text-gray-400">{t("contact.directEmailDescription")}</p>
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="mt-2 inline-block text-blue-400 transition hover:text-blue-300"
                  >
                    {siteConfig.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 text-red-400" />
                <div>
                  <p className="font-medium text-white">{t("contact.location")}</p>
                  <p className="mt-1 text-gray-400">{siteConfig.location}</p>
                </div>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-gray-800 bg-black/30 p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-gray-500">
                {t("contact.responseTime")}
              </p>
              <p className="mt-3 leading-7 text-gray-300">{t("contact.responseTimeDescription")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
