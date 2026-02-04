import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';

  import { CatalogoMunicipios } from '../../../../models/catalogo-municipios.model';
import { CatDomicilioService } from '../../../../services/cat-pais.service';
import { ConfirmationService } from '../../../../shared/confirmation-modal';

import { CatLocalidadUpdateDTO } from '../../../../models/cat-localidad.model';
import { CatGeneroService } from '../../../../services/cat-genero.service';
interface IModalData {
  modo: 'crear' | 'editar' | 'consultar';
  genero: any | null;
  confirmationService: ConfirmationService;
  localidad?: any | null;
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
    NzIconModule,
    NzSelectModule
  ],
  templateUrl: './modal-localidad.component.html',
  styleUrls: ['./modal-localidad.component.scss']
})
export class ModalLocalidadComponent implements OnInit {
  claveExistente: boolean = false;
  claveCheckLoading: boolean = false;
  readonly nzModalData: IModalData = inject(NZ_MODAL_DATA);

  form: FormGroup;
  municipios: CatalogoMunicipios[] = [];
  municipiosPage = 1;
  municipiosTotal = 0;
  municipiosSearch = '';
  loadingMunicipios = false;
  modo: 'crear' | 'editar' | 'consultar' = 'crear';
  loading = false;
  confirmationService: ConfirmationService;
  idLocalidad: number | null = null; // Guardar el id del registro

  // Mensajes de error personalizados
  errorMessages: { [key: string]: string } = {};

  constructor(
    private fb: FormBuilder,
    private modal: NzModalRef,
    private catGeneroService: CatGeneroService,
    private catDomicilioService: CatDomicilioService
  ) {
    this.confirmationService = this.nzModalData.confirmationService;
    this.form = this.fb.group({
      clave: ['', [
        Validators.required,
        Validators.maxLength(6),
        Validators.pattern(/^[0-9]{1,6}$/)
      ]],
      descripcion: ['', [
        Validators.required,
        Validators.maxLength(100)
      ]],
      municipio: [null, [Validators.required]]
    });
  }

  ngOnInit(): void {
    // Validación asíncrona de clave
    this.form.get('clave')?.valueChanges.subscribe((valor: string) => {
      this.claveExistente = false;
      if (valor && valor.length > 0 && /^[0-9]{1,6}$/.test(valor)) {
        this.claveCheckLoading = true;
        this.catDomicilioService.existeClaveLocalidad(Number(valor)).subscribe({
          next: (existe: boolean) => {
            this.claveExistente = existe;
            this.claveCheckLoading = false;
          },
          error: () => {
            this.claveExistente = false;
            this.claveCheckLoading = false;
          }
        });
      }
    });
    this.modo = this.nzModalData.modo;
    // Guardar el id para uso posterior
    if (this.nzModalData.genero && (this.modo === 'editar' || this.modo === 'consultar')) {
      this.idLocalidad = this.nzModalData.genero.id || null;
    }
    // Cargar municipios y luego asignar el municipio seleccionado si aplica
    this.loadMunicipios(false, '', async () => {
      if (this.nzModalData.genero && (this.modo === 'editar' || this.modo === 'consultar')) {
        const claveMunicipio = this.nzModalData.genero.claveMunicipio || this.nzModalData.genero.municipio || this.nzModalData.genero.municipioId;
        let municipioObj = null;
        if (this.municipios && this.municipios.length > 0) {
          municipioObj = this.municipios.find(m => m.claveMunicipio == claveMunicipio || m.municipio === claveMunicipio);
        }
        // Si no se encuentra, buscarlo en el backend y agregarlo temporalmente
        if (!municipioObj && claveMunicipio) {
          try {
            const resp = await this.catDomicilioService.consultaMunicipio({
              page: 1,
              pageSize: 1,
              claveMunicipio: claveMunicipio,
              distrito: ''
            }).toPromise();
            const datos = resp?.datos || [];
            if (datos.length > 0) {
              municipioObj = datos[0];
              this.municipios = [municipioObj, ...this.municipios];
            } else {
              municipioObj = {
                claveMunicipio: claveMunicipio,
                municipio: this.nzModalData.genero.municipio || this.nzModalData.genero.nombreMunicipio || '',
                fechaAlta: '', distrito: ''
              };
              this.municipios = [municipioObj, ...this.municipios];
            }
          } catch {
            municipioObj = {
              claveMunicipio: claveMunicipio,
              municipio: this.nzModalData.genero.municipio || this.nzModalData.genero.nombreMunicipio || '',
              fechaAlta: '', distrito: ''
            };
            this.municipios = [municipioObj, ...this.municipios];
          }
        }
        this.form.patchValue({
          clave: this.nzModalData.genero.claveLocalidad || this.nzModalData.genero.clave,
          descripcion: this.nzModalData.genero.descripcionLocalidad || this.nzModalData.genero.descripcion,
          municipio: municipioObj || null
        });
        if (this.modo === 'consultar') {
          this.form.disable();
        }
      }
    });
  }

