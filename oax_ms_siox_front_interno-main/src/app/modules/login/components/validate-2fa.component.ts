import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzResultModule } from 'ng-zorro-antd/result';
import { TwoFactorRequest } from '../models/auth.models';
import { AuthService } from '../services/auth.service';

/**
 * Componente para validar código 2FA
 * Se muestra después del login cuando el usuario ya tiene 2FA configurado
 */
@Component({
  selector: 'app-validate-2fa',
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
    NzResultModule
  ],
  templateUrl: './validate-2fa.component.html',
  styleUrls: ['./validate-2fa.component.scss']
})
export class Validate2faComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  validateForm!: FormGroup;
  loading = false;
  errorMessage = '';
  correo = '';
  returnUrl: string = '/';

  ngOnInit(): void {
    // Obtener la URL de retorno si existe
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    // Obtener el correo del state de navegación
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state || history.state;
    
    this.correo = state['correo'];

    // Si no hay correo, redirigir al login
    if (!this.correo) {
      this.router.navigate(['/login']);
      return;
    }

    // Inicializar formulario
    this.validateForm = this.fb.group({
      codigo2FA: ['', [
        Validators.required,
        Validators.pattern(/^\d{6}$/), // 6 dígitos
        Validators.minLength(6),
        Validators.maxLength(6)
      ]]
    });
  }

  /**
   * Maneja el submit del formulario de validación 2FA
   */
  onSubmit(): void {
    if (this.validateForm.valid) {
      this.loading = true;
      this.errorMessage = '';

      const request: TwoFactorRequest = {
        correo: this.correo,
        codigo2FA: this.validateForm.value.codigo2FA
      };

      this.authService.validateTwoFactor(request).subscribe({
        next: (response) => {
          this.loading = false;
          
          console.log('Respuesta validateTwoFactor:', response);
          
          // Verificar si la autenticación fue exitosa
          // El backend considera exitosa la autenticación si:
          // 1. No hay error en el mensaje
          // 2. El mensaje incluye "exitosa" o "éxito"
          // 3. Tiene userId o correo (datos del usuario autenticado)
          const isSuccess = response.success !== false && 
                           !response.mensaje?.toLowerCase().includes('error') &&
                           !response.mensaje?.toLowerCase().includes('inválido') &&
                           !response.mensaje?.toLowerCase().includes('incorrecto') &&
                           (response.mensaje?.toLowerCase().includes('exitosa') || 
                            response.mensaje?.toLowerCase().includes('éxito') ||
                            response.userId !== undefined ||
                            response.token !== undefined);
          
          if (isSuccess) {
            // Login exitoso - guardar datos del usuario si existen
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
            
            console.log('Validación 2FA exitosa, redirigiendo a:', this.returnUrl);
            this.router.navigate([this.returnUrl]);
          } else {
            this.errorMessage = response.mensaje || response.message || 'Código 2FA inválido';
            this.validateForm.patchValue({ codigo2FA: '' });
          }
        },
        error: (error) => {
          this.loading = false;
          console.error('Error al validar 2FA:', error);
          
          if (error.error?.message) {
            this.errorMessage = error.error.message;
          } else if (error.status === 401) {
            this.errorMessage = 'Código 2FA inválido o expirado';
          } else if (error.status === 0) {
            this.errorMessage = 'No se pudo conectar con el servidor';
          } else {
            this.errorMessage = 'Error al validar el código 2FA';
          }
          
          this.validateForm.patchValue({ codigo2FA: '' });
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
    this.validateForm.patchValue({ codigo2FA: input.value });
  }
}
