import React, { useState, useEffect } from 'react';
import { stateStore } from '../../services/stateStore';
import type { DepositRequest } from '../../types';
import { Eye, CheckCircle2, XCircle, AlertCircle, Search, ExternalLink, Image as ImageIcon } from 'lucide-react';

export const DepositApproval: React.FC = () => {
  const [, setTick] = useState(0);
  const [selectedDeposit, setSelectedDeposit] = useState<DepositRequest | null>(null);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    return stateStore.subscribe(() => setTick((t) => t + 1));
  }, []);

  const deposits = stateStore.deposits;
  const pendingDeposits = deposits.filter((d) => d.status === 'PENDING');

  const filteredDeposits = deposits.filter((dep) => {
    const matchesFilter = filter === 'ALL' || dep.status === filter;
    const matchesSearch =
      dep.id.toLowerCase().includes(search.toLowerCase()) ||
      dep.userName.toLowerCase().includes(search.toLowerCase()) ||
      dep.userEmail.toLowerCase().includes(search.toLowerCase()) ||
      dep.transactionId.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleApprove = (dep: DepositRequest) => {
    stateStore.approveDeposit(dep.id);
    setToast({
      type: 'success',
      message: `✓ Approved ${dep.id}! $${dep.amount.toFixed(2)} credited to ${dep.userName}'s wallet balance.`,
    });
    setTimeout(() => setToast(null), 4000);
  };

  const handleReject = (dep: DepositRequest) => {
    stateStore.rejectDeposit(dep.id, 'Payment proof or TxID could not be verified on blockchain.');
    setToast({
      type: 'error',
      message: `✕ Rejected deposit ${dep.id} for ${dep.userName}.`,
    });
    setTimeout(() => setToast(null), 4000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#f3f4f6', margin: 0 }}>Deposit Approval Desk</h1>
          <span style={{ fontSize: 13, color: '#9ca3af' }}>
            Inspect Cloudinary payment proofs, verify blockchain transactions, and credit user balances instantly.
          </span>
        </div>
        {pendingDeposits.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, backgroundColor: 'rgba(234, 179, 8, 0.15)', border: '1px solid rgba(234, 179, 8, 0.3)', padding: '6px 14px', borderRadius: 8 }}>
            <AlertCircle size={16} color="#eab308" />
            <span style={{ fontSize: 12, fontWeight: 700, color: '#eab308' }}>
              {pendingDeposits.length} Pending Approval{pendingDeposits.length > 1 ? 's' : ''} Require Action
            </span>
          </div>
        )}
      </div>

      {/* Toast Feedback */}
      {toast && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            backgroundColor: toast.type === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
            color: toast.type === 'success' ? '#10b981' : '#ef4444',
            border: `1px solid ${toast.type === 'success' ? '#10b981' : '#ef4444'}`,
          }}
        >
          {toast.type === 'success' ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Filters & Search */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              style={{
                padding: '6px 14px',
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 700,
                backgroundColor: filter === tab ? (tab === 'PENDING' ? '#eab308' : '#3b82f6') : '#162032',
                color: filter === tab ? (tab === 'PENDING' ? '#000000' : '#ffffff') : '#9ca3af',
                border: '1px solid #1f293d',
                cursor: 'pointer',
              }}
            >
              {tab === 'PENDING' ? `PENDING (${pendingDeposits.length})` : tab}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', minWidth: 260 }}>
          <Search size={14} color="#9ca3af" style={{ position: 'absolute', left: 10, top: 10 }} />
          <input
            type="text"
            placeholder="Search by User, Email, TxID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              backgroundColor: '#162032',
              border: '1px solid #1f293d',
              borderRadius: 6,
              padding: '8px 12px 8px 32px',
              fontSize: 12,
              color: '#f3f4f6',
              outline: 'none',
            }}
          />
        </div>
      </div>

      {/* Deposits Table */}
      <div className="card" style={{ overflowX: 'auto', padding: 0 }}>
        <div className="table-container">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #1f293d', textAlign: 'left' }}>
                <th style={{ padding: '12px 14px' }}>Deposit ID</th>
                <th style={{ padding: '12px 14px' }}>User Details</th>
                <th style={{ padding: '12px 14px' }}>Amount</th>
                <th style={{ padding: '12px 14px' }}>Receipt Proof</th>
                <th style={{ padding: '12px 14px' }}>Gateway & TxID</th>
                <th style={{ padding: '12px 14px' }}>Date</th>
                <th style={{ padding: '12px 14px' }}>Status</th>
                <th style={{ padding: '12px 14px', textAlign: 'right' }}>Admin Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredDeposits.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: 30, color: '#9ca3af', fontSize: 13 }}>
                    No deposit requests found in this view.
                  </td>
                </tr>
              ) : (
                filteredDeposits.map((dep) => (
                  <tr key={dep.id} style={{ borderBottom: '1px solid #1f293d', backgroundColor: dep.status === 'PENDING' ? 'rgba(234, 179, 8, 0.04)' : 'transparent' }}>
                    <td className="mono" style={{ padding: '12px 14px', fontSize: 12, fontWeight: 700, color: '#f3f4f6' }}>
                      {dep.id}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ fontWeight: 800, fontSize: 13, color: '#f3f4f6', display: 'block' }}>{dep.userName}</span>
                      <span style={{ fontSize: 11, color: '#9ca3af' }}>{dep.userEmail}</span>
                    </td>
                    <td className="mono" style={{ padding: '12px 14px', fontWeight: 800, color: '#10b981', fontSize: 14 }}>
                      +${dep.amount.toFixed(2)}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      {dep.proofUrl ? (
                        <div
                          onClick={() => setSelectedDeposit(dep)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
                            cursor: 'pointer',
                            padding: '3px 8px',
                            borderRadius: 6,
                            backgroundColor: '#111827',
                            border: '1px solid #3b82f6',
                          }}
                          title="Click to zoom proof"
                        >
                          <img
                            src={dep.proofUrl}
                            alt="Proof Thumbnail"
                            style={{ width: 28, height: 28, borderRadius: 4, objectFit: 'cover' }}
                          />
                          <span style={{ fontSize: 11, color: '#60a5fa', fontWeight: 700 }}>View Proof</span>
                        </div>
                      ) : (
                        <span style={{ fontSize: 11, color: '#9ca3af', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <ImageIcon size={12} /> None
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#f3f4f6', display: 'block' }}>{dep.paymentMethod}</span>
                      <span className="mono" style={{ fontSize: 11, color: '#06b6d4' }}>{dep.transactionId}</span>
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: 11, color: '#9ca3af' }}>
                      {new Date(dep.createdAt).toLocaleString()}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '3px 10px',
                          borderRadius: 999,
                          fontSize: 11,
                          fontWeight: 800,
                          backgroundColor:
                            dep.status === 'APPROVED' ? 'rgba(16, 185, 129, 0.15)' :
                            dep.status === 'PENDING' ? 'rgba(234, 179, 8, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                          color:
                            dep.status === 'APPROVED' ? '#10b981' :
                            dep.status === 'PENDING' ? '#eab308' : '#ef4444',
                          border: `1px solid ${
                            dep.status === 'APPROVED' ? 'rgba(16, 185, 129, 0.3)' :
                            dep.status === 'PENDING' ? 'rgba(234, 179, 8, 0.3)' : 'rgba(239, 68, 68, 0.3)'
                          }`,
                        }}
                      >
                        {dep.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => setSelectedDeposit(dep)}
                          style={{
                            padding: '5px 10px',
                            fontSize: 11,
                            fontWeight: 600,
                            borderRadius: 6,
                            backgroundColor: '#1f293d',
                            color: '#f3f4f6',
                            border: '1px solid #374151',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                          }}
                        >
                          <Eye size={12} /> Inspect
                        </button>
                        {dep.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => handleApprove(dep)}
                              style={{
                                padding: '5px 12px',
                                fontSize: 11,
                                fontWeight: 700,
                                borderRadius: 6,
                                backgroundColor: '#10b981',
                                color: '#000000',
                                border: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 4,
                              }}
                            >
                              ✓ Approve (+${dep.amount})
                            </button>
                            <button
                              onClick={() => handleReject(dep)}
                              style={{
                                padding: '5px 10px',
                                fontSize: 11,
                                fontWeight: 700,
                                borderRadius: 6,
                                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                                color: '#ef4444',
                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                cursor: 'pointer',
                              }}
                            >
                              ✕ Reject
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Proof Inspection Modal */}
      {selectedDeposit && (
        <div className="modal-overlay" style={styles.overlay} onClick={() => setSelectedDeposit(null)}>
          <div className="modal-card" style={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h3 style={{ fontSize: 17, fontWeight: 800, color: '#f3f4f6', margin: 0 }}>
                Receipt Proof Inspector — {selectedDeposit.id}
              </h3>
              <button
                onClick={() => setSelectedDeposit(null)}
                style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: 18, cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
              <div style={styles.infoRow}>
                <span style={{ color: '#9ca3af', fontSize: 12 }}>Depositor User:</span>
                <span style={{ fontWeight: 700, color: '#f3f4f6' }}>{selectedDeposit.userName} ({selectedDeposit.userEmail})</span>
              </div>
              <div style={styles.infoRow}>
                <span style={{ color: '#9ca3af', fontSize: 12 }}>Deposit Amount:</span>
                <span className="mono" style={{ fontWeight: 800, color: '#10b981', fontSize: 16 }}>
                  +${selectedDeposit.amount.toFixed(2)} USD
                </span>
              </div>
              <div style={styles.infoRow}>
                <span style={{ color: '#9ca3af', fontSize: 12 }}>Blockchain TxID:</span>
                <span className="mono" style={{ color: '#06b6d4', wordBreak: 'break-all', fontSize: 11 }}>{selectedDeposit.transactionId}</span>
              </div>
              <div style={styles.infoRow}>
                <span style={{ color: '#9ca3af', fontSize: 12 }}>Status:</span>
                <span style={{ fontWeight: 700, color: selectedDeposit.status === 'APPROVED' ? '#10b981' : selectedDeposit.status === 'PENDING' ? '#eab308' : '#ef4444' }}>
                  {selectedDeposit.status}
                </span>
              </div>
            </div>

            {/* Proof Image */}
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 11, color: '#9ca3af', fontWeight: 600 }}>
                  Cloudinary Payment Screenshot:
                </span>
                {selectedDeposit.proofUrl && (
                  <a
                    href={selectedDeposit.proofUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: 11, color: '#38bdf8', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}
                  >
                    Open Full Image <ExternalLink size={12} />
                  </a>
                )}
              </div>
              <div style={{ backgroundColor: '#0d1117', borderRadius: 8, padding: 8, border: '1px solid #1f293d' }}>
                <a href={selectedDeposit.proofUrl} target="_blank" rel="noopener noreferrer">
                  <img
                    src={selectedDeposit.proofUrl}
                    alt="Payment Proof"
                    style={{ width: '100%', maxHeight: 280, objectFit: 'contain', borderRadius: 6, cursor: 'pointer' }}
                  />
                </a>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              {selectedDeposit.status === 'PENDING' && (
                <>
                  <button
                    onClick={() => {
                      handleApprove(selectedDeposit);
                      setSelectedDeposit(null);
                    }}
                    style={{
                      flex: 1,
                      padding: '10px 16px',
                      borderRadius: 8,
                      fontWeight: 800,
                      fontSize: 13,
                      backgroundColor: '#10b981',
                      color: '#000000',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    ✓ Approve & Credit +${selectedDeposit.amount.toFixed(2)}
                  </button>
                  <button
                    onClick={() => {
                      handleReject(selectedDeposit);
                      setSelectedDeposit(null);
                    }}
                    style={{
                      flex: 1,
                      padding: '10px 16px',
                      borderRadius: 8,
                      fontWeight: 700,
                      fontSize: 13,
                      backgroundColor: 'rgba(239, 68, 68, 0.15)',
                      color: '#ef4444',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      cursor: 'pointer',
                    }}
                  >
                    ✕ Reject Request
                  </button>
                </>
              )}
              <button
                onClick={() => setSelectedDeposit(null)}
                style={{
                  padding: '10px 16px',
                  borderRadius: 8,
                  fontWeight: 600,
                  fontSize: 13,
                  backgroundColor: '#1f293d',
                  color: '#f3f4f6',
                  border: '1px solid #374151',
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
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
    padding: 22,
    width: '100%',
    maxWidth: 520,
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 13,
    borderBottom: '1px solid #1f293d',
    paddingBottom: 6,
  },
};
