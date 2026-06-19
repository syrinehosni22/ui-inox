export default function SectionTitle({ tag, title, center = false, dark = false, light = false }) {
  return (
    <div style={{ textAlign: center ? "center" : "left", marginBottom: 40 }}>
      <div className="metron-tag" style={{ justifyContent: center ? "center" : "flex-start" }}>
        {tag}
      </div>
      <h2
        className={`metron-h2${light ? " light" : ""}`}
        style={{ color: dark || light ? "#fff" : "var(--c-dark)", maxWidth: center ? 680 : "none", margin: center ? "0 auto" : 0 }}
      >
        {title}
      </h2>
    </div>
  );
}