  loadMunicipios(reset: boolean = false, search: string = '', callback?: () => void): void {
    if (reset) {
      this.municipios = [];
      this.municipiosPage = 1;
      this.municipiosTotal = 0;
    }
    this.loadingMunicipios = true;
    this.catDomicilioService.consultaMunicipio({
      page: this.municipiosPage,
      pageSize: 10,
      municipio: search || undefined,
      distrito: '' // valor por defecto requerido por la interfaz
    }).subscribe({
      next: (resp: any) => {
        const datos = resp.datos || [];
        this.municipios = reset ? datos : [...this.municipios, ...datos];
        this.municipiosTotal = resp.total || this.municipios.length;
        this.loadingMunicipios = false;
        if (callback) callback();
      },
      error: () => {
        this.loadingMunicipios = false;
        if (callback) callback();
      }
    });
  }

  onScrollMunicipios(): void {
    if (this.municipios.length < this.municipiosTotal) {
      this.municipiosPage++;
      this.loadMunicipios();
    }
  }

  onSearchMunicipio(event: Event): void {
    const value = (event.target as HTMLInputElement)?.value || '';
    this.municipiosSearch = value;
    this.municipiosPage = 1;
    this.loadMunicipios(true, value);
  }

  compareMunicipio = (o1: CatalogoMunicipios, o2: CatalogoMunicipios) => o1 && o2 && o1.claveMunicipio === o2.claveMunicipio;

  // (Eliminada implementación duplicada de ngOnInit)

  // Validar solo caracteres alfanuméricos y guión para la clave
  validarClave(event: KeyboardEvent): void {
    const regex = /^[0-9]$/;
    // Permitir teclas de control (flechas, borrar, tab, etc.)
    if (
      !regex.test(event.key) &&
      event.key !== 'Backspace' &&
      event.key !== 'Tab' &&
      event.key !== 'ArrowLeft' &&
      event.key !== 'ArrowRight' &&
      event.key !== 'Delete' &&
      !(event.ctrlKey || event.metaKey)
    ) {
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

    const localidadData: CatLocalidadUpdateDTO = {
      municipio: this.form.get('municipio')?.value?.claveMunicipio,
      claveLocalidad: this.form.get('clave')?.value?.toUpperCase(),
      descripcionLocalidad: this.form.get('descripcion')?.value?.toUpperCase()
    };

    const observable = this.modo === 'editar' && this.idLocalidad
      ? this.catDomicilioService.actualizarLocalidad(this.idLocalidad, localidadData)
      : this.catDomicilioService.crearLocalidad(localidadData);
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
        console.error('Error al guardar/actualizar localidad:', error);
        // Si el backend envía un objeto con mensaje, mostrarlo
        if (error.error && error.error.mensaje) {
          this.errorMessages['general'] = error.error.mensaje;
        } else if (error.error && error.error.error) {
          this.errorMessages['general'] = error.error.error;
        } else {
          this.errorMessages['general'] = error.message || 'No se pudo completar la operación';
        }
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
