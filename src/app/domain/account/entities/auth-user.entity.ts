// AuthStatus models the lifecycle of authentication state in the application.
export type AuthStatus = 'initializing' | 'authenticated' | 'unauthenticated' | 'error';

// AuthUser represents the authenticated identity snapshot used by the app.
export interface AuthUser {
  // Unique identifier provided by the auth provider.
  readonly id: string;
  // Primary email address used for authentication.
  readonly email: string;
  // Display name used in the UI when available.
  readonly displayName: string;
  // Profile photo URL when available.
  readonly photoUrl: string;
  // Whether the email address has been verified.
  readonly emailVerified: boolean;
}

// AuthCredentials capture the minimum data needed for password auth.
export interface AuthCredentials {
  // User email used to authenticate.
  readonly email: string;
  // Raw password used to authenticate.
  readonly password: string;
}

// AuthProfileUpdate models display/profile updates for the current user.
export interface AuthProfileUpdate {
  // Updated display name for the authenticated user.
  readonly displayName?: string;
  // Updated profile photo URL for the authenticated user.
  readonly photoUrl?: string;
}
