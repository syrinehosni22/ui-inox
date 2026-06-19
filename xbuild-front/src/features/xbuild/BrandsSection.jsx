import { useTranslation } from "react-i18next";

export default function BrandsSection() {
  const { t } = useTranslation();
  const brands = t("brands", { returnObjects: true });
  return (
    <div style={{ padding: "44px 0", background: "var(--c-dark2)", borderTop: "3px solid var(--c-primary)", overflow: "hidden" }}>
      <div style={{ display: "flex", animation: "marquee 22s linear infinite", width: "max-content" }}>
        {[...brands, ...brands].map((brand, i) => (
          <div
            key={i}
            style={{ padding: "0 48px", fontFamily: "var(--font-head)", fontWeight: 800, color: "rgba(255,255,255,.25)", fontSize: 16, letterSpacing: 2, whiteSpace: "nowrap", cursor: "pointer", textTransform: "uppercase", transition: "color .2s" }}
            onMouseEnter={e => e.target.style.color = "var(--c-primary)"}
            onMouseLeave={e => e.target.style.color = "rgba(255,255,255,.25)"}
          >{brand}</div>
        ))}
      </div>
    </div>
  );
}
