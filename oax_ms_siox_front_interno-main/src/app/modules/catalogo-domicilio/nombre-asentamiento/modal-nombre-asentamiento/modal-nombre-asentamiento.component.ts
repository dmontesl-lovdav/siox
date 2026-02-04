import { CommonModule, NgIf } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { CatDomicilioService } from '../../../../services/cat-pais.service';
import { ConfirmationService } from '../../../../shared/confirmation-modal';

interface IModalData {
  modo: 'crear' | 'editar' | 'consultar';
  genero: any | null;
  confirmationService: ConfirmationService;
}


@Component({
  selector: 'app-modal-nombre-asentamiento',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzIconModule,
    NzSelectModule,
    NgIf
  ],
  templateUrl: './modal-nombre-asentamiento.component.html',
  styleUrls: ['./modal-nombre-asentamiento.component.scss']
})

export class ModalNombreAsentamientoComponent implements OnInit {
  readonly nzModalData: IModalData = inject(NZ_MODAL_DATA);
  
  form: FormGroup;
  modo: 'crear' | 'editar' | 'consultar' = 'crear';
  loading = false;
  confirmationService: ConfirmationService;
  
  // Mensajes de error personalizados
  errorMessages: { [key: string]: string } = {};


tiposAsentamiento: Array<{ label: string; value: string; id: number }> = [];
totalTipos = 0;
pageTipo = 1;
pageSizeTipo = 10;
loadingTipos = false;
busquedaTipo = '';
hasMoreTipos = true;

  constructor(
    private fb: FormBuilder,
    private modal: NzModalRef,
    private catDomicilioService: CatDomicilioService
  ) {
    this.confirmationService = this.nzModalData.confirmationService;
    this.form = this.fb.group({
      descripcionTipo: [null, [Validators.required]],
      clave: ['', [Validators.required, Validators.maxLength(4), Validators.pattern(/^[A-Za-z]+$/)]],
      descripcion: ['', [Validators.required, Validators.maxLength(100)]]
    });
  }

  ngOnInit(): void {
    this.modo = this.nzModalData.modo;
    this.cargarTiposAsentamiento();
    // Si es editar o consultar, cargar datos
    if (this.nzModalData.genero && (this.modo === 'editar' || this.modo === 'consultar')) {
      const tipo = this.nzModalData.genero.descripcionTipo ?? null;
      this.form.patchValue({
        descripcionTipo: tipo,
        clave: this.nzModalData.genero.clave,
        descripcion: this.nzModalData.genero.descripcion
      });
      // Si el tipo no está en la primera página, buscarlo y agregarlo
      if (tipo && !this.tiposAsentamiento.find(t => t.value === tipo)) {
        this.buscarTipoPorValor(tipo);
      }
      if (this.modo === 'consultar') this.form.disable();
    }
  }

  cargarTiposAsentamiento(reset: boolean = true, busqueda: string = ''): void {
    if (reset) {
      this.pageTipo = 1;
      this.tiposAsentamiento = [];
      this.hasMoreTipos = true;
    }
    if (!this.hasMoreTipos) return;
    this.loadingTipos = true;
    this.catDomicilioService.consultarTipoAsentamiento({
      page: this.pageTipo,
      pageSize: this.pageSizeTipo,
      busqueda: busqueda || this.busquedaTipo
    }).subscribe({
      next: (resp: any) => {
        const datos = resp?.datos || [];
        this.totalTipos = resp?.total || 0;
        // Guardar el id real para cada tipo
        this.tiposAsentamiento = reset
          ? datos.map((d: any) => ({ label: d.descripcion, value: d.descripcion, id: d.id }))
          : [...this.tiposAsentamiento, ...datos.map((d: any) => ({ label: d.descripcion, value: d.descripcion, id: d.id }))];
        this.hasMoreTipos = this.tiposAsentamiento.length < this.totalTipos;
        this.loadingTipos = false;
      },
      error: () => {
        this.loadingTipos = false;
      }
    });
  }

  onScrollToEndTipo(): void {
    if (this.loadingTipos || !this.hasMoreTipos) return;
    this.pageTipo++;
    this.cargarTiposAsentamiento(false);
  }

  onSearchTipo(value: string): void {
    this.busquedaTipo = value;
    this.cargarTiposAsentamiento(true, value);
  }

  buscarTipoPorValor(valor: string): void {
    // Busca el tipo por valor y lo agrega si no está
    this.catDomicilioService.consultarTipoAsentamiento({ page: 1, pageSize: 1, busqueda: valor }).subscribe({
      next: (resp: any) => {
        const datos = resp?.datos || [];
        if (datos.length > 0 && !this.tiposAsentamiento.find(t => t.value === valor)) {
          this.tiposAsentamiento = [{ label: datos[0].descripcion, value: datos[0].descripcion, id: datos[0].id }, ...this.tiposAsentamiento];
        }
      }
    });
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

    // El idTipoAsentamiento debe obtenerse del tipo seleccionado (en este caso, value = descripcion)
    const nombreAsentamientoData: { idTipoAsentamiento?: number; clave?: string; descripcion?: string } = {
      clave: this.form.get('clave')?.value.toUpperCase(),
      descripcion: this.form.get('descripcion')?.value.toUpperCase(),
    };
    // Buscar el idTipoAsentamiento si está disponible en el objeto tiposAsentamiento
    const tipoSeleccionado = this.tiposAsentamiento.find(t => t.value === this.form.get('descripcionTipo')?.value);
    if (tipoSeleccionado && (tipoSeleccionado as any).id) {
      nombreAsentamientoData.idTipoAsentamiento = (tipoSeleccionado as any).id;
    }

    let observable;
    if (this.modo === 'editar' && this.nzModalData.genero && this.nzModalData.genero.id) {
      observable = this.catDomicilioService.actualizarNombreAsentamiento(this.nzModalData.genero.id, nombreAsentamientoData);
    } else {
      observable = this.catDomicilioService.crearNombreAsentamiento(nombreAsentamientoData);
    }

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
          this.errorMessages['general'] = response.mensaje || response.error || 'No se pudo completar la operación';
        }
      },
      error: (error: any) => {
        this.loading = false;
        (window as any).hideGlobalSpinner?.();
        console.error('Error al guardar/actualizar nombre de asentamiento:', error);
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
