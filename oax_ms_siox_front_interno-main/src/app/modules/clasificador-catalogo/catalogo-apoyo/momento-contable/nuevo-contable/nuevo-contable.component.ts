import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NzSelectModule } from 'ng-zorro-antd/select';

import { FormularioCapturaGenericoComponent } from '../../../../../shared/formulario-captura-generico';
import { ConfirmationService } from '../../../../../shared/confirmation-modal';
import { GenericAlertComponent } from '../../../../../shared/generic-alert/generic-alert.component';

import { configContable } from './formularios-config';

@Component({
  selector: 'app-nuevo-momento-contable',
  standalone: true,
  templateUrl: './nuevo-contable.component.html',
  styleUrls: ['./nuevo-contable.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NzSelectModule,
    FormularioCapturaGenericoComponent,
    GenericAlertComponent
  ]
})
export class NuevoContableComponent {
  // ===== Alert =====
  showAlert = false;
  alertMessage = '';
  alertType: 'error' | 'info' | 'success' | 'warning' = 'error';
  alertIcon = 'close-circle';
  alertDescription = '';
  alertDownloadLink: { url: string; label: string; download?: string } | undefined;

  // ===== Form + Config =====
  form: FormGroup;
  config = configContable;

  // (si no conectamos service aún) dejamos un catálogo dummy
  tiposPoliza: any[] = [
    { id: 1, descripcion: 'DIARIO' },
    { id: 2, descripcion: 'INGRESOS' },
    { id: 3, descripcion: 'EGRESOS' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private confirmationService: ConfirmationService
  ) {
    this.form = this.fb.group({
      clave: ['', [Validators.required, Validators.maxLength(20), Validators.pattern('^[A-Z0-9]+$')]],
      momentoContable: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(250),
        Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9.\\s]+$')
      ]],
      tipoPoliza: [null, [Validators.required]]
    });

    // llenar opciones del select del config con el dummy
    this.llenarOpcionesTipoPoliza();
  }

  // ✅ alfanumérico
  soloAlfanumerico(event: KeyboardEvent) {
    const regex = /^[A-Z0-9]$/;
    const key = event.key.toUpperCase();
    if (!regex.test(key)) event.preventDefault();
  }

  onClaveInput() {
    const ctrl = this.form.get('clave');
    const value = (ctrl?.value || '').toString().toUpperCase().replace(/[^A-Z0-9]/g, '');
    ctrl?.setValue(value, { emitEvent: false });
  }

  llenarOpcionesTipoPoliza() {
    const campo = this.config.secciones[0].campos.find(c => c.formControlName === 'tipoPoliza');
    if (!campo) return;

    campo.opciones = this.tiposPoliza.map(tp => ({
      value: tp.id,
      label: tp.descripcion
    }));
  }

  onAccion(evento: any) {
    const accion = evento && evento.target ? evento.target.value : evento;

    if (accion === 'cancelar') {
      this.confirmarCancelar();
      return;
    }

    if (accion === 'guardar') {
      if (this.form.invalid) {
        this.form.markAllAsTouched();
        this.mostrarError('Por favor complete los campos obligatorios.');
        return;
      }
      this.confirmarGuardar();
    }
  }

  confirmarCancelar() {
    this.confirmationService.confirm({
      title: 'CANCELACIÓN',
      message: 'SE PERDERÁN TODOS LOS DATOS INGRESADOS. ¿DESEA CANCELAR LA OPERACIÓN?',
      type: 'warning',
      confirmText: 'SÍ, CANCELAR',
      cancelText: 'NO',
      width: '520px'
    }).subscribe(result => {
      if (result.confirmed) {
        this.form.reset();
        this.regresar();
      }
    });
  }

  confirmarGuardar() {
    this.confirmationService.confirm({
      title: 'POR FAVOR CONFIRME',
      message: '¿DESEA GUARDAR EL NUEVO REGISTRO DE MOMENTO CONTABLE?',
      type: 'warning',
      confirmText: 'SÍ, CONTINUAR',
      cancelText: 'NO',
      width: '520px'
    }).subscribe(result => {
      if (result.confirmed) {
        // ✅ aquí solo mostramos success (pantalla lista)
        this.mostrarSuccess('Registro validado correctamente (pendiente conectar servicio).');
      }
    });
  }

  regresar() {
    this.router.navigate(['/momento-contable/listado-momento-contable']); // ajusta ruta
  }

  closeAlert() {
    this.showAlert = false;
  }

  private mostrarError(msg: string) {
    this.alertMessage = msg;
    this.alertType = 'error';
    this.alertIcon = 'close-circle';
    this.showAlert = true;
  }

  private mostrarSuccess(msg: string) {
    this.alertMessage = msg;
    this.alertType = 'success';
    this.alertIcon = 'check-circle';
    this.showAlert = true;
  }
}
