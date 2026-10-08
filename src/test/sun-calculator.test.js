import { describe, it, expect } from 'vitest'
import { getRahuKalamForDay, getZonedDay, formatTime } from '../lib/sun-calculator.js'

const MUMBAI = { name: 'Mumbai', latitude: 19.076, longitude: 72.8777, timezone: 'Asia/Kolkata' }
const LONDON = { name: 'London', latitude: 51.5074, longitude: -0.1278, timezone: 'Europe/London' }

describe('Rahu Kalam with location timezones', () => {
  // 22:30 UTC on Thu 8 Oct 2026 is already Fri 9 Oct (04:00) in India
  const now = new Date('2026-10-08T22:30:00Z')

  it('uses the civil date and weekday at the location, not the device', () => {
    expect(getZonedDay(now, MUMBAI.timezone)).toMatchObject({ year: 2026, month: 10, day: 9, dayOfWeek: 5 })
    expect(getZonedDay(now, LONDON.timezone)).toMatchObject({ year: 2026, month: 10, day: 8, dayOfWeek: 4 })
  })

  it('computes Friday Rahu Kalam (4th eighth of daytime) for Mumbai', () => {
    const rk = getRahuKalamForDay(MUMBAI, now)
    expect(rk.dayOfWeek).toBe(5)
    expect(formatTime(rk.start, MUMBAI.timezone)).toBe('10:58 AM')
    expect(formatTime(rk.end, MUMBAI.timezone)).toBe('12:27 PM')
  })

  it('computes Thursday Rahu Kalam (6th eighth of daytime) for London', () => {
    const rk = getRahuKalamForDay(LONDON, now)
    expect(rk.dayOfWeek).toBe(4)
    expect(formatTime(rk.start, LONDON.timezone)).toBe('2:13 PM')
    expect(formatTime(rk.end, LONDON.timezone)).toBe('3:37 PM')
  })

  it('advances to the next civil day with an offset', () => {
    const tomorrow = getRahuKalamForDay(MUMBAI, now, 1)
    expect(tomorrow.dayOfWeek).toBe(6)
    expect(tomorrow.start > getRahuKalamForDay(MUMBAI, now).end).toBe(true)
  })
})
