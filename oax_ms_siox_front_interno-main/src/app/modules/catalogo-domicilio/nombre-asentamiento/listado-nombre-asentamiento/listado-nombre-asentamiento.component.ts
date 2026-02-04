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

import { CatNombreAsentamientoDTO, ConsultaNombreAsentamientoParams } from '../../../../models/cat-nombre-asentamiento.model';
import { BreadcrumbService } from '../../../../services/breadcrumb.service';
import { CatDomicilioService } from '../../../../services/cat-pais.service';
import { ConfirmationContainerComponent, ConfirmationService } from '../../../../shared/confirmation-modal';
import { ColumnDef, DynamicTableComponent } from '../../../../shared/dynamic-table/dynamic-table.component';
import { ExcelExportService } from '../../../../services/export/excel-export.service';
import { PdfExportService } from '../../../../services/export/pdf-export.service';
import { GenericAlertComponent } from '../../../../shared/generic-alert/generic-alert.component';
import { ExcelReporteOptions } from '../../../../shared/excel-reporte.util';
import { PdfReporteOptions } from '../../../../shared/pdf-reporte.util';
import { ModalNombreAsentamientoComponent } from '../modal-nombre-asentamiento/modal-nombre-asentamiento.component';

@Component({
  selector: 'app-listado-nombre-asentamiento',
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
  templateUrl: './listado-nombre-asentamiento.component.html',
  styleUrls: ['./listado-nombre-asentamiento.component.scss']
})
export class ListadoNombreAsentamientoComponent implements OnInit, AfterViewInit {
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
  data: CatNombreAsentamientoDTO[] = [];
  total = 0;

  /** Helper para preservar el literal del key y satisfacer ColumnDef<CatNombreAsentamientoDTO> */
  private makeCol<K extends keyof CatNombreAsentamientoDTO>(
    def: Omit<ColumnDef<CatNombreAsentamientoDTO>, 'key'> & { key: K }
  ): ColumnDef<CatNombreAsentamientoDTO> { return def; }

  colsNombreAsentamiento: ColumnDef<CatNombreAsentamientoDTO>[] = [
    this.makeCol({
      key: 'clave',
      title: 'CLAVE',
      filter: 'text',
      sortable: true,
      width: '120px',
      align: 'center'
    }),
    this.makeCol({
      key: 'descripcion',
      title: 'DESCRIPCIÓN',
      filter: 'text',
      sortable: true,
      width: '300px',
      align: 'center'
    }),
    this.makeCol({
      key: 'fechaAlta',
      title: 'FECHA ALTA',
      filter: 'date',
      sortable: true,
      width: '160px',
      type: 'date',
      align: 'center'
    }),
    this.makeCol({
      key: 'usuarioCreacion',
      title: 'USUARIO DE CREACIÓN',
      filter: 'text',
      sortable: true,
      width: '200px',
      align: 'center'
    }),
    this.makeCol({
      key: 'acciones' as any,
      title: 'EDITAR / CONSULTAR',
      sortable: false,
      width: '160px',
      type: 'template',
      align: 'center'
    }),
    this.makeCol({
      key: 'estatus',
      title: 'BLOQUEAR',
      type: 'template',
      sortable: false,
      filter: 'select',
      selectOptions: [
        { label: 'BLOQUEADO', value: 'true' },
        { label: 'DESBLOQUEADO', value: 'false' }
      ],
      width: '140px',
      align: 'center',
      cellTemplate: null
    })
  ];


  constructor(
    private catDomicilioService: CatDomicilioService,
    private modalService: NzModalService,
    private confirmationService: ConfirmationService,
    private breadcrumbService: BreadcrumbService,
    private excelExportService: ExcelExportService,
    private pdfExportService: PdfExportService
  ) {}

  ngOnInit(): void {
    this.breadcrumbService.setBreadcrumbReplace([
      { nombre: 'ADMINISTRACIÓN DE CONTRIBUYENTES' },
      { nombre: 'ADMINISTRADOR DE CATÁLOGOS DE CONTRIBUYENTES' },
      { nombre: 'CATÁLOGOS PARA DOMICILIO' },
      { nombre: 'ADMINISTRADOR DE CATÁLOGO DE NOMBRE DE ASENTAMIENTO', actual: true }
    ]);
    this.buscarNombreAsentamientoPaginadoServicio();
  }

