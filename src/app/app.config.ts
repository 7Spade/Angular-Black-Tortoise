import {
  ApplicationConfig,
  inject,
  provideEnvironmentInitializer,
  provideZonelessChangeDetection,
} from '@angular/core';
import {
  getAnalytics,
  provideAnalytics,
  ScreenTrackingService,
  UserTrackingService,
} from '@angular/fire/analytics';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import {
  initializeAppCheck,
  provideAppCheck,
  ReCaptchaEnterpriseProvider,
} from '@angular/fire/app-check';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getDataConnect, provideDataConnect } from '@angular/fire/data-connect';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getFunctions, provideFunctions } from '@angular/fire/functions';
import { getMessaging, provideMessaging } from '@angular/fire/messaging';
import { getPerformance, providePerformance } from '@angular/fire/performance';
import {
  getRemoteConfig,
  provideRemoteConfig,
} from '@angular/fire/remote-config';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { getVertexAI, provideVertexAI } from '@angular/fire/vertexai';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import {
  AUTH_REPOSITORY,
  IDENTITY_REPOSITORY,
  MEMBERSHIP_REPOSITORY,
  MODULE_REPOSITORY,
  WORKSPACE_REPOSITORY,
} from '@application/tokens/repository.tokens';
import { AuthAngularFireRepository } from '@infrastructure/repositories/auth-angularfire.repository';
import { IdentityFirestoreRepository } from '@infrastructure/repositories/identity-firestore.repository';
import { MembershipFirestoreRepository } from '@infrastructure/repositories/membership-firestore.repository';
import { ModuleFirestoreRepository } from '@infrastructure/repositories/module-firestore.repository';
import { WorkspaceFirestoreRepository } from '@infrastructure/repositories/workspace-firestore.repository';
import { APP_ROUTES } from '@presentation/app.routes';
import { AuthSessionNavigatorService } from '@presentation/shared/services/auth-session-navigator.service';
import { environment } from '../environments/environment';

/**
 * Application Configuration with Zone-less Change Detection
 *
 * This configuration enables Angular's zone-less mode (stable in Angular 20+), which provides:
 *
 * Benefits:
 * - Improved performance: No Zone.js overhead for change detection
 * - Smaller bundle size: Zone.js (~40KB) is not included
 * - Better debugging: Explicit change detection through signals
 * - Modern architecture: Fully reactive with @ngrx/signals
 *
 * Architecture Compliance:
 * - Zone-less mode requires all state updates to go through signals
 * - @ngrx/signals provides the reactive foundation
 * - @angular/fire observables are consumed and converted to signals
 *
 * How it works:
 * 1. provideZonelessChangeDetection() removes Zone.js dependency (stable API in Angular 20+)
 * 2. Change detection is triggered by:
 *    - Signal updates (via patchState in stores)
 *    - User interactions (click, input, etc.)
 *    - Manual markForCheck() when needed
 * 3. All Firebase operations update signals via rxMethod patterns
 * 4. The reactive chain: Firebase → Observable → Signal → UI
 *
 * Domain Architecture:
 * - Account (Identity via Firebase Auth)
 *   → Workspace (Logical boundary via AuthStore/ContextStore)
 *   → Module (Features via signal stores)
 *   → Entity (State via @ngrx/signals)
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(APP_ROUTES),
    provideAnimations(),
    provideEnvironmentInitializer(() => inject(AuthSessionNavigatorService)),

    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideAnalytics(() => getAnalytics()),
    ScreenTrackingService,
    UserTrackingService,

    ...(environment.production && environment.appCheckSiteKey
      ? [
          provideAppCheck(() => {
            const provider = new ReCaptchaEnterpriseProvider(
              environment.appCheckSiteKey,
            );
            return initializeAppCheck(undefined, {
              provider,
              isTokenAutoRefreshEnabled: true,
            });
          }),
        ]
      : []),
    provideDatabase(() => getDatabase()),
    provideDataConnect(() =>
      getDataConnect({
        connector: environment.dataConnect.connector,
        location: environment.dataConnect.location,
        service: environment.dataConnect.service,
      }),
    ),
    provideFunctions(() => getFunctions()),
    provideMessaging(() => getMessaging()),
    providePerformance(() => getPerformance()),
    provideStorage(() => getStorage()),
    provideRemoteConfig(() => getRemoteConfig()),
    provideVertexAI(() => getVertexAI()),
    { provide: AUTH_REPOSITORY, useClass: AuthAngularFireRepository },
    { provide: IDENTITY_REPOSITORY, useClass: IdentityFirestoreRepository },
    { provide: MEMBERSHIP_REPOSITORY, useClass: MembershipFirestoreRepository },
    { provide: MODULE_REPOSITORY, useClass: ModuleFirestoreRepository },
    { provide: WORKSPACE_REPOSITORY, useClass: WorkspaceFirestoreRepository },
  ],
};
