import { CanMatchFn, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { inject } from '@angular/core';
import { map } from 'rxjs';

export const roleGuard: CanMatchFn = (route, segments) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const allowedRoleCodes: number[] = route.data?.['allowedRoleCodes'] as number[] ?? [];
  
  return authService.isAuthenticated$.pipe(
    map(() =>
      authService.hasRoleCodes(allowedRoleCodes)
        ? true
        : router.parseUrl('/landing')
    )
  );

};
