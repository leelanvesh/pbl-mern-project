const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Delete', confirmClass = 'btn-danger' }) => {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" style={{ maxWidth: '400px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">⚠️ {title}</h3>
        </div>
        <div className="modal-body">
          <p style={{ color: 'var(--gray-700)', lineHeight: 1.6 }}>{message}</p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary btn-sm" onClick={onCancel}>Cancel</button>
          <button className={`btn ${confirmClass} btn-sm`} onClick={onConfirm}>{confirmText}</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
