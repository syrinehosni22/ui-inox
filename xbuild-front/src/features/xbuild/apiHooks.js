import { useEffect, useState } from "react";

export function useApiList(path, fallback) {
  const [data, setData] = useState(fallback);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(path);
        if (!res.ok) return;
        const json = await res.json();
        if (!cancelled && Array.isArray(json) && json.length) setData(json);
      } catch {}
    })();
    return () => { cancelled = true; };
  }, [path]);
  return data;
}

export const INFO_DEFAULT = {
  companyName:     "AquaPro",
  logoImage:       "",
  tagline_fr:      "Plomberie, Rénovation & Installations Sanitaires",
  tagline_en:      "Plumbing, Renovation & Sanitary Installations",
  about_fr:        "AquaPro est une entreprise artisanale spécialisée dans la plomberie, la rénovation sanitaire et les installations de chauffage. Fondée il y a plus de 15 ans, nous intervenons auprès des particuliers et des professionnels avec rigueur, réactivité et transparence. Chaque chantier est réalisé dans le respect des normes DTU, avec des matériaux de qualité sélectionnés pour leur durabilité.",
  about_en:        "AquaPro is a specialist craft business in plumbing, sanitary renovation and heating installations. Founded over 15 years ago, we work with homeowners and businesses with rigour, responsiveness and transparency. Every job is carried out to DTU standards using quality materials chosen for their durability.",
  footerAbout_fr:  "Votre artisan de confiance pour tous vos travaux de plomberie, rénovation sanitaire et chauffage. Devis gratuit, intervention rapide.",
  footerAbout_en:  "Your trusted specialist for all plumbing, sanitary renovation and heating work. Free quote, fast response.",
  heroDesc_fr:     "Intervention rapide, travail soigné et garantie sur toutes nos prestations. Devis gratuit et sans engagement.",
  heroDesc_en:     "Fast response, quality workmanship and full guarantee on every job. Free no-obligation quote.",
  heroStats:       { projects: "1 200+", clients: "850+", engineers: "12" },
  heroImage:       "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1800&q=80",
  aboutImage:      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=900&q=80",
  statsImage:      "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=900&q=80",
  yearsExperience: 15,
  ceoName:         "Michel Fontaine",
  aboutTag_fr:            "À Propos de Nous",
  aboutTag_en:            "About Our Company",
  aboutTitle_fr:          "Votre Spécialiste en Plomberie & Rénovation Sanitaire",
  aboutTitle_en:          "Your Specialist in Plumbing & Sanitary Renovation",
  aboutExploreMore_fr:    "Découvrir Nos Services →",
  aboutExploreMore_en:    "Discover Our Services →",
  aboutCeoLabel_fr:       "Fondateur & Gérant",
  aboutCeoLabel_en:       "Founder & Director",
  aboutIndustrialLabel_fr:"Travaux Sanitaires",
  aboutIndustrialLabel_en:"Sanitary Works",
  aboutAwardTitle_fr:     "Certifié RGE",
  aboutAwardTitle_en:     "Qualibat Certified",
  aboutAwardSub_fr:       "Reconnu Garant de l'Environnement",
  aboutAwardSub_en:       "Recognised Quality Contractor",
  aboutFeatures: [
    { text_fr: "Satisfaction Client Garantie",     text_en: "100% Client Satisfaction" },
    { text_fr: "Artisans Certifiés Qualibat",       text_en: "Qualibat Certified Craftsmen" },
    { text_fr: "Devis Gratuit & Transparent",       text_en: "Free & Transparent Quote" },
    { text_fr: "Conformité aux Normes DTU",         text_en: "Full DTU Standards Compliance" },
  ],
  address:         "12 Rue des Artisans, 75011 Paris",
  email:           "contact@aquapro.fr",
  phone:           "+33 1 42 00 00 00",
  workingHours:    "Lun–Sam : 8h–19h | Urgences 24h/7j",
  socialFacebook:  "#",  socialFacebookActive: true,
  socialTwitter:   "#",  socialTwitterActive:  false,
  socialYoutube:   "#",  socialYoutubeActive:  false,
  socialLinkedin:  "#",  socialLinkedinActive: true,
};

export function useInfo() {
  const [info, setInfo] = useState(INFO_DEFAULT);
  useEffect(() => {
    fetch("/api/info")
      .then(r => r.json())
      .then(d => setInfo({
        ...INFO_DEFAULT, ...d,
        heroStats: { ...INFO_DEFAULT.heroStats, ...(d.heroStats || {}) },
      }))
      .catch(() => {});
  }, []);
  return info;
}