import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';

// NG ZORRO (si usas botones/iconos arriba)
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';

// Tabla compartida
import { BasePaginatedListadoComponent } from '../../../shared/base-paginated-listado.component';
import { EstructuraCuentas } from '../../../models/estructura-cuentas.model';
import { BreadcrumbService } from '../../../services/breadcrumb.service';
import { ConsultaEstructuraParams, EstructuraCuentasService } from '../../../services/estructura-cuentas.service';
import { ConfirmationContainerComponent } from '../../../shared/confirmation-modal/confirmation-container.component';
import { ConfirmationService } from '../../../shared/confirmation-modal/confirmation.service';
import {
  ColumnDef,
  DynamicTableComponent
} from '../../../shared/dynamic-table/dynamic-table.component';
import { ExcelExportService } from '../../../services/export/excel-export.service';
import { GenericAlertComponent } from '../../../shared/generic-alert/generic-alert.component';
import { ExcelReporteOptions } from '../../../shared/excel-reporte.util';

@Component({
  selector: 'app-listado-estructura-cuenta',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzButtonModule,
    NzDropDownModule,
    NzIconModule,
    NzTagModule,
    NzSelectModule,
    NzInputModule,
    NzSwitchModule,
    NzTooltipModule,
    DynamicTableComponent,
    GenericAlertComponent,
    ConfirmationContainerComponent,
  ],
  providers: [NzModalService, ConfirmationService],
  templateUrl: './listado-estructura-cuenta.component.html',
  styleUrls: ['./listado-estructura-cuenta.component.scss']
})
export class ListadoEstructuraCuentaComponent extends BasePaginatedListadoComponent implements OnInit, AfterViewInit {
  filtroServicio: Record<string, any> = {};
  // Variables para la alerta genérica
  showAlert = false;
  alertMessage = '';
  alertType: 'success' | 'error' = 'success';
  alertIcon = '';
  alertDescription = '';
  alertDownloadLink = '';
  
  // Referencia a la tabla y al template de acciones
  @ViewChild('tabla', { static: false }) tabla: any;
  @ViewChild('actionsTemplate', { static: true }) actionsTemplate: any;
  @ViewChild('bloqueadaTemplate', { static: true }) bloqueadaTemplate: any;
  @ViewChild('visibleTemplate', { static: true }) visibleTemplate: any;
  
  // Método para cerrar la alerta
  closeAlert() {
    this.showAlert = false;
    this.alertMessage = '';
    this.alertType = 'success';
    this.alertIcon = '';
    this.alertDescription = '';
    this.alertDownloadLink = '';
  }
  
  // Variables para búsqueda y paginación
  searchText = '';
  sortField = 'id ASC'; // Ahora puede ser string múltiple
  sortOrder: 'ascend' | 'descend' = 'ascend'; // Se mantiene para compatibilidad visual
  
  sortKey: string | null = null;
  sortDir: 'ascend' | 'descend' | null = null;
  filtros: Record<string, any> = {};
  override pageIndex = 0;
  override pageSize = 10;

  // Datos para la tabla
  data: EstructuraCuentas[] = [];
  total = 0;

  /** Helper para preservar el literal del key y satisfacer ColumnDef<EstructuraCuentas> */
  private makeCol<K extends keyof EstructuraCuentas>(
    def: Omit<ColumnDef<EstructuraCuentas>, 'key'> & { key: K }
  ): ColumnDef<EstructuraCuentas> { return def; }

  colsEstructura: ColumnDef<EstructuraCuentas>[] = [
    this.makeCol({ key: 'id', title: 'ID', filter: 'text', sortable: true, width: '80px' }),
    this.makeCol({ key: 'descripcionEstructura', title: 'DESCRIPCIÓN DE LA ESTRUCTURA', filter: 'text', sortable: true, width: '250px' }),
    this.makeCol({ key: 'niveles', title: 'NIVELES', filter: 'text', sortable: true, width: '100px' }),
    this.makeCol({ key: 'longitud', title: 'LONGITUD TOTAL', filter: 'text', sortable: true, width: '150px' }),
    this.makeCol({ key: 'secuencia', title: 'EJEMPLO', filter: 'text', sortable: false, width: '200px' }),
    this.makeCol({ 
      key: 'estatus', 
      title: 'BLOQUEADA', 
      sortable: false, 
      width: '120px',
      type: 'template'
    }),
    this.makeCol({ 
      key: 'visible', 
      title: 'VISIBLE', 
      sortable: false, 
      width: '120px',
      type: 'template'
    }),
  ];
  modalVisible = false;
  registroSeleccionado: any = null;
  origenSeleccionado: string = '';

