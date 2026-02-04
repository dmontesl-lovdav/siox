import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { ConfirmationService } from '../../../../../shared/confirmation-modal';
import { CatGeneroService } from '../../../../../services/cat-genero.service';
import { CatGeneroUpdateDTO } from '../../../../../models/cat-genero.model';


interface IModalData {
  modo: 'crear' | 'editar' | 'consultar';
  genero: any | null;
  confirmationService: ConfirmationService;
}

@Component({
  selector: 'app-modal-genero',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzIconModule
  ],
  templateUrl: './modal-contable.component.html',
  styleUrls: ['./modal-contable.component.scss']
})
export class ModalGeneroComponent implements OnInit {
  readonly nzModalData: IModalData = inject(NZ_MODAL_DATA);
  
  form: FormGroup;
  modo: 'crear' | 'editar' | 'consultar' = 'crear';
  loading = false;
  confirmationService: ConfirmationService;
  
  // Mensajes de error personalizados
  errorMessages: { [key: string]: string } = {};

  constructor(
    private fb: FormBuilder,
    private modal: NzModalRef,
    private catGeneroService: CatGeneroService
  ) {
    this.confirmationService = this.nzModalData.confirmationService;
    this.form = this.fb.group({
      clave: ['', [
        Validators.required,
        Validators.maxLength(4),
        Validators.pattern(/^[A-Za-z]+$/)
      ]],
      descripcion: ['', [
        Validators.required,
        Validators.maxLength(100)
      ]]
    });
  }

  ngOnInit(): void {
    this.modo = this.nzModalData.modo;
    
    // Si es editar o consultar, cargar datos
    if (this.nzModalData.genero && (this.modo === 'editar' || this.modo === 'consultar')) {
      this.form.patchValue({
        clave: this.nzModalData.genero.clave,
        descripcion: this.nzModalData.genero.descripcion
      });
      
      // Si es consultar, deshabilitar campos
      if (this.modo === 'consultar') {
        this.form.disable();
      }
    }
  }

  // Validar solo caracteres alfanuméricos y guión para la clave
  validarClave(event: KeyboardEvent): void {
    const regex = /^[A-Za-z0-9-]$/;
    if (!regex.test(event.key) && event.key !== 'Backspace' && event.key !== 'Tab') {
      event.preventDefault();
    }
  }

  // Limitar caracteres en el input
  limitarCaracteres(event: any, maxLength: number): void {
    const value = event.target.value;
    if (value.length > maxLength) {
      event.target.value = value.slice(0, maxLength);
      this.form.patchValue({
        [event.target.getAttribute('formControlName')]: value.slice(0, maxLength)
      });
    }
  }

  // Validar campo
  isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  // Obtener mensaje de error
  getErrorMessage(fieldName: string): string {
    const field = this.form.get(fieldName);
    
    if (field?.errors?.['required']) {
      return 'ESTE CAMPO ES OBLIGATORIO';
    }
    
    if (field?.errors?.['maxlength']) {
      const maxLength = field.errors['maxlength'].requiredLength;
      return `ESTE CAMPO DEBE CONTENER COMO MÁXIMO ${maxLength} CARACTERES`;
    }
    
    if (field?.errors?.['pattern']) {
      if (fieldName === 'clave') {
        return 'ESTE CAMPO DEBE CONTENER COMO MÁXIMO 4 CARACTERES ALFANUMÉRICOS (A-Z, ESPACIOS, ACENTOS Y CARACTERES ESPECIALES)';
      }
    }
    
    return '';
  }

  // Guardar
  guardar(): void {
    // Marcar todos los campos como tocados para mostrar errores
    Object.values(this.form.controls).forEach(control => {
      control.markAsTouched();
    });

    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    (window as any).showGlobalSpinner?.();

    const generoData: CatGeneroUpdateDTO = {
      clave: this.form.get('clave')?.value.toUpperCase(),
      descripcion: this.form.get('descripcion')?.value.toUpperCase()
    };

    const observable = this.modo === 'editar' && this.nzModalData.genero
      ? this.catGeneroService.update(this.nzModalData.genero.id, generoData)
      : this.catGeneroService.create(generoData);

    observable.subscribe({
      next: (response: any) => {
        this.loading = false;
        (window as any).hideGlobalSpinner?.();
        
        const esExitoso = response.exito === true || response.exito === undefined || response.exito === null;
        
        if (esExitoso && !response.error) {
          this.modal.close({
            success: true,
            message: response.mensaje || (this.modo === 'editar' ? 'Registro actualizado de forma correcta' : 'Registro creado de forma correcta')
          });
        } else {
          // Mostrar error en el formulario
          this.errorMessages['general'] = response.mensaje || response.error || 'No se pudo completar la operación';
        }
      },
      error: (error: any) => {
        this.loading = false;
        (window as any).hideGlobalSpinner?.();
        
        console.error('Error al guardar/actualizar género:', error);
        this.errorMessages['general'] = error.error?.error || error.message || 'No se pudo completar la operación';
      }
    });
  }

  // Cancelar
  cancelar(): void {
    console.log('Cancelar llamado');
    console.log('Modo:', this.modo);
    console.log('Form dirty:', this.form.dirty);
    console.log('ConfirmationService:', this.confirmationService);
    
    // Mostrar confirmación si es modo crear o editar
    if (this.modo === 'crear' || this.modo === 'editar') {
      console.log('Mostrando confirmación...');
      this.confirmationService.confirm({
        title: 'CANCELACIÓN',
        message: 'SE PERDERÁN TODOS LOS DATOS INGRESADOS. ¿DESEA CANCELAR LA OPERACIÓN?',
        type: 'warning',
        confirmText: 'SÍ, CANCELAR',
        cancelText: 'NO',
        width: '520px'
      }).subscribe(result => {
        console.log('Resultado de confirmación:', result);
        if (result.confirmed) {
          this.modal.close(null);
        }
      });
    } else {
      // Si es modo consultar, cerrar directamente
      console.log('Cerrando directamente sin confirmación');
      this.modal.close(null);
    }
  }
}
