/**
 * Vedic Astrology Constants
 * Centralized configuration for Vedic astrological data
 */

// 12 Rashis (Zodiac Signs) in order
export const RASHI_ORDER = [
  'Mesh', 'Vrishab', 'Mithun', 'Kark',
  'Simha', 'Kanya', 'Tula', 'Vrischik',
  'Dhanu', 'Makar', 'Kumbha', 'Meen'
];

// Chandrashtam Map: Key is the afflicted Rashi, Value is Moon's position when that Rashi is afflicted
export const CHANDRASHTAM_MAP = {
  'Mesh': 'Vrischik',
  'Vrishab': 'Dhanu',
  'Mithun': 'Makar',
  'Kark': 'Kumbha',
  'Simha': 'Meen',
  'Kanya': 'Mesh',
  'Tula': 'Vrishab',
  'Vrischik': 'Mithun',
  'Dhanu': 'Kark',
  'Makar': 'Simha',
  'Kumbha': 'Kanya',
  'Meen': 'Tula'
};

// 27 Nakshatras (Lunar Mansions)
export const NAKSHATRA_DATA = [
  { name: 'Ashwini', deity: 'Ashwini Kumaras', symbol: 'Horse Head', ruler: 'Ketu' },
  { name: 'Bharani', deity: 'Yama', symbol: 'Yoni', ruler: 'Venus' },
  { name: 'Krittika', deity: 'Agni', symbol: 'Razor', ruler: 'Sun' },
  { name: 'Rohini', deity: 'Brahma', symbol: 'Chariot', ruler: 'Moon' },
  { name: 'Mrigashira', deity: 'Soma', symbol: 'Deer Head', ruler: 'Mars' },
  { name: 'Ardra', deity: 'Rudra', symbol: 'Teardrop', ruler: 'Rahu' },
  { name: 'Punarvasu', deity: 'Aditi', symbol: 'Bow', ruler: 'Jupiter' },
  { name: 'Pushya', deity: 'Brihaspati', symbol: 'Circle', ruler: 'Saturn' },
  { name: 'Ashlesha', deity: 'Serpents', symbol: 'Serpent', ruler: 'Mercury' },
  { name: 'Magha', deity: 'Pitris', symbol: 'Throne', ruler: 'Ketu' },
  { name: 'Purva Phalguni', deity: 'Bhaga', symbol: 'Hammock', ruler: 'Venus' },
  { name: 'Uttara Phalguni', deity: 'Aryaman', symbol: 'Fig Tree', ruler: 'Sun' },
  { name: 'Hasta', deity: 'Savitr', symbol: 'Palm', ruler: 'Moon' },
  { name: 'Chitra', deity: 'Vishwakarma', symbol: 'Pearl', ruler: 'Mars' },
  { name: 'Swati', deity: 'Vayu', symbol: 'Coral', ruler: 'Rahu' },
  { name: 'Vishakha', deity: 'Indra-Agni', symbol: 'Archway', ruler: 'Jupiter' },
  { name: 'Anuradha', deity: 'Mitra', symbol: 'Lotus', ruler: 'Saturn' },
  { name: 'Jyeshtha', deity: 'Indra', symbol: 'Earring', ruler: 'Mercury' },
  { name: 'Mula', deity: 'Nirrti', symbol: 'Lion Tail', ruler: 'Ketu' },
  { name: 'Purva Ashadha', deity: 'Apas', symbol: 'Fan', ruler: 'Venus' },
  { name: 'Uttara Ashadha', deity: 'Vishvedevas', symbol: 'Tusk', ruler: 'Sun' },
  { name: 'Shravana', deity: 'Vishnu', symbol: 'Three Footprints', ruler: 'Moon' },
  { name: 'Dhanishta', deity: 'Vasus', symbol: 'Drum', ruler: 'Mars' },
  { name: 'Shatabhisha', deity: 'Varuna', symbol: 'Empty Circle', ruler: 'Rahu' },
  { name: 'Purva Bhadrapada', deity: 'Ajaikapada', symbol: 'Sword', ruler: 'Jupiter' },
  { name: 'Uttara Bhadrapada', deity: 'Ahirbudhnya', symbol: 'Twin Legs', ruler: 'Saturn' },
  { name: 'Revati', deity: 'Pushan', symbol: 'Fish', ruler: 'Mercury' }
];

// Tithi (Lunar Day) Names
export const TITHI_NAMES = [
  'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
  'Shashti', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
  'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima/Amavasya'
];

// Default Location Configuration (Mumbai by default)
// This is used as a fallback when no location is selected
export const DEFAULT_LOCATION = {
  name: 'Mumbai',
  latitude: 19.0760,
  longitude: 72.8777,
  timezone: 'Asia/Kolkata'
};

// Current location - can be updated dynamically
let currentLocation = DEFAULT_LOCATION;

export const setCurrentLocation = (location) => {
  currentLocation = location;
};

export const getCurrentLocation = () => {
  return currentLocation;
};

// Helper function to get next Rashi
export const getNextRashi = (currentRashi) => {
  const currentIndex = RASHI_ORDER.indexOf(currentRashi);
  if (currentIndex === -1) return null;
  const nextIndex = (currentIndex + 1) % 12;
  return RASHI_ORDER[nextIndex];
};

// Helper function to get Nakshatra info from longitude
export const getNakshatraInfo = (longitude) => {
  const nakshatraNumber = Math.floor(longitude * 27 / 360);
  const nakshatraPada = Math.floor((longitude % (360/27)) / (360/108)) + 1;
  return {
    ...NAKSHATRA_DATA[nakshatraNumber],
    pada: nakshatraPada,
    degrees: (longitude % (360/27)).toFixed(2)
  };
};
