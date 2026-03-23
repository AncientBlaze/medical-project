import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Predictor from './pages/Predictor';
import Admin from './pages/Admin/Index';
import Login from './pages/Login';
import Signup from './pages/Signup';
import LoadingSkeleton from './components/LoadingSkeleton';
import useAuthStore from './store/authStore';
import { useLocation } from 'react-router-dom';
import useThemeStore from './store/themeStore';
import TermsAndConditions from './pages/TermsAndConditions';
import RefundPolicy from './pages/RefundPolicy';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Disclaimer from './pages/Disclaimer';
import Footer from './components/Footer';
import PackagesGrid from './pages/Packages/components/PackagesGrid';
import PackageDetail from './pages/Packages/components/PackageDetails';
import PreferencesList from './pages/PreferencesList';
import AdmissionSupport from './pages/AdmissionSupport';
import StudentProfile from './pages/StudentProfile';
import DoctorProfile from './pages/DoctorProfile';

function AuthRoute({ children }) {
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);
  const location = useLocation();

  if (loading) return <LoadingSkeleton />;
  if (user) {
    const from = location.state?.from;
    return <Navigate to={user.isAdmin ? '/admin' : (from || '/')} replace />;
  }
  return children;
}

function PrivateRoute({ children, adminOnly = false }) {
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);
  if (loading) return <LoadingSkeleton />;
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && !user.isAdmin) return <Navigate to="/" replace />;
  if (!adminOnly && user.isAdmin) return <Navigate to="/admin" replace />;
  return children;
}

function Layout({ children }) {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <>
      <Header user={user} onLogout={handleLogout} />
      {children}
      <Footer />
    </>
  );
}

function LoginPage() {
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLoginSuccess = (u) => {
    login(u);
    if (u.isAdmin) { navigate('/admin', { replace: true }); return; }
    navigate(location.state?.from || '/', { replace: true });
  };

  return <Login onLoginSuccess={handleLoginSuccess} onSwitchToSignup={() =>
    navigate('/signup', { state: location.state })} />;
}

function SignupPage() {
  const signup = useAuthStore((s) => s.signup);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignupSuccess = (u) => {
    signup(u);
    navigate(location.state?.from || '/', { replace: true });
  };

  return <Signup onSignupSuccess={handleSignupSuccess} onSwitchToLogin={() =>
    navigate('/login', { state: location.state })} />;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Auth */}
      <Route path="/login" element={<AuthRoute><LoginPage /></AuthRoute>} />
      <Route path="/signup" element={<AuthRoute><SignupPage /></AuthRoute>} />

      {/* Admin */}
      <Route path="/admin" element={<PrivateRoute adminOnly><Admin /></PrivateRoute>} />

      {/* Private */}
      <Route path="/" element={<PrivateRoute><Layout><Home /></Layout></PrivateRoute>} />
      <Route path="/about" element={<PrivateRoute><Layout><About /></Layout></PrivateRoute>} />
      <Route path="/contact" element={<PrivateRoute><Layout><Contact /></Layout></PrivateRoute>} />
      <Route path="/preferences-list" element={<PrivateRoute><Layout><PreferencesList /></Layout></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><Layout><StudentProfile /></Layout></PrivateRoute>} />

      {/* Public — results/actions gated inside the components */}
      <Route path="/predictor" element={<Layout><Predictor /></Layout>} />
      <Route path="/packages" element={<Layout><PackagesGrid /></Layout>} />
      <Route path="/packages/:id" element={<Layout><PackageDetail /></Layout>} />
      <Route path="/admission-support" element={<Layout><AdmissionSupport /></Layout>} />
      <Route path="/doctors" element={<Layout><DoctorProfile /></Layout>} />

      {/* Legal */}
      <Route path="/terms-and-conditions" element={<Layout><TermsAndConditions /></Layout>} />
      <Route path="/refund-policy" element={<Layout><RefundPolicy /></Layout>} />
      <Route path="/privacy-policy" element={<Layout><PrivacyPolicy /></Layout>} />
      <Route path="/disclaimer" element={<Layout><Disclaimer /></Layout>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  const init = useAuthStore((s) => s.init);
  const initTheme = useThemeStore((s) => s.init);

  useEffect(() => { init(); }, [init]);
  useEffect(() => { initTheme(); }, [initTheme]);

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}