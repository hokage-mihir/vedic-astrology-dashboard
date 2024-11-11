// src/components/PanchangDetails.jsx
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { calculateMoonPosition } from '../lib/astro-calculator';

const PanchangDetails = () => {
  const [panchangInfo, setPanchangInfo] = useState(null);

  useEffect(() => {
    const updatePanchang = () => {
      const moonPos = calculateMoonPosition();
      const now = new Date();
      
      // Calculate sunrise/sunset times (simplified)
      const sunriseTime = new Date(now.setHours(6, 30, 0));
      const sunsetTime = new Date(now.setHours(18, 30, 0));
      
      // Calculate current muhurta (30 muhurtas in a day)
      const totalMinutesInDay = 24 * 60;
      const minutesSinceMidnight = now.getHours() * 60 + now.getMinutes();
      const currentMuhurta = Math.floor((minutesSinceMidnight / totalMinutesInDay) * 30) + 1;
      
      // Weekday
      const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const vara = weekdays[now.getDay()];

      setPanchangInfo({
        vara,
        muhurta: {
          current: currentMuhurta,
          name: getMuhurtaName(currentMuhurta)
        },
        sunrise: sunriseTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sunset: sunsetTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        rahu: calculateRahuKalam(now),
        gulika: calculateGulikaKalam(now),
        yamghanti: calculateYamghantiKalam(now)
      });
    };

    updatePanchang();
    const interval = setInterval(updatePanchang, 60000);
    return () => clearInterval(interval);
  }, []);

  const getMuhurtaName = (muhurtaNumber) => {
    const muhurtaNames = [
      'Rudra', 'Ahir', 'Mitra', 'Pitru', 'Vasu',
      'Vara', 'Vishvadeva', 'Vidhi', 'Sutamukhi', 'Puruhuta',
      'Vahini', 'Naktanakara', 'Varuna', 'Aryaman', 'Bhaga',
      'Girisha', 'Ajapada', 'Ahir Budhnya', 'Pushya', 'Ashvini',
      'Yama', 'Agni', 'Vidhi', 'Kanda', 'Aditi',
      'Jiva', 'Vishnu', 'Dyumani', 'Brahma', 'Samudram'
    ];
    return muhurtaNames[muhurtaNumber - 1] || 'Unknown';
  };

  const calculateRahuKalam = (date) => {
    // Simplified Rahu Kalam calculation
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
  };

  const calculateGulikaKalam = (date) => {
    // Simplified Gulika Kalam calculation
    const gulikaPeriods = {
      0: '3:00 PM - 4:30 PM',  // Sunday
      1: '6:00 AM - 7:30 AM',  // Monday
      2: '1:30 PM - 3:00 PM',  // Tuesday
      3: '10:30 AM - 12:00 PM',// Wednesday
      4: '12:00 PM - 1:30 PM', // Thursday
      5: '9:00 AM - 10:30 AM', // Friday
      6: '7:30 AM - 9:00 AM'   // Saturday
    };
    return gulikaPeriods[date.getDay()];
  };

  const calculateYamghantiKalam = (date) => {
    // Simplified Yamghanti Kalam calculation
    const yamghantiPeriods = {
      0: '12:00 PM - 1:30 PM', // Sunday
      1: '10:30 AM - 12:00 PM',// Monday
      2: '9:00 AM - 10:30 AM', // Tuesday
      3: '7:30 AM - 9:00 AM',  // Wednesday
      4: '6:00 AM - 7:30 AM',  // Thursday
      5: '3:00 PM - 4:30 PM',  // Friday
      6: '1:30 PM - 3:00 PM'   // Saturday
    };
    return yamghantiPeriods[date.getDay()];
  };

  return (
    <Card className="md:col-span-2 lg:col-span-3">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Panchang Details</CardTitle>
      </CardHeader>
      <CardContent>
        {panchangInfo && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h3 className="font-semibold">Day Information</h3>
              <div>Vara (Weekday): {panchangInfo.vara}</div>
              <div>Current Muhurta: {panchangInfo.muhurta.current} - {panchangInfo.muhurta.name}</div>
              <div>Sunrise: {panchangInfo.sunrise}</div>
              <div>Sunset: {panchangInfo.sunset}</div>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-semibold">Inauspicious Periods</h3>
              <div>Rahu Kalam: {panchangInfo.rahu}</div>
              <div>Gulika Kalam: {panchangInfo.gulika}</div>
              <div>Yamghanti: {panchangInfo.yamghanti}</div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold">Daily Muhurtas</h3>
              <div className="text-sm">
                Brahma Muhurta: 4:24 AM - 5:12 AM
              </div>
              <div className="text-sm">
                Abhijit Muhurta: 11:48 AM - 12:36 PM
              </div>
              <div className="text-sm">
                Amrit Kaal: Based on Tithi
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PanchangDetails;