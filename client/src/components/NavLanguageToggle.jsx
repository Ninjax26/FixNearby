import { useTranslation } from "react-i18next";

const NavLanguageToggle = () => {
  const { i18n } = useTranslation();

  const toggle = () => {
    const newLang = i18n.language === "hi" ? "en" : "hi";
    i18n.changeLanguage(newLang);
    localStorage.setItem("language", newLang);
  };

  const currentLangLabel = i18n.language === "hi" ? "हिंदी (Hindi)" : "English";
  const targetLangLabel = i18n.language === "hi" ? "English" : "हिंदी";

  return (
    <button
      onClick={toggle}
      aria-label={`Switch language from ${currentLangLabel} to ${targetLangLabel}`}
      className="px-3 py-1.5 text-sm font-semibold rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 dark:text-white transition"
    >
      {i18n.language === "hi" ? "English" : "हिंदी"}
    </button>
  );
};

export default NavLanguageToggle;
