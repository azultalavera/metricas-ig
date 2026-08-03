import React from 'react';
import { Lightbulb, Trophy, Clock4, Calendar } from 'lucide-react';

export default function InsightsGrid({ monthData }) {
  const posts = monthData?.posts || [];
  const topPost = posts.find((p) => p.isTopConverter) || posts[0];
  const maxAvgTimePost = [...posts].sort((a, b) => b.avgTime - a.avgTime)[0];

  return (
    <section className="card">
      <div className="card-header-bar">
        <div className="card-title">
          <Lightbulb style={{ width: 20 }} /> Insights Estratégicos del Mes
        </div>
      </div>

      <div className="insights-grid">
        <div className="insight-card">
          <div className="insight-icon">
            <Trophy style={{ width: 22 }} />
          </div>
          <div className="insight-content">
            <h4>Contenido de Crecimiento Viral</h4>
            <p>
              La publicación <strong>"{topPost ? topPost.title : 'Destacada'}"</strong> logró generar{' '}
              <strong>+{topPost ? topPost.newFollowers : 0} seguidores</strong> con un alcance de{' '}
              {(topPost ? topPost.reach : 0).toLocaleString()} cuentas.
            </p>
          </div>
        </div>

        <div className="insight-card">
          <div className="insight-icon">
            <Clock4 style={{ width: 22 }} />
          </div>
          <div class="insight-content">
            <h4>Fidelización y Retención</h4>
            <p>
              La publicación <strong>"{maxAvgTimePost ? maxAvgTimePost.title : 'Destacada'}"</strong>{' '}
              registró el mayor tiempo promedio con{' '}
              <strong>{maxAvgTimePost ? maxAvgTimePost.avgTime : 0}s</strong> de permanencia.
            </p>
          </div>
        </div>

        <div className="insight-card">
          <div className="insight-icon">
            <Calendar style={{ width: 22 }} />
          </div>
          <div className="insight-content">
            <h4>Estrategia de Publicación</h4>
            <p>
              Se recomienda programar lanzamientos de Reels en el tramo nocturno registrado en la
              matriz de concurrencia.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
