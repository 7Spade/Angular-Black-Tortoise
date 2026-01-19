import { ModuleConfig } from './module-config.value-object';

describe('ModuleConfig', () => {
  describe('create', () => {
    it('should create with empty config when no data provided', () => {
      const config = ModuleConfig.create();
      expect(config).toBeDefined();
      expect(config.keys().length).toBe(0);
    });

    it('should create with provided data', () => {
      const data = { key1: 'value1', key2: 123 };
      const config = ModuleConfig.create(data);

      expect(config.get('key1')).toBe('value1');
      expect(config.get('key2')).toBe(123);
    });

    it('should freeze the configuration data', () => {
      const data = { key: 'value' };
      const config = ModuleConfig.create(data);
      const obj = config.toObject();

      expect(Object.isFrozen(obj)).toBe(true);
    });
  });

  describe('get', () => {
    it('should return value for existing key', () => {
      const config = ModuleConfig.create({ setting: 'enabled' });
      expect(config.get('setting')).toBe('enabled');
    });

    it('should return undefined for non-existent key', () => {
      const config = ModuleConfig.create();
      expect(config.get('nonexistent')).toBeUndefined();
    });
  });

  describe('has', () => {
    it('should return true for existing key', () => {
      const config = ModuleConfig.create({ key: 'value' });
      expect(config.has('key')).toBe(true);
    });

    it('should return false for non-existent key', () => {
      const config = ModuleConfig.create();
      expect(config.has('key')).toBe(false);
    });
  });

  describe('keys', () => {
    it('should return all configuration keys', () => {
      const config = ModuleConfig.create({ a: 1, b: 2, c: 3 });
      const keys = config.keys();

      expect(keys.length).toBe(3);
      expect(keys).toContain('a');
      expect(keys).toContain('b');
      expect(keys).toContain('c');
    });

    it('should return empty array for empty config', () => {
      const config = ModuleConfig.create();
      expect(config.keys().length).toBe(0);
    });
  });

  describe('set', () => {
    it('should create new ModuleConfig with updated value', () => {
      const original = ModuleConfig.create({ key1: 'value1' });
      const updated = original.set('key2', 'value2');

      expect(original.get('key2')).toBeUndefined();
      expect(updated.get('key1')).toBe('value1');
      expect(updated.get('key2')).toBe('value2');
    });

    it('should override existing value', () => {
      const original = ModuleConfig.create({ key: 'old' });
      const updated = original.set('key', 'new');

      expect(original.get('key')).toBe('old');
      expect(updated.get('key')).toBe('new');
    });
  });

  describe('toObject', () => {
    it('should return frozen copy of configuration', () => {
      const config = ModuleConfig.create({ a: 1, b: 2 });
      const obj = config.toObject();

      expect(obj.a).toBe(1);
      expect(obj.b).toBe(2);
      expect(Object.isFrozen(obj)).toBe(true);
    });
  });

  describe('equals', () => {
    it('should return true for configs with same data', () => {
      const config1 = ModuleConfig.create({ key: 'value' });
      const config2 = ModuleConfig.create({ key: 'value' });

      expect(config1.equals(config2)).toBe(true);
    });

    it('should return false for configs with different values', () => {
      const config1 = ModuleConfig.create({ key: 'value1' });
      const config2 = ModuleConfig.create({ key: 'value2' });

      expect(config1.equals(config2)).toBe(false);
    });

    it('should return false for configs with different keys', () => {
      const config1 = ModuleConfig.create({ key1: 'value' });
      const config2 = ModuleConfig.create({ key2: 'value' });

      expect(config1.equals(config2)).toBe(false);
    });

    it('should return true for two empty configs', () => {
      const config1 = ModuleConfig.create();
      const config2 = ModuleConfig.create();

      expect(config1.equals(config2)).toBe(true);
    });
  });

  describe('immutability', () => {
    it('should not allow modification of original data after creation', () => {
      const data = { key: 'value' };
      const config = ModuleConfig.create(data);

      data.key = 'modified';

      expect(config.get('key')).toBe('value');
    });

    it('should not modify original config when calling set', () => {
      const original = ModuleConfig.create({ key1: 'value1' });
      const keys1 = original.keys();

      original.set('key2', 'value2');
      const keys2 = original.keys();

      expect(keys1.length).toBe(1);
      expect(keys2.length).toBe(1);
    });
  });
});
