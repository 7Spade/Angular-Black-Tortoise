import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-module-host',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './module-host.component.html',
  styleUrl: './module-host.component.scss',
})
export class ModuleHostComponent {
  private readonly route = inject(ActivatedRoute);

  moduleKey = '';
  workspaceId = '';

  ngOnInit(): void {
    // Get module key from route params
    this.route.params.subscribe((params) => {
      this.moduleKey = params['module'] || '';
      this.workspaceId = params['id'] || '';
    });
  }
}
