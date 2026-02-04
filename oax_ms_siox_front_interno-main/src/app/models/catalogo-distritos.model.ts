// src/app/models/catalogo-distritos.model.ts
export interface CatalogoDistritos{
  id: number;
  region: string;
  fechaAlta: string;
  nombre: string;
  totalRegistros?: number;
}

export interface CatalogoRegionQuery {
  pageIndex?: number;                 // 1-based
  pageSize?: number;                  // tamaño de página
  sortKey?: keyof CatalogoDistritos;
  sortDir?: 'ascend' | 'descend';
  filters?: {
    nombre?: string;                   // búsqueda global (clave, nombre, descripción)
    id?: number;
    region?: string;
    fechaAlta?: string;
  };
}

export interface PagedResult<T> {
  items: T[];
  total: number;
}
