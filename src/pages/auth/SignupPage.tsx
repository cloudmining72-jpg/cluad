import React, { useState } from 'react';
import { stateStore } from '../../services/stateStore';
import { Lock, Mail, User as UserIcon, Phone, Globe, Gift, ArrowRight, CheckCircle2, Eye, EyeOff } from 'lucide-react';

const getBackendUrl = () => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  if (typeof window !== 'undefined') {
    const isCapacitor = !!(window as any)?.Capacitor?.isNativePlatform?.() || 
                        window.location.protocol === 'capacitor:' || 
                        window.location.protocol === 'ionic:';
    if (isCapacitor) return 'https://claudemining.com';
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      return window.location.origin;
    }
    return 'http://localhost:5000';
  }
  return 'https://claudemining.com';
};
const API_URL = getBackendUrl();


const ALL_COUNTRIES = [
  { iso: 'US', name: 'United States', code: '+1', flag: 'ðŸ‡ºðŸ‡¸' },
  { iso: 'PK', name: 'Pakistan', code: '+92', flag: 'ðŸ‡µðŸ‡°' },
  { iso: 'SA', name: 'Saudi Arabia', code: '+966', flag: 'ðŸ‡¸ðŸ‡¦' },
  { iso: 'AE', name: 'United Arab Emirates', code: '+971', flag: 'ðŸ‡¦ðŸ‡ª' },
  { iso: 'GB', name: 'United Kingdom', code: '+44', flag: 'ðŸ‡¬ðŸ‡§' },
  { iso: 'QA', name: 'Qatar', code: '+974', flag: 'ðŸ‡¶ðŸ‡¦' },
  { iso: 'KW', name: 'Kuwait', code: '+965', flag: 'ðŸ‡°ðŸ‡¼' },
  { iso: 'OM', name: 'Oman', code: '+968', flag: 'ðŸ‡´ðŸ‡²' },
  { iso: 'BH', name: 'Bahrain', code: '+973', flag: 'ðŸ‡§ðŸ‡­' },
  { iso: 'CA', name: 'Canada', code: '+1', flag: 'ðŸ‡¨ðŸ‡¦' },
  { iso: 'AU', name: 'Australia', code: '+61', flag: 'ðŸ‡¦ðŸ‡º' },
  { iso: 'DE', name: 'Germany', code: '+49', flag: 'ðŸ‡©ðŸ‡ª' },
  { iso: 'FR', name: 'France', code: '+33', flag: 'ðŸ‡«ðŸ‡·' },
  { iso: 'IT', name: 'Italy', code: '+39', flag: 'ðŸ‡®ðŸ‡¹' },
  { iso: 'ES', name: 'Spain', code: '+34', flag: 'ðŸ‡ªðŸ‡¸' },
  { iso: 'TR', name: 'Turkey', code: '+90', flag: 'ðŸ‡¹ðŸ‡·' },
  { iso: 'IN', name: 'India', code: '+91', flag: 'ðŸ‡®ðŸ‡³' },
  { iso: 'BD', name: 'Bangladesh', code: '+880', flag: 'ðŸ‡§ðŸ‡©' },
  { iso: 'MY', name: 'Malaysia', code: '+60', flag: 'ðŸ‡²ðŸ‡¾' },
  { iso: 'SG', name: 'Singapore', code: '+65', flag: 'ðŸ‡¸ðŸ‡¬' },
  { iso: 'ID', name: 'Indonesia', code: '+62', flag: 'ðŸ‡®ðŸ‡©' },
  { iso: 'EG', name: 'Egypt', code: '+20', flag: 'ðŸ‡ªðŸ‡¬' },
  { iso: 'ZA', name: 'South Africa', code: '+27', flag: 'ðŸ‡¿ðŸ‡¦' },
  { iso: 'BR', name: 'Brazil', code: '+55', flag: 'ðŸ‡§ðŸ‡·' },
  { iso: 'JP', name: 'Japan', code: '+81', flag: 'ðŸ‡¯ðŸ‡µ' },
  { iso: 'CN', name: 'China', code: '+86', flag: 'ðŸ‡¨ðŸ‡³' },
  { iso: 'KR', name: 'South Korea', code: '+82', flag: 'ðŸ‡°ðŸ‡·' },
  { iso: 'WW', name: 'Other Country', code: '+1', flag: 'ðŸŒ' },
];

