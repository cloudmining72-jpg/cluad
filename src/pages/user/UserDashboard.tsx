import React, { useState, useEffect } from 'react';
import { stateStore } from '../../services/stateStore';
import { Wallet, Layers, TrendingUp, Zap, Server, Cpu, Clock } from 'lucide-react';
import { FinancialChart } from '../../components/Chart/FinancialChart';
import { showToast } from '../../components/ToastContainer';
import { MiningTerminal } from '../../components/MiningTerminal';


interface UserDashboardProps {
  onNavigate: (tab: string) => void;
  onOpenDepositModal?: () => void;
  onOpenWithdrawModal?: () => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ onNavigate }) => {
  const [, setTick] = useState(0);

  useEffect(() => {
    // Tick every 1s for live countdown timer
    const timer = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    return stateStore.subscribe(() => setTick((t) => t + 1));
  }, []);

  const currentUser = stateStore.currentUser;
  const userActivePlans = stateStore.userPlans.filter((p) => p.userId === currentUser.id || (p.userEmail && p.userEmail.toLowerCase() === currentUser.email.toLowerCase()));
  const featuredAsset = stateStore.assets.find((a) => a.symbol === stateStore.selectedAssetSymbol) || stateStore.assets[0];
  const todayIsProfit = currentUser.todayPL >= 0;

  const plansWithCycles = userActivePlans.map((plan) => ({
    plan,
    cycleInfo: stateStore.getPlanCycleInfo(plan),
  }));

  const readyPlans = plansWithCycles.filter((item) => item.cycleInfo.status === 'READY_TO_CLAIM');
  const miningPlans = plansWithCycles.filter((item) => item.cycleInfo.status === 'MINING');
  const idlePlans = plansWithCycles.filter((item) => item.cycleInfo.status === 'IDLE');

  const totalReadyProfit = readyPlans.reduce((sum, item) => sum + item.plan.dailyProfit, 0);

  const handleClaimAll = () => {
    if (readyPlans.length === 0) return;

    let totalClaimed = 0;
    readyPlans.forEach((item) => {
      const res = stateStore.claimDailyProfit(item.plan.id);
      if (res.success) totalClaimed += item.plan.dailyProfit;
    });

    if (totalClaimed > 0) {
      showToast(`⚡ Successfully claimed +$${totalClaimed.toFixed(2)} 24h profit to your available balance!`, 'success');
    }
  };

  const handleClaim = (planId: string) => {
    const res = stateStore.claimDailyProfit(planId);
    if (res.success) {
      showToast(res.message, 'success');
    } else {
      showToast(res.message, 'error');
    }
  };

  const handleStartNextCycle = (planId: string) => {
    const res = stateStore.startNextMiningCycle(planId);
    if (res.success) {
      showToast(res.message, 'success');
    } else {
      showToast(res.message, 'error');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Top Welcome Banner */}
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, backgroundColor: '#162032', border: '1px solid #1f293d' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: '#f3f4f6' }}>
              Welcome back, {currentUser.name}!
            </h1>
          </div>
          <p style={{ fontSize: 13, color: '#9ca3af', marginTop: 4 }}>
            Cloud Crypto Mining Machine & Yield Dashboard
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            onClick={() => onNavigate('portfolio')}
            className="btn btn-primary"
            style={{ backgroundColor: '#3b82f6', color: '#ffffff', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)' }}
          >
            <Zap size={16} fill="#ffffff" /> Active
          </button>
          <button onClick={() => onNavigate('wallet')} className="btn btn-primary">
            + Quick Deposit
          </button>
          <button onClick={() => onNavigate('investment')} className="btn btn-secondary" style={{ backgroundColor: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4', borderColor: 'rgba(6, 182, 212, 0.3)' }}>
            <Server size={16} /> Mining Machines
          </button>
        </div>
      </div>

      {/* GIANT HERO CLAIM BUTTON SECTION ON HOME PAGE */}
      <div
        className="card"
        style={{
          padding: '24px',
          borderRadius: 16,
          backgroundColor: '#162032',
          border: readyPlans.length > 0 ? '2px solid #10b981' : '2px solid #3b82f6',
          boxShadow: readyPlans.length > 0 ? '0 0 30px rgba(16, 185, 129, 0.25)' : '0 10px 30px rgba(0,0,0,0.5)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: 16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Zap size={32} color={readyPlans.length > 0 ? '#10b981' : '#3b82f6'} fill={readyPlans.length > 0 ? '#10b981' : '#3b82f6'} />
          <h2 style={{ fontSize: 22, fontWeight: 900, color: '#f3f4f6', letterSpacing: '-0.3px', margin: 0 }}>
            24-HOUR MINING PROFIT CLAIM
          </h2>
        </div>

        <p style={{ fontSize: 13, color: '#9ca3af', maxWidth: 520, margin: 0, lineHeight: 1.5 }}>
          {readyPlans.length > 0
            ? `⚡ +$${totalReadyProfit.toFixed(2)} 24-hour mining profit is ready! Click the big claim button below to add it to your balance.`
            : miningPlans.length > 0
            ? `⏳ 24h Mining active. Timer: ${miningPlans[0].cycleInfo.formattedTime}. Claim unlocks automatically after 24h.`
            : idlePlans.length > 0
            ? `🚀 24-Hour cycle complete & claimed! Click below to start your next 24h mining session.`
            : `Rent a 30-day mining machine to start receiving daily 24-hour coin profits!`}
        </p>

        {/* ONE GIANT CLAIM HERO BUTTON */}
        {readyPlans.length > 0 ? (
          <button
            onClick={handleClaimAll}
            style={{
              width: '100%',
              maxWidth: 500,
              padding: '16px 28px',
              borderRadius: 14,
              fontWeight: 900,
              fontSize: 18,
              backgroundColor: '#10b981',
              color: '#000000',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              boxShadow: '0 0 30px rgba(16, 185, 129, 0.8)',
              transition: 'all 0.2s ease-in-out',
            }}
          >
            <Zap size={26} fill="#000000" />
            <span>⚡ CLAIM TODAY'S PROFIT (+${totalReadyProfit.toFixed(2)})</span>
          </button>
        ) : miningPlans.length > 0 ? (
          <button
            onClick={() => showToast(`⏳ 24h Mining cycle active! Countdown: ${miningPlans[0].cycleInfo.formattedTime}. Claim button unlocks when timer reaches 00:00:00.`, 'info')}
            style={{
              width: '100%',
              maxWidth: 500,
              padding: '16px 28px',
              borderRadius: 14,
              fontWeight: 900,
              fontSize: 16,
              backgroundColor: 'rgba(245, 158, 11, 0.15)',
              color: '#f59e0b',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              boxShadow: '0 0 15px rgba(245, 158, 11, 0.2)',
            }}
          >
            <Clock size={22} color="#f59e0b" />
            <span>⏳ MINING IN PROGRESS ({miningPlans[0].cycleInfo.formattedTime})</span>
          </button>
        ) : idlePlans.length > 0 ? (
          <button
            onClick={() => handleStartNextCycle(idlePlans[0].plan.id)}
            style={{
              width: '100%',
              maxWidth: 500,
              padding: '16px 28px',
              borderRadius: 14,
              fontWeight: 900,
              fontSize: 16,
              backgroundColor: '#3b82f6',
              color: '#ffffff',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)',
            }}
          >
            <Zap size={22} fill="#ffffff" />
            <span>🚀 START NEXT 24H MINING CYCLE NOW</span>
          </button>
        ) : (
          <button
            onClick={() => onNavigate('investment')}
            style={{
              width: '100%',
              maxWidth: 500,
              padding: '16px 28px',
              borderRadius: 14,
              fontWeight: 900,
              fontSize: 16,
              backgroundColor: '#06b6d4',
              color: '#000000',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              boxShadow: '0 0 20px rgba(6, 182, 212, 0.4)',
            }}
          >
            <Server size={22} />
            <span>⚡ RENT MINING MACHINE TO START EARNING ($10 MIN)</span>
          </button>
        )}
      </div>

      {/* Live Mining Hardware Telemetry Terminal */}
      <MiningTerminal />

      {/* 4 Financial Stat Cards */}
      <div className="grid-4">
        <div className="card card-hover" style={styles.metricCard}>
          <div style={styles.metricIconBox}>
            <Wallet size={20} color="#3b82f6" />
          </div>
          <div>
            <span style={styles.metricLabel}>Total Amount</span>
            <h2 className="mono" style={styles.metricValue}>
              ${currentUser.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </h2>
            <span style={{ fontSize: 11, color: '#9ca3af' }}>
              Cash: ${currentUser.availableCash.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        <div className="card card-hover" style={styles.metricCard}>
          <div style={{ ...styles.metricIconBox, backgroundColor: 'rgba(6, 182, 212, 0.15)' }}>
            <Layers size={20} color="#06b6d4" />
          </div>
          <div>
            <span style={styles.metricLabel}>Deposit Amount</span>
            <h2 className="mono" style={styles.metricValue}>
              ${currentUser.investedAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </h2>
            <span style={{ fontSize: 11, color: '#06b6d4', fontWeight: 600 }}>
              {userActivePlans.length} Active Rigs
            </span>
          </div>
        </div>

        <div className="card card-hover" style={styles.metricCard}>
          <div style={{ ...styles.metricIconBox, backgroundColor: todayIsProfit ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)' }}>
            <TrendingUp size={20} color={todayIsProfit ? '#10b981' : '#ef4444'} />
          </div>
          <div>
            <span style={styles.metricLabel}>Today's P/L</span>
            <h2 className="mono" style={{ ...styles.metricValue, color: todayIsProfit ? '#10b981' : '#ef4444' }}>
              {todayIsProfit ? '+' : ''}${currentUser.todayPL.toFixed(2)}
            </h2>
            <span style={{ fontSize: 11, color: todayIsProfit ? '#10b981' : '#ef4444', fontWeight: 600 }}>
              Real-market volatility
            </span>
          </div>
        </div>

        <div className="card card-hover" style={styles.metricCard}>
          <div style={{ ...styles.metricIconBox, backgroundColor: 'rgba(245, 158, 11, 0.15)' }}>
            <Zap size={20} color="#f59e0b" />
          </div>
          <div>
            <span style={styles.metricLabel}>Total Return</span>
            <h2 className="mono" style={{ ...styles.metricValue, color: '#10b981' }}>
              +${currentUser.totalPL.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </h2>
            <span style={{ fontSize: 11, color: '#10b981', fontWeight: 600 }}>
              +14.15% Overall Return
            </span>
          </div>
        </div>
      </div>

      {/* DEDICATED ACTIVE MINING MACHINES DASHBOARD WIDGET */}
      <div className="card" style={{ backgroundColor: '#162032', border: '1px solid #1f293d' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: '#f3f4f6', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Cpu size={18} color="#06b6d4" /> Your Mining Hardware Machine Holdings ({userActivePlans.length})
          </h3>
          <button onClick={() => onNavigate('investment')} style={{ fontSize: 12, color: '#3b82f6', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}>
            + Rent New Mining Machine &rarr;
          </button>
        </div>

        {userActivePlans.length === 0 ? (
          <div style={{ padding: 20, textAlign: 'center', color: '#9ca3af', backgroundColor: '#111827', borderRadius: 8, fontSize: 13 }}>
            No active mining machines running yet. Start a $10 mining rig to receive 24h coin yield!
          </div>
        ) : (
          <div className="grid-2">
            {userActivePlans.map((plan) => {
              const cycleInfo = stateStore.getPlanCycleInfo(plan);
              return (
                <div key={plan.id} style={{ backgroundColor: '#111827', border: '1px solid #1f293d', borderRadius: 8, padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontWeight: 800, fontSize: 14, color: '#f3f4f6' }}>{plan.planName}</span>
                      <span style={{ fontSize: 10, color: '#f59e0b', fontWeight: 800, backgroundColor: 'rgba(245, 158, 11, 0.15)', padding: '2px 6px', borderRadius: 4, marginLeft: 8 }}>
                        ⛏ {plan.minedCoin || 'BTC'}
                      </span>
                    </div>
                    <span className="mono" style={{ fontSize: 12, color: '#10b981', fontWeight: 700 }}>2x Target</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#9ca3af' }}>
                    <span>24h Yield: <b style={{ color: '#06b6d4' }}>+${plan.dailyProfit.toFixed(2)}/cycle</b></span>
                    <span>24h Timer: <b style={{ color: cycleInfo.status === 'MINING' ? '#f59e0b' : '#10b981' }}>{cycleInfo.formattedTime}</b></span>
                  </div>

                  {cycleInfo.status === 'COMPLETED' ? (
                    <button disabled className="btn btn-secondary" style={{ width: '100%', padding: '6px 10px', fontSize: 11, opacity: 0.6 }}>
                      ✓ 30-Day Mining Completed
                    </button>
                  ) : cycleInfo.status === 'MINING' ? (
                    <button disabled className="btn btn-secondary" style={{ width: '100%', padding: '6px 10px', fontSize: 11, color: '#f59e0b', backgroundColor: 'rgba(245, 158, 11, 0.12)', borderColor: 'rgba(245, 158, 11, 0.3)' }}>
                      <Clock size={12} /> ⏳ Mining Active ({cycleInfo.formattedTime})
                    </button>
                  ) : cycleInfo.status === 'READY_TO_CLAIM' ? (
                    <button
                      onClick={() => handleClaim(plan.id)}
                      className="btn btn-primary"
                      style={{ width: '100%', padding: '8px 10px', fontSize: 12, fontWeight: 800, backgroundColor: '#10b981', color: '#000000' }}
                    >
                      <Zap size={14} /> CLAIM TODAY'S PROFIT (+${plan.dailyProfit.toFixed(2)})
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStartNextCycle(plan.id)}
                      className="btn btn-primary"
                      style={{ width: '100%', padding: '8px 10px', fontSize: 12, fontWeight: 800, backgroundColor: '#3b82f6', color: '#ffffff' }}
                    >
                      🚀 START NEXT 24H MINING CYCLE
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Main Grid: Featured Interactive Chart & Market Watch */}
      <div className="grid-dashboard-main">
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#f3f4f6' }}>Featured Asset Chart</h3>
            <button onClick={() => onNavigate('trade')} style={{ fontSize: 12, color: '#3b82f6', fontWeight: 600 }}>
              Full Trading Terminal &rarr;
            </button>
          </div>
          <FinancialChart asset={featuredAsset} />
        </div>

        {/* Market Widget */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#f3f4f6' }}>Market</h3>
            <button onClick={() => onNavigate('markets')} style={{ fontSize: 12, color: '#3b82f6' }}>
              View All
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, overflowY: 'auto', maxHeight: 360 }}>
            {stateStore.assets.slice(0, 6).map((asset) => (
              <div
                key={asset.symbol}
                onClick={() => {
                  stateStore.setSelectedAsset(asset.symbol);
                }}
                style={{
                  ...styles.marketItem,
                  backgroundColor: asset.symbol === featuredAsset.symbol ? 'rgba(59, 130, 246, 0.12)' : '#111827',
                  borderColor: asset.symbol === featuredAsset.symbol ? '#3b82f6' : '#1f293d',
                }}
              >
                <div>
                  <span style={{ fontWeight: 700, fontSize: 13, color: '#f3f4f6' }}>{asset.symbol}</span>
                  <span style={{ fontSize: 11, color: '#9ca3af', display: 'block' }}>{asset.name}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontWeight: 700, fontSize: 13, fontFamily: 'var(--font-mono)' }}>
                    ${asset.price.toFixed(2)}
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      display: 'block',
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
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  metricCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
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
  marketItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    border: '1px solid #1f293d',
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
};
