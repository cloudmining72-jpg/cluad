import React, { useState, useEffect } from 'react';
import { stateStore } from '../services/stateStore';
import {
  Shield,
  Bell,
  Search,
  Wallet,
  LogOut,
  Menu,
  Zap,
} from 'lucide-react';


interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onToggleMobileMenu?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, onToggleMobileMenu }) => {
  const [, setTick] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    return stateStore.subscribe(() => setTick((t) => t + 1));
  }, []);

  const isUser = stateStore.currentRole === 'USER';
  const currentUser = stateStore.currentUser;
  const adminUser = stateStore.adminUser;

  // Filter notifications strictly:
  // - Admin gets all system events and user notifications
  // - User ONLY gets their own private notifications or platform announcements
  const currentNotifications = stateStore.notifications.filter((n) => {
    if (!isUser) return true; // Admin gets all
    return n.userId === currentUser.id || n.userId === 'ALL' || n.type === 'ANNOUNCEMENT';
  });

  const unreadNotifs = currentNotifications.filter((n) => !n.read).length;
  const userPlans = stateStore.userPlans.filter((p) => p.userId === currentUser.id && p.status === 'ACTIVE');
  const readyToClaimCount = userPlans.filter((p) => stateStore.getPlanCycleInfo(p).status === 'READY_TO_CLAIM').length;

  const handleSelectAsset = (symbol: string) => {
    stateStore.setSelectedAsset(symbol);
    onNavigate('trade');
    setSearchQuery('');
  };

  const filteredAssets = searchQuery.trim()
    ? stateStore.assets.filter(
        (a) =>
          a.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <header className="navbar" style={styles.navbar}>
      <div style={styles.leftSection}>
        {onToggleMobileMenu && (
          <button className="mobile-menu-btn" onClick={onToggleMobileMenu} style={styles.menuBtn} title="Toggle Navigation">
            <Menu size={22} color="#f3f4f6" />
          </button>
        )}

        <div style={styles.brand} onClick={() => onNavigate(isUser ? 'dashboard' : 'admin-dashboard')}>
          <img
            src="/claudemining-logo.jpg"
            alt="ClaudeMining Logo"
            style={{ width: 38, height: 38, borderRadius: 8, objectFit: 'cover', border: '1px solid rgba(6, 182, 212, 0.4)' }}
          />
          <div className="nav-brand-text">
            <div style={styles.brandTitle}>{stateStore.settings.appName}</div>

            <div style={styles.brandSubtitle}>
              {isUser ? 'Cloud Crypto Mining Platform' : 'Central Admin Management Console'}
            </div>
          </div>
        </div>

        {/* Global Search */}
        <div className="nav-search-container" style={{ position: 'relative', marginLeft: 16 }}>
          <div style={styles.searchBox}>
            <Search size={16} color="#9ca3af" />
            <input
              type="text"
              placeholder="Search assets (e.g. AAPL, BTC, TSLA)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.searchInput}
            />
          </div>
          {filteredAssets.length > 0 && (
            <div style={styles.searchResultsDropdown}>
              {filteredAssets.map((asset) => (
                <div
                  key={asset.symbol}
                  onClick={() => handleSelectAsset(asset.symbol)}
                  style={styles.searchResultItem}
                >
                  <div>
                    <span style={{ fontWeight: 700, color: '#f3f4f6' }}>{asset.symbol}</span>
                    <span style={{ fontSize: 12, color: '#9ca3af', marginLeft: 8 }}>{asset.name}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 600, fontFamily: 'var(--font-mono)' }}>${asset.price.toFixed(2)}</div>
                    <span
                      style={{
                        fontSize: 11,
                        color: asset.change24h >= 0 ? '#10b981' : '#ef4444',
                      }}
                    >
                      {asset.change24h >= 0 ? '+' : ''}
                      {asset.change24h}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={styles.rightSection}>
        {/* Master Admin Indicator Badge (Only shown if logged in as Admin) */}
        {!isUser && (
          <div style={styles.adminStatusBadge}>
            <Shield size={14} color="#ef4444" />
            <span>Master Admin Mode</span>
          </div>
        )}

        {/* User Balance & Active Claim Quick Action (if in User Mode) */}
        {isUser && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Active Blue Claim Button */}
            <button
              onClick={() => onNavigate('portfolio')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                backgroundColor: '#3b82f6',
                color: '#ffffff',
                border: 'none',
                borderRadius: 8,
                padding: '7px 14px',
                fontWeight: 800,
                fontSize: 14,
                cursor: 'pointer',
                boxShadow: readyToClaimCount > 0 ? '0 0 15px rgba(59, 130, 246, 0.8)' : '0 4px 12px rgba(59, 130, 246, 0.4)',
                transition: 'all 0.15s ease-in-out',
              }}
              title="Click to Claim 24h Mining Profit"
            >
              <Zap size={18} color="#ffffff" fill="#ffffff" />
              <span>Active</span>
              {readyToClaimCount > 0 && (
                <span
                  style={{
                    backgroundColor: '#10b981',
                    color: '#000000',
                    fontSize: 10,
                    fontWeight: 900,
                    borderRadius: 10,
                    padding: '1px 6px',
                    marginLeft: 2,
                    boxShadow: '0 0 8px rgba(16, 185, 129, 0.8)',
                  }}
                >
                  {readyToClaimCount}
                </span>
              )}
            </button>

            <div className="nav-balance-pill" style={styles.balancePill} onClick={() => onNavigate('wallet')}>
              <Wallet size={16} color="#3b82f6" />
              <div>
                <span style={{ fontSize: 11, color: '#9ca3af', display: 'block' }}>Amount</span>
                <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', color: '#10b981' }}>
                  ${currentUser.availableCash.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Icon */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            style={styles.iconBtn}
            title="Notifications"
          >
            <Bell size={18} color="#9ca3af" />
            {unreadNotifs > 0 && <span style={styles.badgeCount}>{unreadNotifs}</span>}
          </button>

          {showNotifications && (
            <div className="nav-notification-dropdown" style={styles.notificationDropdown}>
              <div style={styles.notificationHeader}>
                <div>
                  <span style={{ fontWeight: 700, fontSize: 13, color: '#f3f4f6' }}>
                    {isUser ? 'My Notifications' : '🛡️ All Activity & User Alerts'}
                  </span>
                  <span style={{ fontSize: 11, color: '#9ca3af', display: 'block' }}>
                    {unreadNotifs} unread
                  </span>
                </div>
                {unreadNotifs > 0 && (
                  <button
                    onClick={() => stateStore.markAllNotificationsRead()}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#3b82f6',
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div style={{ maxHeight: 320, overflowY: 'auto' }}>
                {currentNotifications.length === 0 ? (
                  <div style={{ padding: 20, textAlign: 'center', color: '#9ca3af', fontSize: 12 }}>
                    No notifications yet
                  </div>
                ) : (
                  currentNotifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => stateStore.markNotificationRead(n.id)}
                      style={{
                        ...styles.notificationItem,
                        backgroundColor: n.read ? 'transparent' : 'rgba(59, 130, 246, 0.08)',
                        cursor: 'pointer',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontWeight: 700, fontSize: 13, color: n.type === 'DEPOSIT' ? '#10b981' : n.type === 'WITHDRAWAL' ? '#f59e0b' : '#f3f4f6' }}>
                          {n.title}
                        </span>
                        <span style={{ fontSize: 10, color: '#6b7280' }}>
                          {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p style={{ fontSize: 12, color: '#9ca3af', margin: 0, lineHeight: 1.4 }}>{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Info Avatar & Logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={styles.profileBadge} onClick={() => onNavigate(isUser ? 'profile' : 'admin-settings')}>
            <img
              src={isUser ? currentUser.avatar : adminUser.avatar}
              alt="User"
              style={styles.avatarImg}
            />
            <div className="nav-profile-text" style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontWeight: 600, fontSize: 13 }}>
                {isUser ? currentUser.name : 'Master Admin'}
              </span>
              <span style={{ fontSize: 11, color: isUser ? '#10b981' : '#f59e0b', fontWeight: 600 }}>
                {isUser ? 'ACCOUNT VERIFIED' : 'SUPERADMIN'}
              </span>


            </div>
          </div>

          <button
            onClick={() => {
              stateStore.logout();
              onNavigate('login');
            }}
            style={{ ...styles.iconBtn, borderColor: 'rgba(239, 68, 68, 0.3)' }}
            title="Log Out"
          >
            <LogOut size={16} color="#ef4444" />
          </button>
        </div>
      </div>
    </header>
  );
};

const styles: Record<string, React.CSSProperties> = {
  navbar: {
    height: 64,
    backgroundColor: '#111827',
    borderBottom: '1px solid #1f293d',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  leftSection: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  menuBtn: {
    display: 'none',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#162032',
    border: '1px solid #1f293d',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    cursor: 'pointer',
  },
  logoBadge: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    border: '1px solid rgba(59, 130, 246, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    fontWeight: 800,
    fontSize: 16,
    color: '#f3f4f6',
    letterSpacing: '-0.3px',
  },
  brandSubtitle: {
    fontSize: 11,
    color: '#9ca3af',
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#162032',
    border: '1px solid #1f293d',
    borderRadius: 8,
    padding: '6px 12px',
    width: 280,
  },
  searchInput: {
    border: 'none',
    backgroundColor: 'transparent',
    padding: 0,
    width: '100%',
    color: '#f3f4f6',
    fontSize: 13,
  },
  searchResultsDropdown: {
    position: 'absolute',
    top: 42,
    left: 0,
    right: 0,
    backgroundColor: '#162032',
    border: '1px solid #1f293d',
    borderRadius: 8,
    boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
    zIndex: 200,
    maxHeight: 280,
    overflowY: 'auto',
  },
  searchResultItem: {
    padding: '10px 14px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
    borderBottom: '1px solid #1f293d',
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
  },
  adminStatusBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: 8,
    padding: '6px 12px',
    fontSize: 12,
    fontWeight: 700,
    color: '#ef4444',
  },
  balancePill: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#162032',
    border: '1px solid #1f293d',
    borderRadius: 8,
    padding: '6px 14px',
    cursor: 'pointer',
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: '#162032',
    border: '1px solid #1f293d',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badgeCount: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#ef4444',
    color: '#fff',
    fontSize: 10,
    fontWeight: 700,
    borderRadius: 10,
    padding: '1px 5px',
  },
  notificationDropdown: {
    position: 'absolute',
    top: 48,
    right: 0,
    width: 320,
    backgroundColor: '#162032',
    border: '1px solid #1f293d',
    borderRadius: 12,
    boxShadow: '0 15px 35px rgba(0,0,0,0.6)',
    zIndex: 200,
    overflow: 'hidden',
  },
  notificationHeader: {
    padding: '12px 16px',
    borderBottom: '1px solid #1f293d',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#111827',
  },
  notificationItem: {
    padding: '12px 16px',
    borderBottom: '1px solid #1f293d',
    cursor: 'pointer',
  },
  profileBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    cursor: 'pointer',
    backgroundColor: '#162032',
    border: '1px solid #1f293d',
    borderRadius: 8,
    padding: '5px 12px',
  },
  avatarImg: {
    width: 30,
    height: 30,
    borderRadius: '50%',
    objectFit: 'cover',
  },
};
