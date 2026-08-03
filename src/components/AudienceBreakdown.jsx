import React from 'react';
import { Users, Globe, UserCheck } from 'lucide-react';

export default function AudienceBreakdown({ kpis }) {
  const nonSeg = kpis?.nonFollowersReachPercent || 66;
  const seg = kpis?.followersReachPercent || 34;

  const mainSeg = kpis?.mainFollowersPercent || 53.2;
  const mainNonSeg = kpis?.mainNonFollowersPercent || 46.8;

  const totalContent = (kpis?.reels || 0) + (kpis?.dumps || 0) + (kpis?.stories || 0);

  const storiesPct = totalContent > 0 ? (((kpis?.stories || 0) / totalContent) * 100).toFixed(1) : 0;
  const reelsPct = totalContent > 0 ? (((kpis?.reels || 0) / totalContent) * 100).toFixed(1) : 0;
  const dumpsPct = totalContent > 0 ? (((kpis?.dumps || 0) / totalContent) * 100).toFixed(1) : 0;

  return (
    <div className="card">
      <div className="card-header-bar">
        <div className="card-title">
          <Users style={{ width: 20 }} /> Proporción de Audiencia y Distribución
        </div>
      </div>

      {/* General Reach */}
      <div style={{ marginBottom: '24px' }}>
        <div className="breakdown-label">
          <span style={{ fontWeight: 700 }}>Audiencia Alcanzada General</span>
          <span style={{ color: 'var(--ig-pink)', fontWeight: 700 }}>
            {nonSeg}% No Seguidores / {seg}% Seguidores
          </span>
        </div>
        <div className="breakdown-bar" style={{ height: '14px', borderRadius: '7px' }}>
          <div
            className="breakdown-segment"
            style={{ width: `${nonSeg}%`, background: 'var(--ig-gradient)' }}
            title={`No seguidores: ${nonSeg}%`}
          ></div>
          <div
            className="breakdown-segment"
            style={{ width: `${seg}%`, background: 'rgba(255, 255, 255, 0.2)' }}
            title={`Seguidores: ${seg}%`}
          ></div>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            marginTop: '6px'
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Globe style={{ width: 13 }} /> Virilidad / Descubrimiento ({nonSeg}%)
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <UserCheck style={{ width: 13 }} /> Fidelización de la comunidad ({seg}%)
          </span>
        </div>
      </div>

      {/* Main Period Split */}
      <div style={{ marginBottom: '24px' }}>
        <div className="breakdown-label">
          <span>Vista Período Principal (30 Días)</span>
          <span>
            {mainSeg}% Seguidores / {mainNonSeg}% No seguidores
          </span>
        </div>
        <div className="breakdown-bar">
          <div
            className="breakdown-segment"
            style={{ width: `${mainSeg}%`, background: '#833AB4' }}
          ></div>
          <div
            className="breakdown-segment"
            style={{ width: `${mainNonSeg}%`, background: '#06B6D4' }}
          ></div>
        </div>
      </div>

      {/* Formats mix */}
      <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-card)' }}>
        <div
          style={{
            fontWeight: 700,
            fontSize: '0.9rem',
            marginBottom: '12px',
            display: 'flex',
            justifyContent: 'space-between'
          }}
        >
          <span>Mix de Formato Publicado</span>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
            {totalContent} publicaciones totales
          </span>
        </div>

        <div className="breakdown-item">
          <div className="breakdown-label">
            <span>Stories / Historias</span>
            <span style={{ fontWeight: 700 }}>
              {kpis?.stories || 0} ({storiesPct}%)
            </span>
          </div>
          <div className="progress-bar-bg" style={{ width: '100%' }}>
            <div
              className="progress-bar-fill"
              style={{ width: `${storiesPct}%`, background: 'var(--ig-orange)' }}
            ></div>
          </div>
        </div>

        <div className="breakdown-item">
          <div className="breakdown-label">
            <span>Reels</span>
            <span style={{ fontWeight: 700 }}>
              {kpis?.reels || 0} ({reelsPct}%)
            </span>
          </div>
          <div className="progress-bar-bg" style={{ width: '100%' }}>
            <div
              className="progress-bar-fill"
              style={{ width: `${reelsPct}%`, background: 'var(--ig-purple)' }}
            ></div>
          </div>
        </div>

        <div className="breakdown-item">
          <div className="breakdown-label">
            <span>Dumps / Publicaciones</span>
            <span style={{ fontWeight: 700 }}>
              {kpis?.dumps || 0} ({dumpsPct}%)
            </span>
          </div>
          <div className="progress-bar-bg" style={{ width: '100%' }}>
            <div
              className="progress-bar-fill"
              style={{ width: `${dumpsPct}%`, background: 'var(--cyan-accent)' }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
