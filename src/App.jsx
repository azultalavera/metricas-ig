import React, { useState, useEffect } from 'react';
import Header from './components/Header.jsx';
import KpiGrid from './components/KpiGrid.jsx';
import PerformanceChart from './components/PerformanceChart.jsx';
import DemographicsChart from './components/DemographicsChart.jsx';
import AudienceBreakdown from './components/AudienceBreakdown.jsx';
import HeatmapMatrix from './components/HeatmapMatrix.jsx';
import PostsTable from './components/PostsTable.jsx';
import InsightsGrid from './components/InsightsGrid.jsx';
import ImportCsvModal from './components/ImportCsvModal.jsx';
import RawCsvModal from './components/RawCsvModal.jsx';

import { initialMonthsData } from './data/initialData.js';

export default function App() {
  const [monthsStore, setMonthsStore] = useState(() => {
    try {
      const saved = localStorage.getItem('ig_analytics_store_v3');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading local storage state:', e);
    }
    return initialMonthsData;
  });

  const [activeMonthId, setActiveMonthId] = useState('2026-05');

  // Filter & Search states for posts
  const [postFilter, setPostFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state
  const [isImportCsvOpen, setIsImportCsvOpen] = useState(false);
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);

  // Sync state to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('ig_analytics_store_v3', JSON.stringify(monthsStore));
    } catch (e) {
      console.error('Error saving to local storage:', e);
    }
  }, [monthsStore]);

  // Attempt to fetch from Express / Vercel API
  useEffect(() => {
    fetchMonthsFromAPI();
  }, []);

  async function fetchMonthsFromAPI() {
    try {
      const res = await fetch('/api/months');
      if (res.ok) {
        const data = await res.json();
        if (data && Object.keys(data).length > 0) {
          setMonthsStore(data);
          const monthKeys = Object.keys(data);
          if (!data[activeMonthId]) {
            setActiveMonthId(monthKeys[0]);
          }
        }
      }
    } catch (err) {
      // Running on static host (Vercel static build without API) - using local database state
      console.log('API not reachable, using local embedded database.');
    }
  }

  async function handleImportCsvMonth(parsedMonthPayload) {
    const updatedStore = {
      ...monthsStore,
      [parsedMonthPayload.id]: parsedMonthPayload
    };

    setMonthsStore(updatedStore);
    setActiveMonthId(parsedMonthPayload.id);

    // Try posting to Node.js API if available
    try {
      await fetch('/api/months', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsedMonthPayload)
      });
    } catch (err) {
      // Local fallback handled by state + LocalStorage
    }
  }

  const monthsList = Object.values(monthsStore);
  const activeMonth = monthsStore[activeMonthId] || monthsList[0] || initialMonthsData['2026-05'];

  return (
    <div>
      <div className="dashboard-container">
        <Header
          monthsList={monthsList}
          activeMonthId={activeMonthId}
          onMonthChange={setActiveMonthId}
          onOpenImportCsv={() => setIsImportCsvOpen(true)}
          onOpenCsvModal={() => setIsCsvModalOpen(true)}
        />

        <KpiGrid kpis={activeMonth?.kpis} />

        <section className="charts-main-grid">
          <PerformanceChart
            posts={activeMonth?.posts}
            currentFilter={postFilter}
            onFilterChange={setPostFilter}
            searchTerm={searchTerm}
          />
          <DemographicsChart demographics={activeMonth?.demographics} />
        </section>

        <section className="secondary-grid">
          <AudienceBreakdown kpis={activeMonth?.kpis} />
          <HeatmapMatrix peakHours={activeMonth?.peakHours} />
        </section>

        <PostsTable
          posts={activeMonth?.posts}
          currentFilter={postFilter}
          onFilterChange={setPostFilter}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        <InsightsGrid monthData={activeMonth} />
      </div>

      {/* Hidden CSV Import Modal */}
      <ImportCsvModal
        isOpen={isImportCsvOpen}
        onClose={() => setIsImportCsvOpen(false)}
        onImportCsv={handleImportCsvMonth}
      />

      <RawCsvModal
        isOpen={isCsvModalOpen}
        onClose={() => setIsCsvModalOpen(false)}
        rawCsv={activeMonth?.rawCsv}
      />
    </div>
  );
}
