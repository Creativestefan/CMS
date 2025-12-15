import { useState } from "react";
import { supabase } from "../utils/supabase/client";
import { ClientRateLimiter } from "../utils/clientRateLimit";

const verifyRateLimiter = new ClientRateLimiter(5, 15 * 60 * 1000, "otp_verify");

interface ResetPasswordProps {
  email: string;
  onBack: () => void;
  onSuccess: () => void;
}

export function ResetPassword({ email, onBack, onSuccess }: ResetPasswordProps) {
  const [step, setStep] = useState<"verify" | "reset">("verify");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Check rate limit
    const rateLimitResult = verifyRateLimiter.check();
    if (!rateLimitResult.allowed) {
      setError(rateLimitResult.message || "Too many attempts. Please try again later.");
      setLoading(false);
      return;
    }

    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit code");
      setLoading(false);
      return;
    }

    try {
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'recovery',
      });

      if (verifyError) {
        setError(verifyError.message);
        setLoading(false);
        return;
      }

      // OTP verified, move to password reset step
      setStep("reset");
      setLoading(false);
    } catch (err) {
      console.error('Error verifying OTP:', err);
      setError("An error occurred during verification");
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation
    if (!newPassword || !confirmPassword) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) {
        setError(updateError.message);
        setLoading(false);
        return;
      }

      // Success!
      setLoading(false);
      onSuccess();
    } catch (err) {
      console.error('Error resetting password:', err);
      setError("An error occurred while resetting password");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-[var(--radius-card)] p-8 shadow-[var(--elevation-sm)]">
          {step === "verify" ? (
            <>
              <h1 className="mb-2">Enter Verification Code</h1>
              <p className="text-muted-foreground mb-6">
                We sent a 6-digit code to <strong>{email}</strong>
              </p>
              
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <label htmlFor="otp" className="block mb-2 text-foreground">
                    Verification Code
                  </label>
                  <input
                    id="otp"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="000000"
                    className="w-full px-3 py-2 bg-input-background border border-border rounded-[var(--radius)] focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground/50 text-center tracking-widest"
                    required
                    disabled={loading}
                    autoComplete="one-time-code"
                  />
                  <p className="mt-2 text-xs text-muted-foreground">
                    Enter the 6-digit code from your email
                  </p>
                </div>

                {error && (
                  <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-[var(--radius)] text-destructive">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-[var(--radius-button)] hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {loading ? "Verifying..." : "Verify Code"}
                </button>

                <button
                  type="button"
                  onClick={onBack}
                  className="w-full px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  ← Back to Login
                </button>
              </form>

              <div className="mt-6 p-3 bg-muted/50 border border-border rounded-[var(--radius)]">
                <p className="text-xs text-muted-foreground text-center">
                  Didn't receive the code? Check your spam folder or try again.
                </p>
              </div>
            </>
          ) : (
            <>
              <h1 className="mb-2">Set New Password</h1>
              <p className="text-muted-foreground mb-6">
                Create a new password for your account
              </p>
              
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label htmlFor="new-password" className="block mb-2 text-foreground">
                    New Password
                  </label>
                  <input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter your new password"
                    className="w-full px-3 py-2 bg-input-background border border-border rounded-[var(--radius)] focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground/50"
                    required
                    disabled={loading}
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    Minimum 6 characters
                  </p>
                </div>

                <div>
                  <label htmlFor="confirm-password" className="block mb-2 text-foreground">
                    Confirm New Password
                  </label>
                  <input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your new password"
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
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}