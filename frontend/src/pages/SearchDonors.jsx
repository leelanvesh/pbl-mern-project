import React, { useState, useEffect } from 'react';
import { getDonors } from '../services/donorService';
import SearchBar from '../components/SearchBar';
import DonorTable from '../components/DonorTable';
import DonorCard from '../components/DonorCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import { useAuth } from '../context/AuthContext';
import { FaSearch } from 'react-icons/fa';

const SearchDonors = () => {
  const { user } = useAuth();
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (filters) => {
    try {
      setLoading(true);
      setError(null);
      setHasSearched(true);
      const res = await getDonors(filters);
      setDonors(res.data.data);
    } catch (err) {
      setError(err.message || 'Failed to search donors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch({}); // Initial load
  }, []);

  const isPrivileged = user?.role === 'admin' || user?.role === 'hospital';

  return (
    <div>
      <div className="page-header">
        <h1>Search Donors</h1>
      </div>
      
      <SearchBar onSearch={handleSearch} />

      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} />}
      
      {!loading && !error && hasSearched && donors.length === 0 && (
        <EmptyState icon={FaSearch} message="No donors found matching your criteria." />
      )}

      {!loading && !error && donors.length > 0 && (
        isPrivileged ? (
          <div className="donor-results">
            {donors.map(donor => (
              <DonorCard key={donor._id || donor.id} donor={donor} showContact={true} />
            ))}
          </div>
        ) : (
          <DonorTable donors={donors} showActions={false} />
        )
      )}
    </div>
  );
};

export default SearchDonors;
