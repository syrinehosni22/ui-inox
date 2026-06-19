import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useInfo } from "../features/xbuild/apiHooks";

const NAV = [
  { to: "/admin",              label: "Dashboard",    icon: "▣",  exact: true },
  { to: "/admin/info",         label: "Infos",        icon: "◎" },
  { to: "/admin/services",     label: "Services",     icon: "◈" },
  { to: "/admin/projects",     label: "Projets",      icon: "◫" },
  { to: "/admin/process",      label: "Processus",    icon: "⟳" },
  { to: "/admin/stats",        label: "Stats",        icon: "◉" },
  { to: "/admin/testimonials", label: "Avis",         icon: "◎" },
  { to: "/admin/blog",         label: "Blog",         icon: "◧" },
  { to: "/admin/devis",        label: "Devis",        icon: "◈" },
];

function AdminLogo({ info }) {
  if (info.logoImage) {
    return <img src={info.logoImage} alt={info.companyName || "Logo"} style={{ height: 26, width: "auto", objectFit: "contain" }} />;
  }
  const name = info.companyName || "XBuild";
  const match = name.match(/build/i);
  const prefix = match ? name.slice(0, match.index) : name;
  const suffix = match ? match[0] : "";
  return (
    <span style={{ fontFamily: "var(--admin-font-head)", fontSize: 19, fontWeight: 900, color: "#fff", letterSpacing: 1, textTransform: "uppercase" }}>
      {prefix}<span style={{ color: "var(--admin-gold)" }}>{suffix || "BUILD"}</span>
    </span>
  );
}

