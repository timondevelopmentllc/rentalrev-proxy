# RentalRev Proxy — Deployment Guide

This is a tiny Vercel serverless function that proxies requests to the
Hospitable API, solving the browser CORS restriction that blocks direct calls.

---

## Deploy in ~5 minutes

### Prerequisites
- [Node.js](https://nodejs.org) installed (v18+)
- A free [Vercel account](https://vercel.com)

---

### Step 1 — Install Vercel CLI

```bash
npm install -g vercel
```

---

### Step 2 — Deploy

Open your terminal, navigate to this folder, then run:

```bash
vercel deploy
```

- Sign in / create a Vercel account when prompted
- Accept the default project settings
- **Copy the deployment URL** shown at the end — it looks like:
  `https://rentalrev-proxy-abc123.vercel.app`

---

### Step 3 — (Optional) Store your API key in Vercel

This means you won't have to paste your token into the dashboard every time:

```bash
vercel env add HOSPITABLE_API_KEY
```

When prompted, paste your Hospitable Personal Access Token.

Then redeploy:

```bash
vercel deploy --prod
```

---

### Step 4 — Connect in the dashboard

Paste your Vercel URL + Hospitable token into the RentalRev connect screen.
That's it — you'll see live data from all your channels.

---

## File Structure

```
rentalrev-proxy/
├── api/
│   └── hospitable.js   ← The proxy function (all the magic)
├── vercel.json          ← Vercel config
├── package.json
└── README.md
```

## How it works

The proxy:
1. Receives requests from your dashboard at `/api/hospitable?path=/v2/properties`
2. Picks up your Hospitable token from the `X-Hospitable-Token` header
   (or from the `HOSPITABLE_API_KEY` env var if set)
3. Forwards the request to `https://public.api.hospitable.com`
4. Returns the response with CORS headers so your browser accepts it

## Security notes

- Never commit your PAT to git
- The proxy only forwards requests to `public.api.hospitable.com` — nothing else
- Tokens sent via the header are not logged or stored by the proxy
- For production use, consider restricting `Access-Control-Allow-Origin`
  to your specific dashboard domain instead of `*`

---

## Troubleshooting

| Problem | Fix |
|---|---|
| "Cannot reach proxy" | Make sure you copied the full `.vercel.app` URL |
| "Invalid token" | Regenerate your PAT at app.hospitable.com → Settings → API |
| 401 errors | Confirm your PAT has `property:read` and `reservation:read` scopes |
| Pricing writes fail | Make sure your PAT also has `Write` scope enabled |
