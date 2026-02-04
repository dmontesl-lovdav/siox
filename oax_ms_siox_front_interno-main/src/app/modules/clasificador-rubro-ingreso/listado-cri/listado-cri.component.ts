import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { BreadcrumbService } from '../../../services/breadcrumb.service';
import { ModalEdicionClasificadorComponent } from '../../../shared/modal-edicion-clasificador/modal-edicion-clasificador.component';

// NG ZORRO (si usas botones/iconos arriba)
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTagModule } from 'ng-zorro-antd/tag';

// Tabla compartida

import {
  ClasificadorRubroIngreso,
  EstatusCRI
} from '../../../models/clasificador-rubro-ingreso.model';
import { BasePaginatedListadoComponent } from '../../../shared/base-paginated-listado.component';
import { CargaMasivaCriService } from '../../../services/catalogo.cri.service';
import {
  ColumnDef,
  DynamicTableComponent
} from '../../../shared/dynamic-table/dynamic-table.component';
import { ExcelExportService } from '../../../services/export/excel-export.service';
import { PdfExportService } from '../../../services/export/pdf-export.service';
import { GenericAlertComponent } from '../../../shared/generic-alert/generic-alert.component';
import { ExcelReporteOptions } from '../../../shared/excel-reporte.util';
import { PdfReporteOptions } from '../../../shared/pdf-reporte.util';

@Component({
  selector: 'app-clasificador-rubro-ingreso',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzButtonModule,
    NzIconModule,
    NzTagModule,
    NzSelectModule,
    NzInputModule,
  DynamicTableComponent,
  ModalEdicionClasificadorComponent,
  GenericAlertComponent,
  GenericAlertComponent
  ],
  providers: [NzModalService],
  templateUrl: './listado-cri.component.html',
  styleUrls: ['./listado-cri.component.scss']
})
export class ClasificadorRubroIngresoComponent extends BasePaginatedListadoComponent implements OnInit {
  // Variables para la alerta genérica
  showAlert = false;
  alertMessage = '';
  alertType: 'success' | 'error' = 'success';
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
  // Método para manejar el resultado del modal
  onGuardarModal(resultado: any) {
    if (resultado.status === 'success') {
      this.alertType = 'success';
      this.alertMessage = resultado.message;
      this.alertIcon = 'check-circle';
      this.alertDescription = '';
      this.showAlert = true;
      this.buscarClasificadorPaginadoServicio(); // Actualizar tabla
    } else {
      this.alertType = 'error';
      this.alertMessage = resultado.message;
      this.alertIcon = 'close-circle';
      this.alertDescription = resultado.error?.message || '';
      this.showAlert = true;
    }
    this.modalVisible = false;
  }
  // Referencia a la tabla para limpiar filtros visuales
  @ViewChild('tabla', { static: false }) tabla: any;
  // Filtros para el servicio externo
  filtroServicio: Record<string, string> = {
    clave: '',
    nombre: '',
    descripcion: '',
    claveCompuesta: '',
    fechaAlta: '',
    inicioVigencia: '',
    finVigencia: '',
    ejercicio: '', // Se asigna dinámicamente
    pagina: '',    // Se asigna dinámicamente
    tamano: ''     // Se asigna dinámicamente
  };

  resultadosServicio: any[] = [];

  sortKey: string | null = null;
  sortDir: 'ascend' | 'descend' | null = null;
  filtros: Record<string, any> = {};
  override pageIndex = 0;
  override pageSize = 10;

  ejercicioSeleccionado = String(new Date().getFullYear());
  ejerciciosDisponibles: string[] = [];
  // Datos para la tabla
  data: ClasificadorRubroIngreso[] = [];
  total = 0;

  // Columnas configuradas para DynamicTable
  cols: ColumnDef<ClasificadorRubroIngreso>[] = [
    {
      key: 'clave',
      title: 'CLAVE',
      filter: 'text',
      sortable: true
    },
    {
      key: 'nombre',
      title: 'NOMBRE DEL CLASIFICADOR',
      filter: 'text',
      sortable: true
    },
    {
      key: 'descripcion',
      title: 'DESCRIPCIÓN',
      filter: 'text',
      sortable: true
    },
    {
      key: 'fechaAlta',
      title: 'FECHA DE ALTA',
      type: 'date',
      dateFormat: 'dd-MM-yyyy',
      filter: 'text',
      sortable: true
    },
    {
      key: 'inicioVigencia',
      title: 'INICIO DE VIGENCIA',
      type: 'date',
      dateFormat: 'dd-MM-yyyy',
      filter: 'text',
      sortable: true
    },
    {
      key: 'finVigencia',
      title: 'FIN DE VIGENCIA',
      type: 'date',
      dateFormat: 'dd-MM-yyyy',
      filter: 'text',
      sortable: true
    },
    {
      key: 'estatus',
      title: 'ESTATUS',
      type: 'tag',
      sortable: false,
      tagColorMap: (v: EstatusCRI) => (v === 'VIGENTE' ? 'green' : 'red')
    }
    // NOTA: la columna de ACCIONES no va aquí; la inyectamos con [actionsTemplate] en el HTML
  ];

