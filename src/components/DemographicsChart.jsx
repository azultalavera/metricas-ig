import React from 'react';
import { Globe, MapPin } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DemographicsChart({ demographics }) {
  const list = demographics || [];

  const chartData = {
    labels: list.map((d) => d.country),
    datasets: [
      {
        data: list.map((d) => d.percentage),
        backgroundColor: [
          '#E1306C',
          '#833AB4',
          '#F56040',
          '#06B6D4',
          '#10B981',
          'rgba(255, 255, 255, 0.2)'
        ],
        borderWidth: 2,
        borderColor: '#090C15'
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    cutout: '70%'
  };

  return (
    <div className="card">
      <div className="card-header-bar">
        <div className="card-title">
          <Globe style={{ width: 20 }} /> Público por País
        </div>
      </div>
      <div className="chart-wrapper" style={{ height: '220px' }}>
        <Doughnut data={chartData} options={chartOptions} />
      </div>

      <div className="demographics-list">
        {list.map((d, index) => (
          <div key={index} className="country-row">
            <div className="country-info">
              <MapPin style={{ width: 15, color: 'var(--ig-pink)' }} />
              <span>{d.country}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div className="progress-bar-bg">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${d.percentage * 2.5}%` }}
                ></div>
              </div>
              <span style={{ fontWeight: 700, width: '45px', textAlign: 'right' }}>
                {d.percentage}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
