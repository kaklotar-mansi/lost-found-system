import { useState, useEffect } from 'react';
import api from '../api/axios';

const Dashboard = () => {
  const [stats, setStats] = useState({ totalLost: 0, totalFound: 0, resolved: 0, active: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/dashboard/stats');
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { label: 'Total Lost Items', value: stats.totalLost, icon: 'fa-circle-exclamation', color: 'card-red' },
    { label: 'Total Found Items', value: stats.totalFound, icon: 'fa-hand-holding', color: 'card-blue' },
    { label: 'Resolved / Claimed', value: stats.resolved, icon: 'fa-check-circle', color: 'card-green' },
    { label: 'Active Reports', value: stats.active, icon: 'fa-bolt', color: 'card-orange' },
  ];

  if (loading) return <p className="page-loading">Loading dashboard...</p>;

  return (
    <div className="page">
      <h1><i className="fa-solid fa-chart-simple"></i> Dashboard</h1>
      <div className="stats-grid">
        {cards.map((c) => (
          <div key={c.label} className={`stat-card ${c.color}`}>
            <i className={`fa-solid ${c.icon}`}></i>
            <div>
              <span className="stat-value">{c.value}</span>
              <span className="stat-label">{c.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
