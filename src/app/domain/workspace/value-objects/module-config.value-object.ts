/**
 * ModuleConfig represents the configuration for a workspace module.
 * Immutable value object that encapsulates module-specific settings.
 */
export class ModuleConfig {
  private readonly data: { readonly [key: string]: unknown };

  private constructor(data: { readonly [key: string]: unknown }) {
    this.data = Object.freeze({ ...data });
  }

  static create(data?: { [key: string]: unknown }): ModuleConfig {
    return new ModuleConfig(data ?? {});
  }

  /**
   * Get a configuration value by key
   */
  get(key: string): unknown {
    return this.data[key];
  }

  /**
   * Check if a key exists in the configuration
   */
  has(key: string): boolean {
    return key in this.data;
  }

  /**
   * Get all configuration keys
   */
  keys(): readonly string[] {
    return Object.keys(this.data);
  }

  /**
   * Get the raw configuration object (frozen copy)
   */
  toObject(): { readonly [key: string]: unknown } {
    return this.data;
  }

  /**
   * Create a new ModuleConfig with an updated value
   */
  set(key: string, value: unknown): ModuleConfig {
    return new ModuleConfig({
      ...this.data,
      [key]: value,
    });
  }

  /**
   * Check equality by deep comparison of configuration data
   */
  equals(other: ModuleConfig): boolean {
    const thisKeys = Object.keys(this.data);
    const otherKeys = Object.keys(other.data);

    if (thisKeys.length !== otherKeys.length) {
      return false;
    }

    return thisKeys.every(
      (key) => this.data[key] === other.data[key]
    );
  }
}
