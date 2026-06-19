import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useIntersect } from "./hooks";
import { useApiList } from "./apiHooks";
import { loc } from "./helpers";
import SectionTitle from "./SectionTitle";

function ArticleModal({ post, onClose, t }) {
  if (!post) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(0,0,0,0.82)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "24px", overflowY: "auto",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "#fff", maxWidth: 680, width: "100%",
          boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
          overflow: "hidden", animation: "fadeInUp 0.25s ease",
          maxHeight: "90vh", display: "flex", flexDirection: "column",
        }}
      >
        {/* Hero image */}
        <div style={{
          height: 260, flexShrink: 0, position: "relative",
          background: post.image ? `url(${post.image}) center/cover no-repeat` : "linear-gradient(135deg,var(--c-dark),var(--c-mid))",
          display: "flex", alignItems: "flex-end",
        }}>
          {!post.image && <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-60%)", fontSize: 72, opacity: 0.18 }}>🏗️</div>}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(26,26,37,0.85) 0%, transparent 60%)" }} />
          <button
            onClick={onClose}
            style={{
              position: "absolute", top: 16, right: 16,
              width: 36, height: 36, borderRadius: "50%",
              background: "rgba(0,0,0,0.5)", border: "none",
              color: "#fff", fontSize: 18, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >✕</button>
          <div style={{ position: "relative", zIndex: 1, padding: "0 28px 24px" }}>
            {post.tag && (
              <div style={{
                display: "inline-block", padding: "4px 12px",
                background: "var(--c-primary)", color: "var(--c-dark)",
                fontFamily: "var(--font-head)", fontSize: 11, fontWeight: 800,
                letterSpacing: 1, textTransform: "uppercase", marginBottom: 8,
              }}>{post.tag}</div>
            )}
            <h2 style={{ fontFamily: "var(--font-head)", fontWeight: 900, fontSize: 26, color: "#fff", margin: 0, lineHeight: 1.2 }}>{post.title}</h2>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "24px 32px 36px", overflowY: "auto" }}>
          <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid #f0f0f0" }}>
            {post.date && <span style={{ color: "var(--c-text)", fontFamily: "var(--font-body)", fontSize: 13 }}>📅 {post.date}</span>}
            {post.author && <span style={{ color: "var(--c-text)", fontFamily: "var(--font-body)", fontSize: 13 }}>✍️ {post.author}</span>}
          </div>

          {(post.content || post.excerpt)
            ? (post.content || post.excerpt).split("\n").filter(p => p.trim()).map((para, i) => (
                <p key={i} style={{ color: "var(--c-text)", fontFamily: "var(--font-body)", fontSize: 15, lineHeight: 1.9, marginBottom: 16 }}>{para}</p>
              ))
            : <p style={{ color: "#999", fontFamily: "var(--font-body)", fontSize: 14, fontStyle: "italic" }}>{t("news.noContent") || "Contenu indisponible pour le moment."}</p>
          }
        </div>
      </div>
    </div>
  );
}

export default function NewsSection() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const [ref, visible] = useIntersect();
  const [hovered, setHovered] = useState(null);
  const [selected, setSelected] = useState(null);

  const apiPosts = useApiList("/api/blog", null);
  const staticPosts = t("news.items", { returnObjects: true });

  const newsItems = apiPosts && apiPosts.length > 0
    ? apiPosts.map(p => ({ ...p, title: loc(p, "title", lang), tag: loc(p, "tag", lang), excerpt: loc(p, "excerpt", lang), content: loc(p, "content", lang) }))
    : staticPosts;

  return (
    <>
      <style>{`@keyframes fadeInUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:none; } }`}</style>

      <section id="news" ref={ref} className="section-padding" style={{ padding: "100px 0", background: "#fff", position: "relative" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "var(--c-primary)" }} />

        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(24px)", transition: "all .6s" }}>
            <SectionTitle tag={t("news.tag")} title={t("news.title")} center />
          </div>

          <div className="news-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 2 }}>
            {newsItems.map((n, i) => (
              <div
                key={i}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => setSelected(n)}
                style={{
                  background: "#fff",
                  borderBottom: `3px solid ${hovered === i ? "var(--c-primary)" : "transparent"}`,
                  boxShadow: hovered === i ? "0 12px 40px rgba(0,0,0,.1)" : "0 2px 12px rgba(0,0,0,.04)",
                  transition: "all .35s",
                  transform: visible ? (hovered === i ? "translateY(-4px)" : "none") : "translateY(28px)",
                  opacity: visible ? 1 : 0, transitionDelay: `${i * .1}s`,
                  cursor: "pointer", overflow: "hidden",
                }}
              >
                {/* Image */}
                <div style={{
                  height: 210,
                  background: n.image ? `url(${n.image}) center/cover no-repeat` : `linear-gradient(135deg,var(--c-dark),var(--c-mid))`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 56, position: "relative",
                }}>
                  {!n.image && <span style={{ opacity: .3 }}>🏗️</span>}
                  {/* Category tag */}
                  <div style={{ position: "absolute", bottom: 0, left: 0, background: "var(--c-primary)", color: "var(--c-dark)", fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 12, padding: "6px 14px", letterSpacing: 1, textTransform: "uppercase" }}>
                    {n.tag}
                  </div>
                  {n.featured && (
                    <div style={{ position: "absolute", top: 16, right: 16, background: "var(--c-dark)", color: "#fff", fontSize: 11, fontWeight: 700, padding: "4px 10px", letterSpacing: 1, textTransform: "uppercase" }}>{t("news.featured")}</div>
                  )}
                </div>

                <div style={{ padding: "24px 26px 28px" }}>
                  <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 12, paddingBottom: 12, borderBottom: "1px solid #f0f0f0" }}>
                    <span style={{ color: "var(--c-text)", fontFamily: "var(--font-body)", fontSize: 12 }}>📅 {n.date}</span>
                    {n.author && <span style={{ color: "var(--c-text)", fontFamily: "var(--font-body)", fontSize: 12 }}>✍️ {n.author}</span>}
                  </div>
                  <h3 style={{ fontFamily: "var(--font-head)", fontSize: 20, fontWeight: 800, color: "var(--c-dark)", lineHeight: 1.3, marginBottom: 10 }}>{n.title}</h3>
                  {n.excerpt && <p style={{ color: "var(--c-text)", fontFamily: "var(--font-body)", fontSize: 14, lineHeight: 1.7 }}>{n.excerpt}</p>}
                  <button
                    onClick={e => { e.stopPropagation(); setSelected(n); }}
                    style={{
                      marginTop: 16, display: "flex", alignItems: "center", gap: 6,
                      color: "var(--c-primary)", fontFamily: "var(--font-head)", fontWeight: 700,
                      fontSize: 14, textTransform: "uppercase", letterSpacing: 1,
                      background: "none", border: "none", padding: 0, cursor: "pointer",
                    }}
                  >
                    {t("news.readMore")} →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ArticleModal post={selected} onClose={() => setSelected(null)} t={t} />
    </>
  );
}