import { useTranslation } from "react-i18next";
import { STATIC_STATS } from "./data";
import { useCountUp, useIntersect } from "./hooks";
import { loc } from "./helpers";
import SectionTitle from "./SectionTitle";

export default function StatsSection({ info }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const [ref, visible] = useIntersect();

  const statsItems = info.statsItems && info.statsItems.length > 0
    ? info.statsItems
    : STATIC_STATS.map((s, i) => ({
        value: String(s.value), suffix: s.suffix,
        label_fr: t(`stats.items.${i}.label`, { defaultValue: s.label || "" }),
        label_en: t(`stats.items.${i}.label`, { defaultValue: s.label || "" }),
      }));

  const counts = statsItems.map(s => useCountUp(parseFloat(s.value) || 0, 2000, visible));

  const badges = info.statsBadges && info.statsBadges.length > 0
    ? info.statsBadges
    : [
        { icon: "🏅", label_fr: "Certifié ISO",     label_en: "ISO Certified" },
        { icon: "🕐", label_fr: "Support 24/7",     label_en: "24/7 Support" },
        { icon: "👷", label_fr: "Équipe d'Experts", label_en: "Expert Team" },
        { icon: "🛡️", label_fr: "Sûr & Sécurisé",  label_en: "Safe & Secure" },
      ];

  const sectionTag   = loc(info, "statsTag",   lang) || t("stats.tag");
  const sectionTitle = loc(info, "statsTitle", lang) || t("stats.title");
  const sectionDesc  = loc(info, "statsDesc",  lang) || t("stats.description", { years: info.yearsExperience });

  return (
    <section ref={ref} style={{ padding: "100px 0", background: "var(--c-dark)", position: "relative", overflow: "hidden" }}>
      {/* Subtle grid texture */}
      <div style={{ position: "absolute", inset: 0, opacity: .04 }}>
        <svg width="100%" height="100%"><defs><pattern id="grid2" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--c-primary)" strokeWidth="0.5"/></pattern></defs><rect width="100%" height="100%" fill="url(#grid2)"/></svg>
      </div>
      {/* Top accent */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "var(--c-primary)" }} />

      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 24px", position: "relative" }}>
        <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>

          {/* Left */}
          <div>
            <SectionTitle tag={sectionTag} title={sectionTitle} light />
            <p style={{ color: "rgba(255,255,255,.55)", fontFamily: "var(--font-body)", fontSize: 16, lineHeight: 1.8, marginBottom: 40 }}>
              {sectionDesc}
            </p>

            {/* Counters — 2×2 grid */}
            <div className="stats-counts" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, marginBottom: 40 }}>
              {statsItems.map((s, i) => (
                <div key={i} className="stat-counter-box" style={{ borderTop: "3px solid var(--c-primary)", padding: "24px 20px", background: "rgba(255,255,255,.04)", borderLeft: "none", borderRight: "none", borderBottom: "none" }}>
                  <div style={{ fontFamily: "var(--font-head)", fontSize: 48, fontWeight: 900, color: "var(--c-primary)", lineHeight: 1 }}>
                    {counts[i]}{s.suffix}
                  </div>
                  <div style={{ color: "rgba(255,255,255,.6)", fontFamily: "var(--font-body)", fontSize: 13, marginTop: 6, textTransform: "uppercase", letterSpacing: 1 }}>
                    {s[`label_${lang}`] || s.label_fr}
                  </div>
                </div>
              ))}
            </div>

            <button
              className="metron-btn-primary"
              onClick={() => document.querySelector("#about")?.scrollIntoView({ behavior: "smooth" })}
            >
              {t("stats.learnMore")} →
            </button>
          </div>

          {/* Right */}
          <div style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateX(40px)", transition: "all .8s .2s" }}>
            {info.statsImage ? (
              <div style={{ overflow: "hidden", height: 360, borderTop: "4px solid var(--c-primary)" }}>
                <img src={info.statsImage} alt="Stats" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            ) : (
              <div style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.1)", padding: 32 }}>
                <div style={{ fontSize: 72, textAlign: "center", marginBottom: 24, opacity: .3 }}>🏭</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                  {badges.map((b, i) => (
                    <div key={i} style={{ background: "rgba(232,160,0,.08)", border: "1px solid rgba(232,160,0,.18)", padding: "16px 18px", display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ fontSize: 22 }}>{b.icon}</span>
                      <span style={{ color: "#fff", fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600 }}>
                        {b[`label_${lang}`] || b.label_fr}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
