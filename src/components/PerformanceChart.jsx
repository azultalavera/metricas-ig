import React from 'react';
import { BarChart3, Inbox } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function PerformanceChart({ posts, currentFilter, onFilterChange, searchTerm }) {
  const filteredPosts = (posts || []).filter((p) => {
    const matchesFilter = currentFilter === 'all' || p.type === currentFilter;
    const matchesSearch = p.title.toLowerCase().includes((searchTerm || '').toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const hasPosts = filteredPosts.length > 0;

  const chartData = {
    labels: filteredPosts.map((p) => p.title),
    datasets: [
      {
        label: 'Visualizaciones',
        data: filteredPosts.map((p) => p.views),
        backgroundColor: 'rgba(225, 48, 108, 0.85)',
        borderColor: '#E1306C',
        borderWidth: 1,
        borderRadius: 6
      },
      {
        label: 'Cuentas Alcanzadas',
        data: filteredPosts.map((p) => p.reach),
        backgroundColor: 'rgba(131, 58, 180, 0.7)',
        borderColor: '#833AB4',
        borderWidth: 1,
        borderRadius: 6
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#9CA3AF', font: { family: 'Plus Jakarta Sans', size: 12 } } }
    },
    scales: {
      x: { ticks: { color: '#9CA3AF' }, grid: { color: 'rgba(255,255,255,0.05)' } },
      y: { ticks: { color: '#9CA3AF' }, grid: { color: 'rgba(255,255,255,0.05)' } }
    }
  };

  return (
    <div className="card">
      <div className="card-header-bar">
        <div className="card-title">
          <BarChart3 style={{ width: 20 }} /> Rendimiento por Publicación Destacada
        </div>
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
      </div>
      <div className="chart-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {hasPosts ? (
          <Bar data={chartData} options={chartOptions} />
        ) : (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px 20px' }}>
            <Inbox style={{ width: 40, height: 40, margin: '0 auto 10px', opacity: 0.4 }} />
            <p style={{ fontSize: '0.9rem' }}>No hay publicaciones destacadas registradas para este mes.</p>
          </div>
        )}
      </div>
    </div>
  );
}
