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

export default function App() {
  const [monthsStore, setMonthsStore] = useState({});
  const [activeMonthId, setActiveMonthId] = useState('2026-05');

  // Filter & Search states for posts
  const [postFilter, setPostFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state
  const [isImportCsvOpen, setIsImportCsvOpen] = useState(false);
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);

  // Fetch months from Node.js Express API
  useEffect(() => {
    fetchMonths();
  }, []);

  async function fetchMonths() {
    try {
      const res = await fetch('/api/months');
      if (res.ok) {
        const data = await res.json();
        setMonthsStore(data);
        const monthKeys = Object.keys(data);
        if (monthKeys.length > 0 && !data[activeMonthId]) {
          setActiveMonthId(monthKeys[0]);
        }
      }
    } catch (err) {
      console.error('Error fetching months from API:', err);
    }
  }

  async function handleImportCsvMonth(parsedMonthPayload) {
    try {
      const res = await fetch('/api/months', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsedMonthPayload)
      });
      if (res.ok) {
        await fetchMonths();
        setActiveMonthId(parsedMonthPayload.id);
      }
    } catch (err) {
      console.error('Error importing CSV month:', err);
    }
  }

  const monthsList = Object.values(monthsStore);
  const activeMonth = monthsStore[activeMonthId] || monthsList[0] || {};

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

        <KpiGrid kpis={activeMonth.kpis} />

        <section className="charts-main-grid">
          <PerformanceChart
            posts={activeMonth.posts}
            currentFilter={postFilter}
            onFilterChange={setPostFilter}
            searchTerm={searchTerm}
          />
          <DemographicsChart demographics={activeMonth.demographics} />
        </section>

        <section className="secondary-grid">
          <AudienceBreakdown kpis={activeMonth.kpis} />
          <HeatmapMatrix peakHours={activeMonth.peakHours} />
        </section>

        <PostsTable
          posts={activeMonth.posts}
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
        rawCsv={activeMonth.rawCsv}
      />
    </div>
  );
}
