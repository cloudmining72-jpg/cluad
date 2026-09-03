function showPage(p){
  localStorage.setItem('cm_current_page',p);
  document.querySelectorAll('.page').forEach(x=>x.classList.remove('active'));
  const t=document.getElementById('page-'+p);
  if(t){
    t.classList.add('active');
    if(!t.dataset.rendered){
      renderPage(p);
      t.dataset.rendered='1';
    }
  }
  document.querySelectorAll('.nav-link').forEach(l=>l.classList.toggle('active',l.dataset.page===p));
  document.querySelectorAll('.mbb-item').forEach(m=>m.classList.remove('active'));
  const mbb=document.getElementById('mbb-'+p);
  if(mbb) mbb.classList.add('active');
  window.scrollTo({top:0,behavior:'smooth'});
}
function toggleMobileMenu(){
  const d=document.getElementById('mobileDrawer'),o=document.getElementById('mobileOverlay');
  if(d) d.classList.toggle('open');
  if(o) o.classList.toggle('show');
}
function toggleFAQ(el){el.classList.toggle('open');}
window.addEventListener('scroll',()=>{const n=document.getElementById('navbar');n.style.background=window.scrollY>20?'rgba(10,14,23,0.98)':'rgba(10,14,23,0.92)';});
function svg(d,c,s){return `<svg width="${s||24}" height="${s||24}" viewBox="0 0 24 24" fill="none" stroke="${c||'currentColor'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;}
const I={zap:'<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>',shield:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',monitor:'<rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>',trend:'<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>',users:'<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',clock:'<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',globe:'<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',dl:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',dollar:'<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',award:'<circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>',user:'<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',server:'<rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/>',chev:'<polyline points="9 18 15 12 9 6"/>',bag:'<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/>',map:'<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',truck:'<rect x="1" y="3" width="15" height="13" rx="1"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>'};
function el(p){return document.getElementById('page-'+p);}
function renderPage(p){if(p==='home')renderHome();else if(p==='about')renderAbout();else if(p==='features')renderFeatures();else if(p==='plans')renderPlans();else if(p==='howto')renderHowTo();else if(p==='download')renderDownload();}

// ==================== LIVE STOCKS & CRYPTO REAL-TIME ENGINE ====================
// CoinGecko API IDs mapped to our assets
const COINGECKO_IDS = {
  btc: 'bitcoin',
  eth: 'ethereum',
  sol: 'solana',
  bnb: 'binancecoin',
  xrp: 'ripple',
  ada: 'cardano',
  doge: 'dogecoin',
  trx: 'tron'
};

let LIVE_ASSETS = [
  { id: 'btc',  symbol: 'BTC/USD',  name: 'Bitcoin',       type: 'crypto', price: 64285.50, change: 3.82,  icon: '₿',  bg: 'linear-gradient(135deg,#f7931a,#ffb347)',  vol: '$32.4B', history: [63800,64000,63900,64150,64285] },
  { id: 'eth',  symbol: 'ETH/USD',  name: 'Ethereum',      type: 'crypto', price: 3428.20,  change: 2.15,  icon: 'Ξ',  bg: 'linear-gradient(135deg,#627eea,#8ca2fa)',  vol: '$16.8B', history: [3380,3400,3390,3410,3428] },
  { id: 'sol',  symbol: 'SOL/USD',  name: 'Solana',        type: 'crypto', price: 148.90,   change: 5.40,  icon: '◎', bg: 'linear-gradient(135deg,#9945ff,#14f195)',  vol: '$5.2B',  history: [142,144,146,147,148.9] },
  { id: 'bnb',  symbol: 'BNB/USD',  name: 'BNB Chain',     type: 'crypto', price: 582.10,   change: -0.32, icon: '🔶', bg: 'linear-gradient(135deg,#f3ba2f,#fcd535)',  vol: '$2.1B',  history: [585,584,582,583,582.1] },
  { id: 'xrp',  symbol: 'XRP/USD',  name: 'XRP (Ripple)',  type: 'crypto', price: 0.5280,   change: 1.20,  icon: '✕',  bg: 'linear-gradient(135deg,#346aa9,#00aae4)',  vol: '$1.8B',  history: [0.51,0.52,0.525,0.527,0.528] },
  { id: 'doge', symbol: 'DOGE/USD', name: 'Dogecoin',      type: 'crypto', price: 0.1240,   change: 2.80,  icon: 'Ð',  bg: 'linear-gradient(135deg,#c2a633,#e8c84a)',  vol: '$0.9B',  history: [0.118,0.120,0.122,0.123,0.124] },
  { id: 'nvda', symbol: 'NVDA',     name: 'NVIDIA Corp',   type: 'stock',  price: 128.80,   change: 3.45,  icon: 'N',  bg: 'linear-gradient(135deg,#76b900,#9be600)',  vol: '$45.2M', history: [124,125,127,126,128.8] },
  { id: 'aapl', symbol: 'AAPL',     name: 'Apple Inc.',    type: 'stock',  price: 224.50,   change: 1.65,  icon: '',  bg: 'linear-gradient(135deg,#555555,#999999)',  vol: '$54.2M', history: [220,221,223,222,224.5] },
  { id: 'msft', symbol: 'MSFT',     name: 'Microsoft',     type: 'stock',  price: 448.20,   change: 0.85,  icon: '⊞', bg: 'linear-gradient(135deg,#00a4ef,#2d7d9a)',  vol: '$21.3M', history: [442,444,446,445,448.2] },
  { id: 'tsla', symbol: 'TSLA',     name: 'Tesla Inc.',    type: 'stock',  price: 218.40,   change: -1.15, icon: 'T',  bg: 'linear-gradient(135deg,#e82127,#ff6b6b)',  vol: '$38.1M', history: [222,220,219,221,218.4] }
];

// ===== REAL-TIME COINGECKO PRICE FETCHER =====
async function fetchRealCryptoPrices() {
  const coinIds = Object.values(COINGECKO_IDS).join(',');
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${coinIds}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true`;
  try {
    const res = await fetch(url);
    if (!res.ok) return;
    const data = await res.json();

    LIVE_ASSETS.forEach(asset => {
      const geckoId = COINGECKO_IDS[asset.id];
      if (!geckoId || !data[geckoId]) return;

      const newPrice  = data[geckoId].usd;
      const newChange = data[geckoId].usd_24h_change ? Number(data[geckoId].usd_24h_change.toFixed(2)) : asset.change;
      const rawVol    = data[geckoId].usd_24h_vol;
      const volStr    = rawVol ? (rawVol >= 1e9 ? `$${(rawVol/1e9).toFixed(1)}B` : `$${(rawVol/1e6).toFixed(0)}M`) : asset.vol;

      const oldPrice = asset.price;
      asset.price  = newPrice;
      asset.change = newChange;
      asset.vol    = volStr;
      asset.history.push(newPrice);
      if (asset.history.length > 8) asset.history.shift();

      // Live update DOM if visible
      const isUp = newPrice >= oldPrice;
      const formattedPrice = newPrice > 100
        ? newPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        : newPrice.toFixed(4);

      const pEl     = document.getElementById(`m-p-${asset.id}`);
      const cEl     = document.getElementById(`m-c-${asset.id}`);
      const sparkEl = document.getElementById(`m-spark-${asset.id}`);
      const tickP   = document.getElementById(`tick-p-${asset.id}`);
      const tickC   = document.getElementById(`tick-c-${asset.id}`);
      const miniEl  = document.getElementById(`mini-${asset.id}`);

      if (pEl) {
        pEl.innerText = `$${formattedPrice}`;
        pEl.className = `m-price mono ${isUp ? 'flash-up' : 'flash-down'}`;
        setTimeout(() => { if (pEl) pEl.className = 'm-price mono'; }, 800);
      }
      if (cEl) {
        cEl.innerText = `${newChange >= 0 ? '▲ +' : '▼ '}${newChange.toFixed(2)}%`;
        cEl.className = `m-chg mono ${newChange >= 0 ? 'up' : 'down'}`;
      }
      if (sparkEl) sparkEl.innerHTML = generateSparkline(asset.history, newChange >= 0);
      if (tickP) tickP.innerText = `$${formattedPrice}`;
      if (tickC) {
        tickC.innerText = `${newChange >= 0 ? '+' : ''}${newChange.toFixed(2)}%`;
        tickC.className = `ticker-change ${newChange >= 0 ? 'up' : 'down'}`;
      }
      if (miniEl) {
        miniEl.innerText = `${newChange >= 0 ? '+' : ''}${newChange.toFixed(1)}%`;
        miniEl.className = `mono ${newChange >= 0 ? 'profit' : 'red'}`;
      }
    });

    // Update live status badge
    const badge = document.getElementById('live-api-badge');
    if (badge) {
      badge.innerText = '🟢 LIVE';
      badge.style.color = '#10b981';
    }
  } catch (err) {
    console.warn('CoinGecko fetch failed, using simulated mode:', err);
    const badge = document.getElementById('live-api-badge');
    if (badge) { badge.innerText = '🟡 SIM'; badge.style.color = '#f59e0b'; }
  }
}

