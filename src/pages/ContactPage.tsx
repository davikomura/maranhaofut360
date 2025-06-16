import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Mail, Phone, MapPin } from "lucide-react";

export const ContactPage = () => {
  const { t } = useTranslation();

  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você pode integrar com EmailJS, Formspree ou backend
    console.log(form);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-black via-gray-900 to-black text-gray-100 py-16 px-6">
      <div className="max-w-5xl mx-auto space-y-12">
        <h1 className="text-4xl font-bold text-center text-red-500 drop-shadow-md">
          {t("contact.title") || "Entre em Contato"}
        </h1>

        <div className="grid md:grid-cols-2 gap-10 items-start">
          <form
            onSubmit={handleSubmit}
            className="bg-gray-950 rounded-2xl shadow-xl p-8 space-y-6 border border-gray-800"
          >
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                {t("contact.name") || "Nome"}
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">
                {t("contact.email") || "Email"}
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">
                {t("contact.message") || "Mensagem"}
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={5}
                required
                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition"
            >
              {t("contact.send") || "Enviar Mensagem"}
            </button>

            {submitted && (
              <div className="text-green-400 text-sm text-center mt-2">
                {t("contact.success") || "Mensagem enviada com sucesso!"}
              </div>
            )}
          </form>

          <div className="space-y-6 text-sm">
            <div className="bg-gray-950 border border-gray-800 rounded-2xl p-6 shadow-lg space-y-4">
              <h2 className="text-lg font-semibold text-blue-400">{t("contact.info") || "Informações"}</h2>
              <div className="flex items-center gap-3">
                <Mail className="text-red-400 w-5 h-5" />
                <span>davi.komura@gmail.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="text-red-400 w-5 h-5" />
                <span>+55 (98) 90000-0000</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="text-red-400 w-5 h-5" />
                <span>São Luís - MA, Brasil</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
