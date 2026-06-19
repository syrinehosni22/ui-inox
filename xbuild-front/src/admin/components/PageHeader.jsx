export function PageHeader({ icon, title, subtitle, actions }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
      <style>{`
        @media (max-width: 600px) {
          .ph-title { font-size: 24px !important; }
          .ph-wrap  { margin-bottom: 16px !important; }
          .ph-actions { width: 100%; }
          .ph-actions > * { flex: 1; justify-content: center; }
        }
      `}</style>
      <div className="ph-wrap" style={{ borderLeft: "4px solid var(--admin-gold)", paddingLeft: 14, minWidth: 0, flex: 1 }}>
        {icon && (
          <div style={{ fontFamily: "var(--admin-font-head)", fontSize: 11, fontWeight: 800, color: "var(--admin-gold)", letterSpacing: 3, textTransform: "uppercase", marginBottom: 5 }}>
            {icon} Section
          </div>
        )}
        <h2 className="ph-title" style={{ margin: 0, fontSize: 28, fontWeight: 900, color: "#fff", fontFamily: "var(--admin-font-head)", letterSpacing: -0.3, wordBreak: "break-word" }}>
          {title}
        </h2>
        {subtitle && (
          <p style={{ margin: "5px 0 0", fontSize: 13, color: "rgba(255,255,255,.38)", fontFamily: "var(--admin-font-body)" }}>
            {subtitle}
          </p>
        )}
      </div>
      {actions && (
        <div className="ph-actions" style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0, flexWrap: "wrap" }}>
          {actions}
        </div>
      )}
    </div>
  );
}