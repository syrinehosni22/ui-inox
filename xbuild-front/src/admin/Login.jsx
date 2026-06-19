import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login, isAuth, checking } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const from      = location.state?.from?.pathname || "/admin";

  const [password, setPassword] = useState("");
  const [showPwd,  setShowPwd]  = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [attempts, setAttempts] = useState(0);

  if (!checking && isAuth) return <Navigate to={from} replace />;

  if (checking) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0f1422" }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ width: 36, height: 36, border: "3px solid rgba(232,160,0,.2)", borderTopColor: "#e8a000", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
    </div>
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password.trim() || loading) return;
    setLoading(true); setError("");
    try {
      await login(password.trim());
      navigate(from, { replace: true });
    } catch (err) {
      setAttempts(a => a + 1);
      setError(err.message || "Mot de passe incorrect");
      setPassword("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", background: "#0f1422",
      fontFamily: "'Barlow', sans-serif", overflow: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800;900&family=Barlow:wght@400;600;700&display=swap');
        @keyframes spin   { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity:0; transform:translateX(20px); } to { opacity:1; transform:none; } }
        @keyframes shake  { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-6px)} 40%,80%{transform:translateX(6px)} }
        * { box-sizing: border-box; }
        input:-webkit-autofill { -webkit-box-shadow: 0 0 0 30px #131928 inset!important; -webkit-text-fill-color: #fff!important; }
      `}</style>

      {/* Left — branding panel */}
      <div style={{
        width: "45%", background: "#131928", borderRight: "3px solid #e8a000",
        display: "flex", flexDirection: "column", justifyContent: "center",
        padding: "60px 64px", position: "relative", overflow: "hidden",
      }}>
        {/* Grid texture */}
        <div style={{ position: "absolute", inset: 0, opacity: .04 }}>
          <svg width="100%" height="100%"><defs><pattern id="g" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0L0 0 0 40" fill="none" stroke="#e8a000" strokeWidth="0.6"/></pattern></defs><rect width="100%" height="100%" fill="url(#g)"/></svg>
        </div>
        {/* Glow */}
        <div style={{ position: "absolute", bottom: "-20%", right: "-20%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(232,160,0,.12), transparent 65%)", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 64 }}>
            <div style={{ width: 4, height: 36, background: "#e8a000" }} />
            <span style={{ fontFamily: "'Barlow Condensed'", fontSize: 28, fontWeight: 900, color: "#fff", letterSpacing: 2, textTransform: "uppercase" }}>
              X<span style={{ color: "#e8a000" }}>BUILD</span>
            </span>
          </div>

          <h1 style={{ fontFamily: "'Barlow Condensed'", fontSize: 52, fontWeight: 900, color: "#fff", lineHeight: 1.05, margin: "0 0 20px", letterSpacing: -0.5 }}>
            Espace<br /><span style={{ color: "#e8a000" }}>Administration</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,.4)", fontSize: 16, lineHeight: 1.7, maxWidth: 340 }}>
            Gérez votre site, vos services, projets, témoignages et demandes de devis depuis ce tableau de bord.
          </p>

          <div style={{ marginTop: 48, display: "flex", flexDirection: "column", gap: 16 }}>
            {["Gestion des contenus", "Suivi des devis", "Médias & images"].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 20, height: 20, background: "#e8a000", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ color: "#0f1422", fontSize: 11, fontWeight: 900 }}>✓</span>
                </div>
                <span style={{ color: "rgba(255,255,255,.55)", fontFamily: "'Barlow'", fontSize: 14, fontWeight: 600 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — login form */}
      <div style={{
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
        padding: "40px 48px", animation: "fadeIn .4s ease",
      }}>
        <div style={{ width: "min(420px, 100%)" }}>
          <div style={{ marginBottom: 40 }}>
            <div style={{ fontFamily: "'Barlow Condensed'", fontSize: 12, fontWeight: 800, color: "#e8a000", letterSpacing: 3, textTransform: "uppercase", marginBottom: 10 }}>
              ◣ Accès sécurisé
            </div>
            <h2 style={{ fontFamily: "'Barlow Condensed'", fontSize: 36, fontWeight: 900, color: "#fff", margin: 0, letterSpacing: -0.3 }}>Connexion</h2>
            <p style={{ color: "rgba(255,255,255,.35)", fontSize: 14, margin: "8px 0 0", fontFamily: "'Barlow'" }}>
              Entrez le mot de passe admin pour continuer.
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ animation: attempts > 0 ? "shake 0.4s ease" : undefined }}>

            {error && (
              <div style={{ padding: "12px 16px", background: "rgba(239,68,68,.1)", borderLeft: "3px solid #ef4444", color: "#f87171", fontSize: 13, fontWeight: 600, marginBottom: 20, display: "flex", gap: 10, alignItems: "center", fontFamily: "'Barlow'" }}>
                <span>⚠</span>
                <span>{error}{attempts >= 3 ? <span style={{ opacity: .55, marginLeft: 6 }}>({attempts} essais)</span> : null}</span>
              </div>
            )}

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontFamily: "'Barlow Condensed'", fontSize: 12, fontWeight: 800, color: "rgba(255,255,255,.35)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>
                Mot de passe
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(""); }}
                  placeholder="••••••••••••"
                  autoComplete="current-password"
                  autoFocus
                  style={{
                    width: "100%", padding: "14px 50px 14px 16px",
                    background: "rgba(0,0,0,.3)",
                    border: error ? "1px solid rgba(239,68,68,.5)" : "1px solid rgba(255,255,255,.1)",
                    color: "#fff", fontSize: 15, outline: "none",
                    letterSpacing: showPwd ? 1 : 6,
                    fontFamily: "'Barlow'",
                    transition: "border-color .2s",
                  }}
                  onFocus={e => { if (!error) e.target.style.borderColor = "#e8a000"; }}
                  onBlur={e => { if (!error) e.target.style.borderColor = "rgba(255,255,255,.1)"; }}
                />
                <button type="button" onClick={() => setShowPwd(v => !v)}
                  style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,.35)", fontSize: 18, padding: 0, lineHeight: 1 }}>
                  {showPwd ? "🙈" : "👁"}
                </button>
              </div>
              <p style={{ margin: "8px 0 0", color: "rgba(255,255,255,.2)", fontSize: 12, fontFamily: "'Barlow'" }}>
                Configuré dans <code style={{ color: "#e8a000", background: "rgba(255,255,255,.05)", padding: "1px 5px" }}>.env → ADMIN_PASSWORD</code>
              </p>
            </div>

            <button
              type="submit"
              disabled={!password.trim() || loading}
              style={{
                width: "100%", padding: "14px",
                background: !password.trim() || loading ? "rgba(232,160,0,.25)" : "#e8a000",
                color: !password.trim() || loading ? "rgba(255,255,255,.4)" : "#0f1422",
                border: "none",
                fontFamily: "'Barlow Condensed'", fontWeight: 900, fontSize: 16,
                letterSpacing: 1, textTransform: "uppercase",
                cursor: !password.trim() || loading ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                transition: "all .2s",
              }}
            >
              {loading
                ? <><div style={{ width: 16, height: 16, border: "2px solid rgba(15,20,34,.4)", borderTopColor: "#0f1422", borderRadius: "50%", animation: "spin .7s linear infinite" }} />Vérification…</>
                : "Accéder au dashboard →"
              }
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: 28 }}>
            <Link to="/" style={{ color: "rgba(255,255,255,.25)", textDecoration: "none", fontSize: 13, fontFamily: "'Barlow'", fontWeight: 600, transition: "color .2s" }}
              onMouseEnter={e => e.currentTarget.style.color = "#e8a000"}
              onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,.25)"}
            >
              ← Retour au site public
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}