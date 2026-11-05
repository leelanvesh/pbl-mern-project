import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getDonorByUserId, updateDonor } from '../services/donorService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import SuccessMessage from '../components/SuccessMessage';
import EligibilityBadge from '../components/EligibilityBadge';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const DonorProfile = () => {
  const { user, updateDonorProfile } = useAuth();
  const [donorId, setDonorId] = useState(null);
  const [formData, setFormData] = useState({
    donorName: '',
    bloodGroup: 'O+',
    age: '',
    gender: 'Male',
    mobile: '',
    city: '',
    eligibilityStatus: '',
    isVerified: false,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        if (user?._id) {
          const res = await getDonorByUserId(user._id);
          const d = res.data;
          setDonorId(d._id);
          setFormData({
            donorName: d.donorName || '',
            bloodGroup: d.bloodGroup || 'O+',
            age: d.age || '',
            gender: d.gender || 'Male',
            mobile: d.mobile || '',
            city: d.city || '',
            eligibilityStatus: d.eligibilityStatus || 'Pending',
            isVerified: d.isVerified || false,
          });
        }
      } catch (err) {
        setError('Failed to fetch donor profile details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const ageNum = parseInt(formData.age, 10);
    if (isNaN(ageNum) || ageNum < 18 || ageNum > 65) {
      setError('Donor age must be between 18 and 65 years');
      return;
    }

    if (!/^[6-9]\d{9}$/.test(formData.mobile)) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    try {
      setSaving(true);
      const res = await updateDonor(donorId, {
        donorName: formData.donorName,
        bloodGroup: formData.bloodGroup,
        age: ageNum,
        gender: formData.gender,
        mobile: formData.mobile,
        city: formData.city,
      });

      setSuccess('Profile updated successfully!');
      updateDonorProfile(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading your profile..." />;

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Donor Profile</h1>
          <p className="page-subtitle">View and update your personal information</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <EligibilityBadge status={formData.eligibilityStatus} />
          {formData.isVerified && <span className="badge badge-success">Verified Donor</span>}
        </div>
      </div>

      <ErrorMessage message={error} onClose={() => setError('')} />
      <SuccessMessage message={success} onClose={() => setSuccess('')} />

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Personal & Contact Details</h3>
        </div>
        <div className="card-body">
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
                  placeholder="10-digit mobile"
                  className="form-control"
                />
              </div>
            </div>

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

            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="submit"
                disabled={saving}
                className="btn btn-primary"
                style={{ minWidth: '130px', justifyContent: 'center' }}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DonorProfile;
