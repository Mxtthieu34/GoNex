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

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', background: '#0f172a', color: '#fff', minHeight: '100vh' }}>
      <h1>🟣 GoNex Search</h1>
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', marginBottom: '2rem' }}>
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Busca en la web o escribe una URL..."
          style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #334155', background: '#1e293b', color: '#fff' }}
        />
        <button type="submit" style={{ padding: '12px 24px', borderRadius: '8px', background: '#6366f1', color: '#fff', border: 'none', cursor: 'pointer' }}>
          {loading ? 'Buscando...' : 'Buscar'}
        </button>
      </form>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {results.map((item) => (
          <div key={item.id} style={{ background: '#1e293b', padding: '1rem', borderRadius: '8px' }}>
            <a href={item.url} target="_blank" rel="noreferrer" style={{ color: '#818cf8', textDecoration: 'none', fontSize: '1.2rem', fontWeight: 'bold' }}>
              {item.title}
            </a>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: '0.5rem 0' }}>{item.description}</p>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{item.domain}</span>
          </div>
        ))}
      </div>
    </div>
  );
}