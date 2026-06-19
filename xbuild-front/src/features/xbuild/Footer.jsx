import { useTranslation } from "react-i18next";
import { loc } from "./helpers";
import Logo from "./Logo";

export default function Footer({ info }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const scrollTo = (href) => document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });

  const quickLinks = [
    { label: t("footer.links.about"),   href: "#about" },
    { label: t("footer.links.contact"), href: "#contact" },
    { label: t("footer.links.blog"),    href: "#news" },
    { label: t("footer.links.faq"),     href: "#" },
  ];
  const serviceLinks = [
    { label: t("footer.links.construction"), href: "#services" },
    { label: t("footer.links.renovation"),   href: "#services" },
    { label: t("footer.links.materials"),    href: "#services" },
    { label: t("footer.links.management"),   href: "#process" },
  ];

  const socials = [
    { label: "f",  key: "socialFacebook", href: info.socialFacebook },
    { label: "𝕏",  key: "socialTwitter",  href: info.socialTwitter },
    { label: "▶",  key: "socialYoutube",  href: info.socialYoutube },
    { label: "in", key: "socialLinkedin", href: info.socialLinkedin },
  ].filter(s => info[`${s.key}Active`] !== false);

  return (
    <footer style={{ background: "var(--c-dark)", color: "#fff" }}>
      {/* Top contacts bar */}
      <div style={{ background: "var(--c-dark2)", borderBottom: "1px solid rgba(255,255,255,.08)", padding: "32px 0" }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 24px" }}>
          <div className="footer-top-grid" style={{ display: "grid", gridTemplateColumns: "auto 1fr 1fr 1fr", gap: 32, alignItems: "center" }}>
            <Logo info={info} dark size="md" onClick={() => scrollTo("#home")} />
            {[
              { icon: "📍", label: t("contact.location"), value: info.address },
              { icon: "✉",  label: t("contact.email"),    value: info.email },
              { icon: "📞", label: t("contact.phone"),    value: info.phone },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 16, alignItems: "center" }}>
                <div style={{ width: 46, height: 46, background: "var(--c-primary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{item.icon}</div>
                <div>
                  <p style={{ color: "rgba(255,255,255,.45)", fontFamily: "var(--font-body)", fontSize: 12, margin: 0, textTransform: "uppercase", letterSpacing: 1 }}>{item.label}</p>
                  <h4 style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 14, margin: "3px 0 0", color: "#fff" }}>{item.value}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "60px 24px" }}>
        <div className="footer-bottom-grid" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48 }}>
          <div>
            <h5 style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 20, marginBottom: 16, paddingBottom: 12, borderBottom: "2px solid var(--c-primary)" }}>{t("footer.aboutTitle")}</h5>
            <p style={{ color: "rgba(255,255,255,.45)", fontFamily: "var(--font-body)", fontSize: 14, lineHeight: 1.8, marginBottom: 24 }}>{loc(info, "footerAbout", lang)}</p>
            {/* Brochure downloads */}
            <a href="#" className="brochure-btn">
              <span className="icon">📄</span>
              <div className="info">
                <small>PDF Download</small>
                <strong>Company Overview</strong>
              </div>
            </a>
            {socials.length > 0 && (
              <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
                {socials.map((s, i) => (
                  <a key={i} href={s.href} target="_blank" rel="noreferrer"
                    style={{ width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(255,255,255,.15)", color: "rgba(255,255,255,.6)", fontSize: 13, fontWeight: 700, textDecoration: "none", transition: "all .2s" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "var(--c-primary)"; e.currentTarget.style.color = "var(--c-dark)"; e.currentTarget.style.borderColor = "var(--c-primary)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "rgba(255,255,255,.6)"; e.currentTarget.style.borderColor = "rgba(255,255,255,.15)"; }}
                  >{s.label}</a>
                ))}
              </div>
            )}
          </div>

          {[{ title: t("footer.quickLinks"), links: quickLinks }, { title: t("footer.ourServices"), links: serviceLinks }].map((col, ci) => (
            <div key={ci}>
              <h5 style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 20, marginBottom: 16, paddingBottom: 12, borderBottom: "2px solid var(--c-primary)" }}>{col.title}</h5>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {col.links.map((link, li) => (
                  <li key={li} style={{ marginBottom: 10 }}>
                    <button onClick={() => scrollTo(link.href)}
                      style={{ background: "none", border: "none", color: "rgba(255,255,255,.45)", fontFamily: "var(--font-body)", fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, transition: "color .2s", padding: 0 }}
                      onMouseEnter={e => e.currentTarget.style.color = "var(--c-primary)"}
                      onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,.45)"}
                    >
                      <span style={{ color: "var(--c-primary)", fontSize: 10 }}>►</span> {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h5 style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 20, marginBottom: 16, paddingBottom: 12, borderBottom: "2px solid var(--c-primary)" }}>{t("footer.newsletter")}</h5>
            <p style={{ color: "rgba(255,255,255,.45)", fontFamily: "var(--font-body)", fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>{t("footer.newsletterDesc")}</p>
            <input
              placeholder={t("footer.emailPlaceholder")} type="email"
              style={{ padding: "12px 16px", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)", color: "#fff", fontFamily: "var(--font-body)", fontSize: 14, outline: "none", width: "100%", marginBottom: 10 }}
            />
            <button className="metron-btn-primary" style={{ width: "100%", justifyContent: "center" }}>{t("footer.subscribe")}</button>
          </div>
        </div>
      </div>

      {/* Copyright bar */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,.07)", padding: "20px 24px", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <p style={{ color: "rgba(255,255,255,.35)", fontFamily: "var(--font-body)", fontSize: 13, margin: 0 }}>
          {t("footer.copyright")}{" "}
          <button onClick={() => scrollTo("#home")} style={{ color: "var(--c-primary)", background: "none", border: "none", cursor: "pointer", fontWeight: 700, fontFamily: "var(--font-head)" }}>{info.companyName}</button>
        </p>
      </div>
    </footer>
  );
}
