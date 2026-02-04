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

import { CargaMasivaCriService } from '../../../../services/catalogo.cri.service';
import { ConfirmationContainerComponent, ConfirmationService } from '../../../../shared/confirmation-modal';
import { ColumnDef, DynamicTableComponent } from '../../../../shared/dynamic-table/dynamic-table.component';
import { ExcelExportService } from '../../../../services/export/excel-export.service';
import { PdfExportService } from '../../../../services/export/pdf-export.service';
import { ExcelReporteOptions } from '../../../../shared/excel-reporte.util';
import { GenericAlertComponent } from '../../../../shared/generic-alert/generic-alert.component';
import { ModalVialidadComponent } from '../modal-vialidad/modal-vialidad.component';

import { BreadcrumbService } from '../../../../services/breadcrumb.service';
import { CatDomicilioService, ConsultaVialidadParams } from '../../../../services/cat-pais.service';

type VialidadRow = {
  id?: number | string;
  descripcion?: string;
  fechaAlta?: Date | null;
  usuarioCreacion?: string;
  bloqueado?: boolean | 'SÍ' | 'NO' | string;
  origen?: string;
};

@Component({
  selector: 'app-listado-vialidad',
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
  templateUrl: './listado-vialidad.component.html',
  styleUrls: ['./listado-vialidad.component.scss']
})
export class ListadoVialidadComponent implements OnInit, AfterViewInit {
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
    fechaAlta: '',
    usuarioCreacion: '',
    bloquear: '',       // opcional (SÍ/NO) si quieres filtrar
    ordenCampo: ''
  };

  pageIndex = 0;
  pageSize = 10;
  total = 0;

  data: VialidadRow[] = [];

  private makeCol<K extends keyof VialidadRow>(
    def: Omit<ColumnDef<VialidadRow>, 'key'> & { key: K }
  ): ColumnDef<VialidadRow> { return def; }

  colsVialidad: ColumnDef<VialidadRow>[] = [
    this.makeCol({ key: 'descripcion', title: 'DESCRIPCIÓN', filter: 'text',width: '100px', sortable: true }),
      this.makeCol({ 
        key: 'fechaAlta', 
        title: 'FECHA ALTA', 
        filter: 'date', 
        sortable: true, 
        width: '100px',
        type: 'date'
      }),
    this.makeCol({ key: 'usuarioCreacion', title: 'USUARIO DE CREACIÓN', filter: 'text',width: '50px', sortable: true }),

this.makeCol({
    key: 'acciones' as any,
    title: 'ACCIONES',
    type: 'template',
    sortable: false,
    width: '20px',
    cellTemplate: null
  }),

  // ✅ BLOQUEAR
  this.makeCol({
    key: 'bloqueado',
    title: 'BLOQUEAR',
    type: 'template',
    sortable: false,
   width: '20px',
   
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
  private catDomicilioService: CatDomicilioService,
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
      { nombre: 'ADMINISTRADOR DE CATÁLOGO DE TIPO DE VIALIDAD', actual: true }
    ]);
    this.buscarClasificadorPaginadoServicio();
  }

ngAfterViewInit(): void {
  const colAcciones = this.colsVialidad.find(c => c.key === ('acciones' as any));
  if (colAcciones) colAcciones.cellTemplate = this.accionesTpl;

  const colBloquear = this.colsVialidad.find(c => c.key === 'bloqueado');
  if (colBloquear) colBloquear.cellTemplate = this.tplBloquear;

  this.colsVialidad = [...this.colsVialidad]; // refresh
}

  // ===== HEADER (como la imagen) =====
