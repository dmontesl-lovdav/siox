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
import { ColumnDef, DynamicTableComponent } from '../../../../../shared/dynamic-table/dynamic-table.component';
import { ExcelExportService } from '../../../../../services/export/excel-export.service';
import { PdfExportService } from '../../../../../services/export/pdf-export.service';
import { GenericAlertComponent } from '../../../../../shared/generic-alert/generic-alert.component';
import { ExcelReporteOptions } from '../../../../../shared/excel-reporte.util';
import { PdfReporteOptions } from '../../../../../shared/pdf-reporte.util';
import { ConfirmationContainerComponent, ConfirmationService } from '../../../../../shared/confirmation-modal';
import { BasePaginatedListadoComponent } from '../../../../../shared/base-paginated-listado.component';
import { CatGenero } from '../../../../../models/cat-genero.model';
import { CatGeneroService, ConsultaGeneroParams } from '../../../../../services/cat-genero.service';
import { BreadcrumbService } from '../../../../../services/breadcrumb.service';
import { ModalGeneroComponent } from '../modal-contable/modal-contable.component';
import { NzSwitchModule } from 'ng-zorro-antd/switch';

// Modelos y servicios

@Component({
  selector: 'app-listado-contable',
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
    NzSwitchModule
  ],
  providers: [NzModalService, ConfirmationService],
  templateUrl: './listado-contable.component.html',
  styleUrls: ['./listado-contable.component.scss']
})
export class ListadoContableComponent extends BasePaginatedListadoComponent implements OnInit, AfterViewInit {
  filtroServicio: Record<string, any> = {};
  // Variables para la alerta genérica
  showAlert = false;
  alertMessage = '';
  alertType: 'success' | 'error' = 'success';
  alertIcon = '';
  alertDescription = '';
  
@ViewChild('tabla', { static: false }) tabla: any;

// ✅ templates que sí vas a usar
@ViewChild('tipoPolizaTemplate', { static: true }) tipoPolizaTemplate: any;
@ViewChild('presupuestalTemplate', { static: true }) presupuestalTemplate: any;
@ViewChild('editarTemplate', { static: true }) editarTemplate: any;
@ViewChild('eliminarTemplate', { static: true }) eliminarTemplate: any;

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
  data: CatGenero[] = [];
  total = 0;

  /** Helper para preservar el literal del key y satisfacer ColumnDef<CatGenero> */
  private makeCol<K extends keyof CatGenero>(
    def: Omit<ColumnDef<CatGenero>, 'key'> & { key: K }
  ): ColumnDef<CatGenero> { return def; }

colsGenero: ColumnDef<CatGenero>[] = [
  this.makeCol({ key: 'clave', title: 'CLAVE', filter: 'text', sortable: true, width: '10px' }),

  // En tu modelo hoy se llama "descripcion"; solo cambiamos el título en pantalla
  this.makeCol({ key: 'descripcion', title: 'MOMENTO CONTABLE', filter: 'text', sortable: true, width: '80px', align: 'left' }),

  // En tu modelo hoy tienes fechaAlta; por ahora solo lo renombramos en UI (sin tocar servicio)
  this.makeCol({
    key: 'fechaAlta',
    title: 'TIPO DE PÓLIZA',
    filter: 'date',
    sortable: true,
    width: '20px',
    type: 'template' // lo pintamos con template para que no se vea "fecha"
  }),

  // En tu data ya tienes estatus boolean, lo usamos como "ES PRESUPUESTAL" (solo UI)
  this.makeCol({
    key: 'estatus',
    title: 'ES PRESUPUESTAL',
    sortable: false,
    width: '20px',
    type: 'template'
  }),

  this.makeCol({
    key: 'editar' as any,
    title: 'EDITAR',
    sortable: false,
    width: '12px',
    type: 'template'
  }),

  this.makeCol({
    key: 'eliminar' as any,
    title: 'ELIMINAR',
    sortable: false,
    width: '12px',
    type: 'template'
  }),
];

constructor(
    private catGeneroService: CatGeneroService,
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
    { nombre: 'CONTROL DE INGRESO' },
    { nombre: 'ADMINISTRADOR CONTABLE DEL INGRESO' },
    { nombre: 'CLASIFICADORES Y CATÁLOGOS' },
    { nombre: 'CATÁLOGO DE APOYO' },
    { nombre: 'MOMENTO CONTABLE', actual: true }
  ]);

  this.buscarGeneroPaginadoServicio();
}

ngAfterViewInit(): void {
  const tipoPolizaCol = this.colsGenero.find(c => c.key === 'fechaAlta');
  if (tipoPolizaCol) tipoPolizaCol.cellTemplate = this.tipoPolizaTemplate;

  const presupCol = this.colsGenero.find(c => c.key === 'estatus');
  if (presupCol) presupCol.cellTemplate = this.presupuestalTemplate;

  const editarCol = this.colsGenero.find(c => c.key === ('editar' as any));
  if (editarCol) editarCol.cellTemplate = this.editarTemplate;

  const eliminarCol = this.colsGenero.find(c => c.key === ('eliminar' as any));
  if (eliminarCol) eliminarCol.cellTemplate = this.eliminarTemplate;
}

override cargarDatos(): void {
  this.buscarGeneroPaginadoServicio();
}

