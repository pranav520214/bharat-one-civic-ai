import { describe, it, expect } from 'vitest';
import { calculateSchemeEligibility, getAqiColor, calculateDistance } from './civicHelpers';
import { GovScheme } from '../types';

describe('Civic Helpers Unit Tests', () => {
  describe('calculateSchemeEligibility', () => {
    const mockScheme: GovScheme = {
      id: 'scheme-1',
      name: 'Farmer Subsidy',
      department: 'Agriculture',
      description: 'Subsidy for small land farmers',
      benefits: ['₹5000 / month'],
      eligibility: {
        minAge: 18,
        maxAge: 60,
        incomeLimit: 150000,
        professions: ['Farmer', 'Agriculture Laborer'],
        gender: 'All',
      },
      documentsRequired: ['Aadhaar'],
      status: 'Available',
    };

    it('should confirm eligibility for matching criteria', () => {
      const criteria = {
        age: 30,
        income: 100000,
        gender: 'Male',
        profession: 'Farmer',
      };
      const result = calculateSchemeEligibility(mockScheme, criteria);
      expect(result.eligible).toBe(true);
      expect(result.reasons[0]).toContain('Matches');
    });

    it('should reject eligibility if age is below minimum', () => {
      const criteria = {
        age: 15,
        income: 100000,
        gender: 'Male',
        profession: 'Farmer',
      };
      const result = calculateSchemeEligibility(mockScheme, criteria);
      expect(result.eligible).toBe(false);
      expect(result.reasons).toContain('Minimum age required is 18 years');
    });

    it('should reject eligibility if age exceeds maximum', () => {
      const criteria = {
        age: 65,
        income: 100000,
        gender: 'Male',
        profession: 'Farmer',
      };
      const result = calculateSchemeEligibility(mockScheme, criteria);
      expect(result.eligible).toBe(false);
      expect(result.reasons).toContain('Maximum eligible age is 60 years');
    });

    it('should reject eligibility if income exceeds limit', () => {
      const criteria = {
        age: 35,
        income: 200000,
        gender: 'Male',
        profession: 'Farmer',
      };
      const result = calculateSchemeEligibility(mockScheme, criteria);
      expect(result.eligible).toBe(false);
      expect(result.reasons).toContain('Annual income exceeds limit of ₹150,000');
    });

    it('should reject eligibility if profession is mismatch', () => {
      const criteria = {
        age: 35,
        income: 100000,
        gender: 'Male',
        profession: 'Software Engineer',
      };
      const result = calculateSchemeEligibility(mockScheme, criteria);
      expect(result.eligible).toBe(false);
      expect(result.reasons[0]).toContain('Profession');
    });
  });

  describe('getAqiColor', () => {
    it('should return correct Tailwind classes based on status', () => {
      expect(getAqiColor('Good')).toBe('bg-emerald-500 text-white');
      expect(getAqiColor('Moderate')).toBe('bg-amber-500 text-white');
      expect(getAqiColor('Poor')).toBe('bg-orange-500 text-white');
      expect(getAqiColor('Severe')).toBe('bg-red-500 text-white');
      expect(getAqiColor('Unknown')).toBe('bg-gray-500 text-white');
    });
  });

  describe('calculateDistance', () => {
    it('should calculate distance correctly between coordinates', () => {
      // Distance between New Delhi (28.6139, 77.2090) and Connaught Place (28.6304, 77.2177) is roughly 2 km
      const distance = calculateDistance(28.6139, 77.2090, 28.6304, 77.2177);
      expect(distance).toBeGreaterThan(1500);
      expect(distance).toBeLessThan(2500);
    });

    it('should return 0 for identical coordinates', () => {
      const distance = calculateDistance(28.6139, 77.2090, 28.6139, 77.2090);
      expect(distance).toBe(0);
    });
  });
});
