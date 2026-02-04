// src/app/models/catalogo-conac.model.ts
export interface CatalogoPeriodo {
  id: number;
  periodo: string;
  totalRegistros?: number;
}

export interface PeridoQuery {
  pageIndex?: number;                 // 1-based
  pageSize?: number;                  // tamaño de página
  sortKey?: keyof CatalogoPeriodo;
  sortDir?: 'ascend' | 'descend';
  filters?: {
    texto?: string;                   // búsqueda global (clave, nombre, descripción)
    id?: number;
  };
}

export interface PagedResult<T> {
  items: T[];
  total: number;
}
