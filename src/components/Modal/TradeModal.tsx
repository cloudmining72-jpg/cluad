import React, { useState } from 'react';
import type { Asset, OrderType, OrderSide } from '../../types';
import { stateStore } from '../../services/stateStore';
import { X, ArrowUpRight, ArrowDownRight, CheckCircle2 } from 'lucide-react';
import { showToast } from '../ToastContainer';

interface TradeModalProps {
  asset: Asset;
  initialSide?: OrderSide;
  onClose: () => void;
}

export const TradeModal: React.FC<TradeModalProps> = ({ asset, initialSide = 'BUY', onClose }) => {
  const [side, setSide] = useState<OrderSide>(initialSide);
  const [type, setType] = useState<OrderType>('MARKET');
  const [quantity, setQuantity] = useState<number>(1);
  const [targetPrice, setTargetPrice] = useState<number>(asset.price);
  const [stopPrice, setStopPrice] = useState<number>(asset.price * 0.95);
  const [feedback, setFeedback] = useState<{ success?: boolean; message?: string } | null>(null);

  const currentUser = stateStore.currentUser;
  const executionPrice = type === 'MARKET' ? asset.price : targetPrice;
  const totalCost = quantity * executionPrice;
  const tradingFee = totalCost * (stateStore.settings.tradingFeePercent / 100);
  const grandTotal = totalCost + tradingFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    const result = stateStore.placeOrder({
      symbol: asset.symbol,
      type,
      side,
      quantity: Number(quantity),
      targetPrice: type !== 'MARKET' ? Number(targetPrice) : undefined,
      stopPrice: type === 'STOP' || type === 'STOP_LIMIT' ? Number(stopPrice) : undefined,
    });

    setFeedback(result);
    if (result.success) {
      showToast(`${side} ${quantity} ${asset.symbol} order executed successfully!`, 'success');
      setTimeout(() => {
        onClose();
      }, 1500);
    }
  };

  return (
    <div className="modal-overlay" style={styles.overlay}>
      <div className="modal-card" style={styles.modalCard}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <span style={{ fontWeight: 800, fontSize: 18, color: '#f3f4f6' }}>
              Place Order — {asset.symbol}
            </span>
            <span style={{ fontSize: 12, color: '#9ca3af', display: 'block' }}>{asset.name}</span>
          </div>
          <button onClick={onClose} style={styles.closeBtn}>
            <X size={20} color="#9ca3af" />
          </button>
        </div>

        {/* Buy / Sell Tabs */}
        <div style={styles.sideTabs}>
          <button
            onClick={() => setSide('BUY')}
            style={{
              ...styles.tabBtn,
              ...(side === 'BUY' ? styles.tabBuyActive : {}),
            }}
          >
            <ArrowUpRight size={16} /> BUY {asset.symbol}
          </button>
          <button
            onClick={() => setSide('SELL')}
            style={{
              ...styles.tabBtn,
              ...(side === 'SELL' ? styles.tabSellActive : {}),
            }}
          >
            <ArrowDownRight size={16} /> SELL {asset.symbol}
          </button>
        </div>

        {feedback && (
          <div
            style={{
              padding: 12,
              borderRadius: 8,
              marginBottom: 16,
              fontSize: 13,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              backgroundColor: feedback.success ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              color: feedback.success ? '#10b981' : '#ef4444',
              border: `1px solid ${feedback.success ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
            }}
          >
            <CheckCircle2 size={16} />
            <span>{feedback.message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Order Type Selector */}
          <div style={{ marginBottom: 16 }}>
            <label style={styles.label}>Order Type</label>
            <div style={styles.typeSelector}>
              {(['MARKET', 'LIMIT', 'STOP', 'STOP_LIMIT'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  style={{
                    ...styles.typeBtn,
                    ...(type === t ? styles.typeBtnActive : {}),
                  }}
                >
                  {t.replace('_', '-')}
                </button>
              ))}
            </div>
          </div>

          {/* Conditional Target Price / Stop Price Inputs */}
          {type !== 'MARKET' && (
            <div style={{ marginBottom: 16 }}>
              <label style={styles.label}>Limit / Target Price ($)</label>
              <input
                type="number"
                step="0.01"
                value={targetPrice}
                onChange={(e) => setTargetPrice(Number(e.target.value))}
                style={styles.input}
              />
            </div>
          )}

          {(type === 'STOP' || type === 'STOP_LIMIT') && (
            <div style={{ marginBottom: 16 }}>
              <label style={styles.label}>Stop Price Trigger ($)</label>
              <input
                type="number"
                step="0.01"
                value={stopPrice}
                onChange={(e) => setStopPrice(Number(e.target.value))}
                style={styles.input}
              />
            </div>
          )}

          {/* Quantity */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <label style={styles.label}>Quantity</label>
              <span style={{ fontSize: 11, color: '#9ca3af' }}>
                Est. Price: ${asset.price.toFixed(2)}
              </span>
            </div>
            <input
              type="number"
              min="0.001"
              step="any"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(0.001, Number(e.target.value)))}
              style={styles.input}
            />

            {/* Quick Percentage Presets */}
            <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
              {[0.25, 0.5, 0.75, 1].map((pct) => {
                const calculatedUnits = Math.max(0.01, (currentUser.availableCash * pct) / (asset.price || 1));
                return (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => setQuantity(Number(calculatedUnits.toFixed(4)))}
                    style={{
                      flex: 1,
                      padding: '4px 6px',
                      borderRadius: 6,
                      fontSize: 11,
                      fontWeight: 700,
                      backgroundColor: '#111827',
                      color: '#06b6d4',
                      border: '1px solid #1f293d',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    {pct * 100}%
                  </button>
                );
              })}
            </div>
          </div>

          {/* Order Financial Summary */}
          <div style={styles.summaryBox}>
            <div style={styles.summaryRow}>
              <span>Order Value:</span>
              <span className="mono">${totalCost.toFixed(2)}</span>
            </div>
            <div style={styles.summaryRow}>
              <span>Trading Fee ({stateStore.settings.tradingFeePercent}%):</span>
              <span className="mono">${tradingFee.toFixed(2)}</span>
            </div>
            <div style={{ ...styles.summaryRow, borderTop: '1px solid #1f293d', paddingTop: 8, marginTop: 4, fontWeight: 700 }}>
              <span>Total Required:</span>
              <span className="mono" style={{ color: side === 'BUY' ? '#10b981' : '#ef4444' }}>
                ${grandTotal.toFixed(2)}
              </span>
            </div>
            <div style={{ ...styles.summaryRow, marginTop: 8, fontSize: 11, color: '#9ca3af' }}>
              <span>Available Cash:</span>
              <span className="mono" style={{ color: '#f3f4f6' }}>
                ${currentUser.availableCash.toFixed(2)}
              </span>
            </div>
          </div>

          <button
            type="submit"
            style={{
              ...styles.submitBtn,
              backgroundColor: side === 'BUY' ? '#10b981' : '#ef4444',
            }}
          >
            {side === 'BUY' ? `EXECUTE BUY ${quantity} ${asset.symbol}` : `EXECUTE SELL ${quantity} ${asset.symbol}`}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(10, 14, 23, 0.85)',
    backdropFilter: 'blur(6px)',
    zIndex: 300,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  modalCard: {
    backgroundColor: '#162032',
    border: '1px solid #1f293d',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 440,
    boxShadow: '0 20px 50px rgba(0,0,0,0.7)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  closeBtn: {
    padding: 4,
    borderRadius: 6,
    backgroundColor: '#111827',
  },
  sideTabs: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 8,
    marginBottom: 20,
  },
  tabBtn: {
    padding: '10px 16px',
    borderRadius: 8,
    fontWeight: 700,
    fontSize: 13,
    color: '#9ca3af',
    backgroundColor: '#111827',
    border: '1px solid #1f293d',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  tabBuyActive: {
    backgroundColor: '#10b981',
    color: '#000000',
    border: 'none',
  },
  tabSellActive: {
    backgroundColor: '#ef4444',
    color: '#ffffff',
    border: 'none',
  },
  label: {
    fontSize: 12,
    fontWeight: 600,
    color: '#9ca3af',
    marginBottom: 6,
    display: 'block',
  },
  typeSelector: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 6,
    backgroundColor: '#111827',
    padding: 3,
    borderRadius: 8,
    border: '1px solid #1f293d',
  },
  typeBtn: {
    padding: '6px 4px',
    borderRadius: 6,
    fontSize: 11,
    fontWeight: 700,
    color: '#9ca3af',
  },
  typeBtnActive: {
    backgroundColor: '#3b82f6',
    color: '#ffffff',
  },
  input: {
    width: '100%',
    backgroundColor: '#111827',
    border: '1px solid #1f293d',
    borderRadius: 8,
    padding: '10px 14px',
    color: '#f3f4f6',
    fontSize: 14,
    fontWeight: 600,
  },
  summaryBox: {
    backgroundColor: '#111827',
    border: '1px solid #1f293d',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 4,
  },
  submitBtn: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: 8,
    fontWeight: 800,
    fontSize: 14,
    color: '#ffffff',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
  },
};
