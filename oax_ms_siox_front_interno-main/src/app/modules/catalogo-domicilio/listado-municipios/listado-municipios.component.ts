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

// Tabla compartida


import { BreadcrumbService } from '../../../services/breadcrumb.service';
import { CatDomicilioService, ConsultaMunicipioParams } from '../../../services/cat-pais.service';

import { CatalogoMunicipios } from '../../../models/catalogo-municipios.model';
import {
  ColumnDef,
  DynamicTableComponent
} from '../../../shared/dynamic-table/dynamic-table.component';
import { ExcelExportService } from '../../../services/export/excel-export.service';
import { GenericAlertComponent } from '../../../shared/generic-alert/generic-alert.component';

@Component({
  selector: 'app-listado-municipios',
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
  templateUrl: './listado-municipios.component.html',
  styleUrls: ['./listado-municipios.component.scss']
})
export class ListadoMunicipiosComponent implements OnInit {
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
      const dia = String(d.getDate()+1).padStart(2, '0');
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
  sortField = 'clave_municipio ASC'; // Ahora puede ser string múltiple
  sortOrder: 'ascend' | 'descend' = 'ascend'; // Se mantiene para compatibilidad
  
  sortKey: string | null = null;
  sortDir: 'ascend' | 'descend' | null = null;
  filtros: Record<string, any> = {};
  pageIndex = 0;
  pageSize = 10;

  // Datos para la tabla
  data: CatalogoMunicipios[] = [];
  paises: any[] = [];
  total = 0;

  // Columnas para la tabla de países
  colsPais: ColumnDef<any>[] = [
    { key: 'distrito', title: 'DISTRITO', filter: 'text', sortable: true, width: '150px' },
    { key: 'claveMunicipio', title: 'CLAVE MUNICIPIO', filter: 'text', sortable: true, width: '100px' },
    { key: 'municipio', title: 'MUNICIPIO', filter: 'text', sortable: true, width: '300px' },
    { key: 'fechaAlta', title: 'FECHA ALTA', filter: 'date',   type: 'date', sortable: true, width: '200px' }
  ];
  modalVisible = false;
  registroSeleccionado: any = null;
  origenSeleccionado: string = '';

  constructor(
    private router: Router,
    private breadcrumbService: BreadcrumbService,
    private catDomicilioService: CatDomicilioService,
    private excelExportService: ExcelExportService
  ) {}

  ngOnInit(): void {
    this.breadcrumbService.setBreadcrumbReplace([
      { nombre: 'ADMINISTRACIÓN DE CONTRIBUYENTES' },
      { nombre: 'ADMINISTRACIÓN DE CATÁLOGOS DE CONTRIBUYENTES' },
      { nombre: 'CATÁLOGOS PARA DOMICILIO' },
      { nombre: 'CONSULTA DE CATÁLOGO DE REGIONES', actual: true }
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
      const params: ConsultaMunicipioParams = {
        page: this.pageIndex + 1, // El servicio usa paginación 1-based
        pageSize: this.pageSize,
        municipio: '',
        distrito: ''
      };
      console.log("filtros en estado",this.filtros)

   if (this.filtros['claveMunicipio']) {
      params.claveMunicipio = parseInt(this.filtros['claveMunicipio']);
    }
    if (this.filtros['municipio']) {
      params.municipio = this.filtros['municipio'];
    }

     if (this.filtros['distrito']) {
      params.distrito = this.filtros['distrito'];
    }
   
    if (this.filtros['fechaAlta']) {
      params.fechaAlta = this.formatearFechaISO(this.filtros['fechaAlta']);
    }

  

      // Agregar ordenamiento (multi-sort)
      params.sort = this.sortField || 'clave_municipio ASC';

      console.log("params en pais",params)

      this.catDomicilioService.consultaMunicipio(params).subscribe({
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
                claveMunicipio: item.claveMunicipio || '',
                municipio: item.municipio?.trim() || '',
                fechaAlta: this.formatearFecha(item.fechaAlta),
                distrito: item.distrito || '',
              
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
    this.sortField = sortValue || 'clave_municipio ASC';
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

  }


}