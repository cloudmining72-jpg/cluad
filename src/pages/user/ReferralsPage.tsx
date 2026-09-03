import React, { useState, useEffect } from 'react';
import { stateStore } from '../../services/stateStore';
import { Copy, Users, Award, TrendingUp, DollarSign } from 'lucide-react';
import { showToast } from '../../components/ToastContainer';
import { ReferralTreeVisualizer } from '../../components/ReferralTreeVisualizer';

export const ReferralsPage: React.FC = () => {
  const [, setTick] = useState(0);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'ALL' | 'L1' | 'L2'>('ALL');
  const [agentApplied, setAgentApplied] = useState(false);

  useEffect(() => {
    return stateStore.subscribe(() => setTick((t) => t + 1));
  }, []);

  const currentUser = stateStore.currentUser;
  const network = stateStore.getReferralNetwork(currentUser);
  const level1Records = network.level1;
  const level2Records = network.level2;
  const referralRecords = [...level1Records, ...level2Records];

  const l1Commission = network.l1Commission;
  const l2Commission = network.l2Commission;
  const totalCommission = network.totalCommission;

  const qualifiedReferrals = referralRecords.filter((r) => r.status === 'QUALIFIED');
  const pendingReferrals = referralRecords.filter((r) => r.status === 'PENDING');

  const referralLink = `${typeof window !== 'undefined' ? window.location.origin : 'https://claudemining.com'}/#signup?ref=${currentUser.referralCode}`;

  const displayedRecords = referralRecords.filter((r) => {
    if (activeTab === 'L1') return r.level === 1;
    if (activeTab === 'L2') return r.level === 2;
    return true;
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    showToast('Referral link copied to clipboard!', 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Referral Link & 2-Level Multiplier Banner */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(6, 182, 212, 0.08) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.37)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ flex: 1, minWidth: 280 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                ⭐ 2-Level High-Yield Partner Program
              </span>
              <span className="badge" style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.4)' }}>
                Instant Payouts
              </span>
            </div>
            <h2 className="mono" style={{ fontSize: 32, fontWeight: 900, color: '#f3f4f6', margin: '4px 0 8px' }}>
              {currentUser.referralCode}
            </h2>
            <p style={{ fontSize: 13, color: '#d1d5db', lineHeight: 1.6, margin: 0 }}>
              Earn <strong style={{ color: '#10b981', fontSize: 14 }}>20% Instant Cash Bonus</strong> on every deposit made by your direct invites (Level 1), plus <strong style={{ color: '#06b6d4', fontSize: 14 }}>10% Instant Cash Bonus</strong> on all deposits made by their invites (Level 2 sub-network)!
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              backgroundColor: '#0a0e17',
              padding: '12px 16px',
              borderRadius: 10,
              border: '1px solid #1f293d',
              flexWrap: 'wrap',
              width: '100%',
              boxSizing: 'border-box',
            }}
          >
            <span className="mono" style={{ fontSize: 13, color: '#f3f4f6', wordBreak: 'break-all', flex: 1, minWidth: 200 }}>
              {referralLink}
            </span>
            <button onClick={handleCopy} className="btn btn-primary" style={{ padding: '10px 18px', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
              <Copy size={15} /> {copied ? 'Copied Link!' : 'Copy Partner Link'}
            </button>
          </div>
        </div>
      </div>

      {/* 3 Overview Stat Cards */}
      <div className="grid-3">
        {/* Total Earnings */}
        <div className="card" style={{ borderLeft: '4px solid #10b981' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={styles.statLabel}>Total Commission Earned</span>
            <DollarSign size={18} color="#10b981" />
          </div>
          <h2 className="mono" style={{ fontSize: 28, fontWeight: 900, color: '#10b981', marginTop: 6 }}>
            +${totalCommission.toFixed(2)}
          </h2>
          <span style={{ fontSize: 12, color: '#9ca3af', marginTop: 4, display: 'block' }}>
            {qualifiedReferrals.length} active deposits · {pendingReferrals.length} pending
          </span>
        </div>

        {/* Level 1 Direct (20%) */}
        <div className="card" style={{ borderLeft: '4px solid #06b6d4' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={styles.statLabel}>Level 1 Direct Team (20%)</span>
            <Users size={18} color="#06b6d4" />
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: '#f3f4f6', marginTop: 6 }}>
            {level1Records.length} Members
          </h2>
          <span className="mono" style={{ fontSize: 13, color: '#06b6d4', fontWeight: 700, marginTop: 4, display: 'block' }}>
            Earned: +${l1Commission.toFixed(2)} (20% rate)
          </span>
        </div>

        {/* Level 2 Sub-Network (10%) */}
        <div className="card" style={{ borderLeft: '4px solid #f59e0b' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={styles.statLabel}>Level 2 Sub-Network (10%)</span>
            <TrendingUp size={18} color="#f59e0b" />
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: '#f3f4f6', marginTop: 6 }}>
            {level2Records.length} Members
          </h2>
          <span className="mono" style={{ fontSize: 13, color: '#f59e0b', fontWeight: 700, marginTop: 4, display: 'block' }}>
            Earned: +${l2Commission.toFixed(2)} (10% rate)
          </span>
        </div>
      </div>

      {/* Regional Agent Application */}
      {qualifiedReferrals.length >= 5 && (
        <div className="card" style={{ backgroundColor: '#162032', border: '1px solid #f59e0b', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <div style={{ flex: 1, minWidth: 280 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Award size={20} color="#f59e0b" />
                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#f59e0b', margin: 0 }}>Regional Agent Role Unlocked</h3>
              </div>
              <p style={{ fontSize: 13, color: '#9ca3af', marginTop: 6, lineHeight: 1.5 }}>
                You have 5+ active qualified referrals. Apply to become an official Regional Agent and start earning a fixed <strong style={{ color: '#f3f4f6' }}>Monthly Salary</strong> alongside your standard 20% and 10% tier commissions!
              </p>
            </div>
            <button
              onClick={() => {
                showToast('Your application for Regional Agent has been submitted! Our team will review your referrals and contact you soon.', 'success');
                setAgentApplied(true);
              }}
              disabled={agentApplied}
              className="btn btn-primary"
              style={{
                backgroundColor: agentApplied ? '#374151' : '#f59e0b',
                color: agentApplied ? '#9ca3af' : '#000000',
                border: 'none',
                fontWeight: 800,
                padding: '12px 20px',
                cursor: agentApplied ? 'not-allowed' : 'pointer',
              }}
            >
              {agentApplied ? '✓ Application Under Review' : 'Apply for Agent Role'}
            </button>
          </div>
        </div>
      )}

      {/* Interactive Referral Tree Network Visualizer */}
      <ReferralTreeVisualizer />

      {/* Referred Customers Table & Filter Tabs */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
          <div>
            <h3 style={{ fontSize: 17, fontWeight: 800, color: '#f3f4f6' }}>
              Referred Team Member Ledger
            </h3>
            <span style={{ fontSize: 12, color: '#9ca3af' }}>
              Real-time ledger of your direct and sub-network partner registrations
            </span>
          </div>

          <div style={{ display: 'flex', gap: 8, backgroundColor: '#0a0e17', padding: 4, borderRadius: 8, border: '1px solid #1f293d' }}>
            <button
              onClick={() => setActiveTab('ALL')}
              style={{
                padding: '6px 14px',
                fontSize: 12,
                fontWeight: 700,
                borderRadius: 6,
                border: 'none',
                backgroundColor: activeTab === 'ALL' ? '#3b82f6' : 'transparent',
                color: activeTab === 'ALL' ? '#ffffff' : '#9ca3af',
                cursor: 'pointer',
              }}
            >
              All Team ({referralRecords.length})
            </button>
            <button
              onClick={() => setActiveTab('L1')}
              style={{
                padding: '6px 14px',
                fontSize: 12,
                fontWeight: 700,
                borderRadius: 6,
                border: 'none',
                backgroundColor: activeTab === 'L1' ? '#06b6d4' : 'transparent',
                color: activeTab === 'L1' ? '#ffffff' : '#9ca3af',
                cursor: 'pointer',
              }}
            >
              Level 1 (20%) ({level1Records.length})
            </button>
            <button
              onClick={() => setActiveTab('L2')}
              style={{
                padding: '6px 14px',
                fontSize: 12,
                fontWeight: 700,
                borderRadius: 6,
                border: 'none',
                backgroundColor: activeTab === 'L2' ? '#f59e0b' : 'transparent',
                color: activeTab === 'L2' ? '#000000' : '#9ca3af',
                cursor: 'pointer',
              }}
            >
              Level 2 (10%) ({level2Records.length})
            </button>
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Member Name</th>
                <th>Email</th>
                <th>Network Tier</th>
                <th>Commission Rate</th>
                <th>Registered Date</th>
                <th>Total Earned</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {displayedRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', color: '#9ca3af', padding: 30 }}>
                    No referral team members found in this category. Share your partner link to start earning 20% & 10% commissions!
                  </td>
                </tr>
              ) : (
                displayedRecords.map((ref) => (
                  <tr key={ref.id}>
                    <td style={{ fontWeight: 700, color: '#f3f4f6' }}>{ref.referredUserName}</td>
                    <td style={{ fontSize: 12, color: '#9ca3af' }}>{ref.referredUserEmail}</td>
                    <td>
                      <span
                        className="badge"
                        style={{
                          backgroundColor: ref.level === 1 ? 'rgba(6, 182, 212, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                          color: ref.level === 1 ? '#06b6d4' : '#f59e0b',
                          border: `1px solid ${ref.level === 1 ? 'rgba(6, 182, 212, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
                        }}
                      >
                        {ref.level === 1 ? 'Direct (Level 1)' : 'Sub-Network (Level 2)'}
                      </span>
                    </td>
                    <td style={{ fontSize: 13, fontWeight: 700, color: ref.level === 1 ? '#06b6d4' : '#f59e0b' }}>
                      {ref.level === 1 ? '20% on Deposit' : '10% on Deposit'}
                    </td>
                    <td style={{ fontSize: 12, color: '#9ca3af' }}>{new Date(ref.registeredAt).toLocaleDateString()}</td>
                    <td className="mono" style={{ fontWeight: 800, color: ref.status === 'QUALIFIED' ? '#10b981' : '#9ca3af' }}>
                      {ref.status === 'QUALIFIED' ? `+$${(ref.commissionEarned || 0).toFixed(2)}` : '⏳ Awaiting Deposit'}
                    </td>
                    <td>
                      <span
                        className="badge"
                        style={{
                          backgroundColor: ref.status === 'QUALIFIED' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
                          color: ref.status === 'QUALIFIED' ? '#10b981' : '#f59e0b',
                          border: `1px solid ${ref.status === 'QUALIFIED' ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)'}`,
                        }}
                      >
                        {ref.status === 'QUALIFIED' ? '✓ Deposit Verified' : '⏳ Awaiting Deposit'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  statLabel: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: 600,
    textTransform: 'uppercase',
  },
};
