// src/app/models/catalogo-conac.model.ts
export interface CatalogoRegion{
  id: number;
  estado: string;
  fechaAlta: string;
  region: string;
  totalRegistros?: number;
}

export interface CatalogoRegionQuery {
  pageIndex?: number;                 // 1-based
  pageSize?: number;                  // tamaño de página
  sortKey?: keyof CatalogoRegion;
  sortDir?: 'ascend' | 'descend';
  filters?: {
    estado?: string;                   // búsqueda global (clave, nombre, descripción)
    id?: number;
    region?: string;
  
    fechaAlta?: string;
  };
}

export interface PagedResult<T> {
  items: T[];
  total: number;
}
