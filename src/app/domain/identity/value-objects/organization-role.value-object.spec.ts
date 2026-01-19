import { OrganizationRole } from './organization-role.value-object';

describe('OrganizationRole', () => {
  describe('createOwner', () => {
    it('should create owner role', () => {
      const role = OrganizationRole.createOwner();
      expect(role.getValue()).toBe('owner');
      expect(role.isOwner()).toBe(true);
    });
  });

  describe('createAdmin', () => {
    it('should create admin role', () => {
      const role = OrganizationRole.createAdmin();
      expect(role.getValue()).toBe('admin');
      expect(role.isAdmin()).toBe(true);
    });
  });

  describe('createMember', () => {
    it('should create member role', () => {
      const role = OrganizationRole.createMember();
      expect(role.getValue()).toBe('member');
      expect(role.isMember()).toBe(true);
    });
  });

  describe('fromString', () => {
    it('should create owner from string', () => {
      const role = OrganizationRole.fromString('owner');
      expect(role.isOwner()).toBe(true);
    });

    it('should create admin from string', () => {
      const role = OrganizationRole.fromString('admin');
      expect(role.isAdmin()).toBe(true);
    });

    it('should create member from string', () => {
      const role = OrganizationRole.fromString('member');
      expect(role.isMember()).toBe(true);
    });

    it('should be case insensitive', () => {
      expect(OrganizationRole.fromString('OWNER').isOwner()).toBe(true);
      expect(OrganizationRole.fromString('Admin').isAdmin()).toBe(true);
      expect(OrganizationRole.fromString('MEMBER').isMember()).toBe(true);
    });

    it('should trim whitespace', () => {
      const role = OrganizationRole.fromString('  owner  ');
      expect(role.isOwner()).toBe(true);
    });

    it('should throw error for invalid role', () => {
      expect(() => OrganizationRole.fromString('invalid')).toThrow('Invalid organization role');
    });
  });

  describe('permissions', () => {
    it('should allow owner to manage organization', () => {
      const role = OrganizationRole.createOwner();
      expect(role.canManageOrganization()).toBe(true);
      expect(role.canManageMembers()).toBe(true);
    });

    it('should allow admin to manage organization', () => {
      const role = OrganizationRole.createAdmin();
      expect(role.canManageOrganization()).toBe(true);
      expect(role.canManageMembers()).toBe(true);
    });

    it('should not allow member to manage organization', () => {
      const role = OrganizationRole.createMember();
      expect(role.canManageOrganization()).toBe(false);
      expect(role.canManageMembers()).toBe(false);
    });
  });

  describe('equals', () => {
    it('should return true for equal roles', () => {
      const role1 = OrganizationRole.createOwner();
      const role2 = OrganizationRole.createOwner();
      expect(role1.equals(role2)).toBe(true);
    });

    it('should return false for different roles', () => {
      const role1 = OrganizationRole.createOwner();
      const role2 = OrganizationRole.createAdmin();
      expect(role1.equals(role2)).toBe(false);
    });
  });

  describe('toString', () => {
    it('should return role as string', () => {
      expect(OrganizationRole.createOwner().toString()).toBe('owner');
      expect(OrganizationRole.createAdmin().toString()).toBe('admin');
      expect(OrganizationRole.createMember().toString()).toBe('member');
    });
  });
});
