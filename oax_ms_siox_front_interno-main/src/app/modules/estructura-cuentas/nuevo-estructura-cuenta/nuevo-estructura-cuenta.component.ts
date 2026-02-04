import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { EstructuraCuentasService } from '../../../services/estructura-cuentas.service';
import { ConfirmationService } from '../../../shared/confirmation-modal/confirmation.service';
import { GenericAlertComponent } from '../../../shared/generic-alert/generic-alert.component';

@Component({
  selector: 'app-nuevo-estructura-cuenta',
  templateUrl: './nuevo-estructura-cuenta.component.html',
  styleUrls: ['./nuevo-estructura-cuenta.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NzSelectModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzIconModule,
    NzBreadCrumbModule,
    GenericAlertComponent
  ]
})
export class NuevoEstructuraCuentaComponent implements OnInit {
  // Modo de operación: 'crear', 'editar', 'detalle'
  modo: 'crear' | 'editar' | 'detalle' = 'crear';
  estructuraId: number | null = null;
  tituloSeccion: string = 'NUEVA ESTRUCTURA DE CUENTAS';
  
  // Alertas
  showAlert: boolean = false;
  alertMessage: string = '';
  alertType: 'error' | 'info' | 'success' | 'warning' = 'error';
  alertIcon: string = 'close-circle';
  alertDescription: string = '';

  // Formularios
  formConfiguracion: FormGroup;
  formNiveles: FormGroup;

  // Opciones para selects
  opcionesNiveles = [
    { label: '4', value: 4 },
    { label: '5', value: 5 },
    { label: '6', value: 6 }
  ];

  opcionesLongitud = [
    { label: '1', value: 1 },
    { label: '2', value: 2 },
    { label: '3', value: 3 },
    { label: '4', value: 4 },
    { label: '5', value: 5 },
    { label: '6', value: 6 },
    { label: '7', value: 7 },
    { label: '8', value: 8 },
    { label: '9', value: 9 },
    { label: '10', value: 10 }
  ];

  // Niveles configurados
  nivelesSeleccionados: number = 0;
  nivelesArray: number[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private estructuraCuentasService: EstructuraCuentasService,
    private confirmationService: ConfirmationService
  ) {
    // Formulario de configuración inicial
    this.formConfiguracion = this.fb.group({
      numeroNiveles: [null, [Validators.required]],
      descripcionEstructura: ['', [Validators.required, Validators.maxLength(50)]]
    });

    // Formulario de niveles (se creará dinámicamente)
    this.formNiveles = this.fb.group({});
  }

