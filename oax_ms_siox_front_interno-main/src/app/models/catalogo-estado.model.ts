// src/app/models/catalogo-conac.model.ts
export interface CatalogoEstado {
  id: number;
  estado: string;
  clave: string;
  fechaAlta: string;
  idPais: number;
  pais: string;
  totalRegistros?: number;
}

export interface CatalogoEstadoQuery {
  pageIndex?: number;                 // 1-based
  pageSize?: number;                  // tamaño de página
  sortKey?: keyof CatalogoEstado;
  sortDir?: 'ascend' | 'descend';
  filters?: {
    estado?: string;                   // búsqueda global (clave, nombre, descripción)
    id?: number;
    clave?: string;
    pais?: string;
    fechaAlta?: string;
  };
}

export interface PagedResult<T> {
  items: T[];
  total: number;
}
