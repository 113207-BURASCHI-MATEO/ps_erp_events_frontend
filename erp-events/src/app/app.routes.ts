import { Routes } from '@angular/router';
import { authGuard } from './auth/guards/auth.guard';
import { roleGuard } from './auth/guards/role.guard';
import { URLTargetType } from './models/user.model';
import { switchMap } from 'rxjs';

export const routes: Routes = [

  {
    path: 'register',
    loadComponent: () => import('./auth/components/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'recover-password',
    loadComponent: () => import('./auth/components/recovery-password/recovery-password.component').then(m => m.RecoveryPasswordComponent)
  },
  {
    path: 'reset-password',
    loadComponent: () => import('./auth/components/reset-password/reset-password.component').then(m => m.ResetPasswordComponent)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./auth/components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'landing',
    loadComponent: () =>
      import('./landing/components/landing/landing.component').then(m => m.LandingComponent),
    canActivate: [authGuard],
    //canMatch: [roleGuard],
    //data: { allowedRoleCodes: Object.values(URLTargetType) }
  },
  {
    path: 'conditions',
    loadComponent: () =>
      import('./landing/components/conditions/conditions.component').then(m => m.ConditionsComponent),
    canActivate: [authGuard],
    //canMatch: [roleGuard],
    //data: { allowedRoleCodes: Object.values(URLTargetType) }
  },
  {
    path: 'faq',
    loadComponent: () =>
      import('./landing/components/faq/faq.component').then(m => m.FaqComponent),
    canActivate: [authGuard],
    //canMatch: [roleGuard],
    //data: { allowedRoleCodes: Object.values(URLTargetType) }
  },
  {
    path: 'employees',
    loadComponent: () =>
      import('./employee/components/employee-list/employee-list.component').then(m => m.EmployeeListComponent),
    canActivate: [authGuard],
    canMatch: [roleGuard],
    data: { allowedRoleCodes: [URLTargetType.SUPERADMIN , URLTargetType.ADMIN, URLTargetType.SUPERVISOR] }
  },
  {
    path: 'employees/create',
    loadComponent: () =>
      import('./employee/components/employee-form/employee-form.component').then(m => m.EmployeeFormComponent),
    canActivate: [authGuard],
    canMatch: [roleGuard],
    data: { allowedRoleCodes: [URLTargetType.SUPERADMIN , URLTargetType.ADMIN, URLTargetType.SUPERVISOR] }
  },
  {
    path: 'employees/edit/:id',
    loadComponent: () => import('./employee/components/employee-form/employee-form.component').then(m => m.EmployeeFormComponent),
    canActivate: [authGuard],
    canMatch: [roleGuard],
    data: { allowedRoleCodes: [URLTargetType.SUPERADMIN , URLTargetType.ADMIN, URLTargetType.SUPERVISOR] }
  },
  {
    path: 'suppliers',
    loadComponent: () =>
      import('./supplier/components/supplier-list/supplier-list.component').then(m => m.SupplierListComponent),
    canActivate: [authGuard],
    canMatch: [roleGuard],
    data: { allowedRoleCodes: [URLTargetType.SUPERADMIN , URLTargetType.ADMIN] }
  },
  {
    path: 'suppliers/create',
    loadComponent: () =>
      import('./supplier/components/supplier-form/supplier-form.component').then(m => m.SupplierFormComponent),
    canActivate: [authGuard],
    canMatch: [roleGuard],
    data: { allowedRoleCodes: [URLTargetType.SUPERADMIN , URLTargetType.ADMIN] }
  },
  {
    path: 'suppliers/edit/:id',
    loadComponent: () =>
      import('./supplier/components/supplier-form/supplier-form.component').then(m => m.SupplierFormComponent),
    canActivate: [authGuard],
    canMatch: [roleGuard],
    data: { allowedRoleCodes: [URLTargetType.SUPERADMIN , URLTargetType.ADMIN] }
  },
  {
    path: 'events',
    loadComponent: () =>
      import('./event/components/event-list/event-list.component').then(m => m.EventListComponent),
    canActivate: [authGuard],
    canMatch: [roleGuard],
    data: { allowedRoleCodes: [URLTargetType.SUPERADMIN , URLTargetType.ADMIN] }
  },
  {
    path: 'events/create',
    loadComponent: () =>
      import('./event/components/event-form/event-form.component').then(m => m.EventFormComponent),
    canActivate: [authGuard],
    canMatch: [roleGuard],
    data: { allowedRoleCodes: [URLTargetType.SUPERADMIN , URLTargetType.ADMIN] }
  },
  {
    path: 'events/edit/:id',
    loadComponent: () =>
      import('./event/components/event-form/event-form.component').then(m => m.EventFormComponent),
    canActivate: [authGuard],
    canMatch: [roleGuard],
    data: { allowedRoleCodes: [URLTargetType.SUPERADMIN , URLTargetType.ADMIN] }
  },
  {
    path: 'tasks',
    loadComponent: () =>
      import('./task/components/task-list/task-list.component').then(m => m.TaskListComponent),
    canActivate: [authGuard],
    canMatch: [roleGuard],
    data: { allowedRoleCodes: [URLTargetType.SUPERADMIN , URLTargetType.ADMIN, , URLTargetType.SUPERVISOR, URLTargetType.EMPLOYEE] }
  },
  {
    path: 'tasks/create',
    loadComponent: () =>
      import('./task/components/task-form/task-form.component').then(m => m.TaskFormComponent),
    canActivate: [authGuard],
    canMatch: [roleGuard],
    data: { allowedRoleCodes: [URLTargetType.SUPERADMIN , URLTargetType.ADMIN, URLTargetType.SUPERVISOR, URLTargetType.EMPLOYEE] }
  },
  {
    path: 'tasks/edit/:id',
    loadComponent: () =>
      import('./task/components/task-form/task-form.component').then(m => m.TaskFormComponent),
    canActivate: [authGuard],
    canMatch: [roleGuard],
    data: { allowedRoleCodes: [URLTargetType.SUPERADMIN , URLTargetType.ADMIN, URLTargetType.SUPERVISOR, URLTargetType.EMPLOYEE] }
  },
  {
    path: 'users',
    loadComponent: () =>
      import('./users/components/user-list/user-list.component').then(m => m.UserListComponent),
    canActivate: [authGuard],
    canMatch: [roleGuard],
    data: { allowedRoleCodes: [URLTargetType.SUPERADMIN , URLTargetType.ADMIN] }
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./users/components/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [authGuard],
    canMatch: [roleGuard],
    data: { allowedRoleCodes: [URLTargetType.SUPERADMIN , URLTargetType.ADMIN, URLTargetType.EMPLOYEE, URLTargetType.SUPERVISOR] }
  },
  {
    path: 'dashboards',
    loadComponent: () =>
      import('./dashboard/components/general/general.component').then(m => m.GeneralComponent),
    canActivate: [authGuard],
    canMatch: [roleGuard],
    data: { allowedRoleCodes: [URLTargetType.SUPERADMIN , URLTargetType.ADMIN] }
  },
  {
    path: 'dashboards',
    loadComponent: () =>
      import('./dashboard/components/general/general.component').then(m => m.GeneralComponent),
    canActivate: [authGuard],
    canMatch: [roleGuard],
    data: { allowedRoleCodes: [URLTargetType.SUPERADMIN , URLTargetType.ADMIN] }
  },
  {
    path: 'dashboards/events',
    loadComponent: () =>
      import('./dashboard/components/event-dashboard/event-dashboard.component').then(m => m.EventDashboardComponent),
    canActivate: [authGuard],
    canMatch: [roleGuard],
    data: { allowedRoleCodes: [URLTargetType.SUPERADMIN , URLTargetType.ADMIN] }
  },
  {
    path: 'dashboards/employees',
    loadComponent: () =>
      import('./dashboard/components/employee-dashboard/employee-dashboard.component').then(m => m.EmployeeDashboardComponent),
    canActivate: [authGuard],
    canMatch: [roleGuard],
    data: { allowedRoleCodes: [URLTargetType.SUPERADMIN , URLTargetType.ADMIN] }
  },
  {
    path: 'dashboards/tasks',
    loadComponent: () =>
      import('./dashboard/components/task-dashboard/task-dashboard.component').then(m => m.TaskDashboardComponent),
    canActivate: [authGuard],
    canMatch: [roleGuard],
    data: { allowedRoleCodes: [URLTargetType.SUPERADMIN , URLTargetType.ADMIN] }
  },
  {
    path: 'dashboards/suppliers',
    loadComponent: () =>
      import('./dashboard/components/supplier-dashboard/supplier-dashboard.component').then(m => m.SupplierDashboardComponent),
    canActivate: [authGuard],
    canMatch: [roleGuard],
    data: { allowedRoleCodes: [URLTargetType.SUPERADMIN , URLTargetType.ADMIN] }
  },
  {
    path: 'dashboards/users',
    loadComponent: () =>
      import('./dashboard/components/user-dashboard/user-dashboard.component').then(m => m.UserDashboardComponent),
    canActivate: [authGuard],
    canMatch: [roleGuard],
    data: { allowedRoleCodes: [URLTargetType.SUPERADMIN , URLTargetType.ADMIN] }
  },
  {
    path: 'dashboards/guests',
    loadComponent: () =>
      import('./dashboard/components/guest-dashboard/guest-dashboard.component').then(m => m.
        GuestDashboardComponent
      ),
    canActivate: [authGuard],
    canMatch: [roleGuard],
    data: { allowedRoleCodes: [URLTargetType.SUPERADMIN , URLTargetType.ADMIN] }
  },
  {
    path: 'guests',
    loadComponent: () =>
      import('./guest/components/guest-list/guest-list.component').then(m => m.GuestListComponent),
    canActivate: [authGuard],
    canMatch: [roleGuard],
    data: { allowedRoleCodes: [URLTargetType.SUPERADMIN , URLTargetType.ADMIN, URLTargetType.SUPERVISOR] }
  },
  {
    path: 'guests/create',
    loadComponent: () =>
      import('./guest/components/guest-form/guest-form.component').then(m => m.GuestFormComponent),
    canActivate: [authGuard],
    canMatch: [roleGuard],
    data: { allowedRoleCodes: [URLTargetType.SUPERADMIN , URLTargetType.ADMIN] }
  },
  {
    path: 'guests/create/file',
    loadComponent: () =>
      import('./guest/components/guest-file/guest-file.component').then(m => m.GuestFileComponent),
    canActivate: [authGuard],
    canMatch: [roleGuard],
    data: { allowedRoleCodes: [URLTargetType.SUPERADMIN , URLTargetType.ADMIN] }
  },
  {
    path: 'guests/edit/:idGuest/:idEvent',
    loadComponent: () =>
      import('./guest/components/guest-form/guest-form.component').then(m => m.GuestFormComponent),
    canActivate: [authGuard],
    canMatch: [roleGuard],
    data: { allowedRoleCodes: [URLTargetType.SUPERADMIN , URLTargetType.ADMIN] }
  },
  {
    path: 'check-in',
    loadComponent: () =>
      import('./guest/components/guest-check-in/guest-check-in.component').then(m => m.GuestCheckInComponent),
    canActivate: [authGuard],
    canMatch: [roleGuard],
    data: { allowedRoleCodes: [URLTargetType.SUPERADMIN , URLTargetType.ADMIN, URLTargetType.SUPERVISOR, URLTargetType.EMPLOYEE] }
  },
  {
    path: 'files',
    loadComponent: () =>
      import('./file/components/file-list/file-list.component').then(m => m.FileListComponent),
    canActivate: [authGuard],
    canMatch: [roleGuard],
    data: { allowedRoleCodes: [URLTargetType.SUPERADMIN , URLTargetType.ADMIN] }
  },
  {
    path: 'files/create',
    loadComponent: () =>
      import('./file/components/file-form/file-form.component').then(m => m.FileFormComponent),
    canActivate: [authGuard],
    canMatch: [roleGuard],
    data: { allowedRoleCodes: [URLTargetType.SUPERADMIN , URLTargetType.ADMIN] }
  },
  {
    path: 'files/edit/:id',
    loadComponent: () =>
      import('./file/components/file-form/file-form.component').then(m => m.FileFormComponent),
    canActivate: [authGuard],
    canMatch: [roleGuard],
    data: { allowedRoleCodes: [URLTargetType.SUPERADMIN , URLTargetType.ADMIN] }
  },
  {
    path: 'payments',
    loadComponent: () =>
      import('./payment/components/payment-list/payment-list.component').then(m => m.PaymentListComponent),
    canActivate: [authGuard],
    canMatch: [roleGuard],
    data: { allowedRoleCodes: [URLTargetType.SUPERADMIN , URLTargetType.ADMIN] }
  },
  {
    path: 'payments/create',
    loadComponent: () =>
      import('./payment/components/payment-form/payment-form.component').then(m => m.PaymentFormComponent),
    canActivate: [authGuard],
    canMatch: [roleGuard],
    data: { allowedRoleCodes: [URLTargetType.SUPERADMIN , URLTargetType.ADMIN] }
  },
  {
    path: 'schedules',
    loadComponent: () =>
      import('./schedule/components/schedule-list/schedule-list.component').then(m => m.ScheduleListComponent),
    canActivate: [authGuard],
    canMatch: [roleGuard],
    data: { allowedRoleCodes: [URLTargetType.SUPERADMIN , URLTargetType.ADMIN,  URLTargetType.SUPERVISOR, URLTargetType.EMPLOYEE] }
  },
  {
    path: 'schedules/create',
    loadComponent: () =>
      import('./schedule/components/schedule-form/schedule-form.component').then(m => m.ScheduleFormComponent),
    canActivate: [authGuard],
    canMatch: [roleGuard],
    data: { allowedRoleCodes: [URLTargetType.SUPERADMIN , URLTargetType.ADMIN,  URLTargetType.SUPERVISOR, URLTargetType.EMPLOYEE] }
  },
  {
    path: 'schedules/edit/:id',
    loadComponent: () =>
      import('./schedule/components/schedule-form/schedule-form.component').then(m => m.ScheduleFormComponent),
    canActivate: [authGuard],
    canMatch: [roleGuard],
    data: { allowedRoleCodes: [URLTargetType.SUPERADMIN , URLTargetType.ADMIN,  URLTargetType.SUPERVISOR, URLTargetType.EMPLOYEE] }
  },
  {
    path: 'schedules/timing/:scheduleId/:eventId',
    loadComponent: () =>
      import('./schedule/components/schedule-timing/schedule-timing.component').then(m => m.ScheduleTimingComponent),
    canActivate: [authGuard],
    canMatch: [roleGuard],
    data: { allowedRoleCodes: [URLTargetType.SUPERADMIN , URLTargetType.ADMIN,  URLTargetType.SUPERVISOR, URLTargetType.EMPLOYEE] }
  }
];


