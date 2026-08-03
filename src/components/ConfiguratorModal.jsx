import React, { useState, useEffect } from 'react';
import { Settings, X, Plus } from 'lucide-react';

export default function ConfiguratorModal({
  isOpen,
  onClose,
  activeMonth,
  onSaveMonth,
  onDeleteMonth
}) {
  const [activeTab, setActiveTab] = useState('general');

  // Form states
  const [monthName, setMonthName] = useState('');
  const [monthId, setMonthId] = useState('');
  const [totalViews, setTotalViews] = useState(0);
  const [mainViews, setMainViews] = useState(0);
  const [netFollowers, setNetFollowers] = useState(0);
  const [interactions, setInteractions] = useState(0);
  const [reelsCount, setReelsCount] = useState(0);
  const [dumpsCount, setDumpsCount] = useState(0);
  const [storiesCount, setStoriesCount] = useState(0);
  const [nonFollowersPct, setNonFollowersPct] = useState(66);
  const [followersPct, setFollowersPct] = useState(34);

  const [postsList, setPostsList] = useState([]);

  // Demographics state
  const [demoAr, setDemoAr] = useState(32.0);
  const [demoUs, setDemoUs] = useState(17.6);
  const [demoEs, setDemoEs] = useState(6.7);
  const [demoMx, setDemoMx] = useState(4.9);
  const [demoUy, setDemoUy] = useState(3.3);
  const [demoOt, setDemoOt] = useState(35.5);

  const [csvInput, setCsvInput] = useState('');

  useEffect(() => {
    if (activeMonth) {
      setMonthName(activeMonth.name || '');
      setMonthId(activeMonth.id || '');
      setTotalViews(activeMonth.kpis?.totalViews || 0);
      setMainViews(activeMonth.kpis?.mainViews || 0);
      setNetFollowers(activeMonth.kpis?.netFollowers || 0);
      setInteractions(activeMonth.kpis?.interactions || 0);
      setReelsCount(activeMonth.kpis?.reels || 0);
      setDumpsCount(activeMonth.kpis?.dumps || 0);
      setStoriesCount(activeMonth.kpis?.stories || 0);
      setNonFollowersPct(activeMonth.kpis?.nonFollowersReachPercent || 66);
      setFollowersPct(activeMonth.kpis?.followersReachPercent || 34);

      setPostsList(activeMonth.posts ? JSON.parse(JSON.stringify(activeMonth.posts)) : []);

      const demoMap = {};
      (activeMonth.demographics || []).forEach((d) => {
        demoMap[d.country] = d.percentage;
      });
      setDemoAr(demoMap['Argentina'] || 32.0);
      setDemoUs(demoMap['Estados Unidos'] || 17.6);
      setDemoEs(demoMap['España'] || 6.7);
      setDemoMx(demoMap['México'] || 4.9);
      setDemoUy(demoMap['Uruguay'] || 3.3);
      setDemoOt(demoMap['Otros países'] || 35.5);
    }
  }, [activeMonth, isOpen]);

  if (!isOpen) return null;

  function handlePostChange(index, field, value) {
    const updated = [...postsList];
    updated[index][field] = value;
    setPostsList(updated);
  }

  function handleAddPost() {
    setPostsList([
      ...postsList,
      {
        id: postsList.length + 1,
        title: 'Nueva publicación',
        type: 'Reel',
        views: 0,
        reach: 0,
        avgTime: 0,
        newFollowers: 0
      }
    ]);
  }

  function handleRemovePost(index) {
    const updated = postsList.filter((_, i) => i !== index);
    setPostsList(updated);
  }

  function handleSave() {
    if (!monthId || !monthName) {
      alert('Por favor completa el ID y Nombre del mes.');
      return;
    }

    // Auto mark top converter
    let maxSeg = -1;
    postsList.forEach((p) => {
      p.isTopConverter = false;
      if (parseInt(p.newFollowers) > maxSeg) {
        maxSeg = parseInt(p.newFollowers);
      }
    });
    const top = postsList.find((p) => parseInt(p.newFollowers) === maxSeg);
    if (top) top.isTopConverter = true;

    const payload = {
      id: monthId,
      name: monthName,
      kpis: {
        totalViews: parseInt(totalViews) || 0,
        mainViews: parseInt(mainViews) || 0,
        netFollowers: parseInt(netFollowers) || 0,
        interactions: parseInt(interactions) || 0,
        reels: parseInt(reelsCount) || 0,
        dumps: parseInt(dumpsCount) || 0,
        stories: parseInt(storiesCount) || 0,
        nonFollowersReachPercent: parseFloat(nonFollowersPct) || 66,
        followersReachPercent: parseFloat(followersPct) || 34,
        mainFollowersPercent: 53.2,
        mainNonFollowersPercent: 46.8
      },
      posts: postsList.map((p) => ({
        ...p,
        views: parseInt(p.views) || 0,
        reach: parseInt(p.reach) || 0,
        avgTime: parseInt(p.avgTime) || 0,
        newFollowers: parseInt(p.newFollowers) || 0
      })),
      demographics: [
        { country: 'Argentina', flag: '🇦🇷', percentage: parseFloat(demoAr) || 0 },
        { country: 'Estados Unidos', flag: '🇺🇸', percentage: parseFloat(demoUs) || 0 },
        { country: 'España', flag: '🇪🇸', percentage: parseFloat(demoEs) || 0 },
        { country: 'México', flag: '🇲🇽', percentage: parseFloat(demoMx) || 0 },
        { country: 'Uruguay', flag: '🇺🇾', percentage: parseFloat(demoUy) || 0 },
        { country: 'Otros países', flag: '🌐', percentage: parseFloat(demoOt) || 0 }
      ],
      peakHours: activeMonth?.peakHours || { Mar: ['n1', 'n2'], Dom: ['n1'] },
      rawCsv: csvInput || activeMonth?.rawCsv || ''
    };

    onSaveMonth(payload);
  }

  return (
    <div className="modal-backdrop active">
      <div className="modal-content">
        <div className="modal-header">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#A78BFA' }}>
            <Settings style={{ width: 20 }} /> Panel del Configurador - Gestión de Meses y Valores
          </h3>
          <button className="modal-close" onClick={onClose}>
            &times;
          </button>
        </div>

        {/* ADMIN TABS */}
        <div className="admin-tab-nav">
          <button
            className={`admin-tab-btn ${activeTab === 'general' ? 'active' : ''}`}
            onClick={() => setActiveTab('general')}
          >
            1. Resumen y KPIs
          </button>
          <button
            className={`admin-tab-btn ${activeTab === 'posts' ? 'active' : ''}`}
            onClick={() => setActiveTab('posts')}
          >
            2. Publicaciones ({postsList.length})
          </button>
          <button
            className={`admin-tab-btn ${activeTab === 'demographics' ? 'active' : ''}`}
            onClick={() => setActiveTab('demographics')}
          >
            3. Demografía
          </button>
          <button
            className={`admin-tab-btn ${activeTab === 'import' ? 'active' : ''}`}
            onClick={() => setActiveTab('import')}
          >
            4. Importar CSV
          </button>
        </div>

        {/* TAB 1: GENERAL & KPIS */}
        {activeTab === 'general' && (
          <div>
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Nombre del Mes / Período</label>
                <input
                  type="text"
                  className="form-input"
                  value={monthName}
                  onChange={(e) => setMonthName(e.target.value)}
                  placeholder="Ej: Junio 2026"
                />
              </div>
              <div className="form-group">
                <label className="form-label">ID Único del Mes</label>
                <input
                  type="text"
                  className="form-input"
                  value={monthId}
                  onChange={(e) => setMonthId(e.target.value)}
                  placeholder="Ej: 2026-06"
                />
              </div>
            </div>

            <div className="form-grid-3">
              <div className="form-group">
                <label className="form-label">Visualizaciones Totales</label>
                <input
                  type="number"
                  className="form-input"
                  value={totalViews}
                  onChange={(e) => setTotalViews(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Visualizaciones (30 días)</label>
                <input
                  type="number"
                  className="form-input"
                  value={mainViews}
                  onChange={(e) => setMainViews(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Seguidores Netos Ganados</label>
                <input
                  type="number"
                  className="form-input"
                  value={netFollowers}
                  onChange={(e) => setNetFollowers(e.target.value)}
                />
              </div>
            </div>

            <div className="form-grid-3">
              <div className="form-group">
                <label className="form-label">Interacciones Totales</label>
                <input
                  type="number"
                  className="form-input"
                  value={interactions}
                  onChange={(e) => setInteractions(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Reels Publicados</label>
                <input
                  type="number"
                  className="form-input"
                  value={reelsCount}
                  onChange={(e) => setReelsCount(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Dumps Publicados</label>
                <input
                  type="number"
                  className="form-input"
                  value={dumpsCount}
                  onChange={(e) => setDumpsCount(e.target.value)}
                />
              </div>
            </div>

            <div className="form-grid-3">
              <div className="form-group">
                <label className="form-label">Historias Publicadas</label>
                <input
                  type="number"
                  className="form-input"
                  value={storiesCount}
                  onChange={(e) => setStoriesCount(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">% Alcance No Seguidores</label>
                <input
                  type="number"
                  step="0.1"
                  className="form-input"
                  value={nonFollowersPct}
                  onChange={(e) => setNonFollowersPct(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">% Alcance Seguidores</label>
                <input
                  type="number"
                  step="0.1"
                  className="form-input"
                  value={followersPct}
                  onChange={(e) => setFollowersPct(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: POSTS */}
        {activeTab === 'posts' && (
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '12px'
              }}
            >
              <h4 style={{ fontSize: '0.9rem' }}>Lista de Publicaciones Destacadas</h4>
              <button
                className="btn btn-admin"
                style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                onClick={handleAddPost}
              >
                <Plus style={{ width: 14 }} /> Agregar Fila
              </button>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                maxHeight: '350px',
                overflowY: 'auto'
              }}
            >
              {postsList.map((p, index) => (
                <div
                  key={index}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr 40px',
                    gap: '8px',
                    alignItems: 'center',
                    background: 'rgba(0,0,0,0.3)',
                    padding: '8px',
                    borderRadius: '8px'
                  }}
                >
                  <input
                    type="text"
                    className="form-input"
                    value={p.title}
                    onChange={(e) => handlePostChange(index, 'title', e.target.value)}
                    placeholder="Título"
                  />
                  <select
                    className="form-input"
                    value={p.type}
                    onChange={(e) => handlePostChange(index, 'type', e.target.value)}
                  >
                    <option value="Reel">Reel</option>
                    <option value="Dump">Dump</option>
                  </select>
                  <input
                    type="number"
                    className="form-input"
                    value={p.views}
                    onChange={(e) => handlePostChange(index, 'views', e.target.value)}
                    placeholder="Views"
                  />
                  <input
                    type="number"
                    className="form-input"
                    value={p.reach}
                    onChange={(e) => handlePostChange(index, 'reach', e.target.value)}
                    placeholder="Reach"
                  />
                  <input
                    type="number"
                    className="form-input"
                    value={p.avgTime}
                    onChange={(e) => handlePostChange(index, 'avgTime', e.target.value)}
                    placeholder="Tiempo (s)"
                  />
                  <input
                    type="number"
                    className="form-input"
                    value={p.newFollowers}
                    onChange={(e) => handlePostChange(index, 'newFollowers', e.target.value)}
                    placeholder="+Seguidores"
                  />
                  <button
                    className="btn btn-danger"
                    style={{ padding: '6px' }}
                    onClick={() => handleRemovePost(index)}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: DEMOGRAPHICS */}
        {activeTab === 'demographics' && (
          <div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
              Ingresa los porcentajes de audiencia por país (%):
            </p>
            <div className="form-grid-3">
              <div className="form-group">
                <label className="form-label">🇦🇷 Argentina (%)</label>
                <input
                  type="number"
                  step="0.1"
                  className="form-input"
                  value={demoAr}
                  onChange={(e) => setDemoAr(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">🇺🇸 Estados Unidos (%)</label>
                <input
                  type="number"
                  step="0.1"
                  className="form-input"
                  value={demoUs}
                  onChange={(e) => setDemoUs(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">🇪🇸 España (%)</label>
                <input
                  type="number"
                  step="0.1"
                  className="form-input"
                  value={demoEs}
                  onChange={(e) => setDemoEs(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">🇲🇽 México (%)</label>
                <input
                  type="number"
                  step="0.1"
                  className="form-input"
                  value={demoMx}
                  onChange={(e) => setDemoMx(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">🇺🇾 Uruguay (%)</label>
                <input
                  type="number"
                  step="0.1"
                  className="form-input"
                  value={demoUy}
                  onChange={(e) => setDemoUy(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">🌐 Otros países (%)</label>
                <input
                  type="number"
                  step="0.1"
                  className="form-input"
                  value={demoOt}
                  onChange={(e) => setDemoOt(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: IMPORT CSV */}
        {activeTab === 'import' && (
          <div>
            <label className="form-label">Pega el contenido CSV del nuevo mes aquí:</label>
            <textarea
              className="form-input"
              style={{ height: '180px', fontFamily: 'monospace', fontSize: '0.8rem' }}
              value={csvInput}
              onChange={(e) => setCsvInput(e.target.value)}
              placeholder="Pega aquí el contenido CSV..."
            ></textarea>
          </div>
        )}

        {/* FOOTER ACTIONS */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '24px',
            paddingTop: '16px',
            borderTop: '1px solid var(--border-card)'
          }}
        >
          <button className="btn btn-danger" onClick={() => onDeleteMonth(monthId)}>
            Eliminar Mes Actual
          </button>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn" onClick={onClose}>
              Cancelar
            </button>
            <button className="btn btn-admin" onClick={handleSave}>
              💾 Guardar Cambios en Node.js API
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
