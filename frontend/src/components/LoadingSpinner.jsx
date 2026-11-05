const LoadingSpinner = ({ message = 'Loading...' }) => (
  <div className="spinner-overlay">
    <div style={{ textAlign: 'center' }}>
      <div className="spinner"></div>
      <p style={{ marginTop: '12px', color: 'var(--gray-500)', fontSize: '14px' }}>{message}</p>
    </div>
  </div>
);

export default LoadingSpinner;
