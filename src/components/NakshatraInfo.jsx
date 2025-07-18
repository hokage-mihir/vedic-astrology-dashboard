import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { calculateMoonPosition } from '../lib/astro-calculator';

const nakshatraData = [
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

const getNakshatraInfo = (longitude) => {
  const nakshatraNumber = Math.floor(longitude * 27 / 360);
  const nakshatraPada = Math.floor((longitude % (360/27)) / (360/108)) + 1;
  return { 
    ...nakshatraData[nakshatraNumber],
    pada: nakshatraPada,
    degrees: (longitude % (360/27)).toFixed(2)
  };
};

const NakshatraInfo = () => {
  const [nakshatraInfo, setNakshatraInfo] = useState(null);

  useEffect(() => {
    const updateNakshatra = () => {
      const moonPos = calculateMoonPosition();
      setNakshatraInfo(getNakshatraInfo(moonPos.longitude));
    };

    updateNakshatra();
    const interval = setInterval(updateNakshatra, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="bg-white dark:bg-gray-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
          Nakshatra Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        {nakshatraInfo && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Current Nakshatra:</h3>
                <p className="text-lg text-gray-800 dark:text-gray-200">{nakshatraInfo.name}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Pada (Quarter):</h3>
                <p className="text-gray-800 dark:text-gray-200">{nakshatraInfo.pada}/4</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Ruling Deity:</h3>
                <p className="text-gray-800 dark:text-gray-200">{nakshatraInfo.deity}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Symbol:</h3>
                <p className="text-gray-800 dark:text-gray-200">{nakshatraInfo.symbol}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Planetary Ruler:</h3>
                <p className="text-gray-800 dark:text-gray-200">{nakshatraInfo.ruler}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Degrees in Nakshatra: {nakshatraInfo.degrees}°
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NakshatraInfo;