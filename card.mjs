import { cards, users, J, emailKey, isAdmin, authEmail } from "../lib/session.mjs";

const FIELDS = ["name","title","company","phone","email","website","whatsapp","telegram","instagram","tiktok","linkedin","photo","bio"];
const SLUG = /^[a-z0-9-]{3,30}$/;

export default async (req) => {
  const cs = cards(), us = users();
  const u = new URL(req.url);
  const me = authEmail(req);

  if (req.method === "GET") {
    if (u.searchParams.get("mine")) {
      if (!me) return J({ error: "Log in first." }, 401);
      let slugs;
      if (isAdmin(me)) slugs = (await cs.list()).blobs.map((x) => x.key);
      else slugs = ((await us.get(emailKey(me), { type: "json" })) || {}).cards || [];
      const out = [];
      for (const s of slugs) { const r = await cs.get(s, { type: "json" }); if (r) out.push({ slug: s, owner: r.owner, data: r.data }); }
      return J({ cards: out });
    }
    const slug = (u.searchParams.get("slug") || "").toLowerCase();
    const rec = SLUG.test(slug) ? await cs.get(slug, { type: "json" }) : null;
    return rec ? J({ data: rec.data }) : J({ error: "Card not found." }, 404);
  }

  if (!me) return J({ error: "Log in first." }, 401);
  let b;
  try { b = await req.json(); } catch { return J({ error: "Bad request." }, 400); }
  const slug = String(b.slug || "").toLowerCase();
  if (!SLUG.test(slug)) return J({ error: "Link name needs 3 to 30 letters, numbers or dashes." }, 400);

  const ex = await cs.get(slug, { type: "json" });
  if (ex && ex.owner !== me && !isAdmin(me)) return J({ error: "That link name is taken. Choose another." }, 403);
  const owner = ex ? ex.owner : me;
  const orec = (await us.get(emailKey(owner), { type: "json" })) || { email: owner, cards: [] };

  if (req.method === "DELETE") {
    if (!ex) return J({ error: "Card not found." }, 404);
    await cs.delete(slug);
    orec.cards = (orec.cards || []).filter((s) => s !== slug);
    await us.setJSON(emailKey(owner), orec);
    return J({ ok: true });
  }

  if (req.method === "POST") {
    const data = {};
    for (const f of FIELDS) data[f] = String((b.data || {})[f] || "").trim().slice(0, f === "bio" ? 400 : 300);
    data.color = /^#[0-9a-f]{6}$/i.test((b.data || {}).color) ? b.data.color : "#2f6bff";
    if (!data.name) return J({ error: "Enter a name first." }, 400);
    if (!ex) {
      const max = parseInt(process.env.MAX_CARDS || "5", 10);
      if (!isAdmin(me) && (orec.cards || []).length >= max) return J({ error: `Your plan allows ${max} cards. Delete one first.` }, 403);
      orec.cards = [...(orec.cards || []), slug];
      await us.setJSON(emailKey(owner), orec);
    }
    await cs.setJSON(slug, { owner, data });
    return J({ ok: true, slug });
  }
  return J({ error: "Method not allowed." }, 405);
};

export const config = { path: "/api/card" };
