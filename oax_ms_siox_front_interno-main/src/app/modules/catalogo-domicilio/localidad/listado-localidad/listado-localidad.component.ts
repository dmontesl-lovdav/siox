import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';

// NG ZORRO
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

// Modelos y servicios
import { CatLocalidad } from '../../../../models/cat-localidad.model';
import { BreadcrumbService } from '../../../../services/breadcrumb.service';

import { CatDomicilioService, ConsultaLocalidadParams } from '../../../../services/cat-pais.service';
import { ConfirmationContainerComponent } from '../../../../shared/confirmation-modal/confirmation-container.component';
import { ConfirmationService } from '../../../../shared/confirmation-modal/confirmation.service';
import {
  ColumnDef,
  DynamicTableComponent
} from '../../../../shared/dynamic-table/dynamic-table.component';
import { ExcelExportService } from '../../../../services/export/excel-export.service';
import { PdfExportService } from '../../../../services/export/pdf-export.service';
import { ExcelReporteOptions } from '../../../../shared/excel-reporte.util';
import { PdfReporteOptions } from '../../../../shared/pdf-reporte.util';
import { GenericAlertComponent } from '../../../../shared/generic-alert/generic-alert.component';
import { ModalLocalidadComponent } from '../modal-localidad/modal-localidad.component';

@Component({
  selector: 'app-listado-genero',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NzBreadCrumbModule,
    NzButtonModule,
    NzDropDownModule,
    NzIconModule,
    NzTagModule,
    NzSelectModule,
    NzInputModule,
    DynamicTableComponent,
    GenericAlertComponent,
    ConfirmationContainerComponent,
    NzToolTipModule,
  ],
  providers: [NzModalService, ConfirmationService],
  templateUrl: './listado-localidad.component.html',
  styleUrls: ['./listado-localidad.component.scss']
})
export class ListadoLocalidadComponent implements OnInit, AfterViewInit {
  filtroServicio: Record<string, any> = {};
  // Variables para la alerta genérica
  showAlert = false;
  alertMessage = '';
  alertType: 'success' | 'error' = 'success';
  alertIcon = '';
  alertDescription = '';
  
  // Referencia a la tabla y templates
  @ViewChild('tabla', { static: false }) tabla: any;
  @ViewChild('actionsTemplate', { static: true }) actionsTemplate: any;
  @ViewChild('bloqueadaTemplate', { static: true }) bloqueadaTemplate: any;
  @ViewChild('seleccionTemplate', { static: true }) seleccionTemplate: any;
  
  // Método para cerrar la alerta
  closeAlert() {
    this.showAlert = false;
    this.alertMessage = '';
    this.alertType = 'success';
    this.alertIcon = '';
    this.alertDescription = '';
  }
  
  // Variables para búsqueda y paginación
  sortField = 'id';
  sortOrder: 'ascend' | 'descend' = 'ascend';
  filtros: Record<string, any> = {};
  pageIndex = 0;
  pageSize = 10;

  // Datos para la tabla
  data: CatLocalidadSeleccion[] = [];
  total = 0;

  // Variables para selección múltiple
  selectedIds: number[] = [];
  selectedEstatus: boolean | null = null;

  /** Helper para preservar el literal del key y satisfacer ColumnDef<CatGenero> */
  private makeCol<K extends keyof CatLocalidad>(
    def: Omit<ColumnDef<CatLocalidad>, 'key'> & { key: K }
  ): ColumnDef<CatLocalidad> { return def; }

