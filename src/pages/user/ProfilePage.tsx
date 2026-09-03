import React, { useState } from 'react';
import { stateStore } from '../../services/stateStore';
import { KeyRound, Lock, Eye, EyeOff } from 'lucide-react';
import { showToast } from '../../components/ToastContainer';

interface ProfilePageProps {}

export const ProfilePage: React.FC<ProfilePageProps> = () => {
  const currentUser = stateStore.currentUser;
  const [twoFactor, setTwoFactor] = useState(currentUser.twoFactorEnabled);
  const [savedMsg, setSavedMsg] = useState(false);

  // Change Password Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Password Visibility Eye Toggles
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    currentUser.twoFactorEnabled = twoFactor;
    setSavedMsg(true);
    showToast('Security preferences updated successfully!', 'success');
    setTimeout(() => setSavedMsg(false), 2000);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      showToast('Please enter your current password.', 'error');
      return;
    }
    if (newPassword.length < 6) {
      showToast('New password must be at least 6 characters long.', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match.', 'error');
      return;
    }

    const res = stateStore.changePassword(currentPassword, newPassword);
    if (res.success) {
      showToast(res.message, 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      showToast(res.message, 'error');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Profile Header */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
        <img
          src={currentUser.avatar}
          alt={currentUser.name}
          style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', border: '2px solid #3b82f6' }}
        />
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#f3f4f6' }}>{currentUser.name}</h2>

          </div>
          <span style={{ fontSize: 13, color: '#9ca3af', marginTop: 4, display: 'block', wordBreak: 'break-all' }}>
            {currentUser.email} &bull; {currentUser.phone} &bull; {currentUser.country}
          </span>
        </div>
      </div>





      {savedMsg && (
        <div style={{ padding: 12, borderRadius: 8, backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10b981', fontSize: 13 }}>
          Security preferences updated.
        </div>
      )}

      {/* Grid: Personal Details & Security Controls */}
      <div className="grid-2">
        {/* Personal Details Form */}
        <div className="card">
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#f3f4f6', marginBottom: 16 }}>
            Account Personal Information
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label style={styles.label}>Full Name</label>
              <input type="text" value={currentUser.name} readOnly style={styles.inputReadOnly} />
            </div>
            <div>
              <label style={styles.label}>Email Address</label>
              <input type="email" value={currentUser.email} readOnly style={styles.inputReadOnly} />
            </div>
            <div>
              <label style={styles.label}>Phone Number</label>
              <input type="text" value={currentUser.phone} readOnly style={styles.inputReadOnly} />
            </div>
            <div>
              <label style={styles.label}>Country</label>
              <input type="text" value={currentUser.country} readOnly style={styles.inputReadOnly} />
            </div>
          </div>
        </div>

        {/* Change Password & Security Form */}
        <div className="card">
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#f3f4f6', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <KeyRound size={18} color="#3b82f6" /> Change Account Login Password
          </h3>

          <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
            {/* Current Password */}
            <div>
              <label style={styles.label}>Current Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showCurrentPass ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  style={{ ...styles.input, paddingRight: 40 }}
                  placeholder="Enter current password..."
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPass(!showCurrentPass)}
                  style={styles.eyeBtn}
                  title={showCurrentPass ? 'Hide password' : 'Show password'}
                >
                  {showCurrentPass ? <EyeOff size={16} color="#9ca3af" /> : <Eye size={16} color="#9ca3af" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label style={styles.label}>New Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showNewPass ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={{ ...styles.input, paddingRight: 40 }}
                  placeholder="Enter min 6-character new password..."
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPass(!showNewPass)}
                  style={styles.eyeBtn}
                  title={showNewPass ? 'Hide password' : 'Show password'}
                >
                  {showNewPass ? <EyeOff size={16} color="#9ca3af" /> : <Eye size={16} color="#9ca3af" />}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div>
              <label style={styles.label}>Confirm New Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showConfirmPass ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{ ...styles.input, paddingRight: 40 }}
                  placeholder="Re-enter new password..."
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                  style={styles.eyeBtn}
                  title={showConfirmPass ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPass ? <EyeOff size={16} color="#9ca3af" /> : <Eye size={16} color="#9ca3af" />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '10px 14px', fontSize: 13, fontWeight: 700 }}>
              <Lock size={16} /> CHANGE LOGIN PASSWORD
            </button>
          </form>

          {/* 2FA Toggle */}
          <form onSubmit={handleSaveSecurity} style={{ display: 'flex', flexDirection: 'column', gap: 14, borderTop: '1px solid #1f293d', paddingTop: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#111827', padding: 12, borderRadius: 8, border: '1px solid #1f293d' }}>
              <div>
                <span style={{ fontWeight: 700, fontSize: 13, color: '#f3f4f6' }}>Two-Factor Authentication (2FA)</span>
                <span style={{ fontSize: 11, color: '#9ca3af', display: 'block', marginTop: 2 }}>
                  Required for processing withdrawal transfers
                </span>
              </div>
              <input
                type="checkbox"
                checked={twoFactor}
                onChange={(e) => setTwoFactor(e.target.checked)}
                style={{ width: 18, height: 18, cursor: 'pointer' }}
              />
            </div>

            <button type="submit" className="btn btn-secondary" style={{ width: '100%', padding: '8px 12px', fontSize: 12 }}>
              Save 2FA Preference
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  label: {
    fontSize: 12,
    fontWeight: 600,
    color: '#9ca3af',
    marginBottom: 4,
    display: 'block',
  },
  input: {
    width: '100%',
    backgroundColor: '#111827',
    border: '1px solid #1f293d',
    borderRadius: 8,
    padding: '10px 12px',
    color: '#f3f4f6',
    fontSize: 13,
  },
  inputReadOnly: {
    width: '100%',
    backgroundColor: '#111827',
    border: '1px solid #1f293d',
    borderRadius: 8,
    padding: '10px 12px',
    color: '#f3f4f6',
    fontSize: 13,
  },
  eyeBtn: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};
