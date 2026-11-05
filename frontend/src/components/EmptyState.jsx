const EmptyState = ({ icon = '🗃️', title = 'No data found', message = '', action }) => (
  <div className="empty-state">
    <div className="empty-state-icon">{icon}</div>
    <h3>{title}</h3>
    {message && <p>{message}</p>}
    {action && action}
  </div>
);

export default EmptyState;