  constructor(
    private estructuraCuentasService: EstructuraCuentasService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private cdr: ChangeDetectorRef,
    private breadcrumbService: BreadcrumbService,
    private excelExportService: ExcelExportService
  ) {
    super();
  }

  ngOnInit(): void {
    this.breadcrumbService.setBreadcrumbReplace([
      { nombre: 'CONTROL DE INGRESO' },
      { nombre: 'ADMINISTRADOR CONTABLE DEL INGRESO' },
      { nombre: 'CLASIFICADORES Y CATÁLOGOS' },
      { nombre: 'ESTRUCTURA DE CUENTAS', actual: true }
    ]);

    this.buscarClasificadorPaginadoServicio();
  }

  ngAfterViewInit(): void {
    // Asignar templates a las columnas después de que se inicialice la vista
    const bloqueadaCol = this.colsEstructura.find(c => c.key === 'estatus');
    if (bloqueadaCol) {
      bloqueadaCol.cellTemplate = this.bloqueadaTemplate;
    }
    
    const visibleCol = this.colsEstructura.find(c => c.key === 'visible');
    if (visibleCol) {
      visibleCol.cellTemplate = this.visibleTemplate;
    }
  }

  override cargarDatos(): void {
    this.buscarClasificadorPaginadoServicio();
  }

  protected override buscarPaginado(): void {
    this.buscarClasificadorPaginadoServicio();
  }

