import React, { useState, useEffect } from 'react';
import { Eye, UserPlus, Heart, Grid, TrendingUp } from 'lucide-react';

export default function KpiGrid({ kpis }) {
  const [animatedViews, setAnimatedViews] = useState(0);
  const [animatedFollowers, setAnimatedFollowers] = useState(0);
  const [animatedInteractions, setAnimatedInteractions] = useState(0);
  const [animatedContent, setAnimatedContent] = useState(0);

  const totalContent = (kpis?.reels || 0) + (kpis?.dumps || 0) + (kpis?.stories || 0);

  useEffect(() => {
    if (kpis?.totalViews) animateValue(kpis.totalViews, setAnimatedViews);
    else setAnimatedViews(0);

    if (kpis?.netFollowers !== null && kpis?.netFollowers !== undefined) {
      animateValue(kpis.netFollowers, setAnimatedFollowers);
    }

    if (kpis?.interactions !== null && kpis?.interactions !== undefined) {
      animateValue(kpis.interactions, setAnimatedInteractions);
    }

    animateValue(totalContent, setAnimatedContent);
  }, [kpis]);

  function animateValue(target, setter) {
    let start = 0;
    const duration = 1000;
    const steps = 30;
    const increment = target / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        start = target;
        clearInterval(timer);
      }
      setter(Math.floor(start));
    }, duration / steps);
  }

  const hasFollowersData = kpis?.netFollowers !== null && kpis?.netFollowers !== undefined;
  const hasInteractionsData = kpis?.interactions !== null && kpis?.interactions !== undefined;
  const hasMainViewsData = kpis?.mainViews && kpis.mainViews > 0;

  return (
    <section className="kpi-grid">
      {/* Views */}
      <div className="card kpi-card">
        <div className="kpi-header">
          <span className="kpi-title">Visualizaciones Totales</span>
          <div className="kpi-icon"><Eye style={{ width: 20 }} /></div>
        </div>
        <div className="kpi-value">{animatedViews > 0 ? animatedViews.toLocaleString() : '-'}</div>
        <div className="kpi-footer">
          {hasMainViewsData ? (
            <>
              <span className="trend-pill">
                <TrendingUp style={{ width: 14 }} /> {kpis.mainViews.toLocaleString()}
              </span>
              <span>en período principal (30 días)</span>
            </>
          ) : (
            <span>Período principal no disponible</span>
          )}
        </div>
      </div>

      {/* Followers */}
      <div className="card kpi-card">
        <div className="kpi-header">
          <span className="kpi-title">Seguidores Netos</span>
          <div className="kpi-icon" style={{ color: 'var(--green-accent)' }}>
            <UserPlus style={{ width: 20 }} />
          </div>
        </div>
        <div className="kpi-value" style={{ color: '#34D399' }}>
          {hasFollowersData ? `+${animatedFollowers.toLocaleString()}` : '-'}
        </div>
        <div className="kpi-footer">
          {hasFollowersData ? (
            <>
              <span className="trend-pill">+{kpis.netFollowers} netos</span>
              <span>Crecimiento mensual acumulado</span>
            </>
          ) : (
            <span>Sin datos en el informe</span>
          )}
        </div>
      </div>

      {/* Interactions */}
      <div className="card kpi-card">
        <div className="kpi-header">
          <span className="kpi-title">Interacciones Totales</span>
          <div className="kpi-icon" style={{ color: '#F87171' }}>
            <Heart style={{ width: 20 }} />
          </div>
        </div>
        <div className="kpi-value">
          {hasInteractionsData ? animatedInteractions.toLocaleString() : '-'}
        </div>
        <div className="kpi-footer">
          <span>{hasInteractionsData ? 'Likes, comentarios, guardados y envíos' : 'Sin datos de interacción'}</span>
        </div>
      </div>

      {/* Published Content */}
      <div className="card kpi-card">
        <div className="kpi-header">
          <span className="kpi-title">Publicaciones Realizadas</span>
          <div className="kpi-icon" style={{ color: 'var(--cyan-accent)' }}>
            <Grid style={{ width: 20 }} />
          </div>
        </div>
        <div className="kpi-value">{animatedContent.toLocaleString()}</div>
        <div className="kpi-footer">
          <span>{kpis?.reels || 0} Reels • {kpis?.dumps || 0} Dumps • {kpis?.stories || 0} Stories</span>
        </div>
      </div>
    </section>
  );
}
