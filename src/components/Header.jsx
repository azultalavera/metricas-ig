import React from 'react';
import { Instagram, ChevronDown, FileText, Download, Upload } from 'lucide-react';

export default function Header({
  monthsList,
  activeMonthId,
  onMonthChange,
  onOpenImportCsv,
  onOpenCsvModal
}) {
  return (
    <header>
      <div className="brand-section">
        <div className="profile-avatar">
          <div className="profile-avatar-inner">
            <Instagram style={{ width: 28, height: 28 }} />
          </div>
        </div>
        <div className="brand-title">
          <h1>
            Instagram Analytics
            <div className="month-select-wrapper">
              <select
                id="month-selector"
                className="month-select"
                value={activeMonthId}
                onChange={(e) => onMonthChange(e.target.value)}
              >
                {monthsList.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
              <ChevronDown style={{ width: 16 }} />
            </div>
          </h1>
          <p>Informe mensual de rendimiento, alcance y conversión de audiencia</p>
        </div>
      </div>

      <div className="header-actions">
        {/* Subtle / Hidden CSV Import trigger button */}
        <button
          className="btn"
          style={{ opacity: 0.7, padding: '8px 12px' }}
          title="Importar CSV (Modo Administrador)"
          onClick={onOpenImportCsv}
        >
          <Upload style={{ width: 15 }} />
        </button>

        <button className="btn" onClick={onOpenCsvModal}>
          <FileText style={{ width: 16 }} /> Ver CSV Original
        </button>
        <button className="btn btn-primary" onClick={() => window.print()}>
          <Download style={{ width: 16 }} /> Exportar Dashboard
        </button>
      </div>
    </header>
  );
}
