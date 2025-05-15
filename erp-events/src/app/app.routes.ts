import { Routes } from '@angular/router';
import { authGuard } from './auth/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'register',
    loadComponent: () => import('./auth/components/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./auth/components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'landing',
    loadComponent: () =>
      import('./landing/components/landing/landing.component').then(m => m.LandingComponent),
    canActivate: [authGuard]
  },
  {
    path: 'conditions',
    loadComponent: () =>
      import('./landing/components/conditions/conditions.component').then(m => m.ConditionsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'faq',
    loadComponent: () =>
      import('./landing/components/faq/faq.component').then(m => m.FaqComponent),
    canActivate: [authGuard]
  },
  {
    path: 'employees',
    loadComponent: () =>
      import('./employee/components/employee-list/employee-list.component').then(m => m.EmployeeListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'employees/create',
    loadComponent: () =>
      import('./employee/components/employee-form/employee-form.component').then(m => m.EmployeeFormComponent),
    canActivate: [authGuard]
  },
  {
    path: 'employees/edit/:id',
    loadComponent: () => import('./employee/components/employee-form/employee-form.component').then(m => m.EmployeeFormComponent),
    canActivate: [authGuard]
  },
  {
    path: 'suppliers',
    loadComponent: () =>
      import('./supplier/components/supplier-list/supplier-list.component').then(m => m.SupplierListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'suppliers/create',
    loadComponent: () =>
      import('./supplier/components/supplier-form/supplier-form.component').then(m => m.SupplierFormComponent),
    canActivate: [authGuard]
  },
  {
    path: 'suppliers/edit/:id',
    loadComponent: () =>
      import('./supplier/components/supplier-form/supplier-form.component').then(m => m.SupplierFormComponent),
    canActivate: [authGuard]
  },
  {
    path: 'events',
    loadComponent: () =>
      import('./event/components/event-list/event-list.component').then(m => m.EventListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'events/create',
    loadComponent: () =>
      import('./event/components/event-form/event-form.component').then(m => m.EventFormComponent),
    canActivate: [authGuard]
  },
  {
    path: 'events/edit/:id',
    loadComponent: () =>
      import('./event/components/event-form/event-form.component').then(m => m.EventFormComponent),
    canActivate: [authGuard]
  },
  {
    path: 'tasks',
    loadComponent: () =>
      import('./task/components/task-list/task-list.component').then(m => m.TaskListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'tasks/create',
    loadComponent: () =>
      import('./task/components/task-form/task-form.component').then(m => m.TaskFormComponent),
    canActivate: [authGuard]
  },
  {
    path: 'tasks/edit/:id',
    loadComponent: () =>
      import('./task/components/task-form/task-form.component').then(m => m.TaskFormComponent),
    canActivate: [authGuard]
  },
];


