import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import useTranslations from "../hooks/useTranslations";
import { apiClient } from "../api/client";
import "../styles/login.css";

const FLAG_EN = "https://storage.123fakturere.no/public/flags/GB.png";
const FLAG_SV = "https://storage.123fakturere.no/public/flags/SE.png";
const DIAMONT = "https://storage.123fakturera.se/public/icons/diamond.png";

const NAV_LINKS = [
  { key: "nav_pricing", href: "#" },
  { key: "nav_features", href: "#" },
  { key: "nav_about", href: "#" },
  { key: "nav_contact", href: "#" },
];

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useContext(AppContext);
  const { t, lang, switchLang } = useTranslations();

  const otherLang = lang === "en" ? "sv" : "en";
  const otherFlag = lang === "en" ? FLAG_SV : FLAG_EN;
  const otherLabel = lang === "en" ? "Svenska" : "English";

  return (
    <div className="login-page">
      {/* header */}
      <header className="login-header">
        <img src={DIAMONT} alt="123 Fakturera" className="login-header__logo" />
      </header>
      {/* nav links only in desktop
       */}
      <nav className="login-header__nav">
        {NAV_LINKS.map((link) => (
          <a key={link.key} href={link.href} className="nav-link">
            {/* get the text translation */}
            {t(link.key)}
          </a>
        ))}
      </nav>

      <div className="login-header__right">
        {/* lang selector */}
        <div className="lang_switcher">
          <button
            className="lang-button"
            onClick={() => switchLang(otherLang)}
            aria-label={`Switch to ${otherLabel}`}
          >
            <img src={otherFlag} alt={otherLabel} />
            {otherLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
