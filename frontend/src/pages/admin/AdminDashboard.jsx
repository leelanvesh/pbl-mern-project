import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDashboard } from '../../services/adminService';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import Alert from '../../components/Alert';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await getDashboard();
        setData(res.data);
      } catch (err) {
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <Alert type="error" message={error} />;
  if (!data) return null;

  return (
    <div>
      <h2 className="mb-4">Admin Dashboard</h2>

      <div className="grid-4 mb-5">
        <StatCard title="Total Donors" value={data.totalDonors} icon="👥" color="var(--secondary)" />
        <StatCard title="Eligible Donors" value={data.eligibleDonors} icon="✅" color="var(--success)" />
        <StatCard title="Pending Verifications" value={data.pendingVerifications} icon="⏳" color="var(--warning)" />
        <StatCard title="Total Donations" value={data.totalDonations} icon="🩸" color="var(--primary)" />
      </div>

      <div className="grid-2 gap-4 mb-4">
        {/* Quick Actions */}
        <div className="card">
          <div className="card-header">
            <h3>Quick Actions</h3>
          </div>
          <div className="card-body d-flex flex-column gap-3">
            <Link to="/admin/donors" className="btn btn-primary text-center">Manage Donors</Link>
            <Link to="/admin/blood-availability" className="btn btn-outline text-center">View Blood Availability</Link>
            <Link to="/admin/reports" className="btn btn-outline text-center">View System Reports</Link>
          </div>
        </div>

        {/* Blood Group Distribution Quick View */}
        <div className="card">
          <div className="card-header">
            <h3>Blood Group Distribution</h3>
          </div>
          <div className="card-body">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', textAlign: 'center' }}>
              {data.bloodGroupDistribution.map(bg => (
                <div key={bg._id} style={{ padding: '0.5rem', background: 'var(--bg-light)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                  <div style={{ fontWeight: 'bold', color: 'var(--primary)', fontSize: '1.2rem' }}>{bg._id}</div>
                  <div className="text-light">{bg.count}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>Recent Donors</h3>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Blood Group</th>
                  <th>City</th>
                  <th>Status</th>
                  <th>Registered</th>
                </tr>
              </thead>
              <tbody>
                {data.recentDonors.map(donor => (
                  <tr key={donor._id}>
                    <td>{donor.donorName}</td>
                    <td><strong>{donor.bloodGroup}</strong></td>
                    <td>{donor.city}</td>
                    <td><StatusBadge status={donor.eligibilityStatus} /></td>
                    <td>{new Date(donor.createdAt).toLocaleDateString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-3 text-center" style={{ borderTop: '1px solid var(--border)' }}>
            <Link to="/admin/donors" style={{ fontWeight: '500' }}>View All Donors →</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
