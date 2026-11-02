# Institutional Fintech & Quantitative Trading Dashboard

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Real-Time](https://img.shields.io/badge/Engine-60FPS%20Canvas%20Chart-emerald.svg)]()
[![Data Ergonomics](https://img.shields.io/badge/UX-Sub--Second%20Recognition-blueviolet.svg)]()
[![Platform](https://img.shields.io/badge/Compatible-MT4%20%7C%20MT5%20%7C%20REST%20APIs-orange.svg)]()

> A high-performance, institutional-grade financial analytics dashboard engineered for active traders, proprietary trading firms, and quantitative desks. Features real-time price feeds, a 60 FPS HTML5 Canvas candlestick engine, simulated order-flow mechanics, and sub-second visual ergonomics.

---

## 🎯 Architectural Intent & Problem Solved

Active market participants make decisions in high-stress, high-frequency environments. Traditional trading web interfaces often suffer from:
1. **Excessive Visual Fatigue:** Over-saturated color schemes that tire the eyes during extended 8+ hour market sessions.
2. **High Input Latency:** Heavy DOM manipulations that cause UI stuttering during volatile market spikes (e.g. NFP, FOMC releases).
3. **Cognitive Overload:** Cluttered information architectures that obscure critical risk metrics (Equity, Floating Margin, Risk-to-Reward).

**This project solves these challenges** by implementing cognitive data ergonomics, a dedicated hardware-accelerated HTML5 Canvas candlestick renderer, and an institutional dark-mode palette strictly calibrated for contrast and optical comfort.

---

## 🛠️ Tech Stack & Directory Structure

```
fintech-trading-dashboard/
├── index.html           # Main Institutional Trading Station & Layout Architecture
├── css/
│   └── dashboard.css    # High-Density Financial UX, Dark-Mode Theme & Micro-Interactions
├── js/
│   └── dashboard.js     # Live Market Tick Simulator, 60 FPS Canvas Engine & Order Execution
└── README.md            # Technical Architecture & Engineering Documentation
```

* **Core Frontend:** Semantic HTML5, Modular CSS3 Grid/Flexbox (Zero Heavy UI Framework Overheads).
* **Visualization Engine:** Native HTML5 2D Canvas rendering real-time OHLC candlestick bars and dynamic technical indicator overlays.
* **State Management:** Reactive vanilla JavaScript event dispatcher managing live quote subscriptions, trade execution, and dynamic P&L reconciliation.

---

## ✨ Core Platform Capabilities

### 1. High-Precision Candlestick Engine
* **60 FPS Hardware-Accelerated Rendering:** Bypasses DOM bottlenecks by drawing OHLC candlesticks, wicks, and volume histograms directly on HTML5 Canvas.
* **Dynamic Timeframe Switching:** Instantaneous resolution switching between M1, M5, M15, H1, and D1 data structures without page reload.
* **Indicator Overlays:** Real-time 20-period Simple Moving Average (SMA) and dynamic trailing price markers.

### 2. Live Market Watchlist & Tick Stream
* Multi-asset coverage: Forex (**EUR/USD, GBP/USD**), Commodities (**XAU/USD Gold**), Crypto (**BTC/USD**), and Indices (**USTEC / Nasdaq**).
* Visual tick-flash indicators (neon emerald for positive bid updates, vibrant ruby for negative ask ticks).

### 3. One-Click Order Execution & Position Ledger
* Instant Buy/Sell order placement with dynamic lot sizing (0.01 to 10.0 lots).
* Automated Risk/Reward calculation based on user-defined Stop Loss and Take Profit pip offsets.
* Real-time position tracking ledger with live mark-to-market floating P&L calculations and instant position liquidation (`Close Position`).

---

## 🚀 Quick Start Guide

### Local Execution:
```bash
# Clone the repository:
git clone https://github.com/ilekubachinedu/fintech-trading-dashboard.git

# Open directly in any modern browser:
cd fintech-trading-dashboard
open index.html
```

---

## 📊 Design & Ergonomics Specification

| Attribute | Specification | Rationale |
| :--- | :--- | :--- |
| **Canvas Resolution** | High-DPI Retinal (`window.devicePixelRatio`) | Crisp candle edges on 4K multi-monitor trading desks |
| **Color Temperature** | Deep Slate (`#0b0f19` canvas, `#111827` cards) | Reduces blue light eye strain over extended sessions |
| **Profit/Loss Coding** | Emerald (`#10b981`) & Crimson (`#ef4444`) | Instantly recognizable status indicators compliant with financial conventions |
| **Typeface Hierarchy** | System Sans-Serif + Monospace Numerical Digits | Prevents tabular digit jitter during rapid price fluctuations |

---

## 👨‍💻 Author
**Ilekuba Chinedu**  
*Senior Technical Product Designer & Frontend Builder (B.Sc. Computer Science)*  
* **Specialization:** Financial UI/UX, Design Systems & Quantitative Trading Interfaces  
* **Portfolio:** [behance.net/ilekubachinedu1](https://www.behance.net/ilekubachinedu1)  
* **Email:** ilekubatrades@gmail.com  

---

## 📄 License
This repository is licensed under the [MIT License](LICENSE).