interface SignupPageProps {
  onSwitchToLogin: () => void;
  onSignupSuccess: () => void;
}

export const SignupPage: React.FC<SignupPageProps> = ({ onSwitchToLogin, onSignupSuccess }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('United States');
  const [phone, setPhone] = useState('+1 ');
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');

  const selectedCountryObj = ALL_COUNTRIES.find((c) => c.name === country) || ALL_COUNTRIES[0];

  const handleSelectCountry = (c: typeof ALL_COUNTRIES[0]) => {
    setCountry(c.name);
    setPhone(`${c.code} `);
    setIsCountryOpen(false);
    setCountrySearch('');
  };

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [referralCode, setReferralCode] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [feedback, setFeedback] = useState<{ success?: boolean; message?: string } | null>(null);

  // Auto-detect referral code from URL or persistent storage
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      let ref = params.get('ref') || params.get('referral');
      if (!ref && window.location.hash.includes('ref=')) {
        const match = window.location.hash.match(/ref=([a-zA-Z0-9_-]+)/);
        if (match) ref = match[1];
      }
      if (!ref) {
        ref = localStorage.getItem('claudemining_pending_ref_code') || sessionStorage.getItem('claudemining_pending_ref_code');
      }
      if (ref) {
        const cleanRef = ref.trim().toUpperCase();
        setReferralCode(cleanRef);
        localStorage.setItem('claudemining_pending_ref_code', cleanRef);
      }
    }
  }, []);

  const [step, setStep] = useState<1 | 2>(1);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const filteredCountries = ALL_COUNTRIES.filter((c) =>
    c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
    c.code.includes(countrySearch) ||
    c.iso.toLowerCase().includes(countrySearch.toLowerCase())
  );

  // Step 1: Send 6-Digit Email Verification Code via EmailJS (client-side)
  const handleRequestSignupOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (!agreeTerms) {
      setFeedback({ success: false, message: 'Please accept Terms & Conditions to continue.' });
      return;
    }

    if (password.length < 6) {
      setFeedback({ success: false, message: 'Password must be at least 6 characters long.' });
      return;
    }

    setLoading(true);

    // Request OTP from Backend API
    try {
      const res = await fetch(`${API_URL}/api/auth/send-signup-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, fullName }),
      });
      const data = await res.json();
      setLoading(false);

      if (data.success) {
        setFeedback({ success: true, message: `✅ Verification code sent to ${email}. Check your inbox (and spam folder).` });
        setStep(2);
      } else {
        setFeedback({ success: false, message: data.message || `Failed to send email. Please check your email address and try again.` });
      }
    } catch (error) {
      setLoading(false);
      setFeedback({ success: false, message: 'Network error. Please try again.' });
    }
  };

  // Step 2: Verify 6-Digit Code & Create Account
  const handleVerifyAndSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (otp.trim().length !== 6) {
      setFeedback({ success: false, message: 'Please enter the complete 6-digit verification code.' });
      return;
    }

    setLoading(true);
    const cleanRefCode = referralCode.trim().toUpperCase() || undefined;

    // Try to register via backend
    try {
      const res = await fetch(`${API_URL}/api/auth/verify-signup-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          otp: otp.trim(),
          fullName,
          phone,
          country,
          password,
          referralCode: cleanRefCode,
        }),
      });
      const data = await res.json();

      if (data.success) {
        if (data.user) {
          stateStore.syncBackendUser(data.user, password);
        }
        localStorage.removeItem('claudemining_pending_ref_code');
        sessionStorage.removeItem('claudemining_pending_ref_code');
        setLoading(false);
        setFeedback({ success: true, message: '✔ Email verified! Account created successfully.' });
        setTimeout(() => { onSignupSuccess(); }, 800);
        return;
      }
    } catch (_e) {
      // Offline fallback below
    }

    // Fallback: register in local stateStore
    const localRes = stateStore.verifySignupOTP(email, otp.trim(), {
      fullName, email, phone, country, password, referralCode: cleanRefCode,
    });
    if (localRes.success) {
      localStorage.removeItem('claudemining_pending_ref_code');
      sessionStorage.removeItem('claudemining_pending_ref_code');
    }
    setLoading(false);
    setFeedback(localRes);
    if (localRes.success) {
      setTimeout(() => {
        onSignupSuccess();
      }, 800);
    }
  };

  const handleResendSignupOtp = async () => {
    setFeedback(null);
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/send-signup-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, fullName }),
      });
      const data = await res.json();
      setLoading(false);
      setFeedback({ success: data.success, message: data.success ? `New code sent to ${email}.` : (data.message || `Could not send email. Please try again.`) });
    } catch (error) {
      setLoading(false);
      setFeedback({ success: false, message: 'Network error. Please try again.' });
    }
  };

  return (
    <div className="auth-container" style={styles.container}>
      <div className="auth-card" style={styles.card}>
        {/* Branding Header */}
        <div style={styles.brandContainer}>
          <img
            src="/claudemining-logo.jpg"
            alt="ClaudeMining"
            style={{ width: 72, height: 72, borderRadius: 14, objectFit: 'cover', border: '2px solid rgba(6, 182, 212, 0.4)', boxShadow: '0 8px 24px rgba(0,0,0,0.6)' }}
          />
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#f3f4f6', margin: '12px 0 2px 0' }}>
            {step === 1 ? 'Create Account' : 'Verify Your Email'}
          </h1>
          <p style={{ fontSize: 12, color: '#9ca3af', margin: '4px 0 0 0' }}>
            {step === 1 ? 'Join 1.25M+ cloud mining investors' : `Step 2 of 2: 6-Digit security code sent to ${email}`}
          </p>
        </div>

        {/* Step Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 18, padding: '8px 12px', backgroundColor: '#111827', borderRadius: 10, border: '1px solid #1f293d' }}>
          <div style={{ width: 22, height: 22, borderRadius: '50%', backgroundColor: step === 1 ? '#10b981' : '#059669', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, marginRight: 6 }}>
            {step === 1 ? '1' : 'âœ“'}
          </div>
          <span style={{ fontSize: 12, fontWeight: 700, color: step === 1 ? '#10b981' : '#9ca3af' }}>
            Account Info
          </span>
          <div style={{ flex: 1, height: 2, backgroundColor: step === 2 ? '#10b981' : '#1f293d', margin: '0 8px' }} />
          <div style={{ width: 22, height: 22, borderRadius: '50%', backgroundColor: step === 2 ? '#10b981' : '#1f293d', color: step === 2 ? '#000' : '#9ca3af', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, marginRight: 6 }}>
            2
          </div>
          <span style={{ fontSize: 12, fontWeight: 700, color: step === 2 ? '#10b981' : '#9ca3af' }}>
            Email OTP Verification
          </span>
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

        {/* STEP 2: EMAIL VERIFICATION CODE SCREEN */}
        {step === 2 ? (
          <form onSubmit={handleVerifyAndSignup}>
            <div style={{ marginBottom: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label style={styles.label}>Enter 6-Digit Email Verification Code</label>
                <button
                  type="button"
                  onClick={handleResendSignupOtp}
                  style={{ background: 'none', border: 'none', color: '#3b82f6', fontSize: 11, cursor: 'pointer', fontWeight: 700 }}
                >
                  Resend Code
                </button>
              </div>
              <input
                type="text"
                name="signup_otp_code"
                autoComplete="one-time-code"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="123456"
                autoFocus
                required
                style={{
                  width: '100%',
                  textAlign: 'center',
                  fontFamily: 'monospace',
                  fontSize: 24,
                  fontWeight: 900,
                  letterSpacing: 8,
                  padding: '12px',
                  borderRadius: 10,
                  backgroundColor: '#111827',
                  border: '1px solid #3b82f6',
                  color: '#10b981',
                  outline: 'none',
                }}
              />
              <span style={{ fontSize: 11, color: '#9ca3af', marginTop: 6, display: 'block', textAlign: 'center' }}>
                Please check your email inbox ({email}) for the 6-digit verification code.
              </span>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                type="button"
                onClick={() => setStep(1)}
                style={{ padding: '12px 18px', borderRadius: 8, fontWeight: 700, fontSize: 13, backgroundColor: '#1f293d', color: '#9ca3af', border: 'none', cursor: 'pointer' }}
              >
                &larr; Back
              </button>
              <button
                type="submit"
                style={{ ...styles.submitBtn, flex: 1 }}
                disabled={loading}
              >
                {loading ? 'Verifying...' : 'VERIFY & COMPLETE REGISTRATION'}
              </button>
            </div>
          </form>
        ) : (
          /* STEP 1: REGISTRATION FORM */
          <form onSubmit={handleRequestSignupOtp}>
          <div style={{ marginBottom: 12 }}>
            <label style={styles.label}>Full Legal Name</label>
            <div style={styles.inputWrapper}>
              <UserIcon size={16} color="#9ca3af" />
              <input
                type="text"
                placeholder="e.g. Alexander Wright"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                style={styles.input}
                required
              />
            </div>
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={styles.label}>Email Address</label>
            <div style={styles.inputWrapper}>
              <Mail size={16} color="#9ca3af" />
              <input
                type="email"
                placeholder="e.g. alexander@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                required
              />
            </div>
          </div>

          {/* 1. Country Selection (First, Default: United States) */}
          <div style={{ marginBottom: 12, position: 'relative' }}>
            <label style={styles.label}>Country</label>
            
            {/* Clickable Trigger Display */}
            <div
              onClick={() => setIsCountryOpen(!isCountryOpen)}
              style={{
                ...styles.inputWrapper,
                cursor: 'pointer',
                justifyContent: 'space-between',
                border: isCountryOpen ? '1px solid #3b82f6' : '1px solid #1f293d',
                backgroundColor: '#111827',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className="mono" style={{ fontSize: 11, fontWeight: 800, color: '#3b82f6', textTransform: 'lowercase', minWidth: 20 }}>
                  {selectedCountryObj.iso.toLowerCase()}
                </span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#f3f4f6' }}>
                  {selectedCountryObj.name} ({selectedCountryObj.code})
                </span>
              </div>
              <span style={{ fontSize: 12, color: '#9ca3af' }}>{isCountryOpen ? 'â–²' : 'â–¼'}</span>
            </div>

            {/* Custom Searchable Popover Dropdown */}
            {isCountryOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  marginTop: 4,
                  backgroundColor: '#0d1525',
                  border: '1px solid #2563eb',
                  borderRadius: 10,
                  zIndex: 99,
                  boxShadow: '0 12px 30px rgba(0,0,0,0.8)',
                  overflow: 'hidden',
                }}
              >
                {/* Search Bar at Top */}
                <div style={{ padding: 8, borderBottom: '1px solid #1f293d', backgroundColor: '#111827' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, backgroundColor: '#162032', padding: '6px 10px', borderRadius: 6, border: '1px solid #3b82f6' }}>
                    <Globe size={14} color="#3b82f6" />
                    <input
                      type="text"
                      placeholder="Search country or code..."
                      value={countrySearch}
                      onChange={(e) => setCountrySearch(e.target.value)}
                      autoFocus
                      style={{
                        border: 'none',
                        backgroundColor: 'transparent',
                        color: '#ffffff',
                        fontSize: 12,
                        width: '100%',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>

                {/* Country Options List */}
                <div style={{ maxHeight: 210, overflowY: 'auto' }}>
                  {filteredCountries.length === 0 ? (
                    <div style={{ padding: 12, fontSize: 12, color: '#9ca3af', textAlign: 'center' }}>
                      No matching countries found
                    </div>
                  ) : (
                    filteredCountries.map((c) => {
                      const isSelected = c.name === country;
                      return (
                        <div
                          key={c.name}
                          onClick={() => handleSelectCountry(c)}
                          style={{
                            padding: '9px 14px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                            cursor: 'pointer',
                            backgroundColor: isSelected ? '#2563eb' : 'transparent',
                            color: isSelected ? '#ffffff' : '#f3f4f6',
                            borderBottom: '1px solid rgba(255,255,255,0.04)',
                            transition: 'background-color 0.15s',
                          }}
                          onMouseEnter={(e) => {
                            if (!isSelected) e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.15)';
                          }}
                          onMouseLeave={(e) => {
                            if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          <span
                            className="mono"
                            style={{
                              fontSize: 12,
                              fontWeight: 800,
                              color: isSelected ? '#ffffff' : '#3b82f6',
                              textTransform: 'lowercase',
                              width: 22,
                            }}
                          >
                            {c.iso.toLowerCase()}
                          </span>
                          <span style={{ fontSize: 13, fontWeight: isSelected ? 800 : 500 }}>
                            {c.name} ({c.code})
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 2. Phone Number (Below Country) */}
          <div style={{ marginBottom: 12 }}>
            <label style={styles.label}>Phone Number</label>
            <div style={styles.inputWrapper}>
              <Phone size={16} color="#9ca3af" />
              <input
                type="text"
                placeholder="+1 (555) 000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={styles.input}
                required
              />
            </div>
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={styles.label}>Password</label>
            <div style={styles.inputWrapper}>
              <Lock size={16} color="#9ca3af" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Choose strong password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} color="#9ca3af" /> : <Eye size={16} color="#9ca3af" />}
              </button>
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={styles.label}>Referral Code (Optional)</label>
            <div style={styles.inputWrapper}>
              <Gift size={16} color="#06b6d4" />
              <input
                type="text"
                placeholder="e.g. REF_777888 (Optional)"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
                style={{ ...styles.input, color: '#06b6d4', fontWeight: 700, fontFamily: 'var(--font-mono)' }}
              />
            </div>
            <span style={{ fontSize: 10, color: '#06b6d4', marginTop: 2, display: 'block' }}>
              âœ¦ Enters you into Level 1 & Level 2 Commission tier
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <input
              type="checkbox"
              id="terms"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              style={{ width: 16, height: 16, cursor: 'pointer' }}
            />
            <label htmlFor="terms" style={{ fontSize: 12, color: '#9ca3af', cursor: 'pointer' }}>
              I agree to the Terms of Service & Privacy Policy
            </label>
          </div>

          <button type="submit" style={styles.submitBtn} disabled={loading}>
            {loading ? 'Sending Code...' : (
              <>
                CONTINUE TO EMAIL VERIFICATION <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>
        )}

        {/* Switch to Login */}
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <span style={{ fontSize: 13, color: '#9ca3af' }}>Already have an account? </span>
          <button onClick={onSwitchToLogin} style={{ fontSize: 13, color: '#3b82f6', fontWeight: 700 }}>
            Sign In &rarr;
          </button>
        </div>
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
    maxWidth: 480,
    boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
  },
  brandContainer: {
    textAlign: 'center',
    marginBottom: 20,
  },
  logoBadge: {
    width: 50,
    height: 50,
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
    padding: '9px 12px',
  },
  input: {
    flex: 1,
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    padding: 0,
    paddingRight: 24, // Prevents overlap with browser autofill icons
    width: '100%',
    color: '#f3f4f6',
    fontSize: 13,
  },
  selectInput: {
    flex: 1,
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    padding: 0,
    width: '100%',
    color: '#f3f4f6',
    fontSize: 13,
    cursor: 'pointer',
  },
  submitBtn: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: 8,
    fontWeight: 800,
    fontSize: 13,
    backgroundColor: '#10b981',
    color: '#000000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
  },
};
