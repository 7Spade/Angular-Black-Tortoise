import { TeamRole } from './team-role.value-object';

describe('TeamRole', () => {
  describe('createTeamLead', () => {
    it('should create team lead role', () => {
      const role = TeamRole.createTeamLead();
      expect(role.getValue()).toBe('team-lead');
      expect(role.isTeamLead()).toBe(true);
    });
  });

  describe('createMember', () => {
    it('should create member role', () => {
      const role = TeamRole.createMember();
      expect(role.getValue()).toBe('member');
      expect(role.isMember()).toBe(true);
    });
  });

  describe('fromString', () => {
    it('should create team lead from "team-lead"', () => {
      const role = TeamRole.fromString('team-lead');
      expect(role.isTeamLead()).toBe(true);
    });

    it('should create team lead from "teamlead"', () => {
      const role = TeamRole.fromString('teamlead');
      expect(role.isTeamLead()).toBe(true);
    });

    it('should create team lead from "lead"', () => {
      const role = TeamRole.fromString('lead');
      expect(role.isTeamLead()).toBe(true);
    });

    it('should create member from string', () => {
      const role = TeamRole.fromString('member');
      expect(role.isMember()).toBe(true);
    });

    it('should be case insensitive', () => {
      expect(TeamRole.fromString('TEAM-LEAD').isTeamLead()).toBe(true);
      expect(TeamRole.fromString('Member').isMember()).toBe(true);
    });

    it('should trim whitespace', () => {
      const role = TeamRole.fromString('  team-lead  ');
      expect(role.isTeamLead()).toBe(true);
    });

    it('should throw error for invalid role', () => {
      expect(() => TeamRole.fromString('invalid')).toThrow('Invalid team role');
    });
  });

  describe('permissions', () => {
    it('should allow team lead to manage team', () => {
      const role = TeamRole.createTeamLead();
      expect(role.canManageTeam()).toBe(true);
    });

    it('should not allow member to manage team', () => {
      const role = TeamRole.createMember();
      expect(role.canManageTeam()).toBe(false);
    });
  });

  describe('equals', () => {
    it('should return true for equal roles', () => {
      const role1 = TeamRole.createTeamLead();
      const role2 = TeamRole.createTeamLead();
      expect(role1.equals(role2)).toBe(true);
    });

    it('should return false for different roles', () => {
      const role1 = TeamRole.createTeamLead();
      const role2 = TeamRole.createMember();
      expect(role1.equals(role2)).toBe(false);
    });
  });

  describe('toString', () => {
    it('should return role as string', () => {
      expect(TeamRole.createTeamLead().toString()).toBe('team-lead');
      expect(TeamRole.createMember().toString()).toBe('member');
    });
  });
});
