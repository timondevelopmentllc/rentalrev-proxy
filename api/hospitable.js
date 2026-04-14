/**
 * Vercel Serverless Function: /api/hospitable
 * Proxies all requests to Hospitable's API, adding your PAT from env vars.
 * This solves the browser CORS restriction on public.api.hospitable.com
 */

export default async function handler(req, res) {
  // ── CORS headers so your dashboard (any origin) can call this proxy ──
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Hospitable-Token");

  // Pre-flight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // ── Resolve the Hospitable API token ──
  // Priority: 1) X-Hospitable-Token header (user-supplied from dashboard)
  //           2) HOSPITABLE_API_KEY environment variable (set in Vercel dashboard)
  const token =
    req.headers["x-hospitable-token"] ||
    process.env.HOSPITABLE_API_KEY;

  if (!token) {
    return res.status(401).json({
      error: "No Hospitable API token found. Set HOSPITABLE_API_KEY in Vercel env vars, or pass X-Hospitable-Token header.",
    });
  }

  // ── Build the target URL ──
  // The dashboard calls /api/hospitable?path=/v2/properties
  const hospPath = req.query.path || "/v2/properties";
  
  // Remove the ?path= param, keep everything else as query params for Hospitable
  const forwardParams = new URLSearchParams();
  for (const [k, v] of Object.entries(req.query)) {
    if (k !== "path") forwardParams.set(k, v);
  }
  
  const queryString = forwardParams.toString();
  const targetUrl = `https://public.api.hospitable.com${hospPath}${queryString ? "?" + queryString : ""}`;

  // ── Forward the request ──
  try {
    const fetchOptions = {
      method: req.method,
      headers: {
        "Accept":        "application/json",
        "Content-Type":  "application/json",
        "Authorization": `Bearer ${token}`,
      },
    };

    // Forward body for mutating requests
    if (["POST", "PUT", "PATCH"].includes(req.method) && req.body) {
      fetchOptions.body = JSON.stringify(req.body);
    }

    const upstream = await fetch(targetUrl, fetchOptions);
    const data = await upstream.json();

    // Pass through Hospitable's status code
    return res.status(upstream.status).json(data);

  } catch (err) {
    console.error("Proxy error:", err);
    return res.status(502).json({
      error: "Proxy failed to reach Hospitable API",
      detail: err.message,
    });
  }
}
