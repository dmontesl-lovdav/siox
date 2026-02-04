import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { LoginRequest } from '../models/auth.models';
import { AuthService } from '../services/auth.service';

/**
 * Componente de login principal
 * Maneja el formulario de inicio de sesión y flujo 2FA
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzCardModule,
    NzAlertModule,
    NzIconModule,
    NzSpinModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm!: FormGroup;
  loading = false;
  errorMessage = '';
  showPassword = false;

  ngOnInit(): void {
    // Verificar si ya está autenticado
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/']);
    }

    // Inicializar formulario
    this.loginForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  /**
   * Maneja el submit del formulario de login
   */
  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      this.errorMessage = '';

      const loginRequest: LoginRequest = {
        correo: this.loginForm.value.correo,
        password: this.loginForm.value.password
      };

      this.authService.login(loginRequest).subscribe({
        next: (response) => {
          this.loading = false;
          
          console.log('Respuesta completa del login:', response);
          console.log('requiere2FA:', response.requiere2FA);
          console.log('setup2FA:', response.setup2FA);
          
          // Verificar success del mensaje (puede venir en diferentes formatos)
          const isSuccess = response.success !== false && !response.mensaje?.toLowerCase().includes('error');
          
          if (isSuccess) {
            // Normalizar las propiedades para compatibilidad
            const requiresTwoFactor = response.requiere2FA || response.requiresTwoFactor;
            const twoFactorSetup = response.setup2FA || response.twoFactorSetup;
            
            if (requiresTwoFactor && twoFactorSetup) {
              // Primera vez - redirigir a configuración 2FA
              console.log('Navegando a setup-2fa con datos:', {
                correo: loginRequest.correo,
                twoFactorSetup: twoFactorSetup
              });
              this.router.navigate(['/login/setup-2fa'], {
                state: { 
                  correo: loginRequest.correo,
                  twoFactorSetup: twoFactorSetup 
                }
              });
            } else if (requiresTwoFactor) {
              // Ya tiene 2FA - redirigir a validación
              console.log('Navegando a validate-2fa');
              this.router.navigate(['/login/validate-2fa'], {
                state: { correo: loginRequest.correo }
              });
            } else if (response.token) {
              // Login exitoso directo (sin 2FA)
              console.log('Login exitoso, navegando a home');
              this.router.navigate(['/']);
            }
          } else {
            this.errorMessage = response.mensaje || response.message || 'Error en el inicio de sesión';
          }
        },
        error: (error) => {
          this.loading = false;
          console.error('Error en login:', error);
          
          // Verificar si es error de OAuth2
          if (error.error?.error_description) {
            this.errorMessage = error.error.error_description;
          } else if (error.error?.error) {
            this.errorMessage = `Error OAuth2: ${error.error.error}`;
          } else if (error.error?.message) {
            this.errorMessage = error.error.message;
          } else if (error.status === 401) {
            this.errorMessage = 'Credenciales inválidas';
          } else if (error.status === 0) {
            this.errorMessage = 'No se pudo conectar con el servidor';
          } else {
            this.errorMessage = 'Error al intentar iniciar sesión';
          }
        }
      });
    } else {
      // Marcar todos los campos como touched para mostrar errores
      Object.values(this.loginForm.controls).forEach(control => {
        control.markAsTouched();
        control.updateValueAndValidity();
      });
    }
  }

  /**
   * Alterna la visibilidad de la contraseña
   */
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  /**
   * Navega a la página de recuperación de 2FA
   */
  onResetTwoFactor(): void {
    this.router.navigate(['/login/reset-2fa']);
  }
}