let activeMarketFilter = 'all';
let heroPortfolioBalance = 12458.92;
let mockTimerSeconds = 51758; // 14:22:38

function formatTimer(sec) {
  const h = Math.floor(sec / 3600).toString().padStart(2, '0');
  const m = Math.floor((sec % 3600) / 60).toString().padStart(2, '0');
  const s = (sec % 60).toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
}

function generateSparkline(history, isUp) {
  const min = Math.min(...history);
  const max = Math.max(...history);
  const range = max - min || 1;
  const w = 120, h = 32;
  const points = history.map((val, idx) => {
    const x = (idx / (history.length - 1)) * w;
    const y = h - ((val - min) / range) * (h - 6) - 3;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
  const color = isUp ? '#10b981' : '#ef4444';
  return `<svg class="m-sparkline" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none"><polyline points="${points}" stroke="${color}" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}

function renderTickerRibbon() {
  const items = LIVE_ASSETS.map(a => {
    const isUp = a.change >= 0;
    const formattedPrice = a.price > 100 ? a.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : a.price.toFixed(4);
    return `<div class="ticker-item"><span class="ticker-sym">${a.symbol}</span><span class="ticker-price mono" id="tick-p-${a.id}">$${formattedPrice}</span><span class="ticker-change ${isUp ? 'up' : 'down'}" id="tick-c-${a.id}">${isUp ? '+' : ''}${a.change.toFixed(2)}%</span></div>`;
  }).join('');
  return `<div class="live-ticker-banner"><div class="ticker-wrap"><div class="ticker-row">${items}${items}</div></div></div>`;
}

function renderMarketGrid() {
  const filtered = LIVE_ASSETS.filter(a => activeMarketFilter === 'all' || a.type === activeMarketFilter);
  return filtered.map(a => {
    const isUp = a.change >= 0;
    const formattedPrice = a.price > 100 ? a.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : a.price.toFixed(4);
    return `<div class="m-card" id="card-${a.id}">
      <div class="m-top">
        <div class="m-name-box">
          <div class="m-icon" style="background:${a.bg}">${a.icon}</div>
          <div>
            <div class="m-sym">${a.symbol}</div>
            <div class="m-full">${a.name}</div>
          </div>
        </div>
        <span class="m-type-tag ${a.type}">${a.type === 'crypto' ? '🪙 CRYPTO' : '📈 US STOCK'}</span>
      </div>
      <div class="m-price-box">
        <span class="m-price mono" id="m-p-${a.id}">$${formattedPrice}</span>
        <span class="m-chg mono ${isUp ? 'up' : 'down'}" id="m-c-${a.id}">${isUp ? '▲ +' : '▼ '}${a.change.toFixed(2)}%</span>
      </div>
      <div id="m-spark-${a.id}">${generateSparkline(a.history, isUp)}</div>
      <div class="m-footer">
        <span>24h Vol: <strong class="m-vol">${a.vol}</strong></span>
        <button class="m-trade-btn" onclick="showPage('download')">${a.type === 'crypto' ? 'Mine Now' : 'Track Live'}</button>
      </div>
    </div>`;
  }).join('');
}

function setMarketTab(tab) {
  activeMarketFilter = tab;
  document.querySelectorAll('.m-tab').forEach(t => t.classList.toggle('active', t.dataset.filter === tab));
  const grid = document.getElementById('marketLiveGrid');
  if (grid) grid.innerHTML = renderMarketGrid();
}

function handleClaimMockProfit() {
  heroPortfolioBalance += 6.67;
  const valEl = document.getElementById('mockPortfolioValue');
  if (valEl) {
    valEl.innerText = `$${heroPortfolioBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    valEl.classList.add('flash-up');
    setTimeout(() => valEl.classList.remove('flash-up'), 800);
  }
  const btn = document.getElementById('mockClaimBtn');
  if (btn) {
    btn.innerText = '✓ Claimed +$6.67!';
    btn.style.background = '#10b981';
    setTimeout(() => {
      btn.innerText = '⚡ Claim Daily Profit';
      btn.style.background = 'linear-gradient(135deg,#3b82f6,#06b6d4)';
    }, 2000);
  }
}

function startLiveTickerEngine() {
  // ---- Fetch real crypto prices immediately, then every 30s ----
  fetchRealCryptoPrices();
  setInterval(fetchRealCryptoPrices, 30000);

  // ---- Fast local micro-fluctuation for smooth UI (1.6s) ----
  setInterval(() => {
    // 1. Ticking Mock Mining Timer
    mockTimerSeconds = mockTimerSeconds > 0 ? mockTimerSeconds - 1 : 86400;
    const timerEl = document.getElementById('mockMiningTimer');
    if (timerEl) timerEl.innerText = formatTimer(mockTimerSeconds);

    // 2. Only simulate STOCK assets locally (crypto comes from API)
    const stockAssets = LIVE_ASSETS.filter(a => a.type === 'stock');
    if (!stockAssets.length) return;
    const asset = stockAssets[Math.floor(Math.random() * stockAssets.length)];

    const deltaPercent = (Math.random() * 0.3 - 0.13);
    const oldPrice = asset.price;
    asset.price  = Number((asset.price * (1 + deltaPercent / 100)).toFixed(2));
    asset.change = Number((asset.change + deltaPercent * 0.4).toFixed(2));
    asset.history.push(asset.price);
    if (asset.history.length > 8) asset.history.shift();

    const isUp = asset.price >= oldPrice;
    const formattedPrice = asset.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    const pEl    = document.getElementById(`m-p-${asset.id}`);
    const cEl    = document.getElementById(`m-c-${asset.id}`);
    const sparkEl= document.getElementById(`m-spark-${asset.id}`);
    const tickP  = document.getElementById(`tick-p-${asset.id}`);
    const tickC  = document.getElementById(`tick-c-${asset.id}`);

    if (pEl) {
      pEl.innerText = `$${formattedPrice}`;
      pEl.className = `m-price mono ${isUp ? 'flash-up' : 'flash-down'}`;
      setTimeout(() => { if (pEl) pEl.className = 'm-price mono'; }, 600);
    }
    if (cEl) {
      cEl.innerText = `${asset.change >= 0 ? '▲ +' : '▼ '}${asset.change.toFixed(2)}%`;
      cEl.className = `m-chg mono ${asset.change >= 0 ? 'up' : 'down'}`;
    }
    if (sparkEl) sparkEl.innerHTML = generateSparkline(asset.history, asset.change >= 0);
    if (tickP) tickP.innerText = `$${formattedPrice}`;
    if (tickC) {
      tickC.innerText = `${asset.change >= 0 ? '+' : ''}${asset.change.toFixed(2)}%`;
      tickC.className = `ticker-change ${asset.change >= 0 ? 'up' : 'down'}`;
    }
  }, 1600);
}

function renderHome(){
  const e=el('home');
  e.innerHTML=`<div class="hero">
  <div class="hero-bg-glow glow-1"></div><div class="hero-bg-glow glow-2"></div>
  <div class="hero-content">
    <div class="hero-badge"><span class="badge-dot"></span> Global Cloud Mining &mdash; 48+ Countries</div>
    <h1 class="hero-title">Mine Crypto.<br><span class="gradient-text">Earn 2x Returns.</span><br>Live Stock &amp; ASIC Power.</h1>
    <p class="hero-subtitle">ClaudeMining connects you to Tier-4 ASIC data centers in Iceland &amp; USA with real-time live market tracking. Start from just <strong>$10</strong> &mdash; <strong>200% guaranteed return</strong> in 30 days.</p>
    <div class="hero-actions">
      <button class="btn-primary-lg" onclick="showPage('download')">${svg(I.dl)} Download Free App</button>
      <button class="btn-secondary-lg" onclick="showPage('plans')">View Plans ${svg(I.chev)}</button>
    </div>
    <div class="live-stats-bar">
      <div class="live-stat"><span class="ls-value mono">1,25,000+</span><span class="ls-label">Active Investors</span></div>
      <div class="ls-divider"></div>
      <div class="live-stat"><span class="ls-value mono">$48M+</span><span class="ls-label">Total Paid Out</span></div>
      <div class="ls-divider"></div>
      <div class="live-stat"><span class="ls-value mono">48+</span><span class="ls-label">Countries</span></div>
      <div class="ls-divider"></div>
      <div class="live-stat"><span class="ls-value mono">5 Years</span><span class="ls-label">In Operation</span></div>
    </div>
  </div>
  <div class="hero-visual">
    <div class="app-mockup">
      <div class="mockup-header"><div class="mockup-dot rd"></div><div class="mockup-dot yw"></div><div class="mockup-dot gn"></div><span class="mockup-title">ClaudeMining Live Terminal</span></div>
      <div class="mockup-body">
        <div class="mock-balance-card">
          <span class="mock-label">Live Portfolio Value</span>
          <span class="mock-value mono" id="mockPortfolioValue">$12,458.92</span>
          <span class="mock-change">&#8679; +$248.50 today (2.03% ROI)</span>
        </div>
        <div class="mock-mining-card">
          <div class="mock-mining-icon">&#9889;</div>
          <div>
            <div class="mock-mining-name">Bitmain S19 Pro ASIC</div>
            <div class="mock-mining-status"><span class="pulse-dot"></span> Mining BTC &mdash; <span id="mockMiningTimer" class="mono">14:22:38</span></div>
          </div>
          <div class="mock-mining-profit mono">+$6.67/day</div>
        </div>
        <div class="mock-mini-cards">
          <div class="mock-mini"><span>BTC</span><span class="mono profit" id="mini-btc">+3.8%</span></div>
          <div class="mock-mini"><span>ETH</span><span class="mono profit" id="mini-eth">+2.1%</span></div>
          <div class="mock-mini"><span>SOL</span><span class="mono profit" id="mini-sol">+5.4%</span></div>
        </div>
        <div class="mock-btn" id="mockClaimBtn" onclick="handleClaimMockProfit()" style="cursor:pointer;">&#9889; Claim Daily Profit</div>
      </div>
    </div>
  </div>
</div>

<!-- LIVE STREAMING TICKER BANNER -->
${renderTickerRibbon()}

<div class="trust-strip">
  <div class="trust-item">${svg(I.shield,'#10b981',16)} FinCEN MSB #31000284</div>
  <div class="trust-item">${svg(I.award,'#06b6d4',16)} ISO 27001 Certified</div>
  <div class="trust-item">${svg(I.globe,'#f59e0b',16)} 48+ Countries</div>
  <div class="trust-item">${svg(I.monitor,'#3b82f6',16)} Tier-4 ASIC Data Centers</div>
  <div class="trust-item">${svg(I.trend,'#10b981',16)} 200% Guaranteed Return</div>
</div>

<!-- REAL-TIME LIVE MARKETS & STOCKS SECTION -->
<div class="section-container" style="padding-top: 50px;">
  <div class="section-header">
    <div style="display:flex;justify-content:center;margin-bottom:12px;">
      <span class="live-pulse-badge"><span class="live-pulse-dot"></span> REAL-TIME LIVE MARKET STREAM</span>
    </div>
    <h2 class="section-title">Live <span class="gradient-text">Crypto &amp; Stock Markets</span></h2>
    <p class="section-desc">Track real-time global pricing, market capitalization, and ASIC mining yields updated every second.</p>
  </div>

  <div class="market-hub">
    <div class="market-nav">
      <div class="market-filter-tabs">
        <button class="m-tab active" data-filter="all" onclick="setMarketTab('all')">🔥 All Assets (10)</button>
        <button class="m-tab" data-filter="crypto" onclick="setMarketTab('crypto')">🪙 Crypto Assets (4)</button>
        <button class="m-tab" data-filter="stock" onclick="setMarketTab('stock')">📈 Top US Stocks (6)</button>
      </div>
      <div style="font-size:12px;color:#10b981;font-weight:700;display:flex;align-items:center;gap:6px;">
        <span class="pulse-dot"></span> Live Feed Connected &bull; 0ms Latency
      </div>
    </div>
    <div class="market-grid-live" id="marketLiveGrid">
      ${renderMarketGrid()}
    </div>
  </div>
</div>

<div class="section-container" style="padding-top: 40px;">
  <img src="assets/mining_datacenter.jpg" alt="Mining Farm" style="width: 100%; height: 440px; object-fit: cover; border-radius: 24px; margin-bottom: 60px; border: 1px solid #1f293d; box-shadow: 0 20px 40px rgba(0,0,0,0.6);">
  <div class="section-header"><div class="section-tag">Why ClaudeMining</div><h2 class="section-title">Everything to <span class="gradient-text">mine &amp; earn</span></h2><p class="section-desc">Professional cloud mining made simple. No technical knowledge needed.</p></div>
  <div class="features-grid-home">
    <div class="feat-card" onclick="showPage('features')"><div class="feat-icon" style="background:rgba(59,130,246,0.15);color:#3b82f6;">${svg(I.monitor,'#3b82f6')}</div><h3>Real ASIC Hardware</h3><p>Your investment runs on physical Bitmain S19 ASIC rigs in our Iceland datacenter. Real machines, real mining.</p></div>
    <div class="feat-card" onclick="showPage('features')"><div class="feat-icon" style="background:rgba(16,185,129,0.15);color:#10b981;">${svg(I.trend,'#10b981')}</div><h3>Daily Profit Claims</h3><p>Every 24 hours your cycle completes. Claim profit instantly with one tap.</p></div>
    <div class="feat-card" onclick="showPage('features')"><div class="feat-icon" style="background:rgba(6,182,212,0.15);color:#06b6d4;">${svg(I.clock,'#06b6d4')}</div><h3>30-Day Contracts</h3><p>All plans run 30 cycles. Total return guaranteed at 200% of investment.</p></div>
    <div class="feat-card" onclick="showPage('features')"><div class="feat-icon" style="background:rgba(245,158,11,0.15);color:#f59e0b;">${svg(I.users,'#f59e0b')}</div><h3>Referral Rewards</h3><p>Invite friends, earn commissions automatically. Build your passive income team.</p></div>
    <div class="feat-card" onclick="showPage('features')"><div class="feat-icon" style="background:rgba(139,92,246,0.15);color:#8b5cf6;">${svg(I.truck,'#8b5cf6')}</div><h3>Fast Withdrawals</h3><p>Withdraw earnings to your crypto wallet anytime. Processed within 24 hours.</p></div>
    <div class="feat-card" onclick="showPage('features')"><div class="feat-icon" style="background:rgba(239,68,68,0.15);color:#ef4444;">${svg(I.shield,'#ef4444')}</div><h3>Bank-Grade Security</h3><p>256-bit SSL, 2FA, KYC verification and ISO 27001 certified infrastructure.</p></div>
  </div>
</div>
<div class="section-container section-dark">
  <div class="section-header"><div class="section-tag">Mining Plans</div><h2 class="section-title">Choose your <span class="gradient-text">Mining Machine</span></h2><p class="section-desc">We offer 7 hardware tiers starting from $10. All plans guarantee 200% return.</p></div>
  <div class="plans-preview-grid">
    <div class="plan-preview-card"><div class="plan-badge starter">STARTER MINER</div><div class="plan-name">Starter Micro Rig</div><div class="plan-price mono">$10 &ndash; $49</div><div class="plan-hashrate">25 TH/s</div><div class="plan-hardware">Bitmain S19 Micro</div><div class="plan-return">2x Return in 30 Days</div></div>
    <div class="plan-preview-card featured-plan"><div class="plan-badge pro">POPULAR MINER</div><div class="plan-name">Silver Pro Rig</div><div class="plan-price mono">$100 &ndash; $199</div><div class="plan-hashrate">85 TH/s</div><div class="plan-hardware">Bitmain S19 Pro</div><div class="plan-return">2x Return in 30 Days</div></div>
    <div class="plan-preview-card"><div class="plan-badge elite">PREMIUM NODE</div><div class="plan-name">Diamond SuperNode</div><div class="plan-price mono">$1,000 &ndash; $2,499</div><div class="plan-hashrate">1,000 TH/s</div><div class="plan-hardware">Canaan Avalon 1246</div><div class="plan-return">2x Return in 30 Days</div></div>
  </div>
  <div style="text-align:center;margin-top:32px;"><button class="btn-primary-lg" onclick="showPage('plans')">View All 7 Plans ${svg(I.chev)}</button></div>
</div>
<div class="section-container">
  <div class="section-header"><div class="section-tag">Testimonials</div><h2 class="section-title">Trusted by <span class="gradient-text">1.25M+ investors</span></h2></div>
  <div class="testimonials-grid">
    <div class="testi-card"><div class="testi-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div><p class="testi-text">"I started with $50 on the Bronze plan. After 30 days I received $100. Now I am running 3 machines simultaneously. Best investment platform."</p><div class="testi-author"><div class="testi-avatar" style="background:#3b82f6">A</div><div><div class="testi-name">Ahmad Raza</div><div class="testi-loc">Lahore, Pakistan</div></div></div></div>
    <div class="testi-card featured-testi"><div class="testi-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div><p class="testi-text">"ClaudeMining has been my main source of income for 8 months. Running VIP Hydro plan and earning $166+ daily. Fast and reliable withdrawals."</p><div class="testi-author"><div class="testi-avatar" style="background:#10b981">M</div><div><div class="testi-name">Muhammad Usman</div><div class="testi-loc">Karachi, Pakistan</div></div></div></div>
    <div class="testi-card"><div class="testi-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div><p class="testi-text">"Beautifully designed and very easy to use. The 24-hour timer and one-click claim are my favorite features. Highly recommend this platform."</p><div class="testi-author"><div class="testi-avatar" style="background:#f59e0b">S</div><div><div class="testi-name">Sara Malik</div><div class="testi-loc">Islamabad, Pakistan</div></div></div></div>
  </div>
</div>
<div class="cta-banner"><div class="cta-glow"></div><div class="cta-content"><h2>Ready to start mining?</h2><p>Download ClaudeMining now and earn daily crypto profits from just $10.</p><div class="cta-actions"><button class="btn-primary-lg" onclick="showPage('download')">${svg(I.dl)} Download Free</button><button class="btn-outline-lg" onclick="showPage('howto')">How It Works</button></div></div></div>`;
}

function renderAbout(){
  const e=el('about');
  e.innerHTML=`<div class="page-hero-simple"><div class="page-hero-tag">&#127970; Company Profile</div><h1>About <span class="gradient-text">ClaudeMining Global Inc.</span></h1><p>Trusted leader in cloud cryptocurrency mining infrastructure since 2021</p></div>
<div class="section-container">
  <div class="about-story-grid">
    <div class="about-story-text">
      <div class="section-tag">Our Story</div>
      <h2>Building the future of <span class="gradient-text">decentralized mining</span></h2>
      <p>ClaudeMining Global Inc. was founded in 2021 in the United Kingdom and United States with one vision: make professional cryptocurrency mining accessible to everyone, regardless of technical knowledge or capital.</p>
      <p style="margin-top:14px">Over 5 years we deployed over $200 million of ASIC and GPU hardware across Tier-4 data centers powered by 100% renewable hydroelectric energy in Reykjavik, Iceland.</p>
      <p style="margin-top:14px">Today we serve 1.25 million active investors across 48+ countries. Our Pakistan regional gateway brings this opportunity directly to South Asian investors at no extra cost.</p>
      <div class="about-badges">
        <div class="about-badge green">${svg(I.shield,'currentColor',16)} FinCEN MSB Licensed #31000284</div>
        <div class="about-badge cyan">${svg(I.award,'currentColor',16)} ISO/IEC 27001 Certified</div>
        <div class="about-badge yellow">${svg(I.globe,'currentColor',16)} 6 Months Pakistan Gateway Active</div>
      </div>
    </div>
    <div>
      <img src="assets/mining_datacenter.jpg" alt="Tier-4 Datacenter" style="width: 100%; height: 240px; object-fit: cover; border-radius: 16px; margin-bottom: 16px; border: 1px solid rgba(6,182,212,0.3); box-shadow: 0 0 20px rgba(6,182,212,0.15);">
      <div class="datacenter-card"><div class="dc-header">${svg(I.server,'#06b6d4',18)} Reykjavik Tier-4 Hydro Datacenter</div><div class="dc-stats"><div class="dc-stat"><span>Capacity</span><span class="mono cyan">120 MW</span></div><div class="dc-stat"><span>Energy Source</span><span class="mono green">100% Hydro</span></div><div class="dc-stat"><span>Uptime SLA</span><span class="mono">99.97%</span></div><div class="dc-stat"><span>ASIC Units</span><span class="mono">14,200+</span></div><div class="dc-stat"><span>GPU Rigs</span><span class="mono">3,800+</span></div></div></div>
      <div class="datacenter-card" style="margin-top:16px"><div class="dc-header">${svg(I.map,'#3b82f6',18)} Chicago 266 St &mdash; Backup Facility</div><div class="dc-stats"><div class="dc-stat"><span>Capacity</span><span class="mono cyan">45 MW</span></div><div class="dc-stat"><span>Energy Source</span><span class="mono green">Solar + Grid</span></div><div class="dc-stat"><span>Uptime SLA</span><span class="mono">99.95%</span></div><div class="dc-stat"><span>ASIC Units</span><span class="mono">4,800+</span></div></div></div>
    </div>
  </div>
  <div class="about-stats-row">
    <div class="about-stat-card"><div class="asc-icon blue">${svg(I.clock)}</div><span class="asc-value mono">5 Years</span><span class="asc-label">In Operation</span><div class="asc-sub">Est. 2021 &mdash; UK and USA</div></div>
    <div class="about-stat-card"><div class="asc-icon green">${svg(I.users)}</div><span class="asc-value mono">1.25M+</span><span class="asc-label">Active Investors</span><div class="asc-sub">Across 48+ countries</div></div>
    <div class="about-stat-card"><div class="asc-icon cyan">${svg(I.dollar)}</div><span class="asc-value mono">$48M+</span><span class="asc-label">Total Paid Out</span><div class="asc-sub">Verified on-chain</div></div>
    <div class="about-stat-card"><div class="asc-icon yellow">${svg(I.monitor)}</div><span class="asc-value mono">18,000+</span><span class="asc-label">Mining Machines</span><div class="asc-sub">ASIC + GPU rigs</div></div>
  </div>
  <div class="section-header" style="margin-top:20px"><div class="section-tag">Our Values</div><h2 class="section-title">What we <span class="gradient-text">stand for</span></h2></div>
  <div class="mission-grid">
    <div class="mission-card"><div class="mission-icon">&#127919;</div><h3>Our Mission</h3><p>Democratize access to professional crypto mining so anyone, anywhere can participate in the decentralized economy and build real wealth through blockchain technology.</p></div>
    <div class="mission-card"><div class="mission-icon">&#128274;</div><h3>Our Security</h3><p>ISO 27001 certified and FinCEN MSB licensed. All user data is protected with 256-bit SSL encryption. KYC verification ensures a safe and compliant platform for every investor.</p></div>
    <div class="mission-card"><div class="mission-icon">&#127807;</div><h3>Our Sustainability</h3><p>Our Iceland facility runs on 100% renewable hydroelectric power, making your mining carbon-neutral. We are committed to green cryptocurrency mining for a better future.</p></div>
  </div>
</div>`;
}

function renderFeatures(){
  const e=el('features');
  e.innerHTML=`<div class="page-hero-simple"><div class="page-hero-tag">&#9889; Platform Features</div><h1>Powerful Features for <span class="gradient-text">Smart Investors</span></h1><p>Everything you need to mine, track, invest, and withdraw &mdash; all in one beautiful app</p></div>
<div class="section-container">
  <div class="full-features-grid">
    <div class="full-feat-card"><div class="ff-icon" style="background:rgba(59,130,246,0.15);border-color:rgba(59,130,246,0.3);color:#3b82f6;">${svg(I.monitor,'currentColor',28)}</div><div class="ff-content"><h3>Real ASIC Mining Hardware</h3><p>Your investment is deployed on actual physical Bitmain S19 series and GPU clusters in our Reykjavik data center. Real machines, real mining, real profits.</p><ul class="ff-list"><li>Bitmain S19 Pro ASIC &mdash; 85 TH/s</li><li>MicroBT M30S++ Cluster &mdash; 180 TH/s</li><li>Liquid-Cooled ASIC Suite &mdash; 2,500 TH/s</li></ul></div></div>
    <div class="full-feat-card"><div class="ff-icon" style="background:rgba(16,185,129,0.15);border-color:rgba(16,185,129,0.3);color:#10b981;">${svg(I.zap,'currentColor',28)}</div><div class="ff-content"><h3>24-Hour Mining Cycles</h3><p>Every plan runs in 24-hour cycles. Once a cycle completes, your profit appears instantly on the Claim page ready to be added to your wallet.</p><ul class="ff-list"><li>Live countdown timer in the app</li><li>One-click daily profit claim</li><li>Auto-restart for next cycle</li></ul></div></div>
    <div class="full-feat-card"><div class="ff-icon" style="background:rgba(6,182,212,0.15);border-color:rgba(6,182,212,0.3);color:#06b6d4;">${svg(I.trend,'currentColor',28)}</div><div class="ff-content"><h3>Live Market and Portfolio Tracking</h3><p>Monitor real-time crypto prices with candlestick charts. Track your portfolio value and P/L across all active mining positions.</p><ul class="ff-list"><li>BTC, ETH, SOL, BNB, DOGE, LTC prices</li><li>Interactive candlestick charts</li><li>Portfolio performance analytics</li></ul></div></div>
    <div class="full-feat-card"><div class="ff-icon" style="background:rgba(245,158,11,0.15);border-color:rgba(245,158,11,0.3);color:#f59e0b;">${svg(I.users,'currentColor',28)}</div><div class="ff-content"><h3>Referral and Team Earning System</h3><p>Earn commissions when you refer new investors. Build a multi-level team and earn a percentage of your team mining profits.</p><ul class="ff-list"><li>Unique referral link per user</li><li>Real-time referral earnings tracker</li><li>Team commission bonuses</li></ul></div></div>
    <div class="full-feat-card"><div class="ff-icon" style="background:rgba(139,92,246,0.15);border-color:rgba(139,92,246,0.3);color:#8b5cf6;">${svg(I.bag,'currentColor',28)}</div><div class="ff-content"><h3>Deposit and Withdrawal System</h3><p>Fund your account with USDT, BTC, ETH and other cryptos. Withdraw your earnings to your personal crypto wallet anytime.</p><ul class="ff-list"><li>Multi-crypto deposit support</li><li>KYC-verified fast withdrawals</li><li>Full transaction history</li></ul></div></div>
    <div class="full-feat-card"><div class="ff-icon" style="background:rgba(239,68,68,0.15);border-color:rgba(239,68,68,0.3);color:#ef4444;">${svg(I.shield,'currentColor',28)}</div><div class="ff-content"><h3>Bank-Grade Security</h3><p>FinCEN MSB licensed and ISO 27001 certified. 256-bit SSL encryption protects all your data and assets at all times.</p><ul class="ff-list"><li>256-bit SSL encryption</li><li>KYC identity verification</li><li>Admin-level fraud monitoring</li></ul></div></div>
  </div>
  <div class="screens-showcase">
    <div class="section-header"><div class="section-tag">App Screens</div><h2>A beautiful, <span class="gradient-text">intuitive experience</span></h2></div>
    <div class="screens-grid">
      <div class="screen-card"><div class="screen-preview"><div class="sp-header"><span>Dashboard</span><span class="mono green">+$248.50</span></div><div class="sp-balance">$12,458.92</div><div class="sp-subtitle">Total Portfolio Value</div><div class="sp-bars"><div class="sp-bar" style="height:60%"></div><div class="sp-bar" style="height:75%"></div><div class="sp-bar" style="height:55%"></div><div class="sp-bar" style="height:85%"></div><div class="sp-bar" style="height:70%"></div><div class="sp-bar" style="height:90%"></div><div class="sp-bar" style="height:80%"></div></div></div><div class="screen-label">&#128202; Dashboard</div><div class="screen-desc">Portfolio, live prices, mining status</div></div>
      <div class="screen-card"><div class="screen-preview"><div class="sp-header"><span>Markets</span><span class="mono">Live</span></div><div class="market-row"><span>BTC</span><span class="mono green">+3.2%</span></div><div class="market-row"><span>ETH</span><span class="mono green">+1.8%</span></div><div class="market-row"><span>SOL</span><span class="mono green">+5.1%</span></div><div class="market-row"><span>BNB</span><span class="mono red">-0.4%</span></div></div><div class="screen-label">&#128200; Markets</div><div class="screen-desc">Live prices and candlestick charts</div></div>
      <div class="screen-card"><div class="screen-preview"><div class="sp-header"><span>Mining</span><span style="color:#10b981;font-size:11px">&#9679; ACTIVE</span></div><div class="mining-row"><div><div style="font-size:11px;font-weight:700">Bitmain S19 Pro ASIC</div><div style="font-size:10px;color:#9ca3af">BTC Mining</div></div><div class="mono green" style="font-size:11px">+$6.67/d</div></div><div class="timer-display mono">14:22:38</div><div style="font-size:10px;color:#9ca3af;text-align:center;margin-top:4px">Next claim in</div><div class="claim-btn">&#9889; Claim Profit</div></div><div class="screen-label">&#9935;&#65039; Mining Claim</div><div class="screen-desc">Claim 24-hour profits with one tap</div></div>
      <div class="screen-card"><div class="screen-preview"><div class="sp-header"><span>Wallet</span><span></span></div><div class="sp-balance">$3,248.50</div><div class="sp-subtitle">Available Balance</div><div class="wallet-btns"><div class="wallet-btn dep">+ Deposit</div><div class="wallet-btn wit">&#8722; Withdraw</div></div><div class="tx-row" style="margin-top:6px"><span>Mining Profit</span><span class="mono green">+$6.67</span></div><div class="tx-row"><span>Withdrawal</span><span class="mono red">-$100</span></div></div><div class="screen-label">&#128176; Wallet</div><div class="screen-desc">Deposits, withdrawals, and balance</div></div>
    </div>
  </div>
</div>`;
}

function renderPlans(){
  const e=el('plans');
  const plans = [
    ['starter', 'STARTER MINER', 'Starter Micro Rig', 'Bitmain S19 Micro ASIC', '$10 &ndash; $49', '25 TH/s', '+$0.67+/day', '$10', '$0.67/day', '$20 total', false],
    ['starter', 'BRONZE MINER', 'Bronze ASIC Rig', 'Bitmain S19 ASIC', '$50 &ndash; $99', '45 TH/s', '+$3.33+/day', '$50', '$3.33/day', '$100 total', false],
    ['pro', 'POPULAR MINER', 'Silver Pro Rig', 'Bitmain S19 Pro ASIC', '$100 &ndash; $199', '85 TH/s', '+$6.67+/day', '$100', '$6.67/day', '$200 total', true],
    ['pro', 'HIGH HASHRATE', 'Gold Power Cluster', 'MicroBT M30S++ Cluster', '$200 &ndash; $499', '180 TH/s', '+$13.33+/day', '$200', '$13.33/day', '$400 total', false],
    ['elite', 'PRO MINING FARM', 'Platinum GPU Farm', '8x RTX 4090 GPU Array', '$500 &ndash; $999', '450 TH/s', '+$33.33+/day', '$500', '$33.33/day', '$1000 total', false],
    ['enterprise', 'PREMIUM NODE', 'Diamond SuperNode', 'Canaan Avalon 1246 SuperNode', '$1000 &ndash; $2499', '1,000 TH/s', '+$66.67+/day', '$1000', '$66.67/day', '$2000 total', false],
    ['enterprise', 'INDUSTRIAL RIG', 'VIP Hydro DataCenter', 'Liquid-Cooled ASIC Suite', '$2500 &ndash; $10000', '2,500 TH/s', '+$166.67+/day', '$2500', '$166.67/day', '$5000 total', false]
  ];
  const coins=[['btc','BTC','Bitcoin','&#8383;'],['eth','ETH','Ethereum','&#926;'],['usdt','USDT','Tether','&#8366;'],['sol','SOL','Solana','&#9676;'],['bnb','BNB','Binance','B'],['doge','DOGE','Dogecoin','&#208;'],['ltc','LTC','Litecoin','&#321;']];
  e.innerHTML=`<div class="page-hero-simple"><div class="page-hero-tag">&#9935;&#65039; Mining Plans</div><h1>Choose Your <span class="gradient-text">Mining Machine</span></h1><p>We offer 7 hardware tiers. All plans run for 30 days and guarantee 200% return.</p></div>
<div style="padding: 0 5%; max-width: 1200px; margin: 0 auto 40px auto;"><img src="assets/crypto_coins.jpg" alt="Crypto Coins" style="width: 100%; height: 320px; object-fit: cover; border-radius: 20px; border: 1px solid rgba(16,185,129,0.3); box-shadow: 0 0 30px rgba(16,185,129,0.15);"></div>
<div class="section-container">
  <div class="returns-explainer">
    <div class="re-item"><div class="re-num">1</div><div class="re-text"><strong>You Invest</strong><span>Choose plan, invest amount</span></div></div><div class="re-arrow">&rarr;</div>
    <div class="re-item"><div class="re-num">2</div><div class="re-text"><strong>Machine Mines</strong><span>ASIC rig mines crypto for 24 hours</span></div></div><div class="re-arrow">&rarr;</div>
    <div class="re-item"><div class="re-num">3</div><div class="re-text"><strong>Claim Daily</strong><span>Claim profit every 24 hours</span></div></div><div class="re-arrow">&rarr;</div>
    <div class="re-item"><div class="re-num">4</div><div class="re-text"><strong>2x in 30 Days</strong><span>Receive double your investment back</span></div></div>
  </div>
  <div class="all-plans-grid">
    ${plans.map(p=>`<div class="full-plan-card ${p[10]?'popular-plan-card':''}">
      ${p[10]?'<div class="popular-ribbon">&#11088; MOST POPULAR</div>':''}
      <div class="plan-badge ${p[0]}">${p[1]}</div>
      <div class="fp-top"><div class="fp-name">${p[2]}</div><div class="fp-hardware">${p[3]}</div></div>
      <div class="fp-price-range">${p[4]}</div>
      <div class="fp-stats">
        <div class="fp-stat"><span>Hashrate</span><span class="mono cyan">${p[5]}</span></div>
        <div class="fp-stat"><span>Daily Profit</span><span class="mono green">${p[6]}</span></div>
        <div class="fp-stat"><span>Duration</span><span class="mono">30 Days</span></div>
        <div class="fp-stat"><span>Total Return</span><span class="mono green">200% (2x)</span></div>
        <div class="fp-stat"><span>Coins</span><span class="mono">All 7 Coins</span></div>
      </div>
      <div class="fp-example"><div class="fp-ex-title">Example: Invest ${p[7]}</div><div class="fp-ex-row"><span>Daily:</span><span class="mono green">+${p[8]}</span></div><div class="fp-ex-row"><span>Total (30d):</span><span class="mono green">${p[9]}</span></div></div>
      <button class="btn-primary-lg w100" onclick="showPage('download')">Start Mining</button>
    </div>`).join('')}
  </div>
  <div class="supported-coins-section">
    <div class="section-header"><div class="section-tag">Supported Coins</div><h2>Mine any of these <span class="gradient-text">7 cryptocurrencies</span></h2></div>
    <div class="coins-grid">${coins.map(c=>`<div class="coin-card"><div class="coin-icon ${c[0]}">${c[3]}</div><div class="coin-name">${c[2]}</div><div class="coin-sym">${c[1]}</div></div>`).join('')}</div>
  </div>
</div>`;
}

function renderHowTo(){
  const e=el('howto');
  const steps=[['01','blue',I.dl,'Download and Install the App','Download the ClaudeMining APK file from this website. On your Android phone, go to Settings, enable Install from Unknown Sources, then tap the APK file to install it. The whole process takes less than 2 minutes.','&#128241; Requires Android 7.0 or higher. The app is completely free.'],['02','green',I.user,'Create Your Free Account','Open the app and tap Sign Up. Enter your full name, email address, and create a secure password. Your account is ready immediately with no waiting period required.','&#10003; Free account. No credit card required at this stage.'],['03','cyan',I.bag,'Deposit Funds to Your Wallet','Go to the Wallet section and tap Deposit. You will see your crypto wallet address. Send USDT, BTC, ETH or any supported cryptocurrency to this address. Balance is credited after blockchain confirmation, usually 10 to 30 minutes.','&#128176; Minimum deposit: $10 equivalent. Accepted: USDT, BTC, ETH, SOL, BNB, DOGE, LTC'],['04','yellow',I.monitor,'Purchase a Mining Machine Plan','Navigate to the Investment section. Browse the 7 hardware tiers from Starter Micro Rig ($10) to VIP Hydro DataCenter ($2500+). Select your preferred plan, enter your investment amount, choose the coin you want to mine, and confirm the purchase.','&#9889; Your 24-hour mining cycle starts immediately after purchase confirmation.'],['05','purple',I.zap,'Claim Your Daily Mining Profit','Every 24 hours your mining cycle completes and profit becomes claimable. Open the app and go to your Claim page. When the Claim Profit button appears, tap it to add that day\'s earnings directly to your wallet balance.','&#127919; Daily profit formula: Total Investment x 200 percent divided by 30 days'],['06','red',I.truck,'Withdraw Your Earnings','When you want to cash out, go to Wallet and tap Withdraw. Enter your personal crypto wallet address and the amount you want to withdraw. Our admin team reviews and processes your request within 24 hours.','&#128274; KYC identity verification is required before your first withdrawal for platform security.']];
  const faqs=[['Is ClaudeMining real and legitimate?','Yes. ClaudeMining Global Inc. is registered and FinCEN MSB Licensed under registration number 31000284. We hold ISO/IEC 27001 certification for information security. The platform has been operating continuously since 2021 with over 1.25 million verified investors and more than 48 million dollars paid out in total profits.'],['How is the 200 percent return guaranteed?','Our physical ASIC mining hardware generates consistent revenue from cryptocurrency mining operations. We distribute exactly 200 percent of your investment back to you over 30 daily profit cycles. These profits come directly from mining revenue, not from deposits by other investors.'],['What is the minimum amount I can invest?','The minimum investment is just 10 US dollars using our Starter Micro Rig plan. This low entry point allows anyone to get started and experience the platform before investing larger amounts.'],['How long does a withdrawal request take?','All withdrawal requests are reviewed by our admin team and processed within 24 hours. Once processed, the cryptocurrency is sent directly to the external wallet address you provided.'],['Which cryptocurrencies can I mine?','You can choose to mine Bitcoin BTC, Ethereum ETH, Tether USDT, Solana SOL, Binance Coin BNB, Dogecoin DOGE, or Litecoin LTC. You select your preferred coin at the time of purchasing your mining plan.'],['What happens when my 30-day plan expires?','After 30 days you will have received the full 200 percent return through your daily profit claims. Your original plan expires and you are free to reinvest your earnings into a new mining plan to continue earning daily profits.'],['Is the app available for iPhone or iOS?','Currently the ClaudeMining application is available as an Android APK file only. An iOS version for iPhone is currently under development. Android users can download the APK directly from this website at no cost.'],['How does the referral system work?','Every user receives a unique referral link that can be shared with friends and family. When someone registers using your referral link and begins mining, you automatically receive commission bonuses. All referral earnings are tracked in real time inside the Referrals section of the app.']];
  e.innerHTML=`<div class="page-hero-simple"><div class="page-hero-tag">&#128218; User Guide</div><h1>How <span class="gradient-text">ClaudeMining</span> Works</h1><p>Start earning in 6 simple steps. No technical knowledge required.</p></div>
<div class="section-container">
  <div class="steps-timeline">
    ${steps.map(s=>`<div class="step-item"><div class="step-num">${s[0]}</div><div class="step-content"><div class="step-icon ${s[1]}">${svg(s[2])}</div><div><h3>${s[3]}</h3><p>${s[4]}</p><div class="step-note">${s[5]}</div></div></div></div>`).join('')}
  </div>
  <div class="faq-section">
    <div class="section-header"><div class="section-tag">FAQ</div><h2>Frequently Asked <span class="gradient-text">Questions</span></h2></div>
    <div class="faq-grid">${faqs.map(f=>`<div class="faq-item" onclick="toggleFAQ(this)"><div class="faq-q">${f[0]}<span class="faq-arrow">&#9660;</span></div><div class="faq-a">${f[1]}</div></div>`).join('')}</div>
  </div>
</div>`;
}

function renderDownload(){
  const e=el('download');
  const feats=[['&#128202;','Live market charts'],['&#9935;&#65039;','Mining machine catalog'],['&#9889;','Daily profit claiming'],['&#128176;','Deposit and withdrawals'],['&#128101;','Referral system'],['&#127773;','Dark mode UI'],['&#128232;','24/7 support']];
  const steps=[['Download the APK File','Tap the download button above. The APK file will save to your Android Downloads folder.'],['Enable Unknown Sources','Go to Settings, then Security, then Install Unknown Apps and enable it for your browser.'],['Open the APK File','Open your Downloads folder or notification bar and tap the APK file to begin installation.'],['Tap Install','Android will ask for confirmation. Tap Install and wait a few seconds for it to complete.'],['Create Account and Start Mining','Open the ClaudeMining app, create your free account, deposit funds, and select a mining plan.']];
  e.innerHTML=`<div class="page-hero-simple"><div class="page-hero-tag">&#128242; Download</div><h1>Get the <span class="gradient-text">ClaudeMining App</span></h1><p>Download, install, and start mining in under 5 minutes. 100% Free.</p></div>
<div class="section-container">
  <div class="download-main-card">
    <div class="download-info">
      <div class="app-logo-big" style="overflow:hidden;padding:0;background:transparent;">
        <img src="assets/logo.jpg" alt="ClaudeMining Logo" style="width:72px;height:72px;border-radius:18px;object-fit:cover;border:2px solid #06b6d4;box-shadow:0 8px 24px rgba(6,182,212,0.4);">
      </div>
      <h2>ClaudeMining <span class="gradient-text">Official Android App</span></h2>
      <p>The full-featured cloud mining platform in your pocket. Monitor live crypto markets, manage your mining machines, claim daily profits, and withdraw earnings to your own wallet &mdash; all from your Android phone for free.</p>
      <div class="app-meta">
        <div class="meta-item"><span class="meta-label">Platform</span><span class="meta-val">Android 7.0+</span></div>
        <div class="meta-item"><span class="meta-label">File Type</span><span class="meta-val">.APK</span></div>
        <div class="meta-item"><span class="meta-label">File Size</span><span class="meta-val">16.4 MB</span></div>
        <div class="meta-item"><span class="meta-label">Price</span><span class="meta-val green">FREE</span></div>
      </div>
      <a href="/ClaudeMining.apk" download="ClaudeMining.apk" class="download-btn">${svg(I.dl,'currentColor',22)} Download ClaudeMining.apk &mdash; Free</a>
      <div class="download-trust"><div class="dt-item">&#10003; 100% Free</div><div class="dt-item">&#128274; Virus Free &bull; Verified</div><div class="dt-item">&#9889; Fast Direct Install</div></div>
    </div>
    <div class="install-guide">
      <h3>&#128241; How to Install on Android</h3>
      <div class="install-steps">
        ${steps.map((s,i)=>`<div class="install-step"><div class="is-num">${i+1}</div><div class="is-text"><strong>${s[0]}</strong><span>${s[1]}</span></div></div>`).join('')}
      </div>
    </div>
  </div>
  <div class="dl-features">${feats.map(f=>`<div class="dl-feat"><div class="dlf-icon">${f[0]}</div><div class="dlf-text">${f[1]}</div></div>`).join('')}</div>
  <div class="contact-section">
    <div class="section-header"><div class="section-tag">Support</div><h2>Need <span class="gradient-text">Help?</span></h2></div>
    <div class="contact-grid">
      <div class="contact-card"><div class="cc-icon">&#128231;</div><div class="cc-title">24/7 Customer Support</div><div class="cc-val"><a href="mailto:support@claudemining.com" style="color:#10b981;text-decoration:none;">support@claudemining.com</a></div><div class="cc-desc">Direct user tickets & assistance</div></div>
      <div class="contact-card"><div class="cc-icon">&#127758;</div><div class="cc-title">Corporate & Inquiries</div><div class="cc-val"><a href="mailto:info@claudemining.com" style="color:#06b6d4;text-decoration:none;">info@claudemining.com</a></div><div class="cc-desc">General business communication</div></div>
      <div class="contact-card"><div class="cc-icon">&#128172;</div><div class="cc-title">In-App Live Support</div><div class="cc-val">Support Desk</div><div class="cc-desc">Chat directly inside user portal</div></div>
    </div>
  </div>
</div>`;
}

document.addEventListener('DOMContentLoaded',()=>{
  const p=localStorage.getItem('cm_current_page')||'home';
  showPage(p);
  startLiveTickerEngine();
});
