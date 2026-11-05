import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const NotFound = () => {
  return (
    <div className="page-container">
      <Navbar />
      <div className="main-content" style={{ textAlign: 'center', padding: '80px 20px' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>404</div>
        <h1 style={{ fontSize: '28px', color: 'var(--gray-800)', marginBottom: '8px' }}>
          Page Not Found
        </h1>
        <p style={{ color: 'var(--gray-600)', maxWidth: '450px', margin: '0 auto 24px' }}>
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link to="/" className="btn btn-primary">
          Back to Homepage
        </Link>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
