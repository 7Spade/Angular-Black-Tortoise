import { PartnerName } from './partner-name.value-object';

describe('PartnerName', () => {
  describe('create', () => {
    it('should create valid partner name', () => {
      const name = PartnerName.create('External Consulting Inc');
      expect(name.getValue()).toBe('External Consulting Inc');
    });

    it('should trim whitespace from partner name', () => {
      const name = PartnerName.create('  Vendor Corp  ');
      expect(name.getValue()).toBe('Vendor Corp');
    });

    it('should throw error for empty name', () => {
      expect(() => PartnerName.create('')).toThrow('Partner name cannot be empty');
    });

    it('should throw error for whitespace only', () => {
      expect(() => PartnerName.create('   ')).toThrow('Partner name cannot be empty');
    });

    it('should throw error for name too short', () => {
      expect(() => PartnerName.create('A')).toThrow('Partner name must be at least 2 characters');
    });

    it('should throw error for name too long', () => {
      const longName = 'A'.repeat(101);
      expect(() => PartnerName.create(longName)).toThrow('Partner name cannot exceed 100 characters');
    });

    it('should accept minimum length name', () => {
      const name = PartnerName.create('AB');
      expect(name.getValue()).toBe('AB');
    });

    it('should accept maximum length name', () => {
      const longName = 'A'.repeat(100);
      const name = PartnerName.create(longName);
      expect(name.getValue()).toBe(longName);
    });
  });

  describe('equals', () => {
    it('should return true for equal names', () => {
      const name1 = PartnerName.create('Vendor Corp');
      const name2 = PartnerName.create('Vendor Corp');
      expect(name1.equals(name2)).toBe(true);
    });

    it('should return false for different names', () => {
      const name1 = PartnerName.create('Vendor Corp');
      const name2 = PartnerName.create('Client Inc');
      expect(name1.equals(name2)).toBe(false);
    });
  });

  describe('toString', () => {
    it('should return the name as string', () => {
      const name = PartnerName.create('External Consulting Inc');
      expect(name.toString()).toBe('External Consulting Inc');
    });
  });
});
