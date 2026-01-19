import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [MatCardModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="home-container">
      <mat-card class="home-card">
        <mat-card-header>
          <mat-card-title>Angular Black Tortoise</mat-card-title>
          <mat-card-subtitle>Zone-less, NgRx Signals, AngularFire</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <p>
            The app is running. This starter ships with DDD-aligned domain
            models, reactive stores, and AngularFire-backed authentication.
          </p>
        </mat-card-content>
      </mat-card>
    </section>
  `,
  styles: [
    `
      :host {
        --app-header-height: 0px;
      }

      .home-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: calc(100vh - var(--app-header-height));
        padding: 24px;
        background: var(--mat-sys-surface);
      }

      .home-card {
        max-width: 640px;
        width: 100%;
      }

      mat-card-title {
        font: var(--mat-sys-headline-small);
      }

      mat-card-subtitle {
        font: var(--mat-sys-title-small);
      }
    `,
  ],
})
export class HomePageComponent {}
