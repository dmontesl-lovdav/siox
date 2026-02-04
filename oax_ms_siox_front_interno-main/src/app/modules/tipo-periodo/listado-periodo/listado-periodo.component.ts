import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';

// NG ZORRO (si usas botones/iconos arriba)
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';

// Base
import { BasePaginatedListadoComponent } from '../../../shared/base-paginated-listado.component';
import { CatalogoPeriodo } from '../../../models/catalogo-periodo.model';
import { BreadcrumbService } from '../../../services/breadcrumb.service';
import { CatalogoPeriodoService, ConsultaPeriodoParams } from '../../../services/catalogo-periodo.service';
import {
  ColumnDef,
  DynamicTableComponent
} from '../../../shared/dynamic-table/dynamic-table.component';
import { ExcelExportService } from '../../../services/export/excel-export.service';
import { PdfExportService } from '../../../services/export/pdf-export.service';
import { ExcelReporteOptions } from '../../../shared/excel-reporte.util';
import { GenericAlertComponent } from '../../../shared/generic-alert/generic-alert.component';

@Component({
  selector: 'app-listado-periodo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzButtonModule,
    NzIconModule,
    NzTagModule,
    NzSelectModule,
    NzInputModule,
    NzTooltipModule,
    DynamicTableComponent,
    GenericAlertComponent
  ],
  providers: [NzModalService],
  templateUrl: './listado-periodo.component.html',
  styleUrls: ['./listado-perido.component.scss']
})
export class ListadoPeriodoComponent extends BasePaginatedListadoComponent implements OnInit {
  // Variables para la alerta genérica
  showAlert = false;
  alertMessage = '';
  alertType: 'success' | 'error' | 'info' = 'success';
  alertIcon = '';
  alertDescription = '';
  alertDownloadLink = '';
  // Método para cerrar la alerta
  closeAlert() {
    this.showAlert = false;
    this.alertMessage = '';
    this.alertType = 'success';
    this.alertIcon = '';
    this.alertDescription = '';
    this.alertDownloadLink = '';
  }

  // Referencia a la tabla para limpiar filtros visuales
  @ViewChild('tabla', { static: false }) tabla: any;
  // Variables para búsqueda y paginación
  searchText = '';
  sortField = 'id ASC'; // Ahora puede ser string múltiple
  sortOrder: 'ascend' | 'descend' = 'ascend'; // Se mantiene para compatibilidad
  
  sortKey: string | null = null;
  sortDir: 'ascend' | 'descend' | null = null;
  filtros: Record<string, any> = {};
  override pageIndex = 0;
  override pageSize = 10;

  // Datos para la tabla
  data: CatalogoPeriodo[] = [];
  total = 0;

  // Columnas configuradas para DynamicTable
 /** Helper para preservar el literal del key y satisfacer ColumnDef<CatalogoConac> */
  private makeCol<K extends keyof CatalogoPeriodo>(
    def: Omit<ColumnDef<CatalogoPeriodo>, 'key'> & { key: K }
  ): ColumnDef<CatalogoPeriodo> { return def; }

  colsConac: ColumnDef<CatalogoPeriodo>[] = [
    this.makeCol({ key: 'id', title: 'ID TIPO PERIODO', filter: 'text', sortable: true, width: '150px' }),
    this.makeCol({ key: 'periodo',        title: 'PERIODO',         filter: 'text', sortable: true, width: '500px'}),
  ];
  modalVisible = false;
  registroSeleccionado: any = null;
  origenSeleccionado: string = '';

