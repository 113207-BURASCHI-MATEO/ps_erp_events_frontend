import { Component, inject } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { SidebarStateService } from './services/sidebar-state.service';
import { AsyncPipe, CommonModule, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { LoginComponent } from './auth/components/login/login.component';
import { AuthService } from './services/auth.service';
import { MatMenuModule } from '@angular/material/menu';
import { URLTargetType, User } from './models/user.model';
import { NotificationService } from './services/notification.service';
import { Notification } from './models/notification.model';
import { AlertService } from './services/alert.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NotificationDialogComponent } from './landing/components/notification-dialog/notification-dialog.component';
import { MatDialog } from '@angular/material/dialog';

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
    MatMenuModule,
    MatCheckboxModule,
    DatePipe,
    NotificationDialogComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'erp-events';
  private authService = inject(AuthService);
  isAuthenticated$ = this.authService.isAuthenticated$;
  codes = URLTargetType;
  notifications: Notification[] = [];
  user: User | null = null;

  constructor(
    public sidebarService: SidebarStateService,
    private notificationService: NotificationService,
    private alertService: AlertService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe({
      next: (user: any) => {
        if (user) {
          this.user = user;
          this.notificationService.getNotifications(user.idUser).subscribe({
            next: (notifications: Notification[]) => {
              this.notifications = notifications;
            },
            error: (err) => {
              this.alertService.showErrorToast(
                `Error al cargar notificaciones: ${
                  err.error?.message || err.message
                }`
              );
              console.error('Error al cargar notificaciones:', err);
            },
          });
        }
      },
      error: (err) => {
        this.alertService.showErrorToast(
          `Error al obtener usuario: ${err.error?.message || err.message}`
        );
        console.error('Error al obtener usuario:', err);
      },
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
    this.authService.logout();
  }

  get isSidebarExpanded(): boolean {
    return this.sidebarService.isExpanded();
  }

  hasRole(requiredRoles: number[]): boolean {
    return this.authService.hasRoleCodes(requiredRoles);
  }

  markAsRead(notification: Notification): void {
    this.notificationService.markAsRead(notification.idNotification).subscribe({
      next: () => {
        notification.statusSend = 'VISUALIZED';
        this.notifications = this.notifications.filter(
          (n) => n.idNotification !== notification.idNotification
        );
        this.alertService.showSuccessToast('Notificación marcada como leída.');
      },
      error: (err: any) => {
        this.alertService.showErrorToast(
          `Error al marcar como leída: ${err.error.message}`
        );
        console.error(
          'Error al marcar notificación como leída:',
          err.error.message
        );
      },
    });
  }

  viewNotification(notification: Notification): void {
    this.dialog.open(NotificationDialogComponent, {
      data: notification,
      width: '600px',
      maxWidth: '95vw',
      maxHeight: '95vh',
    });
  }
}
