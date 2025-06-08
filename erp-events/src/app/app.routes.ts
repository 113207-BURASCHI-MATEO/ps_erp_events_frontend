import { Routes } from '@angular/router';
import { authGuard } from './components/auth/guards/auth.guard';
import { roleGuard } from './components/auth/guards/role.guard';
import { URLTargetType } from './models/user.model';
import { switchMap } from 'rxjs';

export const routes: Routes = [

  {
    path: 'register',
    loadComponent: () => import('./components/auth/components/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'recover-password',
    loadComponent: () => import('./components/auth/components/recovery-password/recovery-password.component').then(m => m.RecoveryPasswordComponent)
  },
  {
    path: 'reset-password',
    loadComponent: () => import('./components/auth/components/reset-password/reset-password.component').then(m => m.ResetPasswordComponent)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./components/auth/components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'landing',
    loadComponent: () =>
      import('./components/landing/components/landing/landing.component').then(m => m.LandingComponent),
    canActivate: [authGuard],
    //canMatch: [roleGuard],
    //data: { allowedRoleCodes: Object.values(URLTargetType) }
  },
  {
    path: 'conditions',
    loadComponent: () =>
      import('./components/landing/components/conditions/conditions.component').then(m => m.ConditionsComponent),
    canActivate: [authGuard],
    //canMatch: [roleGuard],
    //data: { allowedRoleCodes: Object.values(URLTargetType) }
  },
  {
    path: 'faq',
    loadComponent: () =>
      import('./components/landing/components/faq/faq.component').then(m => m.FaqComponent),
    canActivate: [authGuard],
    //canMatch: [roleGuard],
    //data: { allowedRoleCodes: Object.values(URLTargetType) }
  },
  {
    path: 'employees',
    loadComponent: () =>
      import('./components/employee/components/employee-list/employee-list.component').then(m => m.EmployeeListComponent),
    canActivate: [authGuard],
    canMatch: [roleGuard],
    data: { allowedRoleCodes: [URLTargetType.SUPERADMIN , URLTargetType.ADMIN, URLTargetType.SUPERVISOR] }
  },
  {
    path: 'employees/create',
    loadComponent: () =>
      import('./components/employee/components/employee-form/employee-form.component').then(m => m.EmployeeFormComponent),
    canActivate: [authGuard],
    canMatch: [roleGuard],
    data: { allowedRoleCodes: [URLTargetType.SUPERADMIN , URLTargetType.ADMIN, URLTargetType.SUPERVISOR] }
  },
  {
    path: 'employees/edit/:id',
    loadComponent: () => import('./components/employee/components/employee-form/employee-form.component').then(m => m.EmployeeFormComponent),
    canActivate: [authGuard],
    canMatch: [roleGuard],
    data: { allowedRoleCodes: [URLTargetType.SUPERADMIN , URLTargetType.ADMIN, URLTargetType.SUPERVISOR] }
  },
  {
    path: 'suppliers',
    loadComponent: () =>
      import('./components/supplier/components/supplier-list/supplier-list.component').then(m => m.SupplierListComponent),
    canActivate: [authGuard],
    canMatch: [roleGuard],
    data: { allowedRoleCodes: [URLTargetType.SUPERADMIN , URLTargetType.ADMIN] }
  },
  {
    path: 'suppliers/create',
    loadComponent: () =>
      import('./components/supplier/components/supplier-form/supplier-form.component').then(m => m.SupplierFormComponent),
    canActivate: [authGuard],
    canMatch: [roleGuard],
    data: { allowedRoleCodes: [URLTargetType.SUPERADMIN , URLTargetType.ADMIN] }
  },
  {
    path: 'suppliers/edit/:id',
    loadComponent: () =>
      import('./components/supplier/components/supplier-form/supplier-form.component').then(m => m.SupplierFormComponent),
    canActivate: [authGuard],
    canMatch: [roleGuard],
    data: { allowedRoleCodes: [URLTargetType.SUPERADMIN , URLTargetType.ADMIN] }
  },
  {
    path: 'events',
    loadComponent: () =>
      import('./components/event/components/event-list/event-list.component').then(m => m.EventListComponent),
    canActivate: [authGuard],
    canMatch: [roleGuard],
    data: { allowedRoleCodes: [URLTargetType.SUPERADMIN , URLTargetType.ADMIN] }
  },
  {
    path: 'events/create',
    loadComponent: () =>
      import('./components/event/components/event-form/event-form.component').then(m => m.EventFormComponent),
    canActivate: [authGuard],
    canMatch: [roleGuard],
    data: { allowedRoleCodes: [URLTargetType.SUPERADMIN , URLTargetType.ADMIN] }
  },
  {
    path: 'events/edit/:id',
    loadComponent: () =>
      import('./components/event/components/event-form/event-form.component').then(m => m.EventFormComponent),
    canActivate: [authGuard],
    canMatch: [roleGuard],
    data: { allowedRoleCodes: [URLTargetType.SUPERADMIN , URLTargetType.ADMIN] }
  },
  {
    path: 'events/account/:id',
    loadComponent: () =>
      import('./components/account/components/concept-list/concept-list.component').then(m => m.ConceptListComponent),
    canActivate: [authGuard],
    canMatch: [roleGuard],
    data: { allowedRoleCodes: [URLTargetType.SUPERADMIN , URLTargetType.ADMIN] }
  },
  {
    path: 'events/account/:id/concepts/create',
    loadComponent: () =>
      import('./components/account/components/concept-form/concept-form.component').then(m => m.ConceptFormComponent),
    canActivate: [authGuard],
    canMatch: [roleGuard],
    data: { allowedRoleCodes: [URLTargetType.SUPERADMIN , URLTargetType.ADMIN] }
  },
  {
    path: 'events/account/:id/concepts/edit/:conceptId',
    loadComponent: () =>
      import('./components/account/components/concept-form/concept-form.component').then(m => m.ConceptFormComponent),
    canActivate: [authGuard],
    canMatch: [roleGuard],
    data: { allowedRoleCodes: [URLTargetType.SUPERADMIN , URLTargetType.ADMIN] }
  },
  {
    path: 'tasks',
    loadComponent: () =>
      import('./components/task/components/task-list/task-list.component').then(m => m.TaskListComponent),
    canActivate: [authGuard],
    canMatch: [roleGuard],
    data: { allowedRoleCodes: [URLTargetType.SUPERADMIN , URLTargetType.ADMIN, , URLTargetType.SUPERVISOR, URLTargetType.EMPLOYEE] }
  },
  {
    path: 'tasks/create',
    loadComponent: () =>
      import('./components/task/components/task-form/task-form.component').then(m => m.TaskFormComponent),
    canActivate: [authGuard],
    canMatch: [roleGuard],
    data: { allowedRoleCodes: [URLTargetType.SUPERADMIN , URLTargetType.ADMIN, URLTargetType.SUPERVISOR, URLTargetType.EMPLOYEE] }
  },
  {
    path: 'tasks/edit/:id',
    loadComponent: () =>
      import('./components/task/components/task-form/task-form.component').then(m => m.TaskFormComponent),
    canActivate: [authGuard],
    canMatch: [roleGuard],
    data: { allowedRoleCodes: [URLTargetType.SUPERADMIN , URLTargetType.ADMIN, URLTargetType.SUPERVISOR, URLTargetType.EMPLOYEE] }
  },
  {
    path: 'users',
    loadComponent: () =>
      import('./components/users/components/user-list/user-list.component').then(m => m.UserListComponent),
    canActivate: [authGuard],
    canMatch: [roleGuard],
    data: { allowedRoleCodes: [URLTargetType.SUPERADMIN , URLTargetType.ADMIN] }
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./components/users/components/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [authGuard],
    canMatch: [roleGuard],
    data: { allowedRoleCodes: [URLTargetType.SUPERADMIN , URLTargetType.ADMIN, URLTargetType.EMPLOYEE, URLTargetType.SUPERVISOR] }
  },
  {
    path: 'dashboards',
    loadComponent: () =>
      import('./components/dashboard/components/event-dashboard/event-dashboard.component').then(m => m.EventDashboardComponent),
    canActivate: [authGuard],
    canMatch: [roleGuard],
    data: { allowedRoleCodes: [URLTargetType.SUPERADMIN , URLTargetType.ADMIN] }
  },
  {
    path: 'dashboards/events',
    loadComponent: () =>
      import('./components/dashboard/components/event-dashboard/event-dashboard.component').then(m => m.EventDashboardComponent),
    canActivate: [authGuard],
    canMatch: [roleGuard],
    data: { allowedRoleCodes: [URLTargetType.SUPERADMIN , URLTargetType.ADMIN] }
  },
  {
    path: 'dashboards/employees',
    loadComponent: () =>
      import('./components/dashboard/components/employee-dashboard/employee-dashboard.component').then(m => m.EmployeeDashboardComponent),
    canActivate: [authGuard],
    canMatch: [roleGuard],
    data: { allowedRoleCodes: [URLTargetType.SUPERADMIN , URLTargetType.ADMIN] }
  },
  {
    path: 'dashboards/tasks',
    loadComponent: () =>
      import('./components/dashboard/components/task-dashboard/task-dashboard.component').then(m => m.TaskDashboardComponent),
    canActivate: [authGuard],
    canMatch: [roleGuard],
    data: { allowedRoleCodes: [URLTargetType.SUPERADMIN , URLTargetType.ADMIN] }
  },
  {
    path: 'dashboards/suppliers',
    loadComponent: () =>
      import('./components/dashboard/components/supplier-dashboard/supplier-dashboard.component').then(m => m.SupplierDashboardComponent),
    canActivate: [authGuard],
    canMatch: [roleGuard],
    data: { allowedRoleCodes: [URLTargetType.SUPERADMIN , URLTargetType.ADMIN] }
  },
  {
    path: 'dashboards/users',
    loadComponent: () =>
      import('./components/dashboard/components/user-dashboard/user-dashboard.component').then(m => m.UserDashboardComponent),
    canActivate: [authGuard],
    canMatch: [roleGuard],
    data: { allowedRoleCodes: [URLTargetType.SUPERADMIN , URLTargetType.ADMIN] }
  },
  {
    path: 'dashboards/guests',
    loadComponent: () =>
      import('./components/dashboard/components/guest-dashboard/guest-dashboard.component').then(m => m.
        GuestDashboardComponent
      ),
    canActivate: [authGuard],
    canMatch: [roleGuard],
    data: { allowedRoleCodes: [URLTargetType.SUPERADMIN , URLTargetType.ADMIN] }
  },
  {
    path: 'guests',
    loadComponent: () =>
      import('./components/guest/components/guest-list/guest-list.component').then(m => m.GuestListComponent),
    canActivate: [authGuard],
    canMatch: [roleGuard],
    data: { allowedRoleCodes: [URLTargetType.SUPERADMIN , URLTargetType.ADMIN, URLTargetType.SUPERVISOR] }
  },
  {
    path: 'guests/create',
    loadComponent: () =>
      import('./components/guest/components/guest-form/guest-form.component').then(m => m.GuestFormComponent),
    canActivate: [authGuard],
    canMatch: [roleGuard],
    data: { allowedRoleCodes: [URLTargetType.SUPERADMIN , URLTargetType.ADMIN] }
  },
  {
    path: 'guests/create/file',
    loadComponent: () =>
      import('./components/guest/components/guest-file/guest-file.component').then(m => m.GuestFileComponent),
    canActivate: [authGuard],
    canMatch: [roleGuard],
    data: { allowedRoleCodes: [URLTargetType.SUPERADMIN , URLTargetType.ADMIN] }
  },
  {
    path: 'guests/edit/:idGuest/:idEvent',
    loadComponent: () =>
      import('./components/guest/components/guest-form/guest-form.component').then(m => m.GuestFormComponent),
    canActivate: [authGuard],
    canMatch: [roleGuard],
    data: { allowedRoleCodes: [URLTargetType.SUPERADMIN , URLTargetType.ADMIN] }
  },
  {
    path: 'check-in',
    loadComponent: () =>
      import('./components/guest/components/guest-check-in/guest-check-in.component').then(m => m.GuestCheckInComponent),
    canActivate: [authGuard],
    canMatch: [roleGuard],
    data: { allowedRoleCodes: [URLTargetType.SUPERADMIN , URLTargetType.ADMIN, URLTargetType.SUPERVISOR, URLTargetType.EMPLOYEE] }
  },
  {
    path: 'files',
    loadComponent: () =>
      import('./components/file/components/file-list/file-list.component').then(m => m.FileListComponent),
    canActivate: [authGuard],
    canMatch: [roleGuard],
    data: { allowedRoleCodes: [URLTargetType.SUPERADMIN , URLTargetType.ADMIN] }
  },
  {
    path: 'files/create',
    loadComponent: () =>
      import('./components/file/components/file-form/file-form.component').then(m => m.FileFormComponent),
    canActivate: [authGuard],
    canMatch: [roleGuard],
    data: { allowedRoleCodes: [URLTargetType.SUPERADMIN , URLTargetType.ADMIN] }
  },
  {
    path: 'files/edit/:id',
    loadComponent: () =>
      import('./components/file/components/file-form/file-form.component').then(m => m.FileFormComponent),
    canActivate: [authGuard],
    canMatch: [roleGuard],
    data: { allowedRoleCodes: [URLTargetType.SUPERADMIN , URLTargetType.ADMIN] }
  },
  {
    path: 'files/entity/:entityType/:entityId',
    loadComponent: () =>
      import('./components/file/components/file-list/file-list.component').then(m => m.FileListComponent),
    canActivate: [authGuard],
    canMatch: [roleGuard],
    data: { allowedRoleCodes: [URLTargetType.SUPERADMIN , URLTargetType.ADMIN] }
  },
  {
    path: 'payments',
    loadComponent: () =>
      import('./components/payment/components/payment-list/payment-list.component').then(m => m.PaymentListComponent),
    canActivate: [authGuard],
    canMatch: [roleGuard],
    data: { allowedRoleCodes: [URLTargetType.SUPERADMIN , URLTargetType.ADMIN] }
  },
  {
    path: 'payments/create',
    loadComponent: () =>
      import('./components/payment/components/payment-form/payment-form.component').then(m => m.PaymentFormComponent),
    canActivate: [authGuard],
    canMatch: [roleGuard],
    data: { allowedRoleCodes: [URLTargetType.SUPERADMIN , URLTargetType.ADMIN] }
  },
  {
    path: 'schedules',
    loadComponent: () =>
      import('./components/schedule/components/schedule-list/schedule-list.component').then(m => m.ScheduleListComponent),
    canActivate: [authGuard],
    canMatch: [roleGuard],
    data: { allowedRoleCodes: [URLTargetType.SUPERADMIN , URLTargetType.ADMIN,  URLTargetType.SUPERVISOR, URLTargetType.EMPLOYEE] }
  },
  {
    path: 'schedules/create',
    loadComponent: () =>
      import('./components/schedule/components/schedule-form/schedule-form.component').then(m => m.ScheduleFormComponent),
    canActivate: [authGuard],
    canMatch: [roleGuard],
    data: { allowedRoleCodes: [URLTargetType.SUPERADMIN , URLTargetType.ADMIN,  URLTargetType.SUPERVISOR, URLTargetType.EMPLOYEE] }
  },
  {
    path: 'schedules/edit/:id',
    loadComponent: () =>
      import('./components/schedule/components/schedule-form/schedule-form.component').then(m => m.ScheduleFormComponent),
    canActivate: [authGuard],
    canMatch: [roleGuard],
    data: { allowedRoleCodes: [URLTargetType.SUPERADMIN , URLTargetType.ADMIN,  URLTargetType.SUPERVISOR, URLTargetType.EMPLOYEE] }
  },
  {
    path: 'schedules/timing/:scheduleId/:eventId',
    loadComponent: () =>
      import('./components/schedule/components/schedule-timing/schedule-timing.component').then(m => m.ScheduleTimingComponent),
    canActivate: [authGuard],
    canMatch: [roleGuard],
    data: { allowedRoleCodes: [URLTargetType.SUPERADMIN , URLTargetType.ADMIN,  URLTargetType.SUPERVISOR, URLTargetType.EMPLOYEE] }
  },
  {
    path: 'clients',
    loadComponent: () =>
      import('./components/client/components/client-list/client-list.component').then(m => m.ClientListComponent),
    canActivate: [authGuard],
    canMatch: [roleGuard],
    data: { allowedRoleCodes: [URLTargetType.SUPERADMIN , URLTargetType.ADMIN, URLTargetType.SUPERVISOR] }
  },
  {
    path: 'clients/create',
    loadComponent: () =>
      import('./components/client/components/client-form/client-form.component').then(m => m.ClientFormComponent),
    canActivate: [authGuard],
    canMatch: [roleGuard],
    data: { allowedRoleCodes: [URLTargetType.SUPERADMIN , URLTargetType.ADMIN,  URLTargetType.SUPERVISOR] }
  },
  {
    path: 'clients/edit/:id',
    loadComponent: () =>
      import('./components/client/components/client-form/client-form.component').then(m => m.ClientFormComponent),
    canActivate: [authGuard],
    canMatch: [roleGuard],
    data: { allowedRoleCodes: [URLTargetType.SUPERADMIN , URLTargetType.ADMIN,  URLTargetType.SUPERVISOR] }
  },
];