  // Agregar columna de selección al inicio
  colsLocalidad = [
    this.makeCol({ key: 'seleccion', title: 'SELECCIONAR', sortable: false, width: '40px', type: 'template' }),
    ...[
      this.makeCol({ key: 'municipio', title: 'MUNICIPIO / DELEGACIÓN', filter: 'text', sortable: true, width: '10px' }),
      this.makeCol({ key: 'claveLocalidad', title: 'CLAVE LOCALIDAD', filter: 'text', sortable: true, width: '10px' }),
      this.makeCol({ key: 'descripcionLocalidad', title: 'DESCRIPCIÓN LOCALIDAD', filter: 'text', sortable: true, width: '80px', align: 'left' }),
      this.makeCol({ 
        key: 'fechaAlta', 
        title: 'FECHA ALTA', 
        filter: 'date', 
        sortable: true, 
        width: '5px',
        type: 'date'
      }),
      this.makeCol({ key: 'usuarioCreacion', title: 'USUARIO CREACIÓN', filter: 'text', sortable: true, width: '80px', align: 'left' }),
      // Columna de acciones antes de BLOQUEAR
      this.makeCol({
        key: 'acciones' as any,
        title: 'EDITAR /CONSULTAR',
        sortable: false,
        width: '2px',
        type: 'template'
      }),
      this.makeCol({ 
        key: 'estatus', 
        title: 'BLOQUEAR', 
        sortable: false, 
        width: '2px',
        type: 'template'
      }),
    ]
  ];

  constructor(
    private catLocalidadService: CatDomicilioService,
    private modalService: NzModalService,
    private confirmationService: ConfirmationService,
    private breadcrumbService: BreadcrumbService,
    private cdRef: ChangeDetectorRef,
    private excelExportService: ExcelExportService,
    private pdfExportService: PdfExportService
  ) {}

  ngOnInit(): void {
    this.breadcrumbService.setBreadcrumbReplace([
      { nombre: 'CONTROL DE INGRESO' },
      { nombre: 'ADMINISTRADOR CONTABLE DEL INGRESO' },
      { nombre: 'CLASIFICADORES Y CATÁLOGOS' },
      { nombre: 'CATÁLOGO DE LOCALIDAD', actual: true }
    ]);
    this.buscarGeneroPaginadoServicio();
  }

  ngAfterViewInit(): void {
    // Asignar template a la columna de acciones y bloqueada
    const accionesCol = this.colsLocalidad.find(c => c.key === ('acciones' as any));
    if (accionesCol) {
      accionesCol.cellTemplate = this.actionsTemplate;
    }
    const bloqueadaCol = this.colsLocalidad.find(c => c.key === 'estatus');
    if (bloqueadaCol) {
      bloqueadaCol.cellTemplate = this.bloqueadaTemplate;
    }
    // Asignar template a la columna de selección
    const seleccionCol = this.colsLocalidad.find(c => c.key === ('seleccion' as any));
    if (seleccionCol) {
      seleccionCol.cellTemplate = this.seleccionTemplate;
    }
  }

  onPageChange(page: number): void {
    this.pageIndex = page - 1;
    this.buscarGeneroPaginadoServicio();
  }

  onPageSizeChange(size: number): void {
    console.log('Nuevo tamaño de página:', size);
    this.pageSize = size;
    this.buscarGeneroPaginadoServicio();
  }

