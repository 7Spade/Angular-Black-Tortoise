import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [MatButtonModule, MatCardModule],
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
        <mat-card-actions align="end">
          <button mat-raised-button color="primary" type="button">
            Get Started
          </button>
        </mat-card-actions>
      </mat-card>
    </section>
  `,
  styles: [
    `
      .home-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: calc(100vh - 64px);
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
