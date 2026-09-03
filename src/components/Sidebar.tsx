import React, { useState, useEffect } from 'react';
import { stateStore } from '../services/stateStore';
import {
  LayoutDashboard,
  TrendingUp,
  Wallet,
  Users,
  MessageSquare,
  UserCheck,
  ShieldAlert,
  ArrowDownCircle,
  ArrowUpCircle,
  Settings,
  History,
  Zap,
  Building2,
} from 'lucide-react';

import { X } from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; color?: string; style?: React.CSSProperties }>;
  badge?: string;
  count?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, isOpen, onClose }) => {
  const [, setTick] = useState(0);

  useEffect(() => {
    return stateStore.subscribe(() => setTick((t) => t + 1));
  }, []);

  const isUser = stateStore.currentRole === 'USER';
  const pendingDeposits = stateStore.deposits.filter((d) => d.status === 'PENDING').length;
  const pendingWithdrawals = stateStore.withdrawals.filter((w) => w.status === 'PENDING').length;
  const openTickets = stateStore.tickets.filter((t) => t.status === 'OPEN' || t.status === 'IN_PROGRESS').length;

  const userMenuItems: MenuItem[] = [
    { id: 'markets', label: 'Market', icon: TrendingUp },
    { id: 'investment', label: 'Plans', icon: ShieldAlert },
    { id: 'portfolio', label: 'Active', icon: Zap },
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: 'referrals', label: 'Referrals', icon: Users },
    { id: 'support', label: 'Support', icon: MessageSquare, badge: openTickets > 0 ? `${openTickets}` : undefined },
    { id: 'profile', label: 'Profile', icon: UserCheck },
    { id: 'about', label: 'About Us', icon: Building2 },
  ];

  const adminMenuItems: MenuItem[] = [
    { id: 'admin-dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
    { id: 'admin-users', label: 'User Management', icon: Users },
    { id: 'admin-deposits', label: 'Deposit Approvals', icon: ArrowDownCircle, count: pendingDeposits },
    { id: 'admin-withdrawals', label: 'Withdrawal Queue', icon: ArrowUpCircle, count: pendingWithdrawals },
    { id: 'admin-support', label: 'Live Support Desk', icon: MessageSquare, count: openTickets },
    { id: 'admin-markets', label: 'Market & News Control', icon: TrendingUp },
    { id: 'admin-audit', label: 'Audit & Compliance', icon: History },
    { id: 'admin-settings', label: 'Platform Settings', icon: Settings },
  ];

  const items = isUser ? userMenuItems : adminMenuItems;

  const handleItemClick = (id: string) => {
    onNavigate(id);
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile Drawer Backdrop Overlay */}
      {isOpen && (
        <div
          className="sidebar-backdrop"
          onClick={onClose}
        />
      )}

      <aside className={`sidebar-container ${isOpen ? 'mobile-open' : ''}`} style={styles.sidebar}>
        <div style={styles.sectionHeader}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
            {isUser ? 'Mining Application' : 'Admin Operations'}
          </span>
          {onClose && (
            <button className="sidebar-close-btn" onClick={onClose} style={styles.closeBtn}>
              <X size={20} color="#9ca3af" />
            </button>
          )}
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                style={{
                  ...styles.navItem,
                  ...(isActive ? (isUser ? styles.navItemActiveUser : styles.navItemActiveAdmin) : {}),
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Icon size={18} color={isActive ? '#ffffff' : '#9ca3af'} />
                  <span style={{ fontSize: 13, fontWeight: isActive ? 700 : 500 }}>{item.label}</span>
                </div>
                {item.badge && (
                  <span style={styles.badgeLabel}>{item.badge}</span>
                )}
                {item.count !== undefined && item.count > 0 && (
                  <span style={styles.badgeCount}>{item.count}</span>
                )}
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

const styles: Record<string, React.CSSProperties> = {
  sidebar: {
    width: 260,
    backgroundColor: '#111827',
    borderRight: '1px solid #1f293d',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    gap: 16,
    padding: '16px 12px',
    userSelect: 'none',
  },
  sectionHeader: {
    padding: '8px 12px 12px 12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  closeBtn: {
    padding: 4,
    borderRadius: 6,
    display: 'none',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 14px',
    borderRadius: 8,
    color: '#9ca3af',
    transition: 'all 0.15s',
    textAlign: 'left',
    width: '100%',
  },
  navItemActiveUser: {
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
  },
  navItemActiveAdmin: {
    backgroundColor: '#ef4444',
    color: '#ffffff',
    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
  },
  badgeLabel: {
    fontSize: 10,
    fontWeight: 700,
    backgroundColor: 'rgba(6, 182, 212, 0.2)',
    color: '#06b6d4',
    padding: '2px 6px',
    borderRadius: 4,
    border: '1px solid rgba(6, 182, 212, 0.4)',
  },
  badgeCount: {
    fontSize: 11,
    fontWeight: 800,
    backgroundColor: '#ef4444',
    color: '#ffffff',
    padding: '2px 7px',
    borderRadius: 10,
  },
  sidebarFooter: {
    marginTop: 'auto',
    paddingTop: 16,
  },
  footerCard: {
    backgroundColor: '#162032',
    border: '1px solid #1f293d',
    borderRadius: 10,
    padding: 12,
  },
};
