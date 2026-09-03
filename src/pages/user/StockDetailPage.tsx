import React, { useState, useEffect } from 'react';
import { stateStore } from '../../services/stateStore';
import { FinancialChart } from '../../components/Chart/FinancialChart';
import { TrendingUp, Activity, BarChart3, Clock, Zap } from 'lucide-react';

interface StockDetailPageProps {
  onOpenTradeModal?: (symbol: string, side?: 'BUY' | 'SELL') => void;
}

export const StockDetailPage: React.FC<StockDetailPageProps> = () => {
  const [, setTick] = useState(0);

  useEffect(() => {
    return stateStore.subscribe(() => setTick((t) => t + 1));
  }, []);

  const asset = stateStore.assets.find((a) => a.symbol === stateStore.selectedAssetSymbol) || stateStore.assets[0];
  const isUp = asset.change24h >= 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Top Asset Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h1 style={{ fontSize: 28, fontWeight: 900, color: '#f3f4f6' }}>{asset.symbol}</h1>
            <span style={{ fontSize: 16, color: '#9ca3af', fontWeight: 600 }}>{asset.name}</span>
            <span className="badge" style={{ backgroundColor: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4', border: '1px solid rgba(6, 182, 212, 0.3)', padding: '4px 10px' }}>
              {asset.category}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 6 }}>
            <span className="mono" style={{ fontSize: 24, fontWeight: 900, color: '#f3f4f6' }}>
              ${asset.price.toFixed(2)}
            </span>
            <span className="mono" style={{ fontSize: 14, fontWeight: 800, color: isUp ? '#10b981' : '#ef4444' }}>
              {isUp ? '+' : ''}{asset.change24h}% (${asset.change24hAmount.toFixed(2)})
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="badge" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '6px 12px', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Activity size={14} /> Live Market Price Feed
          </span>
          <span className="badge" style={{ backgroundColor: '#111827', color: '#9ca3af', border: '1px solid #1f293d', padding: '6px 12px', fontSize: 12 }}>
            Real-Time Ticker
          </span>
        </div>
      </div>

      {/* Main Interactive Chart */}
      <FinancialChart asset={asset} />

      {/* Real-time Market Analytics & Fundamentals (View-Only) */}
      <div className="grid-3">
        {/* 24h High & Low */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: '#9ca3af', textTransform: 'uppercase', fontWeight: 700 }}>24H Price Range</span>
            <TrendingUp size={16} color="#06b6d4" />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
            <div>
              <span style={{ fontSize: 11, color: '#6b7280', display: 'block' }}>24h Low</span>
              <span className="mono" style={{ fontSize: 16, fontWeight: 800, color: '#ef4444' }}>
                ${asset.low24h.toFixed(2)}
              </span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: 11, color: '#6b7280', display: 'block' }}>24h High</span>
              <span className="mono" style={{ fontSize: 16, fontWeight: 800, color: '#10b981' }}>
                ${asset.high24h.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Bid & Ask Spread */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: '#9ca3af', textTransform: 'uppercase', fontWeight: 700 }}>Order Book Spread</span>
            <BarChart3 size={16} color="#f59e0b" />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
            <div>
              <span style={{ fontSize: 11, color: '#6b7280', display: 'block' }}>Best Bid</span>
              <span className="mono" style={{ fontSize: 16, fontWeight: 800, color: '#10b981' }}>
                ${asset.bid.toFixed(2)}
              </span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: 11, color: '#6b7280', display: 'block' }}>Best Ask</span>
              <span className="mono" style={{ fontSize: 16, fontWeight: 800, color: '#ef4444' }}>
                ${asset.ask.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* 24h Volume & Engine Status */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: '#9ca3af', textTransform: 'uppercase', fontWeight: 700 }}>24H Total Volume</span>
            <Zap size={16} color="#10b981" />
          </div>
          <div style={{ marginTop: 12 }}>
            <span className="mono" style={{ fontSize: 20, fontWeight: 900, color: '#f3f4f6' }}>
              {(asset.volume / 1000000).toFixed(2)}M USD
            </span>
            <span style={{ fontSize: 11, color: '#10b981', display: 'block', marginTop: 2 }}>
              ● High liquidity active on global exchanges
            </span>
          </div>
        </div>
      </div>

      {/* Asset Information Summary */}
      <div className="card" style={{ backgroundColor: '#111827', border: '1px solid #1f293d' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <Clock size={16} color="#06b6d4" />
          <h3 style={{ fontSize: 15, fontWeight: 800, color: '#f3f4f6', margin: 0 }}>Market Feed Details</h3>
        </div>
        <p style={{ fontSize: 13, color: '#9ca3af', lineHeight: 1.6, margin: 0 }}>
          Live streaming price action for <strong style={{ color: '#f3f4f6' }}>{asset.name} ({asset.symbol})</strong> powered by decentralized market liquidity oracles. Candlestick intervals, volume histograms, and technical indicators are updated in real-time.
        </p>
      </div>
    </div>
  );
};
