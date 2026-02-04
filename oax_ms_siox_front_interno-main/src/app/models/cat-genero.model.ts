// src/app/models/cat-genero.model.ts
export interface CatGenero {
  totalRegistros?: number;
  id: number;
  clave: string;
  descripcion: string;
  fechaAlta: Date | string;
  usuarioCreacion: string;
  estatus: boolean | string;
  // Campos auxiliares para visualización
  estatusTexto?: string;
}

export interface CatGeneroQuery {
  pageIndex?: number;                 // 1-based
  pageSize?: number;                  // tamaño de página
  sortKey?: keyof CatGenero;
  sortDir?: 'ascend' | 'descend';
  filters?: {
    clave?: string;
    descripcion?: string;
    fechaAlta?: Date | string;
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
