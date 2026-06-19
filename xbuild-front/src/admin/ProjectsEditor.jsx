import { useState } from "react";
import { useCrud } from "./components/useCrud";
import {
  Alert, Badge, Button, Card, EmptyState, Field, Input,
  ListItem, PageHeader, SectionHeading, Spinner, Textarea,
} from "./components/UI";
import { ImageUploader } from "./components/ImageUploader";

const EMPTY = { title_fr:"", title_en:"", category_fr:"", category_en:"", desc_fr:"", desc_en:"", year: String(new Date().getFullYear()), bg:"#1a1a2e", image:"", images:[] };
const BG_PRESETS = ["#1a1a2e","#16213e","#0f3460","#533483","#1a2744","#0d1b2a","#1e3a1e","#2d1b1b"];
const CAT = {
  fr: ["Industriel","Construction","Civil","Architecture","Énergie","Résidentiel","Commercial","Infrastructure"],
  en: ["Industrial","Construction","Civil","Architecture","Energy","Residential","Commercial","Infrastructure"],
};
const YEAR_RANGE = Array.from({ length: 10 }, (_, i) => String(new Date().getFullYear() - i));
const LANG_TABS  = [{ code:"fr", label:"🇫🇷 Français" }, { code:"en", label:"🇬🇧 English" }];

