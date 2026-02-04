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
    CatalogoConac
} from '../../../models/catalogo-conac.model';
import { CatalogoConacService, ConsultaConacParams } from '../../../services/catalogo-conac.service';
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
  templateUrl: './listado-conac.component.html',
  styleUrls: ['./listado-conac.component.scss']
})
export class ListadoConacComponent implements OnInit {
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
  // Filtros para el servicio CONAC
  filtroServicio: Record<string, string> = {
    clave: '',           // mapea a 'cuenta' en el servicio
    descripcion: '',
    naturaleza: '',
    estructura: '',
    estadoFinanciero: '',
    posicionFinanciera: '',
    fechaAlta: '',
    inicioVigencia: '',
    finVigencia: '',
    estatus: '',
    ordenCampo: ''       // para el sorting
  };

  resultadosServicio: any[] = [];

  sortOrders: Array<{ key: string; direction: 'ascend' | 'descend' }> = [];
  filtros: Record<string, any> = {};
  pageIndex = 0;
  pageSize = 10;

  ejercicioSeleccionado = String(new Date().getFullYear());
  ejerciciosDisponibles: string[] = [];
  // Datos para la tabla
  data: CatalogoConac[] = [];
  total = 0;

  // Columnas configuradas para DynamicTable
 /** Helper para preservar el literal del key y satisfacer ColumnDef<CatalogoConac> */
  private makeCol<K extends keyof CatalogoConac>(
    def: Omit<ColumnDef<CatalogoConac>, 'key'> & { key: K }
  ): ColumnDef<CatalogoConac> { return def; }

  colsConac: ColumnDef<CatalogoConac>[] = [
    this.makeCol({ key: 'clave',             title: 'CUENTA',              filter: 'text', sortable: true }),
    this.makeCol({ key: 'descripcion',        title: 'DESCRIPCIÓN',         filter: 'text', sortable: true }),
    this.makeCol({ key: 'naturaleza',         title: 'NATURALEZA',          filter: 'text', sortable: true }),
    this.makeCol({ key: 'estructura',         title: 'ESTRUCTURA',          filter: 'text', sortable: true }),
    this.makeCol({ key: 'estadoFinanciero',   title: 'ESTADO FINANCIERO',   filter: 'text', sortable: true }),
    this.makeCol({ key: 'posicionFinanciera', title: 'POSICIÓN FINANCIERA', filter: 'text', sortable: true }),

    // Render como fecha, pero con filtro de texto (para que aparezca el input "FILTRAR")
    this.makeCol({ key: 'fechaAlta',      title: 'FECHA DE ALTA',      type: 'date', dateFormat: 'dd-MM-yyyy', filter: 'text', sortable: true }),
    this.makeCol({ key: 'inicioVigencia', title: 'INICIO DE VIGENCIA', type: 'date', dateFormat: 'dd-MM-yyyy', filter: 'text', sortable: true }),
    this.makeCol({ key: 'finVigencia',    title: 'FIN DE VIGENCIA',    type: 'date', dateFormat: 'dd-MM-yyyy', filter: 'text', sortable: true }),

    this.makeCol({
      key: 'estatus',
      title: 'ESTATUS',
      type: 'tag',              // sigue renderizando como tag en el body          // 👈 ahora es input de texto (no select)
      sortable: false,           // 👈 activa flechas como en las demás
      // (opcional) si quieres filtrar con mayúsculas o minúsculas da igual, ya lo maneja la tabla
      tagColorMap: (val: string) => val === 'VIGENTE' ? 'green' : 'red'
    }),

  ];
  modalVisible = false;
  registroSeleccionado: any = null;
  origenSeleccionado: string = '';

  constructor(
    private cargaMasivaCriService: CargaMasivaCriService,
    private catalogoConacService: CatalogoConacService,
    private router: Router,
    private breadcrumbService: BreadcrumbService,
    private excelExportService: ExcelExportService,
    private pdfExportService: PdfExportService
  ) {}