  ngAfterViewInit(): void {
    // Asignar template a la columna de acciones y bloqueada
    const accionesCol = this.colsNombreAsentamiento.find(c => c.key === ('acciones' as any));
    if (accionesCol) {
      accionesCol.cellTemplate = this.actionsTemplate;
    }
    const bloqueadaCol = this.colsNombreAsentamiento.find(c => c.key === 'estatus');
    if (bloqueadaCol) {
      bloqueadaCol.cellTemplate = this.bloqueadaTemplate;
    }
  }

  onPageChange(page: number): void {
    this.pageIndex = page - 1;
    this.buscarNombreAsentamientoPaginadoServicio();
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.buscarNombreAsentamientoPaginadoServicio();
  }

  // Método para consumir el servicio consultar
  buscarNombreAsentamientoPaginadoServicio(): void {
    const params: ConsultaNombreAsentamientoParams = {
      page: this.pageIndex + 1,
      pageSize: this.pageSize,
      sort: `${this.sortField} ${this.sortOrder === 'ascend' ? 'ASC' : 'DESC'}`
    };
    if (this.filtros['clave']) {
      params.busqueda = this.filtros['clave'];
    }
    if (this.filtros['descripcion']) {
      params.busqueda = this.filtros['descripcion'];
    }
    this.catDomicilioService.consultarNombreAsentamiento(params).subscribe({
      next: (resp: any) => {
        const datos: CatNombreAsentamientoDTO[] = resp.datos || [];
        if (Array.isArray(datos) && datos.length > 0) {
          this.data = datos.map((item) => {
            const estatusBoolean = item.estatus === true || item.estatus === 'true';
            return {
              ...item,
              estatus: estatusBoolean,
              estatusTexto: estatusBoolean ? 'SÍ' : 'NO'
            };
          });
          this.total = resp.total || datos.length;
        } else {
          this.data = [];
          this.total = 0;
          this.alertType = 'error';
          this.alertMessage = 'No se encontraron registros';
          this.alertIcon = 'info-circle';
          this.alertDescription = 'No hay nombres de asentamiento con los filtros aplicados';
          this.showAlert = true;
        }
      },
      error: (error: any) => {
        this.data = [];
        this.total = 0;
        this.alertType = 'error';
        this.alertMessage = 'Error al consultar el catálogo';
        this.alertIcon = 'close-circle';
        this.alertDescription = error.error?.error || 'No se pudieron cargar los datos del catálogo de nombres de asentamiento';
        this.showAlert = true;
      }
    });
  }

  onFiltroServicioChange(filtros: Record<string, string>): void {
    this.filtros = filtros;
    this.pageIndex = 0;
    this.buscarNombreAsentamientoPaginadoServicio();
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
    this.buscarNombreAsentamientoPaginadoServicio();
  }

  onFilterChange(filters: Record<string, any>) {
    this.filtros = filters;
    this.buscarNombreAsentamientoPaginadoServicio();
  }

  actualizarTabla(): void {
    this.sortField = 'id';
    this.sortOrder = 'ascend';
    this.filtros = {};
    this.pageIndex = 0;
    if (this.tabla && this.tabla.clearFilters) {
      this.tabla.clearFilters();
    }
    this.buscarNombreAsentamientoPaginadoServicio();
  }

  // Abrir modal para nuevo registro
  nuevoNombreAsentamiento(): void {
    const modal = this.modalService.create({
      nzTitle: 'NUEVO REGISTRO DEL CATÁLOGO NOMBRE DE ASENTAMIENTO',
      nzContent: ModalNombreAsentamientoComponent,
      nzWidth: 600,
      nzFooter: null,
      nzClosable: true,
      nzMaskClosable: false,
      nzData: {
        modo: 'crear',
        nombreAsentamiento: null,
        confirmationService: this.confirmationService
      }
    });

    modal.afterClose.subscribe((result: any) => {
      if (result && result.success) {
        this.alertType = 'success';
        this.alertMessage = 'Registro guardado exitosamente';
        this.alertIcon = 'check-circle';
        this.alertDescription = result.message || 'El nombre de asentamiento ha sido creado correctamente';
        this.showAlert = true;
        this.buscarNombreAsentamientoPaginadoServicio();
      }
    });
  }

