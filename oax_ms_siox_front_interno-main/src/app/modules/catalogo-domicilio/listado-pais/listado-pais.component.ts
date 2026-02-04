import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
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

// Tabla compartida

import { CatalogoPais } from '../../../models/catalogo-pais.model';
import { BreadcrumbService } from '../../../services/breadcrumb.service';
import { CatDomicilioService, ConsultaPaisParams, ConsultaTipoAsentamientoParams } from '../../../services/cat-pais.service';
import { ConsultaPeriodoParams } from '../../../services/catalogo-periodo.service';
import {
  ColumnDef,
  DynamicTableComponent
} from '../../../shared/dynamic-table/dynamic-table.component';
import { ExcelExportService } from '../../../services/export/excel-export.service';
import { GenericAlertComponent } from '../../../shared/generic-alert/generic-alert.component';
import { ExcelReporteOptions } from '../../../shared/excel-reporte.util';
import { PdfReporteOptions } from '../../../shared/pdf-reporte.util';
import { PdfExportService } from '../../../services/export/pdf-export.service';
import { DateFilterService } from '../../../shared/date-filter.service';

@Component({
  selector: 'app-listado-pais',
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
  templateUrl: './listado-pais.component.html',
  styleUrls: ['./listado-pais.component.scss']
})
export class ListadoPaisComponent implements OnInit {
  pdfExportService = inject(PdfExportService);

        // Formatea una fecha a yyyy-MM-dd para el backend
      // Formatea una fecha a yyyy-MM-dd para el backend
      formatearFechaISO(fecha: any): string {
        if (!fecha) return '';
        const d = new Date(fecha);
        if (isNaN(d.getTime())) return '';
        const anio = d.getFullYear();
        const mes = String(d.getMonth() + 1).padStart(2, '0');
        const dia = String(d.getDate()).padStart(2, '0');
        return `${anio}-${mes}-${dia}`;
      }
  
    // Formatea una fecha a dd/mm/yyyy aceptando varios formatos
    formatearFecha(fecha: string | Date): string {
      if (!fecha) return '';
      let d: Date;
      if (typeof fecha === 'string') {
        // dd/mm/yyyy
        if (/^\d{2}\/\d{2}\/\d{4}$/.test(fecha)) {
          const [dia, mes, anio] = fecha.split('/');
          d = new Date(Number(anio), Number(mes) - 1, Number(dia));
        }
        // yyyy-mm-dd
        else if (/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
          const [anio, mes, dia] = fecha.split('-');
          d = new Date(Number(anio), Number(mes) - 1, Number(dia));
        }
        // mm/dd/yyyy
        else if (/^\d{2}\/\d{2}\/\d{4}$/.test(fecha)) {
          const [mes, dia, anio] = fecha.split('/');
          d = new Date(Number(anio), Number(mes) - 1, Number(dia));
        }
        else {
          d = new Date(fecha);
        }
      } else {
        d = new Date(fecha);
      }
      if (isNaN(d.getTime())) return '';
      const dia = String(d.getDate()).padStart(2, '0');
      const mes = String(d.getMonth() + 1).padStart(2, '0');
      const anio = d.getFullYear();
      return `${mes}/${dia}/${anio}`;
    }
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
  pageIndex = 0;
  pageSize = 10;

  // Datos para la tabla
  data: CatalogoPais[] = [];
  paises: any[] = [];
  total = 0;

  // Columnas para la tabla de países
  colsPais: ColumnDef<any>[] = [
    { key: 'id', title: 'CLAVE PAIS', filter: 'text', sortable: true, width: '150px', align: 'center' },
    { key: 'nombre', title: 'PAIS', filter: 'text', sortable: true, width: '300px', align: 'center' },
    { key: 'fechaAlta', title: 'FECHA ALTA', filter: 'date',   type: 'date', sortable: true, width: '200px', align: 'center' }
  ];
  modalVisible = false;
  registroSeleccionado: any = null;
  origenSeleccionado: string = '';

