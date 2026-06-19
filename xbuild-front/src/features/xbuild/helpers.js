// Retourne le champ localisé d'un objet API : doc.title_fr / doc.title_en → fallback doc.title
export function loc(doc, field, lang) {
  return doc[`${field}_${lang}`] || doc[field] || "";
}
