export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Hospitable-Token");
  if (req.method === "OPTIONS") return res.status(200).end();

  const token = req.headers["x-hospitable-token"] || process.env.HOSPITABLE_API_KEY;
  if (!token) return res.status(401).json({ error: "No Hospitable API token found." });

  const hospPath = req.query.url;
  if (!hospPath) return res.status(400).json({ error: "Missing ?url= parameter" });

  const targetUrl = `https://public.api.hospitable.com${hospPath}`;

  try {
    const fetchOptions = {
      method: req.method,
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    };
    if (["POST", "PUT", "PATCH"].includes(req.method) && req.body) {
      fetchOptions.body = JSON.stringify(req.body);
    }
    const upstream = await fetch(targetUrl, fetchOptions);
    const data = await upstream.json();
    return res.status(upstream.status).json(data);
  } catch (err) {
    return res.status(502).json({ error: "Proxy failed", detail: err.message });
  }
}
