import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useApiList } from "./apiHooks";
import { TESTIMONIALS_META } from "./data";
import { useIntersect } from "./hooks";
import { loc } from "./helpers";
import SectionTitle from "./SectionTitle";

export default function TestimonialsSection() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const [active, setActive] = useState(0);
  const [ref, visible] = useIntersect();

  const apiTestimonials = useApiList("/api/testimonials", null);

  const testimonials = apiTestimonials && apiTestimonials.length > 0
    ? apiTestimonials.map(t => ({ name: t.name, role: loc(t, "role", lang), company: t.company, stars: t.stars || 5, text: loc(t, "text", lang), image: t.image }))
    : TESTIMONIALS_META.map((m, i) => ({ ...m, text: t(`testimonials.items.${i}.text`) }));

  useEffect(() => {
    const timer = setInterval(() => setActive(a => (a + 1) % testimonials.length), 4500);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const testimonial = testimonials[active] || testimonials[0];
  if (!testimonial) return null;

  return (
    <section ref={ref} style={{ padding: "100px 0", background: "var(--c-dark)", position: "relative", overflow: "hidden" }}>
      {/* Accent line */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "var(--c-primary)" }} />
      {/* Giant quote mark */}
      <div style={{ position: "absolute", top: 40, left: "5%", fontSize: 200, color: "var(--c-primary)", opacity: .04, fontFamily: "Georgia,serif", lineHeight: 1, pointerEvents: "none", userSelect: "none" }}>"</div>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 24px", textAlign: "center", position: "relative" }}>
        <div style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(24px)", transition: "all .6s" }}>
          <SectionTitle tag={t("testimonials.tag")} title={t("testimonials.title")} center light />
        </div>

        {/* Three-card layout — center active */}
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginBottom: 40 }}>
          {testimonials.map((item, i) => {
            const isActive = i === active;
            return (
              <div
                key={i}
                onClick={() => setActive(i)}
                style={{
                  flex: isActive ? "0 0 480px" : "0 0 200px",
                  background: isActive ? "#fff" : "rgba(255,255,255,.04)",
                  border: `2px solid ${isActive ? "var(--c-primary)" : "rgba(255,255,255,.08)"}`,
                  padding: isActive ? "36px 36px 32px" : "24px 20px",
                  transition: "all .4s",
                  cursor: isActive ? "default" : "pointer",
                  textAlign: "left",
                  overflow: "hidden",
                  opacity: visible ? 1 : 0,
                }}
              >
                {/* Stars */}
                <div style={{ display: "flex", gap: 3, marginBottom: 14 }}>
                  {Array.from({ length: item.stars || 5 }).map((_, si) => (
                    <span key={si} style={{ color: "var(--c-primary)", fontSize: isActive ? 16 : 12 }}>★</span>
                  ))}
                </div>
                {isActive && (
                  <p style={{ color: "var(--c-text)", fontFamily: "var(--font-body)", fontSize: 16, lineHeight: 1.8, marginBottom: 28, fontStyle: "italic" }}>
                    "{item.text}"
                  </p>
                )}
                {!isActive && (
                  <p style={{ color: "rgba(255,255,255,.4)", fontFamily: "var(--font-body)", fontSize: 12, lineHeight: 1.5, marginBottom: 12, fontStyle: "italic", WebkitLineClamp: 3, display: "-webkit-box", WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    "{item.text}"
                  </p>
                )}
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 44, height: 44, background: isActive ? "var(--c-dark)" : "rgba(255,255,255,.1)", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
                    {item.image
                      ? <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      : "👤"}
                  </div>
                  <div>
                    <h4 style={{ color: isActive ? "var(--c-dark)" : "#fff", fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 15, margin: 0 }}>{item.name}</h4>
                    <span style={{ color: isActive ? "var(--c-text)" : "rgba(255,255,255,.5)", fontFamily: "var(--font-body)", fontSize: 12 }}>{item.role}</span>
                  </div>
                  {isActive && item.company && (
                    <div style={{ marginLeft: "auto", padding: "6px 14px", background: "var(--c-dark)", color: "var(--c-primary)", fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 12, letterSpacing: 1 }}>
                      {item.company}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Nav */}
        <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
          <button onClick={() => setActive(a => (a - 1 + testimonials.length) % testimonials.length)}
            style={{ width: 44, height: 44, background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.15)", color: "#fff", cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>←</button>
          {testimonials.map((_, i) => (
            <button key={i} onClick={() => setActive(i)}
              style={{ width: i === active ? 32 : 10, height: 10, background: i === active ? "var(--c-primary)" : "rgba(255,255,255,.2)", border: "none", cursor: "pointer", transition: "all .3s" }} />
          ))}
          <button onClick={() => setActive(a => (a + 1) % testimonials.length)}
            style={{ width: 44, height: 44, background: "var(--c-primary)", border: "none", color: "var(--c-dark)", cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>→</button>
        </div>
      </div>
    </section>
  );
}
