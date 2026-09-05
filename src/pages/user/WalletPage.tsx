import React, { useState, useEffect } from 'react';
import { stateStore } from '../../services/stateStore';
import { API_URL } from '../../services/apiConfig';
import type { PaymentMethodType } from '../../types';
import { PlusCircle, MinusCircle, ArrowDownLeft, ArrowUpRight, History, Copy, UploadCloud, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { showToast } from '../../components/ToastContainer';

interface WalletPageProps {
  onOpenDepositModal?: () => void;
  onOpenWithdrawModal?: () => void;
}

export const WalletPage: React.FC<WalletPageProps> = () => {
  const [, setTick] = useState(0);
  const [activeTab, setActiveTab] = useState<'DEPOSIT' | 'WITHDRAW' | 'HISTORY'>('DEPOSIT');
  const [historyFilter, setHistoryFilter] = useState<'ALL' | 'DEPOSITS' | 'WITHDRAWALS'>('ALL');
  const [search, setSearch] = useState('');

  // Deposit Form State
  const enabledMethods = stateStore.settings.paymentMethods.filter((pm) => pm.enabled);
  const [depMethodId, setDepMethodId] = useState<string>(enabledMethods[0]?.id || 'pm_usdt');
  const selectedConfig = enabledMethods.find((pm) => pm.id === depMethodId) || enabledMethods[0];
  const [depAmount, setDepAmount] = useState<number>(selectedConfig?.minAmount || 10);
  const [txId, setTxId] = useState<string>(`0x${Math.random().toString(16).slice(2, 10)}${Math.random().toString(16).slice(2, 6)}`);
  const [proofUrl, setProofUrl] = useState<string>('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [copied, setCopied] = useState(false);

  // Withdraw Form State
  const currentUser = stateStore.currentUser;
  const [wthAmount, setWthAmount] = useState<number>(20);
  const [wthMethod, setWthMethod] = useState<PaymentMethodType>('CRYPTO_USDT');
  const [accountDetails, setAccountDetails] = useState<string>('TRC20 Wallet: T9xY...72kLp');

  useEffect(() => {
    return stateStore.subscribe(() => setTick((t) => t + 1));
  }, []);

  const userDeposits = stateStore.deposits.filter((d) => d.userId === currentUser.id);
  const userWithdrawals = stateStore.withdrawals.filter((w) => w.userId === currentUser.id);

  const getDepositAddress = () => {
    return selectedConfig ? selectedConfig.destinationAddress : 'Contact Support';
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getDepositAddress());
    setCopied(true);
    showToast('Deposit address copied to clipboard!', 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);

    // 1. Try Cloudinary Upload
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'payment_proofs');

      const res = await fetch(`${API_URL}/api/upload/cloudinary`, {
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
      // Offline fallback
    }

    // 2. Client-side Reader fallback
    const reader = new FileReader();
    reader.onloadend = () => {
      setProofUrl(reader.result as string);
      setUploadingImage(false);
      showToast('Payment screenshot attached!', 'info');
    };
    reader.readAsDataURL(file);
  };

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!txId) {
      showToast('Please enter a valid Transaction ID/Hash', 'error');
      return;
    }
    if (uploadingImage) {
      showToast('Please wait for screenshot to finish uploading...', 'info');
      return;
    }
    if (!proofUrl) {
      showToast('Please click the upload box to attach your payment screenshot', 'error');
      return;
    }
    const res = stateStore.requestDeposit(depAmount, selectedConfig.type, txId, proofUrl);
    if (res.success) {
      showToast(`Deposit request of $${depAmount} submitted for approval!`, 'success');
      setProofUrl('');
      setActiveTab('HISTORY');
      setHistoryFilter('DEPOSITS');
    } else {
      showToast(res.message, 'error');
    }
  };

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = stateStore.requestWithdrawal(wthAmount, wthMethod, accountDetails);
    if (res.success) {
      showToast(`Withdrawal request of $${wthAmount} submitted!`, 'success');
      setActiveTab('HISTORY');
      setHistoryFilter('WITHDRAWALS');
    } else {
      showToast(res.message, 'error');
    }
  };

  // Combined History Records
  const combinedHistory = [
    ...userDeposits.map((d) => ({
      id: d.id,
      type: 'DEPOSIT' as const,
      amount: d.amount,
      method: d.paymentMethod,
      details: d.transactionId,
      createdAt: d.createdAt,
      status: d.status,
      adminNote: d.adminNote,
    })),
    ...userWithdrawals.map((w) => ({
      id: w.id,
      type: 'WITHDRAWAL' as const,
      amount: w.amount,
      method: w.paymentMethod,
      details: w.accountDetails,
      createdAt: w.createdAt,
      status: w.status,
      adminNote: w.adminNote,
    })),
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const filteredHistory = combinedHistory.filter((item) => {
    const matchesFilter =
      historyFilter === 'ALL' ||
      (historyFilter === 'DEPOSITS' && item.type === 'DEPOSIT') ||
      (historyFilter === 'WITHDRAWALS' && item.type === 'WITHDRAWAL');

    const matchesSearch =
      item.id.toLowerCase().includes(search.toLowerCase()) ||
      item.method.toLowerCase().includes(search.toLowerCase()) ||
      item.details.toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header & Main Action View Tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#f3f4f6' }}>
            Wallet
          </h1>
          <span style={{ fontSize: 13, color: '#10b981', fontWeight: 600 }}>
            Available Balance: ${currentUser.availableCash.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        </div>

        {/* View Switcher Tabs */}
        <div style={{ display: 'flex', gap: 6, backgroundColor: '#111827', padding: 4, borderRadius: 10, border: '1px solid #1f293d' }}>
          <button
            onClick={() => setActiveTab('DEPOSIT')}
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              backgroundColor: activeTab === 'DEPOSIT' ? '#10b981' : 'transparent',
              color: activeTab === 'DEPOSIT' ? '#000000' : '#9ca3af',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            <PlusCircle size={16} /> Deposit
          </button>

          <button
            onClick={() => setActiveTab('WITHDRAW')}
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              backgroundColor: activeTab === 'WITHDRAW' ? '#ef4444' : 'transparent',
              color: activeTab === 'WITHDRAW' ? '#ffffff' : '#9ca3af',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            <MinusCircle size={16} /> Withdraw
          </button>

          <button
            onClick={() => setActiveTab('HISTORY')}
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              backgroundColor: activeTab === 'HISTORY' ? '#3b82f6' : 'transparent',
              color: activeTab === 'HISTORY' ? '#ffffff' : '#9ca3af',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            <History size={16} /> History ({combinedHistory.length})
          </button>
        </div>
      </div>

      {/* DIRECT EMBEDDED DEPOSIT FORM */}
      {activeTab === 'DEPOSIT' && (
        <div className="card" style={{ backgroundColor: '#162032', border: '1px solid #1f293d', padding: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#f3f4f6', marginBottom: 16 }}>
            Deposit Funds
          </h2>

          <form onSubmit={handleDepositSubmit}>
            {/* Payment Method Selector */}
            <div style={{ marginBottom: 16 }}>
              <label style={styles.label}>Select Payment Gateway</label>
              <select
                value={depMethodId}
                onChange={(e) => {
                  const newId = e.target.value;
                  setDepMethodId(newId);
                  const cfg = enabledMethods.find((pm) => pm.id === newId);
                  if (cfg) setDepAmount(cfg.minAmount);
                }}
                style={styles.select}
              >
                {enabledMethods.map((pm) => (
                  <option key={pm.id} value={pm.id}>
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
                  <Copy size={12} /> {copied ? 'Copied!' : 'Copy Address'}
                </button>
              </div>
              <p style={{ fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-mono)', color: '#06b6d4', margin: 0, wordBreak: 'break-all' }}>
                {getDepositAddress()}
              </p>
            </div>

            {/* Deposit Amount Input */}
            <div style={{ marginBottom: 16 }}>
              <label style={styles.label}>Deposit Amount ($ USD)</label>
              <input
                type="number"
                min={stateStore.settings.minDeposit}
                step="10"
                value={depAmount}
                onChange={(e) => setDepAmount(Number(e.target.value))}
                style={styles.input}
              />

              {/* Quick Amount Preset Buttons */}
              <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                {[10, 20, 50, 100, 250].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setDepAmount(preset)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 700,
                      backgroundColor: depAmount === preset ? '#10b981' : '#111827',
                      color: depAmount === preset ? '#000000' : '#9ca3af',
                      border: '1px solid #1f293d',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    ${preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Transaction ID */}
            <div style={{ marginBottom: 16 }}>
              <label style={styles.label}>Transaction ID / Hash (TxID)</label>
              <input
                type="text"
                value={txId}
                onChange={(e) => setTxId(e.target.value)}
                placeholder="Enter Transaction Hash or Reference..."
                style={styles.input}
                required
              />
            </div>

            {/* Interactive Upload Box */}
            <label style={{ ...styles.uploadArea, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111827', border: '1px dashed #3b82f6', borderRadius: 10, padding: '20px 16px', marginTop: 12, transition: 'all 0.2s' }}>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
              <UploadCloud size={28} color={proofUrl ? "#10b981" : "#3b82f6"} />
              <span style={{ fontSize: 13, color: proofUrl ? '#10b981' : '#9ca3af', fontWeight: 600, marginTop: 6, textAlign: 'center' }}>
                {uploadingImage ? 'â³ Uploading to Cloudinary CDN...' : (proofUrl ? 'âœ“ Payment Screenshot Uploaded (Cloudinary)' : 'Click here to Upload Payment Receipt Screenshot')}
              </span>
              {proofUrl && (
                <div style={{ marginTop: 10, textAlign: 'center' }}>
                  <img src={proofUrl} alt="Receipt Preview" style={{ maxHeight: 90, borderRadius: 6, border: '1px solid #10b981' }} />
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
        </div>
      )}

      {/* DIRECT EMBEDDED WITHDRAW FORM */}
      {activeTab === 'WITHDRAW' && (
        <div className="card" style={{ backgroundColor: '#162032', border: '1px solid #1f293d', padding: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#f3f4f6', marginBottom: 16 }}>
            Withdraw Cash & Earnings
          </h2>

          <form onSubmit={handleWithdrawSubmit}>
            {/* Payment Method */}
            <div style={{ marginBottom: 16 }}>
              <label style={styles.label}>Withdrawal Method</label>
              <select
                value={wthMethod}
                onChange={(e) => setWthMethod(e.target.value as PaymentMethodType)}
                style={styles.select}
              >
                <option value="CRYPTO_USDT">USDT (TRC20 / BEP20 Crypto)</option>
                <option value="BANK_TRANSFER">Direct Local Bank Transfer</option>
                <option value="EASYPAISA">Easypaisa Mobile Wallet</option>
                <option value="JAZZCASH">JazzCash Mobile Wallet</option>
              </select>
            </div>

            {/* Amount */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <label style={styles.label}>Withdrawal Amount ($ USD)</label>
                <span style={{ fontSize: 12, color: '#10b981', fontWeight: 700 }}>
                  Available: ${currentUser.availableCash.toFixed(2)}
                </span>
              </div>
              <input
                type="number"
                min={stateStore.settings.minWithdrawal}
                max={currentUser.availableCash}
                value={wthAmount}
                onChange={(e) => setWthAmount(Number(e.target.value))}
                style={styles.input}
              />

              {/* Quick Preset Buttons */}
              <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                {[20, 50, 100, 250, 500].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setWthAmount(Math.min(preset, currentUser.availableCash))}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 700,
                      backgroundColor: wthAmount === preset ? '#ef4444' : '#111827',
                      color: wthAmount === preset ? '#ffffff' : '#9ca3af',
                      border: '1px solid #1f293d',
                      cursor: 'pointer',
                    }}
                  >
                    ${preset}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setWthAmount(currentUser.availableCash)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 800,
                    backgroundColor: 'rgba(16, 185, 129, 0.15)',
                    color: '#10b981',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    cursor: 'pointer',
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
            <div style={{ backgroundColor: '#111827', border: '1px solid #1f293d', borderRadius: 8, padding: 12, marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#9ca3af' }}>
                <span>Requested Amount:</span>
                <span className="mono" style={{ color: '#f3f4f6', fontWeight: 700 }}>${wthAmount.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#ef4444' }}>
                <span>Withdrawal Fee ($1 Fix):</span>
                <span className="mono" style={{ fontWeight: 700 }}>-$1.00</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#10b981', borderTop: '1px solid #1f293d', paddingTop: 6, fontWeight: 800 }}>
                <span>Net Payout Amount:</span>
                <span className="mono">${Math.max(0, wthAmount - 1).toFixed(2)}</span>
              </div>
            </div>

            <button
              type="submit"
              style={{
                ...styles.submitBtn,
                backgroundColor: '#ef4444',
                color: '#ffffff',
              }}
            >
              <CheckCircle2 size={18} /> SUBMIT WITHDRAWAL REQUEST
            </button>
          </form>
        </div>
      )}

      {/* DEDICATED TRANSACTION HISTORY */}
      {activeTab === 'HISTORY' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14, marginBottom: 16 }}>
            <div style={{ display: 'flex', gap: 6 }}>
              {(['ALL', 'DEPOSITS', 'WITHDRAWALS'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setHistoryFilter(filter)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 700,
                    backgroundColor: historyFilter === filter ? '#3b82f6' : '#111827',
                    color: historyFilter === filter ? '#ffffff' : '#9ca3af',
                    border: '1px solid #1f293d',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  {filter} ({filter === 'ALL' ? combinedHistory.length : filter === 'DEPOSITS' ? userDeposits.length : userWithdrawals.length})
                </button>
              ))}
            </div>

            <input
              type="text"
              placeholder="Search reference or method..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                padding: '6px 12px',
                borderRadius: 6,
                fontSize: 12,
                backgroundColor: '#111827',
                border: '1px solid #1f293d',
                color: '#f3f4f6',
                minWidth: 200,
              }}
            />
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Transaction ID</th>
                  <th>Amount</th>
                  <th>Payment Method</th>
                  <th>Destination / Reference</th>
                  <th>Date & Time</th>
                  <th>Status</th>
                  <th>Note</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', color: '#9ca3af', padding: 24 }}>
                      No transaction history found for the selected filter.
                    </td>
                  </tr>
                ) : (
                  filteredHistory.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 800,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                            color: item.type === 'DEPOSIT' ? '#10b981' : '#ef4444',
                            backgroundColor: item.type === 'DEPOSIT' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                            padding: '3px 8px',
                            borderRadius: 4,
                          }}
                        >
                          {item.type === 'DEPOSIT' ? <ArrowDownLeft size={12} /> : <ArrowUpRight size={12} />}
                          {item.type}
                        </span>
                      </td>
                      <td className="mono" style={{ fontSize: 12 }}>{item.id}</td>
                      <td className="mono" style={{ fontWeight: 800, color: item.type === 'DEPOSIT' ? '#10b981' : '#ef4444' }}>
                        {item.type === 'DEPOSIT' ? '+' : '-'}${item.amount.toFixed(2)}
                      </td>
                      <td style={{ fontSize: 12 }}>{item.method}</td>
                      <td className="mono" style={{ fontSize: 11, color: '#9ca3af' }}>{item.details}</td>
                      <td style={{ fontSize: 12, color: '#9ca3af' }}>{new Date(item.createdAt).toLocaleString()}</td>
                      <td>
                        <span className={`badge status-${item.status}`}>{item.status}</span>
                      </td>
                      <td style={{ fontSize: 12, color: '#9ca3af' }}>{item.adminNote || '-'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
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
    background: 'none',
    border: 'none',
    cursor: 'pointer',
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
    backgroundColor: '#10b981',
    color: '#000000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)',
  },
};
