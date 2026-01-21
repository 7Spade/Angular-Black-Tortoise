/**
 * Base interface for all use cases following Command pattern.
 * Use cases orchestrate domain logic and infrastructure to fulfill application requirements.
 * 
 * DDD Compliance:
 * - Use cases belong to Application layer
 * - They coordinate domain entities and call repositories
 * - They should not contain domain logic (that belongs in entities/aggregates)
 * - They can depend on domain and infrastructure interfaces
 */
export interface UseCase<TRequest, TResponse> {
  /**
   * Execute the use case with given input and return a promise of the result.
   * 
   * @param request - Input data for the use case
   * @returns Promise resolving to the use case result
   */
  execute(request: TRequest): Promise<TResponse>;
}

/**
 * Result wrapper for use case execution.
 * Provides explicit success/failure handling without throwing exceptions.
 */
export type UseCaseResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

/**
 * Helper to create a successful result.
 */
export const success = <T>(data: T): UseCaseResult<T> => ({
  success: true,
  data,
});

/**
 * Helper to create a failure result.
 */
export const failure = <T>(error: string): UseCaseResult<T> => ({
  success: false,
  error,
});
