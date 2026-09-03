import React, { useState, useEffect } from 'react';
import { stateStore } from '../../services/stateStore';
import { CheckCircle2, Server, Activity, ShieldCheck, Zap } from 'lucide-react';
import { showToast } from '../../components/ToastContainer';

interface InvestmentPageProps {
  onNavigate?: (tab: string) => void;
}

export const InvestmentPage: React.FC<InvestmentPageProps> = ({ onNavigate }) => {
  const [, setTick] = useState(0);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [customAmount, setCustomAmount] = useState<number>(10);
  const [selectedCoin, setSelectedCoin] = useState<string>('BTC');
  const [feedback, setFeedback] = useState<{ success?: boolean; message?: string } | null>(null);
  const [justPurchased, setJustPurchased] = useState(false);

  const AVAILABLE_COINS = [
    { symbol: 'BTC', name: 'Bitcoin (BTC)' },
    { symbol: 'ETH', name: 'Ethereum (ETH)' },
    { symbol: 'USDT', name: 'Tether (USDT)' },
    { symbol: 'SOL', name: 'Solana (SOL)' },
    { symbol: 'BNB', name: 'Binance Coin (BNB)' },
    { symbol: 'DOGE', name: 'Dogecoin (DOGE)' },
    { symbol: 'LTC', name: 'Litecoin (LTC)' },
  ];

  useEffect(() => {
    return stateStore.subscribe(() => setTick((t) => t + 1));
  }, []);

  const currentUser = stateStore.currentUser;

  const handlePurchase = (planName: string, amount: number) => {
    setFeedback(null);
    setJustPurchased(false);
    const res = stateStore.purchasePlan(planName, amount, selectedCoin);
    setFeedback(res);
    if (res.success) {
      setJustPurchased(true);
      showToast(`Mining machine ${planName} (${selectedCoin}) activated! 24-Hour Mining Cycle Started!`, 'success');
      setSelectedPlanId(null);
    } else {
      showToast(res.message, 'error');
    }
  };


  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Page Header & Mining Catalog Banner */}
      <div className="card" style={{ backgroundColor: 'rgba(6, 182, 212, 0.08)', border: '1px solid rgba(6, 182, 212, 0.3)', padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <Server size={32} color="#06b6d4" />
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: '#f3f4f6' }}>
                Crypto Mining Rig Plans Catalog
              </h1>
              <span style={{ fontSize: 13, color: '#9ca3af', display: 'block', marginTop: 2 }}>
                Activate physical ASIC & GPU Cloud Mining Hardware starting from <b style={{ color: '#10b981' }}>$10</b>. All active machines run in 24-hour cycles on your <b>Claim</b> page!
              </span>
            </div>
          </div>

          <div style={{ fontSize: 13, color: '#10b981', fontWeight: 700, backgroundColor: '#111827', padding: '8px 16px', borderRadius: 8, border: '1px solid #1f293d' }}>
            Available Cash: ${currentUser.availableCash.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 16, marginTop: 14, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#10b981', fontWeight: 700 }}>
            <CheckCircle2 size={16} /> 30-Day Duration (30 Cycles)
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#06b6d4', fontWeight: 700 }}>
            <Activity size={16} /> 200% (2x) Guaranteed Double Return
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#f59e0b', fontWeight: 700 }}>
            <Zap size={16} /> 24h Cycle Timer & Profit Claim
          </div>
        </div>
      </div>

      {feedback && (
        <div
          style={{
            padding: 16,
            borderRadius: 12,
            fontSize: 13,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            backgroundColor: feedback.success ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.15)',
            color: feedback.success ? '#10b981' : '#ef4444',
            border: `1px solid ${feedback.success ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.3)'}`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <CheckCircle2 size={18} />
            <span style={{ fontWeight: 700, fontSize: 14 }}>{feedback.message}</span>
          </div>

          {justPurchased && feedback.success && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, backgroundColor: '#111827', padding: 12, borderRadius: 8, border: '1px solid #1f293d' }}>
              <div>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#f3f4f6', display: 'block' }}>
                  🎉 24-Hour Mining Cycle Started!
                </span>
                <span style={{ fontSize: 11, color: '#9ca3af' }}>
                  Go to the Claim page to monitor your 24-hour mining timer and collect your daily yield.
                </span>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {onNavigate && (
                  <button onClick={() => onNavigate('portfolio')} className="btn btn-primary" style={{ padding: '8px 14px', fontSize: 12, fontWeight: 800 }}>
                    <Zap size={14} /> Go to Claim Page
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}


      {/* Mining Hardware Machine Tiers Catalog */}
      <div>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: '#f3f4f6', marginBottom: 14 }}>
          Select & Buy Mining Machine Rigs ($10 Starts)
        </h2>

        <div className="grid-3">
          {stateStore.planTiers.map((tier) => {
            const isSelected = selectedPlanId === tier.id;
            const minDailyProfit = ((tier.minAmount * 2) / 30).toFixed(2);

            return (
              <div
                key={tier.id}
                className="card card-hover"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                  backgroundColor: '#162032',
                  border: isSelected ? '2px solid #3b82f6' : '1px solid #1f293d',
                  boxShadow: isSelected ? '0 0 20px rgba(59, 130, 246, 0.2)' : 'none',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span className="badge" style={{ backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' }}>
                      {tier.badge}
                    </span>
                    <h3 style={{ fontSize: 17, fontWeight: 800, color: '#f3f4f6', marginTop: 6 }}>
                      {tier.name}
                    </h3>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#10b981', fontFamily: 'var(--font-mono)' }}>
                    2x RETURN
                  </span>
                </div>

                <div style={{ backgroundColor: '#111827', padding: 12, borderRadius: 8, border: '1px solid #1f293d' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 12, color: '#9ca3af' }}>Min Hardware Price:</span>
                    <span className="mono" style={{ fontSize: 15, fontWeight: 800, color: '#10b981' }}>
                      ${tier.minAmount} USD
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 12, color: '#9ca3af' }}>Hashrate Power:</span>
                    <span className="mono" style={{ fontSize: 13, fontWeight: 800, color: '#06b6d4' }}>
                      {tier.hashRate}
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 12, color: '#9ca3af' }}>Daily Coin Yield:</span>
                    <span className="mono" style={{ fontSize: 13, fontWeight: 700, color: '#f3f4f6' }}>
                      +${minDailyProfit}/day
                    </span>
                  </div>
                </div>

                <div style={{ fontSize: 12, color: '#9ca3af', lineHeight: 1.5 }}>
                  <span style={{ color: '#06b6d4', fontWeight: 600, display: 'block', marginBottom: 2 }}>
                    Hardware: {tier.gpuModel}
                  </span>
                  30 Days active mining contract. 200% (2x) double cash return paid daily on the Claim page.
                </div>

                {isSelected ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 'auto' }}>
                    <div>
                      <label style={{ fontSize: 11, color: '#9ca3af', fontWeight: 600, display: 'block', marginBottom: 4 }}>
                        Investment Amount ($ USD)
                      </label>
                      <input
                        type="number"
                        min={tier.minAmount}
                        max={tier.maxAmount}
                        value={customAmount}
                        onChange={(e) => setCustomAmount(Number(e.target.value))}
                        style={{
                          width: '100%',
                          backgroundColor: '#111827',
                          border: '1px solid #3b82f6',
                          borderRadius: 8,
                          padding: '8px 12px',
                          color: '#f3f4f6',
                          fontSize: 14,
                          fontWeight: 700,
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: 11, color: '#9ca3af', fontWeight: 600, display: 'block', marginBottom: 4 }}>
                        Select Mining Coin
                      </label>
                      <select
                        value={selectedCoin}
                        onChange={(e) => setSelectedCoin(e.target.value)}
                        style={{
                          width: '100%',
                          backgroundColor: '#111827',
                          border: '1px solid #3b82f6',
                          borderRadius: 8,
                          padding: '8px 12px',
                          color: '#06b6d4',
                          fontSize: 13,
                          fontWeight: 800,
                        }}
                      >
                        {AVAILABLE_COINS.map((c) => (
                          <option key={c.symbol} value={c.symbol}>
                            ⚡ {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        onClick={() => handlePurchase(tier.name, customAmount)}
                        className="btn btn-primary"
                        style={{ flex: 1, padding: '10px', fontSize: 12, fontWeight: 800 }}
                      >
                        <ShieldCheck size={14} /> CONFIRM & BUY
                      </button>
                      <button
                        onClick={() => setSelectedPlanId(null)}
                        className="btn btn-secondary"
                        style={{ padding: '10px 12px', fontSize: 12 }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setSelectedPlanId(tier.id);
                      setCustomAmount(tier.minAmount);
                    }}
                    className="btn btn-primary"
                    style={{ marginTop: 'auto', width: '100%', padding: 12, fontWeight: 800 }}
                  >
                    <Server size={16} /> BUY MINING MACHINE (${tier.minAmount})
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
