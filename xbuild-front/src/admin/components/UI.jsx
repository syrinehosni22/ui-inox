/* ─────────────────────────────────────────────────────────────────────────────
   UI.jsx — shared admin components
   Mobile styles live in AdminLayout.jsx (injected once via <style> in the
   layout's JSX, so they're always in the DOM before any child renders).
───────────────────────────────────────────────────────────────────────────── */

// ─── PageHeader ────────────────────────────────────────────────────────────────
export function PageHeader({ icon, title, subtitle, actions }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
      <div className="ph-wrap" style={{ borderLeft: "4px solid var(--admin-gold)", paddingLeft: 16, minWidth: 0, flex: 1 }}>
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

// ─── Spinner ───────────────────────────────────────────────────────────────────
export function Spinner({ size = 18, color = "var(--admin-gold)" }) {
  return (
    <span style={{
      display: "inline-block", width: size, height: size,
      border: `2px solid rgba(255,255,255,0.15)`,
      borderTopColor: color, borderRadius: "50%",
      animation: "spin 0.7s linear infinite", flexShrink: 0,
    }} />
  );
}

// ─── Button ────────────────────────────────────────────────────────────────────
export function Button({ children, variant = "primary", onClick, disabled, type = "button", style = {}, fullWidth }) {
  const classMap = { primary: "admin-btn-primary", ghost: "admin-btn-ghost", danger: "admin-btn-danger", outline: "admin-btn-ghost" };
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      className={classMap[variant] || "admin-btn-primary"}
      style={{ width: fullWidth ? "100%" : undefined, justifyContent: fullWidth ? "center" : undefined, opacity: disabled ? 0.5 : 1, cursor: disabled ? "not-allowed" : "pointer", ...style }}
    >
      {children}
    </button>
  );
}

// ─── Field ─────────────────────────────────────────────────────────────────────
export function Field({ label, hint, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
      <label className="admin-label">
        {label}
        {hint && <span style={{ color: "rgba(255,255,255,.25)", fontWeight: 400, textTransform: "none", letterSpacing: 0, marginLeft: 8, fontSize: 11 }}>— {hint}</span>}
      </label>
      {children}
    </div>
  );
}

export function Input({ ...props }) { return <input className="admin-input" {...props} />; }
export function Textarea({ rows = 4, ...props }) { return <textarea className="admin-input" rows={rows} style={{ resize: "vertical" }} {...props} />; }
export function Select({ children, ...props }) { return <select className="admin-select" {...props}>{children}</select>; }

// ─── Card ──────────────────────────────────────────────────────────────────────
export function Card({ children, style = {} }) {
  return <div className="admin-card" style={style}>{children}</div>;
}

// ─── SectionHeading ────────────────────────────────────────────────────────────
export function SectionHeading({ title, subtitle }) {
  return (
    <div style={{ marginBottom: 20, paddingBottom: 14, borderBottom: "1px solid rgba(255,255,255,.07)" }}>
      <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: "#fff", fontFamily: "var(--admin-font-head)", letterSpacing: 0.3 }}>{title}</h3>
      {subtitle && <p style={{ margin: "4px 0 0", fontSize: 12, color: "rgba(255,255,255,.35)", fontFamily: "var(--admin-font-body)" }}>{subtitle}</p>}
    </div>
  );
}

// ─── Alert ─────────────────────────────────────────────────────────────────────
export function Alert({ type = "error", children }) {
  const classMap = { error: "admin-alert-error", success: "admin-alert-success", info: "admin-alert-info" };
  const icons    = { error: "⚠", success: "✓", info: "◉" };
  return (
    <div className={classMap[type] || "admin-alert-info"} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
      <span style={{ flexShrink: 0, fontWeight: 800 }}>{icons[type]}</span>
      <span style={{ fontFamily: "var(--admin-font-body)" }}>{children}</span>
    </div>
  );
}

// ─── Badge ─────────────────────────────────────────────────────────────────────
export function Badge({ children, color = "var(--admin-gold)" }) {
  return (
    <span style={{ display: "inline-block", padding: "3px 10px", fontSize: 11, fontWeight: 700, background: `${color}22`, color, fontFamily: "var(--admin-font-head)", letterSpacing: 1, textTransform: "uppercase" }}>
      {children}
    </span>
  );
}

// ─── Divider ───────────────────────────────────────────────────────────────────
export function Divider({ label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0" }}>
      {label && <span style={{ color: "rgba(255,255,255,.25)", fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", whiteSpace: "nowrap", fontFamily: "var(--admin-font-head)" }}>{label}</span>}
      <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,.07)" }} />
    </div>
  );
}

// ─── ListItem ──────────────────────────────────────────────────────────────────
export function ListItem({ children, onClick, active }) {
  return (
    <div onClick={onClick} className={`admin-list-item${active ? " active" : ""}`}>
      {children}
    </div>
  );
}

// ─── EmptyState ────────────────────────────────────────────────────────────────
export function EmptyState({ icon = "◈", title, message }) {
  return (
    <div style={{ textAlign: "center", padding: "40px 16px", color: "rgba(255,255,255,.25)" }}>
      <div style={{ fontSize: 34, marginBottom: 12, color: "var(--admin-gold)", opacity: .5 }}>{icon}</div>
      {title   && <div style={{ fontFamily: "var(--admin-font-head)", fontWeight: 800, fontSize: 15, color: "rgba(255,255,255,.4)", marginBottom: 6, letterSpacing: 0.3 }}>{title}</div>}
      {message && <div style={{ fontSize: 13, fontFamily: "var(--admin-font-body)" }}>{message}</div>}
    </div>
  );
}