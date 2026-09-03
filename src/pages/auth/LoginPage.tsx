import React, { useState } from 'react';
import { stateStore } from '../../services/stateStore';
import { Lock, Mail, ArrowRight, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { ForgotPasswordModal } from '../../components/Modal/ForgotPasswordModal';

interface LoginPageProps {
  onSwitchToSignup: () => void;
  onLoginSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSwitchToSignup, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [feedback, setFeedback] = useState<{ success?: boolean; message?: string } | null>(null);

  // Clear any persistent browser autofill cache on mount
  React.useEffect(() => {
    setEmail('');
    setPassword('');
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    // 1. Try local state store login
    const res = stateStore.login(cleanEmail, cleanPassword);
    if (res.success) {
      setFeedback(res);
      setTimeout(() => {
        onLoginSuccess();
      }, 600);
      return;
    }

    // 2. Try backend API login fallback
    try {
      const apiRes = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password: cleanPassword }),
      });
      const data = await apiRes.json();
      if (data.success && data.user) {
        stateStore.syncBackendUser(data.user, cleanPassword);
        setFeedback({ success: true, message: `Welcome back, ${data.user.name}!` });
        setTimeout(() => {
          onLoginSuccess();
        }, 600);
        return;
      }
    } catch (_err) {
      // Offline fallback
    }

    setFeedback(res);
  };

  return (
    <div className="auth-container" style={styles.container}>
      <div className="auth-card" style={styles.card}>
        {/* Logo Branding */}
        <div style={styles.brandContainer}>
          <img
            src="/claudemining-logo.jpg"
            alt="ClaudeMining"
            style={{ width: 72, height: 72, borderRadius: 14, objectFit: 'cover', border: '2px solid rgba(6, 182, 212, 0.4)', boxShadow: '0 8px 24px rgba(0,0,0,0.6)' }}
          />
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#f3f4f6', margin: '12px 0 2px 0' }}>
            {stateStore.settings.appName}
          </h1>
        </div>

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
            <CheckCircle2 size={16} />
            <span>{feedback.message}</span>
          </div>
        )}

        <form onSubmit={handleLogin} autoComplete="off">
          {/* Chrome / Edge autofill traps */}
          <input type="text" name="fake_usernamenotused" style={{ display: 'none' }} tabIndex={-1} autoComplete="username" />
          <input type="password" name="fake_passwordnotused" style={{ display: 'none' }} tabIndex={-1} autoComplete="current-password" />

          <div style={{ marginBottom: 14 }}>
            <label style={styles.label}>Email Address</label>
            <div style={styles.inputWrapper}>
              <Mail size={16} color="#9ca3af" />
              <input
                type="email"
                name="app_user_login_email"
                autoComplete="off"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck="false"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address..."
                style={styles.input}
                required
              />
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <label style={styles.label}>Password</label>
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                style={{ background: 'none', border: 'none', fontSize: 11, color: '#3b82f6', cursor: 'pointer', fontWeight: 600, padding: 0 }}
              >
                Forgot Password?
              </button>
            </div>
            <div style={styles.inputWrapper}>
              <Lock size={16} color="#9ca3af" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="app_user_login_secret"
                autoComplete="new-password"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck="false"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                style={styles.input}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#9ca3af',
                  cursor: 'pointer',
                  padding: '4px 8px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" style={styles.submitBtn}>
            SIGN IN TO ACCOUNT <ArrowRight size={16} />
          </button>
        </form>

        {/* Switch to Register */}
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <span style={{ fontSize: 13, color: '#9ca3af' }}>Don't have an account? </span>
          <button onClick={onSwitchToSignup} style={{ fontSize: 13, color: '#3b82f6', fontWeight: 700 }}>
            Create Account &rarr;
          </button>
        </div>

        {/* Forgot Password Modal */}
        {showForgotPassword && (
          <ForgotPasswordModal
            initialEmail={email}
            onClose={() => setShowForgotPassword(false)}
            onSuccess={(resetEmail) => {
              setEmail(resetEmail);
              setShowForgotPassword(false);
              setFeedback({
                success: true,
                message: 'Password reset successfully! Please log in with your new password.',
              });
            }}
          />
        )}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '85vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    backgroundColor: '#162032',
    border: '1px solid #1f293d',
    borderRadius: 20,
    padding: 32,
    width: '100%',
    maxWidth: 440,
    boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
  },
  brandContainer: {
    textAlign: 'center',
    marginBottom: 24,
  },
  logoBadge: {
    width: 54,
    height: 54,
    borderRadius: 14,
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    border: '1px solid rgba(59, 130, 246, 0.3)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
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
    flex: 1,
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    padding: 0,
    paddingRight: 24, // Prevents overlap with browser autofill/password manager icons
    width: '100%',
    color: '#f3f4f6',
    fontSize: 14,
  },
  submitBtn: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: 8,
    fontWeight: 800,
    fontSize: 13,
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
  },
  fastLoginBox: {
    backgroundColor: '#111827',
    border: '1px solid #1f293d',
    borderRadius: 10,
    padding: 12,
    marginTop: 20,
    textAlign: 'center',
  },
};
