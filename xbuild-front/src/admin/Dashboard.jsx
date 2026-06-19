import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const CARDS = [
  { to: "/admin/info",         label: "Infos & Site",       desc: "Nom, slogan, coordonnées, images hero/about, réseaux sociaux.",   icon: "◎", accent: "#e8a000" },
  { to: "/admin/services",     label: "Services",           desc: "Gérer les 6 prestations : plomberie, sanitaire, chauffage…",      icon: "◈", accent: "#3b82f6" },
  { to: "/admin/projects",     label: "Réalisations",       desc: "Portfolio : chantiers terminés, photos, catégories et années.",    icon: "◫", accent: "#8b5cf6" },
  { to: "/admin/process",      label: "Notre Méthode",      desc: "Étapes du processus de travail affichées sur le site.",            icon: "⟳", accent: "#e8a000" },
  { to: "/admin/stats",        label: "Chiffres Clés",      desc: "Compteurs, badges certifications, titre et description section.",  icon: "◉", accent: "#0ea5e9" },
  { to: "/admin/testimonials", label: "Avis Clients",       desc: "Gérer les témoignages affichés dans le carrousel.",               icon: "◎", accent: "#ec4899" },
  { to: "/admin/blog",         label: "Actualités & Conseils", desc: "Articles de blog : conseils plomberie, rénovation, entretien.", icon: "◧", accent: "#10b981" },
  { to: "/admin/devis",        label: "Demandes de Devis",  desc: "Consulter les demandes reçues via le formulaire de contact.",      icon: "◈", accent: "#06b6d4" },
  { to: "/",                   label: "Voir le Site",       desc: "Prévisualiser le site public dans un nouvel onglet.",              icon: "↗", accent: "#22c55e", external: true },
];

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div>
      <style>{`
        @media (max-width: 600px) {
          .dash-title { font-size: 26px !important; }
          .dash-grid  { grid-template-columns: 1fr 1fr !important; gap: 8px !important; }
          .dash-tip   { flex-direction: column !important; gap: 8px !important; }
        }
      `}</style>

      {/* Page header */}
      <div style={{ marginBottom: 28, borderLeft: "4px solid var(--admin-gold)", paddingLeft: 16 }}>
        <div style={{ fontFamily: "var(--admin-font-head)", fontSize: 11, fontWeight: 800, color: "var(--admin-gold)", letterSpacing: 3, textTransform: "uppercase", marginBottom: 6 }}>
          ◣ Administration
        </div>
        <h1 className="dash-title" style={{ fontFamily: "var(--admin-font-head)", fontSize: 38, fontWeight: 900, color: "#fff", margin: 0, letterSpacing: -0.5 }}>
          Tableau de Bord
        </h1>
        <p style={{ fontFamily: "var(--admin-font-body)", color: "rgba(255,255,255,.4)", fontSize: 14, margin: "6px 0 0" }}>
          {user ? "Bienvenue — gérez le contenu de votre site." : "Choisissez une section à gérer."}
        </p>
      </div>

      {/* Cards grid */}
      <div className="dash-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 2, marginBottom: 24 }}>
        {CARDS.map(c => (
          <Link
            key={c.to} to={c.to}
            target={c.external ? "_blank" : undefined}
            style={{ textDecoration: "none" }}
          >
            <div
              style={{ background: "var(--admin-panel)", borderTop: `3px solid ${c.accent}`, padding: "16px 16px 14px", transition: "all .18s", cursor: "pointer", height: "100%" }}
              onMouseEnter={e => { e.currentTarget.style.background = `${c.accent}10`; e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,.3)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "var(--admin-panel)"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <div style={{ width: 42, height: 42, background: `${c.accent}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, color: c.accent, flexShrink: 0 }}>
                  {c.icon}
                </div>
                <span style={{ fontFamily: "var(--admin-font-head)", fontWeight: 800, fontSize: 16, color: "#fff", letterSpacing: 0.3 }}>{c.label}</span>
              </div>
              <p style={{ margin: 0, color: "rgba(255,255,255,.38)", fontFamily: "var(--admin-font-body)", fontSize: 13, lineHeight: 1.6 }}>{c.desc}</p>
              <div style={{ marginTop: 14, color: c.accent, fontFamily: "var(--admin-font-head)", fontWeight: 800, fontSize: 12, letterSpacing: 1, textTransform: "uppercase" }}>
                {c.external ? "Ouvrir ↗" : "Gérer →"}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Info tip */}
      <div className="dash-tip" style={{ background: "rgba(232,160,0,.05)", borderLeft: "3px solid var(--admin-gold)", padding: "14px 16px", display: "flex", gap: 12, alignItems: "flex-start" }}>
        <span style={{ fontSize: 18, flexShrink: 0, color: "var(--admin-gold)" }}>💧</span>
        <p style={{ margin: 0, color: "rgba(255,255,255,.4)", fontFamily: "var(--admin-font-body)", fontSize: 13, lineHeight: 1.7 }}>
          Le numéro configuré dans <strong style={{ color: "rgba(255,255,255,.65)" }}>Infos & Site → Téléphone</strong> apparaît automatiquement sur les boutons d'appel du site.
          Les demandes de devis soumises via le formulaire de contact sont accessibles dans <strong style={{ color: "rgba(255,255,255,.65)" }}>Demandes de Devis</strong>.
          Pensez à lancer <code style={{ color: "var(--admin-gold)", background: "rgba(255,255,255,.05)", padding: "1px 5px" }}>node seed.js</code> pour pré-remplir la base de données.
        </p>
      </div>
    </div>
  );
}