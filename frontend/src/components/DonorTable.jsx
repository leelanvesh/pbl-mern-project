import EligibilityBadge from './EligibilityBadge';

const DonorTable = ({ donors, onEdit, onDelete, onVerify, onContact, isAdmin = false, isHospital = false }) => {
  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            <th>Blood Group</th>
            <th>Name</th>
            <th>Age / Gender</th>
            <th>City</th>
            <th>Mobile</th>
            <th>Eligibility</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {donors.map((donor) => (
            <tr key={donor._id}>
              <td>
                <span className="blood-group-badge" style={{ width: '32px', height: '32px', fontSize: '11px' }}>
                  {donor.bloodGroup}
                </span>
              </td>
              <td style={{ fontWeight: 600 }}>
                {donor.donorName}
                {donor.isVerified && (
                  <span title="Verified by Admin" style={{ color: 'var(--success)', marginLeft: '6px' }}>✓</span>
                )}
              </td>
              <td>{donor.age} yrs / {donor.gender}</td>
              <td>{donor.city}</td>
              <td>{donor.mobile || '—'}</td>
              <td>
                <EligibilityBadge status={donor.eligibilityStatus} />
              </td>
              <td>
                {donor.isVerified ? (
                  <span className="badge badge-success">Verified</span>
                ) : (
                  <span className="badge badge-warning">Unverified</span>
                )}
              </td>
              <td>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {isHospital && onContact && (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => onContact(donor)}
                      disabled={donor.eligibilityStatus !== 'Eligible'}
                    >
                      Contact
                    </button>
                  )}
                  {isAdmin && !donor.isVerified && onVerify && (
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => onVerify(donor._id)}
                      title="Verify Donor"
                    >
                      ✓
                    </button>
                  )}
                  {isAdmin && onEdit && (
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => onEdit(donor)}
                      title="Edit Donor"
                    >
                      ✏️
                    </button>
                  )}
                  {isAdmin && onDelete && (
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => onDelete(donor._id)}
                      title="Delete Donor"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DonorTable;
