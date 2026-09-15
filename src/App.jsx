import React, { useState } from 'react';
import { searchService } from './services/searchService';

const HISTORICAL_MONUMENTS = [
  {
    id: 'machu-picchu',
    title: 'Machu Picchu',
    location: 'Cusco, Perú',
    url: 'https://es.wikipedia.org/wiki/Machu_Picchu',
    image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=800&q=75'
  },
  {
    id: 'colosseum',
    title: 'Coliseo Romano',
    location: 'Roma, Italia',
    url: 'https://es.wikipedia.org/wiki/Coliseo',
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=75'
  },
  {
    id: 'taj-mahal',
    title: 'Taj Mahal',
    location: 'Agra, India',
    url: 'https://es.wikipedia.org/wiki/Taj_Mahal',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=75'
  },
  {
    id: 'chichen-itza',
    title: 'Chichén Itzá',
    location: 'Yucatán, México',
    url: 'https://es.wikipedia.org/wiki/Chich%C3%A9n_Itz%C3%A1',
    image: 'https://images.unsplash.com/photo-1518638150340-f706e86654de?auto=format&fit=crop&w=800&q=75'
  },
  {
    id: 'pyramids-giza',
    title: 'Pirámides de Guiza',
    location: 'El Cairo, Egipto',
    url: 'https://es.wikipedia.org/wiki/Necr%C3%B3polis_de_Guiza',
    image: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=800&q=75'
  },
  {
    id: 'great-wall',
    title: 'Gran Muralla China',
    location: 'Pekín, China',
    url: 'https://es.wikipedia.org/wiki/Gran_Muralla_China',
    image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=800&q=75'
  }
];

