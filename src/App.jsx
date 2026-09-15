import React, { useState } from 'react';
import { searchService } from './services/searchService';
import { storageService } from './services/storageService';

export function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeUrl, setActiveUrl] = useState(null);

  // Convierte enlaces (especialmente de YouTube) a formato compatible para reproducir dentro de GoNex
  const getEmbeddableUrl = (url) => {
    if (!url) return '';
    let cleanUrl = url.trim();
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      cleanUrl = `https://${cleanUrl}`;
    }

    // Adaptación especial para YouTube (evita el bloqueo de iframe)
    if (cleanUrl.includes('youtube.com/watch') || cleanUrl.includes('youtu.be/')) {
      const match = cleanUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?.*v=|^v\/|embed\/))([\w-]{11})/);
      if (match && match[1]) {
        return `https://www.youtube-nocookie.com/embed/${match[1]}?autoplay=1`;
      }
    }
    
    if (cleanUrl.includes('youtube.com')) {
      return 'https://www.youtube-nocookie.com/embed/';
    }

    return cleanUrl;
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    const data = await searchService.search(query);
    
    if (data.isDirectUrl) {
      const formatted = getEmbeddableUrl(data.item.url);
      setActiveUrl(formatted);
      storageService.addHistory(data.item);
    } else {
      setResults(data.results);
      setActiveUrl(null);
    }
    setLoading(false);
  };

  const openInApp = (url) => {
    const formatted = getEmbeddableUrl(url);
    setActiveUrl(formatted);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#0f172a', color: '#fff', fontFamily: 'sans-serif' }}>
      
      {/* BARRA SUPERIOR DEL NAVEGADOR GONEX */}
      <header style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 20px', background: '#1e293b', borderBottom: '1px solid #334155' }}>
        <h1 
          onClick={() => { setActiveUrl(null); setResults([]); setQuery(''); }}
          style={{ fontSize: '1.2rem', cursor: 'pointer', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <span>🟣</span> GoNex
        </h1>

        {activeUrl && (
          <button 
            onClick={() => setActiveUrl(null)}
            style={{ background: '#334155', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer' }}
          >
            ⬅ Volver a Búsqueda
          </button>
        )}

        <form onSubmit={handleSearch} style={{ flex: 1, display: 'flex', gap: '8px' }}>
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Escribe una URL (ej: youtube.com) o busca algo..."
            style={{ flex: 1, padding: '10px 14px', borderRadius: '6px', border: '1px solid #475569', background: '#0f172a', color: '#fff', fontSize: '0.95rem' }}
          />
          <button type="submit" style={{ padding: '10px 20px', borderRadius: '6px', background: '#6366f1', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
            {loading ? 'Cargando...' : 'Ir'}
          </button>
        </form>
      </header>

      {/* ÁREA DE CONTENIDO PRINCIPAL */}
      <main style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        
        {/* OP CION A: NAVEGADOR INTEGRADO (Abre la web DENTRO de GoNex) */}
        {activeUrl ? (
          <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ background: '#0f172a', padding: '6px 16px', fontSize: '0.85rem', color: '#94a3b8', borderBottom: '1px solid #1e293b' }}>
              Navegando dentro de GoNex: <span style={{ color: '#818cf8' }}>{activeUrl}</span>
            </div>
            <iframe 
              src={activeUrl}
              title="GoNex Browser View"
              style={{ width: '100%', flex: 1, border: 'none', background: '#ffffff' }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        ) : (
          /* OPCION B: LISTA DE RESULTADOS DE BÚSQUEDA */
          <div style={{ padding: '2rem', overflowY: 'auto', height: '100%' }}>
            {results.length === 0 && !loading && (
              <div style={{ textAlign: 'center', marginTop: '4rem', color: '#64748b' }}>
                <h2>Bienvenido a GoNex Browser</h2>
                <p>Escribe cualquier sitio web arriba o realiza una búsqueda para empezar a navegar.</p>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '900px', margin: '0 auto' }}>
              {results.map((item) => (
                <div 
                  key={item.id} 
                  onClick={() => openInApp(item.url)}
                  style={{ 
                    background: '#1e293b', 
                    padding: '1.2rem', 
                    borderRadius: '10px', 
                    border: '1px solid #334155',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = '#6366f1'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = '#334155'}
                >
                  <div>
                    <h2 style={{ color: '#818cf8', fontSize: '1.2rem', marginBottom: '0.4rem' }}>
                      {item.title}
                    </h2>
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                      {item.description}
                    </p>
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>🌐 {item.domain}</span>
                  </div>

                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      openInApp(item.url);
                    }}
                    style={{
                      background: '#6366f1',
                      color: '#fff',
                      border: 'none',
                      padding: '10px 16px',
                      borderRadius: '6px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Navegar aquí 🖥️
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}