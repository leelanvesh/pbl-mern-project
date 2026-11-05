import React, { useEffect, useState } from 'react';
import { getMyProfile, updateDonor } from '../../services/donorService';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import Alert from '../../components/Alert';

const DonorProfile = () => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await getMyProfile();
      setProfile(res.data);
      setFormData({
        donorName: res.data.donorName,
        mobile: res.data.mobile,
        city: res.data.city,
      });
    } catch (err) {
      setAlert({ type: 'error', message: 'Failed to load profile.' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setAlert(null);
    try {
      await updateDonor(profile._id, formData);
      setProfile({ ...profile, ...formData });
      setIsEditing(false);
      setAlert({ type: 'success', message: 'Profile updated successfully.' });
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.message || 'Failed to update profile.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading Profile..." />;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="d-flex justify-between align-center mb-4">
        <h2>My Profile</h2>
        {!isEditing && (
          <button className="btn btn-primary" onClick={() => setIsEditing(true)}>Edit Profile</button>
        )}
      </div>

      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      <div className="card">
        <div className="card-body">
          {isEditing ? (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input type="text" name="donorName" className="form-input" value={formData.donorName} onChange={handleChange} required />
              </div>
              
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Mobile Number</label>
                  <input type="text" name="mobile" className="form-input" value={formData.mobile} onChange={handleChange} required pattern="\d{10}" />
                </div>
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input type="text" name="city" className="form-input" value={formData.city} onChange={handleChange} required />
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Blood Group (Read-only)</label>
                  <input type="text" className="form-input" value={profile.bloodGroup} disabled />
                </div>
                <div className="form-group">
                  <label className="form-label">Age & Gender (Read-only)</label>
                  <input type="text" className="form-input" value={`${profile.age} Yrs • ${profile.gender}`} disabled />
                </div>
              </div>

              <div className="mt-4 d-flex gap-2">
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button type="button" className="btn btn-outline" onClick={() => {
                  setIsEditing(false);
                  setFormData({ donorName: profile.donorName, mobile: profile.mobile, city: profile.city });
                }}>
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="grid-2">
              <div>
                <p className="text-light mb-1">Full Name</p>
                <p className="mb-3" style={{ fontSize: '1.1rem' }}><strong>{profile.donorName}</strong></p>
                
                <p className="text-light mb-1">Mobile</p>
                <p className="mb-3"><strong>{profile.mobile}</strong></p>
                
                <p className="text-light mb-1">City</p>
                <p className="mb-3"><strong>{profile.city}</strong></p>
              </div>
              
              <div>
                <p className="text-light mb-1">Blood Group</p>
                <p className="mb-3"><span className="badge badge-eligible" style={{ fontSize: '1rem' }}>{profile.bloodGroup}</span></p>
                
                <p className="text-light mb-1">Age & Gender</p>
                <p className="mb-3"><strong>{profile.age} Yrs, {profile.gender}</strong></p>
                
                <p className="text-light mb-1">Eligibility Status</p>
                <p className="mb-3"><StatusBadge status={profile.eligibilityStatus} /></p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonorProfile;
