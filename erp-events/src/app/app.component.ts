import { Component, inject } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { SidebarStateService } from './services/sidebar-state.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { LoginComponent } from './auth/components/login/login.component';
import { AuthService } from './services/auth.service';
import { MatMenuModule } from '@angular/material/menu';
import { URLTargetType, User } from './models/user.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    RouterModule,
    RouterOutlet,
    LoginComponent,
    AsyncPipe,
    MatMenuModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'erp-events';
  private authService = inject(AuthService);
  isAuthenticated$ = this.authService.isAuthenticated$;
  user: User | null = null;
  codes = URLTargetType;

  constructor(public sidebarService: SidebarStateService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      this.user = user;
    });
  }

  toggleSidebar(): void {
    this.sidebarService.toggle();
  }

  expandSidebar(): void {
    this.sidebarService.expand();
  }

  collapseSidebar(): void {
    this.sidebarService.collapse();
  }

  logout(): void {
    this.authService.logout()
  }


  get isSidebarExpanded(): boolean {
    return this.sidebarService.isExpanded();
  }

  hasRole(requiredRoles: number[]): boolean {
    const code = this.user?.role?.roleCode;
    if (!code) return false;
    return requiredRoles.includes(code);
  }

}
