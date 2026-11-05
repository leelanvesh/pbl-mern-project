import React, { useState, useEffect } from 'react';
import { getReports } from '../../services/adminService';
import LoadingSpinner from '../../components/LoadingSpinner';
import Alert from '../../components/Alert';

const Reports = () => {
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await getReports();
        setReports(res.data);
      } catch (err) {
        setError('Failed to fetch reports.');
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <Alert type="error" message={error} />;
  if (!reports) return null;

  const totalDonors = reports.bloodGroupDistribution.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div>
      <div className="d-flex justify-between align-center mb-4">
        <h2>System Reports</h2>
        <button className="btn btn-outline" onClick={() => window.print()}>🖨️ Print Report</button>
      </div>
      <p className="text-light mb-4">Export hint: Use Ctrl+P to print this page.</p>

      <div className="grid-2">
        {/* Blood Group Distribution */}
        <div className="card">
          <div className="card-header">
            <h3>Blood Group Distribution</h3>
          </div>
          <div className="card-body">
            <table className="table">
              <thead>
                <tr>
                  <th>Blood Group</th>
                  <th>Count</th>
                  <th>Percentage</th>
                </tr>
              </thead>
              <tbody>
                {reports.bloodGroupDistribution.map(item => {
                  const percent = totalDonors > 0 ? ((item.count / totalDonors) * 100).toFixed(1) : 0;
                  return (
                    <tr key={item._id}>
                      <td><strong>{item._id}</strong></td>
                      <td>{item.count}</td>
                      <td style={{ width: '50%' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <span style={{ width: '40px' }}>{percent}%</span>
                          <div style={{ flex: 1, height: '8px', background: 'var(--bg-light)', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ width: `${percent}%`, height: '100%', background: 'var(--primary)' }}></div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Eligibility Breakdown */}
        <div className="card">
          <div className="card-header">
            <h3>Eligibility Breakdown</h3>
          </div>
          <div className="card-body">
            <table className="table">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Count</th>
                  <th>Visual</th>
                </tr>
              </thead>
              <tbody>
                {reports.eligibilityBreakdown.map(item => {
                  const percent = totalDonors > 0 ? ((item.count / totalDonors) * 100).toFixed(1) : 0;
                  let color = 'var(--secondary)';
                  if (item._id === 'Eligible') color = 'var(--success)';
                  if (item._id === 'Not Eligible') color = 'var(--danger)';
                  if (item._id === 'Pending Verification') color = 'var(--warning)';

                  return (
                    <tr key={item._id}>
                      <td>{item._id}</td>
                      <td>{item.count}</td>
                      <td style={{ width: '50%' }}>
                        <div style={{ height: '8px', background: 'var(--bg-light)', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ width: `${percent}%`, height: '100%', background: color }}></div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* City-wise Distribution */}
        <div className="card">
          <div className="card-header">
            <h3>Top Cities (Donors)</h3>
          </div>
          <div className="card-body">
            <table className="table">
              <thead>
                <tr>
                  <th>City</th>
                  <th>Total Donors</th>
                </tr>
              </thead>
              <tbody>
                {reports.cityDistribution.map((item, idx) => (
                  <tr key={item._id || idx}>
                    <td>{item._id || 'Unknown'}</td>
                    <td>{item.count}</td>
                  </tr>
                ))}
                {reports.cityDistribution.length === 0 && (
                  <tr><td colSpan="2" className="text-center text-light">No city data available</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Monthly Donations */}
        <div className="card">
          <div className="card-header">
            <h3>Monthly Donations</h3>
          </div>
          <div className="card-body">
            <table className="table">
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Total Donations</th>
                  <th>Total Units</th>
                </tr>
              </thead>
              <tbody>
                {reports.monthlyDonations && reports.monthlyDonations.length > 0 ? reports.monthlyDonations.map((item, idx) => {
                  const date = new Date();
                  date.setMonth(item._id.month - 1);
                  const monthName = date.toLocaleString('default', { month: 'short' });
                  return (
                    <tr key={idx}>
                      <td>{monthName} {item._id.year}</td>
                      <td>{item.count}</td>
                      <td>{item.totalUnits}</td>
                    </tr>
                  );
                }) : (
                  <tr><td colSpan="3" className="text-center text-light">No donation data available</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
