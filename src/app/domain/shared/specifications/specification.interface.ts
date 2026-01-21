/**
 * Specification pattern for reusable business rules.
 * Specifications encapsulate domain logic that can be reused across aggregates.
 * 
 * DDD Compliance:
 * - Specifications are pure domain logic
 * - They can be combined using logical operators
 * - They provide explicit reason for failure
 */
export interface Specification<T> {
  /**
   * Check if the candidate satisfies this specification.
   */
  isSatisfiedBy(candidate: T): boolean;

  /**
   * Get the reason why the specification is not satisfied.
   * Returns null if the specification is satisfied.
   */
  getReasonIfNotSatisfied(candidate: T): string | null;

  /**
   * Combine this specification with another using AND logic.
   */
  and(other: Specification<T>): Specification<T>;

  /**
   * Combine this specification with another using OR logic.
   */
  or(other: Specification<T>): Specification<T>;

  /**
   * Negate this specification.
   */
  not(): Specification<T>;
}

/**
 * Base class for implementing specifications.
 */
export abstract class BaseSpecification<T> implements Specification<T> {
  abstract isSatisfiedBy(candidate: T): boolean;
  abstract getReasonIfNotSatisfied(candidate: T): string | null;

  and(other: Specification<T>): Specification<T> {
    return new AndSpecification(this, other);
  }

  or(other: Specification<T>): Specification<T> {
    return new OrSpecification(this, other);
  }

  not(): Specification<T> {
    return new NotSpecification(this);
  }
}

class AndSpecification<T> extends BaseSpecification<T> {
  constructor(
    private left: Specification<T>,
    private right: Specification<T>
  ) {
    super();
  }

  isSatisfiedBy(candidate: T): boolean {
    return (
      this.left.isSatisfiedBy(candidate) && this.right.isSatisfiedBy(candidate)
    );
  }

  getReasonIfNotSatisfied(candidate: T): string | null {
    const leftReason = this.left.getReasonIfNotSatisfied(candidate);
    const rightReason = this.right.getReasonIfNotSatisfied(candidate);

    if (leftReason && rightReason) {
      return `${leftReason} AND ${rightReason}`;
    }
    return leftReason || rightReason;
  }
}

class OrSpecification<T> extends BaseSpecification<T> {
  constructor(
    private left: Specification<T>,
    private right: Specification<T>
  ) {
    super();
  }

  isSatisfiedBy(candidate: T): boolean {
    return (
      this.left.isSatisfiedBy(candidate) || this.right.isSatisfiedBy(candidate)
    );
  }

  getReasonIfNotSatisfied(candidate: T): string | null {
    if (this.isSatisfiedBy(candidate)) {
      return null;
    }
    const leftReason = this.left.getReasonIfNotSatisfied(candidate);
    const rightReason = this.right.getReasonIfNotSatisfied(candidate);
    return `${leftReason} OR ${rightReason}`;
  }
}

class NotSpecification<T> extends BaseSpecification<T> {
  constructor(private spec: Specification<T>) {
    super();
  }

  isSatisfiedBy(candidate: T): boolean {
    return !this.spec.isSatisfiedBy(candidate);
  }

  getReasonIfNotSatisfied(candidate: T): string | null {
    if (this.isSatisfiedBy(candidate)) {
      return null;
    }
    return `NOT (${this.spec.getReasonIfNotSatisfied(candidate) || 'satisfied'})`;
  }
}
