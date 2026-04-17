import { useContext } from "react";
import { AppContext } from "../context/AppContext";

const useTranslations = () => {
  const { translations, lang, switchLang, translationsLoading } =
    useContext(AppContext);

  // t "btn_login" → "Log in" or "Logga in"
  // if the key doenst exists, return the same key
  const t = (key) => translations[key] ?? key;
  return { t, lang, switchLang, translationsLoading };
};

export default useTranslations;
