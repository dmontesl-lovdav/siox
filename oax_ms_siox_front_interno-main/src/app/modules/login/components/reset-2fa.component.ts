import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { LoginRequest, TwoFactorRequest, TwoFactorSetupResponse } from '../models/auth.models';
import { AuthService } from '../services/auth.service';

/**
 * Componente para reconfigurar 2FA cuando se pierde el dispositivo
 * Solicita credenciales y genera un nuevo QR code
 */
@Component({
  selector: 'app-reset-2fa',
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
    NzStepsModule,
    NzDividerModule
  ],
  templateUrl: './reset-2fa.component.html',
  styleUrls: ['./reset-2fa.component.scss']
})
export class Reset2faComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  credentialsForm!: FormGroup;
  validateForm!: FormGroup;
  loading = false;
  errorMessage = '';
  successMessage = '';
  showPassword = false;
  
  twoFactorSetup: TwoFactorSetupResponse | null = null;
  currentStep = 0;
  correo = '';

  ngOnInit(): void {
    // Formulario de credenciales
    this.credentialsForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    // Formulario de validación del código
    this.validateForm = this.fb.group({
      code: ['', [
        Validators.required,
        Validators.pattern(/^\d{6}$/),
        Validators.minLength(6),
        Validators.maxLength(6)
      ]]
    });
  }

  /**
   * Solicita la reconfiguración de 2FA con credenciales
   */
  onSubmitCredentials(): void {
    if (this.credentialsForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const request: LoginRequest = {
        correo: this.credentialsForm.value.correo,
        password: this.credentialsForm.value.password
      };

      this.authService.resetTwoFactor(request).subscribe({
        next: (response) => {
          this.loading = false;
          console.log('Respuesta resetTwoFactor:', response);
          
          this.twoFactorSetup = response;
          this.correo = request.correo;
          this.currentStep = 1;
          this.successMessage = 'Se ha generado un nuevo código 2FA. Configura tu aplicación de autenticación.';
        },
        error: (error) => {
          this.loading = false;
          console.error('Error al resetear 2FA:', error);
          
          if (error.error?.message) {
            this.errorMessage = error.error.message;
          } else if (error.status === 401) {
            this.errorMessage = 'Credenciales inválidas';
          } else if (error.status === 404) {
            this.errorMessage = 'Usuario no encontrado';
          } else if (error.status === 0) {
            this.errorMessage = 'No se pudo conectar con el servidor';
          } else {
            this.errorMessage = 'Error al reconfigurar 2FA';
          }
        }
      });
    } else {
      Object.values(this.credentialsForm.controls).forEach(control => {
        control.markAsTouched();
        control.updateValueAndValidity();
      });
    }
  }

  /**
   * Valida el código 2FA del nuevo dispositivo
   */
  onSubmitValidation(): void {
    if (this.validateForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const request: TwoFactorRequest = {
        correo: this.correo,
        codigo2FA: this.validateForm.value.code
      };

      this.authService.validateTwoFactor(request).subscribe({
        next: (response) => {
          this.loading = false;
          
          console.log('Respuesta validateTwoFactor (reset):', response);
          
          // Verificar si la autenticación fue exitosa
          const isSuccess = response.success !== false && 
                           !response.mensaje?.toLowerCase().includes('error') &&
                           !response.mensaje?.toLowerCase().includes('inválido') &&
                           !response.mensaje?.toLowerCase().includes('incorrecto') &&
                           (response.mensaje?.toLowerCase().includes('exitosa') || 
                            response.mensaje?.toLowerCase().includes('éxito') ||
                            response.userId !== undefined ||
                            response.token !== undefined);
          
          if (isSuccess) {
            // Guardar datos del usuario si existen
            if (response.userId && response.correo) {
              const userInfo: any = {
                idUsuario: response.userId,
                userId: response.userId,
                nombre: response.nombre || '',
                correo: response.correo,
                rol: response.rol || '',
                tipoUsuario: response.tipoUsuario || '',
                licenciaId: response.licenciaId
              };
              console.log('Guardando información del usuario:', userInfo);
              this.authService.setUser(userInfo);
            }
            
            this.successMessage = '¡2FA reconfigurado exitosamente!';
            
            // Redirigir al dashboard después de 2 segundos
            setTimeout(() => {
              this.router.navigate(['/']);
            }, 2000);
          } else {
            this.errorMessage = response.mensaje || response.message || 'Código inválido. Intenta nuevamente.';
            this.validateForm.patchValue({ code: '' });
          }
        },
        error: (error) => {
          this.loading = false;
          console.error('Error al validar 2FA:', error);
          
          if (error.error?.message) {
            this.errorMessage = error.error.message;
          } else if (error.status === 401) {
            this.errorMessage = 'Código 2FA inválido. Verifica e intenta nuevamente.';
          } else if (error.status === 0) {
            this.errorMessage = 'No se pudo conectar con el servidor';
          } else {
            this.errorMessage = 'Error al validar el código 2FA';
          }
          
          this.validateForm.patchValue({ code: '' });
        }
      });
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        control.markAsTouched();
        control.updateValueAndValidity();
      });
    }
  }

  /**
   * Copia el código secreto al portapapeles
   */
  copySecretKey(): void {
    const secretKey = this.twoFactorSetup?.manualEntryKey || this.twoFactorSetup?.secret;
    if (secretKey) {
      navigator.clipboard.writeText(secretKey)
        .then(() => {
          this.successMessage = 'Código copiado al portapapeles';
          setTimeout(() => this.successMessage = '', 3000);
        })
        .catch(err => {
          console.error('Error al copiar:', err);
          this.errorMessage = 'No se pudo copiar el código';
        });
    }
  }

  /**
   * Navega al paso siguiente
   */
  nextStep(): void {
    if (this.currentStep < 2) {
      this.currentStep++;
    }
  }

  /**
   * Navega al paso anterior
   */
  prevStep(): void {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  /**
   * Navega de regreso al login
   */
  goBack(): void {
    this.router.navigate(['/login']);
  }

  /**
   * Alterna la visibilidad de la contraseña
   */
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  /**
   * Formatea el input para aceptar solo números
   */
  onCodeInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/\D/g, '').slice(0, 6);
    this.validateForm.patchValue({ code: input.value });
  }
}
