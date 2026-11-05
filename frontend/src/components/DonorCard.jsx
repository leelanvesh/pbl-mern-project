import EligibilityBadge from './EligibilityBadge';

const DonorCard = ({ donor, onContact, onEdit, onDelete, onVerify, showActions = true, isAdmin = false }) => {
  return (
    <div className="card" style={{ marginBottom: '16px' }}>
      <div className="card-body" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="blood-group-badge">{donor.bloodGroup}</div>
          <div>
            <h4 style={{ margin: 0, fontSize: '16px', color: 'var(--gray-800)' }}>
              {donor.donorName}
              {donor.isVerified && <span title="Verified Donor" style={{ marginLeft: '6px', color: 'var(--success)' }}>✓</span>}
            </h4>
            <div style={{ fontSize: '13px', color: 'var(--gray-600)', marginTop: '4px' }}>
              📍 {donor.city} &nbsp;|&nbsp; 🎂 {donor.age} yrs &nbsp;|&nbsp; ⚧ {donor.gender}
            </div>
            {donor.mobile && (
              <div style={{ fontSize: '13px', color: 'var(--gray-700)', marginTop: '2px' }}>
                📞 {donor.mobile}
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <EligibilityBadge status={donor.eligibilityStatus} />

          {showActions && (
            <div style={{ display: 'flex', gap: '8px' }}>
              {onContact && (
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => onContact(donor)}
                  disabled={donor.eligibilityStatus !== 'Eligible'}
                  title={donor.eligibilityStatus !== 'Eligible' ? 'Donor currently not eligible' : 'Contact donor'}
                >
                  📞 Contact
                </button>
              )}
              {isAdmin && !donor.isVerified && onVerify && (
                <button className="btn btn-success btn-sm" onClick={() => onVerify(donor)}>
                  ✓ Verify
                </button>
              )}
              {isAdmin && onEdit && (
                <button className="btn btn-outline btn-sm" onClick={() => onEdit(donor)}>
                  ✏️ Edit
                </button>
              )}
              {isAdmin && onDelete && (
                <button className="btn btn-danger btn-sm" onClick={() => onDelete(donor)}>
                  🗑️
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonorCard;
