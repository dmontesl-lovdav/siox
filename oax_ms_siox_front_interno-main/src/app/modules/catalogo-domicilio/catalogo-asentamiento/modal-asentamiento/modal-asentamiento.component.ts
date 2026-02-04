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
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { FormFieldComponent } from '../../../../shared/form-field';
import { CatGeneroUpdateDTO } from '../../../../models/cat-genero.model';
import { CatDomicilioService } from '../../../../services/cat-pais.service';
import { ConfirmationService } from '../../../../shared/confirmation-modal';

interface IModalData {
  modo: "crear" | "editar" | "consultar";
  genero: any | null;
  confirmationService: ConfirmationService;
}

@Component({
  selector: "app-modal-asentamiento",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzButtonModule,
    NzIconModule,
    FormFieldComponent
  ],
  templateUrl: "./modal-asentamiento.component.html",
  styleUrls: ["./modal-asentamiento.component.scss"],
})
export class ModalAsentamientoComponent implements OnInit {
  readonly nzModalData: IModalData = inject(NZ_MODAL_DATA);

  form: FormGroup;
  modo: "crear" | "editar" | "consultar" = "crear";
  loading = false;
  confirmationService: ConfirmationService;
  confirmCancel: boolean = false;

  // Mensajes de error personalizados
  errorMessages: { [key: string]: string } = {};
  title = 'NUEVO REGISTRO DEL CATÁLOGO DE ASENTAMIENTO'

  constructor(
    private fb: FormBuilder,
    public modal: NzModalRef,
    private catLocalidadService: CatDomicilioService,
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
    if (
      this.nzModalData.genero &&
      (this.modo === "editar" || this.modo === "consultar")
    ) {
      if (this.modo === 'editar') {
        this.title = 'EDITAR REGISTRO DEL CATÁLOGO DE ASENTAMIENTO'
      }

      this.form.patchValue({
        clave: this.nzModalData.genero.clave,
        descripcion: this.nzModalData.genero.descripcion,
      });

      // Si es consultar, deshabilitar campos
      if (this.modo === 'consultar') {
        this.title = 'CONSULTAR REGISTRO DEL CATÁLOGO DE ASENTAMIENTO'
        this.form.disable();
      }
    }
  }

  // Validar solo letras para la clave
  validarClave(event: KeyboardEvent): void {
    const regex = /^[A-Za-z]$/;
    if (
      !regex.test(event.key) &&
      event.key !== 'Backspace' &&
      event.key !== 'Tab'
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
        [event.target.getAttribute("formControlName")]: value.slice(
          0,
          maxLength,
        ),
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

    if (field?.errors?.["required"]) {
      return "ESTE CAMPO ES OBLIGATORIO";
    }

    if (field?.errors?.["maxlength"]) {
      const maxLength = field.errors["maxlength"].requiredLength;
      return `ESTE CAMPO DEBE CONTENER COMO MÁXIMO ${maxLength} CARACTERES`;
    }

    if (field?.errors?.["pattern"]) {
      if (fieldName === "clave") {
        return "ESTE CAMPO DEBE CONTENER SOLO LETRAS (A-Z)";
      }
    }

    return "";
  }

  // Guardar
  guardar(): void {
    // Marcar todos los campos como tocados para mostrar errores
    Object.values(this.form.controls).forEach((control) => {
      control.markAsTouched();
    });

    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    (window as any).showGlobalSpinner?.();

    const generoData: CatGeneroUpdateDTO = {
      clave: this.form.get("clave")?.value,
      descripcion: this.form.get("descripcion")?.value,
    };

    const observable =
      this.modo === "editar" && this.nzModalData.genero
        ? this.catLocalidadService.actualizarTipoAsentamiento(this.nzModalData.genero.id, generoData)
        : this.catLocalidadService.guardarTipoAsentamiento(generoData);

    observable.pipe(
      finalize(() => {
        this.loading = false;
      })
    ).subscribe({
      next: (response: any) => {
        const esExitoso =
          response.exito === true ||
          response.exito === undefined ||
          response.exito === null;

        if (esExitoso && !response.error) {
          // Delay de 500ms para mostrar el spinner un poco más
          setTimeout(() => {
            (window as any).hideGlobalSpinner?.();
            this.modal.close({
              success: true,
              message:
                response.mensaje ||
                (this.modo === "editar"
                  ? "Registro actualizado de forma correcta"
                  : "Registro creado de forma correcta"),
            });
          }, 500);
        } else {
          (window as any).hideGlobalSpinner?.();
          // Mostrar error en el formulario
          this.errorMessages["general"] =
            response.mensaje ||
            response.error ||
            "No se pudo completar la operación";
        }
      },
      error: (error: any) => {
        (window as any).hideGlobalSpinner?.();
        console.error("Error al guardar/actualizar género:", error);
        this.errorMessages["general"] =
          error.error?.error ||
          error.message ||
          "No se pudo completar la operación";
      },
    });
  }

  // Cancelar
  cancelar(): void {
    if (this.modo === 'consultar') {
      this.modal.close(null);
      return; 
    }
    this.confirmCancel = true;
  }

  confirmarCancelacion(): void {
    this.confirmCancel = false;
    this.modal.close(null);
  }

  rechazarCancelacion(): void {
    this.confirmCancel = false;
  }
}
