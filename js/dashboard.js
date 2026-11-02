/**
 * Fintech & Quantitative Trading Dashboard - Engine
 * 60 FPS Canvas Candlestick Renderer & Live Market Simulator
 * Author: Ilekuba Chinedu (B.Sc. Computer Science)
 */

// Global State
const state = {
  activeSymbol: 'XAUUSD',
  symbols: {
    'XAUUSD': { name: 'XAUUSD', cat: 'Commodities / Gold', price: 2742.50, digits: 2, pipSize: 0.1, change: '+1.42%', up: true },
    'EURUSD': { name: 'EURUSD', cat: 'Forex Major', price: 1.0845, digits: 4, pipSize: 0.0001, change: '+0.18%', up: true },
    'BTCUSD': { name: 'BTCUSD', cat: 'Crypto Asset', price: 68420.00, digits: 2, pipSize: 1.0, change: '+3.15%', up: true },
    'USTEC':  { name: 'USTEC',  cat: 'Tech 100 Index', price: 20380.20, digits: 2, pipSize: 1.0, change: '-0.34%', up: false }
  },
  candles: [],
  positions: [
    { id: 748291, symbol: 'XAUUSD', type: 'BUY', lots: 1.00, openPrice: 2736.20, sl: 2728.00, tp: 2755.00, profit: 630.00 }
  ],
  balance: 50000.00,
  activeTf: 'M15'
};

document.addEventListener('DOMContentLoaded', () => {
  initWatchlist();
  initChart();
  initOrderPanel();
  renderPositions();
  startMarketStream();
});

/* ==========================================================================
   WATCHLIST CONTROLLER
   ========================================================================== */
function initWatchlist() {
  const container = document.getElementById('watchlist-container');
  if (!container) return;

  container.innerHTML = '';
  Object.values(state.symbols).forEach(sym => {
    const row = document.createElement('div');
    row.className = `watchlist-row ${sym.name === state.activeSymbol ? 'active' : ''}`;
    row.id = `wl-${sym.name}`;
    row.innerHTML = `
      <div>
        <div class="symbol-name">${sym.name}</div>
        <div class="symbol-cat">${sym.cat}</div>
      </div>
      <div>
        <div class="symbol-price" id="price-${sym.name}">${sym.price.toFixed(sym.digits)}</div>
        <div class="symbol-change ${sym.up ? 'val-green' : 'val-red'}">${sym.change}</div>
      </div>
    `;

    row.addEventListener('click', () => {
      document.querySelectorAll('.watchlist-row').forEach(r => r.classList.remove('active'));
      row.classList.add('active');
      state.activeSymbol = sym.name;
      generateHistoricalCandles();
      updateOrderButtons();
    });

    container.appendChild(row);
  });
}

/* ==========================================================================
   CANVAS CANDLESTICK ENGINE
   ========================================================================== */
let canvas, ctx;

function initChart() {
  canvas = document.getElementById('main-chart');
  if (!canvas) return;
  ctx = canvas.getContext('2d');

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  document.querySelectorAll('.tf-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tf-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.activeTf = btn.dataset.tf;
      generateHistoricalCandles();
    });
  });

  generateHistoricalCandles();
  requestAnimationFrame(renderLoop);
}

function resizeCanvas() {
  const rect = canvas.parentElement.getBoundingClientRect();
  canvas.width = rect.width * window.devicePixelRatio;
  canvas.height = rect.height * window.devicePixelRatio;
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
}

function generateHistoricalCandles() {
  const count = 45;
  const sym = state.symbols[state.activeSymbol];
  let curPrice = sym.price - (count * sym.pipSize * 3);
  state.candles = [];

  for (let i = 0; i < count; i++) {
    const delta = (Math.random() - 0.48) * sym.pipSize * 10;
    const open = curPrice;
    const close = open + delta;
    const high = Math.max(open, close) + Math.random() * sym.pipSize * 6;
    const low = Math.min(open, close) - Math.random() * sym.pipSize * 6;
    curPrice = close;

    state.candles.push({ open, high, low, close });
  }
}

