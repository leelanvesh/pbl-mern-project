import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin, isDonor, isHospital } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (isAdmin()) return '/admin';
    if (isDonor()) return '/donor/dashboard';
    if (isHospital()) return '/hospital/dashboard';
    return '/';
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">🩸</span>
          <span>BloodDonor Portal</span>
        </Link>

        <div className="navbar-links">
          {!isAuthenticated ? (
            <>
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </>
          ) : (
            <>
              {/* When logged in and on dashboard layout with sidebar, links are managed on sidebar */}
              <div className="navbar-user">
                <span className="user-name">👤 {user?.name}</span>
                <span className={`role-badge role-${user?.role}`}>{user?.role}</span>
                <button onClick={handleLogout} className="btn btn-outline btn-sm">Logout</button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
