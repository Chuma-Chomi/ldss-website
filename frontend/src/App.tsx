import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { HomePage } from './components/HomePage';
import { SimpleLogin } from './pages/SimpleLogin';
import { SimpleAdminDashboard } from './pages/SimpleAdminDashboard';
import { SimpleStaffDashboard } from './pages/SimpleStaffDashboard';
import { SimpleLearnerDashboard } from './pages/SimpleLearnerDashboard';

function ProtectedRoute({ children, allowedRole }: { children: React.ReactNode; allowedRole: string }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== allowedRole) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<SimpleLogin />} />
      <Route
        path="/admin-portal"
        element={
          <ProtectedRoute allowedRole="ADMIN">
            <SimpleAdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff-portal"
        element={
          <ProtectedRoute allowedRole="STAFF">
            <SimpleStaffDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/learner-portal"
        element={
          <ProtectedRoute allowedRole="LEARNER">
            <SimpleLearnerDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