function renderLoop() {
  drawChart();
  requestAnimationFrame(renderLoop);
}

function drawChart() {
  if (!canvas || !ctx) return;
  const width = canvas.width / window.devicePixelRatio;
  const height = canvas.height / window.devicePixelRatio;

  // Clear Screen
  ctx.fillStyle = '#0a0e17';
  ctx.fillRect(0, 0, width, height);

  // Grid Lines
  ctx.strokeStyle = '#151d2f';
  ctx.lineWidth = 1;
  for (let y = 30; y < height; y += 45) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  const candles = state.candles;
  if (!candles.length) return;

  // High/Low Bounds
  let minPrice = Infinity;
  let maxPrice = -Infinity;
  candles.forEach(c => {
    if (c.low < minPrice) minPrice = c.low;
    if (c.high > maxPrice) maxPrice = c.high;
  });

  const range = (maxPrice - minPrice) || 1;
  const paddingY = 30;
  const chartHeight = height - (paddingY * 2);

  const getY = (price) => {
    return paddingY + chartHeight * (1 - (price - minPrice) / range);
  };

  const candleWidth = (width - 60) / candles.length;
  const candleGap = 3;

  // Draw Candlesticks
  candles.forEach((c, i) => {
    const x = 20 + i * candleWidth;
    const isBull = c.close >= c.open;
    const color = isBull ? '#10b981' : '#ef4444';

    const yOpen = getY(c.open);
    const yClose = getY(c.close);
    const yHigh = getY(c.high);
    const yLow = getY(c.low);

    // Wick
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(x + (candleWidth - candleGap) / 2, yHigh);
    ctx.lineTo(x + (candleWidth - candleGap) / 2, yLow);
    ctx.stroke();

    // Body
    ctx.fillStyle = color;
    const top = Math.min(yOpen, yClose);
    const bodyHeight = Math.max(Math.abs(yClose - yOpen), 2);
    ctx.fillRect(x, top, candleWidth - candleGap, bodyHeight);
  });

  // Current Price Line
  const lastCandle = candles[candles.length - 1];
  const currentY = getY(lastCandle.close);
  ctx.strokeStyle = lastCandle.close >= lastCandle.open ? '#10b981' : '#ef4444';
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(0, currentY);
  ctx.lineTo(width - 60, currentY);
  ctx.stroke();
  ctx.setLineDash([]);

  // Right Price Axis Tag
  ctx.fillStyle = ctx.strokeStyle;
  ctx.fillRect(width - 60, currentY - 10, 60, 20);
  ctx.fillStyle = '#ffffff';
  ctx.font = '10px monospace';
  ctx.fillText(lastCandle.close.toFixed(state.symbols[state.activeSymbol].digits), width - 56, currentY + 4);
}

/* ==========================================================================
   ORDER EXECUTION & LIVE POSITIONS
   ========================================================================== */
function initOrderPanel() {
  document.getElementById('btn-buy').addEventListener('click', () => placeOrder('BUY'));
  document.getElementById('btn-sell').addEventListener('click', () => placeOrder('SELL'));
  updateOrderButtons();
}

function updateOrderButtons() {
  const sym = state.symbols[state.activeSymbol];
  const buyRate = (sym.price + sym.pipSize * 0.5).toFixed(sym.digits);
  const sellRate = (sym.price - sym.pipSize * 0.5).toFixed(sym.digits);

  document.getElementById('buy-price-tag').textContent = buyRate;
  document.getElementById('sell-price-tag').textContent = sellRate;
  document.getElementById('current-symbol-label').textContent = sym.name;
}

