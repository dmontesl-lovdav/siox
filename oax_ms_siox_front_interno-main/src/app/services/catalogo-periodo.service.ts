// src/app/services/catalogo-conac.service.ts
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { environment } from '../../environments/environment';
import { oauth2Service } from './oauth2.service';

export interface ConsultaPeriodoParams {
  page?: number; // default: 1
  pageSize?: number; // default: 10
  search?: string; // búsqueda general
  sort?: string; // default: "id ASC"
}


@Injectable({
  providedIn: 'root'
})
export class CatalogoPeriodoService {
 private url = environment.apiBaseUrl;

  constructor(private http: HttpClient, private oauth2Service: oauth2Service) {

      console.log(this.url)
  }



  /**
   * Consultar catálogo de tipo periodo con filtros de búsqueda paginada
   * @param params Parámetros de consulta
   * @returns Observable con la respuesta paginada
   */
  consultarConac(params: ConsultaPeriodoParams): Observable<any> {
    let httpParams = new HttpParams();
    
    // Parámetros de paginación
    httpParams = httpParams.set('page', (params.page || 1).toString());
    httpParams = httpParams.set('pageSize', (params.pageSize || 10).toString());
    
    // Parámetro de búsqueda opcional
    if (params.search && params.search.trim()) {
      httpParams = httpParams.set('search', params.search.trim());
    }
    
    // Parámetro de ordenamiento
    httpParams = httpParams.set('sort', params.sort || 'id ASC');

    const url = this.url + environment.periodo.consultar;
    
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

  }