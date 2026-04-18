import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import useTranslations from "../hooks/useTranslations";
import { apliClient } from "../api/client";
import "../styles/login.css";
import { link } from "../../../backend/src/routes/auth.routes";

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
  const { t, lang, switchLang } = useTranslations;
};

return (
  <div className="login-page">
    {/* header */}
    <header className="login-header">
      <img src={DIAMONT} alt="123 Fakturera" className="login-header__logo" />
    </header>
{/* nav links only in desktop
 */}
    <nav className="login-header__nav">
      {NAV_LINKS.map((link) => {
        <a key={link.key} href={link.href} className="nav-link">
            {t.(link.key)}
        </a>;
      })}


    </nav>
  </div>
);
