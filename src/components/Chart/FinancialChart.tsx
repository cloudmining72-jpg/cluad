import React, { useState } from 'react';
import type { Asset } from '../../types';
import { BarChart3, LineChart } from 'lucide-react';

interface FinancialChartProps {
  asset: Asset;
}

export const FinancialChart: React.FC<FinancialChartProps> = ({ asset }) => {
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '1Y'>('1M');
  const [chartType, setChartType] = useState<'CANDLE' | 'LINE'>('CANDLE');

  const history = asset.chartHistory || [];
  const displayPoints = history.slice(timeframe === '1D' ? -8 : timeframe === '1W' ? -14 : -30);

  // SVG Chart Dimensions
  const svgWidth = 800;
  const svgHeight = 320;
  const padding = { top: 20, right: 60, bottom: 40, left: 10 };

  const chartW = svgWidth - padding.left - padding.right;
  const chartH = svgHeight - padding.top - padding.bottom;

  if (displayPoints.length === 0) {
    return <div style={{ color: '#9ca3af', padding: 20 }}>No chart data available.</div>;
  }
  const minPrice = Math.min(...displayPoints.map((p) => p.low)) * 0.998;
  const maxPrice = Math.max(...displayPoints.map((p) => p.high)) * 1.002;
  const priceRange = maxPrice - minPrice || 1;

  const maxVol = Math.max(...displayPoints.map((p) => p.volume)) || 1;

  // Coordinate mappers
  const getX = (index: number) => padding.left + (index / (displayPoints.length - 1 || 1)) * chartW;
  const getY = (val: number) => padding.top + chartH - ((val - minPrice) / priceRange) * chartH;

  // Build line path string
  const linePointsString = displayPoints
    .map((p, idx) => `${getX(idx)},${getY(p.close)}`)
    .join(' ');

  const areaPointsString = `${padding.left},${padding.top + chartH} ${linePointsString} ${
    padding.left + chartW
  },${padding.top + chartH}`;

  const isUp = asset.change24h >= 0;
  const strokeColor = isUp ? '#10b981' : '#ef4444';

  return (
    <div style={styles.chartContainer}>
      {/* Top Chart Toolbar */}
      <div style={styles.chartToolbar}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontWeight: 800, fontSize: 18, color: '#f3f4f6' }}>{asset.symbol}</span>
          <span style={{ fontSize: 13, color: '#9ca3af' }}>{asset.name}</span>
          <span style={{ fontWeight: 700, fontSize: 16, fontFamily: 'var(--font-mono)' }}>
            ${asset.price.toFixed(2)}
          </span>
          <span
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: isUp ? '#10b981' : '#ef4444',
            }}
          >
            {isUp ? '+' : ''}
            {asset.change24h}% (${asset.change24hAmount.toFixed(2)})
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Chart Type Toggle */}
          <div style={styles.btnGroup}>
            <button
              onClick={() => setChartType('CANDLE')}
              style={{
                ...styles.toggleBtn,
                ...(chartType === 'CANDLE' ? styles.toggleBtnActive : {}),
              }}
              title="Candlestick Chart"
            >
              <BarChart3 size={14} />
            </button>
            <button
              onClick={() => setChartType('LINE')}
              style={{
                ...styles.toggleBtn,
                ...(chartType === 'LINE' ? styles.toggleBtnActive : {}),
              }}
              title="Line Chart"
            >
              <LineChart size={14} />
            </button>
          </div>

          {/* Timeframe Buttons */}
          <div style={styles.btnGroup}>
            {(['1D', '1W', '1M', '1Y'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                style={{
                  ...styles.toggleBtn,
                  ...(timeframe === tf ? styles.toggleBtnActive : {}),
                }}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SVG Financial Render */}
      <div style={{ position: 'relative', width: '100%', height: svgHeight }}>
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} style={{ width: '100%', height: '100%', overflow: 'visible' }}>
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={strokeColor} stopOpacity="0.25" />
              <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
            const y = padding.top + chartH * pct;
            const priceVal = maxPrice - priceRange * pct;
            return (
              <g key={i}>
                <line x1={padding.left} y1={y} x2={padding.left + chartW} y2={y} stroke="#1f293d" strokeDasharray="3 3" />
                <text x={padding.left + chartW + 8} y={y + 4} fill="#6b7280" fontSize="11" fontFamily="var(--font-mono)">
                  ${priceVal.toFixed(2)}
                </text>
              </g>
            );
          })}

          {/* Render Candles or Line */}
          {chartType === 'LINE' ? (
            <>
              <polygon points={areaPointsString} fill="url(#chartGradient)" />
              <polyline points={linePointsString} fill="none" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
            </>
          ) : (
            displayPoints.map((p, idx) => {
              const x = getX(idx);
              const openY = getY(p.open);
              const closeY = getY(p.close);
              const highY = getY(p.high);
              const lowY = getY(p.low);

              const candleIsUp = p.close >= p.open;
              const color = candleIsUp ? '#10b981' : '#ef4444';
              const candleW = Math.max(3, chartW / displayPoints.length - 4);

              // Volume bar height (max 50px at bottom)
              const volH = (p.volume / maxVol) * 45;
              const volY = padding.top + chartH - volH;

              return (
                <g key={idx}>
                  {/* Volume Bar */}
                  <rect
                    x={x - candleW / 2}
                    y={volY}
                    width={candleW}
                    height={volH}
                    fill={color}
                    opacity="0.25"
                  />
                  {/* Wick */}
                  <line x1={x} y1={highY} x2={x} y2={lowY} stroke={color} strokeWidth="1.5" />
                  {/* Candle Body */}
                  <rect
                    x={x - candleW / 2}
                    y={Math.min(openY, closeY)}
                    width={candleW}
                    height={Math.max(2, Math.abs(closeY - openY))}
                    fill={color}
                    rx="1"
                  />
                </g>
              );
            })
          )}

          {/* Time Labels */}
          {displayPoints.map((p, idx) => {
            if (idx % Math.ceil(displayPoints.length / 6) === 0 || idx === displayPoints.length - 1) {
              const x = getX(idx);
              return (
                <text key={idx} x={x} y={svgHeight - 10} fill="#6b7280" fontSize="11" textAnchor="middle">
                  {p.time}
                </text>
              );
            }
            return null;
          })}
        </svg>
      </div>

      {/* Quick Statistics Bar */}
      <div style={styles.statsBar}>
        <div style={styles.statItem}>
          <span style={styles.statLabel}>24h High</span>
          <span style={styles.statValue}>${asset.high24h.toFixed(2)}</span>
        </div>
        <div style={styles.statItem}>
          <span style={styles.statLabel}>24h Low</span>
          <span style={styles.statValue}>${asset.low24h.toFixed(2)}</span>
        </div>
        <div style={styles.statItem}>
          <span style={styles.statLabel}>24h Volume</span>
          <span style={styles.statValue}>{(asset.volume / 1000000).toFixed(2)}M</span>
        </div>
        <div style={styles.statItem}>
          <span style={styles.statLabel}>Bid / Ask</span>
          <span style={styles.statValue}>
            ${asset.bid.toFixed(2)} / ${asset.ask.toFixed(2)}
          </span>
        </div>
        <div style={styles.statItem}>
          <span style={styles.statLabel}>Market Cap</span>
          <span style={styles.statValue}>{asset.marketCap}</span>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  chartContainer: {
    backgroundColor: '#162032',
    border: '1px solid #1f293d',
    borderRadius: 12,
    padding: 20,
    boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
  },
  chartToolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    flexWrap: 'wrap',
    gap: 12,
  },
  btnGroup: {
    display: 'flex',
    backgroundColor: '#111827',
    border: '1px solid #1f293d',
    borderRadius: 8,
    padding: 3,
  },
  toggleBtn: {
    padding: '4px 10px',
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 600,
    color: '#9ca3af',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleBtnActive: {
    backgroundColor: '#3b82f6',
    color: '#ffffff',
  },
  statsBar: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingTop: 16,
    borderTop: '1px solid #1f293d',
    flexWrap: 'wrap',
    gap: 16,
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  statLabel: {
    fontSize: 11,
    color: '#9ca3af',
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: 13,
    fontWeight: 700,
    fontFamily: 'var(--font-mono)',
    color: '#f3f4f6',
  },
};
