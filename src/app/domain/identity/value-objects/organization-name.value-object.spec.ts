import { OrganizationName } from './organization-name.value-object';

describe('OrganizationName', () => {
  describe('create', () => {
    it('should create valid organization name', () => {
      const name = OrganizationName.create('Acme Corporation');
      expect(name.getValue()).toBe('Acme Corporation');
    });

    it('should trim whitespace from organization name', () => {
      const name = OrganizationName.create('  Acme Corp  ');
      expect(name.getValue()).toBe('Acme Corp');
    });

    it('should throw error for empty name', () => {
      expect(() => OrganizationName.create('')).toThrow('Organization name cannot be empty');
    });

    it('should throw error for whitespace only', () => {
      expect(() => OrganizationName.create('   ')).toThrow('Organization name cannot be empty');
    });

    it('should throw error for name too short', () => {
      expect(() => OrganizationName.create('A')).toThrow('Organization name must be at least 2 characters');
    });

    it('should throw error for name too long', () => {
      const longName = 'A'.repeat(101);
      expect(() => OrganizationName.create(longName)).toThrow('Organization name cannot exceed 100 characters');
    });

    it('should accept minimum length name', () => {
      const name = OrganizationName.create('AB');
      expect(name.getValue()).toBe('AB');
    });

    it('should accept maximum length name', () => {
      const longName = 'A'.repeat(100);
      const name = OrganizationName.create(longName);
      expect(name.getValue()).toBe(longName);
    });
  });

  describe('equals', () => {
    it('should return true for equal names', () => {
      const name1 = OrganizationName.create('Acme Corp');
      const name2 = OrganizationName.create('Acme Corp');
      expect(name1.equals(name2)).toBe(true);
    });

    it('should return false for different names', () => {
      const name1 = OrganizationName.create('Acme Corp');
      const name2 = OrganizationName.create('Beta Inc');
      expect(name1.equals(name2)).toBe(false);
    });
  });

  describe('toString', () => {
    it('should return the name as string', () => {
      const name = OrganizationName.create('Acme Corporation');
      expect(name.toString()).toBe('Acme Corporation');
    });
  });
});
