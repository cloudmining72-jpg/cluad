import React, { useState, useEffect } from 'react';
import { stateStore } from '../../services/stateStore';
import { ShieldCheck } from 'lucide-react';

export const WithdrawApproval: React.FC = () => {
  const [, setTick] = useState(0);

  useEffect(() => {
    return stateStore.subscribe(() => setTick((t) => t + 1));
  }, []);

  const withdrawals = stateStore.withdrawals;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#f3f4f6' }}>Withdrawal Payout Desk</h1>
        <span style={{ fontSize: 13, color: '#9ca3af' }}>
          Review requested cash withdrawals, check security compliance, and dispatch funds
        </span>
      </div>

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Withdrawal ID</th>
                <th>User Details</th>
                <th>Amount</th>
                <th>Payout Channel</th>
                <th>Destination Account</th>
                <th>2FA Status</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {withdrawals.map((wth) => (
                <tr key={wth.id}>
                  <td className="mono" style={{ fontSize: 12 }}>{wth.id}</td>
                  <td>
                    <span style={{ fontWeight: 800, fontSize: 13, color: '#f3f4f6' }}>{wth.userName}</span>
                    <span style={{ fontSize: 11, color: '#9ca3af', display: 'block' }}>{wth.userEmail}</span>
                  </td>
                  <td className="mono" style={{ fontSize: 13 }}>
                    <span style={{ fontWeight: 800, color: '#ef4444', display: 'block' }}>-${wth.amount.toFixed(2)}</span>
                    <span style={{ fontSize: 10, color: '#9ca3af', display: 'block' }}>Fee: -$1.00</span>
                    <span style={{ fontSize: 11, color: '#10b981', fontWeight: 800, display: 'block' }}>Net: ${(wth.netAmount || (wth.amount - 1)).toFixed(2)}</span>
                  </td>
                  <td style={{ fontSize: 12 }}>{wth.paymentMethod}</td>
                  <td className="mono" style={{ fontSize: 11, color: '#06b6d4' }}>{wth.accountDetails}</td>
                  <td>
                    <span className="badge badge-success">
                      <ShieldCheck size={12} /> VERIFIED
                    </span>
                  </td>
                  <td style={{ fontSize: 12, color: '#9ca3af' }}>{new Date(wth.createdAt).toLocaleString()}</td>
                  <td>
                    <span className={`badge status-${wth.status}`}>{wth.status}</span>
                  </td>
                  <td>
                    {(wth.status === 'PENDING' || wth.status === 'UNDER_REVIEW') && (
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          onClick={() => stateStore.approveWithdrawal(wth.id)}
                          className="btn btn-buy"
                          style={{ padding: '4px 10px', fontSize: 11 }}
                        >
                          Approve Payout
                        </button>
                        <button
                          onClick={() => stateStore.rejectWithdrawal(wth.id, 'Destination account invalid')}
                          className="btn btn-sell"
                          style={{ padding: '4px 10px', fontSize: 11 }}
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
