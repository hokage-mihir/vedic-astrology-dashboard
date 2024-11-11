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
  const [lastUpdated, setLastUpdated] = useState(null);

  const calculatePositions = useCallback(() => {
    try {
      setLoading(true);
      
      const moonPos = calculateMoonPosition();
      const currentRashi = rashiOrder[moonPos.rashi_number];
      const chandrashtamIndex = (moonPos.rashi_number + 7) % 12;
      const chandrashtamRashi = rashiOrder[chandrashtamIndex];
      
      setMoonData({
        current_rashi: currentRashi,
        chandrashtam_rashi: chandrashtamRashi,
        longitude: moonPos.longitude,
        degrees_in_rashi: moonPos.degrees_in_rashi,
        speed: moonPos.speed,
        ayanamsa: moonPos.ayanamsa
      });
      
      setLastUpdated(new Date().toLocaleTimeString());
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
    <div className="p-4 max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">
            Chandrashtam Calculator (Sidereal)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading && (
            <div className="text-center p-4">Calculating...</div>
          )}
          
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {moonData && !loading && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-100 rounded-lg">
                <div>
                  <h3 className="font-semibold">Current Moon Position:</h3>
                  <p className="text-lg">{moonData.current_rashi}</p>
                  <p className="text-sm text-gray-600">
                    {moonData.degrees_in_rashi.toFixed(2)}°
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold">Chandrashtam Rashi:</h3>
                  <p className="text-lg text-red-600">{moonData.chandrashtam_rashi}</p>
                </div>
              </div>
              
              <div className="mt-4 space-y-2">
                <div className="text-sm text-gray-600">
                  Sidereal Longitude: {moonData.longitude.toFixed(2)}°
                </div>
                <div className="text-sm text-gray-600">
                  Ayanamsa: {moonData.ayanamsa.toFixed(4)}°
                </div>
                <div className="text-sm text-gray-600">
                  Moon Speed: {moonData.speed.toFixed(4)}°/day
                </div>
                <div className="text-sm text-gray-500">
                  Last updated: {lastUpdated}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ChandrashtamCalculator;