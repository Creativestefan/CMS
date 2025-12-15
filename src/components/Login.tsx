import { useState } from "react";
import { supabase } from "../utils/supabase/client";
import { ClientRateLimiter } from "../utils/clientRateLimit";

// Rate limiter: 5 attempts per 15 minutes
const loginRateLimiter = new ClientRateLimiter(5, 15 * 60 * 1000, "password_login");
const resetRateLimiter = new ClientRateLimiter(3, 15 * 60 * 1000, "password_reset");

interface LoginProps {
  onLoginSuccess: (accessToken: string) => void;
  onForgotPassword: (email: string) => void;
}

export function Login({ onLoginSuccess, onForgotPassword }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Check rate limit
    const rateLimitResult = loginRateLimiter.check();
    if (!rateLimitResult.allowed) {
      setError(rateLimitResult.message || "Too many login attempts. Please try again later.");
      setLoading(false);
      return;
    }

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }

      if (data.session) {
        console.log('✅ Login successful');
        onLoginSuccess(data.session.access_token);
      }
    } catch (err) {
      console.error('Error during login:', err);
      setError("An error occurred during login");
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setResetSuccess(false);
    setLoading(true);

    // Check rate limit
    const rateLimitResult = resetRateLimiter.check();
    if (!rateLimitResult.allowed) {
      setError(rateLimitResult.message || "Too many reset attempts. Please try again later.");
      setLoading(false);
      return;
    }

    if (!email) {
      setError("Please enter your email address");
      setLoading(false);
      return;
    }

    try {
      // Send password reset email with OTP token
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email);

      if (resetError) {
        setError(resetError.message);
        setLoading(false);
        return;
      }

      setResetSuccess(true);
      setLoading(false);
      
      // Automatically navigate to reset password page after a short delay
      setTimeout(() => {
        onForgotPassword(email);
      }, 1500);
    } catch (err) {
      console.error('Error during password reset:', err);
      setError("An error occurred during password reset");
      setLoading(false);
    }
  };

  if (showForgotPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="w-full max-w-md">
          <div className="bg-card border border-border rounded-[var(--radius-card)] p-8 shadow-[var(--elevation-sm)]">
            <h1 className="mb-2">Reset Password</h1>
            <p className="text-muted-foreground mb-6">
              Enter your email to receive a verification code
            </p>
            
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label htmlFor="reset-email" className="block mb-2 text-foreground">
                  Email Address
                </label>
                <input
                  id="reset-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@creativestefan.work"
                  className="w-full px-3 py-2 bg-input-background border border-border rounded-[var(--radius)] focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground/50"
                  required
                  disabled={loading || resetSuccess}
                />
              </div>

              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-[var(--radius)] text-destructive">
                  {error}
                </div>
              )}

              {resetSuccess && (
                <div className="p-3 bg-primary/10 border border-primary/20 rounded-[var(--radius)] text-primary">
                  <div className="flex items-start gap-2">
                    <span className="text-lg">✉️</span>
                    <div>
                      <p className="mb-1">Verification code sent!</p>
                      <p className="text-sm opacity-90">Check your email for the 6-digit code.</p>
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || resetSuccess}
                className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-[var(--radius-button)] hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? "Sending..." : resetSuccess ? "Redirecting..." : "Send Verification Code"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowForgotPassword(false);
                  setError("");
                  setResetSuccess(false);
                }}
                className="w-full px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Back to Login
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-[var(--radius-card)] p-8 shadow-[var(--elevation-sm)]">
          <h1 className="mb-2">Admin Login</h1>
          <p className="text-muted-foreground mb-6">
            Sign in with your email and password
          </p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block mb-2 text-foreground">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@creativestefan.work"
                className="w-full px-3 py-2 bg-input-background border border-border rounded-[var(--radius)] focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground/50"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block mb-2 text-foreground">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-3 py-2 bg-input-background border border-border rounded-[var(--radius)] focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground/50"
                required
                disabled={loading}
              />
            </div>

            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-[var(--radius)] text-destructive">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-[var(--radius-button)] hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="w-full text-sm text-primary hover:underline"
            >
              Forgot password?
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}