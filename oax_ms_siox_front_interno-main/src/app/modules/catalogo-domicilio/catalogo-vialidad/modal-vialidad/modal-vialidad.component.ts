import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { ConfirmationService } from '../../../../shared/confirmation-modal';
import { CatDomicilioService } from '../../../../services/cat-pais.service';

interface IModalData {
  modo: 'crear' | 'editar' | 'consultar';
  vialidad: any | null;
  confirmationService: ConfirmationService;
}

@Component({
  selector: 'app-modal-vialidad',
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
  templateUrl: './modal-vialidad.component.html',
  styleUrls: ['./modal-vialidad.component.scss']
})
export class ModalVialidadComponent implements OnInit {
  readonly nzModalData: IModalData = inject(NZ_MODAL_DATA);

  form: FormGroup;
  modo: 'crear' | 'editar' | 'consultar' = 'crear';
  loading = false;
  confirmationService: ConfirmationService;

  errorMessages: { [key: string]: string } = {};

  constructor(
 private fb: FormBuilder,
  private modal: NzModalRef,
  private catDomicilioService: CatDomicilioService
  ) {
    this.confirmationService = this.nzModalData.confirmationService;

    this.form = this.fb.group({
      // ⚠️ Si en Vialidad NO usas clave, quítala del form o hazla opcional
     // clave: ['', [Validators.required, Validators.maxLength(4), Validators.pattern(/^[A-Za-z]+$/)]],
      descripcion: ['', [Validators.required, Validators.maxLength(100)]]
    });
  }

ngOnInit(): void {
  this.modo = this.nzModalData.modo;

  const v = this.nzModalData.vialidad;

  if (v && (this.modo === 'editar' || this.modo === 'consultar')) {
    this.form.patchValue({
      descripcion: v.descripcion
    });

    if (this.modo === 'consultar') {
      this.form.disable();
    }
  }
}

  limitarCaracteres(event: any, maxLength: number): void {
    const value = event.target.value;
    if (value.length > maxLength) {
      event.target.value = value.slice(0, maxLength);
      this.form.patchValue({
        [event.target.getAttribute('formControlName')]: value.slice(0, maxLength)
      });
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getErrorMessage(fieldName: string): string {
    const field = this.form.get(fieldName);

    if (field?.errors?.['required']) {
      return 'ESTE CAMPO ES OBLIGATORIO';
    }

    if (field?.errors?.['maxlength']) {
      const maxLength = field.errors['maxlength'].requiredLength;
      return `ESTE CAMPO DEBE CONTENER COMO MÁXIMO ${maxLength} CARACTERES`;
    }

    // Ejemplo duplicado si lo usas:
    if (field?.errors?.['duplicate']) {
      return 'LA DESCRIPCIÓN INGRESADA YA EXISTE.';
    }

    return '';
  }

guardar(): void {
  Object.values(this.form.controls).forEach(control => control.markAsTouched());
  if (this.form.invalid) return;

  this.loading = true;
  (window as any).showGlobalSpinner?.();

  const descripcion = (this.form.get('descripcion')?.value || '')
    .toString()
    .trim()
    .toUpperCase();

  // ✅ backend recibe Map<String,String>
  const body = { descripcion };

  const v = this.nzModalData.vialidad;

  const observable =
    (this.modo === 'editar' && v?.id != null)
      ? this.catDomicilioService.actualizarDetalleVialidad(Number(v.id), body)
      : this.catDomicilioService.guardarVialidad(body);

  observable.subscribe({
next: (response: any) => {
  this.loading = false;
  (window as any).hideGlobalSpinner?.();

  console.log('RESPUESTA BACKEND VIALIDAD:', response);

  const ok = response?.exitoso === true || response?.exito === true;

  const hayErrorBackend =
    response?.error ||
    response?.errores ||
    (typeof response?.mensaje === 'string' && /error|sql|exception/i.test(response.mensaje));

  if (ok && !hayErrorBackend) {
    this.modal.close({
      success: true,
      message:
        response?.mensaje ||
        (this.modo === 'editar'
          ? 'Registro actualizado de forma correcta'
          : 'Registro creado de forma correcta')
    });
  } else {
    this.errorMessages['general'] =
      response?.mensaje || response?.error || 'No se pudo completar la operación';
  }
},

    error: (error: any) => {
      this.loading = false;
      (window as any).hideGlobalSpinner?.();

      this.errorMessages['general'] =
        error?.error?.mensaje ||
        error?.error?.error ||
        error?.message ||
        'No se pudo completar la operación';
    }
  });
}

cancelar(): void {
  if (this.modo === 'crear' || this.modo === 'editar') {
    this.confirmationService.confirm({
      title: 'CANCELACIÓN',
      message: 'SE PERDERÁN TODOS LOS DATOS INGRESADOS. ¿DESEA CANCELAR LA OPERACIÓN?',
      type: 'warning',
      confirmText: 'SÍ, CANCELAR',
      cancelText: 'NO',
      width: '520px'
    }).subscribe(result => {
      if (result.confirmed) this.modal.close(null);
    });
  } else {
    this.modal.close(null);
  }
}


}