  modalVisible = false;
  registroSeleccionado: any = null;
  origenSeleccionado: string = '';

  constructor(
    private cargaMasivaCriService: CargaMasivaCriService,
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
      { nombre: 'CLASIFICADOR POR RUBRO DE INGRESO', actual: true }
    ]);
    this.ejerciciosDisponibles = [];
    for (let anio = 2025; anio <= 2100; anio++) {
      this.ejerciciosDisponibles.push(String(anio));
    }
    this.buscarClasificadorPaginadoServicio();
  }

  onEjercicioChange(): void {
    this.pageIndex = 0;
    this.buscarClasificadorPaginadoServicio();
  }

  override cargarDatos(): void {
    this.buscarClasificadorPaginadoServicio();
  }

  protected override buscarPaginado(): void {
    this.buscarClasificadorPaginadoServicio();
  }

  // --------- acciones de UI ---------
    // Método para consumir el servicio externo
    buscarClasificadorPaginadoServicio(): void {
  // Calcular el tamaño real de la página antes de llamar al servicio
  let tamanoReal = this.pageSize;


  this.filtroServicio["tamano"] = tamanoReal.toString();
  this.filtroServicio["pagina"] = this.pageIndex.toString();
  this.filtroServicio["ejercicio"] = this.ejercicioSeleccionado;
      const {
        clave,
        nombre,
        descripcion,
        claveCompuesta,
        fechaAlta,
        inicioVigencia,
        finVigencia,
        ejercicio,
        pagina,
        tamano,
        ordenCampo
      } = this.filtroServicio;

       
      this.cargaMasivaCriService.buscarClasificadorPaginadoServicio(
        clave,
        nombre,
        descripcion,
        claveCompuesta,
        fechaAlta,
        inicioVigencia,
        finVigencia,
        ejercicio,
        Number(pagina),
        10,
        ordenCampo
      ).subscribe({
        next: (resp: any) => {
          console.log(resp);
          if (resp && resp.exito && Array.isArray(resp.datos)) {
            let datos = resp.datos;
            this.data = datos.map((item: any, idx: number) => ({
              id: item.id,
              clave: item.clave?.trim() ?? '',
              nombre: item.nombreClasificador?.trim() ?? '',
              descripcion: item.descripcion?.trim() ?? '',
              fechaAlta: item.fechaAlta ? new Date(item.fechaAlta + 'T00:00:00') : null,
              inicioVigencia: item.inicioVigencia ? new Date(item.inicioVigencia + 'T00:00:00') : null,
              finVigencia: item.finVigencia ? new Date(item.finVigencia + 'T00:00:00') : null,
              estatus: item.estatus === 'VIGENTE' ? 'VIGENTE' : 'NO VIGENTE',
              fk:item.fk,
              origen:item.origenTabla,
            }));
             const filtrosExtras = { clave, nombre, descripcion, claveCompuesta, fechaAlta, inicioVigencia, finVigencia };
        const hayFiltroExtra = Object.values(filtrosExtras).some(v => v !== undefined && v !== null && v !== '');

        this.total = hayFiltroExtra ? resp.total : resp.total;
          } else {
            this.data = [];
            this.total = 0;
            // ...existing code..
          }
        },
        error: () => {
          this.data = [];
          this.total = 0;
        }
      });
    }
    onFiltroServicioChange(filtros: Record<string, string>): void {
  
      Object.keys(this.filtroServicio).forEach(key => {
        this.filtroServicio[key] = filtros[key] ?? '';
      });
      this.buscarClasificadorPaginadoServicio();
    }
  nuevo(): void {
    this.router.navigate(['/clasificador-rubro-ingreso/nuevo-cri']);
  }

  cargaMasiva(): void {
    this.router.navigate(['/clasificador-rubro-ingreso/carga-masiva-cri']);
  }
