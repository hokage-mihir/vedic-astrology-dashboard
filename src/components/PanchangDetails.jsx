import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
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

const formatGregorianDate = (date) => {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const PanchangDetails = () => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //  Rahu Kalam calculation
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

  const calculateTithiEndTime = (moonPos, sunPos) => {
    try {
      if (!moonPos || !sunPos) return null;
      
      const moonLong = moonPos.longitude;
      const sunLong = sunPos.longitude;
      let distance = moonLong - sunLong;
      if (distance < 0) distance += 360;
      
      const currentTithiStartDegree = Math.floor(distance / 12) * 12;
      const degreesToNextTithi = (currentTithiStartDegree + 12) - distance;
      
      // Use speed from positions
      const relativeSpeed = Math.abs(moonPos.speed - sunPos.speed);
      if (relativeSpeed === 0) return null; // Avoid division by zero
      
      const hoursToNextTithi = (degreesToNextTithi / relativeSpeed) * 24;
      
      const now = new Date();
      const endTime = new Date(now.getTime() + hoursToNextTithi * 60 * 60 * 1000);
      
      return {
        time: endTime,
        hours: hoursToNextTithi
      };
    } catch (err) {
      console.error('Error calculating tithi end time:', err);
      return null;
    }
  };
  
  const calculateTithi = (moonPos, sunPos) => {
    try {
      if (!moonPos || !sunPos) throw new Error('Invalid position data');
  
      const moonLong = moonPos.longitude;
      const sunLong = sunPos.longitude;
      
      let distance = moonLong - sunLong;
      if (distance < 0) distance += 360;
      
      const tithiNumber = Math.floor(distance / 12);
      const paksha = tithiNumber >= 15 ? 'Krishna' : 'Shukla';
      const tithiIndex = tithiNumber % 15;
      
      let tithiName = tithiNames[tithiIndex];
      if (tithiIndex === 14) {
        tithiName = paksha === 'Shukla' ? 'Purnima' : 'Amavasya';
      }
      
      // Calculate end time only if we have valid positions
      const endTimeInfo = calculateTithiEndTime(moonPos, sunPos);
      
      return {
        name: tithiName,
        number: tithiIndex + 1,
        paksha: paksha,
        degrees: distance % 12,
        endTime: endTimeInfo?.time,
        hoursToEnd: endTimeInfo?.hours
      };
    } catch (err) {
      console.error('Error calculating tithi:', err);
      throw new Error('Tithi calculation failed');
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

        const tithiDetails = calculateTithi(moonPos, sunPos);

        setDetails({
          gregorianDate: formatGregorianDate(now),
          moonPosition: {
            rashi: rashiOrder[moonPos.rashi_number],
            degrees: moonPos.degrees_in_rashi.toFixed(2)
          },
          sunPosition: {
            rashi: rashiOrder[sunPos.rashi_number],
            degrees: sunPos.degrees_in_rashi.toFixed(2)
          },
          tithi: tithiDetails,
          muhurtas: {
            brahma: "4:24 AM - 5:12 AM",
            abhijeet: "11:48 AM - 12:36 PM"
          },
          rahuKalam: calculateRahuKalam(now),
          timings: {
            sunrise: new Date(now.setHours(6, 30, 0)).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            }),
            sunset: new Date(now.setHours(18, 30, 0)).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })
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
        {!loading && !error && details && (
          <div className="text-lg text-gray-600 dark:text-gray-400">
            {details.gregorianDate}
          </div>
        )}
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
                {details.tithi.name} ({details.tithi.number}) - {details.tithi.paksha}
                {details.tithi.endTime && (
                  <div className="ml-4 text-sm text-gray-700 dark:text-gray-300">
                    Changes at: {details.tithi.endTime.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                    {details.tithi.hoursToEnd < 24 && (
                      <span className="ml-2">
                        (in {Math.floor(details.tithi.hoursToEnd)}h {Math.floor((details.tithi.hoursToEnd % 1) * 60)}m)
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div className="text-gray-900 dark:text-white">
                <span className="font-semibold">Timings (Mumbai) :</span>
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
                  Rahu Kalam (approximate):
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
}

export default PanchangDetails;