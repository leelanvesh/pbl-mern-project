import React, { useEffect, useState } from 'react';
import { getDonorDonations } from '../../services/donationService';
import { getMyProfile } from '../../services/donorService';
import LoadingSpinner from '../../components/LoadingSpinner';
import Alert from '../../components/Alert';

const DonationHistory = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const profileRes = await getMyProfile();
        if (profileRes.data && profileRes.data._id) {
          const res = await getDonorDonations(profileRes.data._id);
          setDonations(res.data || []);
        }
      } catch (err) {
        setError('Failed to load donation history.');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <Alert type="error" message={error} />;

  return (
    <div>
      <h2 className="mb-4">Donation History</h2>

      <div className="card">
        <div className="card-body" style={{ padding: 0 }}>
          {donations.length === 0 ? (
            <div className="text-center py-5">
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🧾</div>
              <p className="text-medium">No donation records found. Your donations will appear here.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Donation Date</th>
                    <th>Hospital Name</th>
                    <th>Units Donated</th>
                    <th>Next Eligible Date</th>
                  </tr>
                </thead>
                <tbody>
                  {donations.map((d) => (
                    <tr key={d._id}>
                      <td>{new Date(d.donationDate).toLocaleDateString('en-IN')}</td>
                      <td>{d.hospitalName}</td>
                      <td>{d.unitsDonated}</td>
                      <td>{d.nextEligibleDate ? new Date(d.nextEligibleDate).toLocaleDateString('en-IN') : 'N/A'}</td>
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

export default DonationHistory;
