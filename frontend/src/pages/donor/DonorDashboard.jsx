import React, { useEffect, useState } from 'react';
import { getMyProfile } from '../../services/donorService';
import { getDonorDonations } from '../../services/donationService';
import { useAuth } from '../../hooks/useAuth';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import Alert from '../../components/Alert';
import { Link } from 'react-router-dom';

const DonorDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileRes = await getMyProfile();
        setProfile(profileRes.data);
        
        if (profileRes.data && profileRes.data._id) {
           const donationsRes = await getDonorDonations(profileRes.data._id);
           setDonations(donationsRes.data || []);
        }
      } catch (err) {
        setError('Failed to load dashboard data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner text="Loading Dashboard..." />;
  if (error) return <Alert type="error" message={error} />;
  if (!profile) return <Alert type="warning" message="Profile not found. Please complete your registration." />;

  const lastDonation = donations.length > 0 ? donations[0] : null;

  return (
    <div>
      <div className="mb-4">
        <h2>Welcome back, {profile.donorName}!</h2>
        <p className="text-light">Here is your donation summary.</p>
      </div>

      <div className="grid-4 mb-5">
        <StatCard title="Total Donations" value={donations.length} icon="🩸" />
        <StatCard title="Blood Group" value={profile.bloodGroup} icon="🧬" color="var(--secondary)" />
        <div className="stat-card" style={{ borderLeftColor: 'var(--success)', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center' }}>
          <p className="text-light mb-1">Status</p>
          <StatusBadge status={profile.eligibilityStatus} />
        </div>
        <StatCard title="Next Eligible" value={lastDonation?.nextEligibleDate ? new Date(lastDonation.nextEligibleDate).toLocaleDateString('en-IN') : 'Now'} icon="📅" color="var(--warning)" />
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <h3>Quick Actions</h3>
          </div>
          <div className="card-body d-flex flex-column gap-3">
            <Link to="/donor/profile" className="btn btn-outline" style={{ display: 'block', textAlign: 'center' }}>View & Update Profile</Link>
            <Link to="/donor/history" className="btn btn-outline" style={{ display: 'block', textAlign: 'center' }}>View Donation History</Link>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Recent Donation</h3>
          </div>
          <div className="card-body">
            {lastDonation ? (
              <div>
                <p><strong>Date:</strong> {new Date(lastDonation.donationDate).toLocaleDateString('en-IN')}</p>
                <p className="mt-2"><strong>Hospital:</strong> {lastDonation.hospitalName}</p>
                <p className="mt-2"><strong>Units Donated:</strong> {lastDonation.unitsDonated}</p>
              </div>
            ) : (
              <p className="text-light text-center py-5">No recent donations found. Save a life today!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonorDashboard;
