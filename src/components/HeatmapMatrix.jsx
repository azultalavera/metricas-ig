import React from 'react';
import { Clock, Flame } from 'lucide-react';

export default function HeatmapMatrix({ peakHours }) {
  const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  const timeSlots = [
    { label: 'Mañana (6-12)', key: 'm' },
    { label: 'Tarde (12-6)', key: 't' },
    { label: 'Noche (6-9)', key: 'n1' },
    { label: 'Trasnoche (9-12)', key: 'n2' }
  ];

  const peakMap = peakHours || {};

  return (
    <div className="card">
      <div className="card-header-bar">
        <div className="card-title">
          <Clock style={{ width: 20 }} /> Horarios y Días de Mayor Actividad
        </div>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Picos detectados</span>
      </div>

      <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
        Distribución de concurrencia de la audiencia según el informe del mes activo.
      </p>

      <div className="heatmap-grid">
        <div></div>
        {days.map((day) => (
          <div key={day} className="heatmap-label" style={{ justifyContent: 'center' }}>
            {day}
          </div>
        ))}

        {timeSlots.map((slot) => (
          <React.Fragment key={slot.key}>
            <div className="heatmap-label">{slot.label}</div>
            {days.map((day) => {
              const activeSlots = peakMap[day] || [];
              const isActive = activeSlots.includes(slot.key);

              return (
                <div
                  key={`${day}-${slot.key}`}
                  className={`heatmap-cell ${isActive ? 'active-high' : ''}`}
                  title={`${day} - ${slot.label}`}
                >
                  {isActive && (
                    <span className="activity-badge" style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <Flame style={{ width: 10, height: 10, color: 'var(--ig-orange)' }} /> Pico
                    </span>
                  )}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>

      <div
        style={{
          display: 'flex',
          gap: '16px',
          marginTop: '20px',
          fontSize: '0.75rem',
          color: 'var(--text-secondary)',
          justifyContent: 'center'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span
            style={{
              width: 12,
              height: 12,
              borderRadius: 3,
              background: 'rgba(255,255,255,0.05)',
              display: 'inline-block'
            }}
          ></span>{' '}
          Normal
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span
            style={{
              width: 12,
              height: 12,
              borderRadius: 3,
              background: 'rgba(245,96,64,0.6)',
              border: '1px solid var(--ig-pink)',
              display: 'inline-block'
            }}
          ></span>{' '}
          <Flame style={{ width: 12, height: 12, color: 'var(--ig-orange)' }} /> Pico Máximo
        </div>
      </div>
    </div>
  );
}
