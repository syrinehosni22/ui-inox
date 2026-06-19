import { useTranslation } from "react-i18next";
import { useIntersect } from "./hooks";
import { loc } from "./helpers";
import SectionTitle from "./SectionTitle";

export default function AboutSection({ info }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const [ref, visible] = useIntersect();
  const features = (info.aboutFeatures && info.aboutFeatures.length
    ? info.aboutFeatures
    : ["satisfaction","certified","flexible","safety"].map(k => ({ text_fr: t(`about.features.${k}`, { lng: "fr" }), text_en: t(`about.features.${k}`, { lng: "en" }) }))
  ).map(f => loc(f, "text", lang));

  const aboutTag       = loc(info, "aboutTag", lang)        || t("about.tag");
  const aboutTitle     = loc(info, "aboutTitle", lang)      || t("about.title");
  const exploreMore    = loc(info, "aboutExploreMore", lang)|| t("about.exploreMore");
  const ceoLabel       = loc(info, "aboutCeoLabel", lang)   || t("about.ceoLabel");
  const industrialLbl  = loc(info, "aboutIndustrialLabel", lang) || t("about.industrialLabel");
  const awardTitle     = loc(info, "aboutAwardTitle", lang) || t("about.awardTitle");
  const awardSub       = loc(info, "aboutAwardSub", lang)   || t("about.awardSub");

  return (
    <section id="about" ref={ref} className="section-padding" style={{ padding: "100px 0", background: "#fff", position: "relative" }}>
      {/* Left accent strip */}
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 6, background: "var(--c-primary)" }} />

      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 24px" }}>
        <div className="about-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>

          {/* Left */}
          <div style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateX(-40px)", transition: "all .8s" }}>
            <SectionTitle tag={aboutTag} title={aboutTitle} />
            <p style={{ color: "var(--c-text)", fontFamily: "var(--font-body)", fontSize: 16, lineHeight: 1.8, marginBottom: 32 }}>
              {loc(info, "about", lang)}
            </p>

            {/* Feature checklist — two columns */}
            <div className="about-features-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 40 }}>
              {features.map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <div style={{ width: 24, height: 24, background: "var(--c-primary)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ color: "var(--c-dark)", fontSize: 13, fontWeight: 900 }}>✓</span>
                  </div>
                  <span style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 14, color: "var(--c-dark)" }}>{item}</span>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
              <button
                className="metron-btn-primary"
                onClick={() => document.querySelector("#services")?.scrollIntoView({ behavior: "smooth" })}
              >
                {exploreMore}
              </button>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 52, height: 52, background: "var(--c-dark)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>👷</div>
                <div>
                  <p style={{ color: "var(--c-primary)", fontFamily: "var(--font-head)", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>{ceoLabel}</p>
                  <h4 style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 17, color: "var(--c-dark)" }}>{info.ceoName}</h4>
                </div>
              </div>
            </div>
          </div>

          {/* Right — image */}
          <div style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateX(40px)", transition: "all .8s .2s", position: "relative" }}>
            {/* Years badge */}
            <div style={{ position: "absolute", top: -18, left: -18, background: "var(--c-primary)", padding: "20px 22px", zIndex: 2, boxShadow: "6px 6px 0 var(--c-dark)" }}>
              <div style={{ color: "var(--c-dark)", fontFamily: "var(--font-head)", fontWeight: 900, fontSize: 40, lineHeight: 1 }}>{info.yearsExperience}</div>
              <div style={{ color: "var(--c-dark)", fontFamily: "var(--font-body)", fontSize: 12, marginTop: 2, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>{t("hero.stats.experience")}</div>
            </div>

            <div style={{ height: 440, background: "var(--c-dark)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", position: "relative", borderTop: "4px solid var(--c-primary)" }}>
              {info.aboutImage
                ? <img src={info.aboutImage} alt="About" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : <div style={{ textAlign: "center" }}><div style={{ fontSize: 80, opacity: .3 }}>🏗️</div><p style={{ color: "#555", fontFamily: "var(--font-body)", marginTop: 16 }}>{industrialLbl}</p></div>
              }
              {/* Play button */}
              <div style={{ position: "absolute", bottom: 24, right: 24, width: 56, height: 56, background: "var(--c-primary)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 0 0 10px rgba(232,160,0,.18)" }}>
                <span style={{ color: "var(--c-dark)", fontSize: 22, marginLeft: 4 }}>▶</span>
              </div>
            </div>

            {/* Award badge */}
            <div style={{ position: "absolute", bottom: -18, left: 40, background: "#fff", padding: "14px 20px", boxShadow: "0 8px 30px rgba(0,0,0,.12)", display: "flex", gap: 14, alignItems: "center", zIndex: 2, borderBottom: "3px solid var(--c-primary)" }}>
              <div style={{ fontSize: 26 }}>🏆</div>
              <div>
                <div style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 14, color: "var(--c-dark)" }}>{awardTitle}</div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--c-text)" }}>{awardSub}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}