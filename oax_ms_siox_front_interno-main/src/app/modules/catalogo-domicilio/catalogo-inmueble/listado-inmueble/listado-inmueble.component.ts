import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTagModule } from 'ng-zorro-antd/tag';


// ⚠️ Deja servicios como están (luego creas VialidadService)

import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

import { ModalInmuebleComponent } from '../modal-inmueble/modal-inmueble.component';
import { ColumnDef, DynamicTableComponent } from '../../../../shared/dynamic-table/dynamic-table.component';
import { ExcelExportService } from '../../../../services/export/excel-export.service';
import { PdfExportService } from '../../../../services/export/pdf-export.service';
import { ExcelReporteOptions } from '../../../../shared/excel-reporte.util';
import { GenericAlertComponent } from '../../../../shared/generic-alert/generic-alert.component';
import { ConfirmationContainerComponent, ConfirmationService } from '../../../../shared/confirmation-modal';
import { CargaMasivaCriService } from '../../../../services/catalogo.cri.service';
import { CatalogoConacService, ConsultaConacParams } from '../../../../services/catalogo-conac.service';
import { BreadcrumbService } from '../../../../services/breadcrumb.service';

type InmuebleRow = {
  id?: number | string;
  descripcion?: string;
  tipoAmbito?: string; // URBANO / RURAL
  fechaAlta?: Date | null;
  usuarioCreacion?: string;
  bloqueado?: boolean | 'SÍ' | 'NO' | string;
  origen?: string;
};


@Component({
  selector: 'app-listado-inmueble',
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
    GenericAlertComponent,
    NzToolTipModule,
    ConfirmationContainerComponent
],
  providers: [NzModalService, ConfirmationService],
  templateUrl: './listado-inmueble.component.html',
  styleUrls: ['./listado-inmueble.component.scss']
})
export class ListadoInmuebleComponent implements OnInit, AfterViewInit {
  // ===== ALERTAS (IGUAL QUE TENÍAS) =====
  showAlert = false;
  alertMessage = '';
  alertType: 'success' | 'error' = 'success';
  alertIcon = '';
  alertDescription = '';
  alertDownloadLink = '';

  closeAlert() {
    this.showAlert = false;
    this.alertMessage = '';
    this.alertType = 'success';
    this.alertIcon = '';
    this.alertDescription = '';
    this.alertDownloadLink = '';
  }

  onGuardarModal(resultado: any) {
    if (resultado.status === 'success') {
      this.alertType = 'success';
      this.alertMessage = resultado.message;
      this.alertIcon = 'check-circle';
      this.alertDescription = '';
      this.showAlert = true;
      this.buscarClasificadorPaginadoServicio();
    } else {
      this.alertType = 'error';
      this.alertMessage = resultado.message;
      this.alertIcon = 'close-circle';
      this.alertDescription = resultado.error?.message || '';
      this.showAlert = true;
    }
    this.modalVisible = false;
  }

  // ===== TABLA =====
  @ViewChild('tabla', { static: false }) tabla: any;

  // Template para la columna BLOQUEAR
@ViewChild('accionesTpl', { static: true }) accionesTpl!: TemplateRef<any>;
@ViewChild('tplBloquear', { static: true }) tplBloquear!: TemplateRef<any>;

filtroServicio: Record<string, string> = {
  descripcion: '',
  tipoAmbito: '', // NUEVO
  fechaAlta: '',
  usuarioCreacion: '',
  bloquear: '',
  ordenCampo: ''
};


  pageIndex = 0;
  pageSize = 10;
  total = 0;

