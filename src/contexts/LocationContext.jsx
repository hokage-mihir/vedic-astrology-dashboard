import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import LOCATIONS, { DEFAULT_LOCATION } from '../data/locations';
import { RASHI_ORDER } from '../lib/vedic-constants';

const LocationContext = createContext();

export const useLocationContext = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocationContext must be used within a LocationProvider');
  }
  return context;
};

export const LocationProvider = ({ children }) => {
  // Initialize location from localStorage or default to first location
  const [currentLocation, setCurrentLocation] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('selectedLocation'));
      // Re-resolve against the current list so stale or malformed entries can't leak in
      return LOCATIONS.find((loc) => loc.name === saved?.name) || DEFAULT_LOCATION;
    } catch (e) {
      console.error('Error parsing saved location:', e);
      return DEFAULT_LOCATION;
    }
  });

  // Initialize Rashi from localStorage or default to first Rashi
  const [selectedRashi, setSelectedRashi] = useState(() => {
    try {
      const saved = localStorage.getItem('selectedRashi');
      // Fallback for legacy key 'userMoonRashi' if 'selectedRashi' is missing
      const legacySaved = localStorage.getItem('userMoonRashi');
      return [saved, legacySaved].find((rashi) => RASHI_ORDER.includes(rashi)) || RASHI_ORDER[0];
    } catch (e) {
      console.error('Error parsing saved rashi:', e);
      return RASHI_ORDER[0];
    }
  });

  // Persist location changes
  useEffect(() => {
    try {
      localStorage.setItem('selectedLocation', JSON.stringify(currentLocation));
    } catch {
      // Storage unavailable; selection stays in memory
    }
  }, [currentLocation]);

  // Persist Rashi changes
  useEffect(() => {
    try {
      localStorage.setItem('selectedRashi', selectedRashi);
      localStorage.removeItem('userMoonRashi');
    } catch {
      // Storage unavailable; selection stays in memory
    }
  }, [selectedRashi]);

  const updateLocation = (location) => {
    setCurrentLocation(location);
  };

  const updateRashi = (rashi) => {
    setSelectedRashi(rashi);
  };

  return (
    <LocationContext.Provider
      value={{
        currentLocation,
        selectedRashi,
        updateLocation,
        updateRashi
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

LocationProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