  // Exportar a Excel
  exportarExcel(): void {
    const params: ConsultaNombreAsentamientoParams = {
      page: 1,
      pageSize: 10000
    };

    
    if (this.filtros['busqueda']) {
      params.busqueda = this.filtros['busqueda'];
    }
    

    const sortDirection = this.sortOrder === 'ascend' ? 'ASC' : 'DESC';
    params.sort = `${this.sortField} ${sortDirection}`;

    this.catDomicilioService.consultarNombreAsentamiento(params).subscribe({
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
            nombreArchivo: `Reporte_Nombre_Asentamiento.xlsx`,
            tituloTabla: 'Catálogo Nombre Asentamiento'
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

  // Editar nombre de asentamiento
  editarNombreAsentamiento(row: any): void {
    const modal = this.modalService.create({
      nzTitle: 'EDITAR REGISTRO DEL CATÁLOGO NOMBRE DE ASENTAMIENTO',
      nzContent: ModalNombreAsentamientoComponent,
      nzWidth: 600,
      nzFooter: null,
      nzClosable: true,
      nzMaskClosable: false,
      nzData: {
        modo: 'editar',
        nombreAsentamiento: row,
        confirmationService: this.confirmationService
      }
    });

    modal.afterClose.subscribe((result: any) => {
      if (result && result.success) {
        this.alertType = 'success';
        this.alertMessage = 'Registro actualizado exitosamente';
        this.alertIcon = 'check-circle';
        this.alertDescription = result.message || 'El nombre de asentamiento ha sido actualizado correctamente';
        this.showAlert = true;
        this.buscarNombreAsentamientoPaginadoServicio();
      }
    });
  }

  // Ver detalle
  verDetalleNombreAsentamiento(row: any): void {
    const modal = this.modalService.create({
      nzTitle: 'DETALLE DEL CATÁLOGO NOMBRE DE ASENTAMIENTO',
      nzContent: ModalNombreAsentamientoComponent,
      nzWidth: 600,
      nzFooter: null,
      nzClosable: true,
      nzMaskClosable: false,
      nzData: {
        modo: 'consultar',
        nombreAsentamiento: row,
        confirmationService: this.confirmationService
      }
    });
  }

  // Bloquear/Desbloquear nombre de asentamiento
  toggleBloqueoNombreAsentamiento(row: any): void {
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
        this.catDomicilioService.cambiarEstatusTipoAsentamiento(row.id, nuevoEstatus).subscribe({
          next: (resp: any) => {
            (window as any).hideGlobalSpinner?.();
            const esExitoso = resp.exito === true || resp.exito === undefined || resp.exito === null;
            if (esExitoso && !resp.error) {
              this.alertType = 'success';
              this.alertMessage = 'Estatus actualizado';
              this.alertIcon = 'check-circle';
              this.alertDescription = `El nombre de asentamiento "${row.clave}" ha sido ${nuevoEstatus ? 'bloqueado' : 'desbloqueado'} exitosamente`;
              this.showAlert = true;
              this.buscarNombreAsentamientoPaginadoServicio();
            } else {
              this.alertType = 'error';
              this.alertMessage = 'Error al actualizar estatus';
              this.alertIcon = 'close-circle';
              this.alertDescription = resp.mensaje || resp.error || 'No se pudo actualizar el estatus';
              this.showAlert = true;
            }
          },
          error: (error: any) => {
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
    const params: ConsultaNombreAsentamientoParams = {
      page: 1,
      pageSize: 10000
    };

    this.catDomicilioService.consultarNombreAsentamiento(params).subscribe({
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
            nombreArchivo: 'Reporte_Nombre_Asentamiento.pdf',
            orientacion: 'l',
            titulo: 'Nombre de Asentamiento'
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
