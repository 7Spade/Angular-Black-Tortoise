import { TeamName } from './team-name.value-object';

describe('TeamName', () => {
  describe('create', () => {
    it('should create valid team name', () => {
      const name = TeamName.create('Engineering Team');
      expect(name.getValue()).toBe('Engineering Team');
    });

    it('should trim whitespace from team name', () => {
      const name = TeamName.create('  Dev Team  ');
      expect(name.getValue()).toBe('Dev Team');
    });

    it('should throw error for empty name', () => {
      expect(() => TeamName.create('')).toThrow('Team name cannot be empty');
    });

    it('should throw error for whitespace only', () => {
      expect(() => TeamName.create('   ')).toThrow('Team name cannot be empty');
    });

    it('should throw error for name too short', () => {
      expect(() => TeamName.create('A')).toThrow('Team name must be at least 2 characters');
    });

    it('should throw error for name too long', () => {
      const longName = 'A'.repeat(101);
      expect(() => TeamName.create(longName)).toThrow('Team name cannot exceed 100 characters');
    });

    it('should accept minimum length name', () => {
      const name = TeamName.create('QA');
      expect(name.getValue()).toBe('QA');
    });

    it('should accept maximum length name', () => {
      const longName = 'A'.repeat(100);
      const name = TeamName.create(longName);
      expect(name.getValue()).toBe(longName);
    });
  });

  describe('equals', () => {
    it('should return true for equal names', () => {
      const name1 = TeamName.create('Dev Team');
      const name2 = TeamName.create('Dev Team');
      expect(name1.equals(name2)).toBe(true);
    });

    it('should return false for different names', () => {
      const name1 = TeamName.create('Dev Team');
      const name2 = TeamName.create('QA Team');
      expect(name1.equals(name2)).toBe(false);
    });
  });

  describe('toString', () => {
    it('should return the name as string', () => {
      const name = TeamName.create('Engineering Team');
      expect(name.toString()).toBe('Engineering Team');
    });
  });
});
