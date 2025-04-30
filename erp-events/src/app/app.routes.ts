import { Routes } from '@angular/router';
import { authGuard } from './auth/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'register',
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
  }
];


