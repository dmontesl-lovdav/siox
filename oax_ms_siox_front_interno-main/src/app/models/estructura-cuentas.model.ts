// src/app/models/estructura-cuentas.model.ts
export interface EstructuraCuentas {
  totalRegistros?: number;
  id: number;
  descripcionEstructura: string;
  n1?: string;
  desN1?: string;
  n2?: string;
  desN2?: string;
  n3?: string;
  desN3?: string;
  n4?: string;
  desN4?: string;
  n5?: string;
  desN5?: string;
  n6?: string;
  desN6?: string;
  secuencia?: string;
  longitud: number;
  niveles: number;
  fechaCreacion?: Date | string;
  estatus: boolean | string; // Puede ser boolean del backend o string para visualización
  visible: boolean | string; // Puede ser boolean del backend o string para visualización
  // Campos auxiliares para visualización
  bloqueadaTexto?: string;
  visibleTexto?: string;
  visibleBoolean?: boolean; // Para el switch de ng-zorro
}

export interface EstructuraCuentasQuery {
  pageIndex?: number;                 // 1-based
  pageSize?: number;                  // tamaño de página
  sortKey?: keyof EstructuraCuentas;
  sortDir?: 'ascend' | 'descend';
  filters?: {
    descripcion?: string;
    niveles?: number;
    visible?: boolean;
    estatus?: boolean;
    longitud?: number;
  };
}

export interface PagedResult<T> {
  items: T[];
  total: number;
}
