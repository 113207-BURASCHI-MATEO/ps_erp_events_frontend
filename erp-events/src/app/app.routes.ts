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
      import('./event/components/event-list/event-list.component').then(m => m.EventListComponent)
  },
  {
    path: 'events/create',
    loadComponent: () =>
      import('./event/components/event-form/event-form.component').then(m => m.EventFormComponent)
  },
  {
    path: 'events/edit/:id',
    loadComponent: () =>
      import('./event/components/event-form/event-form.component').then(m => m.EventFormComponent)
  }
];


