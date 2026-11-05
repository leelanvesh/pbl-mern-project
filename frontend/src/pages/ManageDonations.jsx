import { useState, useEffect } from 'react';
import {
  getDonations,
  createDonation,
  updateDonation,
  deleteDonation,
} from '../services/donationService';
import { getDonors } from '../services/donorService';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import SuccessMessage from '../components/SuccessMessage';
import EmptyState from '../components/EmptyState';

const ManageDonations = () => {
  const [donations, setDonations] = useState([]);
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentDonationId, setCurrentDonationId] = useState(null);

  const [formData, setFormData] = useState({
    donorId: '',
    donationDate: new Date().toISOString().split('T')[0],
    hospitalName: '',
    unitsDonated: 1,
    notes: '',
  });

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [donationsRes, donorsRes] = await Promise.all([
        getDonations(),
        getDonors(),
      ]);

      setDonations(donationsRes.data || []);
      setDonors(donorsRes.data || []);
    } catch (err) {
      setError('Failed to fetch donations data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAddModal = () => {
    setIsEditing(false);
    setCurrentDonationId(null);
    setFormData({
      donorId: donors.length > 0 ? donors[0]._id : '',
      donationDate: new Date().toISOString().split('T')[0],
      hospitalName: '',
      unitsDonated: 1,
      notes: '',
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (donation) => {
    setIsEditing(true);
    setCurrentDonationId(donation._id);
    setFormData({
      donorId: donation.donorId?._id || donation.donorId,
      donationDate: donation.donationDate ? donation.donationDate.split('T')[0] : '',
      hospitalName: donation.hospitalName,
      unitsDonated: donation.unitsDonated || 1,
      notes: donation.notes || '',
    });
    setModalOpen(true);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (isEditing) {
        await updateDonation(currentDonationId, formData);
        setSuccess('Donation record updated successfully!');
      } else {
        await createDonation(formData);
        setSuccess('Donation recorded! Donor availability cooling period automatically calculated.');
      }

      setModalOpen(false);
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed.');
    }
  };

  const handleDeletePrompt = (id) => {
    setDeleteTargetId(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      if (deleteTargetId) {
        await deleteDonation(deleteTargetId);
        setSuccess('Donation record removed.');
        setDeleteDialogOpen(false);
        setDeleteTargetId(null);
        loadData();
      }
    } catch (err) {
      setError('Failed to delete donation.');
    }
  };

  const formatDate = (d) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString();
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Manage Donations</h1>
          <p className="page-subtitle">Record donations, calculate cooling windows, and update hospital supplies</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenAddModal} disabled={donors.length === 0}>
          💉 Record Donation
        </button>
      </div>

      <ErrorMessage message={error} onClose={() => setError('')} />
      <SuccessMessage message={success} onClose={() => setSuccess('')} />

      {loading ? (
        <LoadingSpinner message="Loading donation records..." />
      ) : donations.length === 0 ? (
        <EmptyState
          icon="💉"
          title="No Donations Recorded Yet"
          message="Record a blood donation to update donor history and calculate next safe donation eligibility."
          action={
            <button className="btn btn-primary btn-sm" onClick={handleOpenAddModal}>
              Record First Donation
            </button>
          }
        />
      ) : (
        <div className="card">
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Donor</th>
                  <th>Blood Group</th>
                  <th>Hospital</th>
                  <th>Units</th>
                  <th>Date</th>
                  <th>Next Eligible Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((d) => (
                  <tr key={d._id}>
                    <td style={{ fontWeight: 600 }}>{d.donorId?.donorName || 'Unknown Donor'}</td>
                    <td>
                      <span className="blood-group-badge" style={{ width: '32px', height: '32px', fontSize: '11px' }}>
                        {d.donorId?.bloodGroup || '—'}
                      </span>
                    </td>
                    <td>{d.hospitalName}</td>
                    <td>
                      <span className="badge badge-info">{d.unitsDonated} Unit(s)</span>
                    </td>
                    <td>{formatDate(d.donationDate)}</td>
                    <td style={{ color: 'var(--success)', fontWeight: 600 }}>
                      {formatDate(d.nextEligibleDate)}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => handleOpenEditModal(d)}
                        >
                          ✏️
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeletePrompt(d._id)}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Donation Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={isEditing ? 'Edit Donation Record' : 'Record New Blood Donation'}
      >
        <form onSubmit={handleSubmit}>
          {!isEditing && (
            <div className="form-group">
              <label className="form-label">Select Donor *</label>
              <select
                name="donorId"
                value={formData.donorId}
                onChange={handleChange}
                required
                className="form-control"
              >
                {donors.map((donor) => (
                  <option key={donor._id} value={donor._id}>
                    {donor.donorName} ({donor.bloodGroup}) — {donor.city} [{donor.eligibilityStatus}]
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Hospital / Blood Bank Center *</label>
            <input
              type="text"
              name="hospitalName"
              value={formData.hospitalName}
              onChange={handleChange}
              required
              placeholder="e.g. Apollo Hospital Blood Bank"
              className="form-control"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Donation Date *</label>
              <input
                type="date"
                name="donationDate"
                value={formData.donationDate}
                onChange={handleChange}
                required
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Units Donated (1-4) *</label>
              <input
                type="number"
                name="unitsDonated"
                value={formData.unitsDonated}
                onChange={handleChange}
                required
                min="1"
                max="4"
                className="form-control"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Clinical / Session Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="2"
              placeholder="Optional observations or post-donation vitals..."
              className="form-control"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '20px' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-sm">
              {isEditing ? 'Update Record' : 'Record & Cool Down Donor'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        title="Delete Donation Record"
        message="Are you sure? Removing this donation will recalibrate the donor's next eligibility date automatically."
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setDeleteTargetId(null);
        }}
      />
    </div>
  );
};

export default ManageDonations;
