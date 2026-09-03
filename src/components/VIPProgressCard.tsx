import React, { useState, useEffect } from 'react';
import { stateStore } from '../services/stateStore';
import { Crown, Sparkles, ShieldCheck } from 'lucide-react';


interface VIPProgressCardProps {
  onNavigate?: (view: string) => void;
}

export const VIPProgressCard: React.FC<VIPProgressCardProps> = ({ onNavigate }) => {
  const [, setTick] = useState(0);

  useEffect(() => {
    return stateStore.subscribe(() => setTick((t) => t + 1));
  }, []);

  const currentUser = stateStore.currentUser;
  const vipInfo = stateStore.getVIPInfo();

  return (
    <div
      className="card"
      style={{
        backgroundColor: '#162032',
        border: `1px solid ${vipInfo.badgeColor}44`,
        borderRadius: 14,
        padding: 20,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Ambient Glow */}
      <div
        style={{
          position: 'absolute',
          top: -30,
          right: -30,
          width: 140,
          height: 140,
          borderRadius: '50%',
          backgroundColor: vipInfo.badgeColor,
          opacity: 0.12,
          filter: 'blur(30px)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 10,
              backgroundColor: `${vipInfo.badgeColor}20`,
              border: `1px solid ${vipInfo.badgeColor}60`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Crown size={24} color={vipInfo.badgeColor} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 18, fontWeight: 800, color: '#f3f4f6' }}>
                {vipInfo.name}
              </span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  backgroundColor: `${vipInfo.badgeColor}25`,
                  color: vipInfo.badgeColor,
                  padding: '2px 8px',
                  borderRadius: 6,
                  border: `1px solid ${vipInfo.badgeColor}50`,
                }}
              >
                LEVEL {vipInfo.level}
              </span>
            </div>
            <span style={{ fontSize: 12, color: '#9ca3af', marginTop: 2, display: 'block' }}>
              Invested Amount: <strong style={{ color: '#10b981', fontFamily: 'var(--font-mono)' }}>${currentUser.investedAmount.toFixed(2)}</strong>
            </span>
          </div>
        </div>

        {onNavigate && (
          <button
            onClick={() => onNavigate('investment')}
            className="btn btn-secondary"
            style={{
              padding: '8px 14px',
              fontSize: 12,
              backgroundColor: `${vipInfo.badgeColor}15`,
              color: vipInfo.badgeColor,
              borderColor: `${vipInfo.badgeColor}40`,
            }}
          >
            <Sparkles size={14} /> Upgrade VIP Status
          </button>
        )}
      </div>

      {/* VIP Tier Progress Bar */}
      <div style={{ marginTop: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
          <span style={{ color: '#9ca3af', fontWeight: 600 }}>VIP Tier Progress</span>
          <span style={{ color: vipInfo.badgeColor, fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
            {vipInfo.progressPercent}% to Next Level
          </span>
        </div>

        <div style={{ width: '100%', height: 10, backgroundColor: '#0f172a', borderRadius: 6, overflow: 'hidden', border: '1px solid #1f293d' }}>
          <div
            style={{
              width: `${vipInfo.progressPercent}%`,
              height: '100%',
              backgroundColor: vipInfo.badgeColor,
              borderRadius: 6,
              transition: 'width 0.4s ease',
              boxShadow: `0 0 10px ${vipInfo.badgeColor}`,
            }}
          />
        </div>
      </div>

      {/* Perks Badges Grid */}
      <div style={{ marginTop: 16, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {vipInfo.perks.map((perk, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              backgroundColor: '#111827',
              border: '1px solid #1f293d',
              borderRadius: 6,
              padding: '6px 10px',
              fontSize: 11,
              fontWeight: 600,
              color: '#d1d5db',
            }}
          >
            <ShieldCheck size={14} color={vipInfo.badgeColor} />
            <span>{perk}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
