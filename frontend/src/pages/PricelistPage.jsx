import { useState, useEffect, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import useTranslations from "../hooks/useTranslations";
import { apiClient } from "../api/client";
import ProductRow from "../components/ProductRow";
import "../styles/pricelist.css";

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
  // constans
  const navigate = useNavigate();
  const { logout, user } = useContext(AppContext);
  const { t, lang, switchLang, translations } = useTranslations();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchArticle, setSearchArticle] = useState("");
  const [searchProduct, setSearchProduct] = useState("");
  const { translationsLoading } = useTranslations();

  const otherLang = lang === "en" ? "sv" : "en";
  const otherFlag = lang === "en" ? FLAG_SV : FLAG_EN;
  const otherLabel = lang === "en" ? "Svenska" : "English";

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await apiClient.get("/api/products");
        setProducts(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);
  const filtered = useMemo(() => {
    return products.filter((p) => {
      const name = translations?.[p.name_key] ?? p.name_key ?? "";
      const artNo = String(p.id).padStart(10, "0");
      return (
        name.toLowerCase().includes(searchProduct.toLowerCase()) &&
        artNo.includes(searchArticle)
      );
    });
  }, [products, translations, searchProduct, searchArticle]);
  // functions
  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  if (translationsLoading) {
    return (
      <p style={{ padding: 20, color: "#888", display: "flex" }}>
        Loading translations...
      </p>
    );
  }
  return (
    <div className="pricelist-page">
      <header className="pl-header">
        <div className="pl-header__group-left">
          <button className="pl-hamburger-mobile">
            <span></span>
            <span></span>
            <span></span>
          </button>
          <div className="pl-header__avatar-container">
            <div className="pl-header__avatar">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
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
        </div>
        <div className="pl-header__right-group">
          <button
            className="pl-header__lang"
            onClick={() => switchLang(otherLang)}
          >
            <span className="lang-text">{otherLabel}</span>
            <img src={otherFlag} alt={otherLabel} />
          </button>
        </div>
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

        <button className="pl-mobile-nav__item" onClick={handleLogout}>
          <span>🔚</span>
          {t("btn_logout")}
        </button>
      </nav>

      {/* body */}
      <div className="pl-body">
        {/* sidebar only desktop */}
        <aside className="pl-sidebar">
          <div className="pl-sidebar__title">Menu</div>
          {SIDEBAR_ITEMS.map((item) => (
            <a
              key={item.key}
              href={item.href}
              className={`pl-sidebar__item ${item.active ? "active" : ""}`}
            >
              <span className="pl-sidebar__icon">{item.icon}</span>
              {t(item.key)}
            </a>
          ))}
          <div className="pl-sidebar__logout">
            <button className="pl-sidebar__item" onClick={handleLogout}>
              <span className="pl-sidebar__icon">🔚</span>
              {t("btn_logout")}
            </button>
          </div>
        </aside>

        <main className="pl-content">
          <div className="pl-toolbar">
            <div className="pl-search-group">
              {/* search article */}
              <div className="pl-search-wrap">
                <input
                  type="text"
                  placeholder={t("search_article")}
                  value={searchArticle}
                  onChange={(e) => setSearchArticle(e.target.value)}
                />

                <span className="pl-search-wrap__icon">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                </span>
              </div>
              {/* search product */}
              <div className="pl-search-wrap">
                <input
                  type="text"
                  placeholder={t("search_product")}
                  value={searchProduct}
                  onChange={(e) => setSearchProduct(e.target.value)}
                />

                <span className="pl-search-wrap__icon">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                </span>
              </div>
            </div>

            <div className="pl-action-btns">
              <button
                className="pl-btn pl-btn--add"
                title={t("btn_new_product")}
              >
                <span className="pl-btn__icon">+</span>
              </button>
              {/* print */}
              <button className="pl-btn" title={t("btn_print")}>
                <span className="pl-btn__printer">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="6 9 6 2 18 2 18 9" />
                    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                    <rect x="6" y="14" width="12" height="8" />
                  </svg>
                </span>
              </button>
              <button className="pl-btn" title={t("btn_advanced")}>
                <span className="pl-btn__toggle">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="17" cy="12" r="3" />
                    <path d="M21 12h-1M7 12H3M17 5V3M17 21v-2M11.22 6.22l-1.42-1.42M18.36 18.36l-1.42-1.42" />
                  </svg>
                </span>
              </button>
            </div>
          </div>

          {/* table */}

          <div className="pl-table-wrap">
            {loading && (
              <p style={{ color: "#888", padding: "20px 0" }}>Loading...</p>
            )}
            {error && (
              <p style={{ color: "#e53224", padding: "20px 0" }}>{error}</p>
            )}
            {!loading && !error && (
              <table className="pl-table">
                <thead>
                  <tr>
                    <th style={{ width: 24 }}></th>
                    <th className="col-article">
                      {t("col_article_no")}
                      <span className="sort-icon">↓</span>
                    </th>
                    <th className="col-article">
                      {t("col_product")}
                      <span className="sort-icon">↓</span>
                    </th>
                    <th className="col-inprice">{t("col_buy_price")}</th>
                    <th>{t("col_sell_price")}</th>
                    <th className="col-unit">{t("col_unit")}</th>
                    <th className="col-instock">{t("col_in_stock")}</th>
                    <th className="col-desc">{t("col_description")}</th>
                    <th></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((product) => (
                    <ProductRow
                      key={product.id}
                      product={product}
                      translations={translations}
                    />
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td
                        colSpan="10"
                        style={{
                          textAlign: "center",
                          padding: "32px",
                          color: "#aaa",
                        }}
                      >
                        {t("no_results")}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default PricelistPage;
