export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    const r = await fetch("https://api.hospitable.com/v1/properties/reservations.ics?key=1889270&token=0f50ba8a-b220-4f7c-8a83-e24918f759a0&noCache");
    const text = await r.text();
    res.setHeader("Content-Type", "text/plain");
    return res.status(200).send(text);
  } catch(err) {
    return res.status(502).json({ error: err.message });
  }
}
