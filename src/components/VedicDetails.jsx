// src/components/VedicDetails.jsx
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { calculateMoonPosition } from '../lib/astro-calculator';

const yogaNames = [
  'Vishkumbha', 'Priti', 'Ayushman', 'Saubhagya', 'Shobhana',
  'Atiganda', 'Sukarman', 'Dhriti', 'Shula', 'Ganda',
  'Vriddhi', 'Dhruva', 'Vyaghata', 'Harshana', 'Vajra',
  'Siddhi', 'Vyatipata', 'Variyan', 'Parigha', 'Shiva',
  'Siddha', 'Sadhya', 'Shubha', 'Shukla', 'Brahma',
  'Indra', 'Vaidhriti'
];

const calculateYoga = (sunLongitude, moonLongitude) => {
  // Combined longitude of Sun and Moon
  let combinedLongitude = (sunLongitude + moonLongitude) % 360;
  
  // Calculate yoga index (0-26)
  let yogaIndex = Math.floor(combinedLongitude * 27 / 360);
  
  // Get yoga name
  let yogaName = yogaNames[yogaIndex];
  
  // Calculate degrees within the yoga
  let degreesInYoga = (combinedLongitude % (360/27)).toFixed(2);
  
  return {
    name: yogaName,
    degrees: degreesInYoga,
    index: yogaIndex + 1
  };
};

// Simplified sun position calculation
const calculateSunPosition = () => {
  const now = new Date();
  
  // This is a simplified calculation - for more accuracy, you'd want to use
  // a more precise method or an ephemeris
  const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);
  const meanAnomaly = (357.5291 + 0.98560028 * dayOfYear) % 360;
  const center = 1.9148 * Math.sin(meanAnomaly * Math.PI / 180) +
                0.0200 * Math.sin(2 * meanAnomaly * Math.PI / 180) +
                0.0003 * Math.sin(3 * meanAnomaly * Math.PI / 180);
  const eclipticLongitude = (meanAnomaly + 102.9372 + center + 180) % 360;
  
  return eclipticLongitude;
};

const VedicDetails = () => {
  const [vedicInfo, setVedicInfo] = useState(null);

  useEffect(() => {
    const updateVedicInfo = () => {
      const moonPos = calculateMoonPosition();
      const sunLongitude = calculateSunPosition();
      
      // Calculate lunar day (tithi)
      const lunarDay = Math.floor(((moonPos.longitude - sunLongitude + 360) % 360) / 12) + 1;
      const paksha = Math.floor(((moonPos.longitude - sunLongitude + 360) % 360) / 180) === 0 ? 'Shukla' : 'Krishna';
      
      // Calculate karana (half of tithi)
      const karanaIndex = Math.floor(((moonPos.longitude - sunLongitude + 360) % 360) / 6) % 60;
      const karanaNames = ['Bava', 'Balava', 'Kaulava', 'Taitila', 'Gara', 'Vanija', 'Visti', 'Shakuni'];
      let karana;
      if (karanaIndex === 0) karana = 'Kimstughna';
      else if (karanaIndex === 59) karana = 'Naga';
      else if (karanaIndex === 58) karana = 'Chatushpada';
      else if (karanaIndex === 57) karana = 'Sakuna';
      else karana = karanaNames[karanaIndex % 8];

      // Calculate yoga
      const yogaInfo = calculateYoga(sunLongitude, moonPos.longitude);

      setVedicInfo({
        tithi: {
          day: lunarDay,
          paksha: paksha
        },
        karana: karana,
        yoga: yogaInfo,
        moon: {
          longitude: moonPos.longitude.toFixed(2),
          speed: moonPos.speed.toFixed(2)
        },
        sun: {
          longitude: sunLongitude.toFixed(2)
        }
      });
    };

    updateVedicInfo();
    const interval = setInterval(updateVedicInfo, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold">Vedic Details</CardTitle>
      </CardHeader>
      <CardContent>
        {vedicInfo && (
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold">Tithi:</h3>
              <p>{vedicInfo.tithi.day} {vedicInfo.tithi.paksha}</p>
            </div>
            <div>
              <h3 className="font-semibold">Karana:</h3>
              <p>{vedicInfo.karana}</p>
            </div>
            <div>
              <h3 className="font-semibold">Yoga:</h3>
              <p>{vedicInfo.yoga.name} ({vedicInfo.yoga.degrees}°)</p>
            </div>
            <div className="text-sm text-gray-600">
              <div>Moon: {vedicInfo.moon.longitude}° ({vedicInfo.moon.speed}°/day)</div>
              <div>Sun: {vedicInfo.sun.longitude}°</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VedicDetails;