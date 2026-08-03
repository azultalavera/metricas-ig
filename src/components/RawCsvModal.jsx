import React from 'react';
import { FileSpreadsheet } from 'lucide-react';

export default function RawCsvModal({ isOpen, onClose, rawCsv }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop active">
      <div className="modal-content">
        <div className="modal-header">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileSpreadsheet style={{ color: 'var(--ig-pink)', width: 20 }} /> Datos Originales del Informe (CSV)
          </h3>
          <button className="modal-close" onClick={onClose}>
            &times;
          </button>
        </div>
        <pre className="csv-code">{rawCsv || 'Sin datos CSV registrados para este mes.'}</pre>
      </div>
    </div>
  );
}
