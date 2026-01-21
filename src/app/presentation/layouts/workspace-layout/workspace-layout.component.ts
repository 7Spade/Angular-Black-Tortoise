import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TopNavigationComponent } from '../../components/top-navigation/top-navigation.component';
import { WorkspaceStore } from '@application/stores/workspace.store';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-workspace-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    TopNavigationComponent,
  ],
  templateUrl: './workspace-layout.component.html',
  styleUrl: './workspace-layout.component.scss',
})
export class WorkspaceLayoutComponent {
  private readonly workspaceStore = inject(WorkspaceStore);

  // Expose workspace state
  protected readonly modules = this.workspaceStore.modules;
  protected readonly currentWorkspace = this.workspaceStore.currentWorkspace;

  // Sidebar state
  sidenavOpened = true;

  /**
   * Get menu items from loaded modules
   */
  getMenuItems(): MenuItem[] {
    const modules = this.modules();

    return modules.map((module) => ({
      label: this.formatModuleName(module.moduleKey),
      icon: this.getModuleIcon(module.moduleKey),
      route: `/workspace/${this.currentWorkspace()?.id.getValue()}/${module.moduleKey}`,
    }));
  }

  /**
   * Format module key to display name
   */
  private formatModuleName(moduleKey: string): string {
    return moduleKey
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Get icon for module based on key
   */
  private getModuleIcon(moduleKey: string): string {
    const iconMap: Record<string, string> = {
      dashboard: 'dashboard',
      tasks: 'task',
      documents: 'description',
      calendar: 'calendar_today',
      settings: 'settings',
      team: 'groups',
      reports: 'assessment',
      analytics: 'analytics',
    };

    return iconMap[moduleKey] || 'extension';
  }

  /**
   * Toggle sidebar open/closed
   */
  toggleSidenav(): void {
    this.sidenavOpened = !this.sidenavOpened;
  }
}
