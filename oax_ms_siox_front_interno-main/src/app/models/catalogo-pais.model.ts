// src/app/models/catalogo-conac.model.ts
export interface CatalogoPais {
  id: number;
  nombre: string;
  fechaAlta: string;
  totalRegistros?: number;
}

export interface CatalogoPaisQuery {
  pageIndex?: number;                 // 1-based
  pageSize?: number;                  // tamaño de página
  sortKey?: keyof CatalogoPais;
  sortDir?: 'ascend' | 'descend';
  filters?: {
    nombre?: string;                   // búsqueda global (clave, nombre, descripción)
    id?: number;
    fechaAlta?: string;
  };
}

export interface PagedResult<T> {
  items: T[];
  total: number;
}
