import React from 'react';
import { stateStore } from '../services/stateStore';
import { LayoutDashboard, TrendingUp, ShieldAlert, Wallet, UserCheck, Zap, Building2 } from 'lucide-react';

interface BottomNavProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentView, onNavigate }) => {
  const isUser = stateStore.currentRole === 'USER';

  const userTabs = [
    { id: 'investment', label: 'Plans', icon: ShieldAlert },
    { id: 'portfolio', label: 'Active', icon: Zap },
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: 'about', label: 'About', icon: Building2 },
    { id: 'profile', label: 'Profile', icon: UserCheck },
  ];


  const adminTabs = [
    { id: 'admin-dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'admin-deposits', label: 'Deposits', icon: Wallet },
    { id: 'admin-withdrawals', label: 'Withdraw', icon: TrendingUp },
    { id: 'admin-support', label: 'Support', icon: ShieldAlert },
    { id: 'admin-settings', label: 'Settings', icon: UserCheck },
  ];

  const tabs = isUser ? userTabs : adminTabs;

  return (
    <nav className="bottom-nav">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentView === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onNavigate(tab.id)}
            className={`bottom-nav-item ${isActive ? 'active' : ''}`}
          >
            <Icon size={20} color={isActive ? (isUser ? '#3b82f6' : '#ef4444') : '#9ca3af'} />
            <span style={{ color: isActive ? (isUser ? '#3b82f6' : '#ef4444') : '#9ca3af' }}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
