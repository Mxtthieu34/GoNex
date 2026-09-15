// api/proxy.js
export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) return res.status(400).send('URL requerida');

  try {
    const response = await fetch(url.startsWith('http') ? url : `https://${url}`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });

    const body = await response.text();
    res.setHeader('Content-Type', 'text/html');
    res.removeHeader('X-Frame-Options');
    res.removeHeader('Content-Security-Policy');
    return res.status(200).send(body);
  } catch (err) {
    return res.status(500).send('Error al obtener la página');
  }
}