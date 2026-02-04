export interface CatNombreAsentamientoDTO {
  id: number;
  clave: string;
  descripcion: string;
  fechaAlta: string;
  usuarioCreacion: string;
  estatus: boolean | string;
  totalRegistros?: number;
  estatusTexto?: string;
}

export interface ConsultaNombreAsentamientoParams {
  busqueda?: string;
  sort?: string;
  page?: number;
  pageSize?: number;
}
