// src/app/models/catalogo-vialidad.model.ts

export interface ConsultaRespuesta<T> {
  exitoso?: boolean;
  mensaje?: string;
  folio?: string;
  datos?: T;

  // a veces viene paginado:
  totalRegistros?: number;
  totalPaginas?: number;
  paginaActual?: number;
  page?: number;
  pageSize?: number;

  // por si backend manda errores/alertas:
  errores?: any;
}

export interface Vialidad {
  id?: number;

  // Campos típicos (ajústalos a lo que realmente regrese tu API)
  clave?: string;
  descripcion?: string;
  estatus?: boolean;

  usuarioCreacion?: string;
  fechaAlta?: string;

  usuarioModificacion?: string;
  fechaModificacion?: string;
}

/** Params del GET /vialidad/consultar-vialidad */
export interface ConsultaVialidadParams {
  page?: number;      // default 1
  pageSize?: number;  // default 10
  busqueda?: string;  // ✅ así lo pide el backend
  sort?: string;      // ejemplo: "id ASC"
}

/** Body del POST /vialidad */
export interface CrearVialidadRequest {
  // el backend recibe Map<String,String>
  // usa las keys reales: p.ej. { descripcion: "AVENIDA", clave: "01" }
  [key: string]: string;
}

/** Body del PUT /vialidad/{id}/estatus */
export interface ActualizarEstatusVialidadRequest {
  estatus: boolean;
}

/** Body del PUT /vialidad/{id}/detalle */
export interface ActualizarDetalleVialidadRequest {
  // usa la key real que espera backend: p.ej. { descripcion: "..." }
  [key: string]: string;
}
