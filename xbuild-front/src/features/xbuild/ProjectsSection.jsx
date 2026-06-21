import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { STATIC_PROJECTS } from "./data";
import { useIntersect } from "./hooks";
import { useApiList } from "./apiHooks";
import { loc } from "./helpers";
import SectionTitle from "./SectionTitle";

/* Returns the list of photo URLs for a project, with backward-compat
   fallback on the legacy single `image` field. */
function getImages(p) {
  if (Array.isArray(p.images) && p.images.length) return p.images.filter(Boolean);
  return p.image ? [p.image] : [];
}

/* Auto-cycling crossfade background used inside project cards */
function CardSlideshow({ images }) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;
    const timer = setInterval(() => setIdx(i => (i + 1) % images.length), 2600);
    return () => clearInterval(timer);
  }, [images]);

  if (!images.length) return null;

  return (
    <>
      {images.map((src, i) => (
        <div
          key={i}
          style={{
            position: "absolute", inset: 0,
            backgroundImage: `url(${src})`, backgroundSize: "cover", backgroundPosition: "center",
            opacity: i === idx ? 1 : 0,
            transition: "opacity 1.1s ease",
          }}
        />
      ))}
      {images.length > 1 && (
        <div style={{ position: "absolute", top: 14, right: 14, display: "flex", gap: 5, zIndex: 2 }}>
          {images.map((_, i) => (
            <span key={i} style={{
              width: 6, height: 6, borderRadius: "50%",
              background: i === idx ? "var(--c-primary)" : "rgba(255,255,255,.4)",
              transition: "background .3s",
            }} />
          ))}
        </div>
      )}
    </>
  );
}

/* Gallery with main slideshow + thumbnail strip, used inside the project modal */
function ModalGallery({ images, bg, t }) {
  const [idx, setIdx] = useState(0);

  useEffect(() => { setIdx(0); }, [images]);

  useEffect(() => {
    if (images.length < 2) return;
    const timer = setInterval(() => setIdx(i => (i + 1) % images.length), 3500);
    return () => clearInterval(timer);
  }, [images]);

  if (!images.length) {
    return (
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${bg || "var(--c-dark)"}, #2a2a3e)` }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-60%)", fontSize: 72, opacity: 0.18 }}>🏗️</div>
      </div>
    );
  }

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {images.map((src, i) => (
        <div
          key={i}
          style={{
            position: "absolute", inset: 0,
            backgroundImage: `url(${src})`, backgroundSize: "cover", backgroundPosition: "center",
            opacity: i === idx ? 1 : 0, transition: "opacity .8s ease",
          }}
        />
      ))}

      {images.length > 1 && (
        <>
          <button
            onClick={e => { e.stopPropagation(); setIdx(i => (i - 1 + images.length) % images.length); }}
            style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", zIndex: 3, width: 34, height: 34, borderRadius: "50%", background: "rgba(0,0,0,0.45)", border: "none", color: "#fff", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
          >‹</button>
          <button
            onClick={e => { e.stopPropagation(); setIdx(i => (i + 1) % images.length); }}
            style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", zIndex: 3, width: 34, height: 34, borderRadius: "50%", background: "rgba(0,0,0,0.45)", border: "none", color: "#fff", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
          >›</button>
          <div style={{ position: "absolute", bottom: 14, left: "50%", transform: "translateX(-50%)", zIndex: 3, display: "flex", gap: 6 }}>
            {images.map((_, i) => (
              <span
                key={i}
                onClick={e => { e.stopPropagation(); setIdx(i); }}
                style={{ width: i === idx ? 18 : 8, height: 8, borderRadius: 4, background: i === idx ? "var(--c-primary)" : "rgba(255,255,255,.5)", cursor: "pointer", transition: "all .3s" }}
              />
            ))}
          </div>
          <div style={{ position: "absolute", top: 16, left: 16, zIndex: 3, background: "rgba(0,0,0,0.5)", color: "#fff", fontFamily: "var(--font-head)", fontSize: 12, fontWeight: 700, padding: "4px 10px", borderRadius: 6 }}>
            {idx + 1} / {images.length}
          </div>
        </>
      )}
    </div>
  );
}

