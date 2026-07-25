# Strange In — Website (Next.js)

Marketing website for the Strange In dating & social app, built with Next.js 14 (App Router).

## What's included

| Route | Page |
|---|---|
| `/` | Homepage — hero with phone mockup, features, blogs section (with category filter), testimonial, download CTA |
| `/privacy` | Privacy Policy (DPDP Act 2023, IT Act 2000, SPDI Rules 2011, IT Rules 2021) |
| `/terms` | Terms of Service (India — Contract Act, IT Act, intermediary safe harbour) |
| `/community-guidelines` | Community Guidelines (IT Rules 2021 Rule 3(1)(b), GAC appeal, cybercrime helplines) |

Plus a **cookie consent banner** (`components/CookieBanner.js`) shown site-wide until the visitor accepts or declines. The choice is stored in `localStorage` and a `cookie-consent` event is dispatched so you can conditionally load analytics.

## Run locally

```bash
npm install
cp .env.local.example .env.local   # then fill in the two values, see below
npm run dev
```

Open http://localhost:3000

## Blog backend API

Blogs are no longer hardcoded — `components/BlogsSection.js` fetches them from a real API, backed by `data/blogs.json` (a tiny JSON "database" so the project runs with zero external setup). See `lib/blogsStore.js` for the data layer — every function is `async`, so swapping in a real database (Postgres, MongoDB, etc.) later is a drop-in change.

| Method | Route | Auth | What it does |
|---|---|---|---|
| GET | `/api/blogs` | none | List all blogs. Add `?category=Travel` to filter. |
| GET | `/api/blogs/:id` | none | Get one blog by id or slug. |
| POST | `/api/blogs` | **admin key** | Create a blog. |
| PUT | `/api/blogs/:id` | **admin key** | Update a blog. |
| DELETE | `/api/blogs/:id` | **admin key** | Delete a blog. |
| POST | `/api/blogs/:id/like` | none | Bump the like counter by 1. |

Writes require an `x-admin-key` header matching `ADMIN_API_KEY` in `.env.local`. Without that env var set, all write endpoints return `401` — there's no accidental "open" mode.

**Writing blogs without curl:** visit `/admin/blogs`, paste in your `ADMIN_API_KEY`, and use the form to create, edit, and delete posts. It's a plain client page with no framework dependency — feel free to restyle or lock it down further (e.g. behind your own login) before shipping.

Example with curl:
```bash
curl -X POST http://localhost:3000/api/blogs \
  -H "Content-Type: application/json" \
  -H "x-admin-key: YOUR_ADMIN_API_KEY" \
  -d '{"title":"My trip to Goa","excerpt":"...","content":"...","cat":"Travel","author":"Priya M."}'
```

## OneSignal (web push notifications)

1. Create a free account at [onesignal.com](https://onesignal.com) and add a **Web Push** app for your domain.
2. Copy the **OneSignal App ID** from Settings → Keys & IDs into `.env.local` as `NEXT_PUBLIC_ONESIGNAL_APP_ID`.
3. That's it — `components/OneSignalInit.js` initializes the SDK on every page load (via `react-onesignal`), and `public/OneSignalSDKWorker.js` / `OneSignalSDKUpdaterWorker.js` register the required service workers. A subscription bell appears automatically (`notifyButton: { enable: true }` in `OneSignalInit.js` — remove that line if you'd rather trigger opt-in with your own button/prompt).
4. Test locally: OneSignal is configured with `allowLocalhostAsSecureOrigin: true`, so push works on `http://localhost:3000` without HTTPS. In production your domain must be served over HTTPS.
5. To send notifications, use the OneSignal dashboard, their REST API, or trigger a send server-side (e.g. call OneSignal's REST API from inside `app/api/blogs/route.js` after a successful `POST`, to notify subscribers when a new blog goes live).

## Build & deploy

```bash
npm run build
npm start
```

### Vercel (easiest)
Push this folder to a GitHub repo, import it at vercel.com — no config needed.

### Any Node server
`npm run build` then `npm start` (defaults to port 3000). Put nginx or a load balancer in front.

## Before you go live — checklist

1. **Legal review.** The privacy/terms/guidelines pages are templates. Have an Indian lawyer review them.
2. **Replace all `[bracketed placeholders]`** — company legal name, registered address, grievance officer name/email/address, retention periods, jurisdiction city.
3. **Replace placeholder emails** (`*.example` domains) with your real ones.
4. **App store links** — update the `href="#"` on the Google Play / App Store buttons in `app/page.js`.
5. **Analytics** — if you add Google Analytics or similar, load it only after consent. Listen for the event:
   ```js
   window.addEventListener('cookie-consent', (e) => {
     if (e.detail === 'accepted') { /* load analytics */ }
   });
   ```
   Or call `getCookieConsent()` from `components/CookieBanner.js`.
6. **Blog data** — the JSON-file store in `data/blogs.json` is fine for development but won't persist reliably on serverless hosts (Vercel's filesystem is read-only at runtime). Swap `lib/blogsStore.js` for a real database before you have real users, and sanitize/escape any user-generated blog content before rendering it as HTML.
7. **OneSignal** — set `NEXT_PUBLIC_ONESIGNAL_APP_ID` for your production domain (Web Push apps are tied to a domain in OneSignal).
8. **Admin key** — set a strong, unique `ADMIN_API_KEY` in production and don't commit it. Treat `/admin/blogs` as a page that should not be publicly linked/indexed (add `noindex`, or put it behind your own auth) since it's only gated by knowing the key.

## Opening this project in VS Code

1. **Install prerequisites** (once per machine): [VS Code](https://code.visualstudio.com/), [Node.js 18+](https://nodejs.org) (includes npm). Check with `node -v` in a terminal.
2. **Unzip** this project somewhere, e.g. `~/projects/strange-in-website`.
3. Open VS Code → `File → Open Folder…` → select the unzipped `strange-in-website` folder.
4. VS Code will prompt to install the recommended extensions (ESLint, Prettier) from `.vscode/extensions.json` — click **Install**.
5. Open a terminal inside VS Code: `` Ctrl+` `` (Windows/Linux) or `` Cmd+` `` (Mac).
6. Install dependencies and set up your env file:
   ```bash
   npm install
   cp .env.local.example .env.local
   ```
   Then open `.env.local` and fill in `NEXT_PUBLIC_ONESIGNAL_APP_ID` and `ADMIN_API_KEY`.
7. Run the dev server:
   ```bash
   npm run dev
   ```
8. Open http://localhost:3000 in your browser — VS Code will also show a "port forwarded" popup you can click.
9. Edit any file under `app/` or `components/` and save — the browser hot-reloads automatically.

That's the whole workflow: no separate backend to start, since the blog API lives inside this same Next.js app under `app/api/`.

## Design system

Matches the Strange In app v2: ink black (`#0D0A0F`), rose (`#FF3E6C → #FF6B8A`), gold (`#E8B96F`), Cormorant Garamond (display) + Outfit (UI), glassmorphism, rose-glow shadows. All tokens live in `app/globals.css` under `:root`.
