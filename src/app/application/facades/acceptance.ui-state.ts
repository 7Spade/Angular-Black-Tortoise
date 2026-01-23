/**
 * Acceptance UI State Interface
 * 
 * Defines the shape of UI state for the acceptance feature.
 * Used by the facade to expose state to presentation layer.
 * 
 * Architecture Compliance:
 * - Pure TypeScript interface (no framework dependencies)
 * - Read-only properties for immutability
 * - Simple DTOs for UI consumption
 * - No domain entities exposed directly
 */

export interface AcceptanceItemDTO {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly status: 'pending' | 'approved' | 'rejected';
  readonly createdAt: Date;
  readonly createdBy: string;
}

export interface AcceptanceUIState {
  readonly items: readonly AcceptanceItemDTO[];
  readonly selectedItemId: string | null;
  readonly loading: boolean;
  readonly error: string | null;
}

export interface AcceptanceStateSnapshot {
  readonly hasItems: boolean;
  readonly itemCount: number;
  readonly hasSelection: boolean;
}
