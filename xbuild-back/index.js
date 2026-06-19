import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import readline from "readline";
import nodemailer from "nodemailer";
import { db, initDb } from "./db.js";
import { requireAuth, signToken } from "./auth.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOADS_DIR = path.join(__dirname, "data", "uploads");
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
  },
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(UPLOADS_DIR));

await initDb();

// ── Récupère l'email depuis la config info en base ───────────────────────────
async function getSiteEmail() {
  try {
    const info = await db.info.findOne({});
    return info?.email || null;
  } catch { return null; }
}

// ── Demande le mot de passe SMTP au démarrage (une seule fois) ───────────────
async function promptSmtpPassword() {
  // Si déjà défini dans .env, on l'utilise directement sans demander
  if (process.env.SMTP_PASS) return process.env.SMTP_PASS;

  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    // Masquer la saisie
    const muted = { write: () => {} };
    rl.question("🔐 Mot de passe SMTP (application) : ", (answer) => {
      rl.close();
      process.stdout.write("\n");
      resolve(answer.trim());
    });
    // Remplacer stdout pour masquer les caractères tapés
    rl._writeToOutput = () => {};
  });
}

const smtpPass = await promptSmtpPassword();
const siteEmail = await getSiteEmail();

if (!siteEmail) {
  console.warn("⚠️  Aucun email trouvé dans la config — configurez l'email dans l'admin (section Infos).");
}

// ── Nodemailer transporter ───────────────────────────────────────────────────
function createTransporter(email) {
  return nodemailer.createTransport({
    host:   process.env.SMTP_HOST   || "smtp.gmail.com",
    port:   Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: email,
      pass: smtpPass,
    },
  });
}

// ── Auth ─────────────────────────────────────────────────────────────────────
app.get("/api/health", (_req, res) => res.json({ ok: true }));

let runtimePassword = null;

app.post("/api/auth/login", (req, res) => {
  const { password } = req.body ?? {};
  const validPwd = runtimePassword || process.env.ADMIN_PASSWORD;
  if (!password || password !== validPwd)
    return res.status(401).json({ error: "Mot de passe incorrect" });
  res.json({ token: signToken({ role: "admin" }), user: { role: "admin" } });
});
app.get("/api/auth/verify", requireAuth, (req, res) => res.json(req.user));

app.post("/api/auth/change-password", requireAuth, (req, res) => {
  const { newPassword } = req.body ?? {};
  if (!newPassword || newPassword.length < 6)
    return res.status(400).json({ error: "Mot de passe trop court (min. 6 caractères)" });
  runtimePassword = newPassword;
  res.json({ ok: true, message: "Mot de passe mis à jour (session courante). Mettez aussi à jour ADMIN_PASSWORD dans .env pour le rendre permanent." });
});

// Upload
app.post("/api/upload", requireAuth, upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "Aucun fichier reçu" });
  res.json({ url: `/uploads/${req.file.filename}` });
});

