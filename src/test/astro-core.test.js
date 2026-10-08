import { describe, it, expect } from 'vitest'
import {
  getAyanamsa,
  moonSiderealLongitude,
  sunSiderealLongitude,
  nextMoonIngress,
  previousMoonIngress,
  moonRashiSpan,
} from '../lib/astro-core.js'
import { calculateChandrashtamForRashi } from '../lib/chandrashtam-calendar.js'
import { getChandrashtamStatus, calculateProgress } from '../lib/chandrashtam-calculator.js'

// Reference values from Swiss Ephemeris (pyswisseph, SE_SIDM_LAHIRI, Moshier ephemeris)
const SWISS_POSITIONS = [
  { date: '2000-01-01T12:00:00Z', ayanamsa: 23.857092, moon: 199.47055, sun: 256.5157 },
  { date: '2026-01-01T00:00:00Z', ayanamsa: 24.220304, moon: 42.49395, sun: 256.34678 },
  { date: '2026-10-08T12:00:00Z', ayanamsa: 24.231033, moon: 144.51472, sun: 170.99336 },
  { date: '2030-12-31T18:00:00Z', ayanamsa: 24.290138, moon: 347.94356, sun: 255.80566 },
]

// Mesh is afflicted while the Moon is in Vrischik (210°–240°)
const SWISS_MESH_CHANDRASHTAM = [
  { start: '2026-01-13T11:51:23Z', end: '2026-01-16T00:17:55Z' },
  { start: '2026-02-09T19:41:20Z', end: '2026-02-12T08:12:29Z' },
  { start: '2030-06-13T18:17:33Z', end: '2030-06-15T17:59:55Z' },
]

const ARCSEC = 1 / 3600
const secondsBetween = (a, b) => Math.abs(new Date(a) - new Date(b)) / 1000

describe('Lahiri ayanamsa and sidereal positions', () => {
  it.each(SWISS_POSITIONS)('matches Swiss Ephemeris at $date', ({ date, ayanamsa, moon, sun }) => {
    const d = new Date(date)
    expect(Math.abs(getAyanamsa(d) - ayanamsa)).toBeLessThan(1 * ARCSEC)
    expect(Math.abs(moonSiderealLongitude(d) - moon)).toBeLessThan(15 * ARCSEC)
    expect(Math.abs(sunSiderealLongitude(d) - sun)).toBeLessThan(60 * ARCSEC)
  })
})

describe('Moon ingress solver', () => {
  it.each(SWISS_MESH_CHANDRASHTAM)('finds Vrischik ingress/egress for $start within 30s', ({ start, end }) => {
    const before = new Date(new Date(start).getTime() - 3 * 86400000)
    const entry = nextMoonIngress(7, before)
    const exit = nextMoonIngress(8, entry)
    expect(secondsBetween(entry, start)).toBeLessThan(30)
    expect(secondsBetween(exit, end)).toBeLessThan(30)
  })

  it('previousMoonIngress returns the last entry, not the next one', () => {
    const during = new Date('2026-01-14T12:00:00Z')
    const entry = previousMoonIngress(7, during)
    expect(entry.getTime()).toBeLessThanOrEqual(during.getTime())
    expect(secondsBetween(entry, SWISS_MESH_CHANDRASHTAM[0].start)).toBeLessThan(30)
  })

  it('moonRashiSpan reports an active span when the Moon is in the rashi', () => {
    const span = moonRashiSpan(7, new Date('2026-01-14T12:00:00Z'))
    expect(span.active).toBe(true)
    expect(secondsBetween(span.end, SWISS_MESH_CHANDRASHTAM[0].end)).toBeLessThan(30)
  })
})

describe('Chandrashtam calendar', () => {
  it('produces ~13 periods per year with exact boundaries', () => {
    const periods = calculateChandrashtamForRashi('Mesh', 2026)
    expect(periods.length).toBeGreaterThanOrEqual(13)
    expect(periods.length).toBeLessThanOrEqual(15)
    expect(secondsBetween(periods[0].start, SWISS_MESH_CHANDRASHTAM[0].start)).toBeLessThan(30)
    periods.forEach((p) => {
      expect(p.duration).toBeGreaterThan(45)
      expect(p.duration).toBeLessThan(65)
    })
  })

  it('keeps the true start of a period that spans New Year', () => {
    const all = Object.fromEntries(
      ['Mesh', 'Vrishab', 'Mithun', 'Kark', 'Simha', 'Kanya', 'Tula', 'Vrischik', 'Dhanu', 'Makar', 'Kumbha', 'Meen']
        .map((r) => [r, calculateChandrashtamForRashi(r, 2027)])
    )
    const yearStart = new Date('2027-01-01T00:00:00Z')
    const spanning = Object.values(all).flat().find((p) => p.start < yearStart && p.end > yearStart)
    expect(spanning).toBeDefined()
    expect(spanning.duration).toBeGreaterThan(45)
  })
})

describe('Chandrashtam status', () => {
  it('is active during the period and counts down to its exact end', () => {
    const now = new Date('2026-01-14T12:00:00Z')
    const status = getChandrashtamStatus('Mesh', now)
    expect(status.status).toBe('active')
    expect(secondsBetween(status.timeUntil.end, SWISS_MESH_CHANDRASHTAM[0].end)).toBeLessThan(30)
    const progress = calculateProgress(status.timeUntil, status.status, now)
    expect(progress).toBeGreaterThan(0)
    expect(progress).toBeLessThan(100)
  })

  it('is approaching within 3 days of the start', () => {
    const status = getChandrashtamStatus('Mesh', new Date('2026-01-12T00:00:00Z'))
    expect(status.status).toBe('approaching')
  })

  it('is clear otherwise, with progress through the cycle', () => {
    const now = new Date('2026-01-25T00:00:00Z')
    const status = getChandrashtamStatus('Mesh', now)
    expect(status.status).toBe('clear')
    expect(secondsBetween(status.timeUntil.start, SWISS_MESH_CHANDRASHTAM[1].start)).toBeLessThan(30)
    const progress = calculateProgress(status.timeUntil, status.status, now)
    expect(progress).toBeGreaterThan(0)
    expect(progress).toBeLessThan(100)
  })
})
