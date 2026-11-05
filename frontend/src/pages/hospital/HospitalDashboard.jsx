import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getBloodAvailability } from '../../services/adminService';
import StatCard from '../../components/StatCard';
import LoadingSpinner from '../../components/LoadingSpinner';

const HospitalDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bloodGroup, setBloodGroup] = useState('');
  const [city, setCity] = useState('');
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getBloodAvailability();
        // reduce array to object
        const statsMap = res.data.reduce((acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {});
        setStats(statsMap);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (bloodGroup) params.append('bloodGroup', bloodGroup);
    if (city) params.append('city', city);
    navigate(`/hospital/search?${params.toString()}`);
  };

  return (
    <div>
      <div className="mb-4">
        <h2>Welcome, {user?.name}!</h2>
        <p className="text-light">Find eligible blood donors quickly in emergencies.</p>
      </div>

      <div className="card">
        <div className="card-header bg-primary text-white" style={{ backgroundColor: 'var(--primary)', color: '#fff' }}>
          <h3 style={{ color: '#fff', margin: 0 }}>Quick Emergency Search</h3>
        </div>
        <div className="card-body">
          <form onSubmit={handleSearch} className="grid-3 align-center gap-3">
            <div className="form-group mb-0">
              <select className="form-select" value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)}>
                <option value="">Any Blood Group</option>
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>
            <div className="form-group mb-0">
              <input type="text" className="form-input" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
            </div>
            <div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.6rem' }}>Search Donors</button>
            </div>
          </form>
        </div>
      </div>

      <h3 className="mt-5 mb-3">Available Eligible Donors</h3>
      {loading ? <LoadingSpinner /> : (
        <div className="grid-4">
          {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
            <StatCard 
              key={bg} 
              title={bg} 
              value={stats[bg] || 0} 
              icon="🩸" 
              color={bg.includes('O') ? 'var(--primary)' : 'var(--secondary)'} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HospitalDashboard;
