import React, { useState } from 'react';
import { searchService } from './services/searchService';
import { storageService } from './services/storageService';

export function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    const data = await searchService.search(query);
    
    if (data.isDirectUrl) {
      setResults([data.item]);
      storageService.addHistory(data.item);
    } else {
      setResults(data.results);
    }
    setLoading(false);
  };

  const openUrl = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', background: '#0f172a', color: '#fff', minHeight: '100vh' }}>
      <h1 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span>🟣</span> GoNex Search
      </h1>
      
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', marginBottom: '2rem' }}>
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Busca en la web o escribe una URL (ej: youtube.com)..."
          style={{ flex: 1, padding: '14px', borderRadius: '8px', border: '1px solid #334155', background: '#1e293b', color: '#fff', fontSize: '1rem', outline: 'none' }}
        />
        <button type="submit" style={{ padding: '14px 28px', borderRadius: '8px', background: '#6366f1', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}>
          {loading ? 'Buscando...' : 'Buscar'}
        </button>
      </form>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {results.map((item) => (
          <div 
            key={item.id} 
            onClick={() => openUrl(item.url)}
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
              <h2 style={{ color: '#818cf8', fontSize: '1.25rem', marginBottom: '0.4rem' }}>
                {item.title}
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
                {item.description}
              </p>
              <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                🌐 {item.domain}
              </span>
            </div>
            
            <button 
              onClick={(e) => {
                e.stopPropagation();
                openUrl(item.url);
              }}
              style={{
                background: '#6366f1',
                color: '#fff',
                border: 'none',
                padding: '10px 18px',
                borderRadius: '6px',
                fontWeight: 'bold',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                marginLeft: '1rem'
              }}
            >
              Abrir sitio ↗
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}