  constructor(
    private catDomicilioService: CatDomicilioService,
    private router: Router,
    private breadcrumbService: BreadcrumbService,
    private excelExportService: ExcelExportService,
    private dateFilterService: DateFilterService
  ) {}

  ngOnInit(): void {
    this.breadcrumbService.setBreadcrumbReplace([
      { nombre: 'ADMINISTRACIÓN DE CONTRIBUYENTES' },
      { nombre: 'ADMINISTRACIÓN DE CATÁLOGOS DE CONTRIBUYENTES' },
      { nombre: 'CATÁLOGOS PARA DOMICILIO' },
      { nombre: 'CONSULTA DE CATÁLOGO DE PAÍSES', actual: true }
    ]);

    // In  this.pageSize = size;
    this.buscarClasificadorPaginadoServicio();

  }
  // Método para consumir el servicio de países



  onPageChange(page: number): void {
    this.pageIndex = page - 1;
    this.buscarClasificadorPaginadoServicio();

  }

  onPageSizeChange(size: number): void {
  console.log('Nuevo tamaño de página:', size);
  this.pageSize = size;
    this.buscarClasificadorPaginadoServicio();
  }

  // --------- acciones de UI ---------
    // Método para consumir el servicio consultarConac (Tipo Periodo)
    buscarClasificadorPaginadoServicio(): void {
      // Construir parámetros para el servicio
      const params: ConsultaPaisParams = {
        page: this.pageIndex + 1, // El servicio usa paginación 1-based
        pageSize: this.pageSize
      };
      console.log("filtros en pais",this.filtros)
    
   if (this.filtros['id']) {
      params.id = parseInt(this.filtros['id']);
    }
    if (this.filtros['nombre']) {
      params.nombre = this.filtros['nombre'];
    }
    if (this.filtros['fechaAlta']) {
      // Usar dateFilterService para evitar problemas de zona horaria
      const fechaParseada = this.dateFilterService.parseDate(this.filtros['fechaAlta']);
      if (fechaParseada) {
        params.fechaAlta = this.dateFilterService.toYMD(fechaParseada);
      }
    }

  

      // Agregar ordenamiento (multi-sort)
      params.sort = this.sortField || 'id ASC';

      console.log("params en pais",params)

      this.catDomicilioService.consultarPais(params).subscribe({
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
                nombre: item.nombre?.trim() || '',
                fechaAlta: this.formatearFecha(item.fechaAlta)
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
    // Guardar filtros
    this.filtros = filtros;
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

    this.catDomicilioService.consultarPais(params).subscribe({
      next: (resp: any) => {
        const datos = resp.datos || [];
        
        if (Array.isArray(datos) && datos.length > 0) {
          // Encabezados institucionales
          
          // Columnas 
          const columnas = [
            "CLAVE PAÍS",
            "PAÍS",
            "FECHA ALTA"
          ];
          
          // Mapear datos del servicio
          const datosExcel = datos.map((item: any) => ({
            "CLAVE PAÍS": item.id || '',
            "PAÍS": item.nombre?.trim() || '',
            "FECHA ALTA": this.formatearFecha(item.fechaAlta)
          }));
          
          const options: ExcelReporteOptions = {
            columnas,
            datos: datosExcel,
            nombreArchivo: `Reporte_Pais.xlsx`,
            tituloTabla: 'CONSULTA DE CATÁLOGO DE PAÍSES'
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

    exportarPdf(): void {
      const params: ConsultaTipoAsentamientoParams = {
        page: 1,
        pageSize: 10000
      };
  
      this.catDomicilioService.consultarPais(params).subscribe({
        next: (resp: any) => {
          const datos = resp.datos || [];
          
          if (Array.isArray(datos) && datos.length > 0) {
          // Columnas 
          const columnas = [
            "CLAVE PAÍS",
            "PAÍS",
            "FECHA ALTA"
          ];
          
          // Mapear datos del servicio
          const datosPdf = datos.map((item: any) => ({
            "CLAVE PAÍS": item.id || '',
            "PAÍS": item.nombre?.trim() || '',
            "FECHA ALTA": this.formatearFecha(item.fechaAlta)
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


