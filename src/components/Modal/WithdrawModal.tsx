import React, { useState } from 'react';
import type { PaymentMethodType } from '../../types';
import { stateStore } from '../../services/stateStore';
import { X, CheckCircle2, Lock } from 'lucide-react';
import { showToast } from '../ToastContainer';

interface WithdrawModalProps {
  onClose: () => void;
}

export const WithdrawModal: React.FC<WithdrawModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'NEW_WITHDRAW' | 'WITHDRAW_HISTORY'>('NEW_WITHDRAW');
  const [amount, setAmount] = useState<number>(20);
  const [method, setMethod] = useState<PaymentMethodType>('CRYPTO_USDT');
  const [accountDetails, setAccountDetails] = useState<string>('TRC20 Wallet: T9xY...72kLp');
  const [twoFactorCode, setTwoFactorCode] = useState<string>('123456');
  const [feedback, setFeedback] = useState<{ success?: boolean; message?: string } | null>(null);

  const currentUser = stateStore.currentUser;
  const userWithdrawals = stateStore.withdrawals.filter((w) => w.userId === currentUser.id);
  const eligibility = stateStore.getWithdrawalEligibility(currentUser.id);
  const progressPct = Math.min(100, (eligibility.currentBalance / (eligibility.targetAmount || 1)) * 100);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    const res = stateStore.requestWithdrawal(amount, method, accountDetails);
    setFeedback(res);

    if (res.success) {
      showToast(`Withdrawal request of $${amount} submitted!`, 'success');
      setTimeout(() => {
        setActiveTab('WITHDRAW_HISTORY');
      }, 1400);
    }
  };

  return (
    <div className="modal-overlay" style={styles.overlay}>
      <div className="modal-card" style={styles.modalCard}>
        <div style={styles.header}>
          <div>
            <span style={{ fontWeight: 800, fontSize: 18, color: '#f3f4f6' }}>
              Withdraw Cash & Earnings
            </span>
            <span style={{ fontSize: 12, color: '#9ca3af', display: 'block' }}>
              24-Hour plan clearance & 2x double growth target status
            </span>
          </div>
          <button onClick={onClose} style={styles.closeBtn}>
            <X size={20} color="#9ca3af" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, backgroundColor: '#111827', padding: 4, borderRadius: 8, border: '1px solid #1f293d' }}>
          <button
            onClick={() => setActiveTab('NEW_WITHDRAW')}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 700,
              color: activeTab === 'NEW_WITHDRAW' ? '#ffffff' : '#9ca3af',
              backgroundColor: activeTab === 'NEW_WITHDRAW' ? '#3b82f6' : 'transparent',
              transition: 'all 0.15s',
            }}
          >
            - New Withdrawal
          </button>
          <button
            onClick={() => setActiveTab('WITHDRAW_HISTORY')}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 700,
              color: activeTab === 'WITHDRAW_HISTORY' ? '#ffffff' : '#9ca3af',
              backgroundColor: activeTab === 'WITHDRAW_HISTORY' ? '#3b82f6' : 'transparent',
              transition: 'all 0.15s',
            }}
          >
            📋 Withdraw History ({userWithdrawals.length})
          </button>
        </div>

        {activeTab === 'NEW_WITHDRAW' ? (
          <>
            {/* Eligibility & 2x Target Progress Banner */}
            <div
              style={{
                padding: 12,
                borderRadius: 10,
                marginBottom: 16,
                backgroundColor: eligibility.eligible ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                border: `1px solid ${eligibility.eligible ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontWeight: 700, fontSize: 12, color: eligibility.eligible ? '#10b981' : '#f59e0b' }}>
                  {eligibility.eligible ? '✓ 2x Double Target Achieved — Unlocked!' : '🔒 Withdrawal & Referral Payout Locked'}
                </span>
                <span className="mono" style={{ fontSize: 11, color: '#f3f4f6' }}>
                  {progressPct.toFixed(0)}% Progress
                </span>
              </div>

              <p style={{ fontSize: 11, color: '#9ca3af', margin: '4px 0 8px 0', lineHeight: 1.4 }}>
                {eligibility.reason || 'Capital must reach 2x target via 24h trading before withdrawal is unlocked.'}
              </p>

              {/* Progress Bar */}
              <div style={{ width: '100%', height: 6, backgroundColor: '#111827', borderRadius: 3, overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${progressPct}%`,
                    height: '100%',
                    backgroundColor: eligibility.eligible ? '#10b981' : '#f59e0b',
                    transition: 'width 0.4s ease-out',
                  }}
                />
              </div>
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

            <form onSubmit={handleSubmit}>
              {/* Payment Gateway */}
              <div style={{ marginBottom: 14 }}>
                <label style={styles.label}>Withdrawal Method</label>
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value as PaymentMethodType)}
                  style={styles.select}
                >
                  {stateStore.settings.paymentMethods.filter(pm => pm.enabled).map((pm) => (
                    <option key={pm.id} value={pm.type}>
                      {pm.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Amount */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <label style={styles.label}>Withdrawal Amount ($ USD)</label>
                  <span style={{ fontSize: 11, color: '#10b981' }}>
                    Available: ${currentUser.availableCash.toFixed(2)}
                  </span>
                </div>
                <input
                  type="number"
                  min={stateStore.settings.minWithdrawal}
                  max={currentUser.availableCash}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  style={styles.input}
                />

                {/* Quick Preset Buttons */}
                <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                  {[20, 50, 100, 250, 500].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setAmount(Math.min(preset, currentUser.availableCash))}
                      style={{
                        padding: '4px 10px',
                        borderRadius: 6,
                        fontSize: 11,
                        fontWeight: 700,
                        backgroundColor: amount === preset ? '#3b82f6' : '#111827',
                        color: amount === preset ? '#ffffff' : '#9ca3af',
                        border: '1px solid #1f293d',
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                      }}
                    >
                      ${preset}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setAmount(currentUser.availableCash)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: 6,
                      fontSize: 11,
                      fontWeight: 800,
                      backgroundColor: amount === currentUser.availableCash ? '#10b981' : 'rgba(16, 185, 129, 0.15)',
                      color: amount === currentUser.availableCash ? '#000000' : '#10b981',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    MAX
                  </button>
                </div>
              </div>

              {/* Account Details */}
              <div style={{ marginBottom: 16 }}>
                <label style={styles.label}>USDT (TRC-20) Destination Wallet Address</label>
                <input
                  type="text"
                  value={accountDetails}
                  onChange={(e) => setAccountDetails(e.target.value)}
                  style={styles.input}
                  placeholder="Enter TRON TRC-20 address (e.g. T...)"
                  required
                />
              </div>

              {/* Fee Breakdown Box */}
              <div style={{ backgroundColor: '#111827', border: '1px solid #1f293d', borderRadius: 8, padding: 10, marginBottom: 14, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#9ca3af' }}>
                  <span>Requested Amount:</span>
                  <span className="mono" style={{ color: '#f3f4f6', fontWeight: 700 }}>${amount.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#ef4444' }}>
                  <span>Withdrawal Fee ($1 Fix):</span>
                  <span className="mono" style={{ fontWeight: 700 }}>-$1.00</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#10b981', borderTop: '1px solid #1f293d', paddingTop: 4, fontWeight: 800 }}>
                  <span>Net Payout:</span>
                  <span className="mono">${Math.max(0, amount - 1).toFixed(2)}</span>
                </div>
              </div>

              {/* 2FA Verification */}
              <div style={{ marginBottom: 20 }}>
                <label style={styles.label}>2FA Authentication Code (Authenticator / SMS)</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input
                    type="text"
                    value={twoFactorCode}
                    onChange={(e) => setTwoFactorCode(e.target.value)}
                    style={{ ...styles.input, fontFamily: 'var(--font-mono)', letterSpacing: 4, textAlign: 'center' }}
                    maxLength={6}
                  />
                </div>
              </div>

              <button type="submit" style={styles.submitBtn}>
                <Lock size={16} /> SUBMIT WITHDRAWAL REQUEST
              </button>
            </form>
          </>
        ) : (
          <div className="table-container" style={{ maxHeight: 360, overflowY: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Destination</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {userWithdrawals.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', color: '#9ca3af', padding: 20 }}>
                      No withdrawal records found.
                    </td>
                  </tr>
                ) : (
                  userWithdrawals.map((wth) => (
                    <tr key={wth.id}>
                      <td className="mono" style={{ fontWeight: 800, color: '#ef4444' }}>
                        -${wth.amount.toFixed(2)}
                      </td>
                      <td style={{ fontSize: 11 }}>{wth.paymentMethod}</td>
                      <td className="mono" style={{ fontSize: 10, color: '#9ca3af' }}>
                        {wth.accountDetails.slice(0, 14)}...
                      </td>
                      <td>
                        <span className={`badge status-${wth.status}`}>{wth.status}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
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
    backgroundColor: 'rgba(10, 14, 23, 0.85)',
    backdropFilter: 'blur(6px)',
    zIndex: 999,
  },
  modalCard: {
    backgroundColor: '#162032',
    border: '1px solid #1f293d',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 440,
    boxShadow: '0 20px 50px rgba(0,0,0,0.7)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  closeBtn: {
    padding: 4,
    borderRadius: 6,
    backgroundColor: '#111827',
  },
  label: {
    fontSize: 12,
    fontWeight: 600,
    color: '#9ca3af',
    marginBottom: 6,
    display: 'block',
  },
  select: {
    width: '100%',
    backgroundColor: '#111827',
    border: '1px solid #1f293d',
    borderRadius: 8,
    padding: '10px 14px',
    color: '#f3f4f6',
    fontSize: 13,
  },
  input: {
    width: '100%',
    backgroundColor: '#111827',
    border: '1px solid #1f293d',
    borderRadius: 8,
    padding: '10px 14px',
    color: '#f3f4f6',
    fontSize: 14,
    fontWeight: 600,
  },
  submitBtn: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: 8,
    fontWeight: 800,
    fontSize: 13,
    backgroundColor: '#ef4444',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
  },
};
