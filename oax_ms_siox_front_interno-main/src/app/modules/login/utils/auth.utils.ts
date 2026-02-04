/**
 * Utilidades y helpers para el módulo de autenticación
 */

import { UsuarioInfo } from '../models/auth.models';

/**
 * Formatea el nombre completo del usuario
 */
export function formatFullName(usuario: UsuarioInfo): string {
  const partes = [
    usuario.nombre,
    usuario.apellidoPaterno,
    usuario.apellidoMaterno
  ].filter(Boolean);
  
  return partes.join(' ');
}

/**
 * Obtiene las iniciales del usuario
 */
export function getUserInitials(usuario: UsuarioInfo): string {
  const nombre = usuario.nombre?.charAt(0) || '';
  const apellido = usuario.apellidoPaterno?.charAt(0) || '';
  return (nombre + apellido).toUpperCase();
}

/**
 * Valida si un token JWT está expirado
 * @param token Token JWT
 * @returns true si está expirado, false si aún es válido
 */
export function isTokenExpired(token: string): boolean {
  try {
    // Decodificar el payload del token (parte central del JWT)
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    const payload = JSON.parse(jsonPayload);
    
    // Verificar si tiene campo 'exp' (expiration time)
    if (!payload.exp) {
      return false; // Si no tiene exp, asumimos que no expira
    }

    // Comparar con el tiempo actual (exp está en segundos, Date.now() en milisegundos)
    const now = Date.now() / 1000;
    return payload.exp < now;
  } catch (error) {
    console.error('Error al decodificar token:', error);
    return true; // En caso de error, considerarlo expirado por seguridad
  }
}

/**
 * Obtiene el tiempo restante hasta la expiración del token en segundos
 * @param token Token JWT
 * @returns Segundos hasta expiración, o null si no tiene expiración
 */
export function getTokenExpirationTime(token: string): number | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    const payload = JSON.parse(jsonPayload);
    
    if (!payload.exp) {
      return null;
    }

    const now = Date.now() / 1000;
    const timeRemaining = payload.exp - now;
    
    return timeRemaining > 0 ? timeRemaining : 0;
  } catch (error) {
    console.error('Error al obtener tiempo de expiración:', error);
    return null;
  }
}

/**
 * Valida formato de código 2FA (6 dígitos)
 */
export function isValid2FACode(code: string): boolean {
  const regex = /^\d{6}$/;
  return regex.test(code);
}

/**
 * Valida formato de correo electrónico
 */
export function isValidEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Verifica si el usuario tiene un rol específico
 */
export function hasRole(usuario: UsuarioInfo | null, role: string): boolean {
  if (!usuario || !usuario.roles) {
    return false;
  }
  return usuario.roles.includes(role);
}

/**
 * Verifica si el usuario tiene alguno de los roles especificados
 */
export function hasAnyRole(usuario: UsuarioInfo | null, roles: string[]): boolean {
  if (!usuario || !usuario.roles) {
    return false;
  }
  return roles.some(role => usuario.roles!.includes(role));
}

/**
 * Verifica si el usuario tiene todos los roles especificados
 */
export function hasAllRoles(usuario: UsuarioInfo | null, roles: string[]): boolean {
  if (!usuario || !usuario.roles) {
    return false;
  }
  return roles.every(role => usuario.roles!.includes(role));
}

/**
 * Verifica si el usuario tiene un permiso específico
 */
export function hasPermission(usuario: UsuarioInfo | null, permission: string): boolean {
  if (!usuario || !usuario.permisos) {
    return false;
  }
  return usuario.permisos.includes(permission);
}

/**
 * Verifica si el usuario tiene alguno de los permisos especificados
 */
export function hasAnyPermission(usuario: UsuarioInfo | null, permissions: string[]): boolean {
  if (!usuario || !usuario.permisos) {
    return false;
  }
  return permissions.some(permission => usuario.permisos!.includes(permission));
}

/**
 * Verifica si el usuario tiene todos los permisos especificados
 */
export function hasAllPermissions(usuario: UsuarioInfo | null, permissions: string[]): boolean {
  if (!usuario || !usuario.permisos) {
    return false;
  }
  return permissions.every(permission => usuario.permisos!.includes(permission));
}

/**
 * Obtiene un saludo basado en la hora del día
 */
export function getGreeting(): string {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) {
    return 'Buenos días';
  } else if (hour >= 12 && hour < 19) {
    return 'Buenas tardes';
  } else {
    return 'Buenas noches';
  }
}

/**
 * Formatea un mensaje de bienvenida personalizado
 */
export function getWelcomeMessage(usuario: UsuarioInfo): string {
  const greeting = getGreeting();
  const name = usuario.nombre || 'Usuario';
  return `${greeting}, ${name}`;
}
