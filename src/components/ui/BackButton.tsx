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
      className="inline-flex items-center gap-2 rounded-full border border-gray-700 bg-gray-900/80 px-4 py-2 text-sm font-medium text-gray-200 transition hover:border-blue-500 hover:text-white"
    >
      <ArrowLeft size={16} />
      {t("common.back")}
    </button>
  );
}