export function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeUrl, setActiveUrl] = useState(null);
  const [displayTitle, setDisplayTitle] = useState('');

  // Generador de URLs 100% compatibles con el marco de GoNex
  const resolveEmbedUrl = (input) => {
    const clean = input.trim();
    setDisplayTitle(clean);

    // 1. Si es un video específico de YouTube (watch?v=ID o youtu.be/ID)
    const ytVideoMatch = clean.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?.*v=|^v\/|embed\/))([\w-]{11})/);
    if (ytVideoMatch && ytVideoMatch[1]) {
      return `https://www.youtube-nocookie.com/embed/${ytVideoMatch[1]}?autoplay=1`;
    }

    // 2. Si escribe youtube.com o busca en YouTube
    if (clean.toLowerCase().includes('youtube.com') || clean.toLowerCase() === 'youtube') {
      return `https://www.youtube-nocookie.com/embed?listType=search&list=musica+tendencias`;
    }

    // 3. Si ingresa una URL normal
    if (clean.startsWith('http://') || clean.startsWith('https://')) {
      return clean;
    }
    
    return `https://${clean}`;
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;

    // Detectar navegación directa o YouTube
    if (q.includes('.') || q.toLowerCase().includes('youtube')) {
      const embedUrl = resolveEmbedUrl(q);
      setActiveUrl(embedUrl);
      setResults([]);
      return;
    }

    // Búsqueda de información
    setLoading(true);
    try {
      const data = await searchService.search(q);
      if (data.isDirectUrl) {
        setActiveUrl(resolveEmbedUrl(data.item.url));
      } else {
        setResults(data.results || []);
        setActiveUrl(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openInApp = (url) => {
    const embedUrl = resolveEmbedUrl(url);
    setActiveUrl(embedUrl);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#0b0f19', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* BARRA SUPERIOR DE GONEX */}
      <header style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 20px', background: '#161e2e', borderBottom: '1px solid #1f293d' }}>
        <h1 
          onClick={() => { setActiveUrl(null); setResults([]); setQuery(''); }}
          style={{ fontSize: '1.2rem', cursor: 'pointer', margin: 0, fontWeight: 'bold', color: '#818cf8', userSelect: 'none' }}
        >
          🟣 GoNex
        </h1>

        {activeUrl && (
          <button 
            onClick={() => setActiveUrl(null)}
            style={{ background: '#334155', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold' }}
          >
            🏠 Inicio
          </button>
        )}

        <form onSubmit={handleSearch} style={{ flex: 1, display: 'flex', gap: '8px' }}>
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Escribe youtube.com, wikipedia.org o busca un tema..."
            style={{ flex: 1, padding: '8px 14px', borderRadius: '8px', border: '1px solid #334155', background: '#0b0f19', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
          />
          <button type="submit" style={{ padding: '8px 18px', borderRadius: '8px', background: '#6366f1', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
            {loading ? '...' : 'Ir'}
          </button>
        </form>
      </header>

      {/* VISTA PRINCIPAL */}
      <main style={{ flex: 1, position: 'relative', overflowY: 'auto' }}>
        
        {/* NAVEGADOR / REPRODUCTOR DENTRO DE GONEX */}
        {activeUrl ? (
          <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ background: '#1e293b', padding: '6px 16px', fontSize: '0.8rem', color: '#94a3b8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>🌐 Navegando en GoNex: <strong style={{ color: '#38bdf8' }}>{displayTitle}</strong></span>
              <a 
                href={displayTitle.startsWith('http') ? displayTitle : `https://${displayTitle}`} 
                target="_blank" 
                rel="noreferrer" 
                style={{ color: '#818cf8', textDecoration: 'none', fontWeight: 'bold' }}
              >
                Abrir en pestaña externa ↗
              </a>
            </div>
            <iframe 
              src={activeUrl}
              title="GoNex Player Frame"
              style={{ width: '100%', flex: 1, border: 'none', background: '#000' }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        ) : (
          <div style={{ padding: '1.5rem', maxWidth: '1100px', margin: '0 auto' }}>
            
            {/* RESULTADOS DE BÚSQUEDA */}
            {results.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <h2 style={{ fontSize: '1.1rem', color: '#94a3b8', margin: '0 0 0.5rem 0' }}>Resultados de búsqueda</h2>
                {results.map((item) => (
                  <div 
                    key={item.id}
                    onClick={() => openInApp(item.url)}
                    style={{ background: '#161e2e', padding: '1rem', borderRadius: '10px', border: '1px solid #1f293d', cursor: 'pointer' }}
                  >
                    <h3 style={{ color: '#818cf8', margin: '0 0 0.3rem 0', fontSize: '1.05rem' }}>{item.title}</h3>
                    <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0 0 0.4rem 0' }}>{item.description}</p>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>🌐 {item.domain}</span>
                  </div>
                ))}
              </div>
            ) : (
              
              /* PANTALLA DE INICIO MONUMENTOS 4K */
              <div>
                <div style={{ textAlign: 'center', margin: '0.5rem 0 1.5rem 0' }}>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: '0 0 0.4rem 0' }}>Explora el Mundo con GoNex</h2>
                  <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>Acceso directo a contenido global sin bloqueos.</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.2rem' }}>
                  {HISTORICAL_MONUMENTS.map((item) => (
                    <div 
                      key={item.id}
                      onClick={() => openInApp(item.url)}
                      style={{
                        height: '200px',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        position: 'relative',
                        cursor: 'pointer',
                        backgroundImage: `url(${item.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        boxShadow: '0 8px 20px rgba(0,0,0,0.4)',
                        transition: 'transform 0.15s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to top, rgba(11, 15, 25, 0.95) 0%, rgba(11, 15, 25, 0.2) 60%, transparent 100%)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                        padding: '1rem'
                      }}>
                        <span style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 'bold', textTransform: 'uppercase' }}>{item.location}</span>
                        <h3 style={{ fontSize: '1.2rem', margin: '0.1rem 0 0.4rem 0', color: '#fff' }}>{item.title}</h3>
                        <button style={{
                          alignSelf: 'flex-start',
                          background: '#6366f1',
                          color: '#fff',
                          border: 'none',
                          padding: '5px 12px',
                          borderRadius: '6px',
                          fontSize: '0.8rem',
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