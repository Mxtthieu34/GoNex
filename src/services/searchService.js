import { POPULAR_GAMES } from '../data/gamesData';

const URL_REGEX = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/i;

export const searchService = {
  isDirectUrl: (query) => {
    if (!query) return false;
    const clean = query.trim();
    return !clean.includes(' ') && URL_REGEX.test(clean);
  },

  formatDirectUrl: (query) => {
    const clean = query.trim();
    const url = clean.startsWith('http://') || clean.startsWith('https://') 
      ? clean 
      : `https://${clean}`;
    
    let domain = '';
    try {
      domain = new URL(url).hostname.replace(/^www\./, '');
    } catch {
      domain = clean;
    }

    return {
      isDirectUrl: true,
      item: {
        id: `direct-${Date.now()}`,
        title: domain,
        description: `Abrir directamente la dirección web ${domain}`,
        category: 'URL Directa',
        url: url,
        directUrl: url,
        domain: domain,
        favicon: `https://icons.duckduckgo.com/ip3/${domain}.ico`
      }
    };
  },

  search: async (query, page = 1) => {
    if (!query || query.trim() === '') {
      return { isDirectUrl: false, results: [], page: 1, totalPages: 1 };
    }

    const cleanQuery = query.trim();

    if (searchService.isDirectUrl(cleanQuery)) {
      return searchService.formatDirectUrl(cleanQuery);
    }

    const localMatches = (POPULAR_GAMES || []).filter(item => 
      item.title.toLowerCase().includes(cleanQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(cleanQuery.toLowerCase())
    ).map(item => {
      let domain = '';
      try {
        domain = new URL(item.url).hostname.replace(/^www\./, '');
      } catch {
        domain = item.url;
      }
      return {
        ...item,
        domain: domain,
        favicon: `https://icons.duckduckgo.com/ip3/${domain}.ico`
      };
    });

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(cleanQuery)}&page=${page}`);
      
      if (!response.ok) {
        throw new Error('Error en la búsqueda');
      }

      const data = await response.json();
      
      return {
        isDirectUrl: false,
        results: page === 1 ? [...localMatches, ...(data.results || [])] : (data.results || []),
        page: data.page || page,
        totalPages: data.totalPages || 1,
        totalResults: data.totalResults || 0
      };
    } catch {
      return {
        isDirectUrl: false,
        results: localMatches,
        page: 1,
        totalPages: 1,
        totalResults: localMatches.length
      };
    }
  }
};