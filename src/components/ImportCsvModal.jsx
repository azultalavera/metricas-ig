import React, { useState } from 'react';
import { Upload, X, FileSpreadsheet, CheckCircle, AlertCircle } from 'lucide-react';
import { parseInstagramCsv } from '../utils/csvParser.js';

export default function ImportCsvModal({ isOpen, onClose, onImportCsv }) {
  const [csvText, setCsvText] = useState('');
  const [statusMessage, setStatusMessage] = useState(null);

  if (!isOpen) return null;

  function handleProcessImport() {
    if (!csvText.trim()) {
      setStatusMessage({ type: 'error', text: 'Por favor pega el contenido del archivo CSV.' });
      return;
    }

    try {
      const parsedMonth = parseInstagramCsv(csvText);

      onImportCsv(parsedMonth);
      setStatusMessage({ type: 'success', text: `¡Mes "${parsedMonth.name}" importado exitosamente!` });
      setTimeout(() => {
        setStatusMessage(null);
        setCsvText('');
        onClose();
      }, 1000);
    } catch (err) {
      console.error('Error importing CSV:', err);
      setStatusMessage({ type: 'error', text: 'Error al procesar el archivo CSV.' });
    }
  }

  return (
    <div className="modal-backdrop active">
      <div className="modal-content" style={{ maxWidth: '650px' }}>
        <div className="modal-header">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
            <FileSpreadsheet style={{ color: 'var(--ig-pink)', width: 20 }} /> Importar Métricas de Mes (CSV)
          </h3>
          <button className="modal-close" onClick={onClose}>
            &times;
          </button>
        </div>

        {statusMessage && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: '8px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: statusMessage.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              color: statusMessage.type === 'success' ? '#34D399' : '#FCA5A5',
              fontSize: '0.85rem'
            }}
          >
            {statusMessage.type === 'success' ? <CheckCircle style={{ width: 16 }} /> : <AlertCircle style={{ width: 16 }} />}
            {statusMessage.text}
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Pega el contenido del archivo CSV aquí:</label>
          <textarea
            className="form-input"
            style={{ height: '220px', fontFamily: 'monospace', fontSize: '0.8rem' }}
            placeholder="Pega aquí el contenido del archivo CSV..."
            value={csvText}
            onChange={(e) => setCsvText(e.target.value)}
          ></textarea>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
          <button className="btn" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn btn-primary" onClick={handleProcessImport}>
            <Upload style={{ width: 16 }} /> Procesar e Importar CSV
          </button>
        </div>
      </div>
    </div>
  );
}