  constructor(
    private catalogoPeriodoService: CatalogoPeriodoService,
    private router: Router,
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
      { nombre: 'TIPO DE PERIODO', actual: true }
    ]);

    this.buscarClasificadorPaginadoServicio();
  }

  override cargarDatos(): void {
    this.buscarClasificadorPaginadoServicio();
  }

  protected override buscarPaginado(): void {
    this.buscarClasificadorPaginadoServicio();
  }

  // --------- acciones de UI ---------
    // Método para consumir el servicio consultarConac (Tipo Periodo)
    buscarClasificadorPaginadoServicio(): void {
      
      // Construir parámetros para el servicio
      const params: ConsultaPeriodoParams = {
        page: this.pageIndex + 1, // El servicio usa paginación 1-based
        pageSize: this.pageSize
      };

      // Agregar búsqueda si existe
      if (this.searchText && this.searchText.trim()) {
        params.search = this.searchText.trim();
      }

      // Agregar ordenamiento (multi-sort)
      params.sort = this.sortField || 'id ASC';

      this.catalogoPeriodoService.consultarConac(params).subscribe({
        next: (resp: any) => {
          console.log('Respuesta del servicio consultarConac:', resp);
          // Si resp es null o undefined, controlar y evitar error
          if (resp == null) {
            this.data = [];
            this.total = 0;
            this.alertType = 'info';
            this.alertMessage = 'No hay datos para mostrar';
            this.alertIcon = 'info-circle';
            this.alertDescription = 'No se encontraron registros con los filtros aplicados';
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
          // La respuesta tiene: { exito, mensaje, datos, total, pagina, tamano }
          const datos = resp.datos || [];
          if (Array.isArray(datos)) {
            console.log('Primer elemento antes de mapear:', datos[0]);
            this.data = datos.map((item: any) => ({
              id: item.id || '',
              periodo: item.periodo?.trim() || ''
            }));
            // Total de registros para paginación
            this.total = resp.total || datos.length;
          } else {
            this.data = [];
            this.total = 0;
          }
        },
        error: (error) => {
          console.error('Error al consultar tipo periodo:', error);
          this.data = [];
          this.total = 0;
          // Mostrar alerta de error
          this.alertType = 'error';
          this.alertMessage = 'Error al consultar el catálogo';
          this.alertIcon = 'close-circle';
          this.alertDescription = error.error?.error || 'No se pudieron cargar los datos del catálogo de tipo periodo';
          this.showAlert = true;
        }
      });
    }
    onFiltroServicioChange(filtros: Record<string, string>): void {
      // Construir texto de búsqueda desde los filtros
      const searchTerms: string[] = [];
      
      Object.entries(filtros).forEach(([key, value]) => {
        if (value && value.trim()) {
          searchTerms.push(value.trim());
        }
      });
      
      this.searchText = searchTerms.join(' ');
      this.pageIndex = 0; // Resetear a la primera página cuando se aplican filtros
      this.buscarClasificadorPaginadoServicio();
    }

  onSortChange(evt: { sorts: { key: string; direction: 'ascend' | 'descend' | null }[] }) {
    const validSorts = (evt.sorts || []).filter(s => s.direction === 'ascend' || s.direction === 'descend');
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


  exportarExcel(): void {
    console.log('object');
    
    // Construir parámetros para exportar todos los datos
    const params: ConsultaPeriodoParams = {
      page: 1,
      pageSize: 10000 // Obtener todos los registros
    };

    // Agregar búsqueda si existe
    if (this.searchText && this.searchText.trim()) {
      params.search = this.searchText.trim();
    }

    // Agregar ordenamiento actual (multi-sort)
    params.sort = this.sortField || 'id ASC';

    this.catalogoPeriodoService.consultarConac(params).subscribe({
      next: (resp: any) => {
        const datos = resp.datos || [];
        
        if (Array.isArray(datos) && datos.length > 0) {
          // Encabezados institucionales
          const encabezados = [
            ["LOGO_IZQUIERDA", "", "LOGO_DERECHA"],
            ["", "Subsecretaría de Ingresos", ""],
            ["", "Dirección de Ingresos y Recaudación", ""],
            ["", "Coordinación Técnica de Ingresos", ""],
            ["", "Catálogo Tipo Periodo", ""],
          ];
          
          // Columnas para Tipo Periodo
          const columnas = [
            "ID",
            "Periodo"
          ];
          
          // Mapear datos del servicio
          const datosExcel = datos.map((item: any) => ({
            "ID": item.id || '',
            "Periodo": item.periodo?.trim() || ''
          }));
          
          const options: ExcelReporteOptions = {
            columnas,
            datos: datosExcel,
            nombreArchivo: `Reporte_Tipo_Periodo.xlsx`,
            tituloTabla: 'Catálogo Tipo Periodo'
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
      error: (error) => {
        console.error('Error al exportar:', error);
        
        this.alertType = 'error';
        this.alertMessage = 'Error al exportar datos';
        this.alertIcon = 'close-circle';
        this.alertDescription = 'No se pudo generar el archivo de exportación';
        this.showAlert = true;
      }
    });
  }

  exportarPDF(): void {

    const params: ConsultaPeriodoParams = {
      page: 1,
      pageSize: 10000,
    };

    if (this.searchText && this.searchText.trim()) {
      params.search = this.searchText.trim();
    }

    params.sort = this.sortField || 'id ASC';

    this.catalogoPeriodoService.consultarConac(params).subscribe({
      next: (resp: any) => {
        const datos = resp.datos || [];

        if (Array.isArray(datos) && datos.length > 0) {
          const encabezados = [
            ['', 'Subsecretaría de Ingresos', ''],
            ['', 'Dirección de Ingresos y Recaudación', ''],
            ['', 'Coordinación Técnica de Ingresos', ''],
            ['', 'Catálogo Tipo Periodo', ''],
          ];

          const columnas = ['ID', 'Periodo'];

          const datosPdf = datos.map((item: any) => ({
            ID: item.id || '',
            Periodo: item.periodo?.trim() || '',
          }));

          const options = {
            encabezados,
            columnas,
            datos: datosPdf,
            nombreArchivo: 'Reporte_Tipo_Periodo.pdf',
            orientacion: 'l' as const,
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
      error: (error) => {
        console.error('Error al exportar PDF:', error);

        this.alertType = 'error';
        this.alertMessage = 'Error al exportar PDF';
        this.alertIcon = 'close-circle';
        this.alertDescription = 'No se pudo generar el PDF';
        this.showAlert = true;
      },
    });
  }

 
}


