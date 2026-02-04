/**
 * Modelos de datos para el módulo de autenticación
 * Estos modelos corresponden a los DTOs del backend (AuthController)
 */

/**
 * Request para el login inicial
 */
export interface LoginRequest {
  correo: string;
  password: string;
}

/**
 * Request para validar código 2FA
 */
export interface TwoFactorRequest {
  correo: string;
  codigo2FA: string;
}

/**
 * Response de autenticación
 * IMPORTANTE: Los nombres de las propiedades deben coincidir EXACTAMENTE con el backend Java
 */
export interface AuthResponse {
  success?: boolean;
  mensaje?: string;
  token?: string;
  tipo?: string;
  userId?: number;
  licenciaId?: number;
  nombre?: string;
  correo?: string;
  rol?: string;
  tipoUsuario?: string;
  requiere2FA?: boolean;
  setup2FA?: TwoFactorSetupResponse;
  usuario?: UsuarioInfo;
  // Propiedades adicionales para compatibilidad
  message?: string;
  requiresTwoFactor?: boolean;
  twoFactorSetup?: TwoFactorSetupResponse;
}

/**
 * Response para configuración de 2FA
 * Coincide con TwoFactorSetupResponse.java del backend
 */
export interface TwoFactorSetupResponse {
  secret: string;
  qrCodeUrl: string;
  manualEntryKey: string;
  mensaje?: string;
  // Propiedades opcionales para compatibilidad
  issuer?: string;
  accountName?: string;
  secretKey?: string;
}

/**
 * Información del usuario autenticado
 * Compatible con los datos que envía el backend
 */
export interface UsuarioInfo {
  idUsuario?: number;
  userId?: number;
  nombre: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  correo: string;
  rol?: string;
  tipoUsuario?: string;
  licenciaId?: number;
  nombreCompleto?: string;
  roles?: string[];
  permisos?: string[];
}

/**
 * Estado de la sesión de autenticación
 */
export interface AuthState {
  isAuthenticated: boolean;
  user: UsuarioInfo | null;
  token: string | null;
  requiresTwoFactor: boolean;
  twoFactorSetup: TwoFactorSetupResponse | null;
}
