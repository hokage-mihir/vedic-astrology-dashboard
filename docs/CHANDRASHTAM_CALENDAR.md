# Chandrashtam Calendar Feature

## Overview

The Vedic Astrology Dashboard now includes both **live Chandrashtam calculation** and **pre-calculated annual calendars** for all 12 Rashis.

## Features

### 1. Live Chandrashtam Calculator
- Real-time calculation of current Chandrashtam status
- Shows if your Rashi is currently affected
- Displays countdown to next transition
- Updates every minute using cached calculations

### 2. Annual Calendar View
- Pre-calculated Chandrashtam periods for entire year
- View all afflicted days for any Rashi
- Statistics: total periods, total days, average duration
- Month-by-month breakdown
- Expandable period details with exact start/end times

## Data Generation

### Pre-calculate Chandrashtam Data

To generate pre-calculated data for any year:

```bash
# Generate for current year
npm run generate:chandrashtam

# Generate for specific year
npm run generate:chandrashtam 2025
npm run generate:chandrashtam 2026
```

This creates a JSON file in `src/data/` containing:
- All Chandrashtam periods for each Rashi
- Precise start and end times (accurate to ~5 minutes)
- Duration of each period
- Total of ~165 periods across all 12 Rashis per year

### Generation Performance

- **Time**: ~0.1-0.2 seconds per year
- **Accuracy**: ±5 minutes (using binary search refinement)
- **File Size**: ~50KB per year
- **Cache**: Results are cached during generation for speed

## How It Works

### Calculation Method

1. **Coarse Scan**: Check Moon's Rashi every 6 hours
2. **Transition Detection**: Identify when Moon enters/exits target Rashi
3. **Binary Search Refinement**: Narrow down to 5-minute accuracy
4. **Data Storage**: Save as JSON with ISO timestamps

### Rashi Transition Times

The Moon:
- Spends ~2.25 days in each Rashi on average
- Moves ~13° per day (~0.5° per hour)
- Completes cycle through all 12 Rashis in ~27.3 days

### Chandrashtam Mapping

Each Rashi is afflicted when Moon is in its 8th position:

| Your Rashi | Afflicted When Moon In |
|------------|------------------------|
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

## Usage Examples

### View Your Annual Chandrashtam

1. Open the app
2. Scroll to "Chandrashtam Calendar 2025"
3. Select your Rashi from dropdown
4. See all periods where you're affected
5. Click on any period to expand details

### Generate Data for Multiple Years

```bash
# Generate for next 5 years
npm run generate:chandrashtam 2025
npm run generate:chandrashtam 2026
npm run generate:chandrashtam 2027
npm run generate:chandrashtam 2028
npm run generate:chandrashtam 2029
```

### Update Component for Different Year

In `App.jsx`:

```jsx
// Change year prop
<ChandrashtamAnnualView year={2026} />
```

## File Structure

```
src/
├── lib/
│   ├── chandrashtam-calendar.js    # Calculation utilities
│   └── vedic-constants.js          # Rashi mappings
├── data/
│   ├── chandrashtam-2025.json      # Pre-calculated 2025 data
│   └── chandrashtam-2026.json      # Pre-calculated 2026 data (if generated)
├── components/
│   ├── ChandrashtamCalculator.jsx  # Live calculator
│   └── ChandrashtamAnnualView.jsx  # Annual calendar view
└── scripts/
    └── generate-chandrashtam-data.js # Generation script
```

## API Reference

### `calculateChandrashtamForRashi(rashi, year)`

Calculate all periods for a specific Rashi.

**Parameters:**
- `rashi` (string): Rashi name (e.g., 'Mesh', 'Vrishab')
- `year` (number): Year to calculate

**Returns:** Array of period objects:
```js
[
  {
    start: Date,      // Period start time
    end: Date,        // Period end time
    duration: 54.2,   // Duration in hours
    incomplete: false // True if extends beyond year boundary
  }
]
```

### `calculateAllChandrashtamForYear(year)`

Calculate for all 12 Rashis at once.

**Returns:** Object with Rashi names as keys:
```js
{
  "Mesh": [...periods],
  "Vrishab": [...periods],
  ...
}
```

### `getCurrentChandrashtamStatus(rashi, periods, now?)`

Get current status for a Rashi.

**Returns:**
```js
{
  isActive: true/false,
  currentPeriod: {...},  // Current period if active
  nextPeriod: {...},     // Next upcoming period
  timeLeft: 3600000,     // Milliseconds remaining (if active)
  timeUntilNext: 86400000 // Milliseconds until next (if inactive)
}
```

## Statistics (2025 Data)

- **Mesh**: 13 periods (~28 days total)
- **Vrishab**: 14 periods (~30 days total)
- **Mithun**: 14 periods (~30 days total)
- **Kark**: 14 periods (~30 days total)
- **Simha**: 14 periods (~30 days total)
- **Kanya**: 14 periods (~30 days total)
- **Tula**: 14 periods (~30 days total)
- **Vrischik**: 13 periods (~28 days total)
- **Dhanu**: 13 periods (~28 days total)
- **Makar**: 13 periods (~28 days total)
- **Kumbha**: 13 periods (~28 days total)
- **Meen**: 13 periods (~28 days total)

**Average**: ~13-14 periods per Rashi per year, totaling ~29 days (8% of year)

## Performance Optimizations

### Caching Strategy

1. **Runtime Cache**: Live calculations cached for 1 minute
2. **Pre-calculated Data**: Loaded once at component mount
3. **Binary Search**: Reduces calculation time from O(n) to O(log n)

### Memory Usage

- Pre-calculated data: ~50KB per year in memory
- Runtime cache: ~1KB (clears old entries automatically)
- Total: Minimal impact on app performance

## Future Enhancements

Potential additions:
- [ ] Export calendar to iCal/Google Calendar
- [ ] Notifications for upcoming Chandrashtam
- [ ] Multi-year view with trends
- [ ] Custom date range selection
- [ ] Remedies and suggestions during Chandrashtam
- [ ] Integration with personal birth chart

## Support

For issues or questions about the Chandrashtam calendar feature, please refer to the main repository documentation.