  // Método para consumir el servicio consultar
  buscarGeneroPaginadoServicio(): void {
    // Construir parámetros para el servicio
    const params: ConsultaLocalidadParams = {
      page: this.pageIndex + 1,
      pageSize: this.pageSize
    };

    // Agregar filtros si existen
    if (this.filtros['claveLocalidad']) {
      params.claveLocalidad = this.filtros['claveLocalidad'];
    }
    if (this.filtros['descripcion']) {
      params.descripcion = this.filtros['descripcion'];
    }
      if (this.filtros['usuarioCreacion']) {
      params.usuarioCreacion = this.filtros['usuarioCreacion'];
    }
       if (this.filtros['municipio']) {
      params.municipio = this.filtros['municipio'];
    }
    if (this.filtros['fechaAlta']) {
      // Convertir fecha a formato YYYY-MM-DD
      const fecha = new Date(this.filtros['fechaAlta']);
      params.fechaAlta = fecha.toISOString().split('T')[0];
    }

    // Agregar ordenamiento
    const sortDirection = this.sortOrder === 'ascend' ? 'ASC' : 'DESC';
    params.sort = `${this.sortField} ${sortDirection}`;

    this.catLocalidadService.consultalLocalidad(params).subscribe({
      next: (resp: any) => {
        console.log('Respuesta del servicio consultar:', resp);
        
        // Manejar respuesta vacía (204 No Content)
        if (!resp || resp === null) {
          this.data = [];
          this.total = 0;
          this.alertType = 'error';
          this.alertMessage = 'No hay datos disponibles';
          this.alertIcon = 'info-circle';
          this.alertDescription = 'No se encontraron registros del catálogo de localidades';
          this.showAlert = true;
          return;
        }
        
        // Verificar si la respuesta fue exitosa
        if (resp.exito === false) {
          this.data = [];
          this.total = 0;
          this.alertType = 'error';
          this.alertMessage = resp.mensaje || 'Error al consultar el catálogo';
          this.alertIcon = 'close-circle';
          this.showAlert = true;
          return;
        }
        
        // Ajustar según la estructura de respuesta del backend
        const datos = resp.datos || [];
        
        if (Array.isArray(datos) && datos.length > 0) {
          console.log('Primer elemento antes de mapear:', datos[0]);
          this.data = datos.map((item: any) => {
            const estatusBoolean = item.estatus === true || item.estatus === 'true';

            // Limpiar usuarioCreacion para evitar duplicados
            let usuarioCreacion = item.usuarioCreacion || '';
            // Si el valor tiene duplicados, los eliminamos
            usuarioCreacion = usuarioCreacion
              .split(' ') // separa por espacios
              .filter((v: any, i: any, arr: string | any[]) => v && arr.indexOf(v) === i) // elimina duplicados
              .join(' ');

            return {
              id:item.id,
              totalRegistros: item.totalRegistros,
              fechaAlta: item.fechaAlta,
              usuarioCreacion,
              estatus: estatusBoolean,
              estatusTexto: estatusBoolean ? 'SÍ' : 'NO',
              claveLocalidad: item.claveLocalidad || item.claveLocalidad || '',
              descripcionLocalidad: item.descripcionLocalidad || item.descripcionLocalidad || '',
              // Mostrar el nombre del municipio si existe, si no, mostrar el ID
              municipio: item.nombreMunicipio || item.municipioNombre || item.nombre || item.municipio || '',
              // Modelo extendido para selección
              _checked: this.selectedIds.includes(item.id)
            } as CatLocalidadSeleccion;
          });
          
          // Total de registros para paginación
          this.total = resp.total || datos.length;
        } else {
          this.data = [];
          this.total = 0;
          
          this.alertType = 'error';
          this.alertMessage = 'No se encontraron registros';
          this.alertIcon = 'info-circle';
          this.alertDescription = 'No hay género con los filtros aplicados';
          this.showAlert = true;
        }
        
        // Después de cargar los datos, marcar los seleccionados
        this.data.forEach(row => {
          row._checked = this.selectedIds.includes(row.id);
        });
      },
      error: (error: any) => {
        console.error('Error al consultar género:', error);
        this.data = [];
        this.total = 0;
        this.alertType = 'error';
        this.alertMessage = 'Error al consultar el catálogo';
        this.alertIcon = 'close-circle';
        this.alertDescription = error.error?.error || 'No se pudieron cargar los datos del catálogo de género';
        this.showAlert = true;
      }
    });
  }

  onFiltroServicioChange(filtros: Record<string, string>): void {
    this.filtros = filtros;
    this.pageIndex = 0;
    this.buscarGeneroPaginadoServicio();
  }

  onSortChange(evt: { sorts: { key: string; direction: 'ascend' | 'descend' | null }[] }) {
    // Filtrar los direction null
    const validSorts = (evt.sorts || []).filter(s => s.direction === 'ascend' || s.direction === 'descend');
    // Construir string múltiple para el backend
    const sortValue = validSorts.map(s => {
      let dir = s.direction === 'ascend' ? 'ASC' : 'DESC';
      return `${s.key} ${dir}`;
    }).join(', ');
    this.filtroServicio["ordenCampo"] = sortValue || 'id ASC';
    console.log('Orden múltiple:', this.filtroServicio["ordenCampo"]);
    this.buscarGeneroPaginadoServicio();
  }

  onFilterChange(filters: Record<string, any>) {
    this.filtros = filters;
    this.buscarGeneroPaginadoServicio();
  }

  actualizarTabla(): void {
    this.sortField = 'id';
    this.sortOrder = 'ascend';
    this.filtros = {};
    this.pageIndex = 0;
    
    if (this.tabla && this.tabla.clearFilters) {
      this.tabla.clearFilters();
    }
    this.buscarGeneroPaginadoServicio();
  }

