export default async function handler(req, res) {
  let { url } = req.query;

  if (!url) {
    return res.status(400).send('Falta el parámetro URL');
  }

  let targetUrl = url.startsWith('http') ? url : `https://${url}`;

  // 1. Transformar peticiones de YouTube a formato Embed estable
  if (targetUrl.includes('youtube.com') || targetUrl.includes('youtu.be')) {
    const videoMatch = targetUrl.match(/(?:v=|\/)([\w-]{11})/);
    if (videoMatch && videoMatch[1]) {
      targetUrl = `https://www.youtube-nocookie.com/embed/${videoMatch[1]}?autoplay=1&enablejsapi=1`;
    }
  }

  try {
    // 2. Encabezados para enmascarar el proxy como cliente oficial de YouTube
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122.0.0.0 Safari/537.36',
        'Referer': 'https://www.youtube.com/',
        'Origin': 'https://www.youtube.com',
        'Accept-Language': 'es-ES,es;q=0.9',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'cross-site'
      }
    });

    const contentType = response.headers.get('content-type') || 'text/html';
    let body = await response.text();

    // 3. Eliminar cabeceras de bloqueo de la respuesta
    res.setHeader('Content-Type', contentType);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.removeHeader('X-Frame-Options');
    res.removeHeader('Content-Security-Policy');

    return res.status(200).send(body);
  } catch (error) {
    return res.status(500).send('Error al procesar la solicitud en el Proxy');
  }
}