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
  { key: "nav_home", href: "#" },
  { key: "nav_order", href: "#" },
  { key: "nav_customers", href: "#" },
  { key: "nav_about_us", href: "#" },
  { key: "nav_contact_us", href: "#" },
];

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useContext(AppContext);
  const { t, lang, switchLang } = useTranslations();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const otherLang = lang === "en" ? "sv" : "en";
  const otherFlag = lang === "en" ? FLAG_SV : FLAG_EN;
  const otherLabel = lang === "en" ? "Svenska" : "English";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    // verurfy the existense of user and password
    if (!username.trim() || !password.trim()) {
      setError(t("missing_fields"));
      return;
    }
    // change the status to loading
    setLoading(true);

    try {
      const data = await apiClient.post("/api/auth/login", {
        username,
        password,
      });
      login(data.user, data.token);
      navigate("/pricelist", { replace: true });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* header */}
      <header className="login-header">
        <img src={DIAMONT} alt="123 Fakturera" className="login-header__logo" />

        {/* nav links only in desktop
         */}
        <nav className="login-header__nav">
          {NAV_LINKS.map((link) => (
            <a key={link.key} href={link.href} className="nav-link">
              {/* get the text translation */}
              {t(link.key)}
            </a>
          ))}

          <button className="nav-lang" onClick={() => switchLang(otherLang)}>
            {otherLabel}
            <img src={otherFlag} alt={otherLabel} />
          </button>
        </nav>

        {/* right group */}
        <div className="login-header__right">
          <button
            className="mobile-lang-btn"
            onClick={() => switchLang(otherLang)}
          >
            {otherLabel}
            <img src={otherFlag} alt={otherLabel} />
          </button>
          {/* hamburguer button */}

          <button
            className={`hamburguer ${menuOpen ? "is-open" : ""}`}
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {/* the lines of the button */}
            <span className="hamburguer__line"></span>
            <span className="hamburguer__line"></span>
            <span className="hamburguer__line"></span>
          </button>

          <nav className={`mobile-dropdown ${menuOpen ? "is-open" : ""}`}>
            {NAV_LINKS.map((link) => (
              <a
                key={link.key}
                href={link.href}
                className="mobile-nav__item"
                onClick={() => setMenuOpen(false)}
              >
                {t(link.key)}
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* card */}
      <main className="login-main">
        <div className="login-card">
          <h1 className="login-card__title">{t("login_title")}</h1>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            {error && (
              <div className="login-error" role="alert">
                {error}
              </div>
            )}

            {/* username */}

            <div className="form-field">
              <label htmlFor="username">
                {t("label_username_description")}
              </label>
              <input
                id="username"
                type="text"
                placeholder={t("label_username")}
                autoComplete="username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
                disabled={loading}
              />
            </div>

            {/* password */}
            <div className="form-field">
              <label htmlFor="password">
                {t("label_password_description")}
              </label>
              <div className="password-wrapper">
                <input
                  id="password"
                  type={showPass ? "text" : "password"}
                  placeholder={t("label_password")}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPass((v) => !v)}
                  aria-label={showPass ? "Hide password" : "Show password"}
                >
                  {showPass ? (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"></path>
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"></path>
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-login" disabled={loading}>
              {loading ? "..." : t("btn_login")}
            </button>
          </form>
          <div className="login-links">
            <a href="#">{t("create_account")}</a>
            <a href="#">{t("forgot_password")}</a>
          </div>
        </div>
      </main>
      <footer className="login-footer">
        <div className="footer-top">
          <span className="footer-logo">123 Fakturera</span>
          <nav className="foter-nav">
            <a href="#">{t("footer_home")}</a>
            <a href="#">{t("footer_order")}</a>
            <a href="#">{t("footer_contact_us")}</a>
          </nav>
        </div>
        <div className="footer-divider"></div>
        <div className="footer-bottom">{t("footer_copyright")}</div>
      </footer>
    </div>
  );
};
export default LoginPage;
