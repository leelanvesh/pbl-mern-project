import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardStats } from '../services/dashboardService';
import { getDonors, verifyDonor, deleteDonor } from '../services/donorService';
import DashboardCard from '../components/DashboardCard';
import DonorTable from '../components/DonorTable';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import SuccessMessage from '../components/SuccessMessage';
import ConfirmDialog from '../components/ConfirmDialog';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentDonors, setRecentDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [deleteId, setDeleteId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [statsRes, donorsRes] = await Promise.all([
        getDashboardStats(),
        getDonors(),
      ]);

      setStats(statsRes.data);
      setRecentDonors((donorsRes.data || []).slice(0, 8));
    } catch (err) {
      setError('Failed to fetch dashboard metrics. Please check server connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleVerify = async (donorId) => {
    try {
      await verifyDonor(donorId);
      setSuccess('Donor successfully verified and status updated to Eligible!');
      loadData();
    } catch (err) {
      setError('Failed to verify donor.');
    }
  };

  const handleDeletePrompt = (id) => {
    setDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      if (deleteId) {
        await deleteDonor(deleteId);
        setSuccess('Donor record and associated records deleted.');
        setDeleteDialogOpen(false);
        setDeleteId(null);
        loadData();
      }
    } catch (err) {
      setError('Failed to delete donor record.');
    }
  };

  if (loading) return <LoadingSpinner message="Calculating dashboard statistics..." />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Admin Management Dashboard</h1>
          <p className="page-subtitle">Overview of donor registrations, blood units, and verification queues</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Link to="/admin/donors" className="btn btn-primary btn-sm">Manage All Donors</Link>
          <Link to="/admin/donations" className="btn btn-outline btn-sm">Record Donation</Link>
        </div>
      </div>

      <ErrorMessage message={error} onClose={() => setError('')} />
      <SuccessMessage message={success} onClose={() => setSuccess('')} />

      {/* Stats Cards */}
      <div className="stats-grid">
        <DashboardCard
          title="Total Donors"
          value={stats?.totalDonors ?? 0}
          icon="👥"
          color="primary"
          subtitle="Registered in Portal"
        />
        <DashboardCard
          title="Eligible Donors"
          value={stats?.eligibleDonors ?? 0}
          icon="✅"
          color="success"
          subtitle="Ready for Donation"
        />
        <DashboardCard
          title="Pending Verification"
          value={stats?.pendingDonors ?? 0}
          icon="⏳"
          color="warning"
          subtitle="Awaiting Approval"
        />
        <DashboardCard
          title="Total Donations"
          value={stats?.totalDonations ?? 0}
          icon="💉"
          color="info"
          subtitle="Completed Sessions"
        />
      </div>

      {/* Blood Group Availability Grid */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header">
          <h3 className="card-title">Blood Group Availability Breakdown</h3>
          <Link to="/admin/reports" style={{ fontSize: '13px', color: 'var(--primary)' }}>Detailed Report →</Link>
        </div>
        <div className="card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '12px' }}>
            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => {
              const found = stats?.bloodGroupStats?.find((item) => item._id === bg);
              const count = found ? found.count : 0;
              return (
                <div
                  key={bg}
                  style={{
                    padding: '14px',
                    textAlign: 'center',
                    background: 'var(--gray-50)',
                    borderRadius: '8px',
                    border: '1px solid var(--gray-200)',
                  }}
                >
                  <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--primary)' }}>{bg}</div>
                  <div style={{ fontSize: '16px', fontWeight: 700, marginTop: '4px', color: 'var(--gray-800)' }}>
                    {count}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--gray-500)', textTransform: 'uppercase' }}>
                    Donors
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Donors Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Recently Registered Donors</h3>
          <Link to="/admin/donors" style={{ fontSize: '13px', color: 'var(--primary)' }}>View All Donors →</Link>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <DonorTable
            donors={recentDonors}
            onVerify={handleVerify}
            onDelete={handleDeletePrompt}
            isAdmin={true}
          />
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        title="Delete Donor Record"
        message="Are you sure you want to delete this donor? All corresponding donation histories and the user account will be permanently removed."
        confirmText="Confirm Delete"
        confirmClass="btn-danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setDeleteId(null);
        }}
      />
    </div>
  );
};

export default AdminDashboard;
