import { users, J, emailKey, isAdmin, sign, authEmail, cookie, hashPw, checkPw } from "../lib/session.mjs";

export default async (req) => {
  if (!process.env.SESSION_SECRET) return J({ error: "Server not set up: add the SESSION_SECRET environment variable in Netlify." }, 500);

  if (req.method === "GET") {
    const e = authEmail(req);
    return J(e ? { email: e, admin: isAdmin(e) } : { email: null });
  }
  if (req.method !== "POST") return J({ error: "Method not allowed." }, 405);

  let b;
  try { b = await req.json(); } catch { return J({ error: "Bad request." }, 400); }
  const us = users();
  const email = String(b.email || "").trim().toLowerCase();

  if (b.action === "logout") return J({ ok: true }, 200, { "set-cookie": cookie("", 0) });

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 120) return J({ error: "Enter a valid email." }, 400);
  const pw = String(b.password || "");
  const key = emailKey(email);
  const rec = await us.get(key, { type: "json" });

  if (b.action === "signup") {
    const invite = process.env.INVITE_CODE;
    if (invite && b.invite !== invite) return J({ error: "Wrong or missing invite code." }, 403);
    if (pw.length < 8) return J({ error: "Password needs at least 8 characters." }, 400);
    if (rec) return J({ error: "An account with this email already exists." }, 409);
    await us.setJSON(key, { email, pw: hashPw(pw), cards: [], created: Date.now() });
  } else if (b.action === "login") {
    if (!rec || !checkPw(pw, rec.pw)) return J({ error: "Wrong email or password." }, 401);
  } else return J({ error: "Unknown action." }, 400);

  return J({ email, admin: isAdmin(email) }, 200, { "set-cookie": cookie(sign(email), 30 * 86400) });
};

export const config = { path: "/api/auth" };
