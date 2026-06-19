import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useIntersect } from "./hooks";
import SectionTitle from "./SectionTitle";

export default function ContactSection({ info }) {
  const { t } = useTranslation();
  const [ref, visible] = useIntersect();
  const [form, setForm] = useState({ name: "", email: "", phone: "", service: "", message: "" });
  const [status, setStatus] = useState("idle");
  const [errMsg, setErrMsg] = useState("");

  const phoneHref = info.phone ? `tel:${info.phone.replace(/\s+/g, "")}` : "#";

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) {
      setErrMsg("Veuillez remplir les champs obligatoires (nom, email, message).");
      setStatus("error"); return;
    }
    setStatus("sending"); setErrMsg("");
    try {
      const res = await fetch("/api/devis", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, sentAt: new Date().toISOString() }) });
      if (!res.ok) throw new Error("Erreur serveur");
      setStatus("sent");
      setForm({ name: "", email: "", phone: "", service: "", message: "" });
      setTimeout(() => setStatus("idle"), 6000);
    } catch (e) {
      setErrMsg(e.message || "Une erreur est survenue.");
      setStatus("error");
    }
  };

  const contactItems = [
    { icon: "📍", label: t("contact.location"), value: info.address },
    { icon: "✉", label: t("contact.email"),    value: info.email },
    { icon: "📞", label: t("contact.phone"),    value: info.phone },
    { icon: "⏰", label: t("contact.hours"),    value: info.workingHours },
  ];

  const inp = { className: "metron-input", style: { marginBottom: 12 } };

  return (
    <section id="contact" ref={ref} className="section-padding" style={{ padding: "100px 0", background: "var(--c-light)" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "var(--c-primary)" }} />
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(24px)", transition: "all .6s" }}>
          <SectionTitle tag={t("contact.tag")} title={t("contact.title")} center />
        </div>

        <div className="contact-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 48, alignItems: "start" }}>

          {/* Left — info */}
          <div>
            <h3 style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 24, color: "var(--c-dark)", marginBottom: 10 }}>{t("contact.subtitle")}</h3>
            <p style={{ color: "var(--c-text)", fontFamily: "var(--font-body)", lineHeight: 1.8, marginBottom: 36 }}>{t("contact.description")}</p>

            {contactItems.map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 18, alignItems: "flex-start", marginBottom: 24, opacity: visible ? 1 : 0, transform: visible ? "none" : "translateX(-20px)", transition: `all .6s ${i * .1 + .3}s` }}>
                <div style={{ width: 50, height: 50, background: "var(--c-dark)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0, borderBottom: "3px solid var(--c-primary)" }}>
                  {item.icon}
                </div>
                <div>
                  <p style={{ color: "var(--c-primary)", fontFamily: "var(--font-head)", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>{item.label}</p>
                  <p style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 15, color: "var(--c-dark)" }}>{item.value}</p>
                </div>
              </div>
            ))}

            <a href={phoneHref} className="metron-btn-primary" style={{ display: "inline-flex", marginTop: 12 }}>
              ✆ {info.phone || t("contact.callNow")}
            </a>
          </div>

          {/* Right — form */}
          <div style={{ background: "#fff", padding: "40px", borderTop: "4px solid var(--c-primary)", boxShadow: "0 4px 30px rgba(0,0,0,.06)" }}>
            <h3 style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 22, color: "var(--c-dark)", marginBottom: 28, borderBottom: "1px solid #eee", paddingBottom: 16 }}>
              {t("contact.formTitle") || "Demande de devis"}
            </h3>

            {status === "sent" ? (
              <div style={{ background: "rgba(232,160,0,.08)", border: "2px solid var(--c-primary)", padding: 28, textAlign: "center" }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
                <h3 style={{ fontFamily: "var(--font-head)", fontWeight: 800, color: "var(--c-dark)", marginBottom: 8 }}>Message envoyé !</h3>
                <p style={{ color: "var(--c-text)", fontFamily: "var(--font-body)" }}>Nous vous contacterons rapidement.</p>
              </div>
            ) : (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 0 }}>
                  <input {...inp} placeholder={t("contact.form.name")} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="metron-input" />
                  <input {...inp} type="email" placeholder={t("contact.form.email")} value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="metron-input" />
                </div>
                <input {...inp} placeholder={t("contact.form.phone")} value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="metron-input" style={{ marginBottom: 12, width: "100%" }} />
                <select value={form.service} onChange={e => setForm(f => ({ ...f, service: e.target.value }))} className="metron-select" style={{ marginBottom: 12 }}>
                  <option value="">{t("contact.form.selectService")}</option>
                  {(t("services.items", { returnObjects: true }) || []).map((s, i) => (
                    <option key={i} value={s.title}>{s.title}</option>
                  ))}
                </select>
                <textarea className="metron-input" placeholder={t("contact.form.message")} rows={5} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} style={{ resize: "vertical", marginBottom: 16 }} />

                {status === "error" && errMsg && (
                  <p style={{ color: "#e55", fontFamily: "var(--font-body)", fontSize: 14, marginBottom: 12 }}>{errMsg}</p>
                )}

                <button
                  className="metron-btn-primary"
                  onClick={handleSubmit}
                  disabled={status === "sending"}
                  style={{ width: "100%", justifyContent: "center", opacity: status === "sending" ? .7 : 1 }}
                >
                  {status === "sending" ? "Envoi..." : (t("contact.form.send") || "Envoyer la demande")} →
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
