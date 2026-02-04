// src/app/models/catalogo-conac.model.ts
export interface CatalogoConac {
  id: number;
  clave: string;
  descripcion: string;
  naturaleza: string;
  estructura: string;
  estadoFinanciero: string;
  posicionFinanciera: string;
  fechaAlta?: Date | null;
  inicioVigencia?: Date | null;
  finVigencia?: Date | null;
  estatus: EstatusConac;
  // Campos adicionales del servicio
  idGenero?: number | null;
  idGrupo?: number | null;
  idRubro?: number | null;
  idCuenta?: number | null;
  idSubCuenta?: number | null;
  idNaturaleza?: number | null;
  idEstructura?: number | null;
  idEstadoFinanciero?: number | null;
  idPosicion?: number | null;
  ejercicio?: number;
  origen?: string;
  totalRegistros?: number;
}

export interface CriQuery {
  pageIndex?: number;                 // 1-based
  pageSize?: number;                  // tamaño de página
  sortKey?: keyof CatalogoConac;
  sortDir?: 'ascend' | 'descend';
  filters?: {
    texto?: string;                   // búsqueda global (clave, nombre, descripción)
    estatus?: EstatusConac;
    fechaAlta?: string | Date;
    inicioVigencia?: string | Date;
    finVigencia?: string | Date;
  };
}

export interface PagedResult<T> {
  items: T[];
  total: number;
}

export type EstatusConac = 'VIGENTE' | 'NO VIGENTE';