// Info
app.get("/api/info", async (_req, res) => {
  try {
    let doc = await db.info.findOne({});
    if (!doc) doc = {
      companyName: "AquaPro", logoImage: "", tagline_fr: "Plomberie, Rénovation & Installations Sanitaires", tagline_en: "Plumbing, Renovation & Sanitary Installations",
      about_fr: "AquaPro est une entreprise artisanale spécialisée dans la plomberie, la rénovation sanitaire et les installations de chauffage. Fondée il y a plus de 15 ans, nous intervenons auprès des particuliers et des professionnels avec rigueur, réactivité et transparence.",
      about_en: "AquaPro is a specialist craft business in plumbing, sanitary renovation and heating installations. Founded over 15 years ago, we work with homeowners and businesses with rigour, responsiveness and transparency.",
      footerAbout_fr: "Votre artisan de confiance pour tous vos travaux de plomberie, rénovation sanitaire et chauffage. Devis gratuit, intervention rapide.",
      footerAbout_en: "Your trusted specialist for all plumbing, sanitary renovation and heating work. Free quote, fast response.",
      heroDesc_fr: "Intervention rapide, travail soigné et garantie sur toutes nos prestations. Devis gratuit et sans engagement.",
      heroDesc_en: "Fast response, quality workmanship and full guarantee on every job. Free no-obligation quote.",
      heroStats: { projects: "1 200+", clients: "850+", engineers: "12" },
      yearsExperience: 15, ceoName: "Michel Fontaine",
      address: "12 Rue des Artisans, 75011 Paris", email: "contact@aquapro.fr",
      phone: "+33 1 42 00 00 00", workingHours: "Lun–Sam : 8h–19h | Urgences 24h/7j",
      socialFacebook: "#", socialFacebookActive: true,
      socialTwitter: "#",  socialTwitterActive: false,
      socialYoutube: "#",  socialYoutubeActive: false,
      socialLinkedin: "#", socialLinkedinActive: true,
      heroImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1800&q=80",
      aboutImage: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=900&q=80",
      statsImage: "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=900&q=80",
      statsTitle_fr: "Une Entreprise de Confiance Depuis Plus de 15 Ans.",
      statsTitle_en: "A Trusted Company For Over 15 Years.",
      statsTag_fr: "Nos Chiffres Clés",
      statsTag_en: "Our Key Figures",
      statsDesc_fr: "Notre réputation repose sur la qualité de nos interventions, la réactivité de notre équipe et la satisfaction durable de nos clients particuliers et professionnels.",
      statsDesc_en: "Our reputation is built on the quality of our work, the speed of our response and the lasting satisfaction of our residential and commercial clients.",
      statsItems: [
        { value:"1200", suffix:"+", label_fr:"Chantiers Réalisés", label_en:"Jobs Completed" },
        { value:"850",  suffix:"+", label_fr:"Clients Satisfaits",  label_en:"Satisfied Clients" },
        { value:"320",  suffix:"+", label_fr:"Interventions/An",    label_en:"Call-outs Per Year" },
      ],
      statsBadges: [
        { icon:"🏅", label_fr:"Certifié Qualibat",   label_en:"Qualibat Certified" },
        { icon:"🕐", label_fr:"Urgence 24h/7j",       label_en:"24/7 Emergency" },
        { icon:"👷", label_fr:"Artisans Qualifiés",   label_en:"Skilled Craftsmen" },
        { icon:"🛡️", label_fr:"Garantie Décennale",  label_en:"10-Year Guarantee" },
      ],
    };
    res.json(doc);
  } catch (e) { res.status(500).json({ error: e.message }); }
});
app.put("/api/info", requireAuth, async (req, res) => {
  try {
    const existing = await db.info.findOne({});
    let doc;
    if (existing) {
      await db.info.update({ _id: existing._id }, { $set: req.body }, {});
      doc = await db.info.findOne({ _id: existing._id });
    } else {
      doc = await db.info.insert(req.body);
    }
    res.json(doc);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Services
app.get("/api/services", async (_req, res) => {
  try { res.json(await db.services.find({}).sort({ title_fr: 1 })); }
  catch (e) { res.status(500).json({ error: e.message }); }
});
app.post("/api/services", requireAuth, async (req, res) => {
  try { res.status(201).json(await db.services.insert(req.body)); }
  catch (e) { res.status(500).json({ error: e.message }); }
});
app.put("/api/services/:id", requireAuth, async (req, res) => {
  try { res.json(await db.services.update({ _id: req.params.id }, { $set: req.body }, { returnUpdatedDocs: true })); }
  catch (e) { res.status(500).json({ error: e.message }); }
});
app.delete("/api/services/:id", requireAuth, async (req, res) => {
  try { await db.services.remove({ _id: req.params.id }, {}); res.json({ ok: true }); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

// Projects
app.get("/api/projects", async (_req, res) => {
  try { res.json(await db.projects.find({}).sort({ year: -1 })); }
  catch (e) { res.status(500).json({ error: e.message }); }
});
app.post("/api/projects", requireAuth, async (req, res) => {
  try { res.status(201).json(await db.projects.insert(req.body)); }
  catch (e) { res.status(500).json({ error: e.message }); }
});
app.put("/api/projects/:id", requireAuth, async (req, res) => {
  try { res.json(await db.projects.update({ _id: req.params.id }, { $set: req.body }, { returnUpdatedDocs: true })); }
  catch (e) { res.status(500).json({ error: e.message }); }
});
app.delete("/api/projects/:id", requireAuth, async (req, res) => {
  try { await db.projects.remove({ _id: req.params.id }, {}); res.json({ ok: true }); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

// Process
app.get("/api/process", async (_req, res) => {
  try { res.json(await db.process.find({}).sort({ order: 1 })); }
  catch (e) { res.status(500).json({ error: e.message }); }
});
app.post("/api/process", requireAuth, async (req, res) => {
  try { res.status(201).json(await db.process.insert(req.body)); }
  catch (e) { res.status(500).json({ error: e.message }); }
});
app.put("/api/process/:id", requireAuth, async (req, res) => {
  try { res.json(await db.process.update({ _id: req.params.id }, { $set: req.body }, { returnUpdatedDocs: true })); }
  catch (e) { res.status(500).json({ error: e.message }); }
});
app.delete("/api/process/:id", requireAuth, async (req, res) => {
  try { await db.process.remove({ _id: req.params.id }, {}); res.json({ ok: true }); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

// Blog
app.get("/api/blog", async (_req, res) => {
  try { res.json(await db.blog.find({}).sort({ date: -1 })); }
  catch (e) { res.status(500).json({ error: e.message }); }
});
app.post("/api/blog", requireAuth, async (req, res) => {
  try { res.status(201).json(await db.blog.insert(req.body)); }
  catch (e) { res.status(500).json({ error: e.message }); }
});
app.put("/api/blog/:id", requireAuth, async (req, res) => {
  try { res.json(await db.blog.update({ _id: req.params.id }, { $set: req.body }, { returnUpdatedDocs: true })); }
  catch (e) { res.status(500).json({ error: e.message }); }
});
app.delete("/api/blog/:id", requireAuth, async (req, res) => {
  try { await db.blog.remove({ _id: req.params.id }, {}); res.json({ ok: true }); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

// Testimonials
app.get("/api/testimonials", async (_req, res) => {
  try { res.json(await db.testimonials.find({}).sort({ order: 1 })); }
  catch (e) { res.status(500).json({ error: e.message }); }
});
app.post("/api/testimonials", requireAuth, async (req, res) => {
  try { res.status(201).json(await db.testimonials.insert(req.body)); }
  catch (e) { res.status(500).json({ error: e.message }); }
});
app.put("/api/testimonials/:id", requireAuth, async (req, res) => {
  try { res.json(await db.testimonials.update({ _id: req.params.id }, { $set: req.body }, { returnUpdatedDocs: true })); }
  catch (e) { res.status(500).json({ error: e.message }); }
});
app.delete("/api/testimonials/:id", requireAuth, async (req, res) => {
  try { await db.testimonials.remove({ _id: req.params.id }, {}); res.json({ ok: true }); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

// Devis / contact form
app.post("/api/devis", async (req, res) => {
  try {
    const doc = await db.devis.insert({ ...req.body, createdAt: new Date().toISOString(), read: false });
    res.status(201).json(doc);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get("/api/devis", requireAuth, async (_req, res) => {
  try { res.json(await db.devis.find({}).sort({ createdAt: -1 })); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

app.put("/api/devis/:id/read", requireAuth, async (req, res) => {
  try { res.json(await db.devis.update({ _id: req.params.id }, { $set: { read: true } }, { returnUpdatedDocs: true })); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

app.put("/api/devis/:id/status", requireAuth, async (req, res) => {
  try {
    const { status, response } = req.body ?? {};
    const doc = await db.devis.update(
      { _id: req.params.id },
      { $set: { status, response, read: true } },
      { returnUpdatedDocs: true }
    );
    res.json(doc);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── Envoi d'email direct depuis l'admin ──────────────────────────────────────
app.post("/api/devis/:id/reply", requireAuth, async (req, res) => {
  try {
    const { mode, form } = req.body ?? {};

    // Récupérer la demande (email + nom du client)
    const request = await db.devis.findOne({ _id: req.params.id });
    if (!request) return res.status(404).json({ error: "Demande introuvable" });

    // Lire l'email de l'entreprise en temps réel depuis la config
    const info = await db.info.findOne({});
    const fromEmail = info?.email;
    if (!fromEmail) return res.status(500).json({ error: "Email expéditeur non configuré. Renseignez l'email dans la section Infos de l'admin." });

    // Construire le contenu
    let subject, text;
    const companyName = info?.companyName || "XBuild";

    if (mode === "devis") {
      subject = `Devis ${companyName} — ${request.service || "Votre demande"}`;
      text =
`Bonjour ${request.name},

Suite à votre demande de devis, veuillez trouver ci-dessous notre proposition :

━━━━━━━━━━━━━━━━━━━━━━━━
DEVIS${request.service ? ` — ${request.service}` : ""}
━━━━━━━━━━━━━━━━━━━━━━━━

${form.description}

Montant total : ${form.montant} ${form.devise} HT
Validité de l'offre : ${form.validite} jours
${form.conditions ? `\nConditions particulières :\n${form.conditions}\n` : ""}
━━━━━━━━━━━━━━━━━━━━━━━━

Pour toute question ou pour accepter ce devis, n'hésitez pas à nous contacter.

Cordialement,
${companyName}
${fromEmail}`;
    } else {
      subject = `Proposition de visite — ${companyName}`;
      text =
`Bonjour ${request.name},

Suite à votre demande, nous vous proposons une visite de chantier :

━━━━━━━━━━━━━━━━━━━━━━━━
VISITE DE CHANTIER
━━━━━━━━━━━━━━━━━━━━━━━━

📅 Date : ${form.date}
⏰ Heure : ${form.heure}
📍 Lieu : ${form.lieu}
⏱ Durée estimée : ${form.duree} minutes
${form.notes ? `\nNotes :\n${form.notes}\n` : ""}
━━━━━━━━━━━━━━━━━━━━━━━━

Merci de nous confirmer votre présence en répondant à cet email.

Cordialement,
${companyName}
${fromEmail}`;
    }

    // Envoi SMTP avec l'email de la config comme expéditeur
    const transporter = createTransporter(fromEmail);
    await transporter.sendMail({
      from:    `"${companyName}" <${fromEmail}>`,
      to:      request.email,
      subject,
      text,
    });

    // Mettre à jour le statut
    const newStatus = mode === "devis" ? "quoted" : "visited";
    const updated = await db.devis.update(
      { _id: req.params.id },
      { $set: { status: newStatus, read: true, response: { mode, form, sentAt: new Date().toISOString() } } },
      { returnUpdatedDocs: true }
    );

    res.json({ ok: true, doc: updated });
  } catch (e) {
    console.error("Erreur envoi email :", e);
    res.status(500).json({ error: `Échec envoi email : ${e.message}` });
  }
});

const port = Number(process.env.PORT || 5174);
app.listen(port, () => {
  const email = siteEmail || "(non configuré)";
  console.log(`✅ API → http://localhost:${port}`);
  console.log(`📧 Expéditeur SMTP : ${email}`);
});
