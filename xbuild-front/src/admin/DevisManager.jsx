import { useEffect, useState } from "react";
import { apiFetch } from "../lib/api";
import { Alert, Button, Card, EmptyState, Field, Input, PageHeader, Spinner, Textarea } from "./components/UI";

/* ── helpers ── */
const fmtDate = (iso) => iso ? new Date(iso).toLocaleString("fr-FR", { day:"2-digit", month:"short", year:"numeric", hour:"2-digit", minute:"2-digit" }) : "—";
const statusInfo = {
  new:     { label:"Nouveau",          color:"var(--admin-gold)", bg:"rgba(245,91,31,0.12)" },
  read:    { label:"Lu",               color:"#8e95a3", bg:"rgba(142,149,163,0.10)" },
  quoted:  { label:"Devis envoyé",     color:"#10b981", bg:"rgba(16,185,129,0.12)" },
  visited: { label:"Visite proposée",  color:"#06b6d4", bg:"rgba(6,182,212,0.12)" },
  closed:  { label:"Clôturé",          color:"#6b7280", bg:"rgba(107,114,128,0.10)" },
};

function StatusBadge({ status }) {
  const s = statusInfo[status] || statusInfo.new;
  return (
    <span style={{ padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:800, fontFamily:"var(--admin-font-body)", color:s.color, background:s.bg, border:`1px solid ${s.color}30`, whiteSpace:"nowrap" }}>
      {s.label}
    </span>
  );
}

