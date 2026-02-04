import { CommonModule, NgFor, NgIf } from "@angular/common";
import { Component, OnInit, inject } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzFormModule } from "ng-zorro-antd/form";
import { NzIconModule } from "ng-zorro-antd/icon";
import { NzInputModule } from "ng-zorro-antd/input";
import { NZ_MODAL_DATA, NzModalRef } from "ng-zorro-antd/modal";
import { ConfirmationService } from "../../../../shared/confirmation-modal";
import { CatGeneroService } from "../../../../services/cat-genero.service";
import { CatGeneroUpdateDTO } from "../../../../models/cat-genero.model";
import { NzSelectModule } from "ng-zorro-antd/select";

interface IModalData {
  modo: "crear" | "editar" | "consultar";
  inmueble: any | null;
  confirmationService: ConfirmationService;
}
@Component({
  selector: "app-modal-inmueble",
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
    NgIf,
    NgFor,
  ],
  templateUrl: "./modal-inmueble.component.html",
  styleUrls: ["./modal-inmueble.component.scss"],
})
export class ModalInmuebleComponent implements OnInit {
  readonly nzModalData: IModalData = inject(NZ_MODAL_DATA);

  form: FormGroup;
  modo: "crear" | "editar" | "consultar" = "crear";
  loading = false;
  confirmationService: ConfirmationService;

  errorMessages: { [key: string]: string } = {};

  ambitos = [
    { label: "URBANO", value: "URBANO" },
    { label: "RURAL", value: "RURAL" },
  ];

  constructor(
    private fb: FormBuilder,
    private modal: NzModalRef,
    private catGeneroService: CatGeneroService,
  ) {
    this.confirmationService = this.nzModalData.confirmationService;

    this.form = this.fb.group({
      tipoAmbito: [null, [Validators.required]], // ✅ NUEVO
      descripcion: ["", [Validators.required, Validators.maxLength(100)]],
    });
  }

  ngOnInit(): void {
    this.modo = this.nzModalData.modo;

    if (
      this.nzModalData.inmueble &&
      (this.modo === "editar" || this.modo === "consultar")
    ) {
      this.form.patchValue({
        tipoAmbito: this.nzModalData.inmueble.tipoAmbito ?? null,
        descripcion: this.nzModalData.inmueble.descripcion ?? "",
      });

      if (this.modo === "consultar") this.form.disable();
    }
  }

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

  isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getErrorMessage(fieldName: string): string {
    const field = this.form.get(fieldName);

    if (field?.errors?.["required"]) {
      return "ESTE CAMPO ES OBLIGATORIO";
    }

    if (field?.errors?.["maxlength"]) {
      const maxLength = field.errors["maxlength"].requiredLength;
      return `ESTE CAMPO DEBE CONTENER COMO MÁXIMO ${maxLength} CARACTERES`;
    }

    // Ejemplo duplicado si lo usas:
    if (field?.errors?.["duplicate"]) {
      return "LA DESCRIPCIÓN INGRESADA YA EXISTE.";
    }

    return "";
  }

  guardar(): void {
    Object.values(this.form.controls).forEach((control) =>
      control.markAsTouched(),
    );
    if (this.form.invalid) return;

    this.loading = true;
    (window as any).showGlobalSpinner?.();

    const data: any = {
      tipoAmbito: this.form.get("tipoAmbito")?.value, // ✅ NUEVO
      descripcion: this.form.get("descripcion")?.value?.toUpperCase(),
    };

    const observable =
      this.modo === "editar" && this.nzModalData.inmueble
        ? this.catGeneroService.update(this.nzModalData.inmueble.id, data)
        : this.catGeneroService.create(data);

    observable.subscribe({
      next: (response: any) => {
        this.loading = false;
        (window as any).hideGlobalSpinner?.();

        const esExitoso =
          response.exito === true ||
          response.exito === undefined ||
          response.exito === null;

        if (esExitoso && !response.error) {
          this.modal.close({
            success: true,
            message:
              response.mensaje ||
              (this.modo === "editar"
                ? "Registro actualizado de forma correcta"
                : "Registro creado de forma correcta"),
          });
        } else {
          this.errorMessages["general"] =
            response.mensaje ||
            response.error ||
            "No se pudo completar la operación";
        }
      },
      error: (error: any) => {
        this.loading = false;
        (window as any).hideGlobalSpinner?.();
        this.errorMessages["general"] =
          error.error?.error ||
          error.message ||
          "No se pudo completar la operación";
      },
    });
  }

  cancelar(): void {
    if (this.modo === "crear" || this.modo === "editar") {
      this.confirmationService
        .confirm({
          title: "CANCELACIÓN",
          message:
            "SE PERDERÁN TODOS LOS DATOS INGRESADOS. ¿DESEA CANCELAR LA OPERACIÓN?",
          type: "warning",
          confirmText: "SÍ, CANCELAR",
          cancelText: "NO",
          width: "520px",
        })
        .subscribe((result) => {
          if (result.confirmed) this.modal.close(null);
        });
    } else {
      this.modal.close(null);
    }
  }
}
