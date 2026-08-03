import React, { useState } from 'react';
import { Table, Video, Layers, ArrowUpDown, Search, Trophy } from 'lucide-react';

export default function PostsTable({
  posts,
  currentFilter,
  onFilterChange,
  searchTerm,
  onSearchChange
}) {
  const [sortColumn, setSortColumn] = useState('views');
  const [sortAscending, setSortAscending] = useState(false);

  let processed = (posts || []).map((p) => ({
    ...p,
    conversion: parseFloat(((p.newFollowers / (p.reach || 1)) * 100).toFixed(2))
  }));

  // Filter & Search
  processed = processed.filter((p) => {
    const matchesFilter = currentFilter === 'all' || p.type === currentFilter;
    const matchesSearch = p.title.toLowerCase().includes((searchTerm || '').toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Sort
  processed.sort((a, b) => {
    let valA = a[sortColumn];
    let valB = b[sortColumn];
    if (typeof valA === 'string') {
      valA = valA.toLowerCase();
      valB = valB.toLowerCase();
    }
    if (valA < valB) return sortAscending ? -1 : 1;
    if (valA > valB) return sortAscending ? 1 : -1;
    return 0;
  });

  function handleSort(col) {
    if (sortColumn === col) {
      setSortAscending(!sortAscending);
    } else {
      setSortColumn(col);
      setSortAscending(false);
    }
  }

  return (
    <section className="card" style={{ marginBottom: '28px' }}>
      <div className="card-header-bar">
        <div className="card-title">
          <Table style={{ width: 20 }} /> Detalle de Publicaciones Destacadas
        </div>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Haz clic en cualquier columna para ordenar
        </span>
      </div>

      <div className="table-controls">
        <div className="filter-tabs">
          <button
            className={`tab-btn ${currentFilter === 'all' ? 'active' : ''}`}
            onClick={() => onFilterChange('all')}
          >
            Todos ({posts?.length || 0})
          </button>
          <button
            className={`tab-btn ${currentFilter === 'Reel' ? 'active' : ''}`}
            onClick={() => onFilterChange('Reel')}
          >
            Solo Reels
          </button>
          <button
            className={`tab-btn ${currentFilter === 'Dump' ? 'active' : ''}`}
            onClick={() => onFilterChange('Dump')}
          >
            Solo Dumps
          </button>
        </div>

        <div className="search-box">
          <Search style={{ width: 18 }} />
          <input
            type="text"
            placeholder="Buscar por título..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort('title')}>
                Publicación <ArrowUpDown style={{ width: 14 }} />
              </th>
              <th onClick={() => handleSort('type')}>
                Tipo <ArrowUpDown style={{ width: 14 }} />
              </th>
              <th onClick={() => handleSort('views')}>
                Visualizaciones <ArrowUpDown style={{ width: 14 }} />
              </th>
              <th onClick={() => handleSort('reach')}>
                Alcance (Cuentas) <ArrowUpDown style={{ width: 14 }} />
              </th>
              <th onClick={() => handleSort('avgTime')}>
                Tiempo Prom. <ArrowUpDown style={{ width: 14 }} />
              </th>
              <th onClick={() => handleSort('newFollowers')}>
                Nuevos Seg. <ArrowUpDown style={{ width: 14 }} />
              </th>
              <th onClick={() => handleSort('conversion')}>
                Tasa Conversión <ArrowUpDown style={{ width: 14 }} />
              </th>
            </tr>
          </thead>
          <tbody>
            {processed.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '30px' }}
                >
                  No se encontraron publicaciones con los criterios seleccionados.
                </td>
              </tr>
            ) : (
              processed.map((p) => (
                <tr key={p.id} className={p.isTopConverter ? 'highlight-top' : ''}>
                  <td>
                    <div className="post-title-cell">
                      {p.type === 'Reel' ? (
                        <Video style={{ color: 'var(--ig-purple)', width: 18 }} />
                      ) : (
                        <Layers style={{ color: 'var(--ig-orange)', width: 18 }} />
                      )}
                      <span>{p.title}</span>
                      {p.isTopConverter && (
                        <span className="badge badge-top" style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                          <Trophy style={{ width: 12, height: 12 }} /> Top Conversión
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${p.type === 'Reel' ? 'badge-reel' : 'badge-dump'}`}>
                      {p.type}
                    </span>
                  </td>
                  <td style={{ fontWeight: 700 }}>{p.views.toLocaleString()}</td>
                  <td>{p.reach.toLocaleString()}</td>
                  <td>{p.avgTime}s</td>
                  <td style={{ color: '#34D399', fontWeight: 700 }}>+{p.newFollowers}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          fontWeight: 700,
                          color: p.conversion > 0.5 ? '#34D399' : 'var(--text-primary)'
                        }}
                      >
                        {p.conversion}%
                      </span>
                      <div className="progress-bar-bg" style={{ width: '50px' }}>
                        <div
                          className="progress-bar-fill"
                          style={{ width: `${Math.min(p.conversion * 120, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
