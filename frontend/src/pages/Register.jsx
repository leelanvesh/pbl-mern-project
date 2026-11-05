import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ErrorMessage from '../components/ErrorMessage';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'donor',
    bloodGroup: 'O+',
    age: '',
    gender: 'Male',
    mobile: '',
    city: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (formData.role === 'donor') {
      const ageNum = parseInt(formData.age, 10);
      if (isNaN(ageNum) || ageNum < 18 || ageNum > 65) {
        setError('Donor age must be between 18 and 65 years');
        return;
      }

      if (!/^[6-9]\d{9}$/.test(formData.mobile)) {
        setError('Please enter a valid 10-digit mobile number');
        return;
      }
    }

    try {
      setLoading(true);
      const user = await register(formData);

      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'hospital') navigate('/hospital/dashboard');
      else navigate('/donor/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <Navbar />

      <div className="main-content" style={{ maxWidth: '600px', margin: '40px auto' }}>
        <div className="card">
          <div className="card-header" style={{ textAlign: 'center', display: 'block' }}>
            <h2 className="card-title" style={{ fontSize: '22px' }}>Create an Account</h2>
            <p style={{ color: 'var(--gray-600)', fontSize: '13px', marginTop: '4px' }}>
              Join the Blood Donor Management network
            </p>
          </div>

          <div className="card-body">
            <ErrorMessage message={error} onClose={() => setError('')} />

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">I am registering as a:</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="form-control"
                  style={{ fontWeight: 600 }}
                >
                  <option value="donor">Blood Donor</option>
                  <option value="hospital">Hospital / Healthcare Center</option>
                  <option value="admin">System Administrator</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Full Name / Facility Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Rahul Sharma or City Hospital"
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="name@example.com"
                  className="form-control"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Password *</label>
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
                <div className="form-group">
                  <label className="form-label">Confirm Password *</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    placeholder="Re-enter password"
                    className="form-control"
                  />
                </div>
              </div>

              {formData.role === 'donor' && (
                <div style={{ background: 'var(--gray-50)', padding: '16px', borderRadius: '8px', marginBottom: '16px', border: '1px solid var(--gray-200)' }}>
                  <h4 style={{ fontSize: '14px', marginBottom: '12px', color: 'var(--primary)' }}>Donor Details</h4>

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
                        placeholder="e.g. 24"
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
                        placeholder="10-digit mobile number"
                        className="form-control"
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">City *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      placeholder="e.g. Hyderabad, Bangalore"
                      className="form-control"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary btn-lg w-full"
                style={{ justifyContent: 'center', marginTop: '12px' }}
              >
                {loading ? 'Creating Account...' : 'Complete Registration'}
              </button>

              <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '14px', color: 'var(--gray-600)' }}>
                Already registered? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign in here</Link>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Register;