  // Abrir modal para nuevo registro
  nuevoLocalidad(): void {
    const modal = this.modalService.create({
      nzTitle: 'NUEVO REGISTRO DEL CATÁLOGO LOCALIDAD',
      nzContent: ModalLocalidadComponent,
      nzWidth: 600,
      nzFooter: null,
      nzClosable: true,
      nzMaskClosable: false,
      nzData: {
        modo: 'crear',
        genero: null,
        confirmationService: this.confirmationService
      }
    });

    modal.afterClose.subscribe((result: any) => {
      if (result && result.success) {
        this.alertType = 'success';
        this.alertMessage = 'Registro guardado exitosamente';
        this.alertIcon = 'check-circle';
        this.alertDescription = result.message || 'El género ha sido creado correctamente';
        this.showAlert = true;
        this.buscarGeneroPaginadoServicio();
      }
    });
  }

  // Exportar a Excel
  exportarExcel(): void {
    const params: ConsultaLocalidadParams = {
      page: 1,
      pageSize: 10000
    };

    if (this.filtros['municipio']) {
      params.municipio = this.filtros['municipio'];
    }
    if (this.filtros['descripcion']) {
      params.descripcion = this.filtros['descripcion'];
    }
     if (this.filtros['claveLocalidad']) {
      params.claveLocalidad = this.filtros['claveLocalidad'];
    }
    if (this.filtros['usuarioCreacion']) {
      params.usuarioCreacion = this.filtros['usuarioCreacion'];
    }

    if (this.filtros['fechaAlta']) {
      const fecha = new Date(this.filtros['fechaAlta']);
      params.fechaAlta = fecha.toISOString().split('T')[0];
    }

    const sortDirection = this.sortOrder === 'ascend' ? 'ASC' : 'DESC';
    params.sort = `${this.sortField} ${sortDirection}`;

    this.catLocalidadService.consultalLocalidad(params).subscribe({
      next: (resp: any) => {
        const datos = resp.datos || [];
        
        if (Array.isArray(datos) && datos.length > 0) {
          const encabezados = [
            ["LOGO_IZQUIERDA", "", "LOGO_DERECHA"],
            ["", "Subsecretaría de Ingresos", ""],
            ["", "Dirección de Ingresos y Recaudación", ""],
            ["", "Coordinación Técnica de Ingresos", ""],
            ["", "Catálogo Género", ""],
          ];
          
          const columnas = [
            "Clave",
            "Descripción",
            "Fecha Alta",
            "Usuario de Creación",
            "Bloqueada"
          ];
          
          const datosExcel = datos.map((item: any) => ({
            "Clave": item.clave || '',
            "Descripción": item.descripcion || '',
            "Fecha Alta": item.fechaAlta || '',
            "Usuario de Creación": item.usuarioCreacion || '',
            "Bloqueada": item.estatus ? 'SÍ' : 'NO'
          }));
          
          const options: ExcelReporteOptions = {
            columnas,
            datos: datosExcel,
            nombreArchivo: `Reporte_Localidad.xlsx`,
            tituloTabla: 'Catálogo Localidad'
          };
          
          this.excelExportService.exportarConFormato(options).then(() => {
          }).catch((err) => {
            console.error('Error al exportar:', err);
            this.alertType = 'error';
            this.alertMessage = 'Error al exportar datos';
            this.alertIcon = 'close-circle';
            this.alertDescription = 'No se pudo generar el archivo de exportación';
            this.showAlert = true;
          });
        } else {
          this.alertType = 'error';
          this.alertMessage = 'No hay datos para exportar';
          this.alertIcon = 'info-circle';
          this.alertDescription = 'No se encontraron registros con los filtros aplicados';
          this.showAlert = true;
        }
      },
      error: (error: any) => {
        console.error('Error al exportar:', error);
        this.alertType = 'error';
        this.alertMessage = 'Error al exportar datos';
        this.alertIcon = 'close-circle';
        this.alertDescription = 'No se pudo generar el archivo de exportación';
        this.showAlert = true;
      }
    });
  }