protected override buscarPaginado(): void {
  this.buscarGeneroPaginadoServicio();
}

  // Método para consumir el servicio consultar
  buscarGeneroPaginadoServicio(): void {
    // Construir parámetros para el servicio
    const params: ConsultaGeneroParams = {
      page: this.pageIndex + 1,
      pageSize: this.pageSize
    };

    // Agregar filtros si existen
    if (this.filtros['clave']) {
      params.clave = this.filtros['clave'];
    }
    if (this.filtros['descripcion']) {
      params.descripcion = this.filtros['descripcion'];
    }
    if (this.filtros['fechaAlta']) {
      // Convertir fecha a formato YYYY-MM-DD
      const fecha = new Date(this.filtros['fechaAlta']);
      params.fechaAlta = fecha.toISOString().split('T')[0];
    }

    // Agregar ordenamiento
    const sortDirection = this.sortOrder === 'ascend' ? 'ASC' : 'DESC';
    params.sort = `${this.sortField} ${sortDirection}`;

    this.catGeneroService.consultar(params).subscribe({
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
          console.log('Primer elemento antes de mapear:', datos[0]);
          this.data = datos.map((item: any) => {
            const estatusBoolean = item.estatus === true || item.estatus === 'true';
            
            return {
              totalRegistros: item.totalRegistros,
              id: item.id,
              clave: item.clave || '',
              descripcion: item.descripcion || '',
              fechaAlta: item.fechaAlta,
              usuarioCreacion: item.usuarioCreacion || '',
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
  nuevoMomento(): void {
    const modal = this.modalService.create({
      nzTitle: 'NUEVO MOMENTO CONTABLE',
      nzContent: ModalGeneroComponent,
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
        this.alertDescription = result.message || 'El momento contable ha sido creado correctamente';
        this.showAlert = true;
        this.buscarGeneroPaginadoServicio();
      }
    });
  }

  // Exportar a Excel
  exportarExcel(): void {
    const params: ConsultaGeneroParams = {
      page: 1,
      pageSize: 10000
    };

    if (this.filtros['clave']) {
      params.clave = this.filtros['clave'];
    }
    if (this.filtros['descripcion']) {
      params.descripcion = this.filtros['descripcion'];
    }
    if (this.filtros['fechaAlta']) {
      const fecha = new Date(this.filtros['fechaAlta']);
      params.fechaAlta = fecha.toISOString().split('T')[0];
    }

    const sortDirection = this.sortOrder === 'ascend' ? 'ASC' : 'DESC';
    params.sort = `${this.sortField} ${sortDirection}`;

    this.catGeneroService.consultar(params).subscribe({
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
            nombreArchivo: `Reporte_Catalogo_Momento_Contable.xlsx`,
            tituloTabla: 'Catálogo Momento Contable'
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
      nzTitle: 'EDITAR MOMENTO CONTABLE',
      nzContent: ModalGeneroComponent,
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
      nzTitle: 'DETALLE DE MOMENTO CONTABLE',
      nzContent: ModalGeneroComponent,
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
        
        this.catGeneroService.cambiarEstatus(row.id, nuevoEstatus).subscribe({
          next: (resp: any) => {
            console.log('Respuesta cambiar estatus:', resp);
            (window as any).hideGlobalSpinner?.();
            
            const esExitoso = resp.exito === true || resp.exito === undefined || resp.exito === null;
            
            if (esExitoso && !resp.error) {
              this.alertType = 'success';
              this.alertMessage = 'Estatus actualizado';
              this.alertIcon = 'check-circle';
              this.alertDescription = `El género "${row.clave}" ha sido ${nuevoEstatus ? 'bloqueado' : 'desbloqueado'} exitosamente`;
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

  eliminarMomento(row: any): void {
  this.confirmationService.confirm({
    title: 'ELIMINAR REGISTRO',
    message: `¿CONFIRMA QUE DESEA ELIMINAR EL REGISTRO "${row.clave}"?`,
    type: 'warning',
    confirmText: 'SÍ, ELIMINAR',
    cancelText: 'NO',
    width: '520px'
  }).subscribe(result => {
    if (result.confirmed) {
      this.alertType = 'success';
      this.alertMessage = 'Acción pendiente';
      this.alertIcon = 'info-circle';
      this.alertDescription = 'La eliminación se configurará cuando se conecte el servicio.';
      this.showAlert = true;
    }
  });
}

  exportarPdf(): void {
    const params: ConsultaGeneroParams = {
      page: 1,
      pageSize: 10000
    };

    this.catGeneroService.consultar(params).subscribe({
      next: (resp: any) => {
        const datos = resp.datos || [];
        
        if (Array.isArray(datos) && datos.length > 0) {
          const columnas = [
            'Clave',
            'Descripción',
            'Fecha Alta',
            'Usuario de Creación'
          ];

          const datosPdf = datos.map((item: any) => ({
            Clave: item.clave || '',
            Descripción: item.descripcion || '',
            'Fecha Alta': item.fechaAlta || '',
            'Usuario de Creación': item.usuarioCreacion || ''
          }));

          const options: PdfReporteOptions = {
            columnas,
            datos: datosPdf,
            nombreArchivo: 'Reporte_Momento_Contable.pdf',
            orientacion: 'l',
            titulo: 'Momento Contable'
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
