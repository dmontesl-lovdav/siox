export type EstatusCRI = 'VIGENTE' | 'NO VIGENTE';

export interface ClasificadorRubroIngreso {
  id: number;
  /** Clave jerárquica tipo 1, 1.1, 1.1.01 */
  clave: string;
  nombre: string;
  descripcion: string;
  fechaAlta: Date | null;
  inicioVigencia: Date | null;
  finVigencia: Date | null;
  estatus: EstatusCRI;
}

/** Parámetros para consultas con paginado/orden/filtros (cliente) */
export interface CriQuery {
  pageIndex?: number;                 // 1-based
  pageSize?: number;                  // tamaño de página
  sortKey?: keyof ClasificadorRubroIngreso;
  sortDir?: 'ascend' | 'descend';
  filters?: {
    texto?: string;                   // búsqueda global (clave, nombre, descripción)
    estatus?: EstatusCRI;
    fechaAlta?: string | Date;
    inicioVigencia?: string | Date;
    finVigencia?: string | Date;
  };
}

export interface PagedResult<T> {
  items: T[];
  total: number;
}