  // Editar género
  editarGenero(row: any): void {
    const modal = this.modalService.create({
      nzTitle: 'EDITAR REGISTRO DEL CATÁLOGO LOCALIDAD',
      nzContent: ModalLocalidadComponent,
      nzWidth: 600,
      nzFooter: null,
      nzClosable: true,
      nzMaskClosable: false,
      nzData: {
        modo: 'editar',
        genero: row,
        confirmationService: this.confirmationService
      }
    });

    modal.afterClose.subscribe((result: any) => {
      if (result && result.success) {
        this.alertType = 'success';
        this.alertMessage = 'Registro actualizado exitosamente';
        this.alertIcon = 'check-circle';
        this.alertDescription = result.message || 'El género ha sido actualizado correctamente';
        this.showAlert = true;
        this.buscarGeneroPaginadoServicio();
      }
    });
  }

  // Ver detalle
  verDetalle(row: any): void {
    const modal = this.modalService.create({
      nzTitle: 'DETALLE DEL CATÁLOGO LOCALIDAD',
      nzContent: ModalLocalidadComponent,
      nzWidth: 600,
      nzFooter: null,
      nzClosable: true,
      nzMaskClosable: false,
      nzData: {
        modo: 'consultar',
        genero: row,
        confirmationService: this.confirmationService
      }
    });
  }

  // Bloquear/Desbloquear género
  toggleBloqueo(row: any): void {
        console.log(' estatus:', row.estatus);

    const accion = row.estatus ? 'BLOQUEAR' : 'DESBLOQUEAR';

    this.confirmationService.confirm({
      title: `${accion} REGISTRO`,
      message: `¿CONFIRMA QUE DESEA ${accion} EL REGISTRO "${row.clave}"?`,
      type: 'warning',
      confirmText: `SÍ, ${accion}`,
      cancelText: 'NO',
      width: '520px'
    }).subscribe(result => {
      if (result.confirmed) {
        (window as any).showGlobalSpinner?.();
        // Ajuste: enviar el objeto con la estructura esperada por el backend
        const idLocalidad = row.id ;
        const request = {
          ids: idLocalidad !== null ? [idLocalidad] : [],
          estatus: row.estatus 
        };
        this.catLocalidadService.actualizarEstatusLocalidades(request).subscribe({
          next: (resp: any) => {
            console.log('Respuesta cambiar estatus:', resp);
            (window as any).hideGlobalSpinner?.();

            const esExitoso = resp.exito === true || resp.exito === undefined || resp.exito === null;

            if (esExitoso && !resp.error) {
              this.alertType = 'success';
              this.alertMessage = 'Estatus actualizado';
              this.alertIcon = 'check-circle';
              this.alertDescription = `Registro ${row.estatus ? 'bloqueado' : 'desbloqueado'} de forma correcta`;
              this.showAlert = true;
              this.buscarGeneroPaginadoServicio();
            } else {
              this.alertType = 'error';
              this.alertMessage = 'Error al actualizar estatus';
              this.alertIcon = 'close-circle';
              this.alertDescription = resp.mensaje || resp.error || 'No se pudo actualizar el estatus';
              this.showAlert = true;
            }
          },
          error: (error: any) => {
            console.error('Error al cambiar estatus:', error);
            (window as any).hideGlobalSpinner?.();

            this.alertType = 'error';
            this.alertMessage = 'Error al actualizar estatus';
            this.alertIcon = 'close-circle';
            this.alertDescription = error.error?.error || error.message || 'No se pudo actualizar el estatus';
            this.showAlert = true;
          }
        });
      }
    });
  }

  // Al cambiar selección de un registro
  onSelectRow(row: CatLocalidad, checked: boolean) {
    if (checked) {
      // Si no hay selección previa, tomar el estatus del primero
      if (this.selectedEstatus === null) {
        this.selectedEstatus = row.estatus === true || row.estatus === 'true';
      }
      // Solo permitir seleccionar si el estatus coincide
      if ((row.estatus === true || row.estatus === 'true') === this.selectedEstatus) {
        this.selectedIds.push(row.id);
      }
    } else {
      this.selectedIds = this.selectedIds.filter(id => id !== row.id);
      if (this.selectedIds.length === 0) {
        this.selectedEstatus = null;
      }
    }
  }

