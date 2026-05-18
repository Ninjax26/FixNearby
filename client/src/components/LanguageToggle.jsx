import { useTranslation } from "react-i18next";

const LanguageToggle = () => {
  const { i18n } = useTranslation();

  const toggle = () => {
    i18n.changeLanguage(
      i18n.language.startsWith("hi") ? "en" : "hi"
    );
  };

  return (
    <button
      onClick={toggle}
      aria-label="Switch language"
      className="px-3 py-1 text-sm font-semibold rounded-lg border border-slate-300 hover:bg-slate-100 transition"
    >
      {i18n.language.startsWith("hi")
        ? "English"
        : "हिंदी"}
    </button>
  );
};

export default LanguageToggle;