  ngOnInit(): void {
    // Detectar modo según la ruta
    const path = this.router.url;
    if (path.includes('/editar/')) {
      this.modo = 'editar';
      this.tituloSeccion = 'EDITAR ESTRUCTURA DE CUENTAS';
    } else if (path.includes('/detalle/')) {
      this.modo = 'detalle';
      this.tituloSeccion = 'DETALLE DE ESTRUCTURA DE CUENTAS';
    } else {
      this.modo = 'crear';
      this.tituloSeccion = 'NUEVA ESTRUCTURA DE CUENTAS';
    }
    
    // Obtener ID si existe
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.estructuraId = +params['id'];
        this.cargarEstructura(this.estructuraId);
      }
    });
  }

  // Cerrar alerta
  closeAlert() {
    this.showAlert = false;
    this.alertMessage = '';
    this.alertType = 'error';
    this.alertIcon = '';
    this.alertDescription = '';
  }

  // Cargar estructura para editar o ver detalle
  cargarEstructura(id: number): void {
    
    this.estructuraCuentasService.getById(id).subscribe({
      next: (resp: any) => {
        
        if (resp.exito && resp.datos) {
          const estructura = resp.datos;
          
          // Llenar formulario de configuración
          this.formConfiguracion.patchValue({
            numeroNiveles: estructura.niveles,
            descripcionEstructura: estructura.descripcionEstructura
          });
          
          // Configurar niveles
          this.nivelesSeleccionados = estructura.niveles;
          this.nivelesArray = Array.from({ length: this.nivelesSeleccionados }, (_, i) => i + 1);
          this.crearControlesNiveles();
          
          // Llenar datos de cada nivel
          for (let i = 1; i <= this.nivelesSeleccionados; i++) {
            const longitud = parseInt(estructura[`n${i}`], 10);
            const descripcion = estructura[`desN${i}`];
            
            if (i <= 3) {
              // Para niveles fijos, actualizar valores deshabilitados
              this.formNiveles.get(`nivel${i}_longitud`)?.setValue(longitud);
              this.formNiveles.get(`nivel${i}_descripcion`)?.setValue(descripcion);
            } else {
              // Para niveles configurables
              this.formNiveles.patchValue({
                [`nivel${i}_longitud`]: longitud,
                [`nivel${i}_descripcion`]: descripcion
              });
            }
          }
          
          // Si es modo detalle, deshabilitar todos los campos
          if (this.modo === 'detalle') {
            this.formConfiguracion.disable();
            this.formNiveles.disable();
          }
        } else {
          this.alertType = 'error';
          this.alertMessage = 'Error al cargar estructura';
          this.alertIcon = 'close-circle';
          this.alertDescription = resp.mensaje || 'No se pudo cargar la estructura';
          this.showAlert = true;
        }
      },
      error: (error: any) => {
        
        this.alertType = 'error';
        this.alertMessage = 'Error al cargar estructura';
        this.alertIcon = 'close-circle';
        this.alertDescription = error.error?.error || 'No se pudo cargar la estructura';
        this.showAlert = true;
      }
    });
  }

  // Cuando cambia el número de niveles
  onNivelesChange(niveles: number): void {
    this.nivelesSeleccionados = niveles;
    this.nivelesArray = Array.from({ length: this.nivelesSeleccionados }, (_, i) => i + 1);
    
    // Crear controles dinámicos para cada nivel
    this.crearControlesNiveles();
    
    console.log('Niveles seleccionados:', niveles);
  }

  // Crear controles dinámicos para los niveles
  crearControlesNiveles(): void {
    this.formNiveles = this.fb.group({});
    
    for (let i = 1; i <= this.nivelesSeleccionados; i++) {
      // Niveles 1-3 tienen longitud y descripción fijas
      if (i <= 3) {
        const longitud = i === 1 ? 5 : (i === 2 ? 3 : 3);
        const descripcion = i === 1 ? 'CUENTA COMER' : (i === 2 ? 'UNIDAD RESPONSABLE' : 'UNIDAD EJECUTORA');
        
        this.formNiveles.addControl(`nivel${i}_longitud`, this.fb.control({ value: longitud, disabled: true }));
        this.formNiveles.addControl(`nivel${i}_descripcion`, this.fb.control({ value: descripcion, disabled: true }));
      } else {
        // Niveles 4-6 son configurables
        this.formNiveles.addControl(`nivel${i}_longitud`, this.fb.control(null, [Validators.required]));
        this.formNiveles.addControl(`nivel${i}_descripcion`, this.fb.control('', [Validators.required, Validators.maxLength(50)]));
      }
    }
  }

  // Obtener longitud de un nivel
  getLongitudNivel(nivel: number): number {
    const control = this.formNiveles.get(`nivel${nivel}_longitud`);
    return control?.value || 0;
  }

  // Generar secuencia de ceros según la longitud
  getSecuenciaNivel(nivel: number): string {
    const longitud = this.getLongitudNivel(nivel);
    return '0'.repeat(longitud);
  }

  // Calcular longitud total
  getLongitudTotal(): number {
    let total = 0;
    for (let i = 1; i <= this.nivelesSeleccionados; i++) {
      total += this.getLongitudNivel(i);
    }
    return total;
  }

  // Generar ejemplo completo de secuencia
  getEjemploSecuencia(): string {
    let ejemplo = '';
    for (let i = 1; i <= this.nivelesSeleccionados; i++) {
      if (i > 1) {
        ejemplo += '.';
      }
      ejemplo += this.getSecuenciaNivel(i);
    }
    return ejemplo;
  }

  // Guardar estructura
  guardarEstructura(): void {
    // Validar formulario de configuración
    if (this.formConfiguracion.invalid) {
      Object.values(this.formConfiguracion.controls).forEach(control => {
        control.markAsTouched();
      });
      
      this.alertType = 'error';
      this.alertMessage = 'Complete todos los campos requeridos';
      this.alertIcon = 'close-circle';
      this.alertDescription = 'Por favor complete el número de niveles y la descripción';
      this.showAlert = true;
      return;
    }

    // Validar formulario de niveles
    if (this.formNiveles.invalid) {
      Object.values(this.formNiveles.controls).forEach(control => {
        control.markAsTouched();
      });
      
      this.alertType = 'error';
      this.alertMessage = 'Complete todos los campos requeridos';
      this.alertIcon = 'close-circle';
      this.alertDescription = 'Por favor complete la longitud y descripción de todos los niveles';
      this.showAlert = true;
      return;
    }

    // Construir objeto según la estructura del backend
    const estructuraData: any = {
      descripcionEstructura: this.formConfiguracion.get('descripcionEstructura')?.value,
      niveles: this.nivelesSeleccionados,
      longitud: this.getLongitudTotal(),
      secuencia: this.getEjemploSecuencia()
    };

    // Agregar datos de cada nivel (n1, desN1, n2, desN2, etc.)
    for (let i = 1; i <= this.nivelesSeleccionados; i++) {
      const longitud = this.getLongitudNivel(i);
      const descripcion = this.formNiveles.get(`nivel${i}_descripcion`)?.value;
      
      // Agregar longitud del nivel (n1, n2, etc.)
      estructuraData[`n${i}`] = longitud.toString();
      
      // Agregar descripción del nivel (desN1, desN2, etc.)
      estructuraData[`desN${i}`] = descripcion;
    }

    console.log('Datos a guardar:', estructuraData);

    // Mostrar spinner
    (window as any).showGlobalSpinner?.();

    // Llamar al servicio según el modo
    const observable = this.modo === 'editar' && this.estructuraId
      ? this.estructuraCuentasService.update(this.estructuraId, estructuraData)
      : this.estructuraCuentasService.create(estructuraData);

    observable.subscribe({
      next: (response: any) => {
        (window as any).hideGlobalSpinner?.();
        
        console.log('Respuesta del servidor:', response);
        
        const esExitoso = response.exito === true || response.exito === undefined || response.exito === null;
        
        if (esExitoso && !response.error) {
          this.alertType = 'success';
          this.alertMessage = this.modo === 'editar' ? 'Estructura actualizada exitosamente' : 'Estructura guardada exitosamente';
          this.alertIcon = 'check-circle';
          this.alertDescription = response.mensaje || '';
          this.showAlert = true;

          // Redirigir después de 2 segundos
          setTimeout(() => {
            this.router.navigate(['/estructura-cuenta/listado-estructura-cuenta']);
          }, 2000);
        } else {
          this.alertType = 'error';
          this.alertMessage = this.modo === 'editar' ? 'Error al actualizar' : 'Error al guardar';
          this.alertIcon = 'close-circle';
          this.alertDescription = response.mensaje || response.error || 'No se pudo completar la operación';
          this.showAlert = true;
        }
      },
      error: (error: any) => {
        (window as any).hideGlobalSpinner?.();
        
        console.error('Error al guardar/actualizar estructura:', error);
        
        this.alertType = 'error';
        this.alertMessage = this.modo === 'editar' ? 'Error al actualizar la estructura' : 'Error al guardar la estructura';
        this.alertIcon = 'close-circle';
        this.alertDescription = error.error?.error || error.message || 'No se pudo completar la operación';
        this.showAlert = true;
      }
    });
  }

  // Construir detalle de niveles para enviar al backend
  construirNivelesDetalle(): any[] {
    const detalle = [];
    for (let i = 1; i <= this.nivelesSeleccionados; i++) {
      detalle.push({
        nivel: i,
        longitud: this.getLongitudNivel(i),
        descripcion: this.formNiveles.get(`nivel${i}_descripcion`)?.value
      });
    }
    return detalle;
  }

  // Cancelar y volver al listado
  cancelar(): void {
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
        this.router.navigate(['/estructura-cuenta/listado-estructura-cuenta']);
      }
    });
  }

  // Validar solo números
  soloNumeros(event: KeyboardEvent): void {
    const regex = /^[0-9]$/;
    if (!regex.test(event.key) && event.key !== 'Backspace' && event.key !== 'Tab') {
      event.preventDefault();
    }
  }

  // Limitar caracteres en el input
  limitarCaracteres(event: any, maxLength: number): void {
    const value = event.target.value;
    if (value.length > maxLength) {
      event.target.value = value.slice(0, maxLength);
    }
  }
}
