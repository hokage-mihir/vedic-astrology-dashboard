# 🌙 Moon Mood - Vedic Astrology Dashboard

<div align="center">

[![Live Demo](https://img.shields.io/badge/demo-live-success?style=for-the-badge)](https://your-deployment-url.vercel.app)
[![PWA Ready](https://img.shields.io/badge/PWA-ready-blue?style=for-the-badge)](https://web.dev/progressive-web-apps/)
[![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)](LICENSE)

**A modern Progressive Web App for tracking Chandrashtam periods and cosmic influences on consciousness using Vedic astrology**

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Documentation](#-documentation) • [Contributing](#-contributing)

</div>

---

## ✨ Features

### 🎯 Real-time Calculations
- **Live Chandrashtam Calculator** - Real-time Moon position with countdown to next transition
- **Nakshatra Details** - Current lunar mansion with deity, ruler, and symbols
- **Panchang Information** - Daily timings, Tithi, and Rahu Kalam
- **Moon Phase Visualization** - Accurate lunar phase display with illumination percentage

### 📅 Annual Calendar View
- Pre-calculated Chandrashtam periods for the entire year
- Month-by-month breakdown for all 12 Rashis
- Detailed statistics (total periods, duration, averages)
- Expandable period cards with precise start/end times

### 🔔 Smart Notifications
- In-app toast notifications for Chandrashtam transitions
- Browser push notifications (even when tab is closed)
- Customizable notification settings
- Alerts for period start and end times

### 📱 Progressive Web App (PWA)
- **Install on any device** - Works like a native app
- **Offline support** - Access calculations without internet
- **Add to home screen** - One-tap access from your device
- **Background sync** - Stay updated even when closed

### ♿ Accessibility First
- Full WCAG 2.1 AA compliance
- Screen reader support with ARIA labels
- `prefers-reduced-motion` support for animations
- Keyboard navigation throughout
- High contrast color schemes

### 🎨 Modern UI/UX
- Beautiful gradient animations (respects motion preferences)
- Smooth transitions with Framer Motion
- Dark/light mode support (coming soon)
- Responsive design for all screen sizes
- Cosmic-themed color palette

---

## 🚀 Demo

### Live Application
👉 [View Live Demo](https://your-deployment-url.vercel.app)

### Screenshots
![Dashboard Preview](docs/screenshots/dashboard.png)
*Real-time Chandrashtam calculator with Moon position*

![Annual Calendar](docs/screenshots/calendar.png)
*Year-long Chandrashtam periods for any Rashi*

![Notifications](docs/screenshots/notifications.png)
*Smart notification system with customizable alerts*

---

## 💻 Technology Stack

### Frontend
- **React 18** - UI library with hooks
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **shadcn/ui** - Beautiful UI components

### Astronomy & Calculations
- **Astronomia** - Precise astronomical calculations
- **SunCalc** - Sun/Moon position algorithms
- Custom Vedic calculation engine

### PWA & Performance
- **vite-plugin-pwa** - PWA configuration
- **Workbox** - Service worker strategies
- **React optimization** - Memoization, lazy loading

### Notifications
- **Web Notifications API** - Browser push notifications
- Custom toast notification system
- Persistent notification settings

---

## ⚙️ Prerequisites

```bash
Node.js >= 18.0.0
npm >= 9.0.0
```

---

## 📦 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/hokage-mihir/vedic-astrology-dashboard.git
cd vedic-astrology-dashboard
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 4. Build for Production
```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```
vedic-astrology-dashboard/
├── src/
│   ├── components/
│   │   ├── ChandrashtamCalculator.jsx    # Live calculator
│   │   ├── ChandrashtamAnnualView.jsx    # Annual calendar
│   │   ├── NakshatraInfo.jsx             # Nakshatra details
│   │   ├── PanchangDetails.jsx           # Daily Panchang
│   │   ├── MoonPhase.jsx                 # Moon visualization
│   │   ├── NotificationSettings.jsx      # Notification controls
│   │   ├── TimezoneSelector.jsx          # Location selector
│   │   └── ui/                           # Reusable UI components
│   ├── contexts/
│   │   └── NotificationContext.jsx       # Global notifications
│   ├── hooks/
│   │   └── useReducedMotion.js           # Accessibility hook
│   ├── lib/
│   │   ├── astro-calculator.js           # Astronomical calculations
│   │   ├── chandrashtam-calendar.js      # Chandrashtam logic
│   │   ├── sun-calculator.js             # Sun position
│   │   └── vedic-constants.js            # Vedic data constants
│   ├── data/
│   │   └── chandrashtam-2025.json        # Pre-calculated data
│   ├── App.jsx
│   └── main.jsx
├── public/
│   ├── manifest.json                      # PWA manifest
│   └── icon-*.png                         # PWA icons
├── scripts/
│   ├── generate-chandrashtam-data.js     # Data generator
│   └── generate-icons.js                  # Icon generator
├── docs/                                  # Documentation
├── vite.config.js                         # Vite + PWA config
└── tailwind.config.js                     # Tailwind config
```

---

## 🔧 Configuration

### Generate Chandrashtam Data
Pre-calculate Chandrashtam periods for any year:

```bash
# Generate for 2025 (default)
npm run generate:chandrashtam

# Generate for specific year
npm run generate:chandrashtam 2026
```

This creates a JSON file in `src/data/` with ~165 periods across all 12 Rashis.

### Change Default Year
Edit `src/App.jsx`:
```jsx
<ChandrashtamAnnualView year={2026} />
```

### Customize Location
Edit `src/components/TimezoneSelector.jsx` to add your location:
```javascript
export const LOCATIONS = [
  { name: 'Mumbai', lat: 19.0760, lon: 72.8777, tz: 'Asia/Kolkata' },
  { name: 'Your City', lat: XX.XXXX, lon: YY.YYYY, tz: 'Your/Timezone' },
]
```

---

## 📚 Documentation

Detailed documentation is available in the [`docs/`](docs/) folder:

- [📅 Chandrashtam Calendar Guide](docs/CHANDRASHTAM_CALENDAR.md)
- [⚡ Performance Optimizations](docs/PERFORMANCE_OPTIMIZATIONS.md)
- [✅ Code Quality Improvements](docs/IMPROVEMENTS_SUMMARY.md)

---

## 🎯 Core Concepts

### Chandrashtam (Chandra Ashtama)
Chandrashtam occurs when the Moon transits the 8th house from your Moon sign. This period is associated with:
- Mental and emotional challenges
- Increased negative thoughts
- Decision-making difficulties
- General stress and confusion

**The Solution:** Awareness of these periods helps mitigate their effects. Simply knowing when Chandrashtam is active can reduce its negative impact.

### Rashi Mapping
| Your Rashi | Chandrashtam When Moon In |
|------------|---------------------------|
| Mesh (Aries) | Vrischik (Scorpio) |
| Vrishab (Taurus) | Dhanu (Sagittarius) |
| Mithun (Gemini) | Makar (Capricorn) |
| Kark (Cancer) | Kumbha (Aquarius) |
| Simha (Leo) | Meen (Pisces) |
| Kanya (Virgo) | Mesh (Aries) |
| Tula (Libra) | Vrishab (Taurus) |
| Vrischik (Scorpio) | Mithun (Gemini) |
| Dhanu (Sagittarius) | Kark (Cancer) |
| Makar (Capricorn) | Simha (Leo) |
| Kumbha (Aquarius) | Kanya (Virgo) |
| Meen (Pisces) | Tula (Libra) |

---

## 🧪 Testing PWA Features

### Install as App
1. Open the app in Chrome/Edge/Safari
2. Look for the install icon in the address bar
3. Click "Install" to add to your device
4. App opens in standalone window

### Test Offline Mode
1. Install the app
2. Open DevTools → Network → Set to "Offline"
3. App continues to work with cached data

### Test Notifications
1. Open Notification Settings in the app
2. Enable browser notifications
3. Grant permission when prompted
4. Wait for a Chandrashtam transition to test

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines
- Follow the existing code style
- Add comments for complex calculations
- Update documentation for new features
- Test on multiple devices/browsers
- Ensure accessibility compliance

---

## 🐛 Known Issues

- Calculations are approximate (±5 minutes accuracy)
- Limited to predefined locations (expandable)
- Browser notification support varies by browser/OS
- Service worker may not update immediately in some browsers

---

## 🔮 Roadmap

### v1.1 (Coming Soon)
- [ ] Dark mode toggle
- [ ] Multiple language support (Hindi, Sanskrit)
- [ ] Export calendar to iCal/Google Calendar
- [ ] Custom location with geolocation

### v2.0 (Future)
- [ ] Personal birth chart integration
- [ ] Remedies and suggestions during Chandrashtam
- [ ] Planetary position tracker
- [ ] Muhurta (auspicious time) calculator
- [ ] Historical data visualization

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **[Astronomia](https://github.com/commenthol/astronomia)** - Astronomical calculations library
- **[SunCalc](https://github.com/mourner/suncalc)** - Sun/Moon position algorithms
- **[shadcn/ui](https://ui.shadcn.com/)** - Beautiful React components
- **[Framer Motion](https://www.framer.com/motion/)** - Animation library
- **Indian Vedic texts** - Traditional astronomical knowledge

---

## 📞 Support

- 🐛 [Report a Bug](https://github.com/hokage-mihir/vedic-astrology-dashboard/issues/new?labels=bug)
- 💡 [Request a Feature](https://github.com/hokage-mihir/vedic-astrology-dashboard/issues/new?labels=enhancement)
- 📖 [Read the Docs](docs/)
- ⭐ Star this repo if you find it helpful!

---

## 🌟 Show Your Support

If this project helped you track cosmic influences or understand Vedic astrology better, please consider:

- ⭐ Starring the repository
- 🐦 Sharing on social media
- 🤝 Contributing to the project
- ☕ [Buying me a coffee](https://buymeacoffee.com/your-link) (optional)

---

<div align="center">

**Made with 🌙 and ❤️ by Mihir**

[GitHub](https://github.com/hokage-mihir) • [Website](https://your-website.com) • [Twitter](https://twitter.com/your-handle)

</div>