nuevoRegistro(): void {
  this.abrirModalVialidad('crear', null);
}


  exportarExcel(): void {
    const params: ConsultaVialidadParams = { page: 1, pageSize: 10000 };
    this.catDomicilioService.consultarVialidad(params).subscribe({
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
          ['', 'Catálogo Tipo Vialidad', '']
        ];

        const columnas = ['ID', 'Descripción', 'Fecha Alta', 'Usuario Creación', 'Bloqueada'];

        const datosExcel = datos.map((item: any) => ({
          ID: item.id || '',
          Descripción: item.descripcion || item.descripcionVialidad || '',
          'Fecha Alta': item.fechaAlta || '',
          'Usuario Creación': item.usuarioCreacion || '',
          Bloqueada: item.estatus ? 'SÍ' : 'NO'
        }));

        const options: ExcelReporteOptions = {
          columnas,
          datos: datosExcel,
          nombreArchivo: 'Reporte_Vialidad.xlsx',
          tituloTabla: 'Catálogo Tipo Vialidad'
        };

        this.excelExportService.exportarConFormato(options).then(() => {
        }).catch((err) => {
          console.error('Error al exportar:', err);
        });
      },
      error: (err) => {
        console.error('Error al exportar:', err);
      }
    });
  }

  exportarPdf(): void {
    const params: ConsultaVialidadParams = { page: 1, pageSize: 10000 };
    this.catDomicilioService.consultarVialidad(params).subscribe({
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
          ['', 'Catálogo Tipo Vialidad', '']
        ];

        const columnas = ['ID', 'Descripción', 'Fecha Alta', 'Usuario Creación', 'Bloqueada'];

        const datosPdf = datos.map((item: any) => ({
          ID: item.id || '',
          Descripción: item.descripcion || item.descripcionVialidad || '',
          'Fecha Alta': item.fechaAlta || '',
          'Usuario Creación': item.usuarioCreacion || '',
          Bloqueada: item.estatus ? 'SÍ' : 'NO'
        }));

        const options: any = { encabezados, columnas, datos: datosPdf, nombreArchivo: 'Reporte_Vialidad.pdf', orientacion: 'l' };
        options.logoIzquierdaPath = 'assets/logo_izquierda_reporte.png';
        options.logoDerechaPath = 'assets/logo_derecha_reporte.png';

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
  this.abrirModalVialidad('editar', row);
}


consultar(row: any): void {
  if (!row) return;
  this.abrirModalVialidad('consultar', row);
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

    (window as any).showGlobalSpinner?.();

    this.catDomicilioService.actualizarEstatusVialidad(Number(row.id), { estatus: !bloqueado }).subscribe({
      next: (resp: any) => {

        (window as any).hideGlobalSpinner?.();

        // refresca (o si quieres, actualizas row en caliente)
        this.alertType = 'success';
        this.alertMessage = `Registro ${accion === 'BLOQUEAR' ? 'bloqueado' : 'desbloqueado'} correctamente`;
        this.alertIcon = 'check-circle';
        this.alertDescription = resp?.mensaje || '';
        this.showAlert = true;

        this.buscarClasificadorPaginadoServicio();
      },
      error: (err: any) => {
        (window as any).hideGlobalSpinner?.();
        console.error(err);

        this.alertType = 'error';
        this.alertMessage = `No se pudo ${accion.toLowerCase()} el registro`;
        this.alertIcon = 'close-circle';
        this.alertDescription = err?.error?.mensaje || err?.message || '';
        this.showAlert = true;
      }
    });
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
  const params: ConsultaVialidadParams = {
    page: this.pageIndex + 1,
    pageSize: this.pageSize
  };

  const { descripcion, ordenCampo, bloquear } = this.filtroServicio;

  // ✅ tu backend usa "busqueda"
  if (descripcion?.trim()) params.busqueda = descripcion.trim();

  // ✅ sort
  if (ordenCampo?.trim()) params.sort = ordenCampo.trim();

  // (bloquear no existe como filtro en backend; si lo quieres filtrar en front, lo hacemos local)
  this.catDomicilioService.consultarVialidad(params).subscribe({
next: (resp: any) => {
  console.log('Respuesta del servicio consultar vialidad:', resp);

  // 1) Resp null (tipo 204 o vacío)
  if (!resp || resp === null) {
    this.data = [];
    this.total = 0;
    this.alertType = 'error';
    this.alertMessage = 'No hay datos disponibles';
    this.alertIcon = 'info-circle';
    this.alertDescription = 'No se encontraron registros del catálogo de vialidad';
    this.showAlert = true;
    return;
  }

  // 2) Resp con exito=false (error controlado del backend)
  if (resp.exito === false) {
    this.data = [];
    this.total = 0;
    this.alertType = 'error';
    this.alertMessage = resp.mensaje || 'Error al consultar el catálogo';
    this.alertIcon = 'close-circle';
    this.alertDescription = resp.mensaje || '';
    this.showAlert = true;
    return;
  }

  // 3) OK → mapear datos
  const datos = resp.datos || [];

  if (Array.isArray(datos) && datos.length > 0) {
    this.data = datos.map((item: any) => {
      const estatusBoolean = item.estatus === true || item.estatus === 'true';

      return {
        id: item.id,
        descripcion: item.descripcion || item.descripcionVialidad || item.nombre || '',
        fechaAlta: item.fechaAlta || null,
        usuarioCreacion: item.usuarioCreacion || '',
        bloqueado: estatusBoolean, // 👈 si tu tabla usa bloqueado
        origen: item.origen || ''
      } as any;
    });

    this.total = resp.total || datos.length;
  } else {
    this.data = [];
    this.total = 0;

    this.alertType = 'error';
    this.alertMessage = 'No se encontraron registros';
    this.alertIcon = 'info-circle';
    this.alertDescription = 'No hay vialidad con los filtros aplicados';
    this.showAlert = true;
  }
},


    error: (error) => {
      console.error('Error al consultar Vialidad:', error);
      this.data = [];
      this.total = 0;
      this.alertType = 'error';
      this.alertMessage = 'Error al consultar el catálogo';
      this.alertIcon = 'close-circle';
      this.alertDescription = 'No se pudieron cargar los datos del catálogo de vialidad';
      this.showAlert = true;
    }
  });
}

private abrirModalVialidad(
  modo: 'crear' | 'editar' | 'consultar',
  row: any | null = null
): void {

  const titulo =
    modo === 'crear'
      ? 'NUEVO REGISTRO DEL CATÁLOGO DE TIPO DE VIALIDAD'
      : modo === 'editar'
        ? 'EDITAR REGISTRO DEL CATÁLOGO DE TIPO DE VIALIDAD'
        : 'DETALLE DEL CATÁLOGO DE TIPO DE VIALIDAD';

  const modal = this.modalService.create({
    nzTitle: titulo,                 // ✅ string
    nzContent: ModalVialidadComponent,
    nzWidth: 600,
    nzFooter: null,
    nzClosable: true,
    nzMaskClosable: false,
nzData: {
  modo,
  vialidad: row,
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
