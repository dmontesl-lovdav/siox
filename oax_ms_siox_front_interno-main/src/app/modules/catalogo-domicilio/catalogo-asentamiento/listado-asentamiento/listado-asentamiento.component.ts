import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
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
import { BasePaginatedListadoComponent } from '../../../../shared/base-paginated-listado.component';
import { CattipoAsentamiento } from '../../../../models/catalogo-tipo-asentamiento.model';
import { BreadcrumbService } from '../../../../services/breadcrumb.service';
import { CatDomicilioService, ConsultaTipoAsentamientoParams } from '../../../../services/cat-pais.service';
import { ConfirmationContainerComponent, ConfirmationService } from '../../../../shared/confirmation-modal';
import { ColumnDef, DynamicTableComponent } from '../../../../shared/dynamic-table/dynamic-table.component';
import { ExcelExportService } from '../../../../services/export/excel-export.service';
import { PdfExportService } from '../../../../services/export/pdf-export.service';
import { GenericAlertComponent } from '../../../../shared/generic-alert/generic-alert.component';
import { ExcelReporteOptions } from '../../../../shared/excel-reporte.util';
import { PdfReporteOptions } from '../../../../shared/pdf-reporte.util';
import { ModalAsentamientoComponent } from '../modal-asentamiento/modal-asentamiento.component';

@Component({
  selector: 'app-listado-asentamiento',
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
  templateUrl: './listado-asentamiento.component.html',
  styleUrls: ['./listado-asentamiento.component.scss']
})
export class ListadoAsentamientoComponent extends BasePaginatedListadoComponent implements OnInit, AfterViewInit {
  filtroServicio: Record<string, any> = {};
  hasFiltersApplied = false;
  
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
  override pageIndex = 0;
  override pageSize = 10;

  // Datos para la tabla
  data: CattipoAsentamiento<any>[] = [];
  total = 0;

  /** Helper para preservar el literal del key y satisfacer ColumnDef<CattipoAsentamiento<any>> */
  private makeCol<K extends keyof CattipoAsentamiento<any>>(
    def: Omit<ColumnDef<CattipoAsentamiento<any>>, 'key'> & { key: K }
  ): ColumnDef<CattipoAsentamiento<any>> { return def; }

colsAsentamiento: ColumnDef<CattipoAsentamiento<any>>[] = [
  this.makeCol({ 
    key: 'clave', 
    title: 'CLAVE', 
    filter: 'text', 
    sortable: true, 
    align: 'center',
    width: '10%'
  }),

  this.makeCol({ 
    key: 'descripcion', 
    title: 'DESCRIPCIÓN', 
    filter: 'text', 
    sortable: true, 
    align: 'left',
    width: '30%'
  }),

  this.makeCol({
    key: 'fechaAlta',
    title: 'FECHA ALTA',
    filter: 'date',
    sortable: true,
    type: 'date',
    align: 'center',
    width: '15%'
  }),

  this.makeCol({
    key: 'usuarioCreacion',
    title: 'USUARIO DE CREACIÓN',
    filter: 'text',
    sortable: true,
    align: 'center',
    width: '20%'
  }),

  this.makeCol({
    key: 'acciones' as any,
    title: 'EDITAR / CONSULTAR',
    sortable: false,
    type: 'template',
    align: 'center',
    width: '15%'
  }),

  this.makeCol({
    key: 'estatus',
    title: 'BLOQUEAR',
    type: 'template',
    sortable: false,
    align: 'center',
    cellTemplate: null,
    width: '10%'
  }),

];


  constructor(
    private catLocalidadService: CatDomicilioService,
    private modalService: NzModalService,
    private confirmationService: ConfirmationService,
    private breadcrumbService: BreadcrumbService,
    private excelExportService: ExcelExportService,
    private pdfExportService: PdfExportService
  ) {
    super();
  }

  ngOnInit(): void {
    this.breadcrumbService.setBreadcrumbReplace([
      { nombre: 'ADMINISTRACIÓN DE CONTRIBUYENTES' },
      { nombre: 'ADMINISTRADOR DE CATÁLOGOS DE CONTRIBUYENTES' },
      { nombre: 'CATÁLOGOS PARA DOMICILIO' },
      { nombre: 'ADMINISTRADOR DE CATÁLOGO DE TIPO DE ASENTAMIENTO', actual: true }
    ]);
    this.buscarAsentamientoPaginadoServicio();
  }

  ngAfterViewInit(): void {
    // Asignar template a la columna de acciones y bloqueada
    const accionesCol = this.colsAsentamiento.find(c => c.key === ('acciones' as any));
    if (accionesCol) {
      accionesCol.cellTemplate = this.actionsTemplate;
    }
    const bloqueadaCol = this.colsAsentamiento.find(c => c.key === 'estatus');
    if (bloqueadaCol) {
      bloqueadaCol.cellTemplate = this.bloqueadaTemplate;
    }
  }

