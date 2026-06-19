import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { NAV_LINKS_KEYS } from "./data";
import { loc } from "./helpers";
import LanguageSwitcher from "../../i18n/LanguageSwitcher";
import Logo from "./Logo";

export default function Navbar({ active, info }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const NAV_LINKS = NAV_LINKS_KEYS.map(l => ({ ...l, label: t(`nav.${l.key}`) }));

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const scrollTo = (href) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };


  const socials = [
    { label: "f", key: "socialFacebook", href: info.socialFacebook },
    { label: "𝕏", key: "socialTwitter",  href: info.socialTwitter },
    { label: "▶", key: "socialYoutube",  href: info.socialYoutube },
    { label: "in",key: "socialLinkedin", href: info.socialLinkedin },
  ].filter(s => info[`${s.key}Active`] !== false);

  return (
    <>
      {/* Top utility bar */}
      <div
        className="topbar-desktop"
        style={{
          background: "var(--c-dark)",
          borderBottom: "1px solid rgba(255,255,255,.08)",
          padding: "8px 0",
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 1001,
          display: scrolled ? "none" : "block",
        }}
      >
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
            {[
              { icon: "📍", text: info.address },
              { icon: "✉", text: info.email },
            ].map((item, i) => (
              <span key={i} style={{ color: "rgba(255,255,255,.6)", fontFamily: "var(--font-body)", fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ color: "var(--c-primary)" }}>{item.icon}</span>
                {item.text}
              </span>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {[
              { label: t("topbar.careers") || "Careers", href: "#" },
              { label: t("topbar.contact") || "Contact", href: "#contact" },
            ].map((l, i) => (
              <button key={i} onClick={() => scrollTo(l.href)}
                style={{ background: "none", border: "none", color: "rgba(255,255,255,.5)", fontFamily: "var(--font-body)", fontSize: 12, cursor: "pointer", padding: "0 8px" }}
                onMouseEnter={e => e.currentTarget.style.color = "var(--c-primary)"}
                onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,.5)"}
              >{l.label}</button>
            ))}
            <div style={{ width: 1, height: 14, background: "rgba(255,255,255,.15)", margin: "0 6px" }} />
            <LanguageSwitcher dark={true} />
            {socials.map((s, i) => (
              <a key={i} href={s.href} target="_blank" rel="noreferrer"
                style={{ width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(255,255,255,.15)", color: "rgba(255,255,255,.6)", fontSize: 11, fontWeight: 700, textDecoration: "none", transition: "all .2s" }}
                onMouseEnter={e => { e.currentTarget.style.background = "var(--c-primary)"; e.currentTarget.style.color = "var(--c-dark)"; e.currentTarget.style.borderColor = "var(--c-primary)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "rgba(255,255,255,.6)"; e.currentTarget.style.borderColor = "rgba(255,255,255,.15)"; }}
              >{s.label}</a>
            ))}
          </div>
        </div>
      </div>

      {/* Main nav */}
      <header style={{
        position: "fixed",
        top: scrolled ? 0 : 37,
        left: 0, right: 0, zIndex: 1000,
        background: "var(--c-dark2)",
        borderBottom: "2px solid var(--c-primary)",
        transition: "top .3s, box-shadow .3s",
        boxShadow: scrolled ? "0 4px 30px rgba(0,0,0,.4)" : "none",
      }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 108 }}>
          <button onClick={() => scrollTo("#home")} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", height: "100%" }}>
            <Logo info={info} dark size="md" />
          </button>

          <nav style={{ display: "flex", gap: 0, alignItems: "stretch", height: 108 }} className="desktop-nav">
            {NAV_LINKS.map(link => (
              <button
                key={link.key}
                onClick={() => scrollTo(link.href)}
                style={{
                  background: active === link.href ? "var(--c-primary)" : "none",
                  border: "none",
                  color: active === link.href ? "var(--c-dark)" : "#bbc",
                  fontFamily: "var(--font-head)",
                  fontWeight: 700, fontSize: 15,
                  letterSpacing: 1, textTransform: "uppercase",
                  cursor: "pointer",
                  padding: "0 22px",
                  transition: "all .2s",
                  height: "100%",
                  display: "flex", alignItems: "center",
                  borderBottom: "none",
                }}
                onMouseEnter={e => { if (active !== link.href) { e.currentTarget.style.background = "rgba(255,255,255,.07)"; e.currentTarget.style.color = "#fff"; } }}
                onMouseLeave={e => { if (active !== link.href) { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "#bbc"; } }}
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="navbar-actions" style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button
              onClick={() => scrollTo("#contact")}
              className="get-quote-btn"
              style={{
                background: "var(--c-primary)", color: "var(--c-dark)",
                fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 13,
                letterSpacing: 1, textTransform: "uppercase",
                padding: "11px 22px", textDecoration: "none",
                display: "flex", alignItems: "center", gap: 8,
                border: "none", cursor: "pointer",
                clip_path: "polygon(0 0,calc(100% - 10px) 0,100% 100%,0 100%)",
              }}
            >
              {t("navbar.getQuote")}
            </button>
            <a href="/admin"
              className="admin-btn"
              style={{ background: "rgba(255,255,255,.08)", color: "#fff", border: "1px solid rgba(255,255,255,.12)", padding: "10px 16px", fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 13, textDecoration: "none" }}
            >{t("navbar.admin")}</a>
            <button className="mobile-menu-btn" onClick={() => setMobileOpen(o => !o)} style={{ background: "none", border: "none", color: "#fff", fontSize: 22, cursor: "pointer", display: "none" }}>☰</button>
          </div>
        </div>

        {mobileOpen && (
          <div style={{ background: "var(--c-dark)", borderTop: "1px solid rgba(255,255,255,.1)", padding: "16px 24px", display: "flex", flexDirection: "column", gap: 2 }}>
            {NAV_LINKS.map(link => (
              <button key={link.key} onClick={() => scrollTo(link.href)}
                style={{ background: "none", border: "none", color: "#bbc", textAlign: "left", fontFamily: "var(--font-head)", fontSize: 15, letterSpacing: 1, textTransform: "uppercase", fontWeight: 700, cursor: "pointer", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,.06)" }}
              >{link.label}</button>
            ))}
            <div style={{ paddingTop: 12 }}><LanguageSwitcher dark={true} /></div>
            <button onClick={() => scrollTo("#contact")} style={{ marginTop: 8, background: "var(--c-primary)", color: "var(--c-dark)", padding: "12px", fontFamily: "var(--font-head)", fontWeight: 800, letterSpacing: 1, textAlign: "center", border: "none", cursor: "pointer", textTransform: "uppercase" }}>
              {t("navbar.getQuote")}
            </button>
            <a href="/admin" style={{ marginTop: 6, background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.12)", color: "#fff", padding: "10px 12px", fontFamily: "var(--font-head)", fontWeight: 700, textDecoration: "none" }}>{t("navbar.admin")}</a>
          </div>
        )}
      </header>
    </>
  );
}