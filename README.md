# TapCard

NFC business card maker with customer accounts. Customers sign up, create cards, and get a short link (`/c/name`) to write to an NFC tag. Built for Netlify (static site + Functions + Blobs). No external database.

## Deploy
1. Push this folder to a GitHub repository.
2. In Netlify: Add new site > Import from Git > pick the repository. Settings are read from `netlify.toml`.
3. Site configuration > Environment variables. Add `SESSION_SECRET` (required). Generate one with `openssl rand -hex 32`. Optional: `INVITE_CODE`, `ADMIN_EMAIL`, `MAX_CARDS` (see `.env.example`).
4. Trigger a new deploy so the variables apply.

## Run locally
```
npm i -g netlify-cli
npm install
netlify dev
```
Put the variables in a `.env` file first.

## Structure
- `public/` pages: `index.html` (login and card builder), `card.html` (public card), `shared.js`, `style.css`
- `netlify/functions/auth.mjs` signup, login, logout
- `netlify/functions/card.mjs` card create, edit, delete, list
- `netlify/lib/session.mjs` password hashing and signed session cookie

## Known gaps
- No email verification or password reset yet. Customers who forget a password need it reset by hand (delete their user in Netlify Blobs).
- No rate limiting on login. Add one before heavy public use.
- Photos are links to images, not uploads.
