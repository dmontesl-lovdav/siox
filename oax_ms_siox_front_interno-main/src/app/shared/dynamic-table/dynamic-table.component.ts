import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, OnDestroy, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { DateFilterService } from '../date-filter.service';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

export type Align = 'left' | 'center' | 'right';
export type SortDir = 'ascend' | 'descend' | null;
export type ColType = 'text' | 'date' | 'tag' | 'template';
export type FilterType = 'text' | 'select' | 'date' | null;

export interface ColumnDef<T = any> {
  key: keyof T & string;
  title: string;
  width?: string;
  align?: Align;
  type?: ColType;                // 'text' (default), 'date', 'tag', 'template'
  dateFormat?: string;           // ej. 'yyyy-MM-dd'
  sortable?: boolean;
  filter?: FilterType;           // 'text' | 'select' | 'date' | null
  selectOptions?: Array<{label: string; value: any}>;
  cellTemplate?: TemplateRef<any> | null; // si type === 'template'
  tagColorMap?: (value: any, row: T) => string; // si type === 'tag'
}

@Component({
  selector: 'app-dynamic-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzTableModule,
    NzIconModule,
    NzTagModule,
    NzInputModule,
    NzSelectModule,
    NzButtonModule,
    NzDatePickerModule,
    NzPaginationModule,
    NzToolTipModule
  ],
  templateUrl: './dynamic-table.component.html',
  styleUrls: ['./dynamic-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicTableComponent<T = any> implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  @ViewChild('tableWrap', { static: true }) tableWrap!: ElementRef<HTMLElement>;

  @Input() tableClass = '';
  @Input() data: T[] = [];
  @Input() columns: ColumnDef<T>[] = [];
  @Input() actionsHeader: string = 'ACCIONES';
  @Input() actionsWidth: string = '150px';
  // UI options
  @Input() pageSize = 10;
  @Input() pageIndex = 1;                   // para server-side o controlar externamente
  @Input() pageSizeOptions: number[] = [10, 25, 50, 100];
  @Input() showSizeChanger = true;
  @Input() bordered = true;
  @Input() scrollX?: string;                // ej. '1500px'
  @Input() showIndex = false;               // columna #
  @Input() autoScroll = true;               // auto-detect para scroll horizontal

  private ro?: ResizeObserver;
  containerWidth = 0;
  nzScroll: {} | { x: string } = {};
  @Input() actionsTemplate: TemplateRef<any> | null = null;
  @Input() frontPagination = true;          // true = pagina en cliente; false = server-side
  @Input() total?: number;                  // requerido para server-side
  @Input() loading = false;
  @Input() showEmptyState = true;           // mostrar estado vacío
  @Input() emptyStateIcon?: string;          // icono para estado vacío (opcional, se calcula automáticamente)
  @Input() emptyStateMessage?: string;       // mensaje principal (opcional, se calcula automáticamente)
  @Input() emptyStateDescription?: string;   // descripción (opcional, se calcula automáticamente)
  @Input() emptyStateHeight?: string;        // altura del contenedor vacío (opcional, se calcula según pageSize)
  @Input() hasFilters = false;              // true si hay filtros activos
  @Input() tooltipMaxChars = 50;

  // Eventos útiles
  @Output() rowClick = new EventEmitter<T>();
  @Output() sortChange = new EventEmitter<{ sorts: { key: string; direction: SortDir }[] }>();
  @Output() filterChange = new EventEmitter<Record<string, any>>();
  @Output() pageIndexChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();

  // estado interno
  sorts: { key: string; direction: SortDir }[] = [];
  filters: Record<string, any> = {};

  trackByIndex = (_: number, __: T) => _;

  // Getters para valores dinámicos de estado vacío
  get computedEmptyStateIcon(): string {
    if (this.emptyStateIcon) return this.emptyStateIcon;
    return this.hasFilters ? 'icon-sinCoincidencias.svg' : 'icon-sinDatos.svg';
  }

  get computedEmptyStateMessage(): string {
    if (this.emptyStateMessage) return this.emptyStateMessage;
    return this.hasFilters ? 'FILTRADO SIN COINCIDENCIAS.' : 'NO EXISTEN DATOS DISPONIBLES PARA';
  }

  get computedEmptyStateDescription(): string {
    if (this.emptyStateDescription) return this.emptyStateDescription;
    return this.hasFilters 
      ? 'NO EXISTEN DATOS PARA EXPORTAR.'
      : 'CONSULTAR NI EXPORTAR.';
  }

  get computedEmptyStateHeight(): string {
    if (this.emptyStateHeight) return this.emptyStateHeight;
    // Calcular altura basada en pageSize (aprox 48px por fila)
    const height = this.pageSize * 48;
    return `${height}px`;
  }

  constructor(
    private cdr: ChangeDetectorRef,
    private dateFilterService: DateFilterService
  ) {}

  ngOnInit(): void {
    this.configureEstatusFilter();
    this.normalizeColumnWidths();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['columns']) {
      this.configureEstatusFilter();
      this.normalizeColumnWidths();
    }
  }

  private normalizeColumnWidths(): void {
    if (!this.columns || this.columns.length === 0) return;

    // Verificar si alguna columna tiene width especificado
    const hasExplicitWidths = this.columns.some(col => col.width);

    // Si no hay widths especificados, dividir 100% equitativamente
    if (!hasExplicitWidths) {
      const equalWidth = (100 / this.columns.length).toFixed(2) + '%';
      this.columns.forEach(col => {
        col.width = equalWidth;
      });
    }
  }

  private configureEstatusFilter(): void {
    const estatusCol = this.columns.find(col => col.key === 'estatus');
    if (estatusCol && !estatusCol.selectOptions) {
      estatusCol.filter = 'select';
      estatusCol.selectOptions = [
        { label: 'Todas', value: '' },
        { label: 'Bloqueado', value: true },
        { label: 'Desbloqueado', value: false }
      ];
    }
  }

  private normalizeEstatusValue(value: any): boolean | null {
    if (value === true || value === false) return value;
    if (value === 1 || value === '1') return true;
    if (value === 0 || value === '0') return false;

    if (typeof value === 'string') {
      const v = value.trim().toLowerCase();
      if (['true', 't', 'si', 'sí', 's', 'bloqueado', 'blocked'].includes(v)) return true;
      if (['false', 'f', 'no', 'n', 'desbloqueado', 'unblocked'].includes(v)) return false;
    }

    return null;
  }

  ngAfterViewInit(): void {
    this.containerWidth = this.tableWrap?.nativeElement?.clientWidth ?? 0;
    this.computeScroll();

    if (this.autoScroll && typeof ResizeObserver !== 'undefined') {
      this.ro = new ResizeObserver((entries) => {
        const w = entries?.[0]?.contentRect?.width ?? 0;
        if (w && Math.abs(w - this.containerWidth) > 1) {
          this.containerWidth = w;
          this.computeScroll();
          this.cdr.markForCheck();
        }
      });
      this.ro.observe(this.tableWrap.nativeElement);
    }
  }

  ngOnDestroy(): void {
    this.ro?.disconnect();
  }

  private parsePx(value?: string): number | null {
    if (!value) return null;
    const m = String(value).trim().match(/^([0-9]+)(px)?$/i);
    return m ? Number(m[1]) : null;
  }

  private computeScroll(): void {
    // Si no hay scrollX configurado, no forzamos nada.
    if (!this.scrollX) {
      this.nzScroll = {};
      return;
    }

    const px = this.parsePx(this.scrollX);
    if (!px || !this.containerWidth) {
      this.nzScroll = {};
      return;
    }

    // En pantallas chicas: habilita scroll horizontal.
    // En pantallas grandes: sin scroll para que use todo el width.
    this.nzScroll = this.containerWidth < px ? { x: this.scrollX } : {};
  }

  setSort(key: string, direction: Exclude<SortDir, null>, event?: MouseEvent) {
    if (event && (event.ctrlKey || event.metaKey)) {
      // Orden múltiple (Ctrl/Cmd)
      const idx = this.sorts.findIndex(s => s.key === key);
      if (idx !== -1) {
        // Si ya está, alterna o elimina
        if (this.sorts[idx].direction === direction) {
          this.sorts.splice(idx, 1);
        } else {
          this.sorts[idx].direction = direction;
        }
      } else {
        this.sorts.push({ key, direction });
      }
    } else {
      // Orden simple (sin Ctrl/Cmd)
      const idx = this.sorts.findIndex(s => s.key === key);
      if (idx !== -1 && this.sorts[idx].direction === direction && this.sorts.length === 1) {
        this.sorts = [];
      } else {
        this.sorts = [{ key, direction }];
      }
    }
    this.sortChange.emit({ sorts: [...this.sorts] });
  }

  clearSort() {
    this.sorts = [];
    this.sortChange.emit({ sorts: [] });
  }

  onFilterChange() {
    // No resetear pageIndex aquí porque se maneja en el servidor
    this.cdr.markForCheck(); // marcar para que recalcule viewData
    // Siempre emitir filterChange para que el padre pueda reaccionar (incluso cuando se borran todos)
    this.filterChange.emit(this.buildFilterPayload());
  }

  private hasActiveNonEstatusFilter(): boolean {
    return Object.keys(this.filters).some(key => {
      if (key === 'estatus') return false;
      const value = this.filters[key];
      return value !== '' && value !== undefined && value !== null;
    });
  }

  private buildFilterPayload(): Record<string, any> {
    const payload: Record<string, any> = {};

    for (const col of this.columns) {
      const key = col.key;
      const value = this.filters[key];

      if (value === undefined) continue;

      if (col.filter === 'date') {
        payload[key] = this.dateFilterService.normalizeDateFilterValue(value);
      } else {
        payload[key] = value;
      }
    }

    return payload;
  }

  clearFilters() {
    Object.keys(this.filters).forEach(key => {
      this.filters[key] = '';
    });
    this.onFilterChange();
  }

  // Pipeline: filter → sort (solo para frontPagination = true)
  get viewData(): T[] {
    let out = [...(this.data || [])];

    if (!this.frontPagination) {
      // server-side: solo filtra localmente estatus cuando aplica
      const hasEstatusFilter = this.filters['estatus'] !== undefined
        && this.filters['estatus'] !== null
        && this.filters['estatus'] !== '';
      if (!hasEstatusFilter) {
        return out;
      }
    }

    // === filtros ===
    for (const col of this.columns) {
      const key = col.key;
      const fType = col.filter ?? null;
      const fValue = this.filters[key];

      if (!fType || fValue === undefined || fValue === null || fValue === '') continue;

      out = out.filter((row: any) => {
        const cell = row[key];

        if (fType === 'text') {
          return String(cell ?? '').toLowerCase().includes(String(fValue).toLowerCase());
        }

        if (fType === 'select') {
          if (key === 'estatus') {
            const cellNorm = this.normalizeEstatusValue(cell);
            const filterNorm = this.normalizeEstatusValue(fValue);
            if (filterNorm === null) return cell === fValue;
            if (cellNorm === null) return false;
            return cellNorm === filterNorm;
          }
          return cell === fValue;
        }

        if (fType === 'date') {
          // fValue puede ser Date o string 'yyyy-MM-dd'
          const target = this.dateFilterService.parseDate(cell);
          if (!target) return false;

          const wanted = this.dateFilterService.parseDate(fValue);
          if (!wanted) return true; // si el picker no tiene fecha válida, no filtra

          return this.dateFilterService.toYMD(target) === this.dateFilterService.toYMD(wanted);
        }

        return true;
      });
    }

    // === orden ===
    if (this.sorts.length > 0) {
      out.sort((a: any, b: any) => {
        for (const { key, direction } of this.sorts) {
          const av = a[key];
          const bv = b[key];
          const na = av instanceof Date ? +av : (isNaN(+av) ? av : +av);
          const nb = bv instanceof Date ? +bv : (isNaN(+bv) ? bv : +bv);
          let cmp = 0;
          if (typeof na === 'number' && typeof nb === 'number') {
            cmp = na - nb;
          } else {
            cmp = String(na).localeCompare(String(nb), undefined, { sensitivity: 'base', numeric: true });
          }
          if (cmp !== 0) {
            return direction === 'ascend' ? cmp : -cmp;
          }
        }
        return 0;
      });
    }
    return out;
  }

  // Devuelve la dirección de orden para una columna
  getSortDirection(key: string): SortDir | null {
    const found = this.sorts.find(s => s.key === key);
    return found ? found.direction : null;
  }

  // Devuelve la prioridad de orden para una columna (1,2,3...)
  getSortPriority(key: string): number | null {
    const idx = this.sorts.findIndex(s => s.key === key);
    return idx !== -1 ? idx + 1 : null;
  }

  getCell(row: any, key: string): any {
    return row?.[key];
  }

  getColumnAlign(col: ColumnDef<T>): Align {
    if (col.align) return col.align;
    const type = col.type ?? 'text';
    return type === 'text' ? 'left' : 'center';
  }

  getTextCellValue(row: any, col: ColumnDef<T>): string {
    const value = this.getCell(row, col.key);
    if (value === null || value === undefined) return '';
    // Limpiar espacios extras que puedan venir del backend
    return String(value).replace(/\s+/g, ' ').trim();
  }

  getDisplayText(row: any, col: ColumnDef<T>): string {
    const text = this.getTextCellValue(row, col);
    if (!text) return '';
    return text.length > this.tooltipMaxChars
      ? `${text.slice(0, this.tooltipMaxChars).trimEnd()}…`
      : text;
  }

  shouldShowTooltip(row: any, col: ColumnDef<T>): boolean {
    const text = this.getTextCellValue(row, col);
    return text.length > this.tooltipMaxChars;
  }
  // rango mostrado (usando el total filtrado cuando es frontPagination)
get totalItems(): number {
  return this.total ?? this.viewData.length;
}
get rangeStart(): number {
  if (this.totalItems === 0) return 0;
  return (this.pageIndex - 1) * this.pageSize + 1;
}
get rangeEnd(): number {
  return Math.min(this.pageIndex * this.pageSize, this.totalItems);
}
get totalPages(): number {
  return Math.max(1, Math.ceil(this.totalItems / this.pageSize));
}

// handlers para la paginación externa (también sirven para server-side)
onExternalPageIndexChange(i: number) {
  this.pageIndex = i;
  this.pageIndexChange.emit(i);
}
onExternalPageSizeChange(size: number) {
  this.pageSize = size;
  this.pageIndex = 1; // reset lógico
  this.pageSizeChange.emit(size);
  this.pageIndexChange.emit(1);
}

}
