import React, { useState } from 'react';
import { stateStore } from '../../services/stateStore';
import { db } from '../../services/db';
import type { PaymentMethodConfig } from '../../types';
import { Save, CreditCard, Trash2, Plus } from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const settings = stateStore.settings;

  const [appName, setAppName] = useState(settings.appName);
  const [supportEmail, setSupportEmail] = useState(settings.supportEmail);
  const [minDeposit, setMinDeposit] = useState(settings.minDeposit);
  const [minWithdrawal, setMinWithdrawal] = useState(settings.minWithdrawal);
  const [tradingFeePercent, setTradingFeePercent] = useState(settings.tradingFeePercent);
  const [referralL1, setReferralL1] = useState(settings.referralLevel1CommissionPercent);
  const [referralL2, setReferralL2] = useState(settings.referralLevel2CommissionPercent);
  const [maintenanceMode, setMaintenanceMode] = useState(settings.maintenanceMode);

  // Dynamic Payment Gateways Config State
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodConfig[]>([
    ...settings.paymentMethods,
  ]);

  // Announcement State
  const [ancEnabled, setAncEnabled] = useState(settings.announcement?.enabled ?? true);
  const [ancMessage, setAncMessage] = useState(settings.announcement?.message ?? '🎉 Special Promo: 200% (2x) Guaranteed Double Return active on all Mining Rig Plans starting from $10!');
  const [ancType, setAncType] = useState<'PROMO' | 'INFO' | 'ALERT' | 'WARNING'>(settings.announcement?.type ?? 'PROMO');
  const [ancLinkText, setAncLinkText] = useState(settings.announcement?.linkText ?? 'Rent Rig Now');

  const [saved, setSaved] = useState(false);

  const handleMethodChange = (id: string, field: keyof PaymentMethodConfig, value: any) => {
    setPaymentMethods((prev) =>
      prev.map((pm) => (pm.id === id ? { ...pm, [field]: value } : pm))
    );
  };

  const handleAddMethod = () => {
    const newId = `pm_custom_${Date.now()}`;
    setPaymentMethods((prev) => [
      ...prev,
      {
        id: newId,
        type: 'BANK_TRANSFER',
        name: 'New Bank / Gateway',
        destinationAddress: 'Account details here',
        instructions: 'Transfer instructions for the user',
        minAmount: 10,
        enabled: false,
      },
    ]);
  };

  const handleDeleteMethod = (id: string) => {
    if (window.confirm('Are you sure you want to delete this payment gateway?')) {
      setPaymentMethods((prev) => prev.filter((pm) => pm.id !== id));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    stateStore.updateSettings({
      appName,
      supportEmail,
      minDeposit: Number(minDeposit),
      minWithdrawal: Number(minWithdrawal),
      tradingFeePercent: Number(tradingFeePercent),
      referralLevel1CommissionPercent: Number(referralL1),
      referralLevel2CommissionPercent: Number(referralL2),
      maintenanceMode,
      paymentMethods,
      announcement: {
        enabled: ancEnabled,
        message: ancMessage,
        type: ancType,
        linkText: ancLinkText,
        createdAt: new Date().toISOString(),
      },
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#f3f4f6' }}>Global Platform Settings & Gateways</h1>
        <span style={{ fontSize: 13, color: '#9ca3af' }}>
          Manage deposit accounts, payment instructions, app branding, trading fees, and security
        </span>
      </div>

      {saved && (
        <div style={{ padding: 12, borderRadius: 8, backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10b981', fontSize: 13 }}>
          Platform configuration & Deposit Gateway accounts updated live!
        </div>
      )}

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Dynamic Deposit Gateways Manager */}
        <div className="card" style={{ border: '1px solid rgba(59, 130, 246, 0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <CreditCard size={20} color="#3b82f6" />
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#f3f4f6' }}>
                Deposit & Withdrawal Payment Gateways
              </h3>
              <span style={{ fontSize: 11, color: '#9ca3af' }}>
                Changes saved here will instantly update the User Deposit & Withdrawal Modals in real time.
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {paymentMethods.map((pm) => (
              <div
                key={pm.id}
                style={{
                  backgroundColor: '#111827',
                  border: '1px solid #1f293d',
                  borderRadius: 10,
                  padding: 14,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontWeight: 800, fontSize: 14, color: '#f3f4f6' }}>{pm.name}</span>
                    <select
                      value={pm.type}
                      onChange={(e) => handleMethodChange(pm.id, 'type', e.target.value)}
                      style={{
                        backgroundColor: '#162032',
                        color: '#06b6d4',
                        border: '1px solid #1f293d',
                        borderRadius: 4,
                        padding: '2px 6px',
                        fontSize: 11,
                        fontWeight: 700,
                        outline: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="CRYPTO_USDT">CRYPTO_USDT</option>
                      <option value="BANK_TRANSFER">BANK_TRANSFER</option>
                      <option value="CREDIT_CARD">CREDIT_CARD</option>
                      <option value="EASYPAISA">EASYPAISA</option>
                      <option value="JAZZCASH">JAZZCASH</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#9ca3af', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={pm.enabled}
                        onChange={(e) => handleMethodChange(pm.id, 'enabled', e.target.checked)}
                        style={{ width: 16, height: 16, cursor: 'pointer' }}
                      />
                      Enable
                    </label>
                    <button
                      type="button"
                      onClick={() => handleDeleteMethod(pm.id)}
                      style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: '#ef4444',
                        cursor: 'pointer',
                        padding: 4,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      title="Delete Gateway"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="grid-2">
                  <div>
                    <label style={styles.label}>Account Details / Address / IBAN / Phone</label>
                    <input
                      type="text"
                      value={pm.destinationAddress}
                      onChange={(e) => handleMethodChange(pm.id, 'destinationAddress', e.target.value)}
                      style={{ ...styles.input, fontFamily: 'var(--font-mono)', color: '#06b6d4', fontWeight: 600 }}
                      required
                    />
                  </div>

                  <div>
                    <label style={styles.label}>Gateway Display Name</label>
                    <input
                      type="text"
                      value={pm.name}
                      onChange={(e) => handleMethodChange(pm.id, 'name', e.target.value)}
                      style={styles.input}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label style={styles.label}>Payment Instructions for Users</label>
                  <input
                    type="text"
                    value={pm.instructions}
                    onChange={(e) => handleMethodChange(pm.id, 'instructions', e.target.value)}
                    style={styles.input}
                  />
                </div>
              </div>
            ))}
            
            <button
              type="button"
              onClick={handleAddMethod}
              style={{
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                border: '1px dashed #3b82f6',
                color: '#3b82f6',
                borderRadius: 10,
                padding: 14,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 8,
                fontSize: 14,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <Plus size={18} />
              Add New Gateway
            </button>
          </div>
        </div>

        {/* Branding & Info */}
        <div className="card">
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#f3f4f6', marginBottom: 14 }}>Branding & General Info</h3>
          <div className="grid-2">
            <div>
              <label style={styles.label}>Application Name</label>
              <input type="text" value={appName} onChange={(e) => setAppName(e.target.value)} style={styles.input} required />
            </div>
            <div>
              <label style={styles.label}>Support Email</label>
              <input type="email" value={supportEmail} onChange={(e) => setSupportEmail(e.target.value)} style={styles.input} required />
            </div>
          </div>
        </div>

        {/* Financial Limits & Fees */}
        <div className="card">
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#f3f4f6', marginBottom: 14 }}>Financial Limits & Fees</h3>
          <div className="grid-3">
            <div>
              <label style={styles.label}>Min Deposit Limit ($)</label>
              <input type="number" value={minDeposit} onChange={(e) => setMinDeposit(Number(e.target.value))} style={styles.input} required />
            </div>
            <div>
              <label style={styles.label}>Min Withdrawal Limit ($)</label>
              <input type="number" value={minWithdrawal} onChange={(e) => setMinWithdrawal(Number(e.target.value))} style={styles.input} required />
            </div>
            <div>
              <label style={styles.label}>Trading Fee (%)</label>
              <input type="number" step="0.01" value={tradingFeePercent} onChange={(e) => setTradingFeePercent(Number(e.target.value))} style={styles.input} required />
            </div>
          </div>
        </div>

        {/* Global Announcement Banner Settings */}
        <div className="card" style={{ border: '1px solid rgba(16, 185, 129, 0.3)', backgroundColor: '#131e2e' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h3 style={{ fontSize: 15, fontWeight: 800, color: '#10b981', display: 'flex', alignItems: 'center', gap: 8 }}>
              📢 Global Broadcast Announcement Banner
            </h3>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, fontWeight: 700, color: ancEnabled ? '#10b981' : '#9ca3af' }}>
              <input
                type="checkbox"
                checked={ancEnabled}
                onChange={(e) => setAncEnabled(e.target.checked)}
                style={{ width: 16, height: 16, cursor: 'pointer' }}
              />
              {ancEnabled ? 'BANNER ENABLED (LIVE)' : 'BANNER DISABLED'}
            </label>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="grid-2">
              <div>
                <label style={styles.label}>Banner Type / Style</label>
                <select
                  value={ancType}
                  onChange={(e) => setAncType(e.target.value as any)}
                  style={styles.input}
                >
                  <option value="PROMO">🎁 PROMO (Emerald / Cyan Gradient)</option>
                  <option value="INFO">ℹ️ INFO (Blue Accent)</option>
                  <option value="ALERT">🚨 ALERT (Amber Caution)</option>
                  <option value="WARNING">⚠️ WARNING (Red Urgent)</option>
                </select>
              </div>

              <div>
                <label style={styles.label}>Action Button Text</label>
                <input
                  type="text"
                  value={ancLinkText}
                  onChange={(e) => setAncLinkText(e.target.value)}
                  placeholder="e.g. Rent Rig Now"
                  style={styles.input}
                />
              </div>
            </div>

            <div>
              <label style={styles.label}>Broadcast Announcement Message</label>
              <input
                type="text"
                value={ancMessage}
                onChange={(e) => setAncMessage(e.target.value)}
                placeholder="Enter announcement text for all users..."
                style={{ ...styles.input, fontWeight: 600 }}
              />
            </div>
          </div>
        </div>

        {/* Referral Tier Rates */}
        <div className="card">
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#f3f4f6', marginBottom: 14 }}>Referral Commission Rates</h3>
          <div className="grid-2">
            <div>
              <label style={styles.label}>Level 1 Direct Referral Commission (%)</label>
              <input type="number" step="0.1" value={referralL1} onChange={(e) => setReferralL1(Number(e.target.value))} style={styles.input} required />
            </div>
            <div>
              <label style={styles.label}>Level 2 Indirect Referral Commission (%)</label>
              <input type="number" step="0.1" value={referralL2} onChange={(e) => setReferralL2(Number(e.target.value))} style={styles.input} required />
            </div>
          </div>
        </div>

        {/* Compliance & Maintenance */}
        <div className="card">
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#f3f4f6', marginBottom: 14 }}>Security & System Toggles</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={styles.toggleRow}>
              <div>
                <span style={{ fontWeight: 700, fontSize: 13, color: '#ef4444' }}>Maintenance Mode</span>
                <span style={{ fontSize: 11, color: '#9ca3af', display: 'block' }}>Blocks non-admin order executions</span>
              </div>
              <input type="checkbox" checked={maintenanceMode} onChange={(e) => setMaintenanceMode(e.target.checked)} style={{ width: 18, height: 18 }} />
            </div>
          </div>
        </div>

        <button type="submit" className="btn btn-primary" style={{ padding: '12px 24px', fontSize: 14 }}>
          <Save size={16} /> Save All Gateways & Platform Settings
        </button>
      </form>

      {/* Database Management & Backup Controls */}
      <div className="card" style={{ backgroundColor: '#162032', border: '1px solid #1f293d' }}>
        <h3 style={{ fontSize: 16, fontWeight: 800, color: '#f3f4f6', marginBottom: 6 }}>
          💾 Database Backup & Management
        </h3>
        <p style={{ fontSize: 12, color: '#9ca3af', marginBottom: 16 }}>
          Export full system database backup JSON file, restore data, or manage local storage schema.
        </p>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button
            onClick={() => {
              const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(db.exportBackupJSON());
              const downloadAnchor = document.createElement('a');
              downloadAnchor.setAttribute("href", dataStr);
              downloadAnchor.setAttribute("download", `claudemining_database_backup_${new Date().toISOString().split('T')[0]}.json`);
              document.body.appendChild(downloadAnchor);
              downloadAnchor.click();
              downloadAnchor.remove();
            }}
            className="btn btn-secondary"
            style={{ backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', borderColor: 'rgba(59, 130, 246, 0.3)', padding: '10px 16px', fontSize: 13 }}
          >
            📥 Download DB Backup (.json)
          </button>

          <button
            onClick={() => {
              if (window.confirm('Reset database to default seed state? All custom records will be refreshed.')) {
                db.resetToFactorySeed();
                window.location.reload();
              }
            }}
            className="btn btn-secondary"
            style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)', padding: '10px 16px', fontSize: 13 }}
          >
            🔄 Reset Database to Seed State
          </button>
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
  toggleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#111827',
    padding: 12,
    borderRadius: 8,
    border: '1px solid #1f293d',
  },
};
