import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useIntersect } from "./hooks";
import { useApiList } from "./apiHooks";
import { loc } from "./helpers";
import SectionTitle from "./SectionTitle";

function ServiceModal({ service, onClose, lang, t }) {
  if (!service) return null;
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(20,26,40,.88)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#fff", maxWidth: 540, width: "100%", boxShadow: "0 30px 80px rgba(0,0,0,.4)", overflow: "hidden", animation: "fadeUp .22s ease", borderTop: "4px solid var(--c-primary)" }}>
        {service.image && (
          <div style={{ height: 220, background: `url(${service.image}) center/cover no-repeat`, position: "relative" }}>
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(20,26,40,.9) 0%,transparent 50%)" }} />
            <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, width: 34, height: 34, background: "rgba(0,0,0,.5)", border: "none", color: "#fff", fontSize: 16, cursor: "pointer" }}>✕</button>
          </div>
        )}
        {!service.image && (
          <div style={{ background: "var(--c-dark)", padding: "28px 32px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 48 }}>{service.icon}</span>
            <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(255,255,255,.6)", fontSize: 20, cursor: "pointer" }}>✕</button>
          </div>
        )}
        <div style={{ padding: "28px 32px 36px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
            {service.icon && <span style={{ fontSize: 30 }}>{service.icon}</span>}
            <h2 style={{ fontFamily: "var(--font-head)", fontWeight: 900, fontSize: 26, color: "var(--c-dark)", margin: 0 }}>{service.title}</h2>
          </div>
          <div style={{ width: 40, height: 3, background: "var(--c-primary)", marginBottom: 20 }} />
          <p style={{ color: "var(--c-text)", fontFamily: "var(--font-body)", fontSize: 15, lineHeight: 1.8 }}>{service.desc}</p>
          <div style={{ marginTop: 24, display: "inline-flex", padding: "8px 16px", background: "var(--c-primary)", color: "var(--c-dark)", fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 13, letterSpacing: 1, textTransform: "uppercase" }}>
            {t("services.tag")}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ServicesSection() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const apiServices = useApiList("/api/services", null);
  const [ref, visible] = useIntersect();
  const [hovered, setHovered] = useState(null);
  const [selected, setSelected] = useState(null);

  const services = apiServices
    ? apiServices.map(s => ({ ...s, title: loc(s, "title", lang), desc: loc(s, "desc", lang) }))
    : t("services.items", { returnObjects: true });

  return (
    <>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}`}</style>
      <section id="services" ref={ref} className="section-padding" style={{ padding: "100px 0", background: "var(--c-light)", overflow: "hidden", position: "relative" }}>
        {/* Background accent */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "var(--c-primary)" }} />

        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(24px)", transition: "all .6s" }}>
            <SectionTitle tag={t("services.tag")} title={t("services.title")} center />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 2 }}>
            {services.map((s, i) => (
              <div
                key={i}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => setSelected(s)}
                style={{
                  background: hovered === i ? "var(--c-dark)" : "#fff",
                  borderBottom: `3px solid ${hovered === i ? "var(--c-primary)" : "transparent"}`,
                  transition: "all .35s",
                  transform: visible ? (hovered === i ? "translateY(-4px)" : "none") : "translateY(30px)",
                  opacity: visible ? 1 : 0,
                  transitionDelay: `${i * .08 + .1}s`,
                  cursor: "pointer",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Service image or icon */}
                <div style={{
                  height: 190,
                  background: s.image ? `url(${s.image}) center/cover no-repeat` : `linear-gradient(135deg,var(--c-dark),var(--c-mid))`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 56, position: "relative", overflow: "hidden",
                }}>
                  {!s.image && <span style={{ opacity: hovered === i ? .8 : .4, transition: "opacity .3s", transform: hovered === i ? "scale(1.1)" : "scale(1)", display: "block", transition: "all .3s" }}>{s.icon}</span>}
                  {/* Yellow corner badge */}
                  <div style={{ position: "absolute", top: 0, left: 0, width: 50, height: 50, background: "var(--c-primary)", clipPath: "polygon(0 0,100% 0,0 100%)" }} />
                  <span style={{ position: "absolute", top: 6, left: 7, color: "var(--c-dark)", fontFamily: "var(--font-head)", fontWeight: 900, fontSize: 13 }}>{String(i + 1).padStart(2, "0")}</span>
                </div>

                <div style={{ padding: "26px 28px 30px" }}>
                  <h3 style={{ fontFamily: "var(--font-head)", fontSize: 20, fontWeight: 800, color: hovered === i ? "#fff" : "var(--c-dark)", marginBottom: 10, transition: "color .3s" }}>{s.title}</h3>
                  <p style={{ fontFamily: "var(--font-body)", color: hovered === i ? "rgba(255,255,255,.6)" : "var(--c-text)", fontSize: 14, lineHeight: 1.7, transition: "color .3s" }}>{s.desc}</p>
                  <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 8, color: "var(--c-primary)", fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 14, textTransform: "uppercase", letterSpacing: 1 }}>
                    {t("services.learnMore")} <span style={{ fontSize: 18 }}>→</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ServiceModal service={selected} onClose={() => setSelected(null)} lang={lang} t={t} />
    </>
  );
}
