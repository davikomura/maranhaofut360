import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function BackButton() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <button
      type="button"
      onClick={() => navigate(-1)}
      className="inline-flex items-center gap-2 rounded-full border border-slate-200/50 bg-[#F5F2EC]/80 px-4 py-2 text-xs font-bold text-slate-700 transition hover:bg-[#F5F2EC] hover:text-red-650 dark:border-zinc-800/60 dark:bg-zinc-900/60 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-red-400"
    >
      <ArrowLeft size={14} />
      {t("common.back")}
    </button>
  );
}
export default BackButton;
