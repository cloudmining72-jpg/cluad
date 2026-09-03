import React, { useState } from 'react';
import type { PaymentMethodType } from '../../types';
import { stateStore } from '../../services/stateStore';
import { X, Copy, CheckCircle2, UploadCloud, ShieldCheck } from 'lucide-react';
import { showToast } from '../ToastContainer';

interface DepositModalProps {
  onClose: () => void;
}

export const DepositModal: React.FC<DepositModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'NEW_DEPOSIT' | 'DEPOSIT_HISTORY'>('NEW_DEPOSIT');
  const enabledMethods = stateStore.settings.paymentMethods.filter((pm) => pm.enabled);
  const [method, setMethod] = useState<PaymentMethodType>(enabledMethods[0]?.type || 'CRYPTO_USDT');
  const selectedConfig = enabledMethods.find((pm) => pm.type === method) || enabledMethods[0];

  const [amount, setAmount] = useState<number>(selectedConfig?.minAmount || 10);
  const [txId, setTxId] = useState<string>('');
  const [proofUrl, setProofUrl] = useState<string>('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<{ success?: boolean; message?: string } | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setFeedback(null);

    // 1. Try uploading to Backend Cloudinary API
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'payment_proofs');

      const res = await fetch('http://localhost:5000/api/upload/cloudinary', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (data.success && data.url) {
        setProofUrl(data.url);
        setUploadingImage(false);
        showToast('Payment screenshot uploaded to Cloudinary!', 'success');
        return;
      }
    } catch (_err) {
      // Fallback to direct client-side reader
    }

    // 2. Client-side fallback
    const reader = new FileReader();
    reader.onloadend = () => {
      setProofUrl(reader.result as string);
      setUploadingImage(false);
      showToast('Payment screenshot attached!', 'info');
    };
    reader.readAsDataURL(file);
  };

  const currentUser = stateStore.currentUser;
  const userDeposits = stateStore.deposits.filter((d) => d.userId === currentUser.id);

  const getDepositAddress = () => {
    return selectedConfig ? selectedConfig.destinationAddress : 'Contact Support';
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getDepositAddress());
    setCopied(true);
    showToast('Deposit address copied to clipboard!', 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!txId) {
      setFeedback({ success: false, message: 'Please enter a valid Transaction ID/Hash.' });
      return;
    }
    if (uploadingImage) {
      setFeedback({ success: false, message: 'Please wait for the image to finish uploading.' });
      return;
    }
    if (!proofUrl) {
      setFeedback({ success: false, message: 'Please upload a screenshot of your payment receipt.' });
      return;
    }
    const res = stateStore.requestDeposit(amount, method, txId, proofUrl);
    setFeedback(res);
    if (res.success) {
      showToast(`Deposit request of $${amount} submitted for approval!`, 'success');
      setTimeout(() => {
        setActiveTab('DEPOSIT_HISTORY');
      }, 1400);
    }
  };

  return (
    <div className="modal-overlay" style={styles.overlay}>
      <div className="modal-card" style={styles.modalCard}>
        <div style={styles.header}>
          <div>
            <span style={{ fontWeight: 800, fontSize: 18, color: '#f3f4f6' }}>
              Deposit Funds
            </span>
            <span style={{ fontSize: 12, color: '#9ca3af', display: 'block' }}>
              Select payment method & submit transaction proof
            </span>
          </div>
          <button onClick={onClose} style={styles.closeBtn}>
            <X size={20} color="#9ca3af" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, backgroundColor: '#111827', padding: 4, borderRadius: 8, border: '1px solid #1f293d' }}>
          <button
            onClick={() => setActiveTab('NEW_DEPOSIT')}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 700,
              color: activeTab === 'NEW_DEPOSIT' ? '#ffffff' : '#9ca3af',
              backgroundColor: activeTab === 'NEW_DEPOSIT' ? '#3b82f6' : 'transparent',
              transition: 'all 0.15s',
            }}
          >
            + New Deposit
          </button>
          <button
            onClick={() => setActiveTab('DEPOSIT_HISTORY')}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 700,
              color: activeTab === 'DEPOSIT_HISTORY' ? '#ffffff' : '#9ca3af',
              backgroundColor: activeTab === 'DEPOSIT_HISTORY' ? '#3b82f6' : 'transparent',
              transition: 'all 0.15s',
            }}
          >
            ðŸ“‹ Deposit History ({userDeposits.length})
          </button>
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

        {activeTab === 'NEW_DEPOSIT' ? (
          <form onSubmit={handleSubmit}>
            {/* Payment Method Selector */}
            <div style={{ marginBottom: 16 }}>
              <label style={styles.label}>Select Payment Gateway</label>
              <select
                value={method}
                onChange={(e) => {
                  const newMethod = e.target.value as PaymentMethodType;
                  setMethod(newMethod);
                  const cfg = enabledMethods.find((pm) => pm.type === newMethod);
                  if (cfg) setAmount(cfg.minAmount);
                }}
                style={styles.select}
              >
                {enabledMethods.map((pm) => (
                  <option key={pm.id} value={pm.type}>
                    {pm.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Payment Instructions Box */}
            <div style={styles.addressBox}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 11, color: '#9ca3af', fontWeight: 600 }}>Payment Destination / Address</span>
                <button type="button" onClick={handleCopy} style={styles.copyBtn}>
                  <Copy size={12} /> {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <p style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-mono)', color: '#06b6d4', margin: 0, wordBreak: 'break-all' }}>
                {getDepositAddress()}
              </p>
            </div>

            {/* Amount */}
            <div style={{ marginBottom: 16 }}>
              <label style={styles.label}>Deposit Amount ($ USD)</label>
              <input
                type="number"
                min={stateStore.settings.minDeposit}
                step="10"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                style={styles.input}
              />
              
              {/* Quick Amount Preset Buttons */}
              <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                {[10, 20, 50, 100, 250].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setAmount(preset)}
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
              </div>

              <span style={{ fontSize: 11, color: '#6b7280', marginTop: 4, display: 'block' }}>
                Min deposit: ${stateStore.settings.minDeposit}
              </span>
            </div>


            {/* Transaction ID */}
            <div style={{ marginBottom: 16 }}>
              <label style={styles.label}>Transaction ID / Hash</label>
              <input
                type="text"
                value={txId}
                onChange={(e) => setTxId(e.target.value)}
                placeholder="Enter Transaction ID"
                style={styles.input}
                required
              />
            </div>

            {/* Actual Upload Box */}
            <label style={{...styles.uploadArea, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload} 
                style={{ display: 'none' }} 
              />
              <UploadCloud size={24} color={proofUrl ? "#10b981" : "#3b82f6"} />
              <span style={{ fontSize: 12, color: proofUrl ? '#10b981' : '#9ca3af', fontWeight: 600, marginTop: 4, textAlign: 'center' }}>
                {uploadingImage ? 'â³ Uploading to Cloudinary CDN...' : (proofUrl ? 'âœ“ Payment Screenshot Uploaded to Cloudinary' : 'Click to Upload Payment Receipt Screenshot')}
              </span>
              {proofUrl && (
                <div style={{ marginTop: 10, textAlign: 'center' }}>
                  <img src={proofUrl} alt="Receipt Preview" style={{ maxHeight: 80, borderRadius: 6, border: '1px solid #10b981' }} />
                  <span style={{ display: 'block', fontSize: 10, color: '#10b981', marginTop: 4, fontWeight: 700 }}>
                    â˜ï¸ Cloudinary Verified
                  </span>
                </div>
              )}
            </label>

            <button type="submit" style={styles.submitBtn} disabled={uploadingImage}>
              <ShieldCheck size={18} /> {uploadingImage ? 'UPLOADING SCREENSHOT...' : 'SUBMIT DEPOSIT'}
            </button>
          </form>
        ) : (
          <div className="table-container" style={{ maxHeight: 360, overflowY: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Tx Ref</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {userDeposits.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', color: '#9ca3af', padding: 20 }}>
                      No deposit records found.
                    </td>
                  </tr>
                ) : (
                  userDeposits.map((dep) => (
                    <tr key={dep.id}>
                      <td className="mono" style={{ fontWeight: 800, color: '#10b981' }}>
                        +${dep.amount.toFixed(2)}
                      </td>
                      <td style={{ fontSize: 11 }}>{dep.paymentMethod}</td>
                      <td className="mono" style={{ fontSize: 10, color: '#9ca3af' }}>
                        {dep.transactionId.slice(0, 10)}...
                      </td>
                      <td>
                        <span className={`badge status-${dep.status}`}>{dep.status}</span>
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
    zIndex: 999,
  },
  modalCard: {
    backgroundColor: '#162032',
    border: '1px solid #1f293d',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 460,
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
  addressBox: {
    backgroundColor: '#111827',
    border: '1px solid #1f293d',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  copyBtn: {
    fontSize: 11,
    color: '#3b82f6',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  },
  uploadArea: {
    border: '1px dashed #3b82f6',
    borderRadius: 8,
    padding: 16,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(59, 130, 246, 0.05)',
    marginBottom: 20,
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
    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
  },
};
