import { PartnerAccessLevel } from './partner-access-level.value-object';

describe('PartnerAccessLevel', () => {
  describe('createLimited', () => {
    it('should create limited access level', () => {
      const level = PartnerAccessLevel.createLimited();
      expect(level.getValue()).toBe('limited');
      expect(level.isLimited()).toBe(true);
    });
  });

  describe('createStandard', () => {
    it('should create standard access level', () => {
      const level = PartnerAccessLevel.createStandard();
      expect(level.getValue()).toBe('standard');
      expect(level.isStandard()).toBe(true);
    });
  });

  describe('createFull', () => {
    it('should create full access level', () => {
      const level = PartnerAccessLevel.createFull();
      expect(level.getValue()).toBe('full');
      expect(level.isFull()).toBe(true);
    });
  });

  describe('fromString', () => {
    it('should create limited from string', () => {
      const level = PartnerAccessLevel.fromString('limited');
      expect(level.isLimited()).toBe(true);
    });

    it('should create standard from string', () => {
      const level = PartnerAccessLevel.fromString('standard');
      expect(level.isStandard()).toBe(true);
    });

    it('should create full from string', () => {
      const level = PartnerAccessLevel.fromString('full');
      expect(level.isFull()).toBe(true);
    });

    it('should be case insensitive', () => {
      expect(PartnerAccessLevel.fromString('LIMITED').isLimited()).toBe(true);
      expect(PartnerAccessLevel.fromString('Standard').isStandard()).toBe(true);
      expect(PartnerAccessLevel.fromString('FULL').isFull()).toBe(true);
    });

    it('should trim whitespace', () => {
      const level = PartnerAccessLevel.fromString('  limited  ');
      expect(level.isLimited()).toBe(true);
    });

    it('should throw error for invalid level', () => {
      expect(() => PartnerAccessLevel.fromString('invalid')).toThrow('Invalid partner access level');
    });
  });

  describe('permissions', () => {
    describe('limited access', () => {
      it('should have minimum permissions', () => {
        const level = PartnerAccessLevel.createLimited();
        expect(level.hasMinimumPermissions()).toBe(true);
        expect(level.canEditContent()).toBe(false);
        expect(level.hasNearMemberPermissions()).toBe(false);
      });
    });

    describe('standard access', () => {
      it('should allow content editing', () => {
        const level = PartnerAccessLevel.createStandard();
        expect(level.hasMinimumPermissions()).toBe(false);
        expect(level.canEditContent()).toBe(true);
        expect(level.hasNearMemberPermissions()).toBe(false);
      });
    });

    describe('full access', () => {
      it('should have near-member permissions', () => {
        const level = PartnerAccessLevel.createFull();
        expect(level.hasMinimumPermissions()).toBe(false);
        expect(level.canEditContent()).toBe(true);
        expect(level.hasNearMemberPermissions()).toBe(true);
      });
    });
  });

  describe('equals', () => {
    it('should return true for equal levels', () => {
      const level1 = PartnerAccessLevel.createLimited();
      const level2 = PartnerAccessLevel.createLimited();
      expect(level1.equals(level2)).toBe(true);
    });

    it('should return false for different levels', () => {
      const level1 = PartnerAccessLevel.createLimited();
      const level2 = PartnerAccessLevel.createStandard();
      expect(level1.equals(level2)).toBe(false);
    });
  });

  describe('toString', () => {
    it('should return level as string', () => {
      expect(PartnerAccessLevel.createLimited().toString()).toBe('limited');
      expect(PartnerAccessLevel.createStandard().toString()).toBe('standard');
      expect(PartnerAccessLevel.createFull().toString()).toBe('full');
    });
  });
});
