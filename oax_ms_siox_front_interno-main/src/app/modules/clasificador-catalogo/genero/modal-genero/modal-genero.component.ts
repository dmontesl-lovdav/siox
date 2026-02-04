import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { ConfirmationService } from '../../../../shared/confirmation-modal';
import { CatGeneroService } from '../../../../services/cat-genero.service';
import { CatGeneroUpdateDTO } from '../../../../models/cat-genero.model';
import { FormFieldComponent } from '../../../../shared/form-field';


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
    NzButtonModule,
    NzIconModule,
    FormFieldComponent
  ],
  templateUrl: './modal-genero.component.html',
  styleUrls: ['./modal-genero.component.scss']
})
export class ModalGeneroComponent implements OnInit {
  readonly nzModalData: IModalData = inject(NZ_MODAL_DATA);
  
  form: FormGroup;
  modo: 'crear' | 'editar' | 'consultar' = 'crear';
  loading = false;
  confirmationService: ConfirmationService;
  confirmCancel:boolean=false;
  // Mensajes de error personalizados
  errorMessages: { [key: string]: string } = {};
    title = 'NUEVO REGISTRO DEL CATÁLOGO DE GÉNERO'

  constructor(
    private fb: FormBuilder,
    public modal: NzModalRef,
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
    console.log(this.nzModalData); 

    // Si es editar o consultar, cargar datos
    if (this.nzModalData.genero && (this.modo === 'editar' || this.modo === 'consultar')) {
    if (this.modo === 'editar') {
      this.title = 'EDITAR REGISTRO DEL CATÁLOGO DE GÉNERO'
    }
      this.form.patchValue({
        clave: this.nzModalData.genero.clave,
        descripcion: this.nzModalData.genero.descripcion
      });
      console.log(this.form);
      
      // Si es consultar, deshabilitar campos
      if (this.modo === 'consultar') {
        this.title = 'CONSULTAR REGISTRO DEL CATÁLOGO DE GÉNERO'
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

    const generoData: CatGeneroUpdateDTO = {
      clave: this.form.get('clave')?.value,
      descripcion: this.form.get('descripcion')?.value
    };

    const observable = this.modo === 'editar' && this.nzModalData.genero
      ? this.catGeneroService.update(this.nzModalData.genero.id, generoData)
      : this.catGeneroService.create(generoData);

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
        console.error('Error al guardar/actualizar género:', error);
        this.errorMessages['general'] = error.error?.error || error.message || 'No se pudo completar la operación';
      }
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
