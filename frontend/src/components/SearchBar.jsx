import { useState } from 'react';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const SearchBar = ({ onSearch, onReset, showEligibility = true }) => {
  const [filters, setFilters] = useState({ bloodGroup: '', city: '', eligibilityStatus: '' });

  const handleChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSearch = () => onSearch(filters);

  const handleReset = () => {
    setFilters({ bloodGroup: '', city: '', eligibilityStatus: '' });
    if (onReset) onReset();
  };

  return (
    <div className="search-bar">
      <div className="search-field">
        <label>Blood Group</label>
        <select name="bloodGroup" value={filters.bloodGroup} onChange={handleChange} className="form-control">
          <option value="">All Blood Groups</option>
          {BLOOD_GROUPS.map((bg) => (
            <option key={bg} value={bg}>{bg}</option>
          ))}
        </select>
      </div>

      <div className="search-field">
        <label>City</label>
        <input
          type="text"
          name="city"
          value={filters.city}
          onChange={handleChange}
          placeholder="Enter city name..."
          className="form-control"
        />
      </div>

      {showEligibility && (
        <div className="search-field">
          <label>Eligibility Status</label>
          <select name="eligibilityStatus" value={filters.eligibilityStatus} onChange={handleChange} className="form-control">
            <option value="">All Statuses</option>
            <option value="Eligible">Eligible</option>
            <option value="Pending">Pending</option>
            <option value="Not Eligible">Not Eligible</option>
          </select>
        </div>
      )}

      <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
        <button className="btn btn-primary" onClick={handleSearch}>🔍 Search</button>
        <button className="btn btn-outline" onClick={handleReset}>Reset</button>
      </div>
    </div>
  );
};

export default SearchBar;
