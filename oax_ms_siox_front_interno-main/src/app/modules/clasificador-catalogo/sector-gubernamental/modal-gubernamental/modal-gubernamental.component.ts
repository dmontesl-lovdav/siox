import { CommonModule } from "@angular/common";
import { Component, OnInit, inject } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { finalize } from "rxjs";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzFormModule } from "ng-zorro-antd/form";
import { NzIconModule } from "ng-zorro-antd/icon";
import { NzInputModule } from "ng-zorro-antd/input";
import { NzDatePickerModule } from "ng-zorro-antd/date-picker";
import { NZ_MODAL_DATA, NzModalRef } from "ng-zorro-antd/modal";

import { ConfirmationService } from "../../../../shared/confirmation-modal";
import { DomicilioService } from "../../../../services/domicilio.service";
import { FormFieldComponent } from "../../../../shared/form-field";

interface IModalData {
  modo: "crear" | "editar" | "consultar";
  genero: any | null;
  confirmationService: ConfirmationService;
}

@Component({
  selector: "app-modal-gubernamental",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzIconModule,
    NzDatePickerModule,
    FormFieldComponent,
  ],
  templateUrl: "./modal-gubernamental.component.html",
  styleUrls: ["./modal-gubernamental.component.scss"],
})
export class ModalGubernamentalComponent implements OnInit {
  readonly nzModalData: IModalData = inject(NZ_MODAL_DATA);

  form: FormGroup;
  modo: "crear" | "editar" | "consultar" = "crear";
  loading = false;
  confirmationService: ConfirmationService;
  confirmCancel: boolean = false;

  // Mensajes de error personalizados
  errorMessages: { [key: string]: string } = {};
  title = 'NUEVO REGISTRO DEL CATÁLOGO DE TIPO DE SECTOR GUBERNAMENTAL';

  constructor(
    private fb: FormBuilder,
    public modal: NzModalRef,
    private domicilioService: DomicilioService,
  ) {
    this.confirmationService = this.nzModalData.confirmationService;

    // ✅ Form correcto del modal de Sector
    this.form = this.fb.group({
      sector: ["", [
        Validators.required,
        Validators.maxLength(100)
      ]],
      fechaInicioVigencia: [null, [Validators.required]],
      fechaFinVigencia: [null], // opcional (en tu maqueta no tiene *)
    });
  }

  ngOnInit(): void {
    this.modo = this.nzModalData.modo;
    console.log('Modal Data:', this.nzModalData);
    console.log('Datos del registro:', this.nzModalData.genero);

    if (
      this.nzModalData.genero &&
      (this.modo === "editar" || this.modo === "consultar")
    ) {
      if (this.modo === "editar") {
        this.title = 'EDITAR REGISTRO DEL CATÁLOGO DE TIPO DE SECTOR GUBERNAMENTAL';
      }
      
      // Las fechas ya vienen como objetos Date del listado, no necesitan parseo
      const fechaInicio = this.nzModalData.genero.fechaInicioVigencia;
      const fechaFin = this.nzModalData.genero.fechaFinVigencia;

      console.log('Sector:', this.nzModalData.genero.sector);
      console.log('Fecha Inicio Vigencia:', fechaInicio);
      console.log('Fecha Fin Vigencia:', fechaFin);
      
      this.form.patchValue({
        sector: this.nzModalData.genero.sector ?? "",
        fechaInicioVigencia: fechaInicio,
        fechaFinVigencia: fechaFin,
      });

      console.log('Form después de patchValue:', this.form.value);

      if (this.modo === "consultar") {
        this.title = 'CONSULTAR REGISTRO DEL CATÁLOGO DE TIPO DE SECTOR GUBERNAMENTAL';
        this.form.disable();
      }
    }
  }

  // Guardar
  guardar(): void {
    console.log(this.form);
    // Marcar todos los campos como tocados para mostrar errores
    Object.keys(this.form.controls).forEach(key => {
      this.form.get(key)?.markAsTouched();
    });

    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    (window as any).showGlobalSpinner?.();

    // Convertir fechas al formato YYYY-MM-DD
    const fechaInicio = this.form.get('fechaInicioVigencia')?.value;
    const fechaFin = this.form.get('fechaFinVigencia')?.value;

    const payload: any = {
      sector: this.form.get('sector')?.value,
      fechaInicioVigencia: fechaInicio ? this.formatearFecha(fechaInicio) : null,
      fechaFinVigencia: fechaFin ? this.formatearFecha(fechaFin) : null,
    };

    const observable = this.modo === 'editar' && this.nzModalData.genero
      ? this.domicilioService.updateTipoSectorGubernamental(this.nzModalData.genero.id, payload)
      : this.domicilioService.createTipoSectorGubernamental(payload);

    observable.pipe(
      finalize(() => {
        this.loading = false;
      })
    ).subscribe({
      next: (response: any) => {
        
        const esExitoso = response.exito === true || response.exito === undefined || response.exito === null;
        
        if (esExitoso && !response.error) {
          // Delay de 500ms para mostrar el spinner un poco más
          setTimeout(() => {
            (window as any).hideGlobalSpinner?.();
            this.modal.close({
              success: true
            });
          }, 500);
        } else {
          (window as any).hideGlobalSpinner?.();
          // Mostrar error en el formulario
          this.errorMessages['general'] = response.mensaje || response.error || 'No se pudo completar la operación';
        }
      },
      error: (error: any) => {
        (window as any).hideGlobalSpinner?.();
        console.error('Error al guardar/actualizar sector gubernamental:', error);
        this.errorMessages['general'] = error.error?.error || error.message || 'No se pudo completar la operación';
      }
    });
  }

  // Parsear fecha del backend sin afectar la zona horaria
  private parsearFechaLocal(fecha: string): Date | null {
    if (!fecha) return null;
    
    // Si viene en formato ISO completo: "2026-01-24T06:00:00.000Z"
    // Extraer solo la parte de la fecha YYYY-MM-DD
    let fechaSolo = fecha;
    if (fecha.includes('T')) {
      fechaSolo = fecha.split('T')[0];
    }
    
    const partes = fechaSolo.split('-');
    if (partes.length === 3) {
      const año = parseInt(partes[0], 10);
      const mes = parseInt(partes[1], 10) - 1; // Los meses en JS van de 0-11
      const día = parseInt(partes[2], 10);
      return new Date(año, mes, día);
    }
    
    return null;
  }

  // Formatear fecha al formato YYYY-MM-DD
  private formatearFecha(fecha: any): string {
    if (!fecha) return '';
    
    // Si es un Date object
    if (fecha instanceof Date) {
      const año = fecha.getFullYear();
      const mes = String(fecha.getMonth() + 1).padStart(2, '0');
      const día = String(fecha.getDate()).padStart(2, '0');
      return `${año}-${mes}-${día}`;
    }
    
    // Si es un string ISO, extraer solo la fecha
    if (typeof fecha === 'string') {
      return fecha.split('T')[0];
    }
    
    return '';
  }

  // Cancelar
  cancelar(): void {
    if (this.modo === 'consultar') {
      this.modal.close(null);
      return; 
    }
    this.confirmCancel = true;
  }
}