  data: InmuebleRow[] = [];

private makeCol<K extends keyof InmuebleRow>(
  def: Omit<ColumnDef<InmuebleRow>, 'key'> & { key: K }
): ColumnDef<InmuebleRow> { return def; }

colsInmueble: ColumnDef<InmuebleRow>[] = [
this.makeCol({ key: 'descripcion', title: 'DESCRIPCIÓN', filter: 'text', sortable: true }),

this.makeCol({
  key: 'tipoAmbito',
  title: 'TIPO ÁMBITO',
  filter: 'text',
  sortable: true
}),

this.makeCol({
  key: 'fechaAlta',
  title: 'FECHA ALTA',
  type: 'date',
  dateFormat: 'dd/MM/yyyy',
  filter: 'text',
  sortable: true
}),

this.makeCol({
  key: 'usuarioCreacion',
  title: 'USUARIO DE CREACIÓN',
  filter: 'text',
  sortable: true
}),

this.makeCol({
  key: 'acciones' as any,
  title: 'EDITAR / CONSULTAR',
  type: 'template',
  sortable: false,
  width: '160px'
}),

this.makeCol({
  key: 'bloqueado',
  title: 'BLOQUEAR',
  type: 'template',
  sortable: false,
  filter: 'select',
  selectOptions: [
    { label: 'BLOQUEADO', value: 'true' },
    { label: 'DESBLOQUEADO', value: 'false' }
  ],
  width: '120px',
  cellTemplate: null
})

];

  // Modal
  modalVisible = false;
  registroSeleccionado: any = null;
  origenSeleccionado: string = '';

  // ⚠️ Lo dejamos para no romper tu servicio actual si lo necesita, pero NO se muestra en UI
  ejercicioSeleccionado = String(new Date().getFullYear());

constructor(
  private cargaMasivaCriService: CargaMasivaCriService,
  private catalogoConacService: CatalogoConacService,
  private router: Router,
  private breadcrumbService: BreadcrumbService,
  private modalService: NzModalService,
  private confirmationService: ConfirmationService,
  private excelExportService: ExcelExportService,
  private pdfExportService: PdfExportService
) {}


  ngOnInit(): void {
    this.breadcrumbService.setBreadcrumbReplace([
      { nombre: 'ADMINISTRACIÓN DE CONTRIBUYENTES' },
      { nombre: 'ADMINISTRADOR DE CATÁLOGOS DE CONTRIBUYENTES' },
      { nombre: 'CATÁLOGOS PARA DOMICILIO' },
      { nombre: 'ADMINISTRADOR DE CATÁLOGO DE TIPO DE INMUEBLE', actual: true }
    ]);
    this.buscarClasificadorPaginadoServicio();
  }

ngAfterViewInit(): void {
  const colAcciones = this.colsInmueble.find(c => c.key === ('acciones' as any));
  if (colAcciones) colAcciones.cellTemplate = this.accionesTpl;

  const colBloquear = this.colsInmueble.find(c => c.key === 'bloqueado');
  if (colBloquear) colBloquear.cellTemplate = this.tplBloquear;

  this.colsInmueble = [...this.colsInmueble];
}


  // ===== HEADER (como la imagen) =====
nuevoRegistro(): void {
  this.abrirModalInmueble('crear', null);
}


