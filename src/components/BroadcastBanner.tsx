import React, { useState } from 'react';
import { stateStore } from '../services/stateStore';
import { Sparkles, Info, AlertTriangle, X, ArrowRight } from 'lucide-react';

interface BroadcastBannerProps {
  onNavigate?: (view: string) => void;
}

export const BroadcastBanner: React.FC<BroadcastBannerProps> = ({ onNavigate }) => {
  const [dismissed, setDismissed] = useState(false);
  const announcement = stateStore.settings.announcement;

  if (!announcement || !announcement.enabled || !announcement.message || dismissed) {
    return null;
  }

  const getTypeStyles = () => {
    switch (announcement.type) {
      case 'PROMO':
        return {
          bg: 'linear-gradient(90deg, #10b981 0%, #06b6d4 50%, #3b82f6 100%)',
          textColor: '#ffffff',
          badgeBg: 'rgba(0, 0, 0, 0.25)',
          badgeText: '#ffffff',
          icon: <Sparkles size={18} color="#ffffff" />,
        };
      case 'ALERT':
        return {
          bg: 'linear-gradient(90deg, #f59e0b 0%, #d97706 100%)',
          textColor: '#ffffff',
          badgeBg: 'rgba(0, 0, 0, 0.25)',
          badgeText: '#ffffff',
          icon: <AlertTriangle size={18} color="#ffffff" />,
        };
      case 'WARNING':
        return {
          bg: 'linear-gradient(90deg, #ef4444 0%, #b91c1c 100%)',
          textColor: '#ffffff',
          badgeBg: 'rgba(0, 0, 0, 0.25)',
          badgeText: '#ffffff',
          icon: <AlertTriangle size={18} color="#ffffff" />,
        };
      case 'INFO':
      default:
        return {
          bg: 'linear-gradient(90deg, #3b82f6 0%, #1d4ed8 100%)',
          textColor: '#ffffff',
          badgeBg: 'rgba(255, 255, 255, 0.2)',
          badgeText: '#ffffff',
          icon: <Info size={18} color="#ffffff" />,
        };
    }
  };

  const styleConfig = getTypeStyles();

  return (
    <div
      style={{
        background: styleConfig.bg,
        color: styleConfig.textColor,
        padding: '10px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        fontSize: 13,
        fontWeight: 600,
        position: 'relative',
        zIndex: 50,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 260 }}>
        {styleConfig.icon}
        <span
          style={{
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: 0.5,
            padding: '2px 8px',
            borderRadius: 4,
            backgroundColor: styleConfig.badgeBg,
            color: styleConfig.badgeText,
            textTransform: 'uppercase',
          }}
        >
          {announcement.type}
        </span>
        <span style={{ lineHeight: 1.4 }}>{announcement.message}</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {announcement.linkText && onNavigate && (
          <button
            onClick={() => onNavigate('investment')}
            style={{
              backgroundColor: '#ffffff',
              color: '#0f172a',
              border: 'none',
              borderRadius: 6,
              padding: '5px 12px',
              fontSize: 12,
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              transition: 'transform 0.15s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.03)')}
            onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            {announcement.linkText} <ArrowRight size={13} />
          </button>
        )}

        <button
          onClick={() => setDismissed(true)}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'rgba(255, 255, 255, 0.8)',
            cursor: 'pointer',
            padding: 4,
            display: 'flex',
            alignItems: 'center',
            borderRadius: 4,
          }}
          title="Dismiss Announcement"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};
