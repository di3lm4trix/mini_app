import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import useTranslations from "../hooks/useTranslations";
import useWindowWidth from "../hooks/useWindowWidth";
import { apiClient } from "../api/client";
import ProductRow from "../components/ProductRow";
import "../styles/pricelist.css";

import { useState, useEffect, useContext, useMemo, useRef } from "react";

// flags links
const FLAG_EN = "https://storage.123fakturere.no/public/flags/GB.png";
const FLAG_SV = "https://storage.123fakturere.no/public/flags/SE.png";

// list of the sidebar buttons
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
  // this is used to manage the lang
  const { t, lang, switchLang, translations, translationsLoading } =
    useTranslations();
  const langRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchArticle, setSearchArticle] = useState("");
  const [searchProduct, setSearchProduct] = useState("");
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const actualFlag = lang === "en" ? FLAG_EN : FLAG_SV;
  const actualLang = lang === "en" ? "English" : "Svenska";
  const WindowWidth = useWindowWidth();
  const isTablet = WindowWidth >= 768 && WindowWidth < 1280;

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

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
    // la pagina entera
    <div className="pricelist-page">
      <header className="pl-header">
        {/* MOBILE */}
        <div className="pl-header-mobile">
          <button className="pl-hamburger-mobile">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        <div className="pl-header__group-left">
          <div className="pl-header__avatar-container">
            <div className="pl-header__avatar">
              <img src="/assets/avatar.ico" alt="" />
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
          <div className="pl-lang-wrapper" ref={langRef}>
            <button
              className="pl-header__lang"
              onClick={() => setLangMenuOpen((v) => !v)}
            >
              <span className="lang-text">{actualLang}</span>
              <img src={actualFlag} alt={actualLang} />
            </button>

            <nav
              className={`pl-lang-dropdown ${langMenuOpen ? "is-open" : ""}`}
            >
              <a
                onClick={() => {
                  switchLang("en");
                  setLangMenuOpen(false);
                }}
              >
                <p>English</p>
                <img src={FLAG_EN} alt="English" />
              </a>
              <a
                onClick={() => {
                  switchLang("sv");
                  setLangMenuOpen(false);
                }}
              >
                <p>Svenska</p>
                <img src={FLAG_SV} alt="Svenska" />
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* body include a si*/}
      {/* sidebar only desktop */}
      <aside className="pl-sidebar">
        <div className="pl-sidebar__title">{t("sidebar_title")}</div>
        {SIDEBAR_ITEMS.map((item) => (
          <a
            key={item.key}
            href={item.href}
            className={`pl-sidebar__item ${item.active ? "active" : ""}`}
          >
            <span className="pl-sidebar__active-dot"></span>
            <span className="pl-sidebar__icon">{item.icon}</span>
            {t(item.key)}
          </a>
        ))}
        <div className="pl-sidebar__logout">
          <button className="pl-sidebar__item" onClick={handleLogout}>
            <span className="pl-sidebar__active-dot"></span>
            <span className="pl-sidebar__icon">🔚</span>
            {t("btn_logout")}
          </button>
        </div>
      </aside>
      {/* contenido principal */}
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
                <img src="/assets/search.svg" alt="" />
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
                <img src="/assets/search.svg" alt="" />
              </span>
            </div>
          </div>

          <div className="pl-action-btns">
            <button className="pl-btn" title={t("btn_new_product")}>
              <p>{t("new_product_button")}</p>
              <img
                className="pl-btn__icon pl-btn__icon--add"
                src="/assets/add.svg"
              />
            </button>
            <button className="pl-btn" title={t("btn_print")}>
              <p>{t("print_button")}</p>

              <img
                className="pl-btn__icon pl-btn__icon--print"
                src="/assets/printer.svg"
              />
            </button>
            <button className="pl-btn" title={t("btn_advanced")}>
              <p>{t("btn_advanced")}</p>

              <img
                className="pl-btn__icon pl-btn__icon--toggle"
                src="/assets/advanced_mode.svg"
              />
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
                  <th className="col-article">{t("col_article_no")}</th>
                  <th className="td-product">{t("col_product")}</th>
                  <th className="col-inprice">{t("col_buy_price")}</th>
                  <th className="td-price">{t("col_sell_price")}</th>

                  {isTablet ? (
                    <>
                      <th className="col-instock">{t("col_in_stock")}</th>
                      <th className="col-unit">{t("col_unit")}</th>
                    </>
                  ) : (
                    <>
                      <th className="col-unit">{t("col_unit")}</th>
                      <th className="col-instock">{t("col_in_stock")}</th>
                    </>
                  )}

                  <th className="col-desc">{t("col_description")}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((product) => (
                  <ProductRow
                    key={product.id}
                    product={product}
                    translations={translations}
                    reorderColumns={isTablet}
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
  );
};

export default PricelistPage;
