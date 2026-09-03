import React, { useState } from 'react';
import { stateStore } from '../../services/stateStore';
import { X, Mail, KeyRound, Lock, Eye, EyeOff, CheckCircle2, AlertCircle, RefreshCw, ShieldCheck, ArrowRight } from 'lucide-react';

// ===== EmailJS Config =====
const EMAILJS_SERVICE_ID  = 'service_abbiw6c';
const EMAILJS_TEMPLATE_ID = 'template_z8w72rc';
const EMAILJS_PUBLIC_KEY  = 'WgBGiv4o--z8vCAl3';

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendOTPviaEmailJS(toEmail: string, toName: string, otpCode: string): Promise<boolean> {
  try {
    if (!(window as any).emailjs) {
      await new Promise<void>((resolve, reject) => {
        const s = document.createElement('script');
        s.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
        s.onload = () => resolve();
        s.onerror = () => reject(new Error('EmailJS load failed'));
        document.head.appendChild(s);
      });
      (window as any).emailjs.init(EMAILJS_PUBLIC_KEY);
    }
    const params = {
      to_email: toEmail,
      to_name: toName || toEmail.split('@')[0],
      otp_code: otpCode,
      app_name: 'ClaudeMining',
    };
    const result = await (window as any).emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, params);
    return result.status === 200;
  } catch (err) {
    console.error('EmailJS error:', err);
    return false;
  }
}

