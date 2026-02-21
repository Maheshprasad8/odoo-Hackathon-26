import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import VehiclesPage from './pages/VehiclesPage';
import TripsPage from './pages/TripsPage';
import DriversPage from './pages/DriversPage';
import ExpensesPage from './pages/ExpensesPage';
import AnalyticsPage from './pages/AnalyticsPage';
import MaintenancePage from './pages/MaintenancePage';
import LandingPage from './pages/LandingPage';
import MainLayout from './layout/MainLayout';

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-slate-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
    </div>
  );

  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" />;

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" toastOptions={{ duration: 4000, style: { background: '#1e293b', color: '#fff', borderRadius: '12px' } }} />
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/app" element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/dashboard" />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="vehicles" element={
              <ProtectedRoute roles={['Fleet Manager']}>
                <VehiclesPage />
              </ProtectedRoute>
            } />
            <Route path="trips" element={
              <ProtectedRoute roles={['Fleet Manager', 'Dispatcher']}>
                <TripsPage />
              </ProtectedRoute>
            } />
            <Route path="drivers" element={
              <ProtectedRoute roles={['Fleet Manager', 'Safety Officer']}>
                <DriversPage />
              </ProtectedRoute>
            } />
            <Route path="expenses" element={
              <ProtectedRoute roles={['Fleet Manager', 'Financial Analyst']}>
                <ExpensesPage />
              </ProtectedRoute>
            } />
            <Route path="analytics" element={
              <ProtectedRoute roles={['Fleet Manager', 'Financial Analyst']}>
                <AnalyticsPage />
              </ProtectedRoute>
            } />
            <Route path="maintenance" element={
              <ProtectedRoute roles={['Fleet Manager']}>
                <MaintenancePage />
              </ProtectedRoute>
            } />
            <Route path="safety" element={
              <ProtectedRoute roles={['Fleet Manager', 'Safety Officer']}>
                <DriversPage />
              </ProtectedRoute>
            } />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
