export default async function handler(req, res) {
  const { q: query, page = 1 } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'Falta el parámetro de búsqueda' });
  }

  const apiKey = process.env.SEARCH_API_KEY;

  if (!apiKey) {
    return res.status(200).json({
      results: [
        {
          id: 'demo-1',
          title: `Resultados de prueba para: ${query}`,
          description: 'Configura la variable SEARCH_API_KEY en Vercel con tu clave de Serper.dev para ver búsquedas de Google reales.',
          url: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
          domain: 'google.com',
          favicon: 'https://icons.duckduckgo.com/ip3/google.com.ico'
        }
      ],
      page: 1,
      totalPages: 1
    });
  }

  try {
    const response = await fetch('https://google.serper.dev/search', {
      method: 'POST',
      headers: {
        'X-API-KEY': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        q: query,
        page: Number(page) || 1
      })
    });

    if (!response.ok) {
      throw new Error(`Error de Serper API: ${response.status}`);
    }

    const data = await response.json();

    const results = (data.organic || []).map((item, index) => {
      let domain = '';
      try {
        domain = new URL(item.link).hostname.replace(/^www\./, '');
      } catch {
        domain = item.link;
      }

      return {
        id: item.link || `res-${index}`,
        title: item.title,
        description: item.snippet || '',
        url: item.link,
        domain: domain,
        favicon: `https://icons.duckduckgo.com/ip3/${domain}.ico`
      };
    });

    return res.status(200).json({
      results,
      page: Number(page),
      totalPages: 5,
      totalResults: results.length
    });

  } catch (error) {
    return res.status(500).json({ error: 'Error al consultar la API de búsqueda' });
  }
}