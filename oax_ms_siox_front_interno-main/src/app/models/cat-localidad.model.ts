// src/app/models/cat-genero.model.ts
export interface CatLocalidad{
  seleccion?: boolean;
  totalRegistros?: number;
  id: number;
  claveLocalidad: string;
  descripcionLocalidad: string;
  fechaAlta: Date | string;
  usuarioCreacion: string;
  estatus: boolean | string;
  municipio:string
  // Campos auxiliares para visualización
  estatusTexto?: string;
}

export interface CatLocalidadQuery {
  pageIndex?: number;                 // 1-based
  pageSize?: number;                  // tamaño de página
  sortKey?: keyof CatLocalidad;
  sortDir?: 'ascend' | 'descend';
  filters?: {
    municipio?:string;
    claveLocalidad?: string;
    descripcionLocalidad?: string;
    fechaAlta?: Date | string;
    usuarioCreacion: string;
  };
}

export interface CatLocalidadUpdateDTO {
  municipio:number
  claveLocalidad: string;
  descripcionLocalidad: string;
}

export interface PagedResult<T> {
  items: T[];
  total: number;
}
