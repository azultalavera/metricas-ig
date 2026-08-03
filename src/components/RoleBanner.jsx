import React from 'react';
import { Eye, Shield } from 'lucide-react';

export default function RoleBanner({ currentUserRole, toggleUserRole }) {
  const isViewer = currentUserRole === 'viewer';

  return (
    <div className="role-bar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span className={`role-badge ${isViewer ? 'viewer' : 'configurator'}`}>
          {isViewer ? <Eye style={{ width: 14 }} /> : <Shield style={{ width: 14 }} />}
          {isViewer ? 'Rol Visor' : 'Rol Configurador'}
        </span>
        <span style={{ color: 'var(--text-secondary)' }}>
          {isViewer
            ? 'Estás en modo lectura de métricas de Instagram.'
            : 'Modo edición activo. Puedes agregar nuevos meses, editar KPIs y publicaciones.'}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button className="btn" onClick={toggleUserRole}>
          {isViewer ? <Shield style={{ width: 16 }} /> : <Eye style={{ width: 16 }} />}
          {isViewer ? 'Cambiar a Rol Configurador' : 'Cambiar a Rol Visor'}
        </button>
      </div>
    </div>
  );
}