  exportarExcel(): void {
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

        const encabezados = [
          ['LOGO_IZQUIERDA', '', 'LOGO_DERECHA'],
          ['', 'Subsecretaría de Ingresos', ''],
          ['', 'Dirección de Ingresos y Recaudación', ''],
          ['', 'Catálogo Inmueble', '']
        ];

        const columnas = ['ID', 'Descripción', 'Tipo Ámbito', 'Fecha Alta', 'Usuario Creación'];

        const datosExcel = datos.map((item: any) => ({
          ID: item.id || '',
          Descripción: item.descripcion || '',
          'Tipo Ámbito': item.tipoAmbito || '',
          'Fecha Alta': item.fechaAlta || '',
          'Usuario Creación': item.usuarioCreacion || ''
        }));

        const options: ExcelReporteOptions = {
          columnas,
          datos: datosExcel,
          nombreArchivo: 'Reporte_Inmueble.xlsx',
          tituloTabla: 'Catálogo Inmueble'
        };

        this.excelExportService.exportarConFormato(options).then(() => {
        }).catch((err: any) => {
          console.error('Error al exportar:', err);
        });
      },
      error: (err) => {
        console.error('Error al exportar:', err);
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

        const encabezados = [
          ['', 'Subsecretaría de Ingresos', ''],
          ['', 'Dirección de Ingresos y Recaudación', ''],
          ['', 'Coordinación Técnica de Ingresos', ''],
          ['', 'Catálogo Inmueble', '']
        ];

        const columnas = ['ID', 'Descripción', 'Tipo Ámbito', 'Fecha Alta', 'Usuario Creación'];

        const datosPdf = datos.map((item: any) => ({
          ID: item.id || '',
          Descripción: item.descripcion || '',
          'Tipo Ámbito': item.tipoAmbito || '',
          'Fecha Alta': item.fechaAlta || '',
          'Usuario Creación': item.usuarioCreacion || ''
        }));

        const options: any = { encabezados, columnas, datos: datosPdf, nombreArchivo: 'Reporte_Inmueble.pdf', orientacion: 'l' };
        options.logoIzquierdaPath = 'assets/logo_izquierda_reporte.png';
        options.logoDerechaPath = 'assets/logo_derecha_reporte.png';

        this.pdfExportService.exportarConFormato(options).then(() => {
        }).catch((err: any) => {
          console.error('Error al exportar PDF:', err);
          this.alertType = 'error';
          this.alertMessage = 'Error al exportar PDF';
          this.alertIcon = 'close-circle';
          this.alertDescription = 'No se pudo generar el PDF';
          this.showAlert = true;
        });
      },
      error: (err) => {
        console.error('Error al exportar PDF:', err);
      }
    });
  }

  actualizarTabla(): void {
    Object.keys(this.filtroServicio).forEach(k => this.filtroServicio[k] = '');
    if (this.tabla?.clearFilters) this.tabla.clearFilters();
    this.pageIndex = 0;
    this.buscarClasificadorPaginadoServicio();
  }

  // ===== acciones por fila =====
editar(row: any): void {
  if (!row) return;
  this.abrirModalInmueble('editar', row);
}


consultar(row: any): void {
  if (!row) return;
  this.abrirModalInmueble('consultar', row);
}

toggleBloquear(row: any): void {
  const bloqueado = this.isBloqueado(row);
  const accion = bloqueado ? 'DESBLOQUEAR' : 'BLOQUEAR';

  this.confirmationService.confirm({
    title: `${accion} REGISTRO`,
    message: `¿CONFIRMA QUE DESEA ${accion} EL REGISTRO "${row.descripcion}"?`,
    type: 'warning',
    confirmText: `SÍ, ${accion}`,
    cancelText: 'NO',
    width: '720px'
  }).subscribe(res => {
    if (!res.confirmed) return;

    // aquí ya haces el cambio real o el cascarón
    row.bloqueado = bloqueado ? 'NO' : 'SÍ';
  });
}


