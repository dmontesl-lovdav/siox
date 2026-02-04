import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';

export interface CampoFormulario {
  tipo: 'input' | 'select';
  label: string;
  placeholder?: string;
  opciones?: Array<{ value: any; label: string }>;
  formControlName: string;
  maxLength?: number;
  required?: boolean;
  disabled?: boolean;
}

export interface ConfigFormularioGenerico {
  titulo: string;
  secciones: Array<{
    titulo: string;
    campos: CampoFormulario[];
  }>;
  botones: Array<{
    label: string;
    tipo: 'primary' | 'default';
    accion: string;
  }>;
}

@Component({
  selector: 'app-formulario-captura-generico',
  templateUrl: './formulario-captura-generico.component.html',
  styleUrls: ['./formulario-captura-generico.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzButtonModule,
    RouterModule,
    NzDatePickerModule
  ]
})
export class FormularioCapturaGenericoComponent {
  // Lista de nombres de campos de clave
  camposClave = ['claveRubro', 'claveTipo', 'claveClase', 'claveConcepto'];

  // Bloquea caracteres especiales en los inputs de clave
  soloAlfanumerico(event: KeyboardEvent) {
    const regex = /^[A-Z0-9]$/;
    const key = event.key.toUpperCase();
    if (!regex.test(key)) {
      event.preventDefault();
    }
  }

  // Verifica si el campo es una clave
  esCampoClave(nombre: string): boolean {
    return this.camposClave.includes(nombre);
  }
  @Input() config!: ConfigFormularioGenerico;
  @Input() formGroup: any;
  @Input() rutaRegreso: string = '/';
  @Output() accion = new EventEmitter<string>();

  onAccion(accion: string) {
    if (accion === 'guardar' && this.formGroup) {
      Object.values(this.formGroup.controls).forEach(control => {
        (control as AbstractControl).markAsTouched();
        (control as AbstractControl).updateValueAndValidity();
      });
    }
    this.accion.emit(accion);
  }
}
