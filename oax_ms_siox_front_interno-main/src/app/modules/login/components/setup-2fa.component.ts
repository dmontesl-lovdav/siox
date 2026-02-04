import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { TwoFactorRequest, TwoFactorSetupResponse } from '../models/auth.models';
import { AuthService } from '../services/auth.service';

/**
 * Componente para configurar 2FA por primera vez
 * Muestra QR code y permite validar la configuración
 */
@Component({
  selector: 'app-setup-2fa',
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
  templateUrl: './setup-2fa.component.html',
  styleUrls: ['./setup-2fa.component.scss']
})
export class Setup2faComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  validateForm!: FormGroup;
  loading = false;
  errorMessage = '';
  successMessage = '';
  correo = '';
  twoFactorSetup: TwoFactorSetupResponse | null = null;
  currentStep = 0;
  returnUrl: string = '/';

  ngOnInit(): void {
    // Obtener la URL de retorno si existe
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    // Obtener datos del state de navegación
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state || history.state;
    
    console.log('State recibido en setup-2fa:', state);
    console.log('Navigation extras:', navigation?.extras);
    
    this.correo = state['correo'];
    this.twoFactorSetup = state['twoFactorSetup'];
    
    console.log('Correo extraído:', this.correo);
    console.log('TwoFactorSetup extraído:', this.twoFactorSetup);

    // Si no hay datos, redirigir al login
    if (!this.correo || !this.twoFactorSetup) {
      console.error('Faltan datos necesarios. Redirigiendo a login...');
      this.router.navigate(['/login']);
      return;
    }

    // Inicializar formulario
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
   * Avanza al siguiente paso
   */
  nextStep(): void {
    if (this.currentStep < 2) {
      this.currentStep++;
    }
  }

  /**
   * Retrocede al paso anterior
   */
  prevStep(): void {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  /**
   * Maneja el submit del formulario de validación
   */
  onSubmit(): void {
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
          
          console.log('Respuesta validateTwoFactor (setup):', response);
          
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
            
            this.successMessage = '¡Autenticación de dos factores configurada exitosamente!';
            
            // Redirigir al dashboard después de 2 segundos
            setTimeout(() => {
              this.router.navigate([this.returnUrl]);
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
            this.errorMessage = 'Error al configurar 2FA';
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
   * Navega de regreso al login
   */
  goBack(): void {
    this.router.navigate(['/login']);
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
