import React, { useState, useEffect } from 'react';
import { getDonors, deleteDonor, verifyDonor, updateDonor, createDonor } from '../../services/donorService';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import Alert from '../../components/Alert';
import Modal from '../../components/Modal';

const ManageDonors = () => {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filters
  const [filters, setFilters] = useState({ bloodGroup: '', city: '', eligibilityStatus: '' });
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add', 'edit', 'view'
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchDonors();
  }, []);

  const fetchDonors = async () => {
    setLoading(true);
    try {
      // Clean filters
      const params = {};
      if (filters.bloodGroup) params.bloodGroup = filters.bloodGroup;
      if (filters.city) params.city = filters.city;
      if (filters.eligibilityStatus) params.eligibilityStatus = filters.eligibilityStatus;
      
      const res = await getDonors(params);
      setDonors(res.data);
    } catch (err) {
      setError('Failed to fetch donors.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });
  const applyFilters = (e) => { e.preventDefault(); fetchDonors(); };
  const resetFilters = () => {
    setFilters({ bloodGroup: '', city: '', eligibilityStatus: '' });
    // setTimeout to allow state to update before fetching
    setTimeout(fetchDonors, 0);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this donor? This cannot be undone.')) {
      try {
        await deleteDonor(id);
        setDonors(donors.filter(d => d._id !== id));
      } catch (err) {
        alert('Failed to delete donor.');
      }
    }
  };

  const handleVerify = async (id) => {
    if (window.confirm('Mark this donor as Eligible?')) {
      try {
        await verifyDonor(id);
        setDonors(donors.map(d => d._id === id ? { ...d, eligibilityStatus: 'Eligible' } : d));
      } catch (err) {
        alert('Failed to verify donor.');
      }
    }
  };

  const openModal = (mode, donor = null) => {
    setModalMode(mode);
    setSelectedDonor(donor);
    if (donor) {
      setFormData({
        donorName: donor.donorName,
        bloodGroup: donor.bloodGroup,
        age: donor.age,
        gender: donor.gender,
        mobile: donor.mobile,
        city: donor.city,
        eligibilityStatus: donor.eligibilityStatus
      });
    } else {
      setFormData({
        donorName: '', email: '', password: '', // for Add only
        bloodGroup: '', age: '', gender: '', mobile: '', city: '',
        eligibilityStatus: 'Pending Verification'
      });
    }
    setIsModalOpen(true);
  };

  const handleFormChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalMode === 'add') {
        const payload = { ...formData };
        await createDonor(payload); // Assuming admin route exists or handled in donor routes
        fetchDonors();
      } else if (modalMode === 'edit') {
        await updateDonor(selectedDonor._id, formData);
        setDonors(donors.map(d => d._id === selectedDonor._id ? { ...d, ...formData } : d));
      }
      setIsModalOpen(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed.');
    }
  };

  return (
    <div>
      <div className="d-flex justify-between align-center mb-4">
        <h2>Manage Donors</h2>
        <button className="btn btn-primary" onClick={() => openModal('add')}>+ Add New Donor</button>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <form onSubmit={applyFilters} className="grid-4 align-center gap-3">
            <select name="bloodGroup" className="form-select" value={filters.bloodGroup} onChange={handleFilterChange}>
              <option value="">All Blood Groups</option>
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
            </select>
            <input type="text" name="city" className="form-input" placeholder="City" value={filters.city} onChange={handleFilterChange} />
            <select name="eligibilityStatus" className="form-select" value={filters.eligibilityStatus} onChange={handleFilterChange}>
              <option value="">All Statuses</option>
              <option value="Eligible">Eligible</option>
              <option value="Pending Verification">Pending</option>
              <option value="Not Eligible">Not Eligible</option>
            </select>
            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-secondary" style={{ flex: 1 }}>Filter</button>
              <button type="button" className="btn btn-outline" onClick={resetFilters}>Reset</button>
            </div>
          </form>
        </div>
      </div>

      {error && <Alert type="error" message={error} />}

      <div className="card">
        <div className="card-body" style={{ padding: 0 }}>
          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Blood Group</th>
                    <th>Age/Gender</th>
                    <th>City</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {donors.map(donor => (
                    <tr key={donor._id}>
                      <td>{donor.donorName}</td>
                      <td><span className="badge" style={{ background: 'var(--primary)', color: '#fff' }}>{donor.bloodGroup}</span></td>
                      <td>{donor.age} / {donor.gender}</td>
                      <td>{donor.city}</td>
                      <td><StatusBadge status={donor.eligibilityStatus} /></td>
                      <td>
                        <div className="d-flex gap-2">
                          <button className="btn btn-sm btn-outline" onClick={() => openModal('view', donor)}>View</button>
                          <button className="btn btn-sm btn-secondary" onClick={() => openModal('edit', donor)}>Edit</button>
                          {donor.eligibilityStatus !== 'Eligible' && (
                            <button className="btn btn-sm btn-primary" onClick={() => handleVerify(donor._id)}>Verify</button>
                          )}
                          <button className="btn btn-sm btn-danger" onClick={() => handleDelete(donor._id)}>Del</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {donors.length === 0 && <p className="text-center py-4 text-light">No donors found matching criteria.</p>}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalMode === 'add' ? 'Add Donor' : modalMode === 'edit' ? 'Edit Donor' : 'Donor Details'}>
        {modalMode === 'view' && selectedDonor ? (
          <div>
            <p className="mb-2"><strong>Name:</strong> {selectedDonor.donorName}</p>
            <p className="mb-2"><strong>Blood Group:</strong> {selectedDonor.bloodGroup}</p>
            <p className="mb-2"><strong>Age/Gender:</strong> {selectedDonor.age} / {selectedDonor.gender}</p>
            <p className="mb-2"><strong>Mobile:</strong> {selectedDonor.mobile}</p>
            <p className="mb-2"><strong>City:</strong> {selectedDonor.city}</p>
            <p className="mb-2"><strong>Status:</strong> <StatusBadge status={selectedDonor.eligibilityStatus} /></p>
            <div className="mt-4 text-right">
              <button className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Close</button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleFormSubmit}>
            {modalMode === 'add' && (
              <>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input type="email" name="email" className="form-input" value={formData.email || ''} onChange={handleFormChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input type="password" name="password" className="form-input" value={formData.password || ''} onChange={handleFormChange} required minLength="6" />
                </div>
              </>
            )}
            
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" name="donorName" className="form-input" value={formData.donorName || ''} onChange={handleFormChange} required />
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Blood Group</label>
                <select name="bloodGroup" className="form-select" value={formData.bloodGroup || ''} onChange={handleFormChange} required>
                  <option value="">Select...</option>
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Gender</label>
                <select name="gender" className="form-select" value={formData.gender || ''} onChange={handleFormChange} required>
                  <option value="">Select...</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Age</label>
                <input type="number" name="age" className="form-input" value={formData.age || ''} onChange={handleFormChange} required min="18" max="65" />
              </div>
              <div className="form-group">
                <label className="form-label">Mobile</label>
                <input type="text" name="mobile" className="form-input" value={formData.mobile || ''} onChange={handleFormChange} required pattern="\d{10}" />
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">City</label>
                <input type="text" name="city" className="form-input" value={formData.city || ''} onChange={handleFormChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select name="eligibilityStatus" className="form-select" value={formData.eligibilityStatus || ''} onChange={handleFormChange} required>
                  <option value="Eligible">Eligible</option>
                  <option value="Pending Verification">Pending</option>
                  <option value="Not Eligible">Not Eligible</option>
                </select>
              </div>
            </div>

            <div className="mt-4 d-flex justify-between gap-2">
              <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setIsModalOpen(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>{modalMode === 'add' ? 'Create' : 'Save Changes'}</button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default ManageDonors;
