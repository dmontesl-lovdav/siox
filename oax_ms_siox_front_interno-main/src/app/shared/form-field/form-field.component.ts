import { CommonModule } from '@angular/common';
import { Component, Input, ViewEncapsulation, forwardRef } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-form-field',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NzInputModule, NzIconModule],
  templateUrl: './form-field.component.html',
  styleUrls: ['./form-field.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormFieldComponent),
      multi: true
    }
  ]
})
export class FormFieldComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() required: boolean = false;
  @Input() maxLength?: number;
  @Input() control?: AbstractControl | null;
  @Input() type: 'text' | 'number' = 'text';
  @Input() inputMode?: string;
  @Input() validationKey?: string; // Para validaciones especiales como 'clave'
  @Input() allowClear: boolean = true;
  @Input() disabled: boolean = false;
  @Input() readonly: boolean = false;

  // Diccionario de mensajes de error personalizados
  @Input() customErrors?: { [key: string]: string };

  value: string = '';
  onChange: any = () => {};
  onTouched: any = () => {};

  // Mensajes de error predeterminados
  private defaultErrorMessages: { [key: string]: string } = {
    required: 'ESTE CAMPO ES OBLIGATORIO.',
    maxlength: 'ESTE CAMPO DEBE CONTENER COMO MÁXIMO {maxLength} CARACTERES.',
    minlength: 'ESTE CAMPO DEBE CONTENER MÍNIMO {minLength} CARACTERES.',
    pattern: 'CARACTERES PERMITIDOS (A-Z).',
    claveExiste: 'LA CLAVE YA EXISTE.',
    email: 'EL CORREO ELECTRÓNICO NO ES VÁLIDO.',
    min: 'EL VALOR DEBE SER MAYOR O IGUAL A {min}.',
    max: 'EL VALOR DEBE SER MENOR O IGUAL A {max}.'
  };

  writeValue(value: any): void {
    this.value = value || '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    // Aplicar limitación de caracteres
    if (this.maxLength && value.length > this.maxLength) {
      value = value.substring(0, this.maxLength);
      input.value = value;
    }

    // Aplicar validación especial para clave (solo mayúsculas y números)
    if (this.validationKey === 'clave') {
      input.value = value;
    }

    this.value = value;
    this.onChange(value);
    
    // Actualizar el FormControl si existe
    if (this.control) {
      this.control.setValue(value, { emitEvent: true });
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    // Si es clave, solo permite letras y números
    if (this.validationKey === 'clave') {
      const regex = /^[A-Za-z0-9]$/;
      const key = event.key;
      
      // Permitir teclas de control (backspace, delete, tab, etc.)
      const controlKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
      
      if (!controlKeys.includes(key) && !regex.test(key)) {
        event.preventDefault();
      }
    }
  }

  onBlur(): void {
    this.onTouched();
    if (this.control) {
      this.control.markAsTouched();
    }
  }

  clearInput(): void {
    this.value = '';
    this.onChange('');
    if (this.control) {
      this.control.setValue('');
      this.control.markAsTouched();
    }
  }

  // Verifica si el campo tiene error y debe mostrarse
  isFieldInvalid(): boolean {
    if (!this.control) return false;
    return !!(this.control.invalid && (this.control.dirty || this.control.touched));
  }

  // Obtiene el número actual de caracteres
  getCurrentLength(): number {
    return this.value?.length || 0;
  }

  // Verifica si se alcanzó el límite de caracteres
  hasReachedLimit(): boolean {
    return this.maxLength ? this.getCurrentLength() >= this.maxLength : false;
  }

  // Obtiene todos los mensajes de error para mostrar
  getErrorMessages(): string[] {
    if (!this.control || !this.control.errors || !this.isFieldInvalid()) {
      return [];
    }

    const errors: string[] = [];
    const controlErrors = this.control.errors;

    // Iterar sobre todos los errores del control
    Object.keys(controlErrors).forEach(errorKey => {
      const errorValue = controlErrors[errorKey];
      let message = '';

      // Verificar si hay un mensaje personalizado
      if (this.customErrors && this.customErrors[errorKey]) {
        message = this.customErrors[errorKey];
      } else if (this.defaultErrorMessages[errorKey]) {
        // Usar mensaje predeterminado y reemplazar placeholders
        message = this.defaultErrorMessages[errorKey];
        
        // Reemplazar placeholders dinámicos
        if (typeof errorValue === 'object') {
          Object.keys(errorValue).forEach(key => {
            message = message.replace(`{${key}}`, errorValue[key]);
          });
        }
      } else if (typeof errorValue === 'string') {
        // Si el error tiene un mensaje directo
        message = errorValue;
      } else {
        // Mensaje genérico
        message = `ERROR EN EL CAMPO: ${errorKey.toUpperCase()}`;
      }

      errors.push(message);
    });

    return errors;
  }

  // Verifica si debe mostrar el mensaje informativo de límite alcanzado
  shouldShowLimitMessage(): boolean {
    return this.hasReachedLimit() && !this.isFieldInvalid();
  }
}
