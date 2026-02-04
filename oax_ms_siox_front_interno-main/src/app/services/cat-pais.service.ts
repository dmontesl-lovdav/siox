

// src/app/services/catalogo-conac.service.ts
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { environment } from '../../environments/environment';
import { oauth2Service } from './oauth2.service';

export interface ConsultaPaisParams {
  page?: number; // default: 1
  pageSize?: number; // default: 10
  nombre?: string; // búsqueda general
  id?: number;
  fechaAlta?: string;
  sort?: string; // default: "id ASC"
}

export interface ConsultaEstadoParams {
  page?: number; // default: 1
  pageSize?: number; // default: 10
  estado?: string; // búsqueda general
  id?: number;
  fechaAlta?: string;
  clave: string;
  pais: string;
  sort?: string; // default: "id ASC"
}

export interface ConsultaRegionParams {
  page?: number; // default: 1
  pageSize?: number; // default: 10
  estado?: string; // búsqueda general
  id?: number;
  fechaAlta?: string;
  region: string;
  sort?: string; // default: "id ASC"
}

export interface ConsultaDistritoParams {
  page?: number; // default: 1
  pageSize?: number; // default: 10
  nombre?: string; // búsqueda general
  id?: number;
  fechaAlta?: string;
  region: string;
  sort?: string; // default: "id ASC"
}

export interface ConsultaMunicipioParams {
  page?: number; // default: 1
  pageSize?: number; // default: 10
  municipio?: string; // búsqueda general
  claveMunicipio?: number;
  fechaAlta?: string;
  distrito: string;
  sort?: string; // default: "id ASC"
}
export interface ConsultaLocalidadParams {
  page?: number; // default: 1
  pageSize?: number; // default: 10
  municipio?: string; // búsqueda general
  claveLocalidad?: number;
  descripcion?: string;
  usuarioCreacion?: string;
  fechaAlta?: string;
  sort?: string; // default: "id ASC"
}

// ===================== VIALIDAD =====================
export interface ConsultaVialidadParams {
  page?: number;
  pageSize?: number;
  busqueda?: string;
  fechaAlta?: string;
  sort?: string;
}
export interface ConsultaTipoAsentamientoParams {
  page?: number;
  pageSize?: number;
  busqueda?: string;
  clave?: string;
  descripcion?: string;
  fechaAlta?: string;
  usuarioCreacion?: string;
  sort?: string;
}

export interface ConsultaNombreAsentamientoParams {
  page?: number;
  pageSize?: number;
  busqueda?: string;
   fechaAlta?: string;
  sort?: string;
}
export interface CrearVialidadRequest {
  [key: string]: string;
}

export interface ActualizarEstatusVialidadRequest {
  estatus: boolean;
}

export interface ActualizarDetalleVialidadRequest {
  [key: string]: string;
}

@Injectable({
  providedIn: 'root'
})

@Injectable({
  providedIn: 'root'
})
export class CatDomicilioService {
    /**
     * Actualizar tipo de asentamiento
     */
    actualizarTipoAsentamiento(id: number, request: { clave: string; descripcion: string }): Observable<any> {

      const url = `${this.url}${environment.domicilio.tipoAsentamiento}/${id}`;
      return this.oauth2Service.login().pipe(
        switchMap((tokenResponse: any) => {
          const token = tokenResponse?.access_token;
          let headers = new HttpHeaders();
          if (token) {
            headers = headers.set('Authorization', `Bearer ${token}`);
          }
          return this.http.put<any>(url, request, { headers });
        })
      );
    }
  private url = environment.apiBaseUrl;

  constructor(private http: HttpClient, private oauth2Service: oauth2Service) {

      console.log(this.url)
  }



