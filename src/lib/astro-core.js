/**
 * Core sidereal astronomy shared by the live UI and the calendar generator.
 *
 * Positions come from astronomia (Meeus): the Moon from ch. 47 (~10" accuracy)
 * and the Sun from ch. 25 (~0.01°). Both are referred to the mean equinox of
 * date without nutation, so subtracting the *mean* Lahiri ayanamsa gives the
 * same sidereal longitude as apparent position minus true ayanamsa.
 */
import { moonposition, solar, deltat, base } from 'astronomia';

const DAY_MS = 86400000;
const UNIX_EPOCH_JD = 2440587.5;
const R2D = 180 / Math.PI;

export const RASHI_SPAN = 30;
export const NAKSHATRA_SPAN = 360 / 27;

// Mean Moon motion in degrees/day; only used to seed the ingress solver.
const MEAN_MOON_SPEED = 13.176;

export const normalize360 = (degrees) => {
  const d = degrees % 360;
  return d < 0 ? d + 360 : d;
};

// Signed shortest difference a - b, in (-180, 180].
const angleDiff = (a, b) => {
  const d = normalize360(a - b);
  return d > 180 ? d - 360 : d;
};

const toDate = (value) => (value instanceof Date ? value : new Date(value));

/**
 * Julian Ephemeris Day (TT) for a JS Date (UTC), applying ΔT.
 */
export const dateToJDE = (date) => {
  const jd = toDate(date).getTime() / DAY_MS + UNIX_EPOCH_JD;
  const decimalYear = 2000 + (jd - base.J2000) / 365.25;
  return jd + deltat.deltaT(decimalYear) / 86400;
};

/**
 * Lahiri (Chitrapaksha) ayanamsa, in degrees, for a Julian Ephemeris Day.
 *
 * Uses the Indian Astronomical Ephemeris definition adopted by the Calendar
 * Reform Committee, in the form used by Swiss Ephemeris (SE_SIDM_LAHIRI): a mean
 * ayanamsa of 23.245524743° on 1956-03-21 0h TT (JD 2435553.5), carried forward
 * with the IAU 2006 general precession in longitude.
 */
const LAHIRI_EPOCH_JDE = 2435553.5;
const LAHIRI_AT_EPOCH = 23.250182778 - 0.004658035;

const generalPrecessionArcsec = (T) =>
  T * (5028.796195 + T * (1.1054348 + T * (0.00007964 + T * (-0.000023857 - T * 0.0000000383))));

export const lahiriAyanamsa = (jde) => {
  const T = base.J2000Century(jde);
  const T0 = base.J2000Century(LAHIRI_EPOCH_JDE);
  return LAHIRI_AT_EPOCH + (generalPrecessionArcsec(T) - generalPrecessionArcsec(T0)) / 3600;
};

/** Ayanamsa for a JS Date. */
export const getAyanamsa = (date = new Date()) => lahiriAyanamsa(dateToJDE(date));

/** Sidereal (Lahiri) longitude of the Moon in degrees. */
export const moonSiderealLongitude = (date = new Date()) => {
  const jde = dateToJDE(date);
  const tropical = moonposition.position(jde).lon * R2D;
  return normalize360(tropical - lahiriAyanamsa(jde));
};

/** Sidereal (Lahiri) longitude of the Sun in degrees, including aberration. */
export const sunSiderealLongitude = (date = new Date()) => {
  const jde = dateToJDE(date);
  const T = base.J2000Century(jde);
  const aberration = 20.4898 / 3600 / solar.radius(T);
  const tropical = solar.trueLongitude(T).lon * R2D - aberration;
  return normalize360(tropical - lahiriAyanamsa(jde));
};

/** Instantaneous Moon speed in degrees/day (central difference over ±1h). */
export const moonSpeed = (date = new Date()) => {
  const t = toDate(date).getTime();
  const h = DAY_MS / 24;
  return angleDiff(moonSiderealLongitude(t + h), moonSiderealLongitude(t - h)) / (2 * h / DAY_MS);
};

/** Instantaneous Sun speed in degrees/day. */
export const sunSpeed = (date = new Date()) => {
  const t = toDate(date).getTime();
  const h = DAY_MS / 2;
  return angleDiff(sunSiderealLongitude(t + h), sunSiderealLongitude(t - h)) / (2 * h / DAY_MS);
};

/**
 * Solve for the moment the Moon's sidereal longitude equals `targetDeg`,
 * starting from an initial guess. The Moon never retrogrades, so Newton's
 * method on longitude converges in a few steps to well under a second.
 */
const solveMoonLongitude = (targetDeg, guessMs) => {
  let t = guessMs;
  for (let i = 0; i < 12; i++) {
    const delta = angleDiff(targetDeg, moonSiderealLongitude(t));
    const step = (delta / moonSpeed(t)) * DAY_MS;
    t += step;
    if (Math.abs(step) < 500) break;
  }
  return new Date(Math.round(t / 1000) * 1000);
};

/**
 * Next time (strictly after `from`) the Moon's sidereal longitude reaches
 * `targetDeg`.
 */
export const nextMoonLongitudeCrossing = (targetDeg, from = new Date()) => {
  const fromMs = toDate(from).getTime();
  let ahead = normalize360(targetDeg - moonSiderealLongitude(fromMs));
  if (ahead === 0) ahead = 360;
  const result = solveMoonLongitude(targetDeg, fromMs + (ahead / MEAN_MOON_SPEED) * DAY_MS);
  // Guard against the solver landing on the previous crossing.
  return result.getTime() > fromMs
    ? result
    : solveMoonLongitude(targetDeg, result.getTime() + (360 / MEAN_MOON_SPEED) * DAY_MS);
};

/**
 * Last time (at or before `from`) the Moon's sidereal longitude reached
 * `targetDeg`.
 */
export const previousMoonLongitudeCrossing = (targetDeg, from = new Date()) => {
  const fromMs = toDate(from).getTime();
  const behind = normalize360(moonSiderealLongitude(fromMs) - targetDeg);
  const result = solveMoonLongitude(targetDeg, fromMs - (behind / MEAN_MOON_SPEED) * DAY_MS);
  return result.getTime() <= fromMs
    ? result
    : solveMoonLongitude(targetDeg, result.getTime() - (360 / MEAN_MOON_SPEED) * DAY_MS);
};

/** Next time the Moon enters rashi `rashiIndex` (0 = Mesh). */
export const nextMoonIngress = (rashiIndex, from = new Date()) =>
  nextMoonLongitudeCrossing(normalize360(rashiIndex * RASHI_SPAN), from);

/** Last time the Moon entered rashi `rashiIndex` (0 = Mesh). */
export const previousMoonIngress = (rashiIndex, from = new Date()) =>
  previousMoonLongitudeCrossing(normalize360(rashiIndex * RASHI_SPAN), from);

/**
 * The span during which the Moon occupies `rashiIndex` that contains `at`,
 * or the next one if the Moon is elsewhere.
 * @returns {{ start: Date, end: Date, active: boolean }}
 */
export const moonRashiSpan = (rashiIndex, at = new Date()) => {
  const atDate = toDate(at);
  const current = Math.floor(moonSiderealLongitude(atDate) / RASHI_SPAN);
  if (current === rashiIndex) {
    return {
      start: previousMoonIngress(rashiIndex, atDate),
      end: nextMoonIngress((rashiIndex + 1) % 12, atDate),
      active: true,
    };
  }
  const start = nextMoonIngress(rashiIndex, atDate);
  return {
    start,
    end: nextMoonIngress((rashiIndex + 1) % 12, start),
    active: false,
  };
};