interface ForgotPasswordModalProps {
  initialEmail?: string;
  onClose: () => void;
  onSuccess: (email: string) => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  initialEmail = '',
  onClose,
  onSuccess,
}) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ success?: boolean; message?: string } | null>(null);

  // Step 1: Handle OTP Request via EmailJS
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    setLoading(true);

    // First check if the account exists
    const checkRes = stateStore.requestPasswordResetOTP(email);
    if (!checkRes.success) {
      setLoading(false);
      setFeedback({ success: false, message: checkRes.message });
      return;
    }

    // Get user name for email
    const userObj = (stateStore as any).users?.find((u: any) => u.email?.toLowerCase() === email.toLowerCase().trim());
    const userName = userObj?.name || email.split('@')[0];

    // Generate OTP and send via EmailJS
    const otpCode = generateOTP();
    stateStore.requestPasswordResetOTP(email, otpCode);
    const sent = await sendOTPviaEmailJS(email, userName, otpCode);
    setLoading(false);

    if (sent) {
      setFeedback({ success: true, message: `✅ Password reset code sent to ${email}. Check your inbox.` });
    } else {
      setFeedback({ success: true, message: `Reset code generated. If email didn't arrive, check spam folder.` });
      console.info('[DEV] ForgotPassword OTP:', otpCode);
    }
    setStep(2);
  };

  // Step 2: Handle Password Reset
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (newPassword !== confirmPassword) {
      setFeedback({ success: false, message: 'Passwords do not match. Please check and try again.' });
      return;
    }

    if (newPassword.length < 6) {
      setFeedback({ success: false, message: 'Password must be at least 6 characters long.' });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword }),
      });
      const data = await res.json();

      if (data.success) {
        stateStore.forceUpdateUserPassword(email, newPassword);
        setLoading(false);
        setFeedback({ success: true, message: 'âœ“ Password updated successfully! Please sign in.' });
        setTimeout(() => {
          onSuccess(email);
        }, 1000);
        return;
      } else {
        const localRes = stateStore.resetPasswordWithOTP(email, otp, newPassword);
        setLoading(false);
        setFeedback(localRes);
        if (localRes.success) {
          setTimeout(() => {
            onSuccess(email);
          }, 1000);
        }
      }
    } catch (_err) {
      const localRes = stateStore.resetPasswordWithOTP(email, otp, newPassword);
      setLoading(false);
      setFeedback(localRes);
      if (localRes.success) {
        setTimeout(() => {
          onSuccess(email);
        }, 1000);
      }
    }
  };

  // Resend OTP via EmailJS
  const handleResendOtp = async () => {
    setFeedback(null);
    setLoading(true);
    const userObj = (stateStore as any).users?.find((u: any) => u.email?.toLowerCase() === email.toLowerCase().trim());
    const userName = userObj?.name || email.split('@')[0];
    const otpCode = generateOTP();
    stateStore.requestPasswordResetOTP(email, otpCode);
    const sent = await sendOTPviaEmailJS(email, userName, otpCode);
    setLoading(false);
    setFeedback({ success: sent, message: sent ? `New code sent to ${email}.` : 'Could not send email. Please try again.' });
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modalCard}>
        {/* Header */}
        <div style={styles.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={styles.iconBadge}>
              <KeyRound size={20} color="#f59e0b" />
            </div>
            <div>
              <h2 style={styles.title}>Password Reset</h2>
              <p style={styles.subtitle}>
                {step === 1 ? 'Enter your registered email address' : `OTP code sent to ${email}`}
              </p>
            </div>
          </div>
          <button onClick={onClose} style={styles.closeBtn}>
            <X size={18} color="#9ca3af" />
          </button>
        </div>

        {/* Step Indicator */}
        <div style={styles.stepBar}>
          <div style={{ ...styles.stepBadge, backgroundColor: step === 1 ? '#3b82f6' : '#10b981' }}>
            {step === 1 ? '1' : 'âœ“'}
          </div>
          <span style={{ fontSize: 12, fontWeight: 700, color: step === 1 ? '#3b82f6' : '#10b981' }}>
            Step 1: Verify Email
          </span>
          <div style={{ flex: 1, height: 2, backgroundColor: step === 2 ? '#3b82f6' : '#1f293d', margin: '0 8px' }} />
          <div style={{ ...styles.stepBadge, backgroundColor: step === 2 ? '#3b82f6' : '#1f293d', color: step === 2 ? '#fff' : '#9ca3af' }}>
            2
          </div>
          <span style={{ fontSize: 12, fontWeight: 700, color: step === 2 ? '#3b82f6' : '#9ca3af' }}>
            Step 2: New Password
          </span>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            style={{
              padding: 12,
              borderRadius: 8,
              marginBottom: 16,
              fontSize: 13,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              backgroundColor: feedback.success ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              color: feedback.success ? '#10b981' : '#ef4444',
              border: `1px solid ${feedback.success ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
            }}
          >
            {feedback.success ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            <span>{feedback.message}</span>
          </div>
        )}

        {/* STEP 1 FORM: Enter Email */}
        {step === 1 && (
          <form onSubmit={handleRequestOtp}>
            <div style={{ marginBottom: 16 }}>
              <label style={styles.label}>Registered Email Address</label>
              <div style={styles.inputWrapper}>
                <Mail size={16} color="#9ca3af" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter the email address you signed up with..."
                  style={styles.input}
                  required
                  autoFocus
                />
              </div>
              <span style={{ fontSize: 11, color: '#9ca3af', marginTop: 4, display: 'block' }}>
                We will generate and deliver a 6-digit security OTP code to this email.
              </span>
            </div>

            <button type="submit" style={styles.submitBtn} disabled={loading}>
              {loading ? (
                <>Sending Code...</>
              ) : (
                <>
                  SEND OTP CODE <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        )}

        {/* STEP 2 FORM: Verify OTP & Reset Password */}
        {step === 2 && (
          <form onSubmit={handleResetPassword}>
            <div style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <label style={styles.label}>6-Digit OTP Verification Code</label>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  style={{ background: 'none', border: 'none', color: '#3b82f6', fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                >
                  <RefreshCw size={12} /> Resend OTP
                </button>
              </div>
              <div style={styles.inputWrapper}>
                <ShieldCheck size={16} color="#f59e0b" />
                <input
                  type="text"
                  name="security_otp_code"
                  autoComplete="one-time-code"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP code (e.g. 123456)"
                  style={{ ...styles.input, fontFamily: 'monospace', letterSpacing: 3, fontSize: 16, fontWeight: 700, color: '#f59e0b' }}
                  required
                  autoFocus
                />
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={styles.label}>New Password</label>
              <div style={styles.inputWrapper}>
                <Lock size={16} color="#9ca3af" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password (min. 6 chars)..."
                  style={styles.input}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  {showPassword ? <EyeOff size={16} color="#9ca3af" /> : <Eye size={16} color="#9ca3af" />}
                </button>
              </div>
            </div>

            <div style={{ marginBottom: 18 }}>
              <label style={styles.label}>Confirm New Password</label>
              <div style={styles.inputWrapper}>
                <Lock size={16} color="#9ca3af" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password..."
                  style={styles.input}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                type="button"
                onClick={() => setStep(1)}
                style={styles.backBtn}
              >
                Back
              </button>
              <button type="submit" style={{ ...styles.submitBtn, flex: 1 }} disabled={loading}>
                {loading ? 'Resetting Password...' : 'RESET PASSWORD & UPDATE ACCOUNT'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    backdropFilter: 'blur(6px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    padding: 16,
  },
  modalCard: {
    backgroundColor: '#162032',
    border: '1px solid #1f293d',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 440,
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    border: '1px solid rgba(245, 158, 11, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 800,
    color: '#f3f4f6',
    margin: 0,
  },
  subtitle: {
    fontSize: 12,
    color: '#9ca3af',
    margin: '2px 0 0 0',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 4,
  },
  stepBar: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 18,
    padding: '8px 12px',
    backgroundColor: '#111827',
    borderRadius: 10,
    border: '1px solid #1f293d',
  },
  stepBadge: {
    width: 22,
    height: 22,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 11,
    fontWeight: 800,
    marginRight: 6,
  },
  emailPreviewBox: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    border: '1px dashed rgba(245, 158, 11, 0.4)',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  otpBadgeContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    backgroundColor: '#111827',
    borderRadius: 8,
    padding: '6px 12px',
    border: '1px solid rgba(245, 158, 11, 0.3)',
  },
  otpCodeText: {
    fontSize: 20,
    fontWeight: 900,
    fontFamily: 'monospace',
    color: '#f59e0b',
    letterSpacing: 4,
  },
  autoFillBtn: {
    backgroundColor: '#f59e0b',
    color: '#000',
    border: 'none',
    borderRadius: 6,
    padding: '4px 10px',
    fontSize: 11,
    fontWeight: 800,
    cursor: 'pointer',
  },
  label: {
    fontSize: 12,
    fontWeight: 600,
    color: '#9ca3af',
    marginBottom: 4,
    display: 'block',
  },
  inputWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#111827',
    border: '1px solid #1f293d',
    borderRadius: 8,
    padding: '10px 14px',
  },
  input: {
    border: 'none',
    backgroundColor: 'transparent',
    padding: 0,
    width: '100%',
    color: '#f3f4f6',
    fontSize: 14,
    outline: 'none',
  },
  submitBtn: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: 8,
    fontWeight: 800,
    fontSize: 13,
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
  },
  backBtn: {
    padding: '12px 16px',
    borderRadius: 8,
    fontWeight: 700,
    fontSize: 13,
    backgroundColor: '#1f293d',
    color: '#9ca3af',
    border: 'none',
    cursor: 'pointer',
  },
};
