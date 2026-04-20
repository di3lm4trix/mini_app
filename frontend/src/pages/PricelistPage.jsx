import { useState, useEffect, useContext } from "react";
import {
  href,
  UNSAFE_createClientRoutesWithHMRRevalidationOptOut,
  useNavigate,
} from "react-router-dom";
import { AppContext } from "../context/AppContext";
import useTranslations from "../hooks/useTranslations";

const FLAG_EN = "https://storage.123fakturere.no/public/flags/GB.png";
const FLAG_SV = "https://storage.123fakturere.no/public/flags/SE.png";

const SIDEBAR_ITEMS = [
  { key: "nav_invoices", icon: "🗒", href: "#" },
  { key: "nav_customers", icon: "👤", href: "#" },
  { key: "nav_my_business", icon: "⚙", href: "#" },
  { key: "nav_invoice_journal", icon: "📋", href: "#" },
  { key: "pricelist_title", icon: "🏷", href: "#", active: true },
  { key: "nav_multiple_invoice", icon: "📄", href: "#" },
  { key: "nav_unpaid", icon: "❌", href: "#" },
  { key: "nav_offer", icon: "📦", href: "#" },
];

const PricelistPage = () => {
  const navigate = useNavigate();
  const { logout, user } = useContext(AppContext);
  const { t, lang, switchLang, translations } = useTranslations();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchArticle, setSearchArticle] = useState("");
  const [searchProduct, setSearchProduct] = useState("");

  const otherLang = lang === "en" ? "sv" : "en";
  const otherFlag = lang === "en" ? FLAG_SV : FLAG_EN;
  const otherLabel = lang === "en" ? "Svenska" : "English";

  return (
    <div className="pricelist-page">
      <header className="pe-header">
        <div className="pl-header__left">
          <div className="pl-header__user">
            <div
              className="pl-header__avatar"
              style={{
                background: "#90caf9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                />
              </svg>
            </div>
            <div className="pl-header__user-info">
              <div className="pl-header__username">
                {user?.username ?? "Admin"}
              </div>
              <div className="pl-header__company">Storfjord AS</div>
            </div>
          </div>
          <button
            className={`pl-hamburger ${menuOpen ? "is-open" : ""}`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <span className="pl-hamburger__line"></span>
            <span className="pl-hamburger__line"></span>
            <span className="pl-hamburger__line"></span>
          </button>
        </div>
        <button
          className="pl-header__lang"
          onClick={() => switchLang(otherLang)}
          aria-label={`Switch to ${otherLabel}`}
        >
          {otherLabel}
          <img src={otherFlag} alt={otherLabel} />
        </button>
      </header>
      {/* mobile menu */}
      <nav className={`pl-mobile-nav ${menuOpen ? "is-open" : ""}`}>
        {SIDEBAR_ITEMS.map((item) => (
          <a
            key={item.key}
            href={item.href}
            className="pl-mobile-nav__item"
            onClick={() => setMenuOpen(false)}
          >
            <span>{item.icon}</span>
            {t(item.key)}
          </a>
        ))}

        <button className="pl-mobile-nav__item"></button>
      </nav>
    </div>
  );
};

export default PricelistPage;
