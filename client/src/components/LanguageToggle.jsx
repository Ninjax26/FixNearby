import { useTranslation } from "react-i18next";

const LanguageToggle = () => {
  const { i18n } = useTranslation();

  const toggle = () => {
  const newLang = i18n.language === "hi" ? "en" : "hi";

  i18n.changeLanguage(newLang);
  localStorage.setItem("language", newLang);  
};
  return (
    <button
      onClick={toggle}
      aria-label="Switch language"
      className="px-3 py-1 text-sm font-semibold rounded-lg border border-slate-300 hover:bg-slate-100 transition"
    >
      {i18n.language === "hi" ? "English" : "हिंदी"}
    </button>
  );
};

export default LanguageToggle;