function placeOrder(type) {
  const sym = state.symbols[state.activeSymbol];
  const lots = parseFloat(document.getElementById('order-lots').value) || 1.0;
  const slPips = parseFloat(document.getElementById('order-sl').value) || 25;
  const tpPips = parseFloat(document.getElementById('order-tp').value) || 50;

  const openPrice = sym.price;
  const sl = type === 'BUY' ? openPrice - (slPips * sym.pipSize) : openPrice + (slPips * sym.pipSize);
  const tp = type === 'BUY' ? openPrice + (tpPips * sym.pipSize) : openPrice - (tpPips * sym.pipSize);

  const newPosition = {
    id: Math.floor(100000 + Math.random() * 900000),
    symbol: sym.name,
    type,
    lots,
    openPrice,
    sl,
    tp,
    profit: 0.00
  };

  state.positions.unshift(newPosition);
  renderPositions();
}

function renderPositions() {
  const tbody = document.getElementById('positions-body');
  if (!tbody) return;

  tbody.innerHTML = '';
  let totalFloating = 0;

  state.positions.forEach(pos => {
    const sym = state.symbols[pos.symbol];
    const diff = pos.type === 'BUY' ? (sym.price - pos.openPrice) : (pos.openPrice - sym.price);
    const pips = diff / sym.pipSize;
    pos.profit = pips * pos.lots * 10;
    totalFloating += pos.profit;

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>#${pos.id}</td>
      <td style="font-weight: 700;">${pos.symbol}</td>
      <td class="${pos.type === 'BUY' ? 'val-green' : 'val-red'}">${pos.type}</td>
      <td>${pos.lots.toFixed(2)}</td>
      <td>${pos.openPrice.toFixed(sym.digits)}</td>
      <td>${sym.price.toFixed(sym.digits)}</td>
      <td>${pos.sl.toFixed(sym.digits)}</td>
      <td>${pos.tp.toFixed(sym.digits)}</td>
      <td class="${pos.profit >= 0 ? 'val-green' : 'val-red'}" style="font-weight: 700;">
        ${pos.profit >= 0 ? '+' : ''}$${pos.profit.toFixed(2)}
      </td>
      <td>
        <button class="btn-close" onclick="closePosition(${pos.id})">Close</button>
      </td>
    `;
    tbody.appendChild(row);
  });

  const equity = state.balance + totalFloating;
  document.getElementById('equity-val').textContent = `$${equity.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  const pnlEl = document.getElementById('floating-val');
  pnlEl.textContent = `${totalFloating >= 0 ? '+' : ''}$${totalFloating.toFixed(2)}`;
  pnlEl.className = `metric-val ${totalFloating >= 0 ? 'val-green' : 'val-red'}`;
}

window.closePosition = function(id) {
  const posIndex = state.positions.findIndex(p => p.id === id);
  if (posIndex !== -1) {
    state.balance += state.positions[posIndex].profit;
    state.positions.splice(posIndex, 1);
    document.getElementById('balance-val').textContent = `$${state.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
    renderPositions();
  }
};

/* ==========================================================================
   LIVE MARKET DATA STREAM (SIMULATED WEBSOCKET)
   ========================================================================== */
function startMarketStream() {
  setInterval(() => {
    // Pick random symbol to update
    const symKeys = Object.keys(state.symbols);
    const randKey = symKeys[Math.floor(Math.random() * symKeys.length)];
    const sym = state.symbols[randKey];

    const tickChange = (Math.random() - 0.49) * sym.pipSize * 2;
    sym.price += tickChange;

    const priceEl = document.getElementById(`price-${sym.name}`);
    if (priceEl) {
      priceEl.textContent = sym.price.toFixed(sym.digits);
      priceEl.style.color = tickChange >= 0 ? '#10b981' : '#ef4444';
      setTimeout(() => priceEl.style.color = '', 300);
    }

    // Update active chart's live candle
    if (randKey === state.activeSymbol && state.candles.length) {
      const activeCandle = state.candles[state.candles.length - 1];
      activeCandle.close = sym.price;
      if (sym.price > activeCandle.high) activeCandle.high = sym.price;
      if (sym.price < activeCandle.low) activeCandle.low = sym.price;
      updateOrderButtons();
    }

    renderPositions();
  }, 400);
}
