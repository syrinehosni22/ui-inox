import Datastore from "nedb-promises";
import { SEED_PROJECTS, SEED_SERVICES, SEED_PROCESS, SEED_BLOG, SEED_TESTIMONIALS } from "./seed.js";

const mk = (name) => Datastore.create({ filename: new URL(`./data/${name}.db`, import.meta.url).pathname, autoload: true });

const services     = mk("services");
const projects     = mk("projects");
const info         = mk("info");
const process      = mk("process");
const blog         = mk("blog");
const testimonials = mk("testimonials");
const devis        = mk("devis");

async function seedIfEmpty(store, docs) {
  const count = await store.count({});
  if (count > 0) return;
  await store.insert(docs);
}

export async function initDb() {
  await seedIfEmpty(services,     SEED_SERVICES);
  await seedIfEmpty(projects,     SEED_PROJECTS);
  await seedIfEmpty(process,      SEED_PROCESS);
  await seedIfEmpty(blog,         SEED_BLOG);
  await seedIfEmpty(testimonials, SEED_TESTIMONIALS);
}

export const db = { services, projects, info, process, blog, testimonials, devis };
