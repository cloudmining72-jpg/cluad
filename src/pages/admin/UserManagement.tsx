import React, { useState, useEffect } from 'react';
import { stateStore } from '../../services/stateStore';
import type { User } from '../../types';
import { Search, Lock, Unlock, Eye, DollarSign, PlusCircle, MinusCircle, ShieldCheck } from 'lucide-react';
import { showToast } from '../../components/ToastContainer';

export const UserManagement: React.FC = () => {
  const [, setTick] = useState(0);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Balance Adjustment Modal State
  const [adjustTargetUser, setAdjustTargetUser] = useState<User | null>(null);
  const [adjustType, setAdjustType] = useState<'CREDIT' | 'DEBIT'>('CREDIT');
  const [adjustAmount, setAdjustAmount] = useState<number>(50);
  const [adjustReason, setAdjustReason] = useState<string>('Manual Admin Adjustment / Reward');

  useEffect(() => {
    return stateStore.subscribe(() => setTick((t) => t + 1));
  }, []);

  const filteredUsers = stateStore.users.filter((u) => {
    return (
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.id.toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleAdjustBalance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustTargetUser) return;

    const res = stateStore.adjustUserBalance(adjustTargetUser.id, adjustAmount, adjustType, adjustReason);
    if (res.success) {
      showToast(res.message, 'success');
      setAdjustTargetUser(null);
      setAdjustAmount(50);
      setAdjustReason('Manual Admin Adjustment / Reward');
    } else {
      showToast(res.message, 'error');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#f3f4f6' }}>User Management Hub</h1>
          <span style={{ fontSize: 13, color: '#9ca3af' }}>
            Inspect portfolios, verify compliance, adjust balances, or block/unblock accounts
          </span>
        </div>

        <div style={styles.searchBox}>
          <Search size={16} color="#9ca3af" />
          <input
            type="text"
            placeholder="Search by name, email or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
        </div>
      </div>

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>User ID</th>
                <th>Full Name</th>
                <th>Email / Phone</th>
                <th>Country</th>
                <th>Portfolio Balance</th>
                <th>Account Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.id}>
                  <td className="mono" style={{ fontSize: 12 }}>{u.id}</td>
                  <td>
                    <span style={{ fontWeight: 800, fontSize: 14, color: '#f3f4f6' }}>{u.name}</span>
                  </td>
                  <td style={{ fontSize: 12, color: '#9ca3af' }}>
                    {u.email}<br />{u.phone}
                  </td>
                  <td style={{ fontSize: 12 }}>{u.country}</td>
                  <td className="mono" style={{ fontWeight: 800, color: '#10b981' }}>
                    ${u.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td>
                    <span className={`badge ${u.isBlocked ? 'badge-danger' : 'badge-success'}`}>
                      {u.isBlocked ? 'BLOCKED' : 'ACTIVE'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        onClick={() => setSelectedUser(u)}
                        className="btn btn-secondary"
                        style={{ padding: '4px 10px', fontSize: 11 }}
                        title="Inspect User Portfolio"
                      >
                        <Eye size={12} /> Inspect
                      </button>
                      <button
                        onClick={() => setAdjustTargetUser(u)}
                        className="btn btn-primary"
                        style={{ padding: '4px 10px', fontSize: 11, backgroundColor: '#10b981' }}
                        title="Manual Balance Credit / Debit"
                      >
                        <DollarSign size={12} /> Adjust $
                      </button>
                      <button
                        onClick={() => stateStore.toggleUserBlock(u.id)}
                        className={u.isBlocked ? 'btn btn-buy' : 'btn btn-sell'}
                        style={{ padding: '4px 10px', fontSize: 11 }}
                      >
                        {u.isBlocked ? <Unlock size={12} /> : <Lock size={12} />}
                        {u.isBlocked ? 'Unblock' : 'Block'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Balance Credit/Debit Modal */}
      {adjustTargetUser && (
        <div style={styles.overlay}>
          <div style={styles.modalCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#f3f4f6', display: 'flex', alignItems: 'center', gap: 8 }}>
                <DollarSign size={20} color="#10b981" /> Manual Balance Adjustment — {adjustTargetUser.name}
              </h3>
              <span style={{ fontSize: 12, color: '#9ca3af' }}>ID: {adjustTargetUser.id}</span>
            </div>

            <form onSubmit={handleAdjustBalance} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ backgroundColor: '#111827', padding: 12, borderRadius: 8, border: '1px solid #1f293d', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: 11, color: '#9ca3af' }}>Current Available Cash</span>
                  <span className="mono" style={{ fontSize: 16, fontWeight: 800, color: '#10b981', display: 'block' }}>
                    ${adjustTargetUser.availableCash.toFixed(2)}
                  </span>
                </div>
                <div>
                  <span style={{ fontSize: 11, color: '#9ca3af' }}>Total Portfolio Value</span>
                  <span className="mono" style={{ fontSize: 16, fontWeight: 800, color: '#06b6d4', display: 'block' }}>
                    ${adjustTargetUser.balance.toFixed(2)}
                  </span>
                </div>
              </div>

              <div>
                <label style={styles.label}>Action Type</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <button
                    type="button"
                    onClick={() => setAdjustType('CREDIT')}
                    style={{
                      padding: '10px',
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      border: 'none',
                      backgroundColor: adjustType === 'CREDIT' ? '#10b981' : '#111827',
                      color: adjustType === 'CREDIT' ? '#000000' : '#9ca3af',
                      cursor: 'pointer',
                    }}
                  >
                    <PlusCircle size={16} /> CREDIT (+ ADD CASH)
                  </button>

                  <button
                    type="button"
                    onClick={() => setAdjustType('DEBIT')}
                    style={{
                      padding: '10px',
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      border: 'none',
                      backgroundColor: adjustType === 'DEBIT' ? '#ef4444' : '#111827',
                      color: adjustType === 'DEBIT' ? '#ffffff' : '#9ca3af',
                      cursor: 'pointer',
                    }}
                  >
                    <MinusCircle size={16} /> DEBIT (- DEDUCT CASH)
                  </button>
                </div>
              </div>

              <div>
                <label style={styles.label}>Adjustment Amount ($ USD)</label>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(Number(e.target.value))}
                  style={styles.input}
                  required
                />
              </div>

              <div>
                <label style={styles.label}>Reason / Note for User Notification</label>
                <input
                  type="text"
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="e.g. Eid Promo Reward, Refund, Error Correction"
                  style={styles.input}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 1, padding: 12, fontWeight: 800, backgroundColor: adjustType === 'CREDIT' ? '#10b981' : '#ef4444' }}
                >
                  <ShieldCheck size={16} /> CONFIRM {adjustType} (${adjustAmount})
                </button>

                <button
                  type="button"
                  onClick={() => setAdjustTargetUser(null)}
                  className="btn btn-secondary"
                  style={{ padding: '12px 18px' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Inspection Modal */}
      {selectedUser && (
        <div style={styles.overlay}>
          <div style={styles.modalCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#f3f4f6' }}>
                User Portfolio & Audit Inspector — {selectedUser.name}
              </h3>
              <button
                onClick={() => {
                  setSelectedUser(null);
                  setAdjustTargetUser(selectedUser);
                }}
                className="btn btn-primary"
                style={{ padding: '6px 12px', fontSize: 12, fontWeight: 800 }}
              >
                <DollarSign size={14} /> Adjust $
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              <div style={{ backgroundColor: '#111827', padding: 12, borderRadius: 8, border: '1px solid #1f293d' }}>
                <span style={{ fontSize: 11, color: '#9ca3af' }}>User ID:</span>
                <span className="mono" style={{ display: 'block', fontWeight: 700, color: '#f3f4f6' }}>{selectedUser.id}</span>
                <span style={{ fontSize: 11, color: '#9ca3af', marginTop: 6, display: 'block' }}>Email: {selectedUser.email}</span>
                <span style={{ fontSize: 11, color: '#9ca3af', display: 'block' }}>Ref Code: {selectedUser.referralCode}</span>
              </div>
              <div style={{ backgroundColor: '#111827', padding: 12, borderRadius: 8, border: '1px solid #1f293d' }}>
                <span style={{ fontSize: 11, color: '#9ca3af' }}>Total Balance:</span>
                <span className="mono" style={{ display: 'block', fontWeight: 800, color: '#10b981', fontSize: 18 }}>
                  ${selectedUser.balance.toFixed(2)}
                </span>
                <span style={{ fontSize: 11, color: '#9ca3af', marginTop: 4, display: 'block' }}>
                  Available Cash: ${selectedUser.availableCash.toFixed(2)}
                </span>
              </div>
            </div>

            <h4 style={{ fontSize: 14, fontWeight: 700, color: '#f3f4f6', marginBottom: 8 }}>
              Open Positions ({stateStore.positions.filter((p) => p.userId === selectedUser.id).length})
            </h4>
            <div className="table-container" style={{ maxHeight: 180, overflowY: 'auto', marginBottom: 20 }}>
              <table>
                <thead>
                  <tr>
                    <th>Symbol</th>
                    <th>Qty</th>
                    <th>Avg Buy</th>
                    <th>Unrealized P/L</th>
                  </tr>
                </thead>
                <tbody>
                  {stateStore.positions.filter((p) => p.userId === selectedUser.id).map((p) => (
                    <tr key={p.id}>
                      <td style={{ fontWeight: 700 }}>{p.symbol}</td>
                      <td className="mono">{p.quantity}</td>
                      <td className="mono">${p.avgBuyPrice.toFixed(2)}</td>
                      <td className="mono" style={{ color: p.unrealizedPL >= 0 ? '#10b981' : '#ef4444', fontWeight: 700 }}>
                        {p.unrealizedPL >= 0 ? '+' : ''}${p.unrealizedPL.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button onClick={() => setSelectedUser(null)} className="btn btn-secondary" style={{ width: '100%' }}>
              Close Inspector
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#162032',
    border: '1px solid #1f293d',
    borderRadius: 8,
    padding: '8px 14px',
    width: 300,
  },
  searchInput: {
    border: 'none',
    backgroundColor: 'transparent',
    padding: 0,
    width: '100%',
    color: '#f3f4f6',
    fontSize: 13,
  },
  label: {
    fontSize: 12,
    fontWeight: 600,
    color: '#9ca3af',
    marginBottom: 6,
    display: 'block',
  },
  input: {
    width: '100%',
    backgroundColor: '#111827',
    border: '1px solid #1f293d',
    borderRadius: 8,
    padding: '10px 12px',
    color: '#f3f4f6',
    fontSize: 14,
    fontWeight: 600,
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(10, 14, 23, 0.85)',
    backdropFilter: 'blur(6px)',
    zIndex: 300,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  modalCard: {
    backgroundColor: '#162032',
    border: '1px solid #1f293d',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 540,
  },
};