  override cargarDatos(): void {
    this.buscarAsentamientoPaginadoServicio();
  }

  protected override buscarPaginado(): void {
    this.buscarAsentamientoPaginadoServicio();
  }

  private checkIfFiltersApplied(): void {
    this.hasFiltersApplied = Object.keys(this.filtros).length > 0;
  }

  private updateEmptyState(): void {
    this.checkIfFiltersApplied();
  }

  override onPageChange(page: number): void {
    this.pageIndex = page - 1;
    this.buscarAsentamientoPaginadoServicio();
  }

  override onPageSizeChange(size: number): void {
    console.log('Nuevo tamaño de página:', size);
    this.pageSize = size;
    this.buscarAsentamientoPaginadoServicio();
  }

  // Método para consumir el servicio consultar
  buscarAsentamientoPaginadoServicio(): void {
    // Construir parámetros para el servicio
    const params: ConsultaTipoAsentamientoParams = {
      page: this.pageIndex + 1,
      pageSize: this.pageSize
    };

    // Agregar filtros si existen
    if (this.filtros['clave']) params.clave = this.filtros['clave'];
    if (this.filtros['descripcion']) params.descripcion = this.filtros['descripcion'];
    if (this.filtros['usuarioCreacion']) params.usuarioCreacion = this.filtros['usuarioCreacion'];
    if (this.filtros['busqueda']) params.busqueda = this.filtros['busqueda'];
    if (this.filtros['fechaAlta']) params.fechaAlta = this.filtros['fechaAlta'];

    // Agregar ordenamiento
    const sortDirection = this.sortOrder === 'ascend' ? 'ASC' : 'DESC';
    params.sort = `${this.sortField} ${sortDirection}`;

    this.catLocalidadService.consultarTipoAsentamiento(params).subscribe({
      next: (resp: any) => {
        console.log('Respuesta del servicio consultar:', resp);
        
        // Manejar respuesta vacía (204 No Content)
        if (!resp || resp === null) {
          this.data = [];
          this.total = 0;
          
          this.alertType = 'error';
          this.alertMessage = 'No hay datos disponibles';
          this.alertIcon = 'info-circle';
          this.alertDescription = 'No se encontraron registros del catálogo de género';
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
          this.data = datos.map((item: any) => {
            const estatusBoolean = item.estatus === true || item.estatus === 'true';
            
            // Construir nombre completo del usuario y limpiar espacios extras
            let nombreCompleto = '';
            if (item.usuarioCreacion?.nombre) {
              const partes = [
                item.usuarioCreacion.nombre,
                item.usuarioCreacion.aPaterno,
                item.usuarioCreacion.aMaterno
              ].filter(parte => parte && parte.trim());
              nombreCompleto = partes.join(' ').replace(/\s+/g, ' ').trim();
            } else if (typeof item.usuarioCreacion === 'string') {
              nombreCompleto = item.usuarioCreacion.replace(/\s+/g, ' ').trim();
            }
            
            return {
              totalRegistros: item.totalRegistros,
              id: item.id,
              clave: item.clave || '',
              descripcion: item.descripcion || '',
              fechaAlta: item.fechaAlta,
              usuarioCreacion: nombreCompleto,
              estatus: estatusBoolean,
              estatusTexto: estatusBoolean ? 'SÍ' : 'NO'
            };
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
    this.updateEmptyState();
    this.pageIndex = 0;
    this.buscarAsentamientoPaginadoServicio();
  }

onSortChange(evt: { sorts: { key: string; direction: 'ascend' | 'descend' | null }[] }) {
  const s = (evt.sorts || []).find(x => x.direction);
  if (!s) {
    this.sortField = 'id';
    this.sortOrder = 'ascend';
  } else {
    this.sortField = s.key;
    this.sortOrder = s.direction as any;
  }

  this.pageIndex = 0;
  this.buscarAsentamientoPaginadoServicio();
}

  onFilterChange(filters: Record<string, any>) {
    this.filtros = filters;
    this.updateEmptyState();
    this.buscarAsentamientoPaginadoServicio();
  }

  actualizarTabla(): void {
    this.sortField = 'id';
    this.sortOrder = 'ascend';
    this.filtros = {};
    this.pageIndex = 0;
    this.hasFiltersApplied = false;
    
    if (this.tabla && this.tabla.clearFilters) {
      this.tabla.clearFilters();
    }
    
    this.buscarAsentamientoPaginadoServicio();
  }

  // Abrir modal para nuevo registro
  nuevoAsentamiento(): void {
    const modal = this.modalService.create({
      nzContent: ModalAsentamientoComponent,
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
      if (result?.success) {
        this.alertType = 'success';
        this.alertMessage = 'REGISTRO GUARDADO DE FORMA CORRECTA';
        this.alertIcon = 'check-circle';
        this.showAlert = true;
        this.buscarAsentamientoPaginadoServicio();
        setTimeout(() => {
          this.showAlert = false;
        }, 3000);
      }
    });
  }

  // Exportar a Excel
  exportarExcel(): void {
    const params: ConsultaTipoAsentamientoParams = {
      page: 1,
      pageSize: 10000,
      sort: ''
    };

    if (this.filtros['clave']) params.clave = this.filtros['clave'];
    if (this.filtros['descripcion']) params.descripcion = this.filtros['descripcion'];
    if (this.filtros['usuarioCreacion']) params.usuarioCreacion = this.filtros['usuarioCreacion'];
    if (this.filtros['busqueda']) params.busqueda = this.filtros['busqueda'];
    if (this.filtros['fechaAlta']) params.fechaAlta = this.filtros['fechaAlta'];

    const sortDirection = this.sortOrder === 'ascend' ? 'ASC' : 'DESC';
    params.sort = `${this.sortField} ${sortDirection}`;

    this.catLocalidadService.consultarTipoAsentamiento(params).subscribe({
      next: (resp: any) => {
        console.log(resp);
        const datos = resp.datos || [];
        
        if (Array.isArray(datos) && datos.length > 0) {
          
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
            "Usuario de Creación": item.nombre+' '+item.aPaterno+' '+item.aMaterno || '',
            "Bloqueada": item.estatus ? 'SÍ' : 'NO'
          }));
          
          const options: ExcelReporteOptions = {
            columnas,
            datos: datosExcel,
            nombreArchivo: `Reporte_Tipo_Asentamiento.xlsx`,
            tituloTabla: 'Catálogo Tipo de Asentamiento'
          };
          console.log("options", options);
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

  // Editar asentamiento
  editarAsentamiento(row: any): void {
    const modal = this.modalService.create({
      nzContent: ModalAsentamientoComponent,
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
      if (result?.success) {
        this.alertType = 'success';
        this.alertMessage = 'REGISTRO ACTUALIZADO DE FORMA CORRECTA';
        this.alertIcon = 'check-circle';
        this.showAlert = true;
        this.buscarAsentamientoPaginadoServicio();
        setTimeout(() => {
          this.showAlert = false;
        }, 3000);
      }
    });
  }

  // Ver detalle
  verDetalleAsentamiento(row: any): void {
    const modal = this.modalService.create({
      nzContent: ModalAsentamientoComponent,
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

  // Bloquear/Desbloquear asentamiento
  toggleBloqueo(row: any): void {
    const nuevoEstatus = !row.estatus;
    const accion = nuevoEstatus ? 'BLOQUEAR' : 'DESBLOQUEAR';
    
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
        
        this.catLocalidadService.cambiarEstatusTipoAsentamiento(row.id, nuevoEstatus).subscribe({
          next: (resp: any) => {
            console.log('Respuesta cambiar estatus:', resp);
            (window as any).hideGlobalSpinner?.();
            
            const esExitoso = resp.exito === true || resp.exito === undefined || resp.exito === null;
            
            if (esExitoso && !resp.error) {
              this.alertType = 'success';
              this.alertMessage = 'ESTATUS ACTUALIZADO CORRECTAMENTE';
              this.alertIcon = 'check-circle';
              this.alertDescription = `El asentamiento "${row.clave}" ha sido ${nuevoEstatus ? 'bloqueado' : 'desbloqueado'} exitosamente`;
              this.showAlert = true;
              this.buscarAsentamientoPaginadoServicio();
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

  exportarPdf(): void {
    const params: ConsultaTipoAsentamientoParams = {
      page: 1,
      pageSize: 10000,
      sort: ''
    };

    if (this.filtros['clave']) params.clave = this.filtros['clave'];
    if (this.filtros['descripcion']) params.descripcion = this.filtros['descripcion'];
    if (this.filtros['usuarioCreacion']) params.usuarioCreacion = this.filtros['usuarioCreacion'];
    if (this.filtros['busqueda']) params.busqueda = this.filtros['busqueda'];
    if (this.filtros['fechaAlta']) params.fechaAlta = this.filtros['fechaAlta'];

    const sortDirection = this.sortOrder === 'ascend' ? 'ASC' : 'DESC';
    params.sort = `${this.sortField} ${sortDirection}`;

    this.catLocalidadService.consultarTipoAsentamiento(params).subscribe({
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
            "Usuario de Creación": item.nombre+' '+item.aPaterno+' '+item.aMaterno || '',
            Bloqueada: item.estatus ? 'SÍ' : 'NO'
          }));

          const options: PdfReporteOptions = {
            columnas,
            datos: datosPdf,
            nombreArchivo: 'Reporte_Tipo_Asentamiento.pdf',
            orientacion: 'l',
            titulo: 'Tipo de Asentamiento'
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
