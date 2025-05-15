import { Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { map, take } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated$.pipe(
    take(1),
    map(isLoggedIn => {
      if (isLoggedIn) {
        console.log("User is logged in, allowing access to the route.");
        
        return true;
      } else {
        console.log("User is not logged in, redirecting to login page.");
        
        router.navigate(['/login']);
        return false;
      }
    })
  );
};

