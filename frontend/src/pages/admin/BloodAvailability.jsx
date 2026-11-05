import React, { useState, useEffect } from 'react';
import { getBloodAvailability } from '../../services/adminService';
import StatCard from '../../components/StatCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import Alert from '../../components/Alert';

const BloodAvailability = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAvailability = async () => {
    setLoading(true);
    try {
      const res = await getBloodAvailability();
      // Ensure all 8 groups exist in display even if 0
      const standardGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
      const mappedData = standardGroups.map(bg => {
        const found = res.data.find(d => d._id === bg);
        return { group: bg, count: found ? found.count : 0 };
      });
      setData(mappedData);
    } catch (err) {
      setError('Failed to fetch blood availability.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailability();
  }, []);

  if (loading && data.length === 0) return <LoadingSpinner />;

  const totalDonors = data.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div>
      <div className="d-flex justify-between align-center mb-4">
        <div>
          <h2>Blood Availability</h2>
          <p className="text-light">Current verified and eligible donors across all cities.</p>
        </div>
        <button className="btn btn-outline" onClick={fetchAvailability}>↻ Refresh</button>
      </div>

      {error && <Alert type="error" message={error} />}

      <div className="card mb-5 bg-primary text-white" style={{ backgroundColor: 'var(--primary-dark)', color: '#fff' }}>
        <div className="card-body text-center py-4">
          <h3 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '0.5rem' }}>Total Ready Donors</h3>
          <div style={{ fontSize: '3rem', fontWeight: 'bold' }}>{totalDonors}</div>
        </div>
      </div>

      <div className="grid-4 gap-4">
        {data.map(({ group, count }) => {
          const isUniversal = group === 'O-' || group === 'O+';
          return (
            <div key={group} className="card text-center" style={{ border: isUniversal ? '2px solid var(--primary)' : '1px solid var(--border)' }}>
              <div className="card-body">
                <h3 style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>{group}</h3>
                <p className="text-medium mb-2">Eligible Donors</p>
                <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{count}</div>
                {isUniversal && <span className="badge badge-pending mt-2" style={{ backgroundColor: 'rgba(230,57,70,0.1)', color: 'var(--primary)' }}>High Demand</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BloodAvailability;
