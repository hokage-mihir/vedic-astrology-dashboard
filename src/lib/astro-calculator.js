import { julian, moonposition } from 'astronomia'; // removed sexa since we're not using it

const normalize360 = (degrees) => {
    degrees = degrees % 360;
    return degrees < 0 ? degrees + 360 : degrees;
};

const calculateAyanamsa = (jd) => {
    const T = (jd - 2451545.0) / 36525;
    return 23.85 + 0.0137 * T;
};

export const calculateMoonPosition = () => {
    const now = new Date();
    const jd = julian.DateToJD(now);
    
    // Get Moon's position
    const moon = moonposition.position(jd);
    
    // Get longitude in tropical zodiac
    let longitude = moon.lon;
    
    // Convert to degrees
    longitude = normalize360(longitude * 180 / Math.PI);
    
    const ayanamsa = calculateAyanamsa(jd);
    const siderealLongitude = normalize360(longitude - ayanamsa);
    const rashiNumber = Math.floor(siderealLongitude / 30);
    const degreesInRashi = siderealLongitude % 30;

    // Calculate Moon's daily motion
    const nextDay = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const nextJd = julian.DateToJD(nextDay);
    const nextMoon = moonposition.position(nextJd);
    const nextLongitude = normalize360(nextMoon.lon * 180 / Math.PI);
    const dailyMotion = normalize360(nextLongitude - longitude);
    
    return {
        longitude: siderealLongitude,
        degrees_in_rashi: degreesInRashi,
        rashi_number: rashiNumber,
        ayanamsa: ayanamsa,
        speed: dailyMotion  // This should now give us the actual daily motion
    };
};

export const AYANAMSA = {
    LAHIRI: 'LAHIRI',
    RAMAN: 'RAMAN',
    KRISHNAMURTI: 'KRISHNAMURTI',
    YUKTESHWAR: 'YUKTESHWAR'
};