  /**
   * Consultar catálogo de tipo periodo con filtros de búsqueda paginada
   * @param params Parámetros de consulta
   * @returns Observable con la respuesta paginada
   */
  consultarPais(params: ConsultaPaisParams): Observable<any> {
    let httpParams = new HttpParams();
    
    // Parámetros de paginación
    httpParams = httpParams.set('page', (params.page || 1).toString());
    httpParams = httpParams.set('pageSize', (params.pageSize || 10).toString());
    
    // Parámetro de búsqueda opcional
    if (params.nombre && params.nombre.trim()) {
      httpParams = httpParams.set('nombre', params.nombre.trim());
    }
    if (params.id !== undefined) {
      httpParams = httpParams.set('id', params.id.toString());
    }
    if (params.fechaAlta && params.fechaAlta.trim()) {
      httpParams = httpParams.set('fechaAlta', params.fechaAlta.trim());
    }
    
    // Parámetro de ordenamiento
    httpParams = httpParams.set('sort', params.sort || 'id ASC');

    const url = this.url + environment.domicilio.paisConsultar;
    
    return this.oauth2Service.login().pipe(
      switchMap((tokenResponse: any) => {
        const token = tokenResponse?.access_token;
        let headers = new HttpHeaders();
        if (token) {
          headers = headers.set('Authorization', `Bearer ${token}`);
        }
        return this.http.get(url, { headers, params: httpParams });
      })
    );
  }

   consultarEstado(params: ConsultaEstadoParams): Observable<any> {
    let httpParams = new HttpParams();
    
    // Parámetros de paginación
    httpParams = httpParams.set('page', (params.page || 1).toString());
    httpParams = httpParams.set('pageSize', (params.pageSize || 10).toString());
    
    // Parámetro de búsqueda opcional
    if (params.estado && params.estado.trim()) {
      httpParams = httpParams.set('estado', params.estado.trim());
    }
    if (params.id !== undefined) {
      httpParams = httpParams.set('id', params.id.toString());
    }
    if (params.fechaAlta && params.fechaAlta.trim()) {
      httpParams = httpParams.set('fechaAlta', params.fechaAlta.trim());
    }
  if (params.pais && params.pais.trim()) {
      httpParams = httpParams.set('pais', params.pais.trim());
    }

     if (params.clave && params.clave.trim()) {
      httpParams = httpParams.set('clave', params.clave.trim());
    }
    
    
    // Parámetro de ordenamiento
    httpParams = httpParams.set('sort', params.sort || 'id ASC');

    const url = this.url + environment.domicilio.estadoConsultar;
    
    return this.oauth2Service.login().pipe(
      switchMap((tokenResponse: any) => {
        const token = tokenResponse?.access_token;
        let headers = new HttpHeaders();
        if (token) {
          headers = headers.set('Authorization', `Bearer ${token}`);
        }
        return this.http.get(url, { headers, params: httpParams });
      })
    );
  }
  consultarRegion(params: ConsultaRegionParams): Observable<any> {
    let httpParams = new HttpParams();
    
    // Parámetros de paginación
    httpParams = httpParams.set('page', (params.page || 1).toString());
    httpParams = httpParams.set('pageSize', (params.pageSize || 10).toString());
    
    // Parámetro de búsqueda opcional
    if (params.estado && params.estado.trim()) {
      httpParams = httpParams.set('estado', params.estado.trim());
    }
    if (params.id !== undefined) {
      httpParams = httpParams.set('id', params.id.toString());
    }
    if (params.fechaAlta && params.fechaAlta.trim()) {
      httpParams = httpParams.set('fechaAlta', params.fechaAlta.trim());
    }
  if (params.region && params.region.trim()) {
      httpParams = httpParams.set('region', params.region.trim());
    }


    
    
    // Parámetro de ordenamiento
    httpParams = httpParams.set('sort', params.sort || 'id ASC');

    const url = this.url + environment.domicilio.regionConsultar;
    
    return this.oauth2Service.login().pipe(
      switchMap((tokenResponse: any) => {
        const token = tokenResponse?.access_token;
        let headers = new HttpHeaders();
        if (token) {
          headers = headers.set('Authorization', `Bearer ${token}`);
        }
        return this.http.get(url, { headers, params: httpParams });
      })
    );
  }

