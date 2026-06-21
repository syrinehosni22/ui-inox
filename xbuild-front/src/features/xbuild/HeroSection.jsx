import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { loc } from "./helpers";

const FALLBACK_BG = "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1800&q=80";

export default function HeroSection({ info }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const [typed, setTyped] = useState("");
  const fullText = loc(info, "tagline", lang);
  const phoneHref = info.phone ? `tel:${info.phone.replace(/\s+/g, "")}` : "#";
  const bgImage = info.heroImage || FALLBACK_BG;

  useEffect(() => {
    setTyped("");
    let i = 0;
    const timer = setInterval(() => {
      if (i < fullText.length) { setTyped(fullText.slice(0, i + 1)); i++; }
      else clearInterval(timer);
    }, 40);
    return () => clearInterval(timer);
  }, [fullText]);

  const scrollTo = (href) => document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });

  const heroStats = info.heroStats || {};
  const stats = [
    { value: heroStats.projects  || "45K+", label: t("hero.stats.projects") },
    { value: heroStats.clients   || "25K+", label: t("hero.stats.clients") },
    { value: `${info.yearsExperience}+`,    label: t("hero.stats.experience") },
    { value: heroStats.engineers || "120+", label: t("hero.stats.engineers") },
  ];
  const heroDesc = loc(info, "heroDesc", lang) || t("hero.description", { years: info.yearsExperience });

  return (
    <section id="home" style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <style>{`
        @keyframes kenBurns{from{transform:scale(1)}to{transform:scale(1.07) translate(-1%,1%)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(36px)}to{opacity:1;transform:none}}
        @keyframes accentIn{from{width:0}to{width:100%}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        .hero-tag-line::after{content:'';display:block;width:50px;height:3px;background:var(--c-primary);margin-top:16px}
      `}</style>

      {/* BG */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: `url('${bgImage}')`, backgroundSize: "cover", backgroundPosition: "center", animation: "kenBurns 22s ease-in-out infinite alternate" }} />
      {/* Gradient overlay — strong left darkness for readability */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg,rgba(20,26,40,.97) 2%,rgba(20,26,40,.65) 50%)" }} />
      {/* Yellow accent top line */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "var(--c-primary)", zIndex: 2 }} />
      {/* Left pillar */}
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 6, background: "var(--c-primary)" }} />

      {/* Hero content */}
      <div className="hero-content" style={{ position: "relative", flex: 1, display: "flex", alignItems: "center", maxWidth: 1320, margin: "0 auto", padding: "180px 48px 140px 64px", width: "100%" }}>
        <div style={{ maxWidth: 620 }}>
          {/* Tag */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24, animation: "fadeUp .7s ease .1s both" }}>
            <div style={{ width: 40, height: 3, background: "var(--c-primary)" }} />
            <span style={{ color: "var(--c-primary)", fontFamily: "var(--font-head)", fontSize: 14, fontWeight: 800, letterSpacing: 3, textTransform: "uppercase" }}>
              {t("hero.welcome", { company: info.companyName })}
            </span>
          </div>

          {/* Typed heading */}
          <h1 className="hero-tag-line" style={{
            fontSize: "clamp(40px,5.5vw,76px)", fontWeight: 900, lineHeight: 1.05,
            color: "#fff", fontFamily: "var(--font-head)", margin: "0 0 28px",
            letterSpacing: -1, animation: "fadeUp .9s ease .25s both",
          }}>
            {typed}<span style={{ color: "var(--c-primary)", animation: "blink .8s infinite" }}>|</span>
          </h1>

          <p style={{ color: "rgba(255,255,255,.65)", fontFamily: "var(--font-body)", fontSize: 17, lineHeight: 1.8, maxWidth: 500, margin: "0 0 44px", animation: "fadeUp .9s ease .4s both" }}>
            {heroDesc}
          </p>

          <div className="hero-btns" style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center", animation: "fadeUp .9s ease .55s both" }}>
            <button className="metron-btn-outline" onClick={() => scrollTo("#services")}>
              {t("hero.ourServices")} →
            </button>
            <a className="metron-btn-primary" href={phoneHref}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.36 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.34 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              {info.phone || "Appelez-nous"}
            </a>
          </div>
        </div>
      </div>

      {/* Stats ribbon */}
      <div style={{ position: "relative", background: "var(--c-primary)", width: "100%" }}>
        <div className="hero-stats-bar" style={{ maxWidth: 1320, margin: "0 auto", padding: "0 64px", display: "flex", alignItems: "stretch", flexWrap: "wrap" }}>
          {stats.map((s, i) => (
            <div
              key={i}
              className="hero-stat-card"
              style={{
                flex: 1, padding: "26px 28px", display: "flex", alignItems: "center", gap: 16,
                borderLeft: i === 0 ? "none" : "1px solid rgba(26,31,46,.15)",
                animation: `fadeUp .7s ease ${.8 + i * .12}s both`,
              }}
            >
              <div>
                <div style={{ fontSize: 32, fontWeight: 900, color: "var(--c-dark)", fontFamily: "var(--font-head)", lineHeight: 1 }}>{s.value}</div>
                <div style={{ color: "rgba(26,31,46,.75)", fontFamily: "var(--font-body)", fontSize: 12, marginTop: 4, textTransform: "uppercase", letterSpacing: 1.2, fontWeight: 600 }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}