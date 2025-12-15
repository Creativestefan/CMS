import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "./utils/supabase/client";
import { Login } from "./components/Login";
import { ResetPassword } from "./components/ResetPassword";
import { AdminDashboard } from "./components/AdminDashboard";
import ApiDocs from "./components/ApiDocs";
import { useTimeBasedTheme } from "./utils/useTimeBasedTheme";

// Wrapper for Admin Dashboard to handle Auth and Props
const AdminRoute = () => {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setToken(session?.access_token ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setToken(session?.access_token ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground" style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px' }}>Loading...</p>
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return <AdminDashboard accessToken={token} onLogout={handleLogout} />;
};

// Wrapper for Api Docs to ensure protection
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthenticated(!!session);
      setLoading(false);
    });
  }, []);

  if (loading) return null; // or loading spinner

  if (!authenticated) return <Navigate to="/login" replace />;

  return <>{children}</>;
};


// Wrapper for Login to handle Navigation
const LoginRoute = () => {
  const navigate = useNavigate();

  // Check if already logged in
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate('/admin', { replace: true });
    });
  }, [navigate]);

  return (
    <Login
      onLoginSuccess={() => navigate("/admin")}
      onForgotPassword={(email) => navigate("/reset-password", { state: { email } })} // Pass email via state if needed, or query param
    />
  );
};

// Wrapper for Reset Password
const ResetPasswordRoute = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  return (
    <ResetPassword
      email={email}
      onBack={() => navigate("/login")}
      onSuccess={() => navigate("/admin")}
    />
  );
};

export default function App() {
  useTimeBasedTheme();

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginRoute />} />
        <Route path="/reset-password" element={<ResetPasswordRoute />} />
        <Route path="/admin" element={<AdminRoute />} />
        <Route
          path="/api-docs"
          element={
            <ProtectedRoute>
              <ApiDocs />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}