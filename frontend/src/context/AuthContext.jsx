import { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, getCurrentUser } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [donor, setDonor] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const res = await getCurrentUser();
          setUser(res.data.user);
          setDonor(res.data.donor);
        } catch {
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
          setDonor(null);
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await loginUser({ email, password });
    const { token: newToken, user: userData, donor: donorData } = res.data;
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(userData);
    setDonor(donorData);
    return userData;
  };

  const register = async (formData) => {
    const res = await registerUser(formData);
    const { token: newToken, user: userData, donor: donorData } = res.data;
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(userData);
    setDonor(donorData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setDonor(null);
  };

  const updateDonorProfile = (updatedDonor) => {
    setDonor(updatedDonor);
  };

  const isAdmin = () => user?.role === 'admin';
  const isDonor = () => user?.role === 'donor';
  const isHospital = () => user?.role === 'hospital';

  return (
    <AuthContext.Provider
      value={{
        user,
        donor,
        token,
        loading,
        login,
        register,
        logout,
        updateDonorProfile,
        isAdmin,
        isDonor,
        isHospital,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export default AuthContext;
