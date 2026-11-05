const ErrorMessage = ({ message, onClose }) => {
  if (!message) return null;
  return (
    <div className="alert alert-danger" role="alert">
      <span>⚠️</span>
      <span style={{ flex: 1 }}>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: 'inherit' }}
        >
          ×
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