  // --------- acciones de UI ---------
    // Método para consumir el servicio consultar (Estructura de Cuentas)
  buscarClasificadorPaginadoServicio(): void {
    
    // Construir parámetros para el servicio
    const params: ConsultaEstructuraParams = {
      page: this.pageIndex + 1, // El servicio usa paginación 1-based
      pageSize: this.pageSize
    };

    // Agregar filtros si existen
    if (this.filtros['descripcionEstructura']) {
      params.descripcion = this.filtros['descripcionEstructura'];
    }
    if (this.filtros['niveles']) {
      params.niveles = parseInt(this.filtros['niveles']);
    }
    if (this.filtros['longitud']) {
      params.longitud = parseInt(this.filtros['longitud']);
    }
    if (this.filtros['visible']) {
      params.visible = this.filtros['visible'] === 'true';
    }
    if (this.filtros['estatus']) {
      params.estatus = this.filtros['estatus'] === 'true';
    }

    // Agregar ordenamiento (multi-sort)
    params.sort = this.sortField || 'id ASC';

    this.estructuraCuentasService.consultar(params).subscribe({
      next: (resp: any) => {
        console.log('Respuesta del servicio consultar:', resp);
        
        // Manejar respuesta vacía (204 No Content)
        if (!resp || resp === null) {
          this.data = [];
          this.total = 0;
          
          this.alertType = 'error';
          this.alertMessage = 'No hay datos disponibles';
          this.alertIcon = 'info-circle';
          this.alertDescription = 'No se encontraron registros de estructura de cuentas';
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
            const visibleBoolean = item.visible === true || item.visible === 'true';
            
            return {
              totalRegistros: item.totalRegistros,
              id: item.id,
              descripcionEstructura: item.descripcionEstructura || '',
              n1: item.n1,
              desN1: item.desN1,
              n2: item.n2,
              desN2: item.desN2,
              n3: item.n3,
              desN3: item.desN3,
              n4: item.n4,
              desN4: item.desN4,
              n5: item.n5,
              desN5: item.desN5,
              n6: item.n6,
              desN6: item.desN6,
              secuencia: item.secuencia || '',
              longitud: item.longitud,
              niveles: item.niveles,
              fechaCreacion: item.fechaCreacion,
              estatus: estatusBoolean ? 'SÍ' : 'NO', // Convertir a texto para el tag
              visible: visibleBoolean ? 'SÍ' : 'NO', // Convertir a texto para el tag
              bloqueadaTexto: estatusBoolean ? 'SÍ' : 'NO',
              visibleTexto: visibleBoolean ? 'SÍ' : 'NO',
              visibleBoolean: visibleBoolean // Para el switch
            };
          });
          
          // Total de registros para paginación
          this.total = resp.total || datos.length;
        } else {
          // Caso cuando el array está vacío o no es un array
          this.data = [];
          this.total = 0;
          
          this.alertType = 'error';
          this.alertMessage = 'No se encontraron registros';
          this.alertIcon = 'info-circle';
          this.alertDescription = 'No hay estructura de cuentas con los filtros aplicados';
          this.showAlert = true;
        }
        
        // Siempre ocultar el spinner al final
      },
      error: (error: any) => {
        console.error('Error al consultar estructura de cuentas:', error);
        this.data = [];
        this.total = 0;
        
        // Mostrar alerta de error
        this.alertType = 'error';
        this.alertMessage = 'Error al consultar el catálogo';
        this.alertIcon = 'close-circle';
        this.alertDescription = error.error?.error || 'No se pudieron cargar los datos del catálogo de estructura de cuentas';
        this.showAlert = true;
      }
    });
  }
  onFiltroServicioChange(filtros: Record<string, string>): void {
    // Guardar filtros
    this.filtros = filtros;
    this.pageIndex = 0; // Resetear a la primera página cuando se aplican filtros
    this.buscarClasificadorPaginadoServicio();
  }

  onSortChange(evt: { sorts: { key: string; direction: 'ascend' | 'descend' | null }[] }) {
    // Filtrar los direction null
    const validSorts = (evt.sorts || []).filter(s => s.direction === 'ascend' || s.direction === 'descend');
    // Construir string múltiple para el backend
    const sortValue = validSorts.map(s => {
      let dir = s.direction === 'ascend' ? 'ASC' : 'DESC';
      return `${s.key} ${dir}`;
    }).join(', ');
    this.sortField = sortValue || 'id ASC';
    // Para compatibilidad visual, mantener sortOrder con la primera columna
    if (validSorts.length > 0) {
      this.sortOrder = validSorts[0].direction || 'ascend';
    } else {
      this.sortOrder = 'ascend';
    }
    console.log('Orden múltiple:', this.sortField);
    this.buscarClasificadorPaginadoServicio();
  }

  onFilterChange(filters: Record<string, any>) {
    this.filtros = filters;
        this.buscarClasificadorPaginadoServicio();
  }
    actualizarTabla(): void {
      // Limpiar todos los filtros
      this.searchText = '';
      this.sortField = 'id';
      this.sortOrder = 'ascend';
      this.filtros = {};
      this.pageIndex = 0;
      this.sortKey = null;
      this.sortDir = null;
      
      // Limpiar los filtros visuales de la tabla
      if (this.tabla && this.tabla.clearFilters) {
        this.tabla.clearFilters();
      }
      
      this.buscarClasificadorPaginadoServicio();
    }
  // Exportar a Excel usando los datos del servicio
  nuevaEstructura(): void {
    this.router.navigate(['/estructura-cuenta/nueva']);
  }

  exportarExcel(): void {
    
    // Construir parámetros para exportar todos los datos
    const params: ConsultaEstructuraParams = {
      page: 1,
      pageSize: 10000 // Obtener todos los registros
    };

    // Agregar filtros actuales
    if (this.filtros['descripcionEstructura']) {
      params.descripcion = this.filtros['descripcionEstructura'];
    }
    if (this.filtros['niveles']) {
      params.niveles = parseInt(this.filtros['niveles']);
    }
    if (this.filtros['longitud']) {
      params.longitud = parseInt(this.filtros['longitud']);
    }
    if (this.filtros['visible']) {
      params.visible = this.filtros['visible'] === 'true';
    }
    if (this.filtros['estatus']) {
      params.estatus = this.filtros['estatus'] === 'true';
    }

    // Agregar ordenamiento actual (multi-sort)
    params.sort = this.sortField || 'id ASC';

    this.estructuraCuentasService.consultar(params).subscribe({
      next: (resp: any) => {
        const datos = resp.datos || [];
        
        if (Array.isArray(datos) && datos.length > 0) {
          // Encabezados institucionales
          const encabezados = [
            ["LOGO_IZQUIERDA", "", "LOGO_DERECHA"],
            ["", "Subsecretaría de Ingresos", ""],
            ["", "Dirección de Ingresos y Recaudación", ""],
            ["", "Coordinación Técnica de Ingresos", ""],
            ["", "Estructura de Cuentas", ""],
          ];
          
          // Columnas para Estructura de Cuentas
          const columnas = [
            "ID",
            "Descripción de la Estructura",
            "Niveles",
            "Longitud Total",
            "Ejemplo",
            "Bloqueada",
            "Visible"
          ];
          
          // Mapear datos del servicio
          const datosExcel = datos.map((item: any) => ({
            "ID": item.id || '',
            "Descripción de la Estructura": item.descripcionEstructura || '',
            "Niveles": item.niveles || '',
            "Longitud Total": item.longitud || '',
            "Ejemplo": item.secuencia || '',
            "Bloqueada": item.estatus ? 'SÍ' : 'NO',
            "Visible": item.visible ? 'SÍ' : 'NO'
          }));
          
          const options: ExcelReporteOptions = {
            columnas,
            datos: datosExcel,
            nombreArchivo: `Reporte_Estructura_Cuentas.xlsx`,
            tituloTabla: 'Catálogo Estructura de Cuentas'
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
          
          // Mostrar alerta si no hay datos
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

  // Métodos para las acciones
  editarEstructura(row: any): void {
    console.log('Editar estructura:', row);
    // Navegar a la página de edición con el ID
    this.router.navigate(['/estructura-cuenta/editar', row.id]);
  }

  verDetalle(row: any): void {
    console.log('Ver detalle:', row);
    // Navegar a la página de detalle con el ID
    this.router.navigate(['/estructura-cuenta/detalle', row.id]);
  }

  eliminarEstructura(row: any): void {
    console.log('Eliminar estructura:', row);
    
    this.confirmationService.confirm({
      title: 'ELIMINAR REGISTRO',
      message: `¿CONFIRMA QUE DESEA ELIMINAR LA ESTRUCTURA "${row.descripcionEstructura}"?`,
      type: 'error',
      confirmText: 'SÍ, ELIMINAR',
      cancelText: 'NO',
      width: '520px'
    }).subscribe(result => {
      if (result.confirmed) {
        // Usuario confirmó - proceder con la eliminación
        (window as any).showGlobalSpinner?.();
        
        this.estructuraCuentasService.delete(row.id).subscribe({
          next: (resp: any) => {
            console.log('Respuesta delete:', resp);
            (window as any).hideGlobalSpinner?.();
            
            // Verificar si la respuesta fue exitosa
            const esExitoso = resp.exito === true || resp.exito === undefined || resp.exito === null;
            
            if (esExitoso && !resp.error) {
              this.alertType = 'success';
              this.alertMessage = 'Registro eliminado';
              this.alertIcon = 'check-circle';
              this.alertDescription = `La estructura "${row.descripcionEstructura}" ha sido eliminada exitosamente`;
              this.showAlert = true;
              
              // Recargar la tabla para reflejar los cambios
              this.buscarClasificadorPaginadoServicio();
            } else {
              this.alertType = 'error';
              this.alertMessage = 'Error al eliminar';
              this.alertIcon = 'close-circle';
              this.alertDescription = resp.mensaje || resp.error || 'No se pudo eliminar la estructura';
              this.showAlert = true;
            }
          },
          error: (error: any) => {
            console.error('Error al eliminar estructura:', error);
            (window as any).hideGlobalSpinner?.();
            
            this.alertType = 'error';
            this.alertMessage = 'Error al eliminar';
            this.alertIcon = 'close-circle';
            this.alertDescription = error.error?.error || error.message || 'No se pudo eliminar la estructura';
            this.showAlert = true;
          }
        });
      } else {
        // Usuario canceló
        console.log('Usuario canceló la eliminación');
      }
    });
  }

 onVisibleChange(row: any, value: boolean): void {
  const valorOriginal = row.visibleBoolean;

  // Revertir inmediatamente antes de pintar
  row.visibleBoolean = valorOriginal;


  this.cdr.detectChanges();

  const title = value ? 'MOSTRAR REGISTRO' : 'OCULTAR REGISTRO';
  const message = value
    ? '¿CONFIRMA QUE DESEA MOSTRAR EL REGISTRO?'
    : '¿CONFIRMA QUE DESEA OCULTAR EL REGISTRO?';

  this.confirmationService.confirm({
    title,
    message,
    type: 'warning',
    confirmText: 'SÍ',
    cancelText: 'NO',
    width: '520px'
  }).subscribe(result => {

    if (!result.confirmed) {
      // 🔥 Revertir y re-renderizar
      row.visibleBoolean = valorOriginal;
      row._renderVisible = false;
      this.cdr.detectChanges();
      row._renderVisible = true;
      this.cdr.detectChanges();
      return;
    }

    // Confirmado → guardar en backend
    this.estructuraCuentasService.updateVisible(row.id, value).subscribe({
      next: () => {
        row.visibleBoolean = value;
        row._renderVisible = false;
        this.cdr.detectChanges();
        row._renderVisible = true;
        this.cdr.detectChanges();
      },
      error: () => {
        // Error → volver al estado original
        row.visibleBoolean = valorOriginal;
        row._renderVisible = false;
        this.cdr.detectChanges();
        row._renderVisible = true;
        this.cdr.detectChanges();
      }
    });

  });
}

 
}




