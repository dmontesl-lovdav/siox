// src/app/services/estructura-cuentas.service.ts
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, switchMap } from 'rxjs';
import { environment } from '../../environments/environment';
import { oauth2Service } from './oauth2.service';

export interface ConsultaEstructuraParams {
  page?: number; // default: 1
  pageSize?: number; // default: 10
  sort?: string; // default: "id ASC"
  descripcion?: string;
  niveles?: number;
  visible?: boolean;
  estatus?: boolean;
  longitud?: number;
}

@Injectable({
  providedIn: 'root'
})
export class EstructuraCuentasService {
  private url = environment.apiBaseUrl;

  constructor(private http: HttpClient, private oauth2Service: oauth2Service) {
    console.log(this.url);
  }

  /**
   * Consultar catálogo de estructura de cuentas con filtros de búsqueda paginada
   * @param params Parámetros de consulta
   * @returns Observable con la respuesta paginada
   */
  consultar(params: ConsultaEstructuraParams): Observable<any> {
    let httpParams = new HttpParams();
    
    // Parámetros de paginación
    httpParams = httpParams.set('page', (params.page || 1).toString());
    httpParams = httpParams.set('pageSize', (params.pageSize || 10).toString());
    
    // Parámetros opcionales de filtrado
    if (params.descripcion && params.descripcion.trim()) {
      httpParams = httpParams.set('descripcion', params.descripcion.trim());
    }
    
    if (params.niveles !== undefined && params.niveles !== null) {
      httpParams = httpParams.set('niveles', params.niveles.toString());
    }
    
    if (params.visible !== undefined && params.visible !== null) {
      httpParams = httpParams.set('visible', params.visible.toString());
    }
    
    if (params.estatus !== undefined && params.estatus !== null) {
      httpParams = httpParams.set('estatus', params.estatus.toString());
    }
    
    if (params.longitud !== undefined && params.longitud !== null) {
      httpParams = httpParams.set('longitud', params.longitud.toString());
    }
    
    // Parámetro de ordenamiento
    httpParams = httpParams.set('sort', params.sort || 'id ASC');

    const url = this.url + environment.estructuraCuentas.consultar;
    
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
   * Crear nueva estructura de cuentas
   * @param estructura Objeto con los datos de la estructura
   * @returns Observable con la respuesta del servidor
   */
  create(estructura: any): Observable<any> {
    const url = this.url + environment.estructuraCuentas.create;
    
    return this.oauth2Service.login().pipe(
      switchMap((tokenResponse: any) => {
        const token = tokenResponse?.access_token;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        if (token) {
          headers = headers.set('Authorization', `Bearer ${token}`);
        }
        return this.http.post(url, estructura, { headers });
      })
    );
  }

  /**
   * Actualizar el estado visible de una estructura de cuentas
   * @param id ID de la estructura de cuentas
   * @param visible Estado visible (true/false)
   * @returns Observable con la respuesta del servidor
   */
  updateVisible(id: number, visible: boolean): Observable<any> {
    const url = `${this.url}${environment.estructuraCuentas.updateVisible}/${id}/visible`;
    
    let httpParams = new HttpParams();
    httpParams = httpParams.set('visible', visible.toString());
    
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
   * Eliminar una estructura de cuentas
   * @param id ID de la estructura de cuentas a eliminar
   * @returns Observable con la respuesta del servidor
   */
  delete(id: number): Observable<any> {
    const url = `${this.url}${environment.estructuraCuentas.delete}/${id}`;
    
    return this.oauth2Service.login().pipe(
      switchMap((tokenResponse: any) => {
        const token = tokenResponse?.access_token;
        let headers = new HttpHeaders();
        if (token) {
          headers = headers.set('Authorization', `Bearer ${token}`);
        }
        return this.http.delete(url, { headers });
      })
    );
  }

  /**
   * Obtener una estructura de cuentas por ID
   * @param id ID de la estructura de cuentas
   * @returns Observable con la respuesta del servidor
   */
  getById(id: number): Observable<any> {
    const url = `${this.url}${environment.estructuraCuentas.getById}/${id}`;
    
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

  /**
   * Actualizar una estructura de cuentas
   * @param id ID de la estructura de cuentas
   * @param estructura Objeto con los datos actualizados
   * @returns Observable con la respuesta del servidor
   */
  update(id: number, estructura: any): Observable<any> {
    const url = `${this.url}${environment.estructuraCuentas.update}/${id}`;
    
    return this.oauth2Service.login().pipe(
      switchMap((tokenResponse: any) => {
        const token = tokenResponse?.access_token;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        if (token) {
          headers = headers.set('Authorization', `Bearer ${token}`);
        }
        return this.http.put(url, estructura, { headers });
      })
    );
  }
}
