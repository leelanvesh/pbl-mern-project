const EligibilityBadge = ({ status }) => {
  const map = {
    Eligible: 'badge-success',
    Pending: 'badge-warning',
    'Not Eligible': 'badge-danger',
  };
  return <span className={`badge ${map[status] || 'badge-secondary'}`}>{status || 'Unknown'}</span>;
};

export default EligibilityBadge;