getBloqueadoValue(row: any): 'SÍ' | 'NO' {
  const v = row?.bloqueado;
  if (v === true) return 'SÍ';
  if (v === false) return 'NO';
  if (typeof v === 'string') {
    const x = v.trim().toUpperCase();
    return (x === 'SÍ' || x === 'SI') ? 'SÍ' : 'NO';
  }
  return 'NO';
}
  // ===== paginación / filtros / sort (se quedan) =====
  onPageChange(page: number): void {
    this.pageIndex = page - 1;
    this.buscarClasificadorPaginadoServicio();
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.buscarClasificadorPaginadoServicio();
  }

  onSortChange(evt: { sorts: { key: string; direction: 'ascend' | 'descend' | null }[] }) {
    const validSorts = (evt.sorts || []).filter(s => s.direction === 'ascend' || s.direction === 'descend');
    const sortValue = validSorts.map(s => `${s.key} ${s.direction === 'ascend' ? 'ASC' : 'DESC'}`).join(', ');
    this.filtroServicio['ordenCampo'] = sortValue || '';
    this.buscarClasificadorPaginadoServicio();
  }

  onFiltroServicioChange(filtros: Record<string, string>): void {
    Object.keys(this.filtroServicio).forEach(key => {
      if (key !== 'ordenCampo') this.filtroServicio[key] = filtros[key] ?? '';
    });
    this.pageIndex = 0;
    this.buscarClasificadorPaginadoServicio();
  }

  // ===== servicio (temporal) =====
  buscarClasificadorPaginadoServicio(): void {
    const params: ConsultaConacParams = {
      ejercicio: Number(this.ejercicioSeleccionado),
      page: this.pageIndex + 1,
      pageSize: this.pageSize
    };

    const { descripcion, fechaAlta, usuarioCreacion, bloquear, ordenCampo } = this.filtroServicio;

    if (descripcion?.trim()) (params as any).descripcion = descripcion.trim();
    if (fechaAlta?.trim()) (params as any).fechaAlta = fechaAlta.trim();
    if (usuarioCreacion?.trim()) (params as any).usuarioCreacion = usuarioCreacion.trim();
    if (bloquear?.trim()) (params as any).bloqueado = bloquear.trim();
    if (ordenCampo?.trim()) (params as any).sort = ordenCampo.trim();

    this.catalogoConacService.consultarConac(params).subscribe({
      next: (resp: any) => {
        const datos = resp.datos || resp.content || resp.data || resp.items || resp || [];

        if (Array.isArray(datos)) {
this.data = datos.map((item: any, idx: number) => ({
  id: item.id ?? idx,
  descripcion: item.descripcion,
  tipoAmbito: item.tipoAmbito ?? 'URBANO',
  fechaAlta: item.fechaAlta ? new Date(item.fechaAlta) : null,
  usuarioCreacion: item.usuarioCreacion ?? 'USUARIO 1',
  bloqueado: item.bloqueado ?? 'NO'
}));

          this.total = resp.total || resp.totalElements || resp.totalCount || datos.length;
        } else {
          this.data = [];
          this.total = 0;
        }
      },
      error: (error) => {
        console.error('Error al consultar:', error);
        this.data = [];
        this.total = 0;
        this.alertType = 'error';
        this.alertMessage = 'Error al consultar el catálogo';
        this.alertIcon = 'close-circle';
        this.alertDescription = 'No se pudieron cargar los datos del catálogo de inmueble';
        this.showAlert = true;
      }
    });
  }

private abrirModalInmueble(
  modo: 'crear' | 'editar' | 'consultar',
  row: any | null = null
): void {

  const titulo =
    modo === 'crear'
      ? 'NUEVO REGISTRO DEL CATÁLOGO DE TIPO DE INMUEBLE'
      : modo === 'editar'
        ? 'EDITAR REGISTRO DEL CATÁLOGO DE TIPO DE INMUEBLE'
        : 'DETALLE DEL CATÁLOGO DE TIPO DE INMUEBLE';

  const modal = this.modalService.create({
    nzTitle: titulo,                 // ✅ string
    nzContent: ModalInmuebleComponent,
    nzWidth: 600,
    nzFooter: null,
    nzClosable: true,
    nzMaskClosable: false,
    nzData: {
      modo,
      genero: row,
      confirmationService: this.confirmationService
    }
  });

  modal.afterClose.subscribe((result: any) => {
    if (result && result.success) {
      this.alertType = 'success';
      this.alertMessage = modo === 'editar'
        ? 'Registro actualizado exitosamente'
        : 'Registro guardado exitosamente';
      this.alertIcon = 'check-circle';
      this.alertDescription = result.message || '';
      this.showAlert = true;
      this.buscarClasificadorPaginadoServicio();
    }
  });
}
isBloqueado(row: any): boolean {
  return this.getBloqueadoValue(row) === 'SÍ';
}

}