/* ── Modal réponse ── */
function ResponseModal({ request, mode, onClose, onSent }) {
  const [form, setForm] = useState(
    mode === "devis"
      ? { montant:"", devise:"MAD", validite:"30", description:"", conditions:"" }
      : { date:"", heure:"", lieu:"", duree:"60", notes:"" }
  );
  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState(false);

  const patch = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const buildMailtoDevis = () => {
    const subject = `Devis — ${request.service || "votre demande"}`;
    const body = [
      `Bonjour ${request.name},`,
      ``,
      `Suite à votre demande de devis, veuillez trouver ci-dessous notre proposition :`,
      ``,
      `───────────────────────────────`,
      form.description ? `Prestations :\n${form.description}` : "",
      ``,
      `Montant total : ${form.montant} ${form.devise} HT`,
      `Validité du devis : ${form.validite} jours`,
      form.conditions ? `\nConditions particulières :\n${form.conditions}` : "",
      `───────────────────────────────`,
      ``,
      `Pour toute question ou pour accepter ce devis, n'hésitez pas à nous contacter.`,
      ``,
      `Cordialement,`,
    ].join("\n");
    return `mailto:${request.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const buildMailtoVisite = () => {
    const subject = `Proposition de visite — ${request.service || "votre demande"}`;
    const body = [
      `Bonjour ${request.name},`,
      ``,
      `Nous souhaitons vous proposer une visite sur chantier :`,
      ``,
      `📅 Date : ${form.date}`,
      `⏰ Heure : ${form.heure}`,
      `📍 Lieu : ${form.lieu}`,
      `⏱️ Durée estimée : ${form.duree} minutes`,
      form.notes ? `\n📝 Notes : ${form.notes}` : "",
      ``,
      `Merci de nous confirmer votre présence en répondant à cet email.`,
      ``,
      `Cordialement,`,
    ].join("\n");
    return `mailto:${request.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleSend = async () => {
    if (mode === "devis" && !form.montant) { setError("Veuillez indiquer le montant."); return; }
    if (mode === "visite" && (!form.date || !form.heure || !form.lieu)) { setError("Date, heure et lieu sont obligatoires."); return; }
    setError("");
    const mailto = mode === "devis" ? buildMailtoDevis() : buildMailtoVisite();
    window.open(mailto, "_blank");
    try {
      const newStatus = mode === "devis" ? "quoted" : "visited";
      await apiFetch(`/api/devis/${request._id}/status`, {
        method: "PUT", auth: true,
        body: JSON.stringify({ status: newStatus }),
      });
      onSent(request._id, newStatus);
    } catch {}
    setSuccess(true);
    setTimeout(onClose, 1800);
  };

  const isDevis = mode === "devis";
  const title   = isDevis ? "📋 Envoyer un devis" : "🗓️ Proposer une visite";
  const accent  = isDevis ? "#10b981" : "#06b6d4";

  return (
    <div style={{ position:"fixed", inset:0, zIndex:1000, background:"rgba(0,0,0,0.8)", backdropFilter:"blur(4px)", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }} onClick={onClose}>
      <div style={{ background:"#131519", border:`1px solid ${accent}30`, borderRadius:20, maxWidth:560, width:"100%", boxShadow:`0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px ${accent}20`, overflow:"hidden", animation:"fadeUp 0.25s ease" }} onClick={e => e.stopPropagation()}>
        <style>{`@keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:none; } }`}</style>

        {/* Header */}
        <div style={{ padding:"20px 24px 16px", borderBottom:"1px solid rgba(255,255,255,0.07)", display:"flex", justifyContent:"space-between", alignItems:"center", background:`linear-gradient(135deg, ${accent}12, transparent)` }}>
          <div>
            <h3 style={{ margin:0, fontSize:18, fontWeight:900, color:"#fff", fontFamily:"var(--admin-font-body)" }}>{title}</h3>
            <p style={{ margin:"4px 0 0", fontSize:13, color:"#666", fontFamily:"var(--admin-font-body)" }}>
              Pour <strong style={{ color:"#ccc" }}>{request.name}</strong> · <span style={{ color:"#555" }}>{request.email}</span>
            </p>
          </div>
          <button onClick={onClose} style={{ background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.1)", color:"#888", width:34, height:34, borderRadius:8, cursor:"pointer", fontSize:16 }}>✕</button>
        </div>

        <div style={{ padding:"20px 24px 24px", maxHeight:"70vh", overflowY:"auto" }}>
          {error && <Alert type="error">{error}</Alert>}

          {/* Succès */}
          {success && (
            <div style={{ padding:"14px 18px", borderRadius:12, background:"rgba(16,185,129,0.15)", border:"1px solid rgba(16,185,129,0.35)", marginBottom:16, textAlign:"center", color:"#10b981", fontWeight:800, fontSize:15 }}>
              ✅ Email envoyé avec succès !
            </div>
          )}

          {/* Récap de la demande */}
          <div style={{ padding:"12px 16px", borderRadius:10, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", marginBottom:20 }}>
            <div style={{ fontSize:11, fontWeight:800, color:"#555", textTransform:"uppercase", letterSpacing:1, marginBottom:8 }}>Demande originale</div>
            <div style={{ color:"#aaa", fontSize:13, fontFamily:"var(--admin-font-body)", lineHeight:1.6 }}>
              {request.service && <span style={{ color:"var(--admin-gold)", fontWeight:700 }}>[{request.service}] </span>}
              {request.message}
            </div>
          </div>

          {isDevis ? (
            <>
              <div className="dv-modal-grid" style={{ display:"grid", gridTemplateColumns:"1fr 80px 80px", gap:10 }}>
                <Field label="Montant *">
                  <Input value={form.montant} onChange={e => patch("montant", e.target.value)} placeholder="12 500" type="text" />
                </Field>
                <Field label="Devise">
                  <select value={form.devise} onChange={e => patch("devise", e.target.value)}
                    style={{ width:"100%", padding:"11px 10px", borderRadius:10, border:"1px solid rgba(255,255,255,0.10)", background:"rgba(0,0,0,0.28)", color:"#fff", fontFamily:"var(--admin-font-body)", fontSize:14, outline:"none" }}>
                    {["MAD","EUR","USD","GBP","TND"].map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </Field>
                <Field label="Validité (j)">
                  <Input value={form.validite} onChange={e => patch("validite", e.target.value)} placeholder="30" type="number" />
                </Field>
              </div>
              <Field label="Description des travaux / prestations *">
                <Textarea value={form.description} onChange={e => patch("description", e.target.value)} rows={5}
                  placeholder={"• Travaux de gros œuvre\n• Fourniture et pose des matériaux\n• Main-d'œuvre incluse\n..."} />
              </Field>
              <Field label="Conditions particulières (optionnel)">
                <Textarea value={form.conditions} onChange={e => patch("conditions", e.target.value)} rows={2}
                  placeholder="Délai de paiement : 30 jours. Acompte de 30% à la commande…" />
              </Field>
            </>
          ) : (
            <>
              <div className="dv-modal-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                <Field label="Date *">
                  <input type="date" value={form.date} onChange={e => patch("date", e.target.value)}
                    style={{ width:"100%", padding:"11px 14px", borderRadius:10, border:"1px solid rgba(255,255,255,0.10)", background:"rgba(0,0,0,0.28)", color:"#fff", fontFamily:"var(--admin-font-body)", fontSize:14, outline:"none", boxSizing:"border-box", colorScheme:"dark" }} />
                </Field>
                <Field label="Heure *">
                  <input type="time" value={form.heure} onChange={e => patch("heure", e.target.value)}
                    style={{ width:"100%", padding:"11px 14px", borderRadius:10, border:"1px solid rgba(255,255,255,0.10)", background:"rgba(0,0,0,0.28)", color:"#fff", fontFamily:"var(--admin-font-body)", fontSize:14, outline:"none", boxSizing:"border-box", colorScheme:"dark" }} />
                </Field>
              </div>
              <Field label="Lieu / Adresse du chantier *">
                <input type="text" value={form.lieu} onChange={e => patch("lieu", e.target.value)}
                  placeholder="123 Rue Hassan II, Casablanca"
                  style={{ width:"100%", padding:"11px 14px", borderRadius:10, border:"1px solid rgba(255,255,255,0.10)", background:"rgba(0,0,0,0.28)", color:"#fff", fontFamily:"var(--admin-font-body)", fontSize:14, outline:"none", boxSizing:"border-box" }} />
              </Field>
              <Field label="Durée estimée (minutes)">
                <select value={form.duree} onChange={e => patch("duree", e.target.value)}
                  style={{ width:"100%", padding:"11px 14px", borderRadius:10, border:"1px solid rgba(255,255,255,0.10)", background:"rgba(0,0,0,0.28)", color:"#fff", fontFamily:"var(--admin-font-body)", fontSize:14, outline:"none" }}>
                  {["30","60","90","120","180"].map(d => <option key={d} value={d}>{d} min</option>)}
                </select>
              </Field>
              <Field label="Notes supplémentaires (optionnel)">
                <Textarea value={form.notes} onChange={e => patch("notes", e.target.value)} rows={3}
                  placeholder="Merci d'apporter les plans du chantier. Accès par l'entrée principale…" />
              </Field>
            </>
          )}

          <div style={{ display:"flex", gap:10, marginTop:8 }}>
            <button onClick={handleSend} disabled={success}
              style={{ flex:1, padding:"13px", borderRadius:10, border:"none", cursor: success?"not-allowed":"pointer", fontWeight:900, fontSize:14, background: success ? "rgba(0,0,0,0.3)" : accent, color:"#fff", fontFamily:"var(--admin-font-body)", display:"flex", alignItems:"center", justifyContent:"center", gap:8, transition:"all 0.2s" }}>
              {isDevis ? "📧 Ouvrir la messagerie — Devis" : "📧 Ouvrir la messagerie — Visite"}
            </button>
            <button onClick={onClose} style={{ padding:"13px 20px", borderRadius:10, border:"1px solid rgba(255,255,255,0.1)", background:"rgba(255,255,255,0.05)", color:"#888", cursor:"pointer", fontFamily:"var(--admin-font-body)", fontWeight:700, fontSize:14 }}>
              Annuler
            </button>
          </div>
          <p style={{ textAlign:"center", marginTop:12, color:"#444", fontSize:12, fontFamily:"var(--admin-font-body)", lineHeight:1.5 }}>
            📬 Le formulaire pré-rempli s'ouvrira dans votre client de messagerie.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Main ── */
export default function DevisManager() {
  const [items,    setItems]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");
  const [selected, setSelected] = useState(null);
  const [modal,    setModal]    = useState(null); // "devis" | "visite" | null
  const [filter,   setFilter]   = useState("all");

  const load = async () => {
    setLoading(true);
    try { setItems(await apiFetch("/api/devis", { auth:true })); }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const markRead = async (id) => {
    try {
      await apiFetch(`/api/devis/${id}/read`, { method:"PUT", auth:true });
      setItems(it => it.map(i => i._id===id ? {...i, read:true, status: i.status||"read"} : i));
    } catch {}
  };

  const onResponseSent = (id, newStatus) => {
    setItems(it => it.map(i => i._id===id ? {...i, status:newStatus, read:true} : i));
    setSelected(s => s?._id===id ? {...s, status:newStatus, read:true} : s);
  };

  const filtered = items.filter(i => {
    if (filter === "all")     return true;
    if (filter === "unread")  return !i.read;
    if (filter === "quoted")  return i.status === "quoted";
    if (filter === "visited") return i.status === "visited";
    return true;
  });

  const counts = {
    all:     items.length,
    unread:  items.filter(i => !i.read).length,
    quoted:  items.filter(i => i.status === "quoted").length,
    visited: items.filter(i => i.status === "visited").length,
  };

  return (
    <div>
      <style>{`
        @keyframes spin { to { transform:rotate(360deg); } }
        @media (max-width: 700px) {
          .dv-grid  { grid-template-columns: 1fr !important; }
          .dv-infos { grid-template-columns: 1fr !important; }
          .dv-modal-grid { grid-template-columns: 1fr !important; }
          .dv-filters { gap: 6px !important; }
          .dv-filters button { font-size: 11px !important; padding: 5px 10px !important; }
          .dv-actions { flex-direction: column !important; }
          .dv-actions button, .dv-actions a { width: 100% !important; justify-content: center !important; }
        }
      `}</style>

      <PageHeader
        icon="📩"
        title="Demandes de devis"
        subtitle={`${counts.unread > 0 ? `${counts.unread} non lue${counts.unread>1?"s":""} · ` : ""}${items.length} demande${items.length!==1?"s":""} au total`}
        actions={<Button variant="ghost" onClick={load} disabled={loading}>{loading ? <Spinner size={14} /> : "↺"} Actualiser</Button>}
      />

      {error && <Alert type="error">{error}</Alert>}

      {/* Filtres */}
      <div className="dv-filters" style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap" }}>
        {[
          { key:"all",     label:`Toutes (${counts.all})` },
          { key:"unread",  label:`Non lues (${counts.unread})` },
          { key:"quoted",  label:`Devis envoyés (${counts.quoted})` },
          { key:"visited", label:`Visites proposées (${counts.visited})` },
        ].map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)} style={{
            padding:"7px 16px", borderRadius:20, fontFamily:"var(--admin-font-body)",
            fontWeight:700, fontSize:12, cursor:"pointer", border:"1px solid",
            borderColor: filter===f.key ? "var(--admin-gold)" : "rgba(255,255,255,0.12)",
            background:  filter===f.key ? "rgba(245,91,31,0.15)" : "rgba(255,255,255,0.04)",
            color:       filter===f.key ? "var(--admin-gold)" : "#8e95a3",
          }}>{f.label}</button>
        ))}
      </div>

      <div className="dv-grid" style={{ display:"grid", gridTemplateColumns: selected ? "1fr 1fr" : "1fr", gap:16 }}>

        {/* ── Détail + actions ── */}
        {selected && (
          <Card style={{ position:"sticky", top:20, alignSelf:"start" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20 }}>
              <div>
                <h3 style={{ margin:"0 0 6px", color:"#fff", fontFamily:"var(--admin-font-body)", fontWeight:900, fontSize:18 }}>
                  {selected.name}
                </h3>
                <StatusBadge status={selected.status || (selected.read ? "read" : "new")} />
              </div>
              <Button variant="ghost" onClick={() => setSelected(null)}>✕</Button>
            </div>

            {/* Infos */}
            <div className="dv-infos" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:16 }}>
              {[
                { label:"Email",       value: selected.email },
                { label:"Téléphone",   value: selected.phone },
                { label:"Service",     value: selected.service },
                { label:"Reçu le",     value: fmtDate(selected.sentAt) },
              ].map(f => f.value ? (
                <div key={f.label} style={{ padding:"10px 12px", borderRadius:8, background:"rgba(0,0,0,0.2)", border:"1px solid rgba(255,255,255,0.07)" }}>
                  <div style={{ fontSize:10, fontWeight:800, color:"#555", textTransform:"uppercase", letterSpacing:1, marginBottom:4 }}>{f.label}</div>
                  <div style={{ color:"#ccc", fontFamily:"var(--admin-font-body)", fontSize:13 }}>{f.value}</div>
                </div>
              ) : null)}
            </div>

            {/* Message */}
            <div style={{ marginBottom:20 }}>
              <div style={{ fontSize:11, fontWeight:800, color:"#555", textTransform:"uppercase", letterSpacing:1, marginBottom:8 }}>Message du client</div>
              <div style={{ color:"#aaa", fontFamily:"var(--admin-font-body)", fontSize:14, lineHeight:1.7, background:"rgba(0,0,0,0.2)", padding:"14px 16px", borderRadius:10, border:"1px solid rgba(255,255,255,0.07)", maxHeight:160, overflowY:"auto" }}>
                {selected.message || "—"}
              </div>
            </div>

            {/* Historique réponse */}
            {selected.response && (
              <div style={{ marginBottom:20, padding:"12px 14px", borderRadius:10, background:"rgba(16,185,129,0.08)", border:"1px solid rgba(16,185,129,0.2)" }}>
                <div style={{ fontSize:11, fontWeight:800, color:"#10b981", textTransform:"uppercase", letterSpacing:1, marginBottom:6 }}>
                  {selected.response.mode === "devis" ? "✅ Devis envoyé" : "✅ Visite proposée"} le {fmtDate(selected.response.sentAt)}
                </div>
                {selected.response.mode === "devis" && (
                  <div style={{ color:"#aaa", fontSize:13, fontFamily:"var(--admin-font-body)" }}>
                    Montant : <strong style={{ color:"#fff" }}>{selected.response.form?.montant} {selected.response.form?.devise}</strong>
                    {" · "}Validité : {selected.response.form?.validite} jours
                  </div>
                )}
                {selected.response.mode === "visite" && (
                  <div style={{ color:"#aaa", fontSize:13, fontFamily:"var(--admin-font-body)" }}>
                    📅 {selected.response.form?.date} à {selected.response.form?.heure}
                    {" · "}📍 {selected.response.form?.lieu}
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              <div style={{ fontSize:11, fontWeight:800, color:"#555", textTransform:"uppercase", letterSpacing:1, marginBottom:4 }}>Répondre par</div>

              <button onClick={() => setModal("devis")}
                style={{ padding:"12px 16px", borderRadius:10, border:"1px solid rgba(16,185,129,0.3)", background:"rgba(16,185,129,0.10)", color:"#10b981", fontFamily:"var(--admin-font-body)", fontWeight:800, fontSize:14, cursor:"pointer", display:"flex", alignItems:"center", gap:10, transition:"all 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.background="rgba(16,185,129,0.18)"}
                onMouseLeave={e => e.currentTarget.style.background="rgba(16,185,129,0.10)"}
              >
                <span style={{ fontSize:20 }}>📋</span>
                <div style={{ textAlign:"left" }}>
                  <div>Envoyer un devis</div>
                  <div style={{ fontSize:12, opacity:0.7, fontWeight:400 }}>Montant, description, conditions</div>
                </div>
                <span style={{ marginLeft:"auto" }}>→</span>
              </button>

              <button onClick={() => setModal("visite")}
                style={{ padding:"12px 16px", borderRadius:10, border:"1px solid rgba(6,182,212,0.3)", background:"rgba(6,182,212,0.10)", color:"#06b6d4", fontFamily:"var(--admin-font-body)", fontWeight:800, fontSize:14, cursor:"pointer", display:"flex", alignItems:"center", gap:10, transition:"all 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.background="rgba(6,182,212,0.18)"}
                onMouseLeave={e => e.currentTarget.style.background="rgba(6,182,212,0.10)"}
              >
                <span style={{ fontSize:20 }}>🗓️</span>
                <div style={{ textAlign:"left" }}>
                  <div>Proposer une visite</div>
                  <div style={{ fontSize:12, opacity:0.7, fontWeight:400 }}>Date, heure, lieu du chantier</div>
                </div>
                <span style={{ marginLeft:"auto" }}>→</span>
              </button>

              <div className="dv-actions" style={{ display:"flex", gap:8, marginTop:4, flexWrap:"wrap" }}>
                {/* ── Ouvrir dans la messagerie ── */}
                <a
                  href={`mailto:${selected.email}?subject=${encodeURIComponent(`Re : Demande de devis — ${selected.service || "votre demande"}`)}&body=${encodeURIComponent(`Bonjour ${selected.name},\n\nNous avons bien reçu votre demande et nous revenons vers vous.\n\n---\nVotre message : ${selected.message}\n---\n\nCordialement,`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"9px 16px", borderRadius:10, border:"1px solid rgba(245,91,31,0.35)", background:"rgba(245,91,31,0.10)", color:"var(--admin-gold)", fontFamily:"var(--admin-font-body)", fontWeight:800, fontSize:13, cursor:"pointer", textDecoration:"none", transition:"all 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.background="rgba(245,91,31,0.20)"}
                  onMouseLeave={e => e.currentTarget.style.background="rgba(245,91,31,0.10)"}
                >
                  📧 Ouvrir dans la messagerie
                </a>
                {!selected.read && (
                  <Button variant="ghost" onClick={() => { markRead(selected._id); setSelected({...selected, read:true}); }}>
                    ✓ Marquer lu
                  </Button>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* ── Liste ── */}
        <Card>
          {loading
            ? <div style={{ display:"flex", justifyContent:"center", padding:40 }}><Spinner size={28} /></div>
            : filtered.length === 0
              ? <EmptyState icon="📩" title={filter==="all" ? "Aucune demande" : "Aucun résultat"} message={filter==="all" ? "Les demandes apparaîtront ici." : "Changez le filtre."} />
              : filtered.map(doc => {
                  const status = doc.status || (doc.read ? "read" : "new");
                  return (
                    <div key={doc._id}
                      onClick={() => { setSelected(doc); if(!doc.read) markRead(doc._id); }}
                      style={{ padding:"14px 16px", borderRadius:12, marginBottom:8, cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:12, transition:"all 0.15s", border: selected?._id===doc._id ? "1px solid rgba(245,91,31,0.4)" : "1px solid rgba(255,255,255,0.07)", background: selected?._id===doc._id ? "rgba(245,91,31,0.08)" : "rgba(0,0,0,0.18)" }}
                      onMouseEnter={e => { if(selected?._id!==doc._id) e.currentTarget.style.background="rgba(255,255,255,0.04)"; }}
                      onMouseLeave={e => { if(selected?._id!==doc._id) e.currentTarget.style.background="rgba(0,0,0,0.18)"; }}
                    >
                      <div style={{ display:"flex", gap:10, flex:1, minWidth:0, alignItems:"flex-start" }}>
                        {/* Indicateur non-lu */}
                        <div style={{ width:8, height:8, borderRadius:"50%", background: !doc.read ? "var(--admin-gold)" : "transparent", flexShrink:0, marginTop:5 }} />
                        <div style={{ minWidth:0, flex:1 }}>
                          <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:4, flexWrap:"wrap" }}>
                            <span style={{ fontWeight:800, color:"#fff", fontSize:14 }}>{doc.name||"—"}</span>
                            <StatusBadge status={status} />
                          </div>
                          <div style={{ color:"#555", fontSize:12, marginBottom:4 }}>{doc.email}</div>
                          <div style={{ color:"#666", fontSize:12, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:300 }}>
                            {doc.service ? <span style={{ color:"var(--admin-gold)", fontWeight:700 }}>[{doc.service}] </span> : null}{doc.message}
                          </div>
                        </div>
                      </div>
                      <div style={{ color:"#444", fontSize:11, flexShrink:0, textAlign:"right", paddingTop:2 }}>
                        {doc.sentAt ? new Date(doc.sentAt).toLocaleDateString("fr-FR") : ""}
                      </div>
                    </div>
                  );
                })
          }
        </Card>
      </div>

      {/* Modal réponse */}
      {modal && selected && (
        <ResponseModal
          key={modal}
          request={selected}
          mode={modal}
          onClose={() => setModal(null)}
          onSent={onResponseSent}
        />
      )}
    </div>
  );
}