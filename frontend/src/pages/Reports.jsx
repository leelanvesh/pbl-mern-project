import { useState, useEffect } from 'react';
import { getBloodGroupReport, getDashboardStats } from '../services/dashboardService';
import DashboardCard from '../components/DashboardCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const Reports = () => {
  const [reportData, setReportData] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        setError('');
        const [repRes, statsRes] = await Promise.all([
          getBloodGroupReport(),
          getDashboardStats(),
        ]);
        setReportData(repRes.data);
        setStats(statsRes.data);
      } catch (err) {
        setError('Failed to generate reports from database.');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) return <LoadingSpinner message="Aggregating database statistics and blood groups..." />;

  const bloodGroups = reportData?.bloodGroupStats || [];
  const hospitalStats = reportData?.donationsByHospital || [];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Blood Availability & Analytics Reports</h1>
          <p className="page-subtitle">Aggregated metrics on blood types, donor eligibility, and facility activities</p>
        </div>
      </div>

      <ErrorMessage message={error} onClose={() => setError('')} />

      {/* Summary KPI Cards */}
      <div className="stats-grid">
        <DashboardCard
          title="Total Registered"
          value={stats?.totalDonors || 0}
          icon="👥"
          color="primary"
          subtitle="All Donors"
        />
        <DashboardCard
          title="Eligible Pool"
          value={stats?.eligibleDonors || 0}
          icon="✅"
          color="success"
          subtitle="Available Now"
        />
        <DashboardCard
          title="Pending Review"
          value={stats?.pendingDonors || 0}
          icon="⏳"
          color="warning"
          subtitle="Under Verification"
        />
        <DashboardCard
          title="Units Collected"
          value={stats?.totalDonations || 0}
          icon="🩸"
          color="danger"
          subtitle="Total Donations"
        />
      </div>

      {/* Blood Group Availability Detailed Table */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header">
          <h3 className="card-title">Blood Group Availability & Status Breakdown</h3>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Blood Group</th>
                  <th>Total Registered</th>
                  <th>Eligible Donors</th>
                  <th>Pending Review</th>
                  <th>Not Eligible (Cooldown)</th>
                  <th>Availability Bar</th>
                </tr>
              </thead>
              <tbody>
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => {
                  const entry = bloodGroups.find((g) => g._id === bg) || {
                    total: 0,
                    eligible: 0,
                    pending: 0,
                    notEligible: 0,
                  };
                  const maxDonors = Math.max(...bloodGroups.map((g) => g.total), 1);
                  const percentage = Math.round((entry.total / maxDonors) * 100);

                  return (
                    <tr key={bg}>
                      <td>
                        <span className="blood-group-badge" style={{ width: '32px', height: '32px', fontSize: '11px' }}>
                          {bg}
                        </span>
                      </td>
                      <td style={{ fontWeight: 700 }}>{entry.total}</td>
                      <td>
                        <span className="badge badge-success">{entry.eligible}</span>
                      </td>
                      <td>
                        <span className="badge badge-warning">{entry.pending}</span>
                      </td>
                      <td>
                        <span className="badge badge-danger">{entry.notEligible}</span>
                      </td>
                      <td style={{ width: '30%' }}>
                        <div style={{
                          background: 'var(--gray-200)',
                          height: '8px',
                          borderRadius: '4px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            width: `${percentage}%`,
                            background: 'var(--primary)',
                            height: '100%',
                            transition: 'width 0.4s ease'
                          }} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Donations by Hospital Summary */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Top Healthcare Facilities & Donations Received</h3>
        </div>
        <div className="card-body">
          {hospitalStats.length === 0 ? (
            <p style={{ color: 'var(--gray-500)', textAlign: 'center', padding: '20px 0' }}>
              No hospital donation sessions have been logged yet.
            </p>
          ) : (
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Hospital / Facility Name</th>
                    <th>Sessions Completed</th>
                    <th>Total Units Donated</th>
                  </tr>
                </thead>
                <tbody>
                  {hospitalStats.map((h) => (
                    <tr key={h._id}>
                      <td style={{ fontWeight: 600 }}>🏥 {h._id}</td>
                      <td>{h.totalDonations}</td>
                      <td>
                        <span className="badge badge-info">{h.totalUnits} Units</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
