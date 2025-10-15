import { describe, it, expect } from 'vitest'
import { 
  RASHI_ORDER, 
  CHANDRASHTAM_MAP, 
  getNakshatraInfo, 
  getNextRashi,
  NAKSHATRA_DATA 
} from '../lib/vedic-constants.js'

describe('Vedic Constants', () => {
  describe('RASHI_ORDER', () => {
    it('should contain all 12 Rashis', () => {
      expect(RASHI_ORDER).toHaveLength(12)
      expect(RASHI_ORDER).toContain('Mesh')
      expect(RASHI_ORDER).toContain('Vrishab')
      expect(RASHI_ORDER).toContain('Mithun')
      expect(RASHI_ORDER).toContain('Kark')
      expect(RASHI_ORDER).toContain('Simha')
      expect(RASHI_ORDER).toContain('Kanya')
      expect(RASHI_ORDER).toContain('Tula')
      expect(RASHI_ORDER).toContain('Vrischik')
      expect(RASHI_ORDER).toContain('Dhanu')
      expect(RASHI_ORDER).toContain('Makar')
      expect(RASHI_ORDER).toContain('Kumbha')
      expect(RASHI_ORDER).toContain('Meen')
    })

    it('should have unique Rashi names', () => {
      const uniqueRashis = [...new Set(RASHI_ORDER)]
      expect(uniqueRashis).toHaveLength(RASHI_ORDER.length)
    })
  })

  describe('CHANDRASHTAM_MAP', () => {
    it('should map each Rashi to its 8th position', () => {
      expect(CHANDRASHTAM_MAP).toHaveProperty('Mesh', 'Vrischik')
      expect(CHANDRASHTAM_MAP).toHaveProperty('Vrishab', 'Dhanu')
      expect(CHANDRASHTAM_MAP).toHaveProperty('Mithun', 'Makar')
      expect(CHANDRASHTAM_MAP).toHaveProperty('Kark', 'Kumbha')
      expect(CHANDRASHTAM_MAP).toHaveProperty('Simha', 'Meen')
      expect(CHANDRASHTAM_MAP).toHaveProperty('Kanya', 'Mesh')
      expect(CHANDRASHTAM_MAP).toHaveProperty('Tula', 'Vrishab')
      expect(CHANDRASHTAM_MAP).toHaveProperty('Vrischik', 'Mithun')
      expect(CHANDRASHTAM_MAP).toHaveProperty('Dhanu', 'Kark')
      expect(CHANDRASHTAM_MAP).toHaveProperty('Makar', 'Simha')
      expect(CHANDRASHTAM_MAP).toHaveProperty('Kumbha', 'Kanya')
      expect(CHANDRASHTAM_MAP).toHaveProperty('Meen', 'Tula')
    })

    it('should have all 12 mappings', () => {
      expect(Object.keys(CHANDRASHTAM_MAP)).toHaveLength(12)
    })
  })

  describe('getNextRashi', () => {
    it('should return the next Rashi in sequence', () => {
      expect(getNextRashi('Mesh')).toBe('Vrishab')
      expect(getNextRashi('Vrishab')).toBe('Mithun')
      expect(getNextRashi('Mithun')).toBe('Kark')
    })

    it('should wrap around from Meen to Mesh', () => {
      expect(getNextRashi('Meen')).toBe('Mesh')
    })

    it('should handle all Rashis', () => {
      RASHI_ORDER.forEach(rashi => {
        const next = getNextRashi(rashi)
        expect(next).toBeDefined()
        expect(RASHI_ORDER).toContain(next)
      })
    })
  })

  describe('getNakshatraInfo', () => {
    it('should return correct Nakshatra for given longitude', () => {
      // Ashwini (0-13.33 degrees)
      const ashwani = getNakshatraInfo(5)
      expect(ashwani.name).toBe('Ashwini')
      expect(ashwani.deity).toBe('Ashwini Kumaras')
      expect(ashwani.ruler).toBe('Ketu')
      expect(ashwani.pada).toBeGreaterThanOrEqual(1)
      expect(ashwani.pada).toBeLessThanOrEqual(4)

      // Bharani (13.33-26.67 degrees)
      const bharani = getNakshatraInfo(20)
      expect(bharani.name).toBe('Bharani')
      expect(bharani.deity).toBe('Yama')
      expect(bharani.ruler).toBe('Venus')

      // Krittika (26.67-40 degrees)
      const krittika = getNakshatraInfo(30)
      expect(krittika.name).toBe('Krittika')
      expect(krittika.deity).toBe('Agni')
      expect(krittika.ruler).toBe('Sun')
    })

    it('should calculate correct pada', () => {
      // Test each pada within a Nakshatra
      const test1 = getNakshatraInfo(2) // Ashwini Pada 1
      expect(test1.pada).toBe(1)

      const test2 = getNakshatraInfo(5.5) // Ashwini Pada 2
      expect(test2.pada).toBe(2)

      const test3 = getNakshatraInfo(9) // Ashwini Pada 3
      expect(test3.pada).toBe(3)

      const test4 = getNakshatraInfo(12) // Ashwini Pada 4
      expect(test4.pada).toBe(4)
    })

    it('should handle edge case at 360 degrees', () => {
      const result = getNakshatraInfo(359.9)
      expect(result.name).toBe('Revati')
      expect(result.deity).toBe('Pushan')
      expect(result.ruler).toBe('Mercury')
    })

    it('should handle longitude 0', () => {
      const result = getNakshatraInfo(0)
      expect(result.name).toBe('Ashwini')
      expect(result.deity).toBe('Ashwini Kumaras')
      expect(result.ruler).toBe('Ketu')
      expect(result.pada).toBe(1)
    })
  })

  describe('NAKSHATRA_DATA', () => {
    it('should contain all 27 Nakshatras', () => {
      expect(NAKSHATRA_DATA).toHaveLength(27)
    })

    it('should have required properties for each Nakshatra', () => {
      NAKSHATRA_DATA.forEach((nakshatra, index) => {
        expect(nakshatra).toHaveProperty('name')
        expect(nakshatra).toHaveProperty('ruler')
        expect(nakshatra).toHaveProperty('deity')
        expect(nakshatra).toHaveProperty('symbol')
        expect(index).toBeGreaterThanOrEqual(0)
        expect(index).toBeLessThan(27)
      })
    })

    it('should have unique Nakshatra names', () => {
      const names = NAKSHATRA_DATA.map(n => n.name)
      const uniqueNames = [...new Set(names)]
      expect(uniqueNames).toHaveLength(names.length)
    })
  })
})