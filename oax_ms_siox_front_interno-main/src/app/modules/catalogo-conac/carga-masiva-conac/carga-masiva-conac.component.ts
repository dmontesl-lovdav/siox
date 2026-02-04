import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { BreadcrumbService } from '../../../services/breadcrumb.service';
import { CargaMasivaCriService } from '../../../services/catalogo.cri.service';
import { GenericAlertComponent } from '../../../shared/generic-alert/generic-alert.component';
// import eliminado: GenericLoaderComponent
import { Router } from '@angular/router';
import { CatalogoConacService } from '../../../services/catalogo-conac.service';
import { ConfirmationService } from '../../../shared/confirmation-modal/confirmation.service';

@Component({
  selector: 'app-carga-masiva-cri',
  templateUrl: './carga-masiva-conac.component.html',
  styleUrls: ['./carga-masiva-conac.component.scss'],
  standalone: true,
  imports: [CommonModule, NzButtonModule, NzCardModule, NzSelectModule, NzAlertModule, NzIconModule, FormsModule, ReactiveFormsModule, GenericAlertComponent]
})
export class CargaMasivaCriComponent implements OnInit {
  archivoCargado: { nombre: string, file?: File } | null = null;
  showAlert: boolean = false;
  alertMessage: string = '';
  alertType: 'error' | 'info' | 'success' | 'warning' = 'error';
  alertIcon: string = 'close-circle';
  alertDescription: string = '';
  alertDownloadUrl: string | null = null;
  alertDownloadName: string = 'error_carga.txt';
  alertDownloadLink: { url: string, label: string, download?: string } | undefined = undefined;
  isDragging: boolean = false;
  ejercicios = [
    { label: new Date().getFullYear().toString(), value: new Date().getFullYear().toString() },
    { label: (new Date().getFullYear() + 1).toString(), value: (new Date().getFullYear() + 1).toString() }
  ];
  selectedEjercicio: string | undefined = (typeof this.ejercicios[0] !== 'undefined') ? this.ejercicios[0].value : undefined;

  constructor(
    private breadcrumbService: BreadcrumbService,
    private cargaService: CargaMasivaCriService,
    private catalogoConacService: CatalogoConacService,
    private router: Router,
       private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.breadcrumbService.setBreadcrumbReplace([
      { nombre: 'CONTROL DE INGRESO' },
      { nombre: 'ADMINISTRADOR CONTABLE DEL INGRESO' },
      { nombre: 'CLASIFICADORES Y CATÁLOGOS' },
      { nombre: 'CATALOGO CONAC' },
      { nombre: 'CARGA MASIVA: CATALOGO CONAC', actual: true }
    ]);
  }

    descargarEjemplo() {
      this.cargaService.descargarPlantilla('1', 'PLANTILLA_EJEMPLO_CONAC').subscribe({
        next: (response: any) => {
          const blob = response.body;
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'formato_ejemplo_CONAC.xlsx';
          a.click();
          window.URL.revokeObjectURL(url);
        },
        error: () => {
          this.alertMessage = 'Error al descargar el formato de ejemplo.';
          this.alertType = 'error';
          this.showAlert = true;
        }
      });
    }

    descargarRellenar() {
      this.cargaService.descargarPlantilla('1', 'PLANTILLA_RELLENAR_CONAC').subscribe({
        next: (response: any) => {
          const blob = response.body;
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'formato_para_rellenar_CONAC.xlsx';
          a.click();
          window.URL.revokeObjectURL(url);
        },
        error: () => {
          this.alertMessage = 'Error al descargar el formato para rellenar.';
          this.alertType = 'error';
          this.showAlert = true;
        }
      });
    }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input && input.files && input.files.length > 0) {
      const file = input.files[0];
      this.validateAndSetFile(file);
      input.value = '';
    }
  }

  validateAndSetFile(file: File) {
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (extension !== 'xlsx') {
      this.alertMessage = 'Solo se permite cargar archivos con extensión .xlsx';
      this.alertType = 'error';
      this.alertIcon = 'close-circle';
      this.alertDescription = 'Por favor seleccione un archivo válido.';
      this.showAlert = true;
      this.archivoCargado = null;
      return;
    }
    // Archivo válido
    this.archivoCargado = { nombre: file.name, file };
    this.showAlert = false;
    console.log('Archivo seleccionado:', file);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      this.validateAndSetFile(file);
    }
  }

  descargarArchivo() {
    if (this.archivoCargado?.file) {
      const url = URL.createObjectURL(this.archivoCargado.file);
      const a = document.createElement('a');
      a.href = url;
      a.download = this.archivoCargado.nombre;
      a.click();
      URL.revokeObjectURL(url);
    }
  }