export default function ProjectsEditor() {
  const { items, loading, saving, error, editing, form, isEdit, load, startCreate, startEdit, cancel, save, remove, patch } = useCrud("/api/projects", EMPTY);
  const [lang, setLang] = useState("fr");

  const imgList = () => (form.images && form.images.length > 0 ? form.images : (form.image ? [form.image] : []));

  return (
    <div>
      <PageHeader icon="📁" title="Projets"
        subtitle={`${items.length} projet${items.length !== 1 ? "s" : ""} — affichés dans le portfolio`}
        actions={<>
          <Button variant="ghost" onClick={load} disabled={loading}>{loading ? <Spinner size={14} /> : "↺"} Actualiser</Button>
          <Button variant="primary" onClick={startCreate}>+ Nouveau projet</Button>
        </>}
      />

      {error && <Alert type="error">{error}</Alert>}

      <div className="ed-split" style={{ display:"grid", gridTemplateColumns: editing ? "1fr 1fr" : "1fr", gap:16 }}>

        {/* ── Formulaire ── */}
        {editing && (
          <Card>
            <SectionHeading
              title={isEdit ? "Modifier le projet" : "Nouveau projet"}
              subtitle="Remplissez les champs dans les deux langues"
            />

            {/* Langue */}
            <div style={{ display:"flex", gap:8, marginBottom:16 }}>
              {LANG_TABS.map(tab => (
                <button key={tab.code} onClick={() => setLang(tab.code)} style={{
                  padding:"7px 16px", borderRadius:8, fontFamily:"var(--admin-font-body)",
                  fontWeight:700, fontSize:12, cursor:"pointer", border:"1px solid",
                  borderColor: lang===tab.code ? "var(--admin-gold)" : "rgba(255,255,255,0.12)",
                  background:  lang===tab.code ? "rgba(245,91,31,0.15)" : "rgba(255,255,255,0.04)",
                  color:       lang===tab.code ? "var(--admin-gold)" : "#aaa",
                }}>{tab.label}</button>
              ))}
            </div>

            <Field label={`Titre — ${lang==="fr" ? "Français 🇫🇷" : "English 🇬🇧"}`}>
              <Input
                value={form[`title_${lang}`] || ""}
                onChange={e => patch(`title_${lang}`, e.target.value)}
                placeholder={lang==="fr" ? "Ex: Expansion Usine Acier" : "Ex: Steel Factory Expansion"}
              />
            </Field>

            <Field label={`Description — ${lang==="fr" ? "Français 🇫🇷" : "English 🇬🇧"}`}>
              <Textarea
                value={form[`desc_${lang}`] || ""}
                onChange={e => patch(`desc_${lang}`, e.target.value)}
                placeholder={lang==="fr" ? "Décrivez ce projet…" : "Describe this project…"}
                rows={3}
              />
            </Field>

            <Field label={`Catégorie — ${lang==="fr" ? "Français 🇫🇷" : "English 🇬🇧"}`}>
              <Input
                value={form[`category_${lang}`] || ""}
                onChange={e => patch(`category_${lang}`, e.target.value)}
                placeholder={lang==="fr" ? "Ex: Industriel" : "Ex: Industrial"}
              />
              <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginTop:6 }}>
                {CAT[lang].map(c => (
                  <button key={c} onClick={() => patch(`category_${lang}`, c)} style={{
                    padding:"3px 10px", borderRadius:6, fontSize:11, fontWeight:700, cursor:"pointer",
                    border: form[`category_${lang}`]===c ? "1px solid rgba(245,91,31,0.5)" : "1px solid rgba(255,255,255,0.10)",
                    background: form[`category_${lang}`]===c ? "rgba(245,91,31,0.12)" : "rgba(255,255,255,0.04)",
                    color: form[`category_${lang}`]===c ? "var(--admin-gold)" : "#888",
                  }}>{c}</button>
                ))}
              </div>
            </Field>

            <Field label="Année">
              <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                {YEAR_RANGE.map(y => (
                  <button key={y} onClick={() => patch("year", y)} style={{
                    padding:"6px 14px", borderRadius:8, fontSize:13, fontWeight:800, cursor:"pointer",
                    border: form.year===y ? "1px solid rgba(245,91,31,0.5)" : "1px solid rgba(255,255,255,0.10)",
                    background: form.year===y ? "rgba(245,91,31,0.12)" : "rgba(255,255,255,0.04)",
                    color: form.year===y ? "var(--admin-gold)" : "#888",
                  }}>{y}</button>
                ))}
              </div>
            </Field>

            <SectionHeading
              title="🖼️ Photos du projet"
              subtitle="Plusieurs photos défilent automatiquement sur la carte et dans la fiche détaillée"
            />

            <Field label="Galerie de photos">
              {imgList().map((img, idx) => (
                <div key={idx} style={{ marginBottom:12, padding:10, borderRadius:8, border:"1px solid rgba(255,255,255,0.08)", background:"rgba(0,0,0,0.15)" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                    <span style={{ color:"#888", fontSize:12, fontWeight:700 }}>
                      Photo {idx + 1}{idx === 0 ? " (principale)" : ""}
                    </span>
                    <Button variant="danger" onClick={() => {
                      const next = imgList().filter((_, i) => i !== idx);
                      patch("images", next);
                      patch("image", next[0] || "");
                    }}>🗑️</Button>
                  </div>
                  <ImageUploader value={img || ""} onChange={v => {
                    const next = [...imgList()];
                    next[idx] = v;
                    patch("images", next);
                    patch("image", next[0] || "");
                  }} height={100} />
                </div>
              ))}
              <Button variant="ghost" onClick={() => patch("images", [...imgList(), ""])}>
                + Ajouter une photo
              </Button>
            </Field>

            <Field label="Couleur de fond" hint="si pas d'image">
              <div className="ed-row" style={{ display:"flex", gap:10, alignItems:"center" }}>
                <Input value={form.bg} onChange={e => patch("bg", e.target.value)} placeholder="#1a1a2e" />
                <div style={{ width:38, height:38, borderRadius:8, background:form.bg, border:"1px solid rgba(255,255,255,0.15)", flexShrink:0 }} />
              </div>
              <div style={{ display:"flex", gap:6, marginTop:6, flexWrap:"wrap" }}>
                {BG_PRESETS.map(bg => (
                  <button key={bg} onClick={() => patch("bg", bg)} style={{
                    width:28, height:28, borderRadius:6, background:bg, cursor:"pointer",
                    border: form.bg===bg ? "2px solid var(--admin-gold)" : "1px solid rgba(255,255,255,0.15)",
                  }} />
                ))}
              </div>
            </Field>

            <div style={{ display:"flex", gap:10 }}>
              <Button variant="primary" onClick={save} disabled={saving || (!form.title_fr && !form.title_en)}>
                {saving ? <><Spinner size={14} /> Sauvegarde…</> : (isEdit ? "💾 Mettre à jour" : "✚ Créer")}
              </Button>
              <Button variant="ghost" onClick={cancel}>Annuler</Button>
            </div>
          </Card>
        )}

        {/* ── Liste ── */}
        <Card>
          <SectionHeading
            title="Liste des projets"
            subtitle={loading ? "Chargement…" : `${items.length} projet${items.length !== 1 ? "s" : ""}`}
          />
          {loading
            ? <div style={{ display:"flex", justifyContent:"center", padding:32 }}><Spinner size={28} /></div>
            : items.length === 0
              ? <EmptyState icon="📁" title="Aucun projet" message="Cliquez sur « Nouveau projet » pour commencer." />
              : items.map(doc => (
                <ListItem key={doc._id} active={editing?._id === doc._id} onClick={() => startEdit(doc)}>
                  <div style={{ display:"flex", gap:12, alignItems:"flex-start", flex:1, minWidth:0 }}>
                    {(doc.images?.[0] || doc.image)
                      ? <img src={doc.images?.[0] || doc.image} alt="" style={{ width:40, height:40, borderRadius:8, objectFit:"cover", flexShrink:0 }} />
                      : <div style={{ width:40, height:40, borderRadius:8, background:doc.bg||"#1a1a2e", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>🏗️</div>
                    }
                    <div style={{ minWidth:0 }}>
                      <div style={{ fontWeight:800, color:"#fff", fontSize:14, marginBottom:3 }}>
                        {doc.title_fr || "—"}
                        {doc.title_en && <span style={{ color:"#555", fontWeight:400, fontSize:12 }}> / {doc.title_en}</span>}
                      </div>
                      <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
                        <span style={{ color:"#666", fontSize:12 }}>{doc.category_fr || ""}</span>
                        <Badge color="var(--admin-gold)">{doc.year}</Badge>
                        {(doc.images?.length || 0) > 1 && <Badge color="#888">📷 {doc.images.length}</Badge>}
                      </div>
                    </div>
                  </div>
                  <div className="list-actions" style={{ display:"flex", gap:6, flexShrink:0 }}>
                    <Button variant="ghost" onClick={e => { e.stopPropagation(); startEdit(doc); }}>✏️</Button>
                    <Button variant="danger" onClick={e => { e.stopPropagation(); remove(doc); }}>🗑️</Button>
                  </div>
                </ListItem>
              ))
          }
        </Card>

      </div>
    </div>
  );
}