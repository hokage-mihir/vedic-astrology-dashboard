import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { calculateMoonPosition, calculateSunPosition } from '../lib/astro-calculator';

const rashiOrder = [
  'Mesh', 'Vrishab', 'Mithun', 'Kark', 
  'Simha', 'Kanya', 'Tula', 'Vrischik', 
  'Dhanu', 'Makar', 'Kumbha', 'Meen'
];

const tithiNames = [
  'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
  'Shashti', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
  'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima/Amavasya'
];

const PanchangDetails = () => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const calculateRahuKalam = (date) => {
    try {
      const rahuPeriods = {
        0: '4:30 PM - 6:00 PM',  // Sunday
        1: '7:30 AM - 9:00 AM',  // Monday
        2: '3:00 PM - 4:30 PM',  // Tuesday
        3: '12:00 PM - 1:30 PM', // Wednesday
        4: '1:30 PM - 3:00 PM',  // Thursday
        5: '10:30 AM - 12:00 PM',// Friday
        6: '9:00 AM - 10:30 AM'  // Saturday
      };
      return rahuPeriods[date.getDay()];
    } catch (err) {
      console.error('Error calculating Rahu Kalam:', err);
      return 'Not available';
    }
  };

  useEffect(() => {
    const updateDetails = () => {
      try {
        setLoading(true);
        const now = new Date();
        const moonPos = calculateMoonPosition();
        const sunPos = calculateSunPosition();
        
        if (!moonPos || !sunPos) {
          throw new Error('Failed to calculate positions');
        }

        // Calculate tithi
        const moonSunAngle = (moonPos.longitude - sunPos.longitude + 360) % 360;
        const tithiNumber = Math.floor(moonSunAngle / 12);
        const paksha = moonSunAngle >= 180 ? 'Krishna' : 'Shukla';

        // Get tithi name with special handling for Purnima/Amavasya
        let tithiName = tithiNames[tithiNumber];
        if (tithiNumber === 14) {
          tithiName = paksha === 'Shukla' ? 'Purnima' : 'Amavasya';
        }

        // Calculate sunrise/sunset times (simplified)
        const sunriseTime = new Date(now.setHours(6, 30, 0));
        const sunsetTime = new Date(now.setHours(18, 30, 0));

        setDetails({
          moonPosition: {
            rashi: rashiOrder[moonPos.rashi_number],
            degrees: moonPos.degrees_in_rashi.toFixed(2)
          },
          sunPosition: {
            rashi: rashiOrder[sunPos.rashi_number],
            degrees: sunPos.degrees_in_rashi.toFixed(2)
          },
          tithi: {
            name: tithiName,
            paksha: paksha
          },
          muhurtas: {
            brahma: "4:24 AM - 5:12 AM",
            abhijeet: "11:48 AM - 12:36 PM"
          },
          rahuKalam: calculateRahuKalam(now),
          timings: {
            sunrise: sunriseTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            sunset: sunsetTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        });
        setError(null);
      } catch (err) {
        console.error('Error updating details:', err);
        setError('Failed to calculate astronomical details');
      } finally {
        setLoading(false);
      }
    };

    updateDetails();
    const interval = setInterval(updateDetails, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="bg-white dark:bg-gray-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
          Daily Vedic Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="text-center p-4 text-gray-600 dark:text-gray-400">
            Calculating details...
          </div>
        )}
        
        {error && (
          <div className="text-center p-4 text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {!loading && !error && details && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
            {/* Left Column */}
            <div className="space-y-2">
              <div className="text-gray-900 dark:text-white">
                <span className="font-semibold">Moon:</span>{' '}
                {details.moonPosition.rashi} ({details.moonPosition.degrees}°)
              </div>
              <div className="text-gray-900 dark:text-white">
                <span className="font-semibold">Sun:</span>{' '}
                {details.sunPosition.rashi} ({details.sunPosition.degrees}°)
              </div>
              <div className="text-gray-900 dark:text-white">
                <span className="font-semibold">Tithi:</span>{' '}
                {details.tithi.name} ({details.tithi.paksha})
              </div>
              <div className="text-gray-900 dark:text-white">
                <span className="font-semibold">Timings:</span>
                <div className="ml-4 text-sm">
                  <div className="text-gray-700 dark:text-gray-300">
                    Sunrise: {details.timings.sunrise}
                  </div>
                  <div className="text-gray-700 dark:text-gray-300">
                    Sunset: {details.timings.sunset}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-2">
              <div>
                <span className="font-semibold text-red-600 dark:text-red-400">
                  Rahu Kalam:
                </span>
                <div className="text-red-600 dark:text-red-400 ml-4 text-sm">
                  {details.rahuKalam}
                </div>
              </div>
              <div className="text-gray-900 dark:text-white">
                <span className="font-semibold">Auspicious Muhurtas:</span>
                <div className="ml-4 text-sm">
                  <div className="text-gray-700 dark:text-gray-300">
                    Brahma: {details.muhurtas.brahma}
                  </div>
                  <div className="text-gray-700 dark:text-gray-300">
                    Abhijeet: {details.muhurtas.abhijeet}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PanchangDetails;