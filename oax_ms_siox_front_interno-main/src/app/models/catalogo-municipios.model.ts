// src/app/models/catalogo-conac.model.ts
export interface CatalogoMunicipios{
  claveMunicipio: number;
  municipio: string;
  fechaAlta: string;
  distrito: string;
  totalRegistros?: number;
}

export interface CatalogoMunicipioQuery {
  pageIndex?: number;                 // 1-based
  pageSize?: number;                  // tamaño de página
  sortKey?: keyof CatalogoMunicipios;
  sortDir?: 'ascend' | 'descend';
  filters?: {
    nombre?: string;                   // búsqueda global (clave, nombre, descripción)
    clave_municipio?: number;
    distrito?: string;
    fechaAlta?: string;
  };
}

export interface PagedResult<T> {
  items: T[];
  total: number;
}
