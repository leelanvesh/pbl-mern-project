import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { searchDonors } from '../../services/donorService';
import DonorCard from '../../components/DonorCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import Alert from '../../components/Alert';

const SearchDonors = () => {
  const location = useLocation();
  const [formData, setFormData] = useState({
    bloodGroup: '', city: '', eligibilityStatus: 'Eligible'
  });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');

  // Pre-fill from query params if navigated from dashboard
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const bg = params.get('bloodGroup') || '';
    const city = params.get('city') || '';
    
    if (bg || city) {
      const initData = { ...formData, bloodGroup: bg, city };
      setFormData(initData);
      performSearch(initData);
    } else {
      performSearch(formData); // Load initial list
    }
  }, [location.search]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const performSearch = async (searchParams) => {
    setLoading(true);
    setError('');
    try {
      // clean empty params
      const params = {};
      if (searchParams.bloodGroup) params.bloodGroup = searchParams.bloodGroup;
      if (searchParams.city) params.city = searchParams.city;
      if (searchParams.eligibilityStatus) params.eligibilityStatus = searchParams.eligibilityStatus;

      const res = await searchDonors(params);
      setResults(res.data);
      setSearched(true);
    } catch (err) {
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    performSearch(formData);
  };

  const handleReset = () => {
    setFormData({ bloodGroup: '', city: '', eligibilityStatus: 'Eligible' });
    performSearch({ eligibilityStatus: 'Eligible' });
  };

  return (
    <div>
      <h2 className="mb-4">Search Donors</h2>

      <div className="card mb-4">
        <div className="card-body">
          <form onSubmit={handleSearch} className="grid-4 align-center gap-3">
            <div className="form-group mb-0">
              <label className="form-label">Blood Group</label>
              <select name="bloodGroup" className="form-select" value={formData.bloodGroup} onChange={handleChange}>
                <option value="">All Groups</option>
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group mb-0">
              <label className="form-label">City</label>
              <input type="text" name="city" className="form-input" placeholder="e.g. Mumbai" value={formData.city} onChange={handleChange} />
            </div>

            <div className="form-group mb-0">
              <label className="form-label">Status</label>
              <select name="eligibilityStatus" className="form-select" value={formData.eligibilityStatus} onChange={handleChange}>
                <option value="">All Statuses</option>
                <option value="Eligible">Eligible Only</option>
                <option value="Pending Verification">Pending</option>
              </select>
            </div>

            <div className="d-flex gap-2 mt-4">
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Search</button>
              <button type="button" className="btn btn-outline" onClick={handleReset}>Reset</button>
            </div>
          </form>
        </div>
      </div>

      {error && <Alert type="error" message={error} />}

      {loading ? (
        <LoadingSpinner text="Searching..." />
      ) : (
        <>
          {searched && (
            <p className="mb-3 text-medium">
              Found <strong>{results.length}</strong> donor(s) matching your criteria.
            </p>
          )}

          {results.length > 0 ? (
            <div className="grid-3">
              {results.map(donor => (
                <DonorCard key={donor._id} donor={donor} />
              ))}
            </div>
          ) : (
            searched && (
              <div className="card">
                <div className="card-body text-center py-5">
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                  <h4>No Donors Found</h4>
                  <p className="text-light">No eligible donors found for selected criteria. Try broadening your search.</p>
                </div>
              </div>
            )
          )}
        </>
      )}
    </div>
  );
};

export default SearchDonors;