  ngOnInit(): void {
    this.breadcrumbService.setBreadcrumbReplace([
      { nombre: 'CONTROL DE INGRESO' },
      { nombre: 'ADMINISTRADOR CONTABLE DEL INGRESO' },
      { nombre: 'CLASIFICADORES Y CATÁLOGOS' },
      { nombre: 'CATALOGO CONAC', actual: true }
    ]);
    this.ejerciciosDisponibles = [];
    for (let anio = 2025; anio <= 2100; anio++) {
      this.ejerciciosDisponibles.push(String(anio));
    }
    // In  this.pageSize = size;

this.buscarClasificadorPaginadoServicio()

  }

  onEjercicioChange(): void {
  this.pageIndex = 0;
  this.buscarClasificadorPaginadoServicio()
  }

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
    // Método para consumir el nuevo servicio consultarConac
    buscarClasificadorPaginadoServicio(): void {
      // Construir parámetros para el nuevo servicio
      const params: ConsultaConacParams = {
        ejercicio: Number(this.ejercicioSeleccionado),
        page: this.pageIndex + 1, // El servicio usa paginación 1-based
        pageSize: this.pageSize
      };

      // Agregar filtros opcionales solo si tienen valor
      const {
        clave,
        descripcion,
        fechaAlta,
        inicioVigencia,
        finVigencia,
        ordenCampo
      } = this.filtroServicio;

      if (clave && clave.trim()) params.cuenta = clave.trim();
      if (descripcion && descripcion.trim()) params.descripcion = descripcion.trim();
      if (fechaAlta && fechaAlta.trim()) params.fechaAlta = fechaAlta.trim();
      if (inicioVigencia && inicioVigencia.trim()) params.inicioVigencia = inicioVigencia.trim();
      if (finVigencia && finVigencia.trim()) params.finVigencia = finVigencia.trim();
      if (ordenCampo && ordenCampo.trim()) params.sort = ordenCampo.trim();

      this.catalogoConacService.consultarConac(params).subscribe({
        next: (resp: any) => {
          console.log('Respuesta del servicio consultarConac:', resp);
          
          // Ajustar según la estructura de respuesta del backend
          // La respuesta tiene: { exito, mensaje, datos, total, pagina, tamano }
          const datos = resp.datos || resp.content || resp.data || resp.items || resp || [];
          
          if (Array.isArray(datos)) {
            console.log('Primer elemento antes de mapear:', datos[0]);
            this.data = datos.map((item: any, idx: number) => ({
              id: item.id || idx,
              clave: item.cuenta?.trim() || item.clave?.trim() || '',
              descripcion: item.descripcion?.trim() || '',
              naturaleza: item.naturaleza?.trim() || '',
              estructura: item.estructura?.trim() || '',
              estadoFinanciero: item.estadoFinanciero?.trim() || '',
              posicionFinanciera: item.posicionFinanciera?.trim() || '',
              fechaAlta: item.fechaAlta ? new Date(item.fechaAlta) : null,
              inicioVigencia: item.inicioVigencia ? new Date(item.inicioVigencia) : null,
              finVigencia: item.finVigencia ? new Date(item.finVigencia) : null,
              estatus: item.estatus === 'VIGENTE' ? 'VIGENTE' : 'NO VIGENTE',
              // Mapear los campos adicionales
              idGenero: item.idGenero,
              idGrupo: item.idGrupo,
              idRubro: item.idRubro,
              idCuenta: item.idCuenta,
              idSubCuenta: item.idSubCuenta,
              idNaturaleza: item.idNaturaleza,
              idEstructura: item.idEstructura,
              idEstadoFinanciero: item.idEstadoFinanciero,
              idPosicion: item.idPosicion,
              ejercicio: item.ejercicio,
              origen: item.origen || '',
              totalRegistros: item.totalRegistros
              
            }));
            
            // Total de registros para paginación
            this.total = resp.total || resp.totalElements || resp.totalCount || datos.length;
          } else {
            this.data = [];
            this.total = 0;
          }
          
        },
        error: (error) => {
          console.error('Error al consultar CONAC:', error);
          this.data = [];
          this.total = 0;
          
          // Mostrar alerta de error
          this.alertType = 'error';
          this.alertMessage = 'Error al consultar el catálogo';
          this.alertIcon = 'close-circle';
          this.alertDescription = 'No se pudieron cargar los datos del catálogo CONAC';
          this.showAlert = true;
        }
      });
    }
    onFiltroServicioChange(filtros: Record<string, string>): void {
      // Actualizar todos los filtros del servicio
      Object.keys(this.filtroServicio).forEach(key => {
        if (key !== 'ordenCampo') { // No sobreescribir el campo de ordenamiento
          this.filtroServicio[key] = filtros[key] ?? '';
        }
      });
      
      this.pageIndex = 0; // Resetear a la primera página cuando se aplican filtros
      this.buscarClasificadorPaginadoServicio();
    }
  nuevo(): void {
    this.router.navigate(['/catalogo-conac/nuevo-conac']);
  }

  cargaMasiva(): void {
    this.router.navigate(['/catalogo-conac/carga-masiva-conac']);
  }
editar(row: any): void {
  if (!row || !row.clave || !row.descripcion) {
    console.warn('Registro inválido para edición:', row);
    return;
  }
  console.log('Registro completo para edición:', row);
  console.log('Origen del registro:', row.origen);
  this.registroSeleccionado = row;
  this.origenSeleccionado = row.origen || '';


    // Navegar al componente nuevo-conac con los datos del registro
  if (row.origen?.toUpperCase() === 'SUBCUENTA') {
      // Navegar al componente nuevo-conac con los datos del registro
      this.router.navigate(['/catalogo-conac/nuevo-conac'], {
        state: {
          modoEdicion: true,
          datosEdicion: this.registroSeleccionado
        }
      });
      return;
    }else{
    this.modalVisible = true;
  }
}



  /**
   * Permite el ordenamiento de múltiples columnas.
   * evt: { sorts: { key, direction }[] }
   * Filtra los direction null para evitar errores de tipo.
   */
  onSortChange(evt: { sorts: { key: string; direction: 'ascend' | 'descend' | null }[] }) {
    // Filtrar los direction null
    const validSorts = (evt.sorts || []).filter(s => s.direction === 'ascend' || s.direction === 'descend');
    // Mapear campos de la tabla a campos del servicio CONAC y construir string múltiple
    const sortValue = validSorts.map(s => {
      let col = s.key === 'clave' ? 'cuenta' : s.key;
      let dir = s.direction === 'ascend' ? 'ASC' : 'DESC';
      return `${col} ${dir}`;
    }).join(', ');
    this.filtroServicio["ordenCampo"] = sortValue || 'cuenta ASC';
    console.log('Orden múltiple:', this.filtroServicio["ordenCampo"]);
    this.buscarClasificadorPaginadoServicio();
  }

  onFilterChange(filters: Record<string, any>) {
    this.filtros = filters;
        this.buscarClasificadorPaginadoServicio();
  }
    actualizarTabla(): void {
      // Limpiar todos los filtros del servicio
      Object.keys(this.filtroServicio).forEach(key => {
        this.filtroServicio[key] = '';
      });
      this.filtros = {};
      this.pageIndex = 0;
      this.sortOrders = [];
      // Limpiar los filtros visuales de la tabla
      if (this.tabla && this.tabla.clearFilters) {
        this.tabla.clearFilters();
      }
      this.buscarClasificadorPaginadoServicio();
    }
  // Exportar a Excel usando los datos del servicio


  exportarExcel(): void {
    // Construir parámetros para exportar todos los datos
    const params: ConsultaConacParams = {
      ejercicio: Number(this.ejercicioSeleccionado),
      page: 1,
      pageSize: 10000 // Obtener todos los registros
    };

    // Agregar filtros activos
    const {
      clave,
      descripcion,
      fechaAlta,
      inicioVigencia,
      finVigencia,
      ordenCampo
    } = this.filtroServicio;

    if (clave && clave.trim()) params.cuenta = clave.trim();
    if (descripcion && descripcion.trim()) params.descripcion = descripcion.trim();
    if (fechaAlta && fechaAlta.trim()) params.fechaAlta = fechaAlta.trim();
    if (inicioVigencia && inicioVigencia.trim()) params.inicioVigencia = inicioVigencia.trim();
    if (finVigencia && finVigencia.trim()) params.finVigencia = finVigencia.trim();
    if (ordenCampo && ordenCampo.trim()) params.sort = ordenCampo.trim();

    this.catalogoConacService.consultarConac(params).subscribe({
      next: (resp: any) => {
        const datos = resp.datos || resp.content || resp.data || resp.items || resp || [];
        
        if (Array.isArray(datos) && datos.length > 0) {
          // Encabezados institucionales
          const encabezados = [
            ["LOGO_IZQUIERDA", "", "", "", "", "", "", "", "", "", "LOGO_DERECHA"],
            ["", "Subsecretaría de Ingresos", "", "", "", "", "", "", "", "", ""],
            ["", "Dirección de Ingresos y Recaudación", "", "", "", "", "", "", "", "", ""],
            ["", "Coordinación Técnica de Ingresos", "", "", "", "", "", "", "", "", ""],
            ["", "Catálogo CONAC", "", "", "", "", "", "", "", "", ""],
            ["", `[${this.ejercicioSeleccionado}]`, "", "", "", "", "", "", "", "", ""],
          ];
          
          // Columnas para CONAC
          const columnas = [
            "Ejercicio",
            "Cuenta",
            "Descripción",
            "Naturaleza",
            "Estructura",
            "Estado Financiero",
            "Posición Financiera",
            "Fecha Alta",
            "Inicio Vigencia",
            "Fin Vigencia",
           
          ];
          
          // Mapear datos del servicio CONAC
          const datosExcel = datos.map((item: any) => ({
            "Ejercicio": item.ejercicio || this.ejercicioSeleccionado,
            "Cuenta": item.cuenta || item.clave || '',
            "Descripción": item.descripcion?.trim() || '',
            "Naturaleza": item.naturaleza?.trim() || '',
            "Estructura": item.estructura?.trim() || '',
            "Estado Financiero": item.estadoFinanciero?.trim() || '',
            "Posición Financiera": item.posicionFinanciera?.trim() || '',
            "Fecha Alta": item.fechaAlta ? new Date(item.fechaAlta).toLocaleDateString('es-ES') : '',
            "Inicio Vigencia": item.inicioVigencia ? new Date(item.inicioVigencia).toLocaleDateString('es-ES') : '',
            "Fin Vigencia": item.finVigencia ? new Date(item.finVigencia).toLocaleDateString('es-ES') : '',
            "Estatus": item.estatus === 'VIGENTE' ? 'Vigente' : 'No vigente'
          }));
          
          const options:ExcelReporteOptions = {
            columnas,
            datos: datosExcel,
            nombreArchivo: `Reporte_CONAC_${this.ejercicioSeleccionado}.xlsx`,
            tituloTabla: ` Reporte CONAC ${this.ejercicioSeleccionado}`

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
    const params: ConsultaConacParams = { page: 1, pageSize: 10000, ejercicio: new Date().getFullYear() };
    this.catalogoConacService.consultarConac(params).subscribe({
      next: (resp: any) => {
        const datos = resp.datos || [];
        if (!Array.isArray(datos) || datos.length === 0) {
          this.alertType = 'error';
          this.alertMessage = 'No hay datos para exportar';
          this.alertIcon = 'info-circle';
          this.alertDescription = 'No se encontraron registros con los filtros aplicados';
          this.showAlert = true;
          return;
        }

        const columnas = ['Clave', 'Nombre', 'Descripción', 'Fecha Alta', 'Usuario Creación'];

        const datosPdf = datos.map((item: any) => ({
          Clave: item.clave || '',
          Nombre: item.nombre || '',
          Descripción: item.descripcion || '',
          'Fecha Alta': item.fechaAlta || '',
          'Usuario Creación': item.usuarioCreacion || ''
        }));

        const options: PdfReporteOptions = {
          columnas,
          datos: datosPdf,
          nombreArchivo: 'Reporte_CONAC.pdf',
          orientacion: 'l'
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
      },
      error: (error) => {
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


