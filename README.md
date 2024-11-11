```markdown
# Vedic Astrology Dashboard

A modern web application that provides real-time Vedic astronomical calculations including Chandrashtam, Nakshatra positions, and Panchang details. This is a work in progress and a very first project of mine.

## Features

- **Chandrashtam Calculator**
  - Real-time Moon position in sidereal zodiac
  - Chandrashtam (8th from Moon) calculation
  - Accurate astronomical calculations using Astronomia library
  - Ayanamsa corrections (Lahiri)

- **Nakshatra Details**
  - Current Nakshatra with Pada (quarter)
  - Ruling deity and planetary ruler
  - Traditional symbols
  - Precise degree calculations

- **Vedic Details**
  - Tithi (lunar day) calculation
  - Karana (half-tithi)
  - Yoga calculations
  - Real-time updates of Sun and Moon positions

- **Panchang Details**
  - Current Muhurta
  - Inauspicious periods (Rahu Kalam, Gulika Kalam, Yamghanti)
  - Day divisions and important time periods
  - Customizable location-based calculations

## Technology Stack

- React (Vite)
- TailwindCSS
- Shadcn/ui Components
- Astronomia (for astronomical calculations)

## Prerequisites

```bash
Node.js >= 16.0.0
npm >= 7.0.0
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/vedic-astrology-dashboard.git
cd vedic-astrology-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

## Project Structure

```
vedic-astrology-dashboard/
├── src/
│   ├── components/
│   │   ├── ChandrashtamCalculator.jsx
│   │   ├── NakshatraInfo.jsx
│   │   ├── VedicDetails.jsx
│   │   ├── PanchangDetails.jsx
│   │   └── ui/
│   │       ├── card.jsx
│   │       └── alert.jsx
│   ├── lib/
│   │   └── astro-calculator.js
│   ├── App.jsx
│   └── main.jsx
├── public/
├── index.html
├── tailwind.config.cjs
├── postcss.config.cjs
└── vite.config.js
```

## Component Details

### ChandrashtamCalculator
Calculates and displays the current Moon position and the Chandrashtam (8th house) position in real-time.

### NakshatraInfo
Shows detailed information about the current lunar mansion including:
- Nakshatra name and pada
- Ruling deity
- Traditional symbol
- Planetary ruler

### VedicDetails
Displays various Vedic time divisions:
- Tithi (lunar day)
- Karana (half-tithi)
- Yoga (Sun-Moon combinations)
- Real-time astronomical positions

### PanchangDetails
Provides comprehensive daily timing information:
- Current Muhurta
- Inauspicious periods
- Important time divisions
- Daily auspicious periods

## Customization

### Ayanamsa Settings
You can modify the ayanamsa calculation in `astro-calculator.js`:
```javascript
const calculateAyanamsa = (jd) => {
  const T = (jd - 2451545.0) / 36525;
  return 23.85 + 0.0137 * T;
};
```

### Time Periods
Customize the Muhurta and other time period calculations in `PanchangDetails.jsx`.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE.md file for details

## Acknowledgments

- Astronomia library for astronomical calculations
- Shadcn/ui for React components
- Indian astrological texts for traditional calculations

## Support

For support, open an issue in the repository.

## Screenshots

[Will be added soon]

## Future Enhancements

- [ ] Add location-based calculations
- [ ] Include more detailed Muhurta information
- [ ] Add horoscope chart generation
- [ ] Add mobile application support
