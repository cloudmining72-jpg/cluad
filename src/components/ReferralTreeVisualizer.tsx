import React from 'react';
import { stateStore } from '../services/stateStore';
import { GitFork } from 'lucide-react';

export const ReferralTreeVisualizer: React.FC = () => {
  const currentUser = stateStore.currentUser;
  const network = stateStore.getReferralNetwork(currentUser);
  const level1Refs = network.level1;
  const level2Refs = network.level2;


  return (
    <div
      className="card"
      style={{
        backgroundColor: '#111827',
        border: '1px solid #1f293d',
        borderRadius: 14,
        padding: 20,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              backgroundColor: 'rgba(6, 182, 212, 0.15)',
              border: '1px solid rgba(6, 182, 212, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <GitFork size={20} color="#06b6d4" />
          </div>
          <div>
            <h3 style={{ fontSize: 17, fontWeight: 800, color: '#f3f4f6' }}>
              Interactive Referral Team Network Tree
            </h3>
            <span style={{ fontSize: 12, color: '#9ca3af' }}>
              Multi-Level Team Hierarchy Visualization & Commission Breakdown
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <span style={styles.badgeL1}>Level 1 Direct (20% Bonus) · {level1Refs.length}</span>
          <span style={styles.badgeL2}>Level 2 Sub-Network (10% Bonus) · {level2Refs.length}</span>
        </div>
      </div>

      {/* Visual Tree Canvas Area */}
      <div
        style={{
          backgroundColor: '#0a0e17',
          border: '1px solid #1f293d',
          borderRadius: 12,
          padding: '24px 16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 24,
          position: 'relative',
          overflowX: 'auto',
        }}
      >
        {/* ROOT NODE (YOU) */}
        <div
          style={{
            backgroundColor: '#1e293b',
            border: '2px solid #3b82f6',
            borderRadius: 12,
            padding: '12px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)',
            zIndex: 2,
          }}
        >

          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            style={{ width: 40, height: 40, borderRadius: '50%', border: '2px solid #3b82f6' }}
          />
          <div>
            <span style={{ fontSize: 10, fontWeight: 800, color: '#60a5fa', textTransform: 'uppercase' }}>
              TEAM LEADER (YOU)
            </span>
            <h4 style={{ fontSize: 15, fontWeight: 800, color: '#f3f4f6' }}>{currentUser.name}</h4>
            <span style={{ fontSize: 11, color: '#9ca3af', fontFamily: 'var(--font-mono)' }}>
              Code: {currentUser.referralCode}
            </span>
          </div>
        </div>

        {/* Connecting Line Downward */}
        <div style={{ width: 2, height: 24, backgroundColor: '#3b82f6' }} />

        {/* LEVEL 1 NODES SECTION */}
        <div style={{ textAlign: 'center', width: '100%' }}>
          <span style={{ fontSize: 11, fontWeight: 800, color: '#06b6d4', letterSpacing: '1px', textTransform: 'uppercase' }}>
            ─── LEVEL 1 DIRECT TEAM ({level1Refs.length}) ───
          </span>

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 20,
              flexWrap: 'wrap',
              marginTop: 16,
            }}
          >
            {level1Refs.length === 0 ? (
              <div style={{ fontSize: 13, color: '#64748b', padding: 12 }}>
                No Level 1 direct team members yet.
              </div>
            ) : (
              level1Refs.map((ref) => (
                <div
                  key={ref.id}
                  style={{
                    backgroundColor: '#162032',
                    border: '1px solid rgba(6, 182, 212, 0.4)',
                    borderRadius: 10,
                    padding: 12,
                    minWidth: 200,
                    textAlign: 'left',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ fontSize: 10, fontWeight: 800, color: '#06b6d4' }}>LEVEL 1</span>
                    <span style={{ fontSize: 11, fontWeight: 800, color: '#10b981', fontFamily: 'var(--font-mono)' }}>
                      +${ref.commissionEarned.toFixed(2)}
                    </span>
                  </div>

                  <h5 style={{ fontSize: 14, fontWeight: 700, color: '#f3f4f6' }}>{ref.referredUserName}</h5>
                  <span style={{ fontSize: 11, color: '#9ca3af', wordBreak: 'break-all', display: 'block', marginTop: 2 }}>
                    {ref.referredUserEmail}
                  </span>

                  <div style={{ marginTop: 8, paddingTop: 6, borderTop: '1px solid #1f293d', display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#64748b' }}>
                    <span>Joined: {new Date(ref.registeredAt).toLocaleDateString()}</span>
                    <span style={{ color: '#10b981', fontWeight: 700 }}>QUALIFIED</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Connecting Line Downward */}
        <div style={{ width: 2, height: 24, backgroundColor: '#8b5cf6' }} />

        {/* LEVEL 2 NODES SECTION */}
        <div style={{ textAlign: 'center', width: '100%' }}>
          <span style={{ fontSize: 11, fontWeight: 800, color: '#a855f7', letterSpacing: '1px', textTransform: 'uppercase' }}>
            ─── LEVEL 2 INDIRECT DOWNLINE ({level2Refs.length}) ───
          </span>

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 16,
              flexWrap: 'wrap',
              marginTop: 16,
            }}
          >
            {level2Refs.length === 0 ? (
              <div style={{ fontSize: 13, color: '#64748b', padding: 12 }}>
                No Level 2 downline members yet.
              </div>
            ) : (
              level2Refs.map((ref) => (
                <div
                  key={ref.id}
                  style={{
                    backgroundColor: '#162032',
                    border: '1px solid rgba(168, 85, 247, 0.4)',
                    borderRadius: 10,
                    padding: 12,
                    minWidth: 190,
                    textAlign: 'left',
                  }}
                >

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ fontSize: 10, fontWeight: 800, color: '#a855f7' }}>LEVEL 2</span>
                    <span style={{ fontSize: 11, fontWeight: 800, color: '#10b981', fontFamily: 'var(--font-mono)' }}>
                      +${ref.commissionEarned.toFixed(2)}
                    </span>
                  </div>

                  <h5 style={{ fontSize: 13, fontWeight: 700, color: '#f3f4f6' }}>{ref.referredUserName}</h5>
                  <span style={{ fontSize: 11, color: '#9ca3af', wordBreak: 'break-all', display: 'block', marginTop: 2 }}>
                    {ref.referredUserEmail}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  badgeL1: {
    fontSize: 11,
    fontWeight: 700,
    backgroundColor: 'rgba(6, 182, 212, 0.15)',
    color: '#06b6d4',
    padding: '4px 10px',
    borderRadius: 6,
    border: '1px solid rgba(6, 182, 212, 0.3)',
  },
  badgeL2: {
    fontSize: 11,
    fontWeight: 700,
    backgroundColor: 'rgba(168, 85, 247, 0.15)',
    color: '#a855f7',
    padding: '4px 10px',
    borderRadius: 6,
    border: '1px solid rgba(168, 85, 247, 0.3)',
  },
};
