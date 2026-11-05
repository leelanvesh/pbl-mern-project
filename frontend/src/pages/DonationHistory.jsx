import { useState, useEffect } from 'react';
import { getDonations } from '../services/donationService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';

const DonationHistory = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const res = await getDonations();
        setDonations(res.data || []);
      } catch (err) {
        setError('Failed to fetch donation records.');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const formatDate = (d) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) return <LoadingSpinner message="Loading your donation history..." />;

  const totalUnits = donations.reduce((sum, d) => sum + (d.unitsDonated || 1), 0);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">My Donation History</h1>
          <p className="page-subtitle">Track your contributions and future eligibility dates</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span className="badge badge-info" style={{ fontSize: '13px', padding: '6px 12px' }}>
            💉 Total Units Donated: {totalUnits}
          </span>
        </div>
      </div>

      <ErrorMessage message={error} onClose={() => setError('')} />

      {donations.length === 0 ? (
        <EmptyState
          icon="🩸"
          title="No Donations Recorded"
          message="You haven't made any recorded blood donations yet. Hospital and administrator entries will appear here."
        />
      ) : (
        <div className="card">
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Donation Date</th>
                  <th>Hospital / Facility</th>
                  <th>Units</th>
                  <th>Next Eligible Date</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((item, index) => (
                  <tr key={item._id}>
                    <td>{index + 1}</td>
                    <td style={{ fontWeight: 600 }}>{formatDate(item.donationDate)}</td>
                    <td>{item.hospitalName}</td>
                    <td>
                      <span className="badge badge-info">{item.unitsDonated} Unit</span>
                    </td>
                    <td>
                      <span style={{ color: 'var(--success)', fontWeight: 600 }}>
                        {formatDate(item.nextEligibleDate)}
                      </span>
                    </td>
                    <td style={{ color: 'var(--gray-600)', fontSize: '13px' }}>
                      {item.notes || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonationHistory;
