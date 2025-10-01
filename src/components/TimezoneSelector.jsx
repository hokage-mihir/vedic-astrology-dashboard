import { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import PropTypes from 'prop-types';

const LOCATIONS = [
  { name: 'Mumbai', latitude: 19.0760, longitude: 72.8777, timezone: 'Asia/Kolkata' },
  { name: 'Delhi', latitude: 28.6139, longitude: 77.2090, timezone: 'Asia/Kolkata' },
  { name: 'Bangalore', latitude: 12.9716, longitude: 77.5946, timezone: 'Asia/Kolkata' },
  { name: 'Chennai', latitude: 13.0827, longitude: 80.2707, timezone: 'Asia/Kolkata' },
  { name: 'Kolkata', latitude: 22.5726, longitude: 88.3639, timezone: 'Asia/Kolkata' },
  { name: 'Hyderabad', latitude: 17.3850, longitude: 78.4867, timezone: 'Asia/Kolkata' },
  { name: 'Pune', latitude: 18.5204, longitude: 73.8567, timezone: 'Asia/Kolkata' },
  { name: 'Ahmedabad', latitude: 23.0225, longitude: 72.5714, timezone: 'Asia/Kolkata' },
  { name: 'Jaipur', latitude: 26.9124, longitude: 75.7873, timezone: 'Asia/Kolkata' },
  { name: 'Varanasi', latitude: 25.3176, longitude: 82.9739, timezone: 'Asia/Kolkata' },
  { name: 'New York', latitude: 40.7128, longitude: -74.0060, timezone: 'America/New_York' },
  { name: 'London', latitude: 51.5074, longitude: -0.1278, timezone: 'Europe/London' },
  { name: 'Dubai', latitude: 25.2048, longitude: 55.2708, timezone: 'Asia/Dubai' },
  { name: 'Singapore', latitude: 1.3521, longitude: 103.8198, timezone: 'Asia/Singapore' },
  { name: 'Sydney', latitude: -33.8688, longitude: 151.2093, timezone: 'Australia/Sydney' },
];

const TimezoneSelector = ({ onLocationChange }) => {
  const [selectedLocation, setSelectedLocation] = useState(() => {
    const saved = localStorage.getItem('selectedLocation');
    return saved ? JSON.parse(saved) : LOCATIONS[0];
  });

  useEffect(() => {
    localStorage.setItem('selectedLocation', JSON.stringify(selectedLocation));
    onLocationChange(selectedLocation);
  }, [selectedLocation, onLocationChange]);

  const handleChange = (e) => {
    const location = LOCATIONS.find(loc => loc.name === e.target.value);
    setSelectedLocation(location);
  };

  return (
    <div className="flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-cosmic-purple-200 dark:border-cosmic-purple-800">
      <MapPin className="w-5 h-5 text-cosmic-purple-500" aria-label="Location icon" role="img" />
      <select
        value={selectedLocation.name}
        onChange={handleChange}
        className="bg-transparent border-none outline-none text-gray-900 dark:text-white font-medium cursor-pointer"
        aria-label="Select location"
      >
        {LOCATIONS.map((location) => (
          <option key={location.name} value={location.name}>
            {location.name}
          </option>
        ))}
      </select>
    </div>
  );
};

TimezoneSelector.propTypes = {
  onLocationChange: PropTypes.func.isRequired,
};

export { TimezoneSelector, LOCATIONS };
