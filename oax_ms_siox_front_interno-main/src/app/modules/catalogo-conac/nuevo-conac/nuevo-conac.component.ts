import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { CargaMasivaCriService } from '../../../services/catalogo.cri.service';

import { CatalogoConacService } from '../../../services/catalogo-conac.service';
import { ConfirmationService } from '../../../shared/confirmation-modal/confirmation.service';
import { FormularioCapturaGenericoComponent } from '../../../shared/formulario-captura-generico';
import { GenericAlertComponent } from '../../../shared/generic-alert/generic-alert.component';
import { configCuenta, configDatosCuenta, configDatosCuentaEdicion, configEdicionSubcuenta, configGenero, configGrupo, configRubro, configSubCuenta } from './formularios-config';
@Component({
  selector: 'app-nuevo-conac',
  templateUrl: './nuevo-conac.component.html',
  styleUrls: ['./nuevo-conac.component.scss'],
  standalone: true,
  providers: [CargaMasivaCriService,CatalogoConacService ],
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
  
  // Modo edición
  modoEdicion: boolean = false;
  datosEdicion: any = null;
  // Validación personalizada para fechas
  validarFechasConcepto() {
    const inicioCtrl = this.formDatosCuenta.get('inicioVigencia');
    const finCtrl = this.formDatosCuenta.get('finVigencia');
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
  generos: any[] = [];
  grupos: any[] = [];
  rubros: any[] = [];
  cuenta: any[] = [];
  subcuenta: any[] = [];
  
  // Catálogos para datos de cuenta
  naturalezas: any[] = [];
  estadosFinancieros: any[] = [];
  posiciones: any[] = [];
  estructuras: any[] = [];

  // Seleccionados
  generoSeleccionado: any = null;
  grupoSeleccionado: any = null;
  rubroSeleccionado: any = null;
  cuentaSeleccionado: any = null;
  subcuentaSeleccionada: any = null;

  // Formularios y configs
  formularioVisible: 'genero' | 'grupo' | 'rubro' | 'cuenta' | 'subcuenta' | 'datosCuenta' | null = null;
  configGenero = configGenero;
  configGrupo = configGrupo;
  configRubro = configRubro;
  configCuenta = configCuenta;
  configSubCuenta = configSubCuenta;
  configEdicionSubcuenta = configEdicionSubcuenta;
  configDatosCuenta = configDatosCuenta;
  configDatosCuentaEdicion = configDatosCuentaEdicion;
  
  // Getter para obtener la configuración correcta según el modo
  get configDatosCuentaActual() {
    return this.modoEdicion ? this.configDatosCuentaEdicion : this.configDatosCuenta;
  }
  
  get configSubcuentaActual() {
    return this.modoEdicion ? this.configEdicionSubcuenta : this.configSubCuenta;
  }

  formGenero: FormGroup;
  formGrupo: FormGroup;
  formRubro: FormGroup;
  formCuenta: FormGroup;
  formSubCuenta: FormGroup;
  formDatosCuenta: FormGroup;

  constructor(
    private fb: FormBuilder,
    @Inject(CargaMasivaCriService) private criService: CargaMasivaCriService,
    @Inject(CatalogoConacService) private conacService: CatalogoConacService,
    private confirmationService: ConfirmationService,
    private router: Router,
  ) {
    // Verificar si viene en modo edición
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.modoEdicion = navigation.extras.state['modoEdicion'] || false;
      this.datosEdicion = navigation.extras.state['datosEdicion'] || null;
    }
    
    // Inicializar años: solo año actual y el siguiente
    const anioActual = new Date().getFullYear();
    this.ejerciciosDisponibles = [String(anioActual), String(anioActual + 1)];
    // Inicializar formularios
    const claveValidator = [Validators.required, Validators.maxLength(2), Validators.pattern('^[A-Z0-9]+$')];
    this.formGenero = this.fb.group({
      claveGenero: ['', claveValidator],
      descripcionGenero: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(250),
        Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9.\s]+$')
      ]],
    });
        this.formGrupo = this.fb.group({
      claveGrupo: ['', claveValidator],
      descripcionGrupo: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(250),
        Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9.\s]+$')
      ]],
    });
    this.formRubro = this.fb.group({
      claveRubro: ['', claveValidator],
      descripcionRubro: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(250),
        Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9.\s]+$')
      ]],
    });

       this.formCuenta = this.fb.group({
      claveCuenta: ['', claveValidator],
      descripcionCuenta: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(250),
        Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9.\s]+$')
      ]],
    });

      this.formSubCuenta = this.fb.group({
      claveSubCuenta: ['', claveValidator],
      descripcionSubCuenta: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(250),
        Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9.\s]+$')
      ]],
    });

       this.formDatosCuenta = this.fb.group({
      naturaleza: ['', Validators.required],
      estadoFinanciero: ['', Validators.required],
      posicion: ['', Validators.required],
      estructura: ['', Validators.required],
      inicioVigencia: ['', Validators.required],
      finVigencia: ['', Validators.required]

    });

    this.formDatosCuenta.get('inicioVigencia')?.valueChanges.subscribe(() => this.onFechaChange());
    this.formDatosCuenta.get('finVigencia')?.valueChanges.subscribe(() => this.onFechaChange());
    // Cargar listas al iniciar
    this.cargarListas();
  }

  cargarListas() {
    const ejercicio = Number(this.ejercicioSeleccionado);
    let loaded = 0;
    const total = 5; // Ahora son 5 servicios a cargar
    const checkLoaded = () => {
      loaded++;
      if (loaded === total) {
        // Llenar las opciones en las configuraciones de formulario
        this.llenarOpcionesCatalogos();
        
        // Si estamos en modo edición, prellenar los datos
        if (this.modoEdicion && this.datosEdicion) {
          console.log("edicion")
          this.prellenarDatosEdicion();
        }
      }
    };

    // Cargar géneros
    this.conacService.getGeneroEjercicio(ejercicio).subscribe({
      next: (data: any) => { this.generos = data; },
      error: () => {},
      complete: checkLoaded
    });

    // Cargar catálogos para datos de cuenta
    this.conacService.getNaturaleza().subscribe({
      next: (data: any) => { 
        this.naturalezas = data;
      },
      error: () => {},
      complete: checkLoaded
    });

    this.conacService.getEstadoFinanciero().subscribe({
      next: (data: any) => { 
        this.estadosFinancieros = data;
      },
      error: () => {},
      complete: checkLoaded
    });

    this.conacService.getPosicion().subscribe({
      next: (data: any) => { 
        this.posiciones = data;
      },
      error: () => {},
      complete: checkLoaded
    });

    this.conacService.getEstructura().subscribe({
      next: (data: any) => { 
        this.estructuras = data;
      },
      error: () => {},
      complete: checkLoaded
    });
  }

  llenarOpcionesCatalogos() {
    // Llenar opciones de naturaleza
    const campoNaturaleza = this.configDatosCuenta.secciones[0].campos.find(c => c.formControlName === 'naturaleza');
    const campoNaturalezaEdicion = this.configDatosCuentaEdicion.secciones[0].campos.find(c => c.formControlName === 'naturaleza');
    const opcionesNaturaleza = this.naturalezas.map(item => ({
      value: item.id,
      label: item.descripcion || item.nombre || item.descripcionNaturaleza
    }));
    if (campoNaturaleza) campoNaturaleza.opciones = opcionesNaturaleza;
    if (campoNaturalezaEdicion) campoNaturalezaEdicion.opciones = opcionesNaturaleza;

    // Llenar opciones de estado financiero
    const campoEstadoFinanciero = this.configDatosCuenta.secciones[0].campos.find(c => c.formControlName === 'estadoFinanciero');
    const campoEstadoFinancieroEdicion = this.configDatosCuentaEdicion.secciones[0].campos.find(c => c.formControlName === 'estadoFinanciero');
    const opcionesEstadoFinanciero = this.estadosFinancieros.map(item => ({
      value: item.id,
      label: item.descripcion || item.nombre || item.descripcionEstadoFinanciero
    }));
    if (campoEstadoFinanciero) campoEstadoFinanciero.opciones = opcionesEstadoFinanciero;
    if (campoEstadoFinancieroEdicion) campoEstadoFinancieroEdicion.opciones = opcionesEstadoFinanciero;

    // Llenar opciones de posición
    const campoPosicion = this.configDatosCuenta.secciones[0].campos.find(c => c.formControlName === 'posicion');
    const campoPosicionEdicion = this.configDatosCuentaEdicion.secciones[0].campos.find(c => c.formControlName === 'posicion');
    const opcionesPosicion = this.posiciones.map(item => ({
      value: item.id,
      label: item.descripcion || item.nombre || item.descripcionPosicion
    }));
    if (campoPosicion) campoPosicion.opciones = opcionesPosicion;
    if (campoPosicionEdicion) campoPosicionEdicion.opciones = opcionesPosicion;

    // Llenar opciones de estructura
    const campoEstructura = this.configDatosCuenta.secciones[0].campos.find(c => c.formControlName === 'estructura');
    const campoEstructuraEdicion = this.configDatosCuentaEdicion.secciones[0].campos.find(c => c.formControlName === 'estructura');
    const opcionesEstructura = this.estructuras.map(item => ({
      value: item.id,
      label: item.descripcion || item.nombre || item.descripcionEstructura
    }));
    if (campoEstructura) campoEstructura.opciones = opcionesEstructura;
    if (campoEstructuraEdicion) campoEstructuraEdicion.opciones = opcionesEstructura;
  }

  // Método para prellenar datos en modo edición
  prellenarDatosEdicion() {
    if (!this.datosEdicion) return;
    const ejercicio = Number(this.ejercicioSeleccionado);
    // Cargar y seleccionar género
    const genero = this.generos.find(g => g.id === this.datosEdicion.idGenero);
    if (genero) {
      this.generoSeleccionado = genero;
      // Cargar grupos del género
      this.conacService.getGrupoEjercicio(ejercicio, genero.id).subscribe({
        next: (grupos: any) => {
          this.grupos = grupos;
          const grupo = grupos.find((g: any) => g.id === this.datosEdicion.idGrupo);
          if (grupo) {
            this.grupoSeleccionado = grupo;
            // Cargar rubros del grupo
            this.conacService.getRubroEjercicio(ejercicio, grupo.id).subscribe({
              next: (rubros: any) => {
                this.rubros = rubros;
                const rubro = rubros.find((r: any) => r.id === this.datosEdicion.idRubro);
                if (rubro) {
                  this.rubroSeleccionado = rubro;
                  // Cargar cuentas del rubro
                  this.conacService.getCuentaEjercicio(ejercicio, rubro.id).subscribe({
                    next: (cuentas: any) => {
                      this.cuenta = cuentas;
                      const cuenta = cuentas.find((c: any) => c.id === this.datosEdicion.idCuenta);
                      if (cuenta) {
                        this.cuentaSeleccionado = cuenta;
                        // Cargar subcuentas de la cuenta
                        this.conacService.getSubcuentaEjercicio(ejercicio, cuenta.id).subscribe({
                          next: (subcuentas: any) => {
                            this.subcuenta = subcuentas;
                            const subcuenta = subcuentas.find((s: any) => s.id === this.datosEdicion.idSubCuenta);
                            if (subcuenta) {
                              this.subcuentaSeleccionada = subcuenta;
                            }
                            // Extraer la clave individual (últimos 2 dígitos de la clave compuesta)
                            const claveCompuesta = this.datosEdicion.clave || '';
                            const claveIndividual = claveCompuesta.length >= 2 
                              ? claveCompuesta.slice(-2) 
                              : claveCompuesta;
                            // Prellenar el formulario de subcuenta con la clave y descripción
                            this.formSubCuenta.patchValue({
                              claveSubCuenta: claveIndividual,
                              descripcionSubCuenta: this.datosEdicion.descripcion
                            });
                            // Deshabilitar el campo de clave para que no se pueda editar
                            this.formSubCuenta.get('claveSubCuenta')?.disable();
                            // También prellenar el formulario de datos de cuenta (para usar después)
                            this.formDatosCuenta.patchValue({
                              naturaleza: this.datosEdicion.idNaturaleza,
                              estadoFinanciero: this.datosEdicion.idEstadoFinanciero,
                              posicion: this.datosEdicion.idPosicion,
                              estructura: this.datosEdicion.idEstructura,
                              inicioVigencia: this.datosEdicion.inicioVigencia ? new Date(this.datosEdicion.inicioVigencia) : null,
                              finVigencia: this.datosEdicion.finVigencia ? new Date(this.datosEdicion.finVigencia) : null
                            });
                            // Mostrar primero el formulario de edición de subcuenta
                            this.formularioVisible = 'subcuenta';
                            // Forzar detección de cambios para evitar ExpressionChangedAfterItHasBeenCheckedError
                            
                          },
                          error: () => {}
                        });
                      }
                    },
                    error: () => {}
                  });
                }
              },
              error: () => {}
            });
          }
        },
        error: () => {}
      });
    }
  }

  mostrarFormulario(tipo: 'genero' | 'grupo' | 'rubro' | 'cuenta' | 'subcuenta' | 'datosCuenta') {
    this.formularioVisible = tipo;
  }

  onGeneroChange() {
  if (!this.generoSeleccionado) {
    this.formularioVisible = null;
    this.grupoSeleccionado = null;
    this.rubroSeleccionado = null;
    this.cuentaSeleccionado = null;
    this.subcuentaSeleccionada = null;
    this.grupos = [];
    this.rubros = [];
    this.cuenta = [];
    this.subcuenta = [];
    return;
  }
  const ejercicio = Number(this.ejercicioSeleccionado);
  this.formularioVisible = null;
  this.grupoSeleccionado = null;
  this.rubroSeleccionado = null;
  this.cuentaSeleccionado = null;
  this.subcuentaSeleccionada = null;
  this.conacService.getGrupoEjercicio(ejercicio, this.generoSeleccionado.id).subscribe({
    next: (data: any) => { this.grupos = data; },
    error: () => {},
  });
}
onGrupoChange() {
  if (!this.grupoSeleccionado) {
    this.formularioVisible = null;
    this.rubroSeleccionado = null;
    this.cuentaSeleccionado = null;
    this.subcuentaSeleccionada = null;
    this.rubros = [];
    this.cuenta = [];
    this.subcuenta = [];
    return;
  }
  const ejercicio = Number(this.ejercicioSeleccionado);
  this.formularioVisible = null;
  this.rubroSeleccionado = null;
  this.cuentaSeleccionado = null;
  this.subcuentaSeleccionada = null;
  this.conacService.getRubroEjercicio(ejercicio, this.grupoSeleccionado.id).subscribe({
    next: (data: any) => { this.rubros = data; },
    error: () => {},
  });
}
onRubroChange() {
  if (!this.rubroSeleccionado) {
    this.formularioVisible = null;
    this.cuentaSeleccionado = null;
    this.subcuentaSeleccionada = null;
    this.cuenta = [];
    this.subcuenta = [];
    return;
  }
  const ejercicio = Number(this.ejercicioSeleccionado);
  this.formularioVisible = null;
  this.cuentaSeleccionado = null;
  this.subcuentaSeleccionada = null;
  this.conacService.getCuentaEjercicio(ejercicio, this.rubroSeleccionado.id).subscribe({
    next: (data: any) => { this.cuenta = data; },
    error: () => {},
  });
}
onCuentaChange() {
  if (!this.cuentaSeleccionado) {
    this.formularioVisible = null;
    this.subcuentaSeleccionada = null;
    this.subcuenta = [];
    return;
  }
  const ejercicio = Number(this.ejercicioSeleccionado);
  this.formularioVisible = null;
  this.subcuentaSeleccionada = null;
  this.conacService.getSubcuentaEjercicio(ejercicio, this.cuentaSeleccionado.id).subscribe({
    next: (data: any) => { this.subcuenta = data; },
    error: () => {},
  });
}

   onSubcuentaChange() {
  this.formularioVisible = null;
this.mostrarFormulario('datosCuenta');

     
  }

 closeAlert() {
    this.showAlert = false;
  }
 
  onAccionGenero(accion: any) {
    console.log('Acción Genero:', accion);
    const value = accion && accion.target ? accion.target.value : accion;
    if (value === 'guardar' && this.formGenero.valid) {
      (window as any).showGlobalSpinner?.();
      const nuevoGenero = { ...this.formGenero.value };
      this.generoSeleccionado = nuevoGenero;
      // Invocar servicio para guardar genero
      this.conacService.insertGenero(
        nuevoGenero.claveGenero,
        nuevoGenero.descripcionGenero,
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
               this.formGenero.reset();
        },
        error: (err: any) => {
          (window as any).hideGlobalSpinner?.();
          let msg = 'Hubo un error al guardar el registro.Intente nuevamente';
          if (err?.status && err?.status !== 200 && err?.error?.error) {
            this.generoSeleccionado = null;
            msg = err.error.error;
          }
          this.alertMessage = msg;
          this.alertType = 'error';
          this.showAlert = true;
        }
      });
    }
    if (value === 'cancelar') {
      console.log("cancelar genero")
         this.cancelar(this.formGenero)
    }
  }
  onAccionGrupo(accion: any) {
    const value = accion && accion.target ? accion.target.value : accion;
    if (value === 'guardar' && this.formGrupo.valid) {
      (window as any).showGlobalSpinner?.();
      const nuevoGrupo = { ...this.formGrupo.value };
      this.grupoSeleccionado = nuevoGrupo;
      console.log('Nuevo grupo:', nuevoGrupo);
      // Invocar servicio para guardar grupo
      this.conacService.insertGrupo(
        nuevoGrupo.claveGrupo,
        this.generoSeleccionado?.id || nuevoGrupo.idGenero,
        nuevoGrupo.descripcionGrupo,
        Number(this.ejercicioSeleccionado)
      ).subscribe({
        next: (resp: any) => {
          (window as any).hideGlobalSpinner?.();
          this.alertMessage = 'Registro guardado de forma correcta.';
          this.alertType = 'success';
          this.showAlert = true;
          this.formularioVisible = null;
          this.alertIcon='check-circle';
      this.conacService.getGrupoEjercicio(  Number(this.ejercicioSeleccionado),this.generoSeleccionado.id).subscribe({
      next: (data: any) => { this.grupos = data; },
      error: () => {},
    
    })
       this.formGrupo.reset();
        },
        error: (err: any) => {
          (window as any).hideGlobalSpinner?.();
          let msg = 'Hubo un error al guardar el registro.Intente nuevamente';
          if (err?.status && err?.status !== 200 && err?.error?.error) {
            this.grupoSeleccionado = null;
            msg = err.error.error;
          }
          this.alertMessage = msg;
          this.alertType = 'error';
          this.showAlert = true;
        }
      });
    }
    if (value === 'cancelar') {
       this.cancelar(this.formGrupo)
    }
  }

   onAccionRubro(accion: any) {
    const value = accion && accion.target ? accion.target.value : accion;
    if (value === 'guardar' && this.formRubro.valid) {
      (window as any).showGlobalSpinner?.();
      const nuevoRubro = { ...this.formRubro.value };
      this.rubroSeleccionado = nuevoRubro;
      // Invocar servicio para guardar rubro
      this.conacService.insertRubro(
        nuevoRubro.claveRubro,
        this.generoSeleccionado?.id || nuevoRubro.idGenero,
        this.grupoSeleccionado?.id || nuevoRubro.idGrupo,
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
           this.conacService.getRubroEjercicio(  Number(this.ejercicioSeleccionado),this.grupoSeleccionado.id).subscribe({
      next: (data: any) => { this.rubros = data; },
      error: () => {},
    
    })
       this.formRubro.reset();
        },
        error: (err: any) => {
          (window as any).hideGlobalSpinner?.();
          this.rubroSeleccionado = null;
          let msg = 'Hubo un error al guardar el registro.Intente nuevamente';
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
        this.cancelar(this.formRubro)
    }
  }
  onAccionCuenta(accion: any) {
    const value = accion && accion.target ? accion.target.value : accion;
    if (value === 'guardar' && this.formCuenta.valid) {
      (window as any).showGlobalSpinner?.();
      const nuevoCuenta = { ...this.formCuenta.value };
      this.cuentaSeleccionado = nuevoCuenta;
      // Invocar servicio para guardar cuenta
      this.conacService.insertCuenta(
        nuevoCuenta.claveCuenta,
        this.generoSeleccionado?.id || nuevoCuenta.idGenero,
        this.grupoSeleccionado?.id || nuevoCuenta.idGrupo,
        this.rubroSeleccionado?.id || nuevoCuenta.idRubro,
        nuevoCuenta.descripcionCuenta,
        Number(this.ejercicioSeleccionado)
      ).subscribe({
        next: (resp: any) => {
          (window as any).hideGlobalSpinner?.();
          this.alertMessage = 'Registro guardado de forma correcta.';
          this.alertType = 'success';
          this.showAlert = true;
          this.formularioVisible = null;
          this.alertIcon='check-circle';
      this.conacService.getCuentaEjercicio(  Number(this.ejercicioSeleccionado),this.rubroSeleccionado.id).subscribe({
      next: (data: any) => { this.cuenta = data; },
      error: () => {},
    
    })
     this.formCuenta.reset();
        },
        error: (err: any) => {
          (window as any).hideGlobalSpinner?.();
          let msg = 'Hubo un error al guardar el registro.Intente nuevamente';
          if (err?.status && err?.status !== 200 && err?.error?.error) {
            this.cuentaSeleccionado = null;
            msg = err.error.error;
          }
          this.alertMessage = msg;
          this.alertType = 'error';
          this.showAlert = true;
        }
      });
    }
    if (value === 'cancelar') {
         this.cancelar(this.formCuenta)
    }
  }

    onAccionSubCuenta(accion: any) {
    const value = accion && accion.target ? accion.target.value : accion;
    if (value === 'guardar' && this.formSubCuenta.valid) {
      // Si estamos en modo edición, actualizar la subcuenta
      if (this.modoEdicion && this.datosEdicion) {
        (window as any).showGlobalSpinner?.();
        const datosSubcuenta = { ...this.formSubCuenta.value };
        
        const idSubcuenta = this.datosEdicion.idSubCuenta;
        const descripcionSubcuenta = datosSubcuenta.descripcionSubCuenta;
        
        console.log('Actualizando subcuenta:', { idSubcuenta, descripcionSubcuenta });
        
        this.conacService.updateSubcuenta(
          idSubcuenta,
          descripcionSubcuenta
        ).subscribe({
          next: (resp: any) => {
            (window as any).hideGlobalSpinner?.();
            console.log('Respuesta del servidor:', resp);
            this.alertMessage = 'Registro guardado de forma correcta.';
            this.alertType = 'success';
            this.showAlert = true;
            this.alertIcon = 'check-circle';
            this.formularioVisible = null;
            
            // Mostrar el formulario de datos de cuenta
            this.mostrarFormulario('datosCuenta');
          },
          error: (err: any) => {
            (window as any).hideGlobalSpinner?.();
            console.error('Error al actualizar subcuenta:', err);
            let msg = 'Hubo un error al guardar el registro.Intente nuevamente';
            if (err?.status && err?.status !== 200 && err?.error?.error) {
              msg = err.error.error;
            }
            this.alertMessage = msg;
            this.alertType = 'error';
            this.showAlert = true;
          }
        });
      } else {
        // Modo normal (inserción)
        (window as any).showGlobalSpinner?.();
        const nuevoCuenta = { ...this.formSubCuenta.value };
        this.subcuentaSeleccionada = nuevoCuenta;
        
        this.conacService.insertSubcuenta(
          nuevoCuenta.claveSubCuenta,
          this.generoSeleccionado?.id || nuevoCuenta.idGenero,
          this.grupoSeleccionado?.id || nuevoCuenta.idGrupo,
          this.rubroSeleccionado?.id || nuevoCuenta.idRubro,
          this.cuentaSeleccionado?.id || nuevoCuenta.idCuenta,
          nuevoCuenta.descripcionSubCuenta,
          Number(this.ejercicioSeleccionado)
        ).subscribe({
          next: (resp: any) => {
            (window as any).hideGlobalSpinner?.();
            this.alertMessage = 'Registro guardado de forma correcta.';
            this.alertType = 'success';
            this.showAlert = true;
            this.formularioVisible = null;
            this.alertIcon = 'check-circle';
            this.conacService.getSubcuentaEjercicio(Number(this.ejercicioSeleccionado), this.cuentaSeleccionado.id).subscribe({
              next: (data: any) => { this.subcuenta = data; },
              error: () => {}
            });
            this.formSubCuenta.reset();
            this.mostrarFormulario('datosCuenta');
          },
          error: (err: any) => {
            (window as any).hideGlobalSpinner?.();
            let msg = 'Hubo un error al guardar el registro.Intente nuevamente';
            if (err?.status && err?.status !== 200 && err?.error?.error) {
              this.subcuentaSeleccionada = null;
              msg = err.error.error;
            }
            this.alertMessage = msg;
            this.alertType = 'error';
            this.showAlert = true;
          }
        });
      }
    }
    if (value === 'cancelar') {
      this.cancelar(this.formSubCuenta);
    }
  }
   onAccionDatosCuenta(accion: any) {
    const value = accion && accion.target ? accion.target.value : accion;
    if (value === 'guardar' && this.formDatosCuenta.valid) {
    
  this.confDatosCuenta(this.formDatosCuenta)
    }
    if (value === 'cancelar') {
     this.cancelar(this.formDatosCuenta)
    }
  }
  onEjercicioChange() {
    // Limpiar selecciones
    this.generoSeleccionado = null;
    this.grupoSeleccionado = null;
    this.rubroSeleccionado = null;
    this.cuentaSeleccionado = null;
    this.subcuentaSeleccionada = null;

    // Limpiar listas dependientes
    this.grupos = [];
    this.rubros = [];
    this.cuenta = [];
    this.subcuenta = [];

    // Recargar todas las listas
    this.cargarListas();
  }

  regresar(){
    this.router.navigate(['/catalogo-conac/listado-conac']);

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

    confDatosCuenta(form:any){
    const mensajeConfirmacion = this.modoEdicion 
      ? 'AL ACTUALIZAR LA FECHA DE VIGENCIA, SE ACTUALIZARÁN AUTOMÁTICAMENTE LOS REGISTROS ASOCIADOS A LA CUENTA CONAC. ¿DESEA CONTINUAR?'
      : 'AL GUARDAR LA FECHA DE VIGENCIA, SE ACTUALIZARÁN AUTOMÁTICAMENTE LOS REGISTROS ASOCIADOS A LA CUENTA CONAC. ¿DESEA CONTINUAR?';
      
    this.confirmationService.confirm({
  title: 'POR FAVOR CONFIRME',
  message: mensajeConfirmacion,
  type: 'warning',
  confirmText: 'SÍ, CONTINUAR',
  cancelText: 'NO',
  width: '520px'
}).subscribe(result => {
  if (result.confirmed) {
  (window as any).showGlobalSpinner?.();
        const nuevoCuenta = { ...this.formDatosCuenta.value };

      // En modo edición, usar el servicio de actualización
      if (this.modoEdicion && this.datosEdicion) {
        // Convertir fechas a string en formato que espera el backend
        const inicioVigenciaStr = nuevoCuenta.inicioVigencia 
          ? new Date(nuevoCuenta.inicioVigencia).toISOString() 
          : '';
        const finVigenciaStr = nuevoCuenta.finVigencia 
          ? new Date(nuevoCuenta.finVigencia).toISOString() 
          : '';
        
        console.log('Datos a enviar:', {
          idGenero: this.generoSeleccionado?.id || this.datosEdicion.idGenero,
          idGrupo: this.grupoSeleccionado?.id || this.datosEdicion.idGrupo,
          idRubro: this.rubroSeleccionado?.id || this.datosEdicion.idRubro,
          idCuenta: this.cuentaSeleccionado?.id || this.datosEdicion.idCuenta,
          idSubCuenta: this.subcuentaSeleccionada?.id || this.datosEdicion.idSubCuenta,
          idNaturaleza: Number(nuevoCuenta.naturaleza),
          idEstadoFinanciero: Number(nuevoCuenta.estadoFinanciero),
          idPosicionFinanciera: Number(nuevoCuenta.posicion),
          idEstructura: Number(nuevoCuenta.estructura),
          inicioVigencia: inicioVigenciaStr,
          finVigencia: finVigenciaStr,
          ejercicio: Number(this.ejercicioSeleccionado)
        });
        
        // Servicio para actualizar datos de cuenta existente
        this.conacService.updateDatosCuenta(
          this.generoSeleccionado?.id || this.datosEdicion.idGenero,
          this.grupoSeleccionado?.id || this.datosEdicion.idGrupo,
          this.rubroSeleccionado?.id || this.datosEdicion.idRubro,
          this.cuentaSeleccionado?.id || this.datosEdicion.idCuenta,
          this.subcuentaSeleccionada?.id || this.datosEdicion.idSubCuenta,
          Number(nuevoCuenta.naturaleza),
          Number(nuevoCuenta.estadoFinanciero),
          Number(nuevoCuenta.posicion),
          Number(nuevoCuenta.estructura),
          inicioVigenciaStr,
          finVigenciaStr,
          Number(this.ejercicioSeleccionado)
        ).subscribe({
          next: (resp: any) => {
            (window as any).hideGlobalSpinner?.();
            this.alertMessage = 'Registro guardado de forma correcta.';
            this.alertType = 'success';
            this.showAlert = true;
            this.formularioVisible = null;
            this.alertIcon='check-circle';
            this.formDatosCuenta.reset();
            
            // Redirigir al listado después de actualizar
            setTimeout(() => {
              this.router.navigate(['/catalogo-conac/listado-conac']);
            }, 2000);
          },
          error: (err: any) => {
            (window as any).hideGlobalSpinner?.();
            let msg = 'Hubo un error al guardar el registro.Intente nuevamente';
            if (err?.status && err?.status !== 200 && err?.error?.error) {
              msg = err.error.error;
            }
            this.alertMessage = msg;
            this.alertType = 'error';
            this.showAlert = true;
          }
        });
      } else {
        // Servicio original para insertar nueva cuenta
        this.conacService.insertDatosCuenta(
          this.generoSeleccionado?.id || nuevoCuenta.idGenero,
          this.grupoSeleccionado?.id || nuevoCuenta.idGrupo,
          this.rubroSeleccionado?.id || nuevoCuenta.idRubro,
          this.cuentaSeleccionado?.id || nuevoCuenta.idCuenta,
          this.subcuentaSeleccionada?.id || nuevoCuenta.idSubcuenta,
          Number(nuevoCuenta.naturaleza),
          Number(nuevoCuenta.estadoFinanciero),
          Number(nuevoCuenta.posicion),
          Number(nuevoCuenta.estructura),
          nuevoCuenta.inicioVigencia,
          nuevoCuenta.finVigencia,
          Number(this.ejercicioSeleccionado)
        ).subscribe({
          next: (resp: any) => {
            (window as any).hideGlobalSpinner?.();
            this.alertMessage = 'Registro guardado de forma correcta.';
            this.alertType = 'success';
            this.showAlert = true;
            this.formularioVisible = null;
            this.alertIcon='check-circle';
            this.formDatosCuenta.reset();
          },
          error: (err: any) => {
            (window as any).hideGlobalSpinner?.();
            let msg = 'Hubo un error al guardar el registro.Intente nuevamente';
            if (err?.status && err?.status !== 200 && err?.error?.error) {
              msg = err.error.error;
            }
            this.alertMessage = msg;
            this.alertType = 'error';
            this.showAlert = true;
          }
        });
      }
  }else{
  this.formularioVisible = null;
      form.reset();
  }
});

  }
}

