

import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { CatalogoConacService } from '../../services/catalogo-conac.service';
import { CargaMasivaCriService } from '../../services/catalogo.cri.service';
import { ConfirmationService } from '../../shared/confirmation-modal/confirmation.service';

@Component({
  selector: 'app-modal-edicion-clasificador',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NzModalModule, NzInputModule, NzGridModule, NzFormModule],
  templateUrl: './modal-edicion-clasificador.component.html',
  styleUrls: ['./modal-edicion-clasificador.component.scss']
})
export class ModalEdicionClasificadorComponent implements OnInit {

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.isConcepto && this.form) {
        const finCtrl = this.form.get('finVigencia');
        const inicioCtrl = this.form.get('inicioVigencia');
        if (finCtrl && inicioCtrl) {
          finCtrl.valueChanges.subscribe(() => {
            inicioCtrl.markAsTouched();
            inicioCtrl.updateValueAndValidity();
          });
        }
      }
    });
  }
      // Validador cruzado para fechas
      fechasVigenciaValidator: ValidatorFn = (group: AbstractControl) => {
        const inicio = group.get('inicioVigencia')?.value;
        const fin = group.get('finVigencia')?.value;
        if (!inicio || !fin) return null;
        const inicioDate = new Date(inicio);
        const finDate = new Date(fin);
        let errors: any = null;
        if (inicioDate > finDate) {
          errors = { ...(errors || {}), inicioMayorFin: true };
          group.get('inicioVigencia')?.setErrors({ ...(group.get('inicioVigencia')?.errors || {}), inicioMayorFin: true });
          group.get('finVigencia')?.setErrors({ ...(group.get('finVigencia')?.errors || {}), finMenorIgualInicio: true });
        } else {
          // Limpiar errores si ya no aplica
          if (group.get('inicioVigencia')?.hasError('inicioMayorFin')) {
            const { inicioMayorFin, ...rest } = group.get('inicioVigencia')?.errors || {};
            group.get('inicioVigencia')?.setErrors(Object.keys(rest).length ? rest : null);
          }
          if (group.get('finVigencia')?.hasError('finMenorIgualInicio')) {
            const { finMenorIgualInicio, ...rest } = group.get('finVigencia')?.errors || {};
            group.get('finVigencia')?.setErrors(Object.keys(rest).length ? rest : null);
          }
        }
        return errors;
      };
    // Validador personalizado para fecha de inicio >= hoy
    fechaInicioMayorIgualHoyValidator: ValidatorFn = (control: AbstractControl) => {
      if (!control.value) return null;
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      const inicio = new Date(control.value);
      inicio.setHours(0, 0, 0, 0);
      return inicio >= hoy ? null : { inicioMenorActual: true };
    };
  @Input() registro: any;
  @Input() origen: string = '';
  @Output() guardar = new EventEmitter<any>();
  @Output() cancelar = new EventEmitter<void>();
  visible = true;
  isConcepto: boolean = false;
  isRubroTipoClase: boolean = false;
  datosListos: boolean = false;
  form!: FormGroup;
  alertType: 'error' | 'info' | 'success' | 'warning' = 'error';
  alertIcon: string = 'close-circle';
  alertDescription: string = '';
  alertDownloadUrl: string | null = null;
   
  constructor(
    public cdr: ChangeDetectorRef, 
    private fb: FormBuilder, 
    private CriService: CargaMasivaCriService,
    private ConacService: CatalogoConacService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {}
  // Función genérica para actualizar según el tipo
  actualizarRegistro(): void {
    let funcionServicio: string = '';
    let args: any[] = [];
    
    // Determinar si es CRI o CONAC
    const esCRI = ['RUBRO', 'TIPO', 'CLASE', 'CONCEPTO'].includes(this.origen?.toUpperCase());
    const esCONAC = ['GENERO', 'GRUPO', 'RUBRO_CONAC', 'CUENTA', 'SUBCUENTA'].includes(this.origen?.toUpperCase());
    
    if (esCRI) {
      // Lógica existente para CRI
      switch (this.origen?.toUpperCase()) {
        case 'RUBRO':
          funcionServicio = 'updateCatRubroCri';
          args = [
            this.registro?.id,
            this.form.value.nombre,
            this.form.value.descripcion,
          ];
 
          break;
        case 'TIPO':
          funcionServicio = 'actualizarTipo';
          args = [
            this.registro?.id,
            this.form.value.nombre,
            this.form.value.descripcion,
          ];
     
          break;
        case 'CLASE':
          funcionServicio = 'actualizarClase';
          args = [
            this.registro?.id,
            this.form.value.nombre,
            this.form.value.descripcion,
          ];
        
          break;
        case 'CONCEPTO':
          funcionServicio = 'actualizarConcepto';
          args = [
            this.registro?.id,
            this.form.value.nombre,
            this.form.value.descripcion,
            this.registro?.fk,
            this.form.value.inicioVigencia,
            this.form.value.finVigencia
          ];
           
          break;
      }
      
      if (funcionServicio && typeof (this.CriService as any)[funcionServicio] === 'function') {
        (this.CriService as any)[funcionServicio](...args).subscribe({
          next: (resp: any) => {
            this.guardar.emit({
              status: 'success',
              message: 'Registro actualizado correctamente.',
              data: resp
            });
            this.visible = false;
          },
          error: (err: any) => {
            this.guardar.emit({
              status: 'error',
              message: 'Ocurrió un error al actualizar el registro.',
              error: err
            })
            this.visible = false;
          }
        });
      }
    } else if (esCONAC) {
      // Lógica para CONAC
      switch (this.origen?.toUpperCase()) {
        case 'GENERO':
          funcionServicio = 'updateGenero';
          args = [
            this.registro?.idGenero,
            this.form.value.descripcion
          ];
        
          break;
        case 'GRUPO':
          funcionServicio = 'updateGrupo';
          args = [
            this.registro?.idGrupo,
            this.form.value.descripcion
          ];
         
          break;
        case 'RUBRO_CONAC':
          funcionServicio = 'updateRubro';
          args = [
            this.registro?.idRubro,
            this.form.value.descripcion
          ];
      
          break;
        case 'CUENTA':
          funcionServicio = 'updateCuenta';
          args = [
            this.registro?.idCuenta,
            this.form.value.descripcion
          ];
        
          break;
        case 'SUBCUENTA':
          funcionServicio = 'updateSubcuenta';
          args = [
            this.registro?.idSubcuenta,
            this.form.value.descripcion
          ];
       
          break;
      }
      
      if (funcionServicio && typeof (this.ConacService as any)[funcionServicio] === 'function') {
        (this.ConacService as any)[funcionServicio](...args).subscribe({
          next: (resp: any) => {
            this.guardar.emit({
              status: 'success',
              message: 'Registro actualizado correctamente.',
              data: resp
            });
            this.visible = false;
          },
          error: (err: any) => {
            this.guardar.emit({
              status: 'error',
              message: 'Ocurrió un error al actualizar el registro.',
              error: err
            });
            this.visible = false;
          }
        });
      }
    }
  }

  ngOnInit(): void {
    // Si el origen es SUBCUENTA, redirigir al componente nuevo-conac con los datos


    this.isConcepto = this.origen?.toUpperCase() === 'CONCEPTO';
    this.isRubroTipoClase = ['RUBRO', 'TIPO', 'CLASE'].includes(this.origen?.toUpperCase());
    const esConac = ['GENERO', 'GRUPO', 'RUBRO_CONAC', 'CUENTA', 'SUBCUENTA'].includes(this.origen?.toUpperCase());
   
    this.datosListos = !!this.registro && (this.isConcepto || this.isRubroTipoClase || esConac);
    console.log('Registro recibido en modal:', this.registro);
    
    // Para CONAC, el campo es descripcion en lugar de nombre
    const esEdicionConac = esConac;
    
    this.form = this.fb.group({
      nombre: [
        this.registro?.nombre || '', 
        esEdicionConac ? [] : [Validators.required, Validators.minLength(5), Validators.maxLength(250)]
      ],
      descripcion: [
        this.registro?.descripcion || '', 
        [Validators.required, Validators.minLength(5), Validators.maxLength(250)]
      ],
      inicioVigencia: [
        this.formatDate(this.registro?.inicioVigencia),
        [Validators.required, this.fechaInicioMayorIgualHoyValidator]
      ],
      finVigencia: [
        this.formatDate(this.registro?.finVigencia),
        this.isConcepto ? [Validators.required] : []
      ]
    }, { validators: this.fechasVigenciaValidator });
    this.cdr.detectChanges();
  }

  get tituloModal(): string {
    switch (this.origen?.toUpperCase()) {
      case 'RUBRO': return 'Editar registro de Rubro';
      case 'TIPO': return 'Editar registro de Tipo';
      case 'CLASE': return 'Editar registro de Clase';
      case 'CONCEPTO': return 'Editar registro de Concepto';
      case 'GENERO': return 'Editar registro de Género';
      case 'GRUPO': return 'Editar registro de Grupo';
      case 'RUBRO_CONAC': return 'Editar registro de Rubro';
      case 'CUENTA': return 'Editar registro de Cuenta';
      case 'SUBCUENTA': return 'Editar registro de Subcuenta';
      default: return 'Editar clasificador';
    }
  }

    get tagTipo(): string {
    switch (this.origen?.toUpperCase()) {
      case 'RUBRO': return ' de Rubro';
      case 'TIPO': return ' de Tipo';
      case 'CLASE': return ' de Clase';
      case 'CONCEPTO': return ' de Concepto';
      case 'GENERO': return ' de Género';
      case 'GRUPO': return ' de Grupo';
      case 'RUBRO_CONAC': return ' de Rubro';
      case 'CUENTA': return ' de Cuenta';
      case 'SUBCUENTA': return ' de Subcuenta';
      default: return '';
    }
  }

    formatDate(date: Date | string): string {
  if (!date) return '';
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${year}-${month}-${day}`;
  }

  onGuardar(): void {
    // Marcar todos los campos como touched y actualizar validez
    Object.values(this.form.controls).forEach(control => {
      control.markAsTouched();
      control.updateValueAndValidity();
    });
    if (!this.form.valid) return;

    // Si es concepto y cambió alguna fecha de vigencia, mostrar confirmación
    if (this.isConcepto && (this.form.get('inicioVigencia')?.dirty || this.form.get('finVigencia')?.dirty)) {
      this.confirmationService.confirm({
        title: 'CONFIRMACIÓN',
        message: 'AL GUARDAR LA FECHA DE VIGENCIA, SE ACTUALIZARÁN AUTOMÁTICAMENTE LOS REGISTROS ASOCIADOS AL CONCEPTO.\n¿DESEA CONTINUAR?',
        type: 'warning',
        confirmText: 'SÍ, CONTINUAR',
        cancelText: 'NO',
        width: '520px'
      }).subscribe(result => {
        if (result.confirmed) {
          this.actualizarRegistro();
        }
      });
    } else {
      this.actualizarRegistro();
    }
  }

  onCancel(): void {
    this.confirmationService.confirm({
      title: 'CANCELACIÓN',
      message: 'SE PERDERÁN TODOS LOS DATOS INGRESADOS. ¿DESEA CANCELAR LA OPERACIÓN?',
      type: 'warning',
      confirmText: 'SÍ, CANCELAR',
      cancelText: 'NO',
      width: '520px'
    }).subscribe(result => {
      if (result.confirmed) {
        this.visible = false;
        this.form.reset();
        this.cancelar.emit();
      }
    });
  }
}
