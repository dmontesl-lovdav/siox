import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { CargaMasivaCriService } from '../../../services/catalogo.cri.service';
import { ConfirmationService } from '../../../shared/confirmation-modal/confirmation.service';
import { FormularioCapturaGenericoComponent } from '../../../shared/formulario-captura-generico';
import { GenericAlertComponent } from '../../../shared/generic-alert/generic-alert.component';
import { configClase, configConcepto, configRubro, configTipo } from './formularios-config';
@Component({
  selector: 'app-nuevo-cri',
  templateUrl: './nuevo-cri.component.html',
  styleUrls: ['./nuevo-cri.component.scss'],
  standalone: true,
  providers: [CargaMasivaCriService],
  imports: [CommonModule, FormsModule, FormularioCapturaGenericoComponent, NzSelectModule, RouterModule,GenericAlertComponent]
})

export class NuevoCriComponent {
   showAlert: boolean = false;
  alertMessage: string = '';
  alertType: 'error' | 'info' | 'success' | 'warning' = 'error';
  alertIcon: string = 'close-circle';
  alertDescription: string = '';
  alertDownloadUrl: string | null = null;
  alertDownloadLink: { url: string, label: string, download?: string } | undefined = undefined;
  // Validación personalizada para fechas
  validarFechasConcepto() {
    const inicioCtrl = this.formConcepto.get('inicioVigencia');
    const finCtrl = this.formConcepto.get('finVigencia');
    const ejercicio = Number(this.ejercicioSeleccionado);
    const hoy = new Date();
    let inicio: Date | null = inicioCtrl?.value instanceof Date ? inicioCtrl.value : null;
    let fin: Date | null = finCtrl?.value instanceof Date ? finCtrl.value : null;

    // Limpiar errores previos
    inicioCtrl?.setErrors(null);
    finCtrl?.setErrors(null);

    // Validar que sean fechas válidas
    if (!inicio) {
      inicioCtrl?.setErrors({ formato: true });
    }
    if (!fin) {
      finCtrl?.setErrors({ formato: true });
    }

    
      // Validar que la fecha de inicio no sea menor a hoy (puede ser igual)
      if (inicio && inicio < new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate())) {
        inicioCtrl?.setErrors({ ...inicioCtrl?.errors, inicioMenorActual: true });
      }
    // Validar fecha de inicio no mayor a fecha fin
    if (inicio && fin && inicio > fin) {
      inicioCtrl?.setErrors({ ...inicioCtrl?.errors, inicioMayorFin: true });
    }
    // Validar fecha fin no menor a hoy
    if (fin && fin < hoy) {
      finCtrl?.setErrors({ ...finCtrl?.errors, finMenorActual: true });
    }
    // Validar fecha fin mayor a inicio
    if (inicio && fin && fin <= inicio) {
      finCtrl?.setErrors({ ...finCtrl?.errors, finMenorIgualInicio: true });
    }
    // Validar año igual al ejercicio seleccionado
    if (inicio && inicio.getFullYear() !== ejercicio) {
      inicioCtrl?.setErrors({ ...inicioCtrl?.errors, anioDistintoEjercicio: true });
    }
    if (fin && fin.getFullYear() !== ejercicio) {
      finCtrl?.setErrors({ ...finCtrl?.errors, anioDistintoEjercicio: true });
    }
  }

  // Llamar a la validación cada vez que cambian las fechas
  onFechaChange() {
    this.validarFechasConcepto();
  }
  // Bloquea caracteres especiales en los inputs de clave
  soloAlfanumerico(event: KeyboardEvent) {
    const regex = /^[A-Z0-9]$/;
    const key = event.key.toUpperCase();
    if (!regex.test(key)) {
      event.preventDefault();
    }
  }
  // Ejercicio fiscal
  ejercicioSeleccionado: string = String(new Date().getFullYear());
  ejerciciosDisponibles: string[] = [];

  // Listas para selects
  rubros: any[] = [];
  tipos: any[] = [];
  clases: any[] = [];
  conceptos: any[] = [];

  // Seleccionados
  rubroSeleccionado: any = null;
  tipoSeleccionado: any = null;
  claseSeleccionada: any = null;
  conceptoSeleccionado: any = null;

  // Formularios y configs
  formularioVisible: 'rubro' | 'tipo' | 'clase' | 'concepto' | null = null;
  configRubro = configRubro;
  configTipo = configTipo;
  configClase = configClase;
  configConcepto = configConcepto;
  formRubro: FormGroup;
  formTipo: FormGroup;
  formClase: FormGroup;
  formConcepto: FormGroup;

  constructor(
    private fb: FormBuilder,
    @Inject(CargaMasivaCriService) private criService: CargaMasivaCriService,
    private confirmationService: ConfirmationService,
             private router: Router
  ) {
    // Inicializar años: solo año actual y el siguiente
    const anioActual = new Date().getFullYear();
    this.ejerciciosDisponibles = [String(anioActual), String(anioActual + 1)];
    // Inicializar formularios
    const claveValidator = [Validators.required, Validators.maxLength(2), Validators.pattern('^[A-Z0-9]+$')];
    this.formRubro = this.fb.group({
      claveRubro: ['', claveValidator],
      nombreRubro: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(250)]],
      descripcionRubro: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(250)]],
    });
    this.formTipo = this.fb.group({
      claveTipo: ['', claveValidator],
      nombreTipo: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(250)]],
      descripcionTipo: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(250)]],
    });
    this.formClase = this.fb.group({
      claveClase: ['', claveValidator],
      nombreClase: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(250)]],
      descripcionClase: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(250)]],
    });
    this.formConcepto = this.fb.group({
      claveConcepto: ['', claveValidator],
      nombreConcepto: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(250)]],
      descripcionConcepto: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(250)]],
      inicioVigencia: ['', Validators.required],
      finVigencia: ['', Validators.required]
    });
    this.formConcepto.get('inicioVigencia')?.valueChanges.subscribe(() => this.onFechaChange());
    this.formConcepto.get('finVigencia')?.valueChanges.subscribe(() => this.onFechaChange());
    // Cargar listas al iniciar
    this.cargarListas();
  }

  cargarListas() {
    const ejercicio = Number(this.ejercicioSeleccionado);
    let loaded = 0;
    const total = 1;
    const checkLoaded = () => {
      loaded++;
      if (loaded === total) {
      }
    };
    this.criService.getRubroEjercicio(ejercicio).subscribe({
      next: (data: any) => { this.rubros = data; },
      error: () => {},
      complete: checkLoaded
    });
   
  }

  mostrarFormulario(tipo: 'rubro' | 'tipo' | 'clase' | 'concepto') {
    this.formularioVisible = tipo;
  }

  onRubroChange() {
      if (!this.rubroSeleccionado) {
    this.formularioVisible = null;
    this.tipoSeleccionado = null;
    this.claseSeleccionada = null;
    this.conceptoSeleccionado = null;
    return;
  }
        const ejercicio = Number(this.ejercicioSeleccionado);
    this.formularioVisible = null;
    this.tipoSeleccionado = null;
    this.claseSeleccionada = null;
    this.conceptoSeleccionado = null;
     this.criService.buscarTipoPorEjercicio(ejercicio,this.rubroSeleccionado.id).subscribe({
      next: (data: any) => {  this.tipos = data; },
      error: () => {  },
  
    });

    // Filtrar tipos según rubro si aplica
  }
  onTipoChange() {
          if (!this.tipoSeleccionado) {
    this.formularioVisible = null;
    this.tipoSeleccionado = null;
    this.rubroSeleccionado
    this.claseSeleccionada = null;
    this.conceptoSeleccionado = null;
    return;
  }
        const ejercicio = Number(this.ejercicioSeleccionado);
    this.formularioVisible = null;
    this.claseSeleccionada = null;
    this.conceptoSeleccionado = null;
        this.criService.buscarClasePorEjercicio(ejercicio,this.tipoSeleccionado.id).subscribe({
      next: (data: any) => {  this.clases = data; },
      error: () => { },
    
    });
   
    // Filtrar clases según tipo si aplica
  }
  onClaseChange() {
            if (!this.claseSeleccionada) {
    this.formularioVisible = null;
    this.tipoSeleccionado = null;
    this.rubroSeleccionado
    this.claseSeleccionada = null;
    this.conceptoSeleccionado = null;
    return;
  }
        const ejercicio = Number(this.ejercicioSeleccionado);
    this.formularioVisible = null;
    this.conceptoSeleccionado = null;
     this.criService.buscarConceptoPorEjercicio(ejercicio,this.claseSeleccionada.id).subscribe({
      next: (data: any) => {  this.conceptos = data; },
      error: () => { },
 
    });
    // Filtrar conceptos según clase si aplica
  }
  onConceptoChange() {
    this.formularioVisible = null;
  }
 closeAlert() {
    this.showAlert = false;
  }
  onAccionRubro(accion: any) {
    const value = accion && accion.target ? accion.target.value : accion;
    if (value === 'guardar' && this.formRubro.valid) {
      (window as any).showGlobalSpinner?.();
      const nuevoRubro = { ...this.formRubro.value };
      this.rubroSeleccionado = nuevoRubro;
      // Invocar servicio para guardar rubro
      this.criService.insertCatRubroCri(
        nuevoRubro.claveRubro,
        nuevoRubro.nombreRubro,
        nuevoRubro.descripcionRubro,
        Number(this.ejercicioSeleccionado)
      ).subscribe({
        next: (resp: any) => {
          (window as any).hideGlobalSpinner?.();
          this.alertMessage = 'Registro guardado de forma correcta.';
          this.alertType = 'success';
          this.showAlert = true;
          this.formularioVisible = null;
          this.alertIcon='check-circle';
          this.cargarListas();
        },
        error: (err: any) => {
          (window as any).hideGlobalSpinner?.();
          this.rubroSeleccionado = null;
          let msg = 'Error al guardar el rubro.';
          if (err?.status && err?.status !== 200 && err?.error?.error) {
            msg = err.error.error;
          }
          this.alertMessage = msg;
          this.alertType = 'error';
          this.showAlert = true;
        }
      });
    }
    if (value === 'cancelar') {
      this.cancelar(this.formRubro);
    }
  }
  onAccionTipo(accion: any) {
    const value = accion && accion.target ? accion.target.value : accion;
    if (value === 'guardar' && this.formTipo.valid) {
      (window as any).showGlobalSpinner?.();
      const nuevoTipo = { ...this.formTipo.value };
      this.tipoSeleccionado = nuevoTipo;
      // Invocar servicio para guardar tipo
      this.criService.insertarTipo(
        nuevoTipo.claveTipo,
        nuevoTipo.nombreTipo,
        nuevoTipo.descripcionTipo,
        this.rubroSeleccionado?.id || nuevoTipo.idRubro,
        Number(this.ejercicioSeleccionado)
      ).subscribe({
        next: (resp: any) => {
          (window as any).hideGlobalSpinner?.();
          this.alertMessage = 'Registro guardado de forma correcta.';
          this.alertType = 'success';
          this.showAlert = true;
          this.alertIcon='check-circle';
          this.formularioVisible = null;
           this.cargarListas();
        },
        error: (err: any) => {
          (window as any).hideGlobalSpinner?.();
          let msg = 'Error al guardar el tipo.';
          if (err?.status && err?.status !== 200 && err?.error?.error) {
            this.tipoSeleccionado = null;
            msg = err.error.error;
          }
          this.alertMessage = msg;
          this.alertType = 'error';
          this.showAlert = true;
        }
      });
    }
    if (value === 'cancelar') {
       this.cancelar(this.formTipo);
    }
  }
  onAccionClase(accion: any) {
    const value = accion && accion.target ? accion.target.value : accion;
    if (value === 'guardar' && this.formClase.valid) {
      (window as any).showGlobalSpinner?.();
      const nuevaClase = { ...this.formClase.value };
      this.claseSeleccionada = nuevaClase;
      // Invocar servicio para guardar clase
      this.criService.insertarClase(
        nuevaClase.claveClase,
        nuevaClase.nombreClase,
        nuevaClase.descripcionClase,
        this.tipoSeleccionado?.id || nuevaClase.idTipo,
        this.rubroSeleccionado?.id || nuevaClase.idRubro,
        Number(this.ejercicioSeleccionado)
      ).subscribe({
        next: (resp: any) => {
          (window as any).hideGlobalSpinner?.();
          this.alertMessage = 'Registro guardado de forma correcta.';
          this.alertType = 'success';
          this.showAlert = true;
          this.formularioVisible = null;
          this.alertIcon='check-circle';
           this.cargarListas();
        },
        error: (err: any) => {
          (window as any).hideGlobalSpinner?.();
          let msg = 'Error al guardar la clase.';
          if (err?.status && err?.status !== 200 && err?.error?.error) {
            this.claseSeleccionada = null;
            msg = err.error.error;
          }
          this.alertMessage = msg;
          this.alertType = 'error';
          this.showAlert = true;
        }
      });
    }
    if (value === 'cancelar') {
          this.cancelar(this.formClase);
    }
  }
  onAccionConcepto(accion: any) {
    const value = accion && accion.target ? accion.target.value : accion;
    if (value === 'guardar' && this.formConcepto.valid) {
      (window as any).showGlobalSpinner?.();
      const nuevoConcepto = { ...this.formConcepto.value };
      this.conceptoSeleccionado = nuevoConcepto;
      // Invocar servicio para guardar concepto
      this.criService.insertarConcepto(
        nuevoConcepto.claveConcepto,
        nuevoConcepto.nombreConcepto,
        nuevoConcepto.descripcionConcepto,
        this.rubroSeleccionado?.id || nuevoConcepto.idRubro,
        this.tipoSeleccionado?.id || nuevoConcepto.idTipo,
        this.claseSeleccionada?.id || nuevoConcepto.idClase,
        nuevoConcepto.inicioVigencia,
        nuevoConcepto.finVigencia,
        Number(this.ejercicioSeleccionado)
      ).subscribe({
        next: (resp: any) => {
          (window as any).hideGlobalSpinner?.();
          this.alertMessage = 'Registro guardado de forma correcta.';
          this.alertType = 'success';
          this.showAlert = true;
          this.formularioVisible = null;
          this.alertIcon='check-circle';
          this.cargarListas();
        },
        error: (err: any) => {
          (window as any).hideGlobalSpinner?.();
          let msg = 'Error al guardar el concepto.';
          if (err?.status && err?.status !== 200 && err?.error?.error) {
            this.conceptoSeleccionado = null;
            msg = err.error.error;
          }
          this.alertMessage = msg;
          this.alertType = 'error';
          this.showAlert = true;
        }
      });
    }
    if (value === 'cancelar') {
      this.cancelar(this.formConcepto);
    }
  }

  onEjercicioChange() {
    this.rubroSeleccionado = null;
    this.tipoSeleccionado = null;
    this.claseSeleccionada = null;
    this.conceptoSeleccionado = null;

    this.cargarListas();
  }


   regresar(){
    this.confirmationService.confirm({
  title: 'CANCELACIÓN',
  message: 'SE PERDERÁN TODOS LOS DATOS INGRESADOS. ¿DESEA CANCELAR LA OPERACIÓN?',
  type: 'warning',
  confirmText: 'SÍ, CANCELAR',
  cancelText: 'NO',
  width: '520px'
}).subscribe(result => {
  if (result.confirmed) {
    // Usuario confirmó - cancelar operación
   this.router.navigate(['/clasificador-rubro-ingreso/listado-cri']);
  }
});

  }

    cancelar(form:any){
  this.confirmationService.confirm({
  title: 'CANCELACIÓN',
  message: 'SE PERDERÁN TODOS LOS DATOS INGRESADOS. ¿DESEA CANCELAR LA OPERACIÓN?',
  type: 'warning',
  confirmText: 'SÍ, CANCELAR',
  cancelText: 'NO',
  width: '520px'
}).subscribe(result => {
  if (result.confirmed) {
   this.formularioVisible = null;
      form.reset();
  
  }
});

  }
}

