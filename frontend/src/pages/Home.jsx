import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin';
    if (user.role === 'hospital') return '/hospital/dashboard';
    return '/donor/dashboard';
  };

  return (
    <div className="page-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      {/* Hero Section: Soft Medical Two-Tone */}
      <section style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(180deg, #991b1b 0%, #5c1524 40%, #1e293b 75%, #0f172a 100%)',
        color: '#ffffff',
        padding: '60px 24px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '850px', margin: '0 auto' }}>
          <h1 style={{
            fontSize: '44px',
            fontWeight: 800,
            color: '#ffffff',
            margin: '0 0 18px',
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
            textShadow: '0 2px 12px rgba(0, 0, 0, 0.25)'
          }}>
            Find Blood Donors Faster,{' '}
            <span style={{ color: '#fca5a5' }}>
              Save Lives
            </span>
          </h1>

          <p style={{
            fontSize: '18px',
            color: '#f1f5f9',
            lineHeight: 1.65,
            maxWidth: '720px',
            margin: '0 auto 36px',
            fontWeight: 400,
            opacity: 0.95
          }}>
            A hospital-grade network connecting voluntary blood donors with healthcare facilities and emergency units for instant, verified donor matching and real-time donation tracking.
          </p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {!isAuthenticated ? (
              <>
                <Link
                  to="/register"
                  className="btn btn-lg"
                  style={{
                    background: '#ffffff',
                    color: '#991b1b',
                    fontWeight: 700,
                    fontSize: '16px',
                    padding: '14px 34px',
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  🩸 Register
                </Link>
                <Link
                  to="/login"
                  className="btn btn-outline btn-lg"
                  style={{
                    background: 'transparent',
                    borderColor: '#ffffff',
                    borderWidth: '2px',
                    color: '#ffffff',
                    fontWeight: 600,
                    fontSize: '16px',
                    padding: '14px 34px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  🔑  Sign In
                </Link>
              </>
            ) : (
              <Link
                to={getDashboardPath()}
                className="btn btn-lg"
                style={{
                  background: '#ffffff',
                  color: '#991b1b',
                  fontWeight: 700,
                  fontSize: '16px',
                  padding: '14px 34px',
                  borderRadius: '8px',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
                  textDecoration: 'none'
                }}
              >
                🚀 Go to {user?.role.toUpperCase()} Dashboard
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
