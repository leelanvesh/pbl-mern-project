import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';

// Public Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import Unauthorized from './pages/Unauthorized';

// Donor Pages
import DonorDashboard from './pages/DonorDashboard';
import DonorProfile from './pages/DonorProfile';
import DonationHistory from './pages/DonationHistory';

// Hospital Pages
import HospitalDashboard from './pages/HospitalDashboard';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import ManageDonors from './pages/ManageDonors';
import ManageDonations from './pages/ManageDonations';
import Reports from './pages/Reports';

// Guards
import ProtectedRoute from './components/ProtectedRoute';
import RoleBasedRoute from './components/RoleBasedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Donor Routes */}
          <Route
            path="/donor"
            element={
              <ProtectedRoute>
                <RoleBasedRoute allowedRoles={['donor']}>
                  <DashboardLayout />
                </RoleBasedRoute>
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/donor/dashboard" replace />} />
            <Route path="dashboard" element={<DonorDashboard />} />
            <Route path="profile" element={<DonorProfile />} />
            <Route path="history" element={<DonationHistory />} />
          </Route>

          {/* Hospital Routes */}
          <Route
            path="/hospital"
            element={
              <ProtectedRoute>
                <RoleBasedRoute allowedRoles={['hospital']}>
                  <DashboardLayout />
                </RoleBasedRoute>
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/hospital/dashboard" replace />} />
            <Route path="dashboard" element={<HospitalDashboard />} />
            <Route path="search" element={<HospitalDashboard />} />
          </Route>

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <RoleBasedRoute allowedRoles={['admin']}>
                  <DashboardLayout />
                </RoleBasedRoute>
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="donors" element={<ManageDonors />} />
            <Route path="donations" element={<ManageDonations />} />
            <Route path="reports" element={<Reports />} />
          </Route>

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
