import React, { useState, useEffect } from 'react';
import { stateStore } from '../../services/stateStore';
import { Megaphone } from 'lucide-react';

export const MarketManagement: React.FC = () => {
  const [, setTick] = useState(0);
  const [newsText, setNewsText] = useState('');
  const [sentNotice, setSentNotice] = useState(false);

  useEffect(() => {
    return stateStore.subscribe(() => setTick((t) => t + 1));
  }, []);

  const handleBroadcastNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsText.trim()) return;

    // Send global notification to all users
    stateStore.users.forEach((u) => {
      stateStore.notifications.unshift({
        id: `notif_${Date.now()}_${u.id}`,
        userId: u.id,
        title: 'Platform Market Announcement',
        message: newsText.trim(),
        type: 'ANNOUNCEMENT',
        read: false,
        timestamp: new Date().toISOString(),
      });
    });

    setSentNotice(true);
    setNewsText('');
    setTimeout(() => setSentNotice(false), 2500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#f3f4f6' }}>Market & Announcement Operations</h1>
        <span style={{ fontSize: 13, color: '#9ca3af' }}>
          Broadcast real-time push notifications & inspect live ticker parameters
        </span>
      </div>

      {sentNotice && (
        <div style={{ padding: 12, borderRadius: 8, backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10b981', fontSize: 13 }}>
          Market Announcement broadcasted to all active user mobile/web applications!
        </div>
      )}

      {/* Broadcast Announcement Form */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <Megaphone size={20} color="#f59e0b" />
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#f3f4f6' }}>
            Broadcast Market Announcement / Alert
          </h3>
        </div>

        <form onSubmit={handleBroadcastNews}>
          <textarea
            rows={3}
            placeholder="e.g. Scheduled maintenance window or Market volatility alert for Federal Reserve interest rate decision..."
            value={newsText}
            onChange={(e) => setNewsText(e.target.value)}
            style={{ width: '100%', backgroundColor: '#111827', border: '1px solid #1f293d', borderRadius: 8, padding: 12, color: '#f3f4f6', fontSize: 13, marginBottom: 12 }}
            required
          />
          <button type="submit" className="btn btn-primary">
            Send Broadcast Notification
          </button>
        </form>
      </div>

      {/* Assets Ticker Status */}
      <div className="card">
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#f3f4f6', marginBottom: 14 }}>
          Live Market Tickers ({stateStore.assets.length})
        </h3>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Ticker Symbol</th>
                <th>Asset Name</th>
                <th>Category</th>
                <th>Last Price</th>
                <th>24h Change</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {stateStore.assets.map((asset) => (
                <tr key={asset.symbol}>
                  <td style={{ fontWeight: 800 }}>{asset.symbol}</td>
                  <td style={{ fontSize: 13, color: '#9ca3af' }}>{asset.name}</td>
                  <td>
                    <span className="badge" style={{ backgroundColor: '#111827', color: '#06b6d4' }}>
                      {asset.category}
                    </span>
                  </td>
                  <td className="mono" style={{ fontWeight: 800 }}>${asset.price.toFixed(2)}</td>
                  <td className="mono" style={{ color: asset.change24h >= 0 ? '#10b981' : '#ef4444', fontWeight: 700 }}>
                    {asset.change24h >= 0 ? '+' : ''}{asset.change24h}%
                  </td>
                  <td>
                    <span className="badge status-APPROVED">{asset.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
