import { useState, useEffect } from 'react';
import {
  getDonors,
  createDonor,
  updateDonor,
  deleteDonor,
  verifyDonor
} from '../services/donorService';
import DonorTable from '../components/DonorTable';
import SearchBar from '../components/SearchBar';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import SuccessMessage from '../components/SuccessMessage';
import EmptyState from '../components/EmptyState';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const ManageDonors = () => {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Add / Edit Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentDonorId, setCurrentDonorId] = useState(null);

  const [formData, setFormData] = useState({
    donorName: '',
    email: '',
    password: '',
    bloodGroup: 'A+',
    age: '',
    gender: 'Male',
    mobile: '',
    city: '',
    eligibilityStatus: 'Eligible',
  });

  // Delete Confirm State
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const loadDonors = async (filters = {}) => {
    try {
      setLoading(true);
      setError('');
      const res = await getDonors(filters);
      setDonors(res.data || []);
    } catch (err) {
      setError('Failed to fetch donors list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDonors();
  }, []);

  const handleSearch = (filters) => {
    loadDonors(filters);
  };

  const handleReset = () => {
    loadDonors();
  };

  const handleOpenAddModal = () => {
    setIsEditing(false);
    setCurrentDonorId(null);
    setFormData({
      donorName: '',
      email: '',
      password: '',
      bloodGroup: 'A+',
      age: '',
      gender: 'Male',
      mobile: '',
      city: '',
      eligibilityStatus: 'Eligible',
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (donor) => {
    setIsEditing(true);
    setCurrentDonorId(donor._id);
    setFormData({
      donorName: donor.donorName,
      email: '',
      password: '',
      bloodGroup: donor.bloodGroup,
      age: donor.age,
      gender: donor.gender,
      mobile: donor.mobile,
      city: donor.city,
      eligibilityStatus: donor.eligibilityStatus,
    });
    setModalOpen(true);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const ageNum = parseInt(formData.age, 10);
    if (isNaN(ageNum) || ageNum < 18 || ageNum > 65) {
      setError('Age must be between 18 and 65');
      return;
    }

    try {
      if (isEditing) {
        await updateDonor(currentDonorId, {
          donorName: formData.donorName,
          bloodGroup: formData.bloodGroup,
          age: ageNum,
          gender: formData.gender,
          mobile: formData.mobile,
          city: formData.city,
          eligibilityStatus: formData.eligibilityStatus,
        });
        setSuccess('Donor updated successfully!');
      } else {
        await createDonor({
          ...formData,
          age: ageNum,
        });
        setSuccess('New donor and user account created successfully!');
      }

      setModalOpen(false);
      loadDonors();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed.');
    }
  };

  const handleVerify = async (id) => {
    try {
      await verifyDonor(id);
      setSuccess('Donor verified and set to Eligible!');
      loadDonors();
    } catch (err) {
      setError('Failed to verify donor.');
    }
  };

  const handleDeletePrompt = (id) => {
    setDeleteTargetId(id);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      if (deleteTargetId) {
        await deleteDonor(deleteTargetId);
        setSuccess('Donor removed successfully.');
        setDeleteConfirmOpen(false);
        setDeleteTargetId(null);
        loadDonors();
      }
    } catch (err) {
      setError('Failed to delete donor.');
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Manage Donors</h1>
          <p className="page-subtitle">Add, verify, modify, or remove voluntary donor profiles</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenAddModal}>
          ➕ Add New Donor
        </button>
      </div>

      <SearchBar onSearch={handleSearch} onReset={handleReset} showEligibility={true} />

      <ErrorMessage message={error} onClose={() => setError('')} />
      <SuccessMessage message={success} onClose={() => setSuccess('')} />

      {loading ? (
        <LoadingSpinner message="Loading donor directory..." />
      ) : donors.length === 0 ? (
        <EmptyState
          icon="👥"
          title="No Donors Found"
          message="No donor records match the search filter or none have been added yet."
          action={
            <button className="btn btn-primary btn-sm" onClick={handleOpenAddModal}>
              Add First Donor
            </button>
          }
        />
      ) : (
        <div className="card">
          <DonorTable
            donors={donors}
            onEdit={handleOpenEditModal}
            onDelete={handleDeletePrompt}
            onVerify={handleVerify}
            isAdmin={true}
          />
        </div>
      )}

      {/* Add / Edit Donor Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={isEditing ? 'Edit Donor Record' : 'Register New Donor'}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              name="donorName"
              value={formData.donorName}
              onChange={handleChange}
              required
              className="form-control"
            />
          </div>

          {!isEditing && (
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Email (Login ID) *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="donor@example.com"
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Initial Password *</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Min 6 characters"
                  className="form-control"
                />
              </div>
            </div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Blood Group *</label>
              <select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                className="form-control"
              >
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Age (18-65) *</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                required
                min="18"
                max="65"
                className="form-control"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Gender *</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="form-control"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Mobile Number *</label>
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                required
                className="form-control"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">City *</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Eligibility Status</label>
              <select
                name="eligibilityStatus"
                value={formData.eligibilityStatus}
                onChange={handleChange}
                className="form-control"
              >
                <option value="Eligible">Eligible</option>
                <option value="Pending">Pending</option>
                <option value="Not Eligible">Not Eligible</option>
              </select>
            </div>
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
              {isEditing ? 'Update Donor' : 'Create Donor'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Confirm Delete Modal */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        title="Delete Donor"
        message="Permanently remove this donor profile and user account from MongoDB Atlas?"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteConfirmOpen(false);
          setDeleteTargetId(null);
        }}
      />
    </div>
  );
};

export default ManageDonors;
