import React, { useState, useEffect } from 'react';
import { stateStore } from '../../services/stateStore';
import {
  Users,
  ArrowDownCircle,
  ArrowUpCircle,
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (view: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const [, setTick] = useState(0);

  useEffect(() => {
    return stateStore.subscribe(() => setTick((t) => t + 1));
  }, []);

  const totalUsers = stateStore.users.length;
  const pendingDeposits = stateStore.deposits.filter((d) => d.status === 'PENDING');
  const pendingWithdrawals = stateStore.withdrawals.filter((w) => w.status === 'PENDING');

  const totalDepositedVolume = stateStore.deposits
    .filter((d) => d.status === 'APPROVED')
    .reduce((acc, d) => acc + d.amount, 0);

  const totalWithdrawnVolume = stateStore.withdrawals
    .filter((w) => w.status === 'COMPLETED')
    .reduce((acc, w) => acc + w.amount, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Top Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#f3f4f6' }}>
            Executive Admin Control Center 🛡️
          </h1>
          <span style={{ fontSize: 13, color: '#9ca3af' }}>
            Real-time platform operation controls, audit logs, & financial clearing desks
          </span>
        </div>

        <span className="badge badge-danger" style={{ padding: '6px 12px', fontSize: 12 }}>
          SUPERADMIN PRIVILEGES ACTIVE
        </span>
      </div>

      {/* 4 Key Executive Stat Cards */}
      <div className="grid-4">
        <div className="card card-hover" onClick={() => onNavigate('admin-users')} style={styles.clickableCard}>
          <div style={styles.metricIconBox}>
            <Users size={20} color="#3b82f6" />
          </div>
          <div>
            <span style={styles.metricLabel}>Total Registered Users</span>
            <h2 className="mono" style={styles.metricValue}>{totalUsers}</h2>
            <span style={{ fontSize: 11, color: '#10b981', fontWeight: 600 }}>Active Accounts</span>
          </div>
        </div>

        <div className="card card-hover" onClick={() => onNavigate('admin-deposits')} style={styles.clickableCard}>
          <div style={{ ...styles.metricIconBox, backgroundColor: 'rgba(16, 185, 129, 0.15)' }}>
            <ArrowDownCircle size={20} color="#10b981" />
          </div>
          <div>
            <span style={styles.metricLabel}>Pending Deposits</span>
            <h2 className="mono" style={{ ...styles.metricValue, color: pendingDeposits.length > 0 ? '#f59e0b' : '#f3f4f6' }}>
              {pendingDeposits.length} Requests
            </h2>
            <span style={{ fontSize: 11, color: '#9ca3af' }}>
              Volume: ${totalDepositedVolume.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="card card-hover" onClick={() => onNavigate('admin-withdrawals')} style={styles.clickableCard}>
          <div style={{ ...styles.metricIconBox, backgroundColor: 'rgba(239, 68, 68, 0.15)' }}>
            <ArrowUpCircle size={20} color="#ef4444" />
          </div>
          <div>
            <span style={styles.metricLabel}>Pending Withdrawals</span>
            <h2 className="mono" style={{ ...styles.metricValue, color: pendingWithdrawals.length > 0 ? '#ef4444' : '#f3f4f6' }}>
              {pendingWithdrawals.length} Requests
            </h2>
            <span style={{ fontSize: 11, color: '#9ca3af' }}>
              Payouts: ${totalWithdrawnVolume.toLocaleString()}
            </span>
          </div>
        </div>

      </div>

      {/* Main Grid: Pending Approvals & Live Support Stream */}
      <div className="grid-2">
        {/* Deposit Queue Quick Review */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#f3f4f6' }}>Pending Deposit Queue</h3>
            <button onClick={() => onNavigate('admin-deposits')} style={{ fontSize: 12, color: '#ef4444', fontWeight: 600 }}>
              Deposit Clearance Desk &rarr;
            </button>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Amount</th>
                  <th>Gateway</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingDeposits.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', color: '#9ca3af', padding: 20 }}>
                      No pending deposit requests in queue.
                    </td>
                  </tr>
                ) : (
                  pendingDeposits.map((dep) => (
                    <tr key={dep.id}>
                      <td style={{ fontWeight: 700 }}>{dep.userName}</td>
                      <td className="mono" style={{ fontWeight: 800, color: '#10b981' }}>+${dep.amount.toFixed(2)}</td>
                      <td style={{ fontSize: 12 }}>{dep.paymentMethod}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button
                            onClick={() => stateStore.approveDeposit(dep.id)}
                            className="btn btn-buy"
                            style={{ padding: '4px 10px', fontSize: 11 }}
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => stateStore.rejectDeposit(dep.id, 'Invalid receipt reference')}
                            className="btn btn-sell"
                            style={{ padding: '4px 10px', fontSize: 11 }}
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Withdrawal Queue Quick Review */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#f3f4f6' }}>Pending Withdrawal Queue</h3>
            <button onClick={() => onNavigate('admin-withdrawals')} style={{ fontSize: 12, color: '#ef4444', fontWeight: 600 }}>
              Withdrawal Payout Desk &rarr;
            </button>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Amount</th>
                  <th>Destination</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingWithdrawals.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', color: '#9ca3af', padding: 20 }}>
                      No pending withdrawal payout requests.
                    </td>
                  </tr>
                ) : (
                  pendingWithdrawals.map((wth) => (
                    <tr key={wth.id}>
                      <td style={{ fontWeight: 700 }}>{wth.userName}</td>
                      <td className="mono" style={{ fontWeight: 800, color: '#ef4444' }}>-${wth.amount.toFixed(2)}</td>
                      <td className="mono" style={{ fontSize: 11, color: '#9ca3af' }}>{wth.accountDetails}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button
                            onClick={() => stateStore.approveWithdrawal(wth.id)}
                            className="btn btn-buy"
                            style={{ padding: '4px 10px', fontSize: 11 }}
                          >
                            Approve Payout
                          </button>
                          <button
                            onClick={() => stateStore.rejectWithdrawal(wth.id, 'Account details unverified')}
                            className="btn btn-sell"
                            style={{ padding: '4px 10px', fontSize: 11 }}
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  clickableCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    cursor: 'pointer',
  },
  metricIconBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  metricLabel: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: 600,
    display: 'block',
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 800,
    color: '#f3f4f6',
    margin: '2px 0',
  },
};
