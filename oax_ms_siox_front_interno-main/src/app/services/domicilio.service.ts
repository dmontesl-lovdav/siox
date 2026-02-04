import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { oauth2Service } from './oauth2.service';
import { ConsultaGeneroParams } from './cat-genero.service';
import { map, switchMap } from 'rxjs';

export interface ConsultaTipoSectorGubernamentalParams {
  page?: number; // default: 1
  pageSize?: number; // default: 10
  sort?: string; // default: "id ASC"
  clave?: string;
  sector?: string;
  activo?: boolean;
  fechaInicioVigencia?: string; // formato: YYYY-MM-DD
  fechaFinVigencia?: string; // formato: YYYY-MM-DD
  usuarioCreacion?: string;
  fechaAlta?: string; // formato: YYYY-MM-DD
}

@Injectable({
  providedIn: 'root'
})
export class DomicilioService {

  private url = environment.apiBaseUrl;

  constructor(private http: HttpClient, private oauth2Service: oauth2Service) {
    console.log(this.url);
  }

  consultaTipoSectorGubernamental(params: ConsultaTipoSectorGubernamentalParams): any {
    let httpParams = new HttpParams();
    
    // Parámetros de paginación
    httpParams = httpParams.set('page', (params.page || 1).toString());
    httpParams = httpParams.set('pageSize', (params.pageSize || 10).toString());
    
    // Parámetros opcionales de filtrado
    if (params.clave && params.clave.trim()) {
      httpParams = httpParams.set('clave', params.clave.trim());
    }
    
    if (params.sector && params.sector.trim()) {
      httpParams = httpParams.set('sector', params.sector.trim());
    }
    
    if (params.activo) {
      httpParams = httpParams.set('activo', params.activo);
    }
    
    if (params.fechaInicioVigencia && params.fechaInicioVigencia.trim()) {
      httpParams = httpParams.set('fechaInicioVigencia', params.fechaInicioVigencia.trim());
    }
    
    if (params.fechaFinVigencia && params.fechaFinVigencia.trim()) {
      httpParams = httpParams.set('fechaFinVigencia', params.fechaFinVigencia.trim());
    }
    
    if (params.usuarioCreacion && params.usuarioCreacion.trim()) {
      httpParams = httpParams.set('usuarioCreacion', params.usuarioCreacion.trim());
    }
    
    if (params.fechaAlta && params.fechaAlta.trim()) {
      httpParams = httpParams.set('fechaAlta', params.fechaAlta.trim());
    }
    
    // Parámetro de ordenamiento
    httpParams = httpParams.set('sort', params.sort || 'id ASC');

    const url = this.url + environment.domicilio.consultarTipoSectorGubernamental;
    
    return this.oauth2Service.login().pipe(
      switchMap((tokenResponse: any) => {
        const token = tokenResponse?.access_token;
        let headers = new HttpHeaders();
        if (token) {
          headers = headers.set('Authorization', `Bearer ${token}`);
        }
        return this.http.get(url, { headers, params: httpParams });
      }),
      map((response: any) => {
        // Manejar respuesta 204 No Content que retorna null
        if (response === null || response === undefined) {
          return {
            exito: true,
            mensaje: 'No hay datos disponibles',
            datos: [],
            total: 0,
            pagina: params.page || 1,
            tamano: params.pageSize || 10
          };
        }
        return response;
      })
    );
  }

  createTipoSectorGubernamental(payload:any){
    return this.http.post(this.url + environment.domicilio.crearTipoSectorGubernamental, payload);
  }

  updateTipoSectorGubernamental(id:number, payload:any){
    return this.http.put(this.url + environment.domicilio.crearTipoSectorGubernamental+'/'+id, payload);

  }

}