eliminarArchivo() {
const confirmationObservable = this.confirmationService.confirm({
      title: 'CONFIRMACIÓN',
      message: '¿Desea eliminar el archivo de carga masiva?',
      type: 'warning',
      icon: 'warning',
      confirmText: 'SÍ, ELIMINAR',
      cancelText: 'CANCELAR'
    });
    
    console.log('Observable creado:', confirmationObservable);
    
    confirmationObservable.subscribe({
      next: (result) => {
        console.log('Resultado de confirmación:', result);
        if (result.confirmed && this.router) {
            this.isDragging = false;
    this.archivoCargado = null;
    // Limpiar el input file para permitir cargar el mismo archivo nuevamente
    const inputFile = document.getElementById('fileInput') as HTMLInputElement;
    if (inputFile) {
      inputFile.value = '';
    }
        }
      },
      error: (err) => {
        console.error('Error en confirmación:', err);
      },
      complete: () => {
        console.log('Observable completado');
      }
    });
 
  
  }

  closeAlert() {
    this.showAlert = false;
  }

  cargarArchivo() {
  if (this.archivoCargado?.file && this.selectedEjercicio) {
    // Mostrar spinner global
    (window as any).showGlobalSpinner?.();
    this.catalogoConacService.cargarArchivo(this.archivoCargado.file, this.selectedEjercicio)
      .subscribe({
        next: (res) => {
          // Ocultar spinner global
          (window as any).hideGlobalSpinner?.();
          this.alertMessage = 'Archivo cargado correctamente.';
          this.alertType = 'success';
          this.alertIcon = 'check-circle';
          if (res && res.mensaje) {
            this.alertDescription = res.mensaje;
          } else if (typeof res === 'string') {
            this.alertDescription = res;
          } else {
            this.alertDescription = '';
          }
          this.alertDownloadUrl = null;
          this.alertDownloadLink = undefined;
          this.showAlert = true;
          // Limpiar archivo cargado
                this.isDragging = false;
    this.archivoCargado = null;
    // Limpiar el input file para permitir cargar el mismo archivo nuevamente
    const inputFile = document.getElementById('fileInput') as HTMLInputElement;
    if (inputFile) {
      inputFile.value = '';
    }
          // Redirigir automáticamente a la pantalla de listado
          setTimeout(() => {
            this.router.navigateByUrl('/catalogo-conac/listado-conac');
          }, 1200); // Espera breve para mostrar el mensaje de éxito
        },
        error: (err) => {
          // Ocultar spinner global
          (window as any).hideGlobalSpinner?.();
          this.alertType = 'error';
          this.alertIcon = 'close-circle';
          let errorTxt = '';
          if (err.status === 400 && err.error) {
            this.alertMessage = 'Error al cargar el archivo.';
            if (typeof err.error === 'object') {
              errorTxt = JSON.stringify(err.error, null, 2);
            } else {
              errorTxt = err.error;
            }
            const blob = new Blob([errorTxt], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = this.alertDownloadName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            this.alertDescription = 'Se descargó el detalle automáticamente.'
            this.alertDownloadLink =undefined;
          } else {
            this.alertMessage = 'Error al cargar el archivo.';
            this.alertDescription = err?.message || '';
            this.alertDownloadUrl = null;
            this.alertDownloadLink = undefined;
          }
          this.showAlert = true;
          // Resetear el formulario si truena el archivo
                   this.isDragging = false;
    this.archivoCargado = null;
    // Limpiar el input file para permitir cargar el mismo archivo nuevamente
    const inputFile = document.getElementById('fileInput') as HTMLInputElement;
    if (inputFile) {
      inputFile.value = '';
    }
        }
      });
  } else {
    this.alertMessage = 'Debe seleccionar un archivo y un ejercicio.';
    this.alertType = 'warning';
    this.alertIcon = 'exclamation-circle';
    this.alertDescription = '';
    this.alertDownloadUrl = null;
    this.showAlert = true;
  }
  }

  regresar() {

     console.log('Método regresar() llamado');
    console.log('ConfirmationService:', this.confirmationService);
    
    const confirmationObservable = this.confirmationService.confirm({
      title: 'CONFIRMACIÓN',
      message: '¿Desea cancelar el proceso de carga masiva?',
      type: 'warning',
      icon: 'warning',
      confirmText: 'SÍ, REGRESAR',
      cancelText: 'CANCELAR'
    });
    
    console.log('Observable creado:', confirmationObservable);
    
    confirmationObservable.subscribe({
      next: (result) => {
        console.log('Resultado de confirmación:', result);
        if (result.confirmed && this.router) {
          this.router.navigateByUrl('/catalogo-conac/listado-conac');
        }
      },
      error: (err) => {
        console.error('Error en confirmación:', err);
      },
      complete: () => {
        console.log('Observable completado');
      }
    });
  }
  }

