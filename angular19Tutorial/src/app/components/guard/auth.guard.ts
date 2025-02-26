import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true; // ✅ Allow access if authenticated
  } else {
    alert("Access Denied! Please login first.");
    router.navigateByUrl('/login'); // 🔄 Redirect to login page if not authenticated
    return false;
  }
};
