import { describe, it, expect, beforeEach } from 'vitest'
import { calculateMoonPosition, calculateSunPosition } from '../lib/astro-calculator.js'

describe('Astronomical Calculations', () => {
  beforeEach(() => {
    // Clear cache before each test
    if (typeof global !== 'undefined' && global.calculationCache) {
      global.calculationCache.clear()
    }
  })

  describe('calculateMoonPosition', () => {
    it('should return valid moon position data', () => {
      const result = calculateMoonPosition()
      
      expect(result).toBeDefined()
      expect(result).toHaveProperty('longitude')
      expect(result).toHaveProperty('degrees_in_rashi')
      expect(result).toHaveProperty('rashi_number')
      expect(result).toHaveProperty('ayanamsa')
      expect(result).toHaveProperty('speed')
      
      // Check value ranges
      expect(result.longitude).toBeGreaterThanOrEqual(0)
      expect(result.longitude).toBeLessThan(360)
      expect(result.degrees_in_rashi).toBeGreaterThanOrEqual(0)
      expect(result.degrees_in_rashi).toBeLessThan(30)
      expect(result.rashi_number).toBeGreaterThanOrEqual(0)
      expect(result.rashi_number).toBeLessThan(12)
    })

    it('should return consistent results for same date', () => {
      const testDate = new Date('2025-01-01T12:00:00Z')
      const result1 = calculateMoonPosition(testDate)
      const result2 = calculateMoonPosition(testDate)
      
      expect(result1).toEqual(result2)
    })

    it('should handle different dates correctly', () => {
      const date1 = new Date('2025-01-01T12:00:00Z')
      const date2 = new Date('2025-01-02T12:00:00Z')
      
      const result1 = calculateMoonPosition(date1)
      const result2 = calculateMoonPosition(date2)
      
      // Moon should have moved
      expect(result1.longitude).not.toBe(result2.longitude)
    })
  })

  describe('calculateSunPosition', () => {
    it('should return valid sun position data', () => {
      const result = calculateSunPosition()
      
      expect(result).toBeDefined()
      expect(result).toHaveProperty('longitude')
      expect(result).toHaveProperty('degrees_in_rashi')
      expect(result).toHaveProperty('rashi_number')
      expect(result).toHaveProperty('speed')
      
      // Check value ranges
      expect(result.longitude).toBeGreaterThanOrEqual(0)
      expect(result.longitude).toBeLessThan(360)
      expect(result.degrees_in_rashi).toBeGreaterThanOrEqual(0)
      expect(result.degrees_in_rashi).toBeLessThan(30)
      expect(result.rashi_number).toBeGreaterThanOrEqual(0)
      expect(result.rashi_number).toBeLessThan(12)
    })

    it('should return consistent results for same date', () => {
      const testDate = new Date('2025-01-01T12:00:00Z')
      const result1 = calculateSunPosition(testDate)
      const result2 = calculateSunPosition(testDate)
      
      expect(result1).toEqual(result2)
    })

    it('should move slower than moon', () => {
      const testDate = new Date('2025-01-01T12:00:00Z')
      const moonPos = calculateMoonPosition(testDate)
      const sunPos = calculateSunPosition(testDate)
      
      // Sun moves ~1° per day, Moon moves ~13° per day
      expect(moonPos.speed).toBeGreaterThan(sunPos.speed)
    })
  })

  describe('Caching', () => {
    it('should cache calculations for performance', () => {
      const testDate = new Date('2025-01-01T12:00:00Z')
      
      // First call
      const start1 = performance.now()
      const result1 = calculateMoonPosition(testDate)
      const end1 = performance.now()
      
      // Second call (should be cached)
      const start2 = performance.now()
      const result2 = calculateMoonPosition(testDate)
      const end2 = performance.now()
      
      expect(result1).toEqual(result2)
      // Second call should be faster (though this might not always be true in tests)
      expect(end2 - start2).toBeLessThanOrEqual(end1 - start1 + 1) // Allow small variance
    })
  })
})