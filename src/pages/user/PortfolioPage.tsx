import React, { useState, useEffect } from 'react';
import { stateStore } from '../../services/stateStore';
import { Server, Zap, Clock, Check, PlusCircle, Play } from 'lucide-react';
import { showToast } from '../../components/ToastContainer';
import { MiningTerminal } from '../../components/MiningTerminal';

interface PortfolioPageProps {
  onNavigate?: (tab: string) => void;
}

export const PortfolioPage: React.FC<PortfolioPageProps> = ({ onNavigate }) => {
  const [, setTick] = useState(0);

  useEffect(() => {
    // Tick every 1s for real-time 24h countdown
    const timer = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    return stateStore.subscribe(() => setTick((t) => t + 1));
  }, []);

  const currentUser = stateStore.currentUser;
  const userActivePlans = stateStore.userPlans.filter((p) => p.userId === currentUser.id || (p.userEmail && p.userEmail.toLowerCase() === currentUser.email.toLowerCase()));

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
      {/* Live Hardware Terminal */}
      <MiningTerminal />

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#f3f4f6', display: 'flex', alignItems: 'center', gap: 10 }}>
            <Zap size={24} color="#10b981" /> 24-Hour Mining & Daily Profit Claim
          </h1>
          <span style={{ fontSize: 13, color: '#9ca3af' }}>
            Each mining cycle runs for exactly 24 hours. After 24 hours pass, claim your profit to unlock the next 24-hour mining cycle!
          </span>
        </div>

        {onNavigate && (
          <button
            onClick={() => onNavigate('investment')}
            className="btn btn-primary"
            style={{ padding: '10px 18px', fontSize: 13, fontWeight: 800, backgroundColor: '#06b6d4' }}
          >
            <PlusCircle size={16} /> + Buy New Mining Rig
          </button>
        )}
      </div>

      {/* Active Machines Claim List */}
      <div>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: '#f3f4f6', marginBottom: 14 }}>
          Your Active Mining Hardware Machines ({userActivePlans.length})
        </h2>

        {userActivePlans.length === 0 ? (
          <div className="card" style={{ padding: 40, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
            <Server size={44} color="#06b6d4" />
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#f3f4f6' }}>No Active Mining Machines Yet</h3>
              <p style={{ fontSize: 13, color: '#9ca3af', marginTop: 4 }}>
                Aap ne abhi tak koi mining machine activate nahi ki. Nayi machine buy karein aur 24 hours bd profit claim karein!
              </p>
            </div>
            {onNavigate && (
              <button
                onClick={() => onNavigate('investment')}
                className="btn btn-primary"
                style={{ padding: '12px 24px', fontSize: 14, fontWeight: 800, marginTop: 6 }}
              >
                Browse & Buy Mining Machines ($10+)
              </button>
            )}
          </div>
        ) : (
          <div className="grid-2">
            {userActivePlans.map((plan) => {
              const dailyProfit = plan.dailyProfit;
              const cycleInfo = stateStore.getPlanCycleInfo(plan);
              const progressPct = Math.min(100, (plan.claimedDaysCount / plan.durationDays) * 100);

              return (
                <div key={plan.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16, backgroundColor: '#162032', border: '1px solid #1f293d' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        <span className="badge" style={{ backgroundColor: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4', border: '1px solid rgba(6, 182, 212, 0.3)' }}>
                          30-DAY MINING MACHINE
                        </span>
                        <span className="badge" style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.3)', fontWeight: 800 }}>
                          ⛏ MINING: {plan.minedCoin || 'BTC'}
                        </span>
                      </div>
                      <h3 style={{ fontSize: 18, fontWeight: 800, color: '#f3f4f6', marginTop: 6 }}>
                        {plan.planName}
                      </h3>
                    </div>
                    <span
                      className="badge"
                      style={{
                        backgroundColor:
                          cycleInfo.status === 'MINING'
                            ? 'rgba(245, 158, 11, 0.2)'
                            : cycleInfo.status === 'READY_TO_CLAIM'
                            ? 'rgba(16, 185, 129, 0.2)'
                            : cycleInfo.status === 'IDLE'
                            ? 'rgba(59, 130, 246, 0.2)'
                            : 'rgba(107, 114, 128, 0.2)',
                        color:
                          cycleInfo.status === 'MINING'
                            ? '#f59e0b'
                            : cycleInfo.status === 'READY_TO_CLAIM'
                            ? '#10b981'
                            : cycleInfo.status === 'IDLE'
                            ? '#3b82f6'
                            : '#9ca3af',
                        fontWeight: 800,
                      }}
                    >
                      {cycleInfo.status === 'MINING'
                        ? '⏳ MINING ACTIVE (24h)'
                        : cycleInfo.status === 'READY_TO_CLAIM'
                        ? '⚡ READY TO CLAIM'
                        : cycleInfo.status === 'IDLE'
                        ? '⏸ WAITING NEXT CYCLE'
                        : 'COMPLETED'}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, backgroundColor: '#111827', padding: 12, borderRadius: 8, border: '1px solid #1f293d' }}>
                    <div>
                      <span style={{ fontSize: 11, color: '#9ca3af', display: 'block' }}>Hardware Price</span>
                      <span className="mono" style={{ fontWeight: 800, fontSize: 14, color: '#f3f4f6' }}>
                        ${plan.investedAmount.toFixed(2)}
                      </span>
                    </div>
                    <div>
                      <span style={{ fontSize: 11, color: '#9ca3af', display: 'block' }}>2x Total Yield</span>
                      <span className="mono" style={{ fontWeight: 800, fontSize: 14, color: '#10b981' }}>
                        ${plan.totalTargetReturn.toFixed(2)}
                      </span>
                    </div>
                    <div>
                      <span style={{ fontSize: 11, color: '#9ca3af', display: 'block' }}>24h Coin Yield</span>
                      <span className="mono" style={{ fontWeight: 800, fontSize: 14, color: '#06b6d4' }}>
                        +${dailyProfit.toFixed(2)}/cycle
                      </span>
                    </div>
                  </div>

                  {/* Days Progress Bar */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#9ca3af', marginBottom: 4 }}>
                      <span>Cycles Claimed: {plan.claimedDaysCount} of 30 Cycles</span>
                      <span className="mono">{progressPct.toFixed(0)}% Completed</span>
                    </div>
                    <div style={{ width: '100%', height: 8, backgroundColor: '#111827', borderRadius: 4, overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${progressPct}%`,
                          height: '100%',
                          backgroundColor: '#10b981',
                          transition: 'width 0.3s ease',
                        }}
                      />
                    </div>
                  </div>

                  {/* 24-Hour Cycle Timer Banner */}
                  <div
                    style={{
                      backgroundColor: '#111827',
                      borderRadius: 8,
                      padding: '10px 14px',
                      border: '1px solid #1f293d',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span style={{ fontSize: 12, color: '#9ca3af', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Clock size={14} color="#06b6d4" /> 24h Cycle Timer:
                    </span>
                    <span className="mono" style={{ fontSize: 14, fontWeight: 800, color: cycleInfo.status === 'MINING' ? '#f59e0b' : '#10b981' }}>
                      {cycleInfo.formattedTime}
                    </span>
                  </div>

                  {/* Action Buttons: Mining / Claim / Start Next Cycle */}
                  <div style={{ marginTop: 4 }}>
                    {cycleInfo.status === 'COMPLETED' ? (
                      <button disabled className="btn btn-secondary" style={{ width: '100%', opacity: 0.6 }}>
                        <Check size={16} /> 30-Day Mining Completed
                      </button>
                    ) : cycleInfo.status === 'MINING' ? (
                      <button
                        disabled
                        className="btn btn-secondary"
                        style={{ width: '100%', backgroundColor: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b', borderColor: 'rgba(245, 158, 11, 0.3)', padding: 12 }}
                      >
                        <Clock size={16} /> ⏳ MINING IN PROGRESS ({cycleInfo.formattedTime} LEFT)
                      </button>
                    ) : cycleInfo.status === 'READY_TO_CLAIM' ? (
                      <button
                        onClick={() => handleClaim(plan.id)}
                        className="btn btn-primary"
                        style={{ width: '100%', backgroundColor: '#10b981', color: '#000000', fontWeight: 800, fontSize: 15, padding: 14, boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)' }}
                      >
                        <Zap size={20} /> CLAIM TODAY'S PROFIT (+${dailyProfit.toFixed(2)})
                      </button>
                    ) : (
                      <button
                        onClick={() => handleStartNextCycle(plan.id)}
                        className="btn btn-primary"
                        style={{ width: '100%', backgroundColor: '#3b82f6', color: '#ffffff', fontWeight: 800, fontSize: 15, padding: 14, boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)' }}
                      >
                        <Play size={18} /> 🚀 START NEXT 24H MINING CYCLE
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

