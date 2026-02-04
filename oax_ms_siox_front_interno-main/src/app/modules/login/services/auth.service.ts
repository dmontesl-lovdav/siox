import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, switchMap, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { oauth2Service } from '../../../services/oauth2.service';
import {
  AuthResponse,
  AuthState,
  LoginRequest,
  TwoFactorRequest,
  TwoFactorSetupResponse,
  UsuarioInfo
} from '../models/auth.models';

/**
 * Servicio de autenticación que consume los endpoints del AuthController
 * Maneja login, 2FA y gestión de sesión
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private oauth2Service = inject(oauth2Service);

  // URL base del backend desde la configuración del environment
  private url = environment.apiBaseUrl;

  // Estado de autenticación reactivo
  private authStateSubject = new BehaviorSubject<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
    requiresTwoFactor: false,
    twoFactorSetup: null
  });

  public authState$ = this.authStateSubject.asObservable();

  constructor() {
    // Restaurar sesión desde localStorage al iniciar
    this.restoreSession();

    // DEV: si estamos en modo no productivo y no hay sesión, inicializar una sesión de desarrollo
    if (!environment.production && !this.getAuthState().isAuthenticated) {
      const devUser: any = { idUsuario: -1, nombre: 'DEV', correo: 'dev@local', rol: 'DEV', tipoUsuario: 'dev' };
      this.setUser(devUser);
      sessionStorage.setItem('auth_token', 'dev-token');
      this.updateAuthState({
        isAuthenticated: true,
        user: devUser,
        token: 'dev-token',
        requiresTwoFactor: false,
        twoFactorSetup: null
      });
      console.log('AuthService: initialized DEV session');
    }
  }

  /**
   * Endpoint: POST /auth/login
   * Login inicial - Valida credenciales y determina si requiere 2FA
   */
  login(request: LoginRequest): Observable<AuthResponse> {
    // Obtener token OAuth2 antes de hacer la petición
    return this.oauth2Service.login().pipe(
      switchMap((tokenResponse: any) => {
        const token = tokenResponse?.access_token;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        if (token) {
          headers = headers.set('Authorization', `Bearer ${token}`);
        }
        return this.http.post<AuthResponse>(this.url + environment.auth.login, request, { headers });
      }),
      tap(response => {
        // Normalizar propiedades del backend
        const isSuccess = response.success !== false && !response.mensaje?.toLowerCase().includes('error');
        const requiresTwoFactor = response.requiere2FA || response.requiresTwoFactor;
        const twoFactorSetup = response.setup2FA || response.twoFactorSetup;
        
        if (isSuccess) {
          if (requiresTwoFactor && twoFactorSetup) {
            // Primera vez - necesita configurar 2FA
            this.updateAuthState({
              isAuthenticated: false,
              user: null,
              token: null,
              requiresTwoFactor: true,
              twoFactorSetup: twoFactorSetup
            });
          } else if (requiresTwoFactor) {
            // Ya tiene 2FA configurado, necesita validar código
            this.updateAuthState({
              isAuthenticated: false,
              user: null,
              token: null,
              requiresTwoFactor: true,
              twoFactorSetup: null
            });
          } else if (response.token && response.usuario) {
            // Login exitoso sin 2FA (caso especial)
            this.handleSuccessfulAuth(response);
          }
        }
      })
    );
  }

  /**
   * Endpoint: POST /auth/validate-2fa
   * Valida código 2FA y obtiene token JWT
   */
  validateTwoFactor(request: TwoFactorRequest): Observable<AuthResponse> {
    // Obtener token OAuth2 antes de hacer la petición
    return this.oauth2Service.login().pipe(
      switchMap((tokenResponse: any) => {
        const token = tokenResponse?.access_token;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        if (token) {
          headers = headers.set('Authorization', `Bearer ${token}`);
        }
        return this.http.post<AuthResponse>(this.url + environment.auth.validateTwoFactor, request, { headers });
      }),
      tap(response => {
        // Verificar si la autenticación fue exitosa
        const isSuccess = response.success !== false && 
                         !response.mensaje?.toLowerCase().includes('error') &&
                         !response.mensaje?.toLowerCase().includes('inválido') &&
                         (response.mensaje?.toLowerCase().includes('exitosa') || 
                          response.userId !== undefined);
        
        if (isSuccess) {
          // Crear objeto de usuario con los datos disponibles
          const usuario: any = {
            idUsuario: response.userId,
            nombre: response.nombre || '',
            correo: response.correo || '',
            rol: response.rol || '',
            tipoUsuario: response.tipoUsuario || ''
          };
          
          // Actualizar estado aunque no haya token (Kong lo manejará)
          this.updateAuthState({
            isAuthenticated: true,
            user: usuario,
            token: response.token || null,
            requiresTwoFactor: false,
            twoFactorSetup: null
          });
          
          // Guardar usuario en localStorage
          this.setUser(usuario);
        }
      })
    );
  }

  /**
   * Endpoint: POST /auth/reset-2fa
   * Reconfiguración de 2FA (pérdida de dispositivo)
   */
  resetTwoFactor(request: LoginRequest): Observable<TwoFactorSetupResponse> {
    // Obtener token OAuth2 antes de hacer la petición
    return this.oauth2Service.login().pipe(
      switchMap((tokenResponse: any) => {
        const token = tokenResponse?.access_token;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        if (token) {
          headers = headers.set('Authorization', `Bearer ${token}`);
        }
        return this.http.post<TwoFactorSetupResponse>(this.url + environment.auth.resetTwoFactor, request, { headers });
      }),
      tap(response => {
        this.updateAuthState({
          isAuthenticated: false,
          user: null,
          token: null,
          requiresTwoFactor: true,
          twoFactorSetup: response
        });
      })
    );
  }

  /**
   * Endpoint: GET /auth/health
   * Health check del servicio
   */
  healthCheck(): Observable<string> {
    // Obtener token OAuth2 antes de hacer la petición
    return this.oauth2Service.login().pipe(
      switchMap((tokenResponse: any) => {
        const token = tokenResponse?.access_token;
        let headers = new HttpHeaders();
        if (token) {
          headers = headers.set('Authorization', `Bearer ${token}`);
        }
        return this.http.get(this.url + environment.auth.health, { headers, responseType: 'text' });
      })
    );
  }

  /**
   * Endpoint: GET /auth/public/test
   * Endpoint público de prueba
   */
  publicTest(): Observable<string> {
    // Obtener token OAuth2 antes de hacer la petición
    return this.oauth2Service.login().pipe(
      switchMap((tokenResponse: any) => {
        const token = tokenResponse?.access_token;
        let headers = new HttpHeaders();
        if (token) {
          headers = headers.set('Authorization', `Bearer ${token}`);
        }
        return this.http.get(this.url + environment.auth.publicTest, { headers, responseType: 'text' });
      })
    );
  }

  /**
   * Maneja autenticación exitosa
   */
  private handleSuccessfulAuth(response: AuthResponse): void {
    if (response.token && response.usuario) {
      // Guardar token y usuario
      this.setToken(response.token);
      this.setUser(response.usuario);

      // Actualizar estado
      this.updateAuthState({
        isAuthenticated: true,
        user: response.usuario,
        token: response.token,
        requiresTwoFactor: false,
        twoFactorSetup: null
      });
    }
  }

  /**
   * Actualiza el estado de autenticación
   */
  private updateAuthState(state: AuthState): void {
    this.authStateSubject.next(state);
  }

  /**
   * Obtiene el estado actual de autenticación
   */
  getAuthState(): AuthState {
    return this.authStateSubject.value;
  }

  /**
   * Guarda el token en sessionStorage
   */
  private setToken(token: string): void {
    sessionStorage.setItem('auth_token', token);
  }

  /**
   * Obtiene el token desde sessionStorage
   */
  getToken(): string | null {
    return sessionStorage.getItem('auth_token');
  }

  /**
   * Guarda información del usuario en sessionStorage
   */
  setUser(user: UsuarioInfo): void {
    sessionStorage.setItem('auth_user', JSON.stringify(user));
    sessionStorage.setItem('isAuthenticated', 'true');
  }

  /**
   * Obtiene información del usuario desde sessionStorage
   */
  getUser(): UsuarioInfo | null {
    const userJson = sessionStorage.getItem('auth_user');
    return userJson ? JSON.parse(userJson) : null;
  }

  /**
   * Restaura la sesión desde sessionStorage
   */
  private restoreSession(): void {
    const token = this.getToken();
    const user = this.getUser();
    const isAuthenticated = sessionStorage.getItem('isAuthenticated') === 'true';

    if (isAuthenticated && user) {
      this.updateAuthState({
        isAuthenticated: true,
        user: user,
        token: token,
        requiresTwoFactor: false,
        twoFactorSetup: null
      });
    }
  }

  /**
   * Cierra sesión y limpia datos
   */
  logout(): void {
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('auth_user');
    sessionStorage.removeItem('isAuthenticated');
    
    this.updateAuthState({
      isAuthenticated: false,
      user: null,
      token: null,
      requiresTwoFactor: false,
      twoFactorSetup: null
    });

    this.router.navigate(['/login']);
  }

  /**
   * Verifica si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    return this.authStateSubject.value.isAuthenticated;
  }

  /**
   * Obtiene los headers con el token de autenticación
   */
  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }
}
