import { PartnerRole } from './partner-role.value-object';

describe('PartnerRole', () => {
  describe('createPartnerAdmin', () => {
    it('should create partner admin role', () => {
      const role = PartnerRole.createPartnerAdmin();
      expect(role.getValue()).toBe('partner-admin');
      expect(role.isPartnerAdmin()).toBe(true);
    });
  });

  describe('createCollaborator', () => {
    it('should create collaborator role', () => {
      const role = PartnerRole.createCollaborator();
      expect(role.getValue()).toBe('collaborator');
      expect(role.isCollaborator()).toBe(true);
    });
  });

  describe('fromString', () => {
    it('should create partner admin from "partner-admin"', () => {
      const role = PartnerRole.fromString('partner-admin');
      expect(role.isPartnerAdmin()).toBe(true);
    });

    it('should create partner admin from "partneradmin"', () => {
      const role = PartnerRole.fromString('partneradmin');
      expect(role.isPartnerAdmin()).toBe(true);
    });

    it('should create partner admin from "admin"', () => {
      const role = PartnerRole.fromString('admin');
      expect(role.isPartnerAdmin()).toBe(true);
    });

    it('should create collaborator from string', () => {
      const role = PartnerRole.fromString('collaborator');
      expect(role.isCollaborator()).toBe(true);
    });

    it('should be case insensitive', () => {
      expect(PartnerRole.fromString('PARTNER-ADMIN').isPartnerAdmin()).toBe(true);
      expect(PartnerRole.fromString('Collaborator').isCollaborator()).toBe(true);
    });

    it('should trim whitespace', () => {
      const role = PartnerRole.fromString('  partner-admin  ');
      expect(role.isPartnerAdmin()).toBe(true);
    });

    it('should throw error for invalid role', () => {
      expect(() => PartnerRole.fromString('invalid')).toThrow('Invalid partner role');
    });
  });

  describe('permissions', () => {
    it('should allow partner admin to manage partner', () => {
      const role = PartnerRole.createPartnerAdmin();
      expect(role.canManagePartner()).toBe(true);
    });

    it('should not allow collaborator to manage partner', () => {
      const role = PartnerRole.createCollaborator();
      expect(role.canManagePartner()).toBe(false);
    });
  });

  describe('equals', () => {
    it('should return true for equal roles', () => {
      const role1 = PartnerRole.createPartnerAdmin();
      const role2 = PartnerRole.createPartnerAdmin();
      expect(role1.equals(role2)).toBe(true);
    });

    it('should return false for different roles', () => {
      const role1 = PartnerRole.createPartnerAdmin();
      const role2 = PartnerRole.createCollaborator();
      expect(role1.equals(role2)).toBe(false);
    });
  });

  describe('toString', () => {
    it('should return role as string', () => {
      expect(PartnerRole.createPartnerAdmin().toString()).toBe('partner-admin');
      expect(PartnerRole.createCollaborator().toString()).toBe('collaborator');
    });
  });
});