   consultaDistrito(params: ConsultaDistritoParams): Observable<any> {
    let httpParams = new HttpParams();
    
    // Parámetros de paginación
    httpParams = httpParams.set('page', (params.page || 1).toString());
    httpParams = httpParams.set('pageSize', (params.pageSize || 10).toString());
    
    // Parámetro de búsqueda opcional
    if (params.nombre && params.nombre.trim()) {
      httpParams = httpParams.set('nombre', params.nombre.trim());
    }
    if (params.id !== undefined) {
      httpParams = httpParams.set('id', params.id.toString());
    }
    if (params.fechaAlta && params.fechaAlta.trim()) {
      httpParams = httpParams.set('fechaAlta', params.fechaAlta.trim());
    }
  if (params.region && params.region.trim()) {
      httpParams = httpParams.set('region', params.region.trim());
    }


    
    
    // Parámetro de ordenamiento
    httpParams = httpParams.set('sort', params.sort || 'id ASC');

    const url = this.url + environment.domicilio.distritoConsultar;
    
    return this.oauth2Service.login().pipe(
      switchMap((tokenResponse: any) => {
        const token = tokenResponse?.access_token;
        let headers = new HttpHeaders();
        if (token) {
          headers = headers.set('Authorization', `Bearer ${token}`);
        }
        return this.http.get(url, { headers, params: httpParams });
      })
    );
  }

   consultaMunicipio(params: ConsultaMunicipioParams): Observable<any> {
    let httpParams = new HttpParams();
    
    // Parámetros de paginación
    httpParams = httpParams.set('page', (params.page || 1).toString());
    httpParams = httpParams.set('pageSize', (params.pageSize || 10).toString());
    
    // Parámetro de búsqueda opcional
    if (params.municipio && params.municipio.trim()) {
      httpParams = httpParams.set('municipio', params.municipio.trim());
    }
    if (params.claveMunicipio !== undefined) {
      httpParams = httpParams.set('claveMunicipio', params.claveMunicipio.toString());
    }
    if (params.fechaAlta && params.fechaAlta.trim()) {
      httpParams = httpParams.set('fechaAlta', params.fechaAlta.trim());
    }
  if (params.distrito && params.distrito.trim()) {
      httpParams = httpParams.set('distrito', params.distrito.trim());
    }


    
    
    // Parámetro de ordenamiento
    httpParams = httpParams.set('sort', params.sort || 'clave_localidad ASC');

    const url = this.url + environment.domicilio.municipioConsultar;
    
    return this.oauth2Service.login().pipe(
      switchMap((tokenResponse: any) => {
        const token = tokenResponse?.access_token;
        let headers = new HttpHeaders();
        if (token) {
          headers = headers.set('Authorization', `Bearer ${token}`);
        }
        return this.http.get(url, { headers, params: httpParams });
      })
    );
  }

    consultalLocalidad(params: ConsultaLocalidadParams): Observable<any> {
    let httpParams = new HttpParams();
    
    // Parámetros de paginación
    httpParams = httpParams.set('page', (params.page || 1).toString());
    httpParams = httpParams.set('pageSize', (params.pageSize || 10).toString());
    
    // Parámetro de búsqueda opcional
    if (params.municipio && params.municipio.trim()) {
      httpParams = httpParams.set('municipio', params.municipio.trim());
    }
    if (params.claveLocalidad !== undefined) {
      httpParams = httpParams.set('claveLocalidad', params.claveLocalidad.toString());
    }
    if (params.descripcion !== undefined) {
      httpParams = httpParams.set('descripcion', params.descripcion.toString());
    }
      if (params.usuarioCreacion !== undefined) {
      httpParams = httpParams.set('usuarioCreacion', params.usuarioCreacion.toString());
    }
    if (params.fechaAlta && params.fechaAlta.trim()) {
      httpParams = httpParams.set('fechaAlta', params.fechaAlta.trim());
    }



    
    
    // Parámetro de ordenamiento
    httpParams = httpParams.set('sort', params.sort || 'clave_municipio ASC');

    const url = this.url + environment.domicilio.localidadConsultar;
    
    return this.oauth2Service.login().pipe(
      switchMap((tokenResponse: any) => {
        const token = tokenResponse?.access_token;
        let headers = new HttpHeaders();
        if (token) {
          headers = headers.set('Authorization', `Bearer ${token}`);
        }
        return this.http.get(url, { headers, params: httpParams });
      })
    );
  }
  /**
   * Crear una nueva localidad
   */
  crearLocalidad(localidad: any): Observable<any> {
    const url = this.url + environment.domicilio.localidadCrear;
    return this.oauth2Service.login().pipe(
      switchMap((tokenResponse: any) => {
        const token = tokenResponse?.access_token;
        let headers = new HttpHeaders();
        if (token) {
          headers = headers.set('Authorization', `Bearer ${token}`);
        }
        return this.http.post(url, localidad, { headers });
      })
    );
  }

  /**
   * Actualizar una localidad existente
   */
  actualizarLocalidad(id: number, localidad: any): Observable<any> {
      const url = this.url +  environment.domicilio.localidadActualizar+`/${id}`;
    return this.oauth2Service.login().pipe(
      switchMap((tokenResponse: any) => {
        const token = tokenResponse?.access_token;
        let headers = new HttpHeaders();
        if (token) {
          headers = headers.set('Authorization', `Bearer ${token}`);
        }
        return this.http.put(url, localidad, { headers });
      })
    );
  }

  /**
   * Verificar si existe una clave de localidad
   */
  existeClaveLocalidad(clave: number): Observable<boolean> {
    const url = this.url + environment.domicilio.localidadExisteClave+`/${clave}`;
    return this.oauth2Service.login().pipe(
      switchMap((tokenResponse: any) => {
        const token = tokenResponse?.access_token;
        let headers = new HttpHeaders();
        if (token) {
          headers = headers.set('Authorization', `Bearer ${token}`);
        }
        return this.http.get<boolean>(url, { headers });
      })
    );
  }

  /**
   * Actualizar estatus de localidades
   */
  actualizarEstatusLocalidades(request: any): Observable<any> {
    const url = this.url +  environment.domicilio.localidadEstatus;
    return this.oauth2Service.login().pipe(
      switchMap((tokenResponse: any) => {
        const token = tokenResponse?.access_token;
        let headers = new HttpHeaders();
        if (token) {
          headers = headers.set('Authorization', `Bearer ${token}`);
        }
        return this.http.put(url, request, { headers });
      })
    );
  }

  

    /**
     * Guardar tipo de asentamiento
     */
    guardarTipoAsentamiento(request: { clave: string; descripcion: string }): Observable<any> {
      const url = `${this.url}${environment.domicilio.tipoAsentamiento}`;
      return this.oauth2Service.login().pipe(
        switchMap((tokenResponse: any) => {
          const token = tokenResponse?.access_token;
          let headers = new HttpHeaders();
          if (token) {
            headers = headers.set('Authorization', `Bearer ${token}`);
          }
          return this.http.post<any>(url, request, { headers });
        })
      );
    }

    /**
     * Cambiar estatus de tipo de asentamiento
     */
    cambiarEstatusTipoAsentamiento(id: number, estatus: boolean): Observable<any> {
      const url = `${this.url}${environment.domicilio.tipoAsentamientoEstatus}/${id}/estatus?estatus=${estatus}`;
      return this.oauth2Service.login().pipe(
        switchMap((tokenResponse: any) => {
          const token = tokenResponse?.access_token;
          let headers = new HttpHeaders();
          if (token) {
            headers = headers.set('Authorization', `Bearer ${token}`);
          }
          return this.http.put<any>(url, {}, { headers });
        })
      );
    }

      /**
       * Consultar tipos de asentamiento
       */
      consultarTipoAsentamiento(params: ConsultaTipoAsentamientoParams): Observable<any> {
        let httpParams = new HttpParams();
        httpParams = httpParams.set('page', (params.page || 1).toString());
        httpParams = httpParams.set('pageSize', (params.pageSize || 10).toString());
        if (params.busqueda && params.busqueda.trim()) {
          httpParams = httpParams.set('busqueda', params.busqueda.trim());
        }
        if (params.clave && params.clave.trim()) {
          httpParams = httpParams.set('clave', params.clave.trim());
        }
        if (params.descripcion && params.descripcion.trim()) {
          httpParams = httpParams.set('descripcion', params.descripcion.trim());
        }
        if (params.fechaAlta && params.fechaAlta.trim()) {
          httpParams = httpParams.set('fechaAlta', params.fechaAlta.trim());
        }
        if (params.usuarioCreacion && params.usuarioCreacion.trim()) {
          httpParams = httpParams.set('usuarioCreacion', params.usuarioCreacion.trim());
        }
        if (params.sort && params.sort.trim()) {
          httpParams = httpParams.set('sort', params.sort.trim());
        }
        const url = `${this.url}${environment.domicilio.consultarTipoAsentamiento}`;
        return this.oauth2Service.login().pipe(
          switchMap((tokenResponse: any) => {
            const token = tokenResponse?.access_token;
            let headers = new HttpHeaders();
            if (token) {
              headers = headers.set('Authorization', `Bearer ${token}`);
            }
            return this.http.get<any>(url, { headers, params: httpParams });
          })
        );
      }

  // ===================== VIALIDAD =====================

  consultarVialidad(params: ConsultaVialidadParams): Observable<any> {
    let httpParams = new HttpParams();

    httpParams = httpParams.set('page', (params.page || 1).toString());
    httpParams = httpParams.set('pageSize', (params.pageSize || 10).toString());

    if (params.busqueda && params.busqueda.trim()) {
      httpParams = httpParams.set('busqueda', params.busqueda.trim());
    }

    httpParams = httpParams.set('sort', params.sort || 'id ASC');

    const url = this.url + environment.domicilio.vialidadConsultar;

    return this.oauth2Service.login().pipe(
      switchMap((tokenResponse: any) => {
        const token = tokenResponse?.access_token;
        let headers = new HttpHeaders();
        if (token) {
          headers = headers.set('Authorization', `Bearer ${token}`);
        }
        return this.http.get(url, { headers, params: httpParams });
      })
    );
  }

  guardarVialidad(body: CrearVialidadRequest): Observable<any> {
    const url = this.url + environment.domicilio.vialidadCrear;

    return this.oauth2Service.login().pipe(
      switchMap((tokenResponse: any) => {
        const token = tokenResponse?.access_token;
        let headers = new HttpHeaders();
        if (token) {
          headers = headers.set('Authorization', `Bearer ${token}`);
        }
        return this.http.post(url, body, { headers });
      })
    );
  }

  actualizarEstatusVialidad(id: number, body: ActualizarEstatusVialidadRequest): Observable<any> {
    const url = this.url + environment.domicilio.vialidadEstatus + `/${id}/estatus`;

    return this.oauth2Service.login().pipe(
      switchMap((tokenResponse: any) => {
        const token = tokenResponse?.access_token;
        let headers = new HttpHeaders();
        if (token) {
          headers = headers.set('Authorization', `Bearer ${token}`);
        }
        return this.http.put(url, body, { headers });
      })
    );
  }

  actualizarDetalleVialidad(id: number, body: ActualizarDetalleVialidadRequest): Observable<any> {
    const url = this.url + environment.domicilio.vialidadDetalle + `/${id}/detalle`;

    return this.oauth2Service.login().pipe(
      switchMap((tokenResponse: any) => {
        const token = tokenResponse?.access_token;
        let headers = new HttpHeaders();
        if (token) {
          headers = headers.set('Authorization', `Bearer ${token}`);
        }
        return this.http.put(url, body, { headers });
      })
    );
  }


    /**
   * Consultar nombres de asentamiento
   * @param params Parámetros de consulta: busqueda, sort, page, pageSize
   * @returns Observable con la respuesta paginada de nombres de asentamiento
   */
  consultarNombreAsentamiento(params: { busqueda?: string; sort?: string; page?: number; pageSize?: number }): Observable<any> {
    let httpParams = new HttpParams();
    httpParams = httpParams.set('page', (params.page || 1).toString());
    httpParams = httpParams.set('pageSize', (params.pageSize || 10).toString());
    if (params.busqueda && params.busqueda.trim()) {
      httpParams = httpParams.set('busqueda', params.busqueda.trim());
    }
    if (params.sort && params.sort.trim()) {
      httpParams = httpParams.set('sort', params.sort.trim());
    }
    const url = this.url + environment.domicilio.consultarNombreAsentamiento;
    return this.oauth2Service.login().pipe(
      switchMap((tokenResponse: any) => {
        const token = tokenResponse?.access_token;
        let headers = new HttpHeaders();
        if (token) {
          headers = headers.set('Authorization', `Bearer ${token}`);
        }
        return this.http.get<any>(url, { headers, params: httpParams });
      })
    );
  }

    /**
   * Actualizar nombre de asentamiento
   */
  actualizarNombreAsentamiento(id: number, body: { idTipoAsentamiento?: number; clave?: string; descripcion?: string }): Observable<any> {
    const url = `${this.url}${environment.domicilio.actualizarNombreAsentamiento}/${id}`;
    return this.oauth2Service.login().pipe(
      switchMap((tokenResponse: any) => {
        const token = tokenResponse?.access_token;
        let headers = new HttpHeaders();
        if (token) {
          headers = headers.set('Authorization', `Bearer ${token}`);
        }
        return this.http.put<any>(url, body, { headers });
      })
    );
  }

  /**
   * Actualizar estatus de nombre de asentamiento
   */
  actualizarEstatusNombreAsentamiento(id: number, estatus: boolean): Observable<any> {
    const url = `${this.url}${environment.domicilio.actualizarEstatusNombreAsentamiento}/${id}`;
    return this.oauth2Service.login().pipe(
      switchMap((tokenResponse: any) => {
        const token = tokenResponse?.access_token;
        let headers = new HttpHeaders();
        if (token) {
          headers = headers.set('Authorization', `Bearer ${token}`);
        }
        return this.http.put<any>(url, { estatus }, { headers });
      })
    );
  }


  /**
   * Crear nombre de asentamiento
   */
  crearNombreAsentamiento(body: { idTipoAsentamiento?: number; clave?: string; descripcion?: string }): Observable<any> {
    const url = `${this.url}${environment.domicilio.crearNombreAsentamiento}`;
    return this.oauth2Service.login().pipe(
      switchMap((tokenResponse: any) => {
        const token = tokenResponse?.access_token;
        let headers = new HttpHeaders();
        if (token) {
          headers = headers.set('Authorization', `Bearer ${token}`);
        }
        return this.http.post<any>(url, body, { headers });
      })
    );
  }
}


export interface DomicilioConsultarEstadosResponse{
  exito: boolean
  mensaje: string
  datos: Dato[]
  total: number
  pagina: number
  tamano: number
}

export interface Dato {
  totalRegistros: number
  id: number
  estado: string
  clave: string
  fechaAlta: string
  idUsuarioCreacion: number
  idPais: number
  pais: string
}