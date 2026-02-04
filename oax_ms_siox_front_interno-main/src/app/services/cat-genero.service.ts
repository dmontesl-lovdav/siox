// src/app/services/cat-genero.service.ts
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, switchMap } from 'rxjs';
import { environment } from '../../environments/environment';
import { CatGeneroUpdateDTO } from '../models/cat-genero.model';
import { oauth2Service } from './oauth2.service';

export interface ConsultaGeneroParams {
  page?: number; // default: 1
  pageSize?: number; // default: 10
  sort?: string; // default: "id ASC"
  clave?: string;
  descripcion?: string;
  fechaAlta?: string; // formato: YYYY-MM-DD
}

@Injectable({
  providedIn: 'root'
})
export class CatGeneroService {
  private url = environment.apiBaseUrl;

  constructor(private http: HttpClient, private oauth2Service: oauth2Service) {
    console.log(this.url);
  }

  /**
   * Consultar catálogo de género con filtros de búsqueda paginada
   * @param params Parámetros de consulta
   * @returns Observable con la respuesta paginada
   */
  consultar(params: ConsultaGeneroParams): Observable<any> {
    let httpParams = new HttpParams();
    
    // Parámetros de paginación
    httpParams = httpParams.set('page', (params.page || 1).toString());
    httpParams = httpParams.set('pageSize', (params.pageSize || 10).toString());
    
    // Parámetros opcionales de filtrado
    if (params.clave && params.clave.trim()) {
      httpParams = httpParams.set('clave', params.clave.trim());
    }
    
    if (params.descripcion && params.descripcion.trim()) {
      httpParams = httpParams.set('descripcion', params.descripcion.trim());
    }
    
    if (params.fechaAlta && params.fechaAlta.trim()) {
      httpParams = httpParams.set('fechaAlta', params.fechaAlta.trim());
    }
    
    // Parámetro de ordenamiento
    httpParams = httpParams.set('sort', params.sort || 'id ASC');

    const url = this.url + environment.genero.consultar;
    
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

  /**
   * Crear nuevo género
   * @param genero Objeto con los datos del género
   * @returns Observable con la respuesta del servidor
   */
  create(genero: CatGeneroUpdateDTO): Observable<any> {
    const url = this.url + environment.genero.create;
    
    return this.oauth2Service.login().pipe(
      switchMap((tokenResponse: any) => {
        const token = tokenResponse?.access_token;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        if (token) {
          headers = headers.set('Authorization', `Bearer ${token}`);
        }
        return this.http.post(url, genero, { headers });
      })
    );
  }

  /**
   * Actualizar un género
   * @param id ID del género
   * @param genero Objeto con los datos actualizados
   * @returns Observable con la respuesta del servidor
   */
  update(id: number, genero: CatGeneroUpdateDTO): Observable<any> {
    const url = `${this.url}${environment.genero.update}/${id}`;
    
    return this.oauth2Service.login().pipe(
      switchMap((tokenResponse: any) => {
        const token = tokenResponse?.access_token;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        if (token) {
          headers = headers.set('Authorization', `Bearer ${token}`);
        }
        return this.http.put(url, genero, { headers });
      })
    );
  }

  /**
   * Cambiar el estatus de un género (bloquear/desbloquear)
   * @param id ID del género
   * @param estatus Nuevo estatus (true/false)
   * @returns Observable con la respuesta del servidor
   */
  cambiarEstatus(id: number, estatus: boolean): Observable<any> {
    const url = `${this.url}${environment.genero.estatus}/${id}`;
    
    let httpParams = new HttpParams();
    httpParams = httpParams.set('estatus', estatus.toString());
    
    return this.oauth2Service.login().pipe(
      switchMap((tokenResponse: any) => {
        const token = tokenResponse?.access_token;
        let headers = new HttpHeaders();
        if (token) {
          headers = headers.set('Authorization', `Bearer ${token}`);
        }
        return this.http.put(url, null, { headers, params: httpParams });
      })
    );
  }

  /**
   * Obtener un género por ID
   * @param id ID del género
   * @returns Observable con la respuesta del servidor
   */
  getById(id: number): Observable<any> {
    const url = `${this.url}${environment.genero.getById}/${id}`;
    
    return this.oauth2Service.login().pipe(
      switchMap((tokenResponse: any) => {
        const token = tokenResponse?.access_token;
        let headers = new HttpHeaders();
        if (token) {
          headers = headers.set('Authorization', `Bearer ${token}`);
        }
        return this.http.get(url, { headers });
      })
    );
  }
}
