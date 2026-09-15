import React, { useState } from 'react';
import { searchService } from './services/searchService';

// Monumentos históricos con imágenes 4K (Unsplash Ultra HD)
const HISTORICAL_MONUMENTS = [
  {
    id: 'machu-picchu',
    title: 'Machu Picchu',
    location: 'Cusco, Perú',
    url: 'https://es.wikipedia.org/wiki/Machu_Picchu',
    image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=1600&q=80'
  },
  {
    id: 'colosseum',
    title: 'Coliseo Romano',
    location: 'Roma, Italia',
    url: 'https://es.wikipedia.org/wiki/Coliseo',
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1600&q=80'
  },
  {
    id: 'taj-mahal',
    title: 'Taj Mahal',
    location: 'Agra, India',
    url: 'https://es.wikipedia.org/wiki/Taj_Mahal',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1600&q=80'
  },
  {
    id: 'chichen-itza',
    title: 'Chichén Itzá',
    location: 'Yucatán, México',
    url: 'https://es.wikipedia.org/wiki/Chich%C3%A9n_Itz%C3%A1',
    image: 'https://images.unsplash.com/photo-1518638150340-f706e86654de?auto=format&fit=crop&w=1600&q=80'
  },
  {
    id: 'pyramids-giza',
    title: 'Pirámides de Guiza',
    location: 'El Cairo, Egipto',
    url: 'https://es.wikipedia.org/wiki/Necr%C3%B3polis_de_Guiza',
    image: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=1600&q=80'
  },
  {
    id: 'great-wall',
    title: 'Gran Muralla China',
    location: 'Pekín, China',
    url: 'https://es.wikipedia.org/wiki/Gran_Muralla_China',
    image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=1600&q=80'
  }
];

export function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeUrl, setActiveUrl] = useState(null);

  const formatUrl = (input) => {
    let clean = input.trim();
    if (!clean.startsWith('http://') && !clean.startsWith('https://')) {
      clean = `https://${clean}`;
    }
    
    // Pasa la URL a través del motor proxy para anular bloqueos de seguridad iframe
    return `https://www.croxyproxy.com/_es/navbar?url=${encodeURIComponent(clean)}`;
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    const data = await searchService.search(query);
    
    if (data.isDirectUrl) {
      setActiveUrl(formatUrl(data.item.url));
    } else {
      setResults(data.results);
      setActiveUrl(null);
    }
    setLoading(false);
  };

  const openInApp = (url) => {
    setActiveUrl(formatUrl(url));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#0b0f19', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* BARRA SUPERIOR GONEX BROWSER */}
      <header style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 24px', background: '#161e2e', borderBottom: '1px solid #1f293d' }}>
        <h1 
          onClick={() => { setActiveUrl(null); setResults([]); setQuery(''); }}
          style={{ fontSize: '1.3rem', cursor: 'pointer', margin: 0, fontWeight: 'bold', letterSpacing: '0.5px', color: '#818cf8' }}
        >
          🟣 GoNex
        </h1>

        {activeUrl && (
          <button 
            onClick={() => setActiveUrl(null)}
            style={{ background: '#334155', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}
          >
            🏠 Inicio
          </button>
        )}

        <form onSubmit={handleSearch} style={{ flex: 1, display: 'flex', gap: '8px' }}>
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Escribe youtube.com, wikipedia.org o busca cualquier tema..."
            style={{ flex: 1, padding: '10px 16px', borderRadius: '8px', border: '1px solid #334155', background: '#0b0f19', color: '#fff', fontSize: '0.95rem' }}
          />
          <button type="submit" style={{ padding: '10px 22px', borderRadius: '8px', background: '#6366f1', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
            {loading ? 'Cargando...' : 'Navegar'}
          </button>
        </form>
      </header>

      {/* ÁREA PRINCIPAL */}
      <main style={{ flex: 1, position: 'relative', overflowY: 'auto' }}>
        {activeUrl ? (
          <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ background: '#1e293b', padding: '8px 16px', fontSize: '0.85rem', color: '#94a3b8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>🛡️ Navegación sin restricciones dentro de GoNex</span>
              <button 
                onClick={() => setActiveUrl(null)} 
                style={{ background: 'transparent', color: '#818cf8', border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}
              >
                Cerrar vista ✕
              </button>
            </div>
            <iframe 
              src={activeUrl}
              title="GoNex Browser Frame"
              style={{ width: '100%', flex: 1, border: 'none', background: '#ffffff' }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        ) : (
          <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            {results.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h2 style={{ fontSize: '1.2rem', color: '#94a3b8', marginBottom: '0.5rem' }}>Resultados de búsqueda</h2>
                {results.map((item) => (
                  <div 
                    key={item.id}
                    onClick={() => openInApp(item.url)}
                    style={{ background: '#161e2e', padding: '1.2rem', borderRadius: '12px', border: '1px solid #1f293d', cursor: 'pointer' }}
                  >
                    <h3 style={{ color: '#818cf8', margin: '0 0 0.4rem 0', fontSize: '1.15rem' }}>{item.title}</h3>
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: '0 0 0.5rem 0' }}>{item.description}</p>
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>🌐 {item.domain}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div>
                <div style={{ textAlign: 'center', margin: '1rem 0 2.5rem 0' }}>
                  <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Explora el Mundo con GoNex</h2>
                  <p style={{ color: '#94a3b8' }}>Selecciona un monumento histórico para navegar y conocer su historia en vivo.</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
                  {HISTORICAL_MONUMENTS.map((item) => (
                    <div 
                      key={item.id}
                      onClick={() => openInApp(item.url)}
                      style={{
                        height: '240px',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        position: 'relative',
                        cursor: 'pointer',
                        backgroundImage: `url(${item.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                        transition: 'transform 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to top, rgba(11, 15, 25, 0.95) 0%, rgba(11, 15, 25, 0.2) 60%, transparent 100%)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                        padding: '1.2rem'
                      }}>
                        <span style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: 'bold', textTransform: 'uppercase' }}>{item.location}</span>
                        <h3 style={{ fontSize: '1.4rem', margin: '0.2rem 0 0.5rem 0', color: '#fff' }}>{item.title}</h3>
                        <button style={{
                          alignSelf: 'flex-start',
                          background: '#6366f1',
                          color: '#fff',
                          border: 'none',
                          padding: '6px 14px',
                          borderRadius: '6px',
                          fontSize: '0.85rem',
                          fontWeight: 'bold',
                          cursor: 'pointer'
                        }}>
                          Ver dentro de GoNex ↗
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}