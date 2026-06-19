/**
 * Logo component — affiche l'image logo si configurée,
 * sinon le texte stylisé XBUILD.
 * Props:
 *   info       — objet info (companyName, logoImage)
 *   dark       — fond sombre (texte blanc) ou fond clair
 *   size       — "sm" | "md" | "lg"
 *   onClick    — callback optionnel
 */
export default function Logo({ info = {}, dark = true, size = "md", onClick, style = {} }) {
  const sizes = { sm: { img: 36, font: 22 }, md: { img: 56, font: 34 }, lg: { img: 72, font: 44 } };
  const { img: imgH, font: fontSize } = sizes[size] || sizes.md;
  const color = dark ? "#fff" : "#121315";

  if (info.logoImage) {
    return (
      <img
        src={info.logoImage}
        alt={info.companyName || "Logo"}
        onClick={onClick}
        style={{ height: imgH, width: "auto", objectFit: "contain", cursor: onClick ? "pointer" : "default", display: "block", ...style }}
      />
    );
  }

  return (
    <span
      onClick={onClick}
      style={{ fontSize, fontWeight: 900, color, fontFamily: "'DM Sans',sans-serif", letterSpacing: -1, cursor: onClick ? "pointer" : "default", ...style }}
    >
      {(info.companyName || "XBuild").replace(/build/i, "")}<span style={{ color: "#F55B1F" }}>{(info.companyName || "XBuild").match(/build/i)?.[0] || "BUILD"}</span>
    </span>
  );
}