import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CurrencyProvider } from './contexts/CurrencyContext';
import { Splash } from './pages/Splash';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Dashboard } from './pages/Dashboard';
import { GoalDetail } from './pages/GoalDetail';
import { KYCIntro } from './pages/kyc/KYCIntro';
import { KYCPersonalInfo } from './pages/kyc/KYCPersonalInfo';
import { KYCDocumentUpload } from './pages/kyc/KYCDocumentUpload';
import { KYCSelfieUpload } from './pages/kyc/KYCSelfieUpload';
import { KYCReview } from './pages/kyc/KYCReview';
import { KYCPending } from './pages/kyc/KYCPending';
import { KYCComplete } from './pages/kyc/KYCComplete';
import { Rewards } from './pages/Rewards';
import { Social } from './pages/Social';
import { Notifications } from './pages/Notifications';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CurrencyProvider>
          <Routes>
            <Route path="/" element={<Splash />} />

          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          <Route
            path="/signup"
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/goals/:id"
            element={
              <ProtectedRoute>
                <GoalDetail />
              </ProtectedRoute>
            }
          />

          <Route
            path="/goals"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/kyc/intro"
            element={
              <ProtectedRoute>
                <KYCIntro />
              </ProtectedRoute>
            }
          />

          <Route
            path="/kyc/personal-info"
            element={
              <ProtectedRoute>
                <KYCPersonalInfo />
              </ProtectedRoute>
            }
          />

          <Route
            path="/kyc/document-upload"
            element={
              <ProtectedRoute>
                <KYCDocumentUpload />
              </ProtectedRoute>
            }
          />

          <Route
            path="/kyc/selfie-upload"
            element={
              <ProtectedRoute>
                <KYCSelfieUpload />
              </ProtectedRoute>
            }
          />

          <Route
            path="/kyc/review"
            element={
              <ProtectedRoute>
                <KYCReview />
              </ProtectedRoute>
            }
          />

          <Route
            path="/kyc/pending"
            element={
              <ProtectedRoute>
                <KYCPending />
              </ProtectedRoute>
            }
          />

          <Route
            path="/kyc/complete"
            element={
              <ProtectedRoute>
                <KYCComplete />
              </ProtectedRoute>
            }
          />

          <Route
            path="/rewards"
            element={
              <ProtectedRoute>
                <Rewards />
              </ProtectedRoute>
            }
          />

          <Route
            path="/social"
            element={
              <ProtectedRoute>
                <Social />
              </ProtectedRoute>
            }
          />

          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </CurrencyProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
