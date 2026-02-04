import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../modules/login/services/auth.service';
import { environment } from '../../environments/environment';

/**
 * Guard de autenticación
 * Protege rutas que requieren que el usuario esté autenticado
 * Si no está autenticado, redirige al login
 * Restaura la sesión desde sessionStorage si existe
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('AuthGuard - Estado de autenticación:', authService.isAuthenticated());
  console.log('AuthGuard - Usuario:', authService.getUser());
  console.log('AuthGuard - Ruta intentada:', state.url);

  // En DEV saltamos la autenticación para facilitar desarrollo local
  if (!environment.production) {
    console.log('AuthGuard - DEV mode: bypassing authentication');
    return true;
  }

  // Verificar si el usuario está autenticado
  if (authService.isAuthenticated()) {
    console.log('AuthGuard - Acceso permitido');
    return true;
  }

  console.log('AuthGuard - Acceso denegado, redirigiendo a login');
  
  // Guardar la URL a la que intentaba acceder para redireccionar después del login
  const returnUrl = state.url;
  
  // Redirigir al login
  router.navigate(['/login'], { 
    queryParams: { returnUrl } 
  });
  
  return false;
};
