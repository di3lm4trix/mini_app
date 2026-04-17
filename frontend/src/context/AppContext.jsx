import {
  createContext,
  useState,
  useEffect,
  useCallback,
  Children,
} from "react";

export const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem("lang") || "en";
  });

  const [translations, setTranslations] = useState({});
  const [translationsLoading, setTranslationsLoading] = useState(true);

  const [user, setUser] = useState(() => {
    // restore user if there was already a session
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const loadTranslations = useCallback(async (languaje) => {
    setTranslationsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/translations/${languaje}`,
      );
      const data = await response.json();
      setTranslations(data);
    } catch (err) {
      console.error("Error loading translations", err);
    } finally {
      setTranslationsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTranslations(lang);
    localStorage.setItem("lang", lang);
  }, [lang, loadTranslations]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  }, [user]);

  const login = (userData, token) => {
    localStorage.setItem("token", token);
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  const switchLang = (newLang) => {
    if (newLang !== lang) setLang(newLang);
  };

  return (
    <AppContext.Provider
      value={{
        lang,
        switchLang,
        translations,
        translationsLoading,
        user,
        login,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
