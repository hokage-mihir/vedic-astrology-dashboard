import { julian, moonposition } from 'astronomia';

const normalize360 = (degrees) => {
    degrees = degrees % 360;
    return degrees < 0 ? degrees + 360 : degrees;
};

// More accurate Lahiri ayanamsa calculation
const calculateAyanamsa = (jd) => {
    // T is centuries from J2000.0
    const T = (jd - 2451545.0) / 36525;
    // Lahiri ayanamsa
    return 23.85 + 0.0137 * T;
};

export const calculateMoonPosition = () => {
    try {
        const now = new Date();
        const jd = julian.DateToJD(now);
        
        // Get Moon's position
        const moon = moonposition.position(jd);
        
        // Convert to degrees
        let longitude = normalize360(moon.lon * 180 / Math.PI);
        
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
            speed: dailyMotion,
            raw_longitude: longitude
        };
    } catch (error) {
        console.error('Error calculating moon position:', error);
        return null;
    }
};

export const calculateSunPosition = () => {
    try {
        const now = new Date();
        const jd = julian.DateToJD(now);
        
        // More accurate solar calculation
        const T = (jd - 2451545.0) / 36525;
        
        // Mean solar longitude
        let L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
        
        // Mean anomaly of the Sun
        const M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
        
        // Equation of the center
        const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(M * Math.PI / 180)
                + (0.019993 - 0.000101 * T) * Math.sin(2 * M * Math.PI / 180)
                + 0.000289 * Math.sin(3 * M * Math.PI / 180);
        
        // Sun's true longitude
        let longitude = L0 + C;
        longitude = normalize360(longitude);
        
        const ayanamsa = calculateAyanamsa(jd);
        const siderealLongitude = normalize360(longitude - ayanamsa);
        
        return {
            longitude: siderealLongitude,
            rashi_number: Math.floor(siderealLongitude / 30),
            degrees_in_rashi: siderealLongitude % 30,
            speed: 0.9856474 // average daily motion
        };
    } catch (error) {
        console.error('Error calculating sun position:', error);
        return null;
    }
};

export const AYANAMSA = {
    LAHIRI: 'LAHIRI',
    RAMAN: 'RAMAN',
    KRISHNAMURTI: 'KRISHNAMURTI',
    YUKTESHWAR: 'YUKTESHWAR'
};

// Mumbai coordinates
export const LOCATION = {
    latitude: 19.0760,
    longitude: 72.8777,
    timezone: 5.5 // UTC+5:30
};

// Utility function to calculate hours remaining in rashi
export const calculateTimeInRashi = (degreesInRashi, moonSpeed) => {
    try {
        const degreesLeft = 30 - degreesInRashi;
        const hoursLeft = (degreesLeft / moonSpeed) * 24;
        
        const hours = Math.floor(hoursLeft);
        const minutes = Math.floor((hoursLeft - hours) * 60);
        
        if (hours < 24) {
            return `${hours}h ${minutes}m`;
        }
        
        const days = Math.floor(hours / 24);
        const remainingHours = hours % 24;
        const daysText = days === 1 ? 'day' : 'days';
        return `${days} ${daysText} ${remainingHours}h ${minutes}m`;
    } catch (error) {
        console.error('Error calculating time in rashi:', error);
        return 'Not available';
    }
};