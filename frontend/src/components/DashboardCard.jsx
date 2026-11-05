import './DashboardCard.css';

const DashboardCard = ({ title, value, icon, color = 'primary', subtitle }) => (
  <div className={`dashboard-card dashboard-card--${color}`}>
    <div className="dashboard-card-icon">{icon}</div>
    <div className="dashboard-card-body">
      <div className="dashboard-card-value">{value ?? '—'}</div>
      <div className="dashboard-card-title">{title}</div>
      {subtitle && <div className="dashboard-card-subtitle">{subtitle}</div>}
    </div>
  </div>
);

export default DashboardCard;
