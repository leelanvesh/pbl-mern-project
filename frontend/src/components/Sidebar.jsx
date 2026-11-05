import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

const adminLinks = [
  { to: '/admin', label: '📊 Dashboard', end: true },
  { to: '/admin/donors', label: '👥 Manage Donors' },
  { to: '/admin/donations', label: '💉 Manage Donations' },
  { to: '/admin/reports', label: '📈 Reports' },
];

const donorLinks = [
  { to: '/donor/dashboard', label: '🏠 Dashboard', end: true },
  { to: '/donor/profile', label: '👤 My Profile' },
  { to: '/donor/history', label: '📋 Donation History' },
];

const hospitalLinks = [
  { to: '/hospital/dashboard', label: '🔍 Search & Donors', end: true },
];

const Sidebar = () => {
  const { user } = useAuth();

  const links =
    user?.role === 'admin'
      ? adminLinks
      : user?.role === 'donor'
      ? donorLinks
      : hospitalLinks;

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">🩸 Portal</div>
        <div className="sidebar-role">{user?.role}</div>
      </div>
      <nav className="sidebar-nav">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-user-name">{user?.name}</div>
          <div className="sidebar-user-email">{user?.email}</div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
