import { loc } from "./helpers";

export default function Preloader({ done, info }) {
  if (done) return null;
  return (
    <div style={{
      position: "fixed", inset: 0, background: "var(--c-dark)", display: "flex",
      flexDirection: "column", alignItems: "center", justifyContent: "center",
      zIndex: 99999, transition: "opacity .4s", fontFamily: "var(--font-head)",
    }}>
      {/* Logo / company name */}
      <div style={{ color: "var(--c-primary)", fontFamily: "var(--font-head)", fontWeight: 900, fontSize: 28, letterSpacing: 4, textTransform: "uppercase", marginBottom: 32 }}>
        {info?.companyName }
      </div>
      {/* Loading bar */}
      <div style={{ width: 200, height: 3, background: "rgba(255,255,255,.1)", overflow: "hidden" }}>
        <div style={{ height: "100%", background: "var(--c-primary)", animation: "loader 1.2s linear infinite" }} />
      </div>
      <p style={{ color: "rgba(255,255,255,.3)", fontFamily: "var(--font-body)", fontSize: 13, marginTop: 16, letterSpacing: 2, textTransform: "uppercase" }}>Loading...</p>
    </div>
  );
}
