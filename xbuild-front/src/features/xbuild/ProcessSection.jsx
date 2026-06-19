import { useTranslation } from "react-i18next";
import { useIntersect } from "./hooks";
import { useApiList } from "./apiHooks";
import { loc } from "./helpers";
import SectionTitle from "./SectionTitle";

// Friendly default icons, used when a step has no custom icon set
const DEFAULT_ICONS = ["🔍", "🛠️", "✅", "📦", "🚀", "🤝"];

export default function ProcessSection() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const [ref, visible] = useIntersect();

  const apiSteps = useApiList("/api/process", null);
  const staticSteps = t("process.items", { returnObjects: true });
  const steps = apiSteps && apiSteps.length > 0
    ? apiSteps.map(s => ({ ...s, title: loc(s, "title", lang), desc: loc(s, "desc", lang) }))
    : staticSteps;

  return (
    <section id="process" ref={ref} className="section-padding" style={{ padding: "100px 0", background: "var(--c-light)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "var(--c-primary)" }} />

      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ textAlign: "center", maxWidth: 720, margin: "0 auto 56px", opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(20px)", transition: "all .7s" }}>
          <SectionTitle tag={t("process.tag")} title={t("process.title")} center />
          <p style={{ color: "var(--c-text)", fontFamily: "var(--font-body)", fontSize: 16, lineHeight: 1.8, marginTop: 16 }}>
            {t("process.description")}
          </p>
        </div>

        {/* Simple responsive step cards */}
        <div className="process-steps-grid" style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(steps.length, 4)}, 1fr)`, gap: 24 }}>
          {steps.map((step, i) => (
            <div
              key={i}
              className="process-step-card"
              style={{
                position: "relative",
                background: "#fff",
                padding: "36px 24px 28px",
                textAlign: "center",
                boxShadow: "0 4px 24px rgba(20,26,40,.06)",
                opacity: visible ? 1 : 0,
                transform: visible ? "none" : "translateY(30px)",
                transition: `all .6s ${i * .12}s`,
              }}
            >
              {/* Step number */}
              <div style={{
                position: "absolute", top: 14, right: 14,
                fontFamily: "var(--font-head)", fontWeight: 900, fontSize: 13,
                color: "rgba(20,26,40,.18)", letterSpacing: 1,
              }}>{`0${i + 1}`}</div>

              {/* Expressive icon */}
              <div style={{
                width: 64, height: 64, margin: "0 auto 18px",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 32, background: "var(--c-light)",
                border: "2px solid var(--c-primary)", borderRadius: "50%",
              }}>
                {step.icon || DEFAULT_ICONS[i % DEFAULT_ICONS.length]}
              </div>

              <h3 style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 18, color: "var(--c-dark)", marginBottom: 10 }}>
                {step.title}
              </h3>
              <p style={{ color: "var(--c-text)", fontFamily: "var(--font-body)", fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                {step.desc}
              </p>

              {/* Connector arrow (desktop only, hidden on last card) */}
              {i < steps.length - 1 && (
                <div className="process-step-arrow" style={{
                  position: "absolute", top: 46, right: -32,
                  color: "var(--c-primary)", fontSize: 22, fontWeight: 900,
                }}>→</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}