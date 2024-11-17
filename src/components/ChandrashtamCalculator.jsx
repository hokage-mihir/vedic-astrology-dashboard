import { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";
import { calculateMoonPosition, AYANAMSA } from '../lib/astro-calculator';

const rashiOrder = [
  'Mesh', 'Vrishab', 'Mithun', 'Kark', 
  'Simha', 'Kanya', 'Tula', 'Vrischik', 
  'Dhanu', 'Makar', 'Kumbha', 'Meen'
];

const ChandrashtamCalculator = () => {
  const [moonData, setMoonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const calculateTimeLeft = (degreesInRashi, moonSpeed) => {
    const degreesLeft = 30 - degreesInRashi; // Each Rashi is 30 degrees
    const timeLeftHours = (degreesLeft / moonSpeed) * 24; // Convert to hours
    
    const days = Math.floor(timeLeftHours / 24);
    const remainingHours = Math.floor(timeLeftHours % 24);
    const minutes = Math.floor((timeLeftHours - Math.floor(timeLeftHours)) * 60);
    
    // If less than 24 hours remaining, just show hours and minutes
    if (days === 0) {
      return `${remainingHours}h ${minutes}m`;
    }
    
    // Otherwise show days with hours and minutes in brackets
    const daysText = days === 1 ? 'day' : 'days';
    return `${days} ${daysText} (${remainingHours}h ${minutes}m)`;
  };

  const calculatePositions = useCallback(() => {
    try {
      setLoading(true);
      
      const moonPos = calculateMoonPosition();
      const currentRashi = rashiOrder[moonPos.rashi_number];
      const chandrashtamIndex = (moonPos.rashi_number + 7) % 12;
      const chandrashtamRashi = rashiOrder[chandrashtamIndex];
      
      const timeLeft = calculateTimeLeft(moonPos.degrees_in_rashi, moonPos.speed);
      
      setMoonData({
        current_rashi: currentRashi,
        chandrashtam_rashi: chandrashtamRashi,
        degrees_in_rashi: moonPos.degrees_in_rashi,
        time_left: timeLeft
      });
      
      setError(null);
    } catch (err) {
      setError(`Calculation error: ${err.message}`);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    calculatePositions();
    const interval = setInterval(calculatePositions, 60000);
    return () => {
      clearInterval(interval);
    };
  }, [calculatePositions]);

  return (
    <Card className="bg-white dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
          Chandrashtam Details(Sidereal)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="text-center p-4 text-gray-600 dark:text-gray-400">Calculating...</div>
        )}
        
        {moonData && !loading && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Current Moon Position:</h3>
                <p className="text-lg text-gray-900 dark:text-white">{moonData.current_rashi}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {moonData.degrees_in_rashi.toFixed(2)}°
                </p>
                <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                  Time left in Rashi: {moonData.time_left}
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Chandrashtam Rashi:</h3>
                <p className="text-lg text-red-600 dark:text-red-400">{moonData.chandrashtam_rashi}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ChandrashtamCalculator;