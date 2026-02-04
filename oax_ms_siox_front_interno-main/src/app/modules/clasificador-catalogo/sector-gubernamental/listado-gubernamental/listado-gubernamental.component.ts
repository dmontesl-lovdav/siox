import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { NzModalService } from "ng-zorro-antd/modal";

// NG ZORRO
import { NzBreadCrumbModule } from "ng-zorro-antd/breadcrumb";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzDropDownModule } from "ng-zorro-antd/dropdown";
import { NzIconModule } from "ng-zorro-antd/icon";
import { NzInputModule } from "ng-zorro-antd/input";
import { NzSelectModule } from "ng-zorro-antd/select";
import { NzTagModule } from "ng-zorro-antd/tag";
import { NzToolTipModule } from "ng-zorro-antd/tooltip";

// Componentes shared
import {
  ColumnDef,
  DynamicTableComponent,
} from "../../../../shared/dynamic-table/dynamic-table.component";
import { DateFilterService } from "../../../../shared/date-filter.service";
import { ExcelExportService } from "../../../../services/export/excel-export.service";
import { GenericAlertComponent } from "../../../../shared/generic-alert/generic-alert.component";
import { ExcelReporteOptions } from "../../../../shared/excel-reporte.util";
import {
  ConfirmationContainerComponent,
  ConfirmationService,
} from "../../../../shared/confirmation-modal";

// ✅ OJO: Se quedan igual (servicio/modelo de género)
import { BasePaginatedListadoComponent } from "../../../../shared/base-paginated-listado.component";
import { BreadcrumbService } from "../../../../services/breadcrumb.service";

// ✅ Modal nuevo (pantalla gubernamental)
import { ModalGubernamentalComponent } from "./../modal-gubernamental/modal-gubernamental.component";
import { DomicilioService, ConsultaTipoSectorGubernamentalParams } from "../../../../services/domicilio.service";
import { CatTipoSectorGubernamental } from "../../../../models/catalogo-tipo-sector-gubernamental";
import { PdfReporteOptions } from "../../../../shared/pdf-reporte.util";
import { PdfExportService } from "../../../../services/export/pdf-export.service";

@Component({
  selector: "app-listado-gubernamental",
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
  templateUrl: "./listado-gubernamental.component.html",
  styleUrls: ["./listado-gubernamental.component.scss"],
})
export class ListadoGubernamentalComponent
  extends BasePaginatedListadoComponent
  implements OnInit, AfterViewInit
{
  filtroServicio: Record<string, any> = {};

  // Variables para la alerta genérica
  showAlert = false;
  alertMessage = "";
  alertType: "success" | "error" = "success";
  alertIcon = "";
  alertDescription = "";

  // Control de estado vacío
  hasFiltersApplied = false;
  emptyStateIcon = 'icon-sinDatos.svg';
  emptyStateMessage = 'SIN DATOS';
  emptyStateDescription = 'NO EXISTEN DATOS DISPONIBLES PARA CONSULTAR NI EXPORTAR';
  emptyStateHeight = '480px'; // Altura para 10 filas
  title = 'NUEVO REGISTRO DEL CATÁLOGO DE TIPO DE SECTOR GUBERNAMENTAL';

  // Referencia a la tabla y templates
  @ViewChild("tabla", { static: false }) tabla: any;
  @ViewChild("actionsTemplate", { static: true }) actionsTemplate: any;

  closeAlert() {
    this.showAlert = false;
    this.alertMessage = "";
    this.alertType = "success";
    this.alertIcon = "";
    this.alertDescription = "";
  }

  // Búsqueda y paginación
  sortField = "id";
  sortOrder: "ascend" | "descend" = "ascend";
  filtros: Record<string, any> = {};
  override pageIndex = 0;
  override pageSize = 10;

  // Datos para la tabla (se queda tipo CatGenero)
  data: CatTipoSectorGubernamental[] = [];
  total = 0;

  /** Helper para preservar el literal del key y satisfacer ColumnDef<CatGenero> */
  private makeCol<K extends keyof CatTipoSectorGubernamental>(
    def: Omit<ColumnDef<CatTipoSectorGubernamental>, "key"> & { key: K },
  ): ColumnDef<CatTipoSectorGubernamental> {
    return def;
  }
  colsGubernamental: ColumnDef<CatTipoSectorGubernamental>[] = [
    this.makeCol({
      key: "clave",
      title: "CLAVE",
      filter: "text",
      sortable: true,
      align: "center",
      width: "8%"
    }),

    // SECTOR (antes descripción)
    this.makeCol({
      key: "sector",
      title: "SECTOR",
      filter: "text",
      sortable: true,
      align: "center",
      width: "20%"
    }),

    // FECHA INICIO VIGENCIA
    this.makeCol({
      key: "fechaInicioVigencia" as any,
      title: "FECHA INICIO VIGENCIA",
      filter: "date",
      sortable: true,
      type: "date",
      align: "center",
      width: "15%"
    }),

    // FECHA FIN VIGENCIA
    this.makeCol({
      key: "fechaFinVigencia" as any,
      title: "FECHA FIN VIGENCIA",
      filter: "date",
      sortable: true,
      type: "date",
      align: "center",
      width: "15%"
    }),

    // USUARIO DE CREACIÓN
    this.makeCol({
      key: "usuarioCreacion" as any,
      title: "USUARIO DE CREACIÓN",
      filter: "text",
      sortable: true,
      align: "center",
      width: "17%"
    }),

    // FECHA ALTA
    this.makeCol({
      key: "fechaAlta",
      title: "FECHA ALTA",
      filter: "date",
      sortable: true,
      type: "date",
      align: "center",
      width: "13%"
    }),

    // EDITAR (template)
    this.makeCol({
      key: "editar" as any,
      title: "EDITAR",
      sortable: false,
      type: "template",
      align: "center",
      width: "12%"
    }),
  ];

  constructor(
    private domiclioService: DomicilioService,
    private modalService: NzModalService,
    private confirmationService: ConfirmationService,
    private breadcrumbService: BreadcrumbService,
    private excelExportService: ExcelExportService,
    private pdfExportService: PdfExportService,
    private dateFilterService: DateFilterService
  ) {
    super();
  }

  ngOnInit(): void {
    this.breadcrumbService.setBreadcrumbReplace([
      { nombre: "CONTROL DE INGRESO" },
      { nombre: "ADMINISTRADOR CONTABLE DEL INGRESO" },
      { nombre: "CLASIFICADORES Y CATÁLOGOS" },
      { nombre: "CATÁLOGO GUBERNAMENTAL", actual: true }, // ✅ solo pantalla
    ]);

    this.buscarGubernamentalPaginadoServicio();
  }

  ngAfterViewInit(): void {
    // Asignar template a la columna de acciones
    const editarCol = this.colsGubernamental.find(
      (c) => c.key === ("editar" as any),
    );
    if (editarCol) {
      editarCol.cellTemplate = this.actionsTemplate;
    }
  }

  override cargarDatos(): void {
    this.buscarGubernamentalPaginadoServicio();
  }

  protected override buscarPaginado(): void {
    this.buscarGubernamentalPaginadoServicio();
  }

  // ✅ Solo nombre cambiado (internamente usa el servicio de género)
  buscarGubernamentalPaginadoServicio(showSpinner: boolean = true): void {
    const params: ConsultaTipoSectorGubernamentalParams = {
      page: this.pageIndex + 1,
      pageSize: this.pageSize,
    };

    // Aplicar filtros disponibles en la tabla
    if (this.filtros["clave"]) params.clave = this.filtros["clave"];
    if (this.filtros["sector"]) params.sector = this.filtros["sector"];
    if (this.filtros["fechaInicioVigencia"]) params.fechaInicioVigencia = this.filtros["fechaInicioVigencia"];
    if (this.filtros["fechaFinVigencia"]) params.fechaFinVigencia = this.filtros["fechaFinVigencia"];
    if (this.filtros["usuarioCreacion"]) params.usuarioCreacion = this.filtros["usuarioCreacion"];
    if (this.filtros["fechaAlta"]) params.fechaAlta = this.filtros["fechaAlta"];

    if (this.filtroServicio["ordenCampo"]) {
      params.sort = this.filtroServicio["ordenCampo"];
    } else {
      const sortDirection = this.sortOrder === "ascend" ? "ASC" : "DESC";
      params.sort = `${this.sortField} ${sortDirection}`;
    }

    this.domiclioService.consultaTipoSectorGubernamental(params).subscribe({
      next: (resp: any) => {
        console.log('Respuesta del servicio consultar:', resp);
        
        if (!resp || resp === null) {
          this.data = [];
          this.total = 0;

          this.alertType = "error";
          this.alertMessage = "No hay datos disponibles";
          this.alertIcon = "info-circle";
          this.alertDescription =
            "No se encontraron registros del catálogo gubernamental";
          this.showAlert = true;
          return;
        }

        if (resp.exito === false) {
          this.data = [];
          this.total = 0;

          this.alertType = "error";
          this.alertMessage = resp.mensaje || "Error al consultar el catálogo";
          this.alertIcon = "close-circle";
          this.showAlert = true;
          return;
        }

        const datos = resp.datos || [];

        if (Array.isArray(datos) && datos.length > 0) {
          console.log('Primer elemento antes de mapear:', datos[0]);
          this.data = datos.map((item: any) => {
            const estatusBoolean =
              item.estatus === true || item.estatus === "true";

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
              clave: item.clave || "",
              sector: item.sector || "",
              fechaAlta: item.fechaAlta ? this.dateFilterService.parseDate(item.fechaAlta) : null,
              fechaModificacion: item.fechaModificacion ? this.dateFilterService.parseDate(item.fechaModificacion) : null,
              idUsuarioCreacion: item.idUsuarioCreacion,
              idUsuarioModificacion: item.idUsuarioModificacion,
              fechaInicioVigencia: item.fechaInicioVigencia ? this.dateFilterService.parseDate(item.fechaInicioVigencia) : null,
              fechaFinVigencia: item.fechaFinVigencia ? this.dateFilterService.parseDate(item.fechaFinVigencia) : null,

              activo: item.activo,
              usuarioCreacion: nombreCompleto,
              estatus: estatusBoolean,
              estatusTexto: estatusBoolean ? "SÍ" : "NO",
            };
          });

          this.total = resp.total || datos.length;
        } else {
          this.data = [];
          this.total = 0;
          this.updateEmptyState();
          
          this.alertType = "error";
          this.alertMessage = "No se encontraron registros";
          this.alertIcon = "info-circle";
          this.alertDescription = "No hay registros gubernamentales con los filtros aplicados";
          this.showAlert = true;
        }
      },
      error: (error: any) => {
        console.error('Error al consultar gubernamental:', error);
        this.data = [];
        this.total = 0;

        this.alertType = "error";
        this.alertMessage = "Error al consultar el catálogo";
        this.alertIcon = "close-circle";
        this.alertDescription =
          error.error?.error ||
          "No se pudieron cargar los datos del catálogo gubernamental";
        this.showAlert = true;
      },
    });
  }

  onFiltroServicioChange(filtros: Record<string, string>): void {
    console.log(filtros);
    this.filtros = filtros;
    this.pageIndex = 0;
    this.hasFiltersApplied = this.checkIfFiltersApplied(filtros);
    // Si no hay filtros, resetear el estado antes de buscar
    if (!this.hasFiltersApplied) {
      this.emptyStateIcon = 'icon-sinDatos.svg';
      this.emptyStateMessage = 'SIN DATOS';
      this.emptyStateDescription = 'NO EXISTEN DATOS DISPONIBLES PARA CONSULTAR NI EXPORTAR';
    }
    this.buscarGubernamentalPaginadoServicio(false); // No mostrar spinner para filtros
  }

  private checkIfFiltersApplied(filtros: Record<string, string>): boolean {
    return Object.values(filtros).some(val => val !== null && val !== undefined && val !== '');
  }

  private updateEmptyState(): void {
    if (this.hasFiltersApplied) {
      // Si hay filtros activos y sin resultados
      this.emptyStateIcon = 'icon-sinCoincidencias.svg';
      this.emptyStateMessage = 'SIN COINCIDENCIAS';
      this.emptyStateDescription = 'FILTRADO SIN COINCIDENCIAS. NO EXISTEN DATOS PARA EXPORTAR.';
    } else {
      // Sin datos iniciales
      this.emptyStateIcon = 'icon-sinDatos.svg';
      this.emptyStateMessage = 'SIN DATOS';
      this.emptyStateDescription = 'NO EXISTEN DATOS DISPONIBLES PARA CONSULTAR NI EXPORTAR';
    }
  }

  onSortChange(evt: {
    sorts: { key: string; direction: "ascend" | "descend" | null }[];
  }) {
    // Filtrar los direction null
    const validSorts = (evt.sorts || []).filter(
      (s) => s.direction === "ascend" || s.direction === "descend",
    );
    // Construir string múltiple para el backend
    const sortValue = validSorts
      .map((s) => `${s.key} ${s.direction === "ascend" ? "ASC" : "DESC"}`)
      .join(", ");

    this.filtroServicio["ordenCampo"] = sortValue || "id ASC";
    console.log('Orden múltiple:', this.filtroServicio["ordenCampo"]);
    this.buscarGubernamentalPaginadoServicio();
  }

  onFilterChange(filters: Record<string, any>) {
    this.filtros = filters;
    this.buscarGubernamentalPaginadoServicio();
  }

  actualizarTabla(): void {
    this.sortField = "id";
    this.sortOrder = "ascend";
    this.filtros = {};
    this.filtroServicio = {};
    this.pageIndex = 0;
    this.hasFiltersApplied = false;
    this.emptyStateIcon = 'icon-sinDatos.svg';
    this.emptyStateMessage = 'SIN DATOS';
    this.emptyStateDescription = 'NO EXISTEN DATOS DISPONIBLES PARA CONSULTAR NI EXPORTAR';
    
    if (this.tabla && this.tabla.clearFilters) {
      this.tabla.clearFilters();
    }
    this.buscarGubernamentalPaginadoServicio();
  }

  // ✅ Nuevo (pantalla)
  nuevoGubernamental(): void {
    const modal = this.modalService.create({
      nzContent: ModalGubernamentalComponent,
      nzWidth: 600,
      nzFooter: null,
      nzClosable: true,
      nzMaskClosable: false,
      nzData: {
        modo: "crear",
        genero: null, // ✅ se queda igual porque el modal seguramente espera "genero"
        confirmationService: this.confirmationService,
      },
    });

    modal.afterClose.subscribe((result: any) => {
      if (result?.success) {
        this.alertType = "success";
        this.alertMessage = "REGISTRO GUARDADO DE FORMA CORRECTA";
        this.alertIcon = "check-circle";
        this.showAlert = true;
        this.buscarGubernamentalPaginadoServicio();
        setTimeout(() => {
          this.showAlert = false;
        }, 3000); // ⏱️ 3 segundos (ajusta a gusto)
      }
    });
  }

  exportarExcel(): void {
    const params: ConsultaTipoSectorGubernamentalParams = {
      page: 1,
      pageSize: 10000,
      sort: ''
    };

    if (this.filtros["clave"]) params.clave = this.filtros["clave"];
    if (this.filtros["sector"]) params.sector = this.filtros["sector"];
    if (this.filtros["fechaInicioVigencia"]) params.fechaInicioVigencia = this.filtros["fechaInicioVigencia"];
    if (this.filtros["fechaFinVigencia"]) params.fechaFinVigencia = this.filtros["fechaFinVigencia"];
    if (this.filtros["usuarioCreacion"]) params.usuarioCreacion = this.filtros["usuarioCreacion"];
    if (this.filtros["fechaAlta"]) params.fechaAlta = this.filtros["fechaAlta"];

    const sortDirection = this.sortOrder === "ascend" ? "ASC" : "DESC";
    params.sort = `${this.sortField} ${sortDirection}`;

    this.domiclioService.consultaTipoSectorGubernamental(params).subscribe({
      next: (resp: any) => {
        const datos = resp.datos || [];

        if (Array.isArray(datos) && datos.length > 0) {


          const columnas = [
            "CLAVE",
            "SECTOR",
            "FECHA INICIO VIGENCIA",
            "FECHA FIN VIGENCIA",
            "USUARIO CREACIÓN",
            "FECHA ALTA",
          ];
          console.log(datos);
          const datosExcel = datos.map((item: any) => ({
            
            CLAVE: item.clave || "",
            SECTOR: item.sector || "",
            "FECHA INICIO VIGENCIA": item.fechaInicioVigencia ? (() => { const d = this.dateFilterService.parseDate(item.fechaInicioVigencia); return d ? this.dateFilterService.toYMD(d) : ""; })() : "",
            "FECHA FIN VIGENCIA": item.fechaFinVigencia ? (() => { const d = this.dateFilterService.parseDate(item.fechaFinVigencia); return d ? this.dateFilterService.toYMD(d) : ""; })() : "",
            "USUARIO CREACIÓN": item.usuarioCreacion.nombre +' '+item.usuarioCreacion.aPaterno +' ' +item.usuarioCreacion.aMaterno || "",
            "FECHA ALTA": item.fechaAlta ? (() => { const d = this.dateFilterService.parseDate(item.fechaAlta); return d ? this.dateFilterService.toYMD(d) : ""; })() : "",
          }));

          const options: ExcelReporteOptions = {
            columnas,
            datos: datosExcel,
            nombreArchivo: `Reporte_Catalogo_Gubernamental.xlsx`,
            tituloTabla: "Catálogo Sector Gubernamental",
          };

          this.excelExportService
            .exportarConFormato(options)
            .then(() => {
            })
            .catch((err) => {
              console.error("Error al exportar:", err);
              this.alertType = "error";
              this.alertMessage = "Error al exportar datos";
              this.alertIcon = "close-circle";
              this.alertDescription =
                "No se pudo generar el archivo de exportación";
              this.showAlert = true;
            });
        } else {
          this.alertType = "error";
          this.alertMessage = "No hay datos para exportar";
          this.alertIcon = "info-circle";
          this.alertDescription =
            "No se encontraron registros con los filtros aplicados";
          this.showAlert = true;
        }
      },
      error: () => {
        this.alertType = "error";
        this.alertMessage = "Error al exportar datos";
        this.alertIcon = "close-circle";
        this.alertDescription = "No se pudo generar el archivo de exportación";
        this.showAlert = true;
      },
    });
  }

   // Exportar a PDF
    exportarPdf(): void {
      const params: ConsultaTipoSectorGubernamentalParams = {
        page: 1,
        pageSize: 10000,
        sort: ''
      };
  
      if (this.filtros['clave']) params.clave = this.filtros['clave'];
      if (this.filtros['sector']) params.sector = this.filtros['sector'];
      if (this.filtros['fechaInicioVigencia']) params.fechaInicioVigencia = this.filtros['fechaInicioVigencia'];
      if (this.filtros['fechaFinVigencia']) params.fechaFinVigencia = this.filtros['fechaFinVigencia'];
      if (this.filtros['usuarioCreacion']) params.usuarioCreacion = this.filtros['usuarioCreacion'];
      if (this.filtros['fechaAlta']) params.fechaAlta = this.filtros['fechaAlta'];
  
      const sortDirection = this.sortOrder === 'ascend' ? 'ASC' : 'DESC';
      params.sort = `${this.sortField} ${sortDirection}`;
  
      this.domiclioService.consultaTipoSectorGubernamental(params).subscribe({
        next: (resp: any) => {
          const datos = resp.datos || [];
          
          if (Array.isArray(datos) && datos.length > 0) {
  
  
          const columnas = [
            "CLAVE",
            "SECTOR",
            "FECHA INICIO VIGENCIA",
            "FECHA FIN VIGENCIA",
            "USUARIO CREACIÓN",
            "FECHA ALTA",
          ];
          console.log(datos);
          const datosPdf = datos.map((item: any) => ({
            
            CLAVE: item.clave || "",
            SECTOR: item.sector || "",
            "FECHA INICIO VIGENCIA": item.fechaInicioVigencia ? (() => { const d = this.dateFilterService.parseDate(item.fechaInicioVigencia); return d ? this.dateFilterService.toYMD(d) : ""; })() : "",
            "FECHA FIN VIGENCIA": item.fechaFinVigencia ? (() => { const d = this.dateFilterService.parseDate(item.fechaFinVigencia); return d ? this.dateFilterService.toYMD(d) : ""; })() : "",
            "USUARIO CREACIÓN": item.usuarioCreacion.nombre +' '+item.usuarioCreacion.aPaterno +' ' +item.usuarioCreacion.aMaterno || "",
            "FECHA ALTA": item.fechaAlta ? (() => { const d = this.dateFilterService.parseDate(item.fechaAlta); return d ? this.dateFilterService.toYMD(d) : ""; })() : "",
          }));
  
            const options: PdfReporteOptions = {
              columnas,
              datos: datosPdf,
              nombreArchivo: 'Reporte_Catalogo_Gubernamental.pdf',
              orientacion: 'l',
              titulo: 'Catálogo Sector Gubernamental',
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

  // ✅ Editar (pantalla)
  editarGubernamental(row: any): void {
    const modal = this.modalService.create({
      nzContent: ModalGubernamentalComponent,
      nzWidth: 600,
      nzFooter: null,
      nzClosable: true,
      nzMaskClosable: false,
      nzData: {
        modo: "editar",
        genero: row, // ✅ se queda igual
        confirmationService: this.confirmationService,
      },
    });

    modal.afterClose.subscribe((result: any) => {
      if (result && result.success) {
        this.alertType = "success";
        this.alertMessage = "Registro actualizado exitosamente";
        this.alertIcon = "check-circle";
        this.showAlert = true;
        this.buscarGubernamentalPaginadoServicio();
      }
    });
  }
}