// src/app/models/catalogo-vialidad.model.ts

export interface CattipoAsentamiento<T> {
 totalRegistros?: number;
  id: number;
  clave: string;
  descripcion: string;
  fechaAlta: Date | string;
  usuarioCreacion: string;
  estatus: boolean | string;
}

export interface tipoAsentamiento {
  id?: number;

  // Campos típicos (ajústalos a lo que realmente regrese tu API)
  clave?: string;
  descripcion?: string;
  estatus?: boolean;

  usuarioCreacion?: string;
  fechaAlta?: string;
}

/** Params del GET /vialidad/consultar-vialidad */
export interface ConsultaTipoAsentamientoParams {
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
