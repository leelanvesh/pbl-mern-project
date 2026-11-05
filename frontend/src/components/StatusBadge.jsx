import React from 'react';

const StatusBadge = ({ status }) => {
  let badgeClass = 'badge-pending';
  
  if (status === 'Eligible') {
    badgeClass = 'badge-eligible';
  } else if (status === 'Not Eligible') {
    badgeClass = 'badge-not-eligible';
  }

  return (
    <span className={`badge ${badgeClass}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