function ProjectModal({ project, onClose, t }) {
  if (!project) return null;
  const images = getImages(project);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(0,0,0,0.82)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "24px",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "var(--c-dark)", borderRadius: 0, maxWidth: 640, width: "100%",
          boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
          overflow: "hidden", animation: "fadeInUp 0.25s ease",
        }}
      >
        {/* Hero / gallery */}
        <div style={{ height: 480, position: "relative", display: "flex", alignItems: "flex-end" }}>
          <ModalGallery images={images} bg={project.bg} t={t} />

          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to top, rgba(26,26,37,0.95) 0%, transparent 60%)",
            zIndex: 1,
          }} />
          <button
            onClick={onClose}
            style={{
              position: "absolute", top: 16, right: 16, zIndex: 3,
              width: 36, height: 36, borderRadius: "50%",
              background: "rgba(0,0,0,0.5)", border: "none",
              color: "#fff", fontSize: 18, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >✕</button>
          <div style={{ position: "relative", zIndex: 2, padding: "0 28px 24px" }}>
            <div style={{
              display: "inline-block", padding: "4px 12px",
              background: "var(--c-primary)", color: "#fff",
              fontFamily: "var(--font-head)", fontSize: 11, fontWeight: 700,
              letterSpacing: 1, textTransform: "uppercase", borderRadius: 0, marginBottom: 8,
            }}>{project.category}</div>
            <h2 style={{
              fontFamily: "var(--font-head)", fontWeight: 900,
              fontSize: 24, color: "#fff", margin: 0,
            }}>{project.title}</h2>
          </div>
        </div>

        <div style={{ padding: "24px 32px 36px" }}>
          {/* Year badge */}
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 20 }}>
            <div style={{
              padding: "6px 14px", borderRadius: 8,
              background: "rgba(245,91,31,0.12)", border: "1px solid rgba(245,91,31,0.25)",
              color: "var(--c-primary)", fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 14,
            }}>📅 {project.year}</div>
          </div>

          {/* Description */}
          {project.desc ? (
            <p style={{
              color: "#aaa", fontFamily: "var(--font-head)",
              fontSize: 15, lineHeight: 1.8, margin: 0,
            }}>{project.desc}</p>
          ) : (
            <p style={{ color: "#555", fontFamily: "var(--font-head)", fontSize: 14, fontStyle: "italic" }}>
              {t("projects.noDesc") || "Aucune description disponible."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProjectsSection() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const apiProjects = useApiList("/api/projects", null);
  const [ref, visible] = useIntersect();
  const [activeProject, setActiveProject] = useState(null);
  const [selected, setSelected] = useState(null);

  const staticItems = t("projects.items", { returnObjects: true });

  const projects = apiProjects
    ? apiProjects.map(p => ({
        ...p,
        title: loc(p, "title", lang),
        category: loc(p, "category", lang),
        desc: loc(p, "desc", lang),
      }))
    : STATIC_PROJECTS.map((p, i) => ({
        ...p,
        title: staticItems[i]?.title || p.title,
        category: staticItems[i]?.category || p.category,
        desc: "",
      }));

  return (
    <>
      <style>{`@keyframes fadeInUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:none; } }`}</style>

      <section id="projects" ref={ref} className="section-padding" style={{ padding: "100px 0", background: "var(--c-dark)", overflow: "hidden" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(30px)", transition: "all 0.7s" }}>
            <SectionTitle tag={t("projects.tag")} title={t("projects.title")} center light />
          </div>
          <div className="projects-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gridTemplateRows: "repeat(2, 380px)", gap: 16, marginTop: 48 }}>
            {projects.map((p, i) => {
              const images = getImages(p);
              return (
                <div
                  key={i}
                  onMouseEnter={() => setActiveProject(i)}
                  onMouseLeave={() => setActiveProject(null)}
                  onClick={() => setSelected(p)}
                  style={{
                    background: images.length ? "transparent" : (p.bg || "var(--c-dark)"),
                    borderRadius: 0, position: "relative", overflow: "hidden",
                    cursor: "pointer",
                    opacity: visible ? 1 : 0,
                    transform: visible ? "none" : "translateY(30px)",
                    transition: `all 0.6s ${i * 0.08}s`,
                    ...(i === 4 ? { gridColumn: "2/4" } : {}),
                  }}
                >
                  <CardSlideshow images={images} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.85), transparent)", opacity: activeProject === i ? 1 : 0.5, transition: "opacity 0.3s" }} />
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "var(--c-primary)", transform: activeProject === i ? "scaleX(1)" : "scaleX(0)", transition: "transform 0.3s", transformOrigin: "left" }} />
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: 24, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                    <div>
                      <div style={{ display: "inline-block", padding: "4px 12px", background: "var(--c-primary)", color: "#fff", fontFamily: "var(--font-head)", fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", borderRadius: 0, marginBottom: 8, transform: activeProject === i ? "translateY(0)" : "translateY(8px)", opacity: activeProject === i ? 1 : 0, transition: "all 0.3s" }}>{p.category}</div>
                      <h3 style={{ color: "#fff", fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 20, margin: 0 }}>{p.title}</h3>
                      <p style={{ color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-head)", fontSize: 13, margin: "4px 0 0" }}>{p.year}</p>
                    </div>
                    <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--c-primary)", display: "flex", alignItems: "center", justifyContent: "center", transform: activeProject === i ? "scale(1)" : "scale(0)", transition: "transform 0.3s", color: "#fff", fontWeight: 700 }}>→</div>
                  </div>
                  {!images.length && <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", fontSize: 60, opacity: 0.1 }}>🏗️</div>}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <ProjectModal project={selected} onClose={() => setSelected(null)} t={t} />
    </>
  );
}