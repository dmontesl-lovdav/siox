// src/app/models/cat-genero.model.ts
export interface CatTipoSectorGubernamental {
  totalRegistros: number
  id: number
  clave: string
  sector: string
  fechaInicioVigencia: Date | null
  fechaFinVigencia: Date | null
  idUsuarioCreacion: number
  fechaAlta: Date | null
  idUsuarioModificacion: any
  fechaModificacion: Date | null
  activo: boolean
}

export interface CatTipoSectorGubernamentalQuery {
  pageIndex?: number;                 // 1-based
  pageSize?: number;                  // tamaño de página
  sortKey?: keyof CatTipoSectorGubernamental;
  sortDir?: 'ascend' | 'descend';
  filters?: {
    clave?: string;
    sector?: string;
    activo?: boolean;
  };
}

export interface CatGeneroUpdateDTO {
  clave: string;
  descripcion: string;
}

export interface PagedResult<T> {
  items: T[];
  total: number;
}
