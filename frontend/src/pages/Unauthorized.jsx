import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Unauthorized = () => {
  return (
    <div className="page-container">
      <Navbar />
      <div className="main-content" style={{ textAlign: 'center', padding: '80px 20px' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🚫</div>
        <h1 style={{ fontSize: '28px', color: 'var(--gray-800)', marginBottom: '8px' }}>
          Access Denied
        </h1>
        <p style={{ color: 'var(--gray-600)', maxWidth: '450px', margin: '0 auto 24px' }}>
          You do not possess the required role permissions to access this specific portal section.
        </p>
        <Link to="/" className="btn btn-primary">
          Return to Portal Home
        </Link>
      </div>
      <Footer />
    </div>
  );
};

export default Unauthorized;
