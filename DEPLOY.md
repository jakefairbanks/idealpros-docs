# Deploy docs.myidealpros.com

This folder (`/deploy`) is the entire `docs.myidealpros.com` site. Upload its contents to any static host and point your DNS at it.

```
deploy/                          ← upload this whole folder
├── index.html                   → docs.myidealpros.com/        (the hub)
├── _redirects                   → short aliases (e.g. /hail)
├── _headers                     → caching + security headers
├── DEPLOY.md                    → this file
└── hail/                        → docs.myidealpros.com/hail/   (the manual)
    ├── index.html
    ├── app.js                   ← pre-compiled from app.jsx for fast loads
    ├── app.jsx                  ← editable source (kept for reference; not loaded by the page)
    ├── styles.css
    └── assets/                  ← photos, video, logos, brand.css
```

Your reps will share **`https://docs.myidealpros.com/hail`** with homeowners.

---

## Step 1 — Pick a host (5 minutes)

**Netlify (recommended).** Free, fastest setup, automatic SSL.

1. Go to **https://app.netlify.com/drop**
2. Sign up free (Google login is fine)
3. Drag the entire `/deploy` folder onto the drop zone
4. Netlify gives you a temporary URL like `https://kind-river-a1b2c3.netlify.app` — confirm the manual loads, the Catch-All video plays, and images render at that URL before doing DNS
5. In the site dashboard, **Site settings → Change site name** to something memorable like `idealpros-docs`

**Cloudflare Pages** works just as well if you already use Cloudflare for DNS — slightly more setup, slightly faster CDN.

---

## Step 2 — Point docs.myidealpros.com at it (10 minutes + DNS propagation)

1. Find out who hosts your DNS for `myidealpros.com`. Common ones:
   - **GoDaddy** → DNS Management
   - **Namecheap** → Advanced DNS
   - **Cloudflare** → DNS panel
   - **Squarespace** → Domains → DNS
2. Add a new **CNAME** record:
   - **Type:** CNAME
   - **Name:** `docs`
   - **Value:** your Netlify URL without `https://` (e.g., `idealpros-docs.netlify.app`)
   - **TTL:** automatic / 3600 / whatever the default is
3. Back in Netlify: **Domain settings → Add custom domain → `docs.myidealpros.com`**. Netlify verifies the CNAME and issues a free Let's Encrypt SSL certificate within a few minutes.
4. Visit `https://docs.myidealpros.com/hail` — you're live.

DNS propagation usually completes in a few minutes; rarely up to an hour. If the certificate isn't issued within 15 minutes, click **"Renew certificate"** in Netlify's domain panel.

---

## What's at each URL

| URL                                              | What it is                                           |
|--------------------------------------------------|------------------------------------------------------|
| `https://docs.myidealpros.com/`                  | Docs hub — landing page that links to your manuals   |
| `https://docs.myidealpros.com/hail`              | The Hail Damage Client Manual (your sales tool)      |

The hail manual is **one-size-fits-all** — same page every homeowner sees, walked through after their inspection. Personalization (homeowner name, claim #, etc.) lives in your separate inspection report, not here.

---

## Adding more manuals later

The docs hub at `/` already shows the Hail manual plus two dashed placeholders ("Warranty & Workmanship," "Financing Options"). When you build a new manual:

1. Drop the folder under `/deploy/` (e.g., `/deploy/warranty/`)
2. Open `/deploy/index.html` and turn the matching "Coming soon" placeholder into a real `<a class="doc-card" href="warranty/">` card
3. (Optional) add a short alias in `/deploy/_redirects` following the `/hail` pattern
4. Re-deploy

---

## Updating the hail manual later

The deployed JS at `/deploy/hail/app.js` is pre-compiled from `/deploy/hail/app.jsx`. If you edit the source, recompile before redeploying:

```bash
npx --yes @babel/cli --presets=@babel/preset-react \
  "deploy/hail/app.jsx" --out-file "deploy/hail/app.js"
```

Then re-drag `/deploy` onto Netlify (it diffs and only re-uploads changed files), or, if you wire up a Netlify Git deploy later, just push.

If you re-export from Claude Design, the new `app.jsx` will reference `useTweaks` / `TweaksPanel` / `<ManualTweaks/>` — those are Claude Design's live-editing tools and aren't for production. Strip them with these three changes before recompiling:

1. Top-of-file comment: replace `/* global React, ReactDOM, TweaksPanel, useTweaks, ... */` with `/* global React, ReactDOM */`
2. Inside `function App()`: replace `const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);` with `const tweaks = TWEAK_DEFAULTS;`
3. Delete the `<ManualTweaks ... />` line at the end of `App()`, and delete the whole `function ManualTweaks(...) { ... }` block (it's at the bottom of the file, just above the App function).

---

## A note on the 81MB asset folder

Most of the weight is in 11 aerial JPEGs (8–9MB each). On a homeowner's phone in their driveway with two bars of LTE, that's a slow load. Once you're live, worth running the images through an optimizer (e.g., **Squoosh.app**, ImageOptim, or `sharp`) — could easily cut to 200–500KB each without visible quality loss, taking the whole manual from 81MB to ~15–20MB. Not blocking for launch — just a follow-up worth doing.