export default function AdminLayout() {
  const { logout } = useAuth();
  const location   = useLocation();
  const navigate   = useNavigate();
  const info       = useInfo();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate("/admin/login", { replace: true }); };
  const isActive = ({ to, exact }) => exact ? location.pathname === to : location.pathname.startsWith(to);

  return (
    <div style={{ minHeight: "100vh", background: "var(--admin-bg)", color: "#fff", fontFamily: "var(--admin-font-body)", display: "flex" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=Barlow:wght@400;500;600;700&display=swap');

        :root {
          --admin-bg:      #0f1422;
          --admin-sidebar: #131928;
          --admin-panel:   #1a2035;
          --admin-border:  rgba(255,255,255,0.07);
          --admin-gold:    #e8a000;
          --admin-text:    rgba(255,255,255,0.55);
          --admin-font-head: 'Barlow Condensed', sans-serif;
          --admin-font-body: 'Barlow', sans-serif;
        }

        @keyframes spin   { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:none; } }
        @keyframes slideDown { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:none; } }
        * { box-sizing: border-box; }

        .admin-sidebar::-webkit-scrollbar { width: 4px; }
        .admin-sidebar::-webkit-scrollbar-track { background: transparent; }
        .admin-sidebar::-webkit-scrollbar-thumb { background: rgba(255,255,255,.1); border-radius: 2px; }

        .admin-nav-item {
          display: flex; align-items: center; gap: 12px;
          padding: 11px 20px;
          color: var(--admin-text);
          text-decoration: none;
          font-family: var(--admin-font-head);
          font-size: 14px; font-weight: 700;
          letter-spacing: 0.5px; text-transform: uppercase;
          border-left: 3px solid transparent;
          transition: all 0.15s;
          white-space: nowrap;
        }
        .admin-nav-item:hover  { color: #fff; background: rgba(255,255,255,.04); border-left-color: rgba(232,160,0,.4); }
        .admin-nav-item.active { color: #fff; background: rgba(232,160,0,.08); border-left-color: var(--admin-gold); }
        .admin-nav-item .nav-icon { font-size: 16px; color: var(--admin-gold); opacity: .7; flex-shrink: 0; }
        .admin-nav-item.active .nav-icon { opacity: 1; }

        .admin-card { background: var(--admin-panel); border-top: 3px solid var(--admin-gold); padding: 24px; margin-bottom: 20px; }

        .admin-btn-primary {
          display: inline-flex; align-items: center; gap: 8px;
          background: var(--admin-gold); color: #0f1422;
          font-family: var(--admin-font-head); font-size: 13px; font-weight: 800;
          letter-spacing: 1px; text-transform: uppercase;
          padding: 10px 22px; border: none; cursor: pointer;
          transition: filter .2s, transform .2s;
        }
        .admin-btn-primary:hover { filter: brightness(1.1); transform: translateY(-1px); }
        .admin-btn-primary:disabled { opacity: .5; cursor: not-allowed; transform: none; }
        .admin-btn-ghost {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(255,255,255,.06); color: rgba(255,255,255,.65);
          font-family: var(--admin-font-head); font-size: 13px; font-weight: 700;
          letter-spacing: 1px; text-transform: uppercase;
          padding: 10px 20px; border: 1px solid rgba(255,255,255,.1); cursor: pointer;
          transition: all .2s;
        }
        .admin-btn-ghost:hover { background: rgba(255,255,255,.1); color: #fff; }
        .admin-btn-danger {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(239,68,68,.12); color: #f87171;
          font-family: var(--admin-font-head); font-size: 13px; font-weight: 700;
          letter-spacing: 1px; text-transform: uppercase;
          padding: 10px 20px; border: 1px solid rgba(239,68,68,.25); cursor: pointer;
          transition: all .2s;
        }
        .admin-btn-danger:hover { background: rgba(239,68,68,.22); }

        .admin-input {
          width: 100%; padding: 11px 14px;
          background: rgba(0,0,0,.3); border: 1px solid rgba(255,255,255,.1);
          color: #fff; font-family: var(--admin-font-body); font-size: 14px;
          outline: none; transition: border-color .2s;
        }
        .admin-input:focus { border-color: var(--admin-gold); }
        .admin-input::placeholder { color: rgba(255,255,255,.25); }

        .admin-select {
          width: 100%; padding: 11px 14px;
          background: rgba(0,0,0,.3); border: 1px solid rgba(255,255,255,.1);
          color: #fff; font-family: var(--admin-font-body); font-size: 14px;
          outline: none; cursor: pointer;
        }

        .admin-label {
          font-family: var(--admin-font-head); font-size: 12px; font-weight: 800;
          color: rgba(255,255,255,.4); letter-spacing: 2px; text-transform: uppercase;
          display: block; margin-bottom: 6px;
        }

        .admin-list-item {
          padding: 14px 16px;
          border: 1px solid var(--admin-border); border-left: 3px solid transparent;
          background: rgba(0,0,0,.18);
          display: flex; justify-content: space-between; gap: 12; align-items: flex-start;
          margin-bottom: 6px; cursor: pointer; transition: all 0.15s;
        }
        .admin-list-item:hover  { border-left-color: var(--admin-gold); background: rgba(232,160,0,.04); }
        .admin-list-item.active { border-left-color: var(--admin-gold); background: rgba(232,160,0,.08); }

        .admin-alert-error   { padding:10px 14px; background:rgba(239,68,68,.1); border-left:3px solid #ef4444; color:#f87171; font-size:13px; margin-bottom:14px; }
        .admin-alert-success { padding:10px 14px; background:rgba(232,160,0,.1); border-left:3px solid var(--admin-gold); color:var(--admin-gold); font-size:13px; margin-bottom:14px; }
        .admin-alert-info    { padding:10px 14px; background:rgba(232,160,0,.06); border-left:3px solid rgba(232,160,0,.4); color:rgba(232,160,0,.8); font-size:13px; margin-bottom:14px; }

        /* ── Mobile shared ── */
        .ed-split   { }
        .ph-title   { }

        @media (max-width: 900px) {
          .admin-sidebar     { display: none !important; }
          .admin-mobile-bar  { display: flex !important; }
          .admin-main        { margin-left: 0 !important; padding: 72px 16px 24px !important; }
          .admin-card        { padding: 16px !important; }

          .ed-split          { grid-template-columns: 1fr !important; }
          .ed-cols2          { grid-template-columns: 1fr !important; }
          .ed-cols3          { grid-template-columns: 1fr !important; }
          .ed-row            { flex-direction: column !important; }
          .ed-row > *        { width: 100% !important; }

          .ph-title          { font-size: 22px !important; }
          .ph-actions        { width: 100% !important; flex-wrap: wrap; }
          .ph-actions > *    { flex: 1 !important; justify-content: center !important; min-width: 100px; }

          .admin-list-item   { flex-wrap: wrap; }
          .list-actions      { margin-left: auto; }

          .dv-grid           { grid-template-columns: 1fr !important; }
          .dv-infos          { grid-template-columns: 1fr !important; }
          .dv-modal-grid     { grid-template-columns: 1fr !important; }
          .dv-actions        { flex-direction: column !important; }
          .dv-actions button, .dv-actions a { width: 100% !important; justify-content: center !important; }

          .dash-grid         { grid-template-columns: 1fr 1fr !important; gap: 6px !important; }
          .dash-title        { font-size: 24px !important; }
        }

        @media (max-width: 480px) {
          .admin-main        { padding: 68px 12px 20px !important; }
          .dash-grid         { grid-template-columns: 1fr !important; }
          .ph-title          { font-size: 19px !important; }
          .admin-btn-primary, .admin-btn-ghost, .admin-btn-danger { font-size: 12px !important; padding: 9px 14px !important; }
        }

        /* ── Mobile drawer overlay ── */
        .mob-drawer-overlay {
          display: none; position: fixed; inset: 0; z-index: 299;
          background: rgba(0,0,0,0.6); backdrop-filter: blur(3px);
        }
        .mob-drawer {
          position: fixed; top: 0; left: 0; bottom: 0; width: 260px; z-index: 300;
          background: var(--admin-sidebar); border-right: 1px solid var(--admin-border);
          display: flex; flex-direction: column; overflow-y: auto;
          transform: translateX(-100%); transition: transform 0.25s ease;
        }
        .mob-drawer.open { transform: translateX(0); }
        .mob-drawer-overlay.open { display: block; }
      `}</style>

      {/* ── Desktop Sidebar ── */}
      <aside className="admin-sidebar" style={{ width: 230, flexShrink: 0, background: "var(--admin-sidebar)", borderRight: "1px solid var(--admin-border)", position: "fixed", top: 0, bottom: 0, left: 0, display: "flex", flexDirection: "column", overflowY: "auto", zIndex: 200 }}>
        <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid var(--admin-border)" }}>
          <Link to="/admin" style={{ textDecoration: "none", display: "block" }}>
            <AdminLogo info={info} />
          </Link>
          <div style={{ marginTop: 6, fontFamily: "var(--admin-font-body)", fontSize: 11, color: "rgba(255,255,255,.25)", textTransform: "uppercase", letterSpacing: 2 }}>Administration</div>
        </div>
        <div style={{ height: 3, background: "var(--admin-gold)", flexShrink: 0 }} />
        <nav style={{ flex: 1, paddingTop: 12 }}>
          {NAV.map(item => {
            const active = isActive(item);
            return (
              <Link key={item.to} to={item.to} className={`admin-nav-item${active ? " active" : ""}`}>
                <span className="nav-icon">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div style={{ padding: "16px 20px", borderTop: "1px solid var(--admin-border)" }}>
          <Link to="/" target="_blank" style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 14px", marginBottom: 8, color: "rgba(255,255,255,.45)", fontFamily: "var(--admin-font-head)", fontSize: 13, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", textDecoration: "none", border: "1px solid rgba(255,255,255,.08)", transition: "all .2s" }}
            onMouseEnter={e => e.currentTarget.style.color = "#fff"}
            onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,.45)"}
          >↗ Voir le site</Link>
          <button onClick={handleLogout} className="admin-btn-danger" style={{ width: "100%", justifyContent: "center" }}>🚪 Déconnexion</button>
        </div>
      </aside>

      {/* ── Mobile top bar ── */}
      <div className="admin-mobile-bar" style={{ display: "none", position: "fixed", top: 0, left: 0, right: 0, zIndex: 200, background: "var(--admin-sidebar)", borderBottom: "3px solid var(--admin-gold)", height: 56, alignItems: "center", padding: "0 16px", gap: 12 }}>
        {/* Hamburger */}
        <button onClick={() => setMenuOpen(true)} style={{ background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.12)", color: "#fff", width: 38, height: 38, borderRadius: 8, cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>☰</button>
        {/* Logo */}
        <Link to="/admin" style={{ textDecoration: "none", flex: 1 }}>
          <AdminLogo info={info} />
        </Link>
        {/* Active page label */}
        <span style={{ fontFamily: "var(--admin-font-head)", fontSize: 12, fontWeight: 800, color: "var(--admin-gold)", letterSpacing: 1, textTransform: "uppercase" }}>
          {NAV.find(n => isActive(n))?.label || "Admin"}
        </span>
      </div>

      {/* ── Mobile drawer overlay ── */}
      <div className={`mob-drawer-overlay${menuOpen ? " open" : ""}`} onClick={() => setMenuOpen(false)} />

      {/* ── Mobile drawer ── */}
      <div className={`mob-drawer${menuOpen ? " open" : ""}`}>
        <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid var(--admin-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <AdminLogo info={info} />
          <button onClick={() => setMenuOpen(false)} style={{ background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.12)", color: "#aaa", width: 32, height: 32, borderRadius: 8, cursor: "pointer", fontSize: 16 }}>✕</button>
        </div>
        <div style={{ height: 3, background: "var(--admin-gold)" }} />
        <nav style={{ flex: 1, paddingTop: 8 }}>
          {NAV.map(item => {
            const active = isActive(item);
            return (
              <Link key={item.to} to={item.to}
                className={`admin-nav-item${active ? " active" : ""}`}
                onClick={() => setMenuOpen(false)}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div style={{ padding: "16px 20px", borderTop: "1px solid var(--admin-border)" }}>
          <Link to="/" target="_blank" onClick={() => setMenuOpen(false)}
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 14px", marginBottom: 8, color: "rgba(255,255,255,.45)", fontFamily: "var(--admin-font-head)", fontSize: 13, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", textDecoration: "none", border: "1px solid rgba(255,255,255,.08)" }}
          >↗ Voir le site</Link>
          <button onClick={handleLogout} className="admin-btn-danger" style={{ width: "100%", justifyContent: "center" }}>🚪 Déconnexion</button>
        </div>
      </div>

      {/* ── Main content ── */}
      <main className="admin-main" style={{ marginLeft: 230, flex: 1, minWidth: 0, padding: "36px 32px", animation: "fadeIn 0.3s ease" }}>
        <Outlet />
      </main>
    </div>
  );
}