import React, { useState, useEffect } from 'react';
import { stateStore } from '../../services/stateStore';
import type { AssetCategory } from '../../types';
import { Search, Star } from 'lucide-react';

interface MarketsPageProps {
  onNavigate: (view: string) => void;
  onOpenTradeModal?: (symbol: string) => void;
}

export const MarketsPage: React.FC<MarketsPageProps> = ({ onNavigate }) => {
  const [, setTick] = useState(0);
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | AssetCategory>('ALL');
  const [search, setSearch] = useState('');
  const [favorites, setFavorites] = useState<string[]>(['AAPL', 'BTC/USD']);

  useEffect(() => {
    return stateStore.subscribe(() => setTick((t) => t + 1));
  }, []);

  const toggleFavorite = (symbol: string) => {
    if (favorites.includes(symbol)) {
      setFavorites(favorites.filter((s) => s !== symbol));
    } else {
      setFavorites([...favorites, symbol]);
    }
  };

  const filteredAssets = stateStore.assets.filter((a) => {
    const matchesCat = categoryFilter === 'ALL' || a.category === categoryFilter;
    const matchesSearch =
      a.symbol.toLowerCase().includes(search.toLowerCase()) ||
      a.name.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header & Filter Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#f3f4f6' }}>
            Live Financial Markets
          </h1>
          <span style={{ fontSize: 13, color: '#9ca3af' }}>
            Real-time tickers, bid/ask depth, 24h highs & lows
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Category Tabs */}
          <div style={styles.tabContainer}>
            {(['ALL', 'STOCK', 'CRYPTO', 'COMMODITY'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                style={{
                  ...styles.tabBtn,
                  ...(categoryFilter === cat ? styles.tabBtnActive : {}),
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div style={styles.searchBox}>
            <Search size={16} color="#9ca3af" />
            <input
              type="text"
              placeholder="Search ticker..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={styles.searchInput}
            />
          </div>
        </div>
      </div>

      {/* Main Asset Table Card */}
      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th style={{ width: 40 }}></th>
                <th>Asset</th>
                <th>Category</th>
                <th>Price (USD)</th>
                <th>24h Change</th>
                <th>24h High / Low</th>
                <th>Bid / Ask</th>
                <th>Volume</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssets.map((asset) => {
                const isFav = favorites.includes(asset.symbol);
                const isUp = asset.change24h >= 0;

                return (
                  <tr key={asset.symbol}>
                    <td>
                      <button onClick={() => toggleFavorite(asset.symbol)}>
                        <Star size={16} color={isFav ? '#f59e0b' : '#4b5563'} fill={isFav ? '#f59e0b' : 'none'} />
                      </button>
                    </td>
                    <td>
                      <div
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          stateStore.setSelectedAsset(asset.symbol);
                          onNavigate('trade');
                        }}
                      >
                        <span style={{ fontWeight: 800, fontSize: 14, color: '#f3f4f6' }}>{asset.symbol}</span>
                        <span style={{ fontSize: 12, color: '#9ca3af', display: 'block' }}>{asset.name}</span>
                      </div>
                    </td>
                    <td>
                      <span className="badge" style={{ backgroundColor: '#111827', color: '#9ca3af', border: '1px solid #1f293d' }}>
                        {asset.category}
                      </span>
                    </td>
                    <td className="mono" style={{ fontWeight: 800, fontSize: 14 }}>
                      ${asset.price.toFixed(2)}
                    </td>
                    <td className="mono" style={{ fontWeight: 700, color: isUp ? '#10b981' : '#ef4444' }}>
                      {isUp ? '+' : ''}
                      {asset.change24h}% (${asset.change24hAmount.toFixed(2)})
                    </td>
                    <td className="mono" style={{ fontSize: 12, color: '#9ca3af' }}>
                      ${asset.high24h.toFixed(2)} / ${asset.low24h.toFixed(2)}
                    </td>
                    <td className="mono" style={{ fontSize: 12, color: '#9ca3af' }}>
                      ${asset.bid.toFixed(2)} / ${asset.ask.toFixed(2)}
                    </td>
                    <td className="mono" style={{ fontSize: 12 }}>
                      {(asset.volume / 1000000).toFixed(1)}M
                    </td>
                    <td>
                      <button
                        onClick={() => {
                          stateStore.setSelectedAsset(asset.symbol);
                          onNavigate('trade');
                        }}
                        className="btn btn-primary"
                        style={{ padding: '6px 14px', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4, fontWeight: 700 }}
                      >
                        📈 Live Chart
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  tabContainer: {
    display: 'flex',
    backgroundColor: '#162032',
    border: '1px solid #1f293d',
    borderRadius: 8,
    padding: 3,
  },
  tabBtn: {
    padding: '6px 12px',
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 700,
    color: '#9ca3af',
  },
  tabBtnActive: {
    backgroundColor: '#3b82f6',
    color: '#ffffff',
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#162032',
    border: '1px solid #1f293d',
    borderRadius: 8,
    padding: '6px 12px',
    width: 220,
  },
  searchInput: {
    border: 'none',
    backgroundColor: 'transparent',
    padding: 0,
    width: '100%',
    color: '#f3f4f6',
    fontSize: 13,
  },
};
