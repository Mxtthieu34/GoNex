export default async function handler(req, res) {
  const { q, page = 1 } = req.query;

  if (!q) {
    return res.status(400).json({ error: 'Falta el parámetro de búsqueda' });
  }

  const apiKey = process.env.SEARCH_API_KEY;

  if (!apiKey) {
    return res.status(200).json({
      results: [
        {
          id: 'demo-1',
          title: `Resultado de prueba para: ${q}`,
          description: 'Recuerda configurar tu SEARCH_API_KEY en las variables de entorno de Vercel.',
          url: `https://www.google.com/search?q=${encodeURIComponent(q)}`,
          domain: 'google.com',
          favicon: 'https://icons.duckduckgo.com/ip3/google.com.ico'
        }
      ],
      page: Number(page),
      totalPages: 1,
      totalResults: 1
    });
  }

  try {
    const response = await fetch(
      `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(q)}&page=${page}`,
      {
        headers: {
          'Accept': 'application/json',
          'X-Subscription-Token': apiKey,
        },
      }
    );

    const data = await response.json();

    const results = (data.web?.results || []).map((item, index) => {
      let domain = '';
      try {
        domain = new URL(item.url).hostname.replace(/^www\./, '');
      } catch {
        domain = item.url;
      }
      return {
        id: `brave-${index}`,
        title: item.title,
        description: item.description,
        url: item.url,
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