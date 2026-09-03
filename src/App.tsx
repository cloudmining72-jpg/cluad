import { useState, useEffect } from 'react';
import { stateStore } from './services/stateStore';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { ToastContainer } from './components/ToastContainer';
import { BroadcastBanner } from './components/BroadcastBanner';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { SignupPage } from './pages/auth/SignupPage';

// User Pages
import { UserDashboard } from './pages/user/UserDashboard';
import { MarketsPage } from './pages/user/MarketsPage';
import { StockDetailPage } from './pages/user/StockDetailPage';
import { PortfolioPage } from './pages/user/PortfolioPage';
import { InvestmentPage } from './pages/user/InvestmentPage';
import { WalletPage } from './pages/user/WalletPage';
import { ReferralsPage } from './pages/user/ReferralsPage';
import { SupportPage } from './pages/user/SupportPage';
import { ProfilePage } from './pages/user/ProfilePage';
import { AboutPage } from './pages/user/AboutPage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { UserManagement } from './pages/admin/UserManagement';
import { DepositApproval } from './pages/admin/DepositApproval';
import { WithdrawApproval } from './pages/admin/WithdrawApproval';
import { AdminSupportDesk } from './pages/admin/AdminSupportDesk';
import { MarketManagement } from './pages/admin/MarketManagement';
import { AuditLogsPage } from './pages/admin/AuditLogsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

// Modals
import { TradeModal } from './components/Modal/TradeModal';
import { DepositModal } from './components/Modal/DepositModal';
import { WithdrawModal } from './components/Modal/WithdrawModal';

export function App() {
  const [currentView, setCurrentView] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      let ref = searchParams.get('ref') || searchParams.get('referral');
      if (!ref && window.location.hash.includes('ref=')) {
        const match = window.location.hash.match(/ref=([a-zA-Z0-9_-]+)/);
        if (match) ref = match[1];
      }
      if (ref) {
        localStorage.setItem('claudemining_pending_ref_code', ref.trim().toUpperCase());
        sessionStorage.setItem('claudemining_pending_ref_code', ref.trim().toUpperCase());
      }
      if (window.location.hash.includes('signup') || window.location.search.includes('signup')) {
        return 'signup';
      }
    }
    return 'dashboard';
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [, setTick] = useState(0);

  // Modal states
  const [tradeModalAsset, setTradeModalAsset] = useState<string | null>(null);
  const [tradeModalSide, setTradeModalSide] = useState<'BUY' | 'SELL'>('BUY');
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  useEffect(() => {
    return stateStore.subscribe(() => setTick((t) => t + 1));
  }, []);

  const handleNavigate = (view: string) => {
    setCurrentView(view);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenTradeModal = (symbol: string, side: 'BUY' | 'SELL' = 'BUY') => {
    setTradeModalAsset(symbol);
    setTradeModalSide(side);
  };

  const isUser = stateStore.currentRole === 'USER';
  const selectedAsset = stateStore.assets.find((a) => a.symbol === (tradeModalAsset || stateStore.selectedAssetSymbol)) || stateStore.assets[0];

  // Unauthenticated or Auth Route Override
  if (!stateStore.isAuthenticated || currentView === 'login' || currentView === 'signup') {
    return (
      <div className="auth-wrapper" style={{ minHeight: '100vh', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#0a0e17', padding: '12px' }}>
        <div style={{ width: '100%', maxWidth: 500 }}>
          {currentView === 'signup' ? (
            <SignupPage
              onSwitchToLogin={() => handleNavigate('login')}
              onSignupSuccess={() => handleNavigate('dashboard')}
            />
          ) : (
            <LoginPage
              onSwitchToSignup={() => handleNavigate('signup')}
              onLoginSuccess={() => handleNavigate(stateStore.currentRole === 'ADMIN' ? 'admin-dashboard' : 'dashboard')}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Dynamic Sidebar Navigation */}
      <Sidebar
        currentView={currentView}
        onNavigate={handleNavigate}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main App Content Viewport */}
      <div className="main-content">
        {/* Global Broadcast Announcement Banner */}
        <BroadcastBanner onNavigate={handleNavigate} />

        {/* Sticky Header Navbar */}
        <Navbar
          currentView={currentView}
          onNavigate={handleNavigate}
          onToggleMobileMenu={() => setIsMobileMenuOpen((prev) => !prev)}
        />

        {/* Page Render Body */}
        <main className="page-body">
          {/* USER APP PAGES */}
          {isUser && (
            <>
              {currentView === 'dashboard' && (
                <UserDashboard
                  onNavigate={handleNavigate}
                  onOpenDepositModal={() => setShowDepositModal(true)}
                  onOpenWithdrawModal={() => setShowWithdrawModal(true)}
                />
              )}
              {currentView === 'markets' && (
                <MarketsPage
                  onNavigate={handleNavigate}
                  onOpenTradeModal={(symbol) => handleOpenTradeModal(symbol)}
                />
              )}
              {currentView === 'trade' && (
                <StockDetailPage
                  onOpenTradeModal={(symbol, side) => handleOpenTradeModal(symbol, side)}
                />
              )}
              {currentView === 'portfolio' && <PortfolioPage onNavigate={handleNavigate} />}
              {currentView === 'investment' && (
                <InvestmentPage
                  onNavigate={handleNavigate}
                />
              )}
              {currentView === 'wallet' && (
                <WalletPage
                  onOpenDepositModal={() => setShowDepositModal(true)}
                  onOpenWithdrawModal={() => setShowWithdrawModal(true)}
                />
              )}
              {currentView === 'referrals' && <ReferralsPage />}
              {currentView === 'support' && <SupportPage />}
              {currentView === 'profile' && (
                <ProfilePage />
              )}
              {currentView === 'about' && <AboutPage />}

            </>
          )}

          {/* ADMIN WEB PANEL PAGES */}
          {!isUser && (
            <>
              {currentView === 'admin-dashboard' && (
                <AdminDashboard onNavigate={handleNavigate} />
              )}
              {currentView === 'admin-users' && <UserManagement />}
              {currentView === 'admin-deposits' && <DepositApproval />}
              {currentView === 'admin-withdrawals' && <WithdrawApproval />}
              {currentView === 'admin-support' && <AdminSupportDesk />}
              {currentView === 'admin-markets' && <MarketManagement />}
              {currentView === 'admin-audit' && <AuditLogsPage />}
              {currentView === 'admin-settings' && <AdminSettingsPage />}
            </>
          )}
        </main>
      </div>

      {/* GLOBAL INTERACTIVE MODALS */}
      {tradeModalAsset && selectedAsset && (
        <TradeModal
          asset={selectedAsset}
          initialSide={tradeModalSide}
          onClose={() => setTradeModalAsset(null)}
        />
      )}

      {showDepositModal && (
        <DepositModal onClose={() => setShowDepositModal(false)} />
      )}

      {showWithdrawModal && (
        <WithdrawModal onClose={() => setShowWithdrawModal(false)} />
      )}


      {/* Global Toast Alert Notifications */}
      <ToastContainer />

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav currentView={currentView} onNavigate={handleNavigate} />
    </div>
  );
}

export default App;
