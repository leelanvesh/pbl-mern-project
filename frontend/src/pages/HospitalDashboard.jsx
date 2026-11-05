import { useState, useEffect } from 'react';
import { getDonors } from '../services/donorService';
import SearchBar from '../components/SearchBar';
import DonorCard from '../components/DonorCard';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import DashboardCard from '../components/DashboardCard';

const HospitalDashboard = () => {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [contactModalOpen, setContactModalOpen] = useState(false);

  const fetchDonorsList = async (filters = {}) => {
    try {
      setLoading(true);
      setError('');
      const res = await getDonors(filters);
      setDonors(res.data || []);
    } catch (err) {
      setError('Failed to fetch donors list. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonorsList();
  }, []);

  const handleSearch = (filters) => {
    fetchDonorsList(filters);
  };

  const handleReset = () => {
    fetchDonorsList({});
  };

  const handleOpenContact = (donor) => {
    setSelectedDonor(donor);
    setContactModalOpen(true);
  };

  const eligibleCount = donors.filter((d) => d.eligibilityStatus === 'Eligible').length;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Hospital Donor Search Portal</h1>
          <p className="page-subtitle">Locate, filter, and contact verified voluntary blood donors</p>
        </div>
      </div>

      <div className="stats-grid">
        <DashboardCard
          title="Matching Donors"
          value={donors.length}
          icon="👥"
          color="info"
          subtitle="In Current View"
        />
        <DashboardCard
          title="Eligible Donors"
          value={eligibleCount}
          icon="✅"
          color="success"
          subtitle="Ready to Donate"
        />
      </div>

      <SearchBar onSearch={handleSearch} onReset={handleReset} showEligibility={true} />

      <ErrorMessage message={error} onClose={() => setError('')} />

      {loading ? (
        <LoadingSpinner message="Searching registered donors..." />
      ) : donors.length === 0 ? (
        <EmptyState
          icon="🔍"
          title="No Donors Match Your Search"
          message="Try selecting a different blood group, checking spelling for the city, or clearing the status filter."
        />
      ) : (
        <div>
          <div style={{ marginBottom: '16px', fontSize: '14px', color: 'var(--gray-600)' }}>
            Showing <strong>{donors.length}</strong> registered donor(s):
          </div>

          {donors.map((donor) => (
            <DonorCard
              key={donor._id}
              donor={donor}
              onContact={handleOpenContact}
              showActions={true}
              isAdmin={false}
            />
          ))}
        </div>
      )}

      {/* Contact Donor Modal */}
      <Modal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        title="Donor Contact Details"
        footer={
          <button className="btn btn-primary btn-sm" onClick={() => setContactModalOpen(false)}>
            Close
          </button>
        }
      >
        {selectedDonor && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div className="blood-group-badge" style={{ width: '48px', height: '48px', fontSize: '16px' }}>
                {selectedDonor.bloodGroup}
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px' }}>{selectedDonor.donorName}</h3>
                <div style={{ color: 'var(--gray-600)', fontSize: '13px' }}>
                  {selectedDonor.city} • {selectedDonor.age} yrs • {selectedDonor.gender}
                </div>
              </div>
            </div>

            <div style={{ background: 'var(--gray-50)', padding: '16px', borderRadius: '8px', border: '1px solid var(--gray-200)', lineHeight: 1.8 }}>
              <div><strong>Status:</strong> <span className="badge badge-success">{selectedDonor.eligibilityStatus}</span></div>
              <div style={{ marginTop: '8px', fontSize: '16px' }}>
                <strong>Mobile Number:</strong>{' '}
                <a href={`tel:${selectedDonor.mobile}`} style={{ color: 'var(--primary)', fontWeight: 700 }}>
                  📞 {selectedDonor.mobile}
                </a>
              </div>
              {selectedDonor.lastDonationDate && (
                <div style={{ fontSize: '13px', color: 'var(--gray-600)', marginTop: '4px' }}>
                  Last Donation: {new Date(selectedDonor.lastDonationDate).toLocaleDateString()}
                </div>
              )}
            </div>

            <p style={{ fontSize: '12px', color: 'var(--gray-500)', marginTop: '14px' }}>
              Please verify identity and clinical eligibility protocols with the donor before proceeding with donation.
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default HospitalDashboard;