  // Acción masiva
  bloquearDesbloquearSeleccionados() {
    if (this.selectedIds.length === 0) return;
    const estatusNuevo  = this.selectedEstatus;
    const accion = estatusNuevo ? 'BLOQUEAR' : 'DESBLOQUEAR';
    this.confirmationService.confirm({
      title: `${accion} REGISTROS`,
      message: `¿CONFIRMA QUE DESEA ${accion} LOS REGISTROS SELECCIONADOS?`,
      type: 'warning',
      confirmText: `SÍ, ${accion}`,
      cancelText: 'NO',
      width: '520px'
    }).subscribe(result => {
      if (result.confirmed) {
        (window as any).showGlobalSpinner?.();
        const ids = this.selectedIds.map(id => Number(id));
        const request = {
          ids,
          estatus: estatusNuevo
        };
        this.catLocalidadService.actualizarEstatusLocalidades(request).subscribe({
          next: (resp: any) => {
            (window as any).hideGlobalSpinner?.();
            // Limpiar selección y checks visuales
            this.selectedIds = [];
            this.selectedEstatus = null;
            this.data.forEach(row => row._checked = false);
            // Forzar refresco de la tabla cambiando la referencia del array
            const tmp = this.data;
            this.data = [];
            this.cdRef.detectChanges();
            setTimeout(() => {
              this.data = tmp;
              this.cdRef.detectChanges();
              this.buscarGeneroPaginadoServicio();
            }, 0);
            this.alertType = resp.exito ? 'success' : 'error';
            this.alertMessage = (estatusNuevo ? 'Registros bloqueados' : 'Registros desbloqueados') + ' de forma correcta';
            this.showAlert = true;
          },
          error: (err) => {
            (window as any).hideGlobalSpinner?.();
            this.alertType = 'error';
            this.alertMessage = 'Error al actualizar estatus';
            this.showAlert = true;
          }
        });
      }
    });
  }

  exportarPdf(): void {
    const params: ConsultaLocalidadParams = {
      page: 1,
      pageSize: 10000
    };

    this.catLocalidadService.consultalLocalidad(params).subscribe({
      next: (resp: any) => {
        const datos = resp.datos || [];
        
        if (Array.isArray(datos) && datos.length > 0) {
          const columnas = [
            'Clave',
            'Descripción',
            'Fecha Alta',
            'Usuario de Creación',
            'Bloqueada'
          ];

          const datosPdf = datos.map((item: any) => ({
            Clave: item.clave || '',
            Descripción: item.descripcion || '',
            'Fecha Alta': item.fechaAlta || '',
            'Usuario de Creación': item.usuarioCreacion || '',
            Bloqueada: item.estatus ? 'SÍ' : 'NO'
          }));

          const options: PdfReporteOptions = {
            columnas,
            datos: datosPdf,
            nombreArchivo: 'Reporte_Localidad.pdf',
            orientacion: 'l',
            titulo: 'Localidad'
          };

          this.pdfExportService.exportarConFormato(options).then(() => {
          }).catch((err) => {
            console.error('Error al exportar PDF:', err);
            this.alertType = 'error';
            this.alertMessage = 'Error al exportar PDF';
            this.alertIcon = 'close-circle';
            this.alertDescription = 'No se pudo generar el PDF';
            this.showAlert = true;
          });
        } else {
          this.alertType = 'error';
          this.alertMessage = 'No hay datos para exportar';
          this.alertIcon = 'info-circle';
          this.alertDescription = 'No se encontraron registros con los filtros aplicados';
          this.showAlert = true;
        }
      },
      error: (error: any) => {
        console.error('Error al exportar PDF:', error);
        this.alertType = 'error';
        this.alertMessage = 'Error al exportar PDF';
        this.alertIcon = 'close-circle';
        this.alertDescription = 'No se pudo generar el PDF';
        this.showAlert = true;
      }
    });
  }
}

// Modelo extendido para selección
export interface CatLocalidadSeleccion extends CatLocalidad {
  _checked?: boolean;
}