editar(row: any): void {
  if (!row || !row.clave || !row.nombre) {
    console.warn('Registro inválido para edición:', row);
    return;
  }
  this.registroSeleccionado = row;
  this.origenSeleccionado = row.origen;
  this.modalVisible = true;
}



  onSortChange(evt: { sorts: { key: string; direction: 'ascend' | 'descend' | null }[] }) {
    // Filtrar los direction null
    const validSorts = (evt.sorts || []).filter(s => s.direction === 'ascend' || s.direction === 'descend');
    // Mapear campos y construir string múltiple
    const sortValue = validSorts.map(s => {
      let col = s.key === 'nombre' ? 'nombreClasificador' : s.key;
      let dir = s.direction === 'ascend' ? 'asc' : 'desc';
      return `${col} ${dir}`;
    }).join(', ');
    this.filtroServicio["ordenCampo"] = sortValue || 'nombreClasificador asc';
    console.log('Orden múltiple:', this.filtroServicio["ordenCampo"]);
    this.buscarClasificadorPaginadoServicio();
  }

  onFilterChange(filters: Record<string, any>) {
    this.filtros = filters;
        this.buscarClasificadorPaginadoServicio();
  }
    actualizarTabla(): void {
      // Limpiar filtros de la tabla y del servicio
      Object.keys(this.filtroServicio).forEach(key => {
        if (["clave", "nombre", "descripcion", "claveCompuesta", "fechaAlta", "inicioVigencia", "finVigencia"].includes(key)) {
          this.filtroServicio[key] = '';
        }
      });
      this.filtros = {};
      this.pageIndex = 0;
      this.filtroServicio["pagina"] = this.pageIndex.toString();
      this.filtroServicio["tamano"] = this.pageSize.toString();
      this.filtroServicio["ejercicio"] = this.ejercicioSeleccionado;
      // Limpiar los filtros visuales de la tabla
      if (this.tabla && this.tabla.clearFilters) {
        this.tabla.clearFilters();
      }
      this.buscarClasificadorPaginadoServicio();
    }
  // Exportar a Excel usando los datos del servicio


  exportarExcel(): void {
    const {
      clave,
      nombre,
      descripcion,
      claveCompuesta,
      fechaAlta,
      inicioVigencia,
      finVigencia,
      ejercicio
    } = this.filtroServicio;
    this.cargaMasivaCriService.getAllExport(
      ejercicio
    ).subscribe({
      next: (resp: any) => {
        console.log('es este??');
        console.log(resp);
        if (resp && resp.exito && Array.isArray(resp.datos)) {
          // Nombres de columnas igual al ejemplo
          const columnas = [
            "Ejercicio",
            "Rubro",
            "Tipo",
            "Clase",
            "Concepto",
            "Nombre",
            "Descripción",
            "Fecha alta",
            "Inicio de vigencia",
            "Fin de vigencia",
            "Estatus"
          ];
          // Mapear los datos al formato de columnas
          const datos = resp.datos.map((item: any) => ({
            "Ejercicio": item.ejercicio ?? '',
            "Rubro": item.rubro ?? '',
            "Tipo": item.tipo ?? '',
            "Clase": item.clase ?? '',
            "Concepto": item.concepto ?? '',
            "Nombre": item.nombreClasificador?.trim() ?? '',
            "Descripción": item.descripcion?.trim() ?? '',
            "Fecha alta": item.fechaAlta ?? '',
            "Inicio de vigencia": item.inicioVigencia ?? '',
            "Fin de vigencia": item.finVigencia ?? '',
            "Estatus": item.estatus === 'VIGENTE' ? 'Vigente' : 'No vigente'
          }));
          const options: ExcelReporteOptions = {
            columnas,
            datos,
            nombreArchivo: `Reporte_CRI_${ejercicio}.xlsx`,
            tituloTabla: `Catálogo CRI ${ejercicio}`
          };
          this.excelExportService.exportarConFormato(options).then(() => {
          }).catch((err) => {
            console.error('Error al exportar:', err);
          });
        } else {
        }
      },
      error: () => {
      }
    });
  }

  exportarPdf(): void {
    
    const ejercicio = this.ejercicioSeleccionado || String(new Date().getFullYear());
    
    this.cargaMasivaCriService.getAllExport(
      ejercicio
    ).subscribe({
      next: (resp: any) => {
        console.log(resp);
        if (resp && resp.exito && Array.isArray(resp.datos) && resp.datos.length > 0) {
          const columnas = [
            'Ejercicio',
            'Rubro',
            'Tipo',
            'Clase',
            'Concepto',
            'Nombre',
            'Descripción',
            'Fecha Alta',
            'Inicio Vigencia',
            'Fin Vigencia',
            'Estatus'
          ];

          const datosPdf = resp.datos.map((item: any) => ({
            Ejercicio: item.ejercicio ?? '',
            Rubro: item.rubro ?? '',
            Tipo: item.tipo ?? '',
            Clase: item.clase ?? '',
            Concepto: item.concepto ?? '',
            Nombre: item.nombreClasificador?.trim() ?? '',
            Descripción: item.descripcion?.trim() ?? '',
            'Fecha Alta': item.fechaAlta ?? '',
            'Inicio Vigencia': item.inicioVigencia ?? '',
            'Fin Vigencia': item.finVigencia ?? '',
            Estatus: item.estatus === 'VIGENTE' ? 'Vigente' : 'No vigente'
          }));

          const options: PdfReporteOptions = {
            columnas,
            datos: datosPdf,
            nombreArchivo: `Reporte_CRI_${ejercicio}.pdf`,
            orientacion: 'l',
            titulo: `Clasificador por Rubro de Ingreso ${ejercicio}`
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
      error: () => {
        this.alertType = 'error';
        this.alertMessage = 'Error al exportar PDF';
        this.alertIcon = 'close-circle';
        this.alertDescription = 'No se pudo generar el PDF';
        this.showAlert = true;
      }
    });
  }

 
}


