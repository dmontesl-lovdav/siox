import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../modules/login/services/auth.service';

/**
 * Guard de no-autenticación
 * Protege rutas que solo deben ser accesibles para usuarios NO autenticados (login, 2FA)
 * Si el usuario ya está autenticado, redirige al dashboard
 */
export const noAuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Si el usuario ya está autenticado, no puede acceder a login o 2FA
  if (authService.isAuthenticated()) {
    console.log('Usuario ya autenticado, redirigiendo a dashboard');
    router.navigate(['/']);
    return false;
  }

  // Si no está autenticado, permitir acceso a login/2FA
  return true;
};
