import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getDonorByUserId } from '../services/donorService';
import { getDonations } from '../services/donationService';
import DashboardCard from '../components/DashboardCard';
import EligibilityBadge from '../components/EligibilityBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const DonorDashboard = () => {
  const { user } = useAuth();
  const [donorProfile, setDonorProfile] = useState(null);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDonorData = async () => {
      try {
        setLoading(true);
        if (user?._id) {
          const profileRes = await getDonorByUserId(user._id);
          setDonorProfile(profileRes.data);

          const donationsRes = await getDonations();
          setDonations(donationsRes.data || []);
        }
      } catch (err) {
        setError('Failed to fetch donor data. Please refresh or check connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchDonorData();
  }, [user]);

  if (loading) return <LoadingSpinner message="Loading donor details..." />;

  const totalDonations = donations.length;
  const lastDonation = donations.length > 0 ? donations[0] : null;

  const formatDate = (d) => {
    if (!d) return 'None recorded';
    return new Date(d).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Welcome back, {donorProfile?.donorName || user?.name}!</h1>
          <p className="page-subtitle">Track your eligibility status and donation history</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Link to="/donor/profile" className="btn btn-primary btn-sm">Edit Profile</Link>
          <Link to="/donor/history" className="btn btn-outline btn-sm">View History</Link>
        </div>
      </div>

      <ErrorMessage message={error} onClose={() => setError('')} />

      {/* Overview Cards */}
      <div className="stats-grid">
        <DashboardCard
          title="Blood Group"
          value={donorProfile?.bloodGroup || '—'}
          icon="🩸"
          color="danger"
          subtitle="Registered Group"
        />
        <DashboardCard
          title="Eligibility"
          value={donorProfile?.eligibilityStatus || 'Pending'}
          icon={donorProfile?.eligibilityStatus === 'Eligible' ? '✅' : '⏳'}
          color={donorProfile?.eligibilityStatus === 'Eligible' ? 'success' : 'warning'}
          subtitle={donorProfile?.isVerified ? 'Profile Verified' : 'Pending Verification'}
        />
        <DashboardCard
          title="Donations"
          value={totalDonations}
          icon="💉"
          color="info"
          subtitle="Recorded Units"
        />
        <DashboardCard
          title="Next Eligible"
          value={donorProfile?.nextEligibleDate ? formatDate(donorProfile.nextEligibleDate) : 'Now Eligible'}
          icon="📅"
          color="primary"
          subtitle="Next Safe Date"
        />
      </div>

      {/* Main Info Columns */}
      <div className="two-col">
        {/* Eligibility Details */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Eligibility Status Information</h3>
            <EligibilityBadge status={donorProfile?.eligibilityStatus} />
          </div>
          <div className="card-body">
            {donorProfile?.eligibilityStatus === 'Eligible' ? (
              <div className="alert alert-success">
                <span>✅ You are currently active and eligible to donate whole blood! Hospitals may contact you in case of emergencies.</span>
              </div>
            ) : donorProfile?.eligibilityStatus === 'Pending' ? (
              <div className="alert alert-warning">
                <span>⏳ Your profile is under verification by system administrators. You will be marked eligible shortly.</span>
              </div>
            ) : (
              <div className="alert alert-danger">
                <span>🚫 You have donated recently or are temporarily ineligible. Safe recovery period is active.</span>
              </div>
            )}

            <div style={{ marginTop: '16px', fontSize: '14px', lineHeight: '2' }}>
              <div><strong>City:</strong> {donorProfile?.city}</div>
              <div><strong>Registered Mobile:</strong> {donorProfile?.mobile}</div>
              <div><strong>Age / Gender:</strong> {donorProfile?.age} yrs / {donorProfile?.gender}</div>
              <div><strong>Last Donation Date:</strong> {formatDate(donorProfile?.lastDonationDate)}</div>
              <div><strong>Next Eligible Date:</strong> {formatDate(donorProfile?.nextEligibleDate)}</div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Recent Donations</h3>
            <Link to="/donor/history" style={{ fontSize: '13px', color: 'var(--primary)' }}>View All →</Link>
          </div>
          <div className="card-body">
            {donations.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--gray-500)' }}>
                <p>No donation records found yet.</p>
                <p style={{ fontSize: '12px', marginTop: '4px' }}>Donations recorded by administrators will appear here.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {donations.slice(0, 3).map((item) => (
                  <div
                    key={item._id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '10px 12px',
                      background: 'var(--gray-50)',
                      borderRadius: '6px',
                      border: '1px solid var(--gray-200)'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600 }}>{item.hospitalName}</div>
                      <div style={{ fontSize: '12px', color: 'var(--gray-500)' }}>{formatDate(item.donationDate)}</div>
                    </div>
                    <span className="badge badge-info">{item.unitsDonated} Unit(s)</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonorDashboard;
