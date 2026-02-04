// src/app/services/catalogo-conac.service.ts
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { environment } from '../../environments/environment';
import { oauth2Service } from './oauth2.service';

export interface ConsultaConacParams {
  cuenta?: string;
  descripcion?: string;
  naturaleza?: string;
  estructura?: string;
  estadoFinanciero?: string;
  posicionFinanciera?: string;
  fechaAlta?: string; // formato: yyyy-MM-dd
  inicioVigencia?: string; // formato: yyyy-MM-dd
  finVigencia?: string; // formato: yyyy-MM-dd
  estatus?: string;
  ejercicio: number; // requerido
  sort?: string; // default: "cuenta ASC"
  page?: number; // default: 1
  pageSize?: number; // default: 10
}


@Injectable({
  providedIn: 'root'
})
export class CatalogoConacService {
 private url = environment.apiBaseUrl;

  constructor(private http: HttpClient, private oauth2Service: oauth2Service) {

      console.log(this.url)
  }

    cargarArchivo(file: File, ejercicio: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('ejercicio', ejercicio);
    // Obtener token antes de hacer la petición
    return this.oauth2Service.login().pipe(
      switchMap((tokenResponse: any) => {
        const token = tokenResponse?.access_token;
        let headers = new HttpHeaders();
        if (token) {
          headers = headers.set('Authorization', `Bearer ${token}`);
        }
        return this.http.post(this.url + environment.conac.cargaArchivo, formData, { headers });
      })
    );
  }

  /**
   * Consultar catálogo CONAC con filtros de búsqueda paginada
   * @param params Parámetros de consulta
   * @returns Observable con la respuesta paginada
   */
  consultarConac(params: ConsultaConacParams): Observable<any> {
    let httpParams = new HttpParams();
    
    // Agregar parámetros opcionales solo si tienen valor
    if (params.cuenta) httpParams = httpParams.set('cuenta', params.cuenta);
    if (params.descripcion) httpParams = httpParams.set('descripcion', params.descripcion);
    if (params.naturaleza) httpParams = httpParams.set('naturaleza', params.naturaleza);
    if (params.estructura) httpParams = httpParams.set('estructura', params.estructura);
    if (params.estadoFinanciero) httpParams = httpParams.set('estadoFinanciero', params.estadoFinanciero);
    if (params.posicionFinanciera) httpParams = httpParams.set('posicionFinanciera', params.posicionFinanciera);
    if (params.fechaAlta) httpParams = httpParams.set('fechaAlta', params.fechaAlta);
    if (params.inicioVigencia) httpParams = httpParams.set('inicioVigencia', params.inicioVigencia);
    if (params.finVigencia) httpParams = httpParams.set('finVigencia', params.finVigencia);
    if (params.estatus) httpParams = httpParams.set('estatus', params.estatus);
    
    // Parámetros requeridos
    httpParams = httpParams.set('ejercicio', params.ejercicio.toString());
    httpParams = httpParams.set('page', (params.page || 1).toString());
    httpParams = httpParams.set('pageSize', (params.pageSize || 10).toString());
    httpParams = httpParams.set('sort', params.sort || 'cuenta ASC');

    const url = this.url + environment.conac.consultar;
    
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


/***** Servicios de Genero ****/


     insertGenero(clave: string, descripcion: string, ejercicio: number): Observable<any> {
          const params = { clave, descripcion, ejercicio };
          const url = this.url + environment.conac.genero.insert;
          return this.oauth2Service.login().pipe(
            switchMap((tokenResponse: any) => {
              const token = tokenResponse?.access_token;
              let headers = new HttpHeaders();
              if (token) {
                headers = headers.set('Authorization', `Bearer ${token}`);
              }
              return this.http.post(url, null, { headers, params });
            })
          );
        }
  
        updateGenero(id: number, descripcion: string): Observable<any> {
          const params = { id, descripcion };
          const url = this.url + environment.conac.genero.update;
          return this.oauth2Service.login().pipe(
            switchMap((tokenResponse: any) => {
              const token = tokenResponse?.access_token;
              let headers = new HttpHeaders();
              if (token) {
                headers = headers.set('Authorization', `Bearer ${token}`);
              }
              return this.http.post(url, null, { headers, params });
            })
          );
        }
  
      getGeneroEjercicio(ejercicio: number): Observable<any> {
        const params = { ejercicio };
        const url = this.url + environment.conac.genero.getByEjercicio;
        return this.oauth2Service.login().pipe(
          switchMap((tokenResponse: any) => {
            const token = tokenResponse?.access_token;
            let headers = new HttpHeaders();
            if (token) {
              headers = headers.set('Authorization', `Bearer ${token}`);
            }
            return this.http.get(url, { headers, params });
          })
        );
      }



/***** Servicios de Grupo ***/

   insertGrupo(clave: string, idGenero: number, descripcion: string, ejercicio: number): Observable<any> {
     const params = { clave, idGenero, descripcion, ejercicio };
     const url = this.url + environment.conac.grupo.insert;
     return this.oauth2Service.login().pipe(
       switchMap((tokenResponse: any) => {
         const token = tokenResponse?.access_token;
         let headers = new HttpHeaders();
         if (token) {
           headers = headers.set('Authorization', `Bearer ${token}`);
         }
         return this.http.post(url, null, { headers, params });
       })
     );
   }

   updateGrupo(id: number, descripcion: string): Observable<any> {
     const params = { id, descripcion };
     const url = this.url + environment.conac.grupo.update;
     return this.oauth2Service.login().pipe(
       switchMap((tokenResponse: any) => {
         const token = tokenResponse?.access_token;
         let headers = new HttpHeaders();
         if (token) {
           headers = headers.set('Authorization', `Bearer ${token}`);
         }
         return this.http.post(url, null, { headers, params });
       })
     );
   }

   getGrupoEjercicio(ejercicio: number, idGenero: number): Observable<any> {
     const params = { ejercicio, idGenero };
     const url = this.url + environment.conac.grupo.getByEjercicio;
     return this.oauth2Service.login().pipe(
       switchMap((tokenResponse: any) => {
         const token = tokenResponse?.access_token;
         let headers = new HttpHeaders();
         if (token) {
           headers = headers.set('Authorization', `Bearer ${token}`);
         }
         return this.http.get(url, { headers, params });
       })
     );
   }

   /***** Servicios de Rubro ***/

   insertRubro(clave: string,idGenero: number, idGrupo: number, descripcion: string, ejercicio: number): Observable<any> {
     const params = { clave, idGenero, idGrupo, descripcion, ejercicio };
     const url = this.url + environment.conac.rubro.insert;
     return this.oauth2Service.login().pipe(
       switchMap((tokenResponse: any) => {
         const token = tokenResponse?.access_token;
         let headers = new HttpHeaders();
         if (token) {
           headers = headers.set('Authorization', `Bearer ${token}`);
         }
         return this.http.post(url, null, { headers, params });
       })
     );
   }

   updateRubro(id: number, descripcion: string): Observable<any> {
     const params = { id, descripcion };
     const url = this.url + environment.conac.rubro.update;
     return this.oauth2Service.login().pipe(
       switchMap((tokenResponse: any) => {
         const token = tokenResponse?.access_token;
         let headers = new HttpHeaders();
         if (token) {
           headers = headers.set('Authorization', `Bearer ${token}`);
         }
         return this.http.post(url, null, { headers, params });
       })
     );
   }

   getRubroEjercicio(ejercicio: number, idGrupo: number): Observable<any> {
     const params = { ejercicio, idGrupo };
     const url = this.url + environment.conac.rubro.getByEjercicio;
     return this.oauth2Service.login().pipe(
       switchMap((tokenResponse: any) => {
         const token = tokenResponse?.access_token;
         let headers = new HttpHeaders();
         if (token) {
           headers = headers.set('Authorization', `Bearer ${token}`);
         }
         return this.http.get(url, { headers, params });
       })
     );
   }


   /***** Servicios de Cuenta ***/
    insertCuenta(clave: string, idGenero: number, idGrupo: number, idRubro: number, descripcion: string, ejercicio: number): Observable<any> {
     const params = { clave, idGenero, idGrupo, idRubro, descripcion, ejercicio };
     const url = this.url + environment.conac.cuenta.insert;
     return this.oauth2Service.login().pipe(
       switchMap((tokenResponse: any) => {
         const token = tokenResponse?.access_token;
         let headers = new HttpHeaders();
         if (token) {
           headers = headers.set('Authorization', `Bearer ${token}`);
         }
         return this.http.post(url, null, { headers, params });
       })
     );
   }

    updateCuenta(id: number, descripcion: string): Observable<any> {
     const params = { id, descripcion };
     const url = this.url + environment.conac.cuenta.update;
     return this.oauth2Service.login().pipe(
       switchMap((tokenResponse: any) => {
         const token = tokenResponse?.access_token;
         let headers = new HttpHeaders();
         if (token) {
           headers = headers.set('Authorization', `Bearer ${token}`);
         }
         return this.http.post(url, null, { headers, params });
       })
     );
   }

    getCuentaEjercicio(ejercicio: number,idRubro: number): Observable<any> {
     const params = { ejercicio,idRubro };
     const url = this.url + environment.conac.cuenta.getByEjercicio;
     return this.oauth2Service.login().pipe(
       switchMap((tokenResponse: any) => {
         const token = tokenResponse?.access_token;
         let headers = new HttpHeaders();
         if (token) {
           headers = headers.set('Authorization', `Bearer ${token}`);
         }
         return this.http.get(url, { headers, params });
       })
     );
   }

      /***** Servicios de SubCuenta ***/
    insertSubcuenta(clave: string, idGenero: number, idGrupo: number, idRubro: number, idCuenta: number, descripcion: string, ejercicio: number): Observable<any> {
     const params = { clave, idGenero, idGrupo, idRubro, idCuenta, descripcion, ejercicio };
     const url = this.url + environment.conac.subCuenta.insert;
     return this.oauth2Service.login().pipe(
       switchMap((tokenResponse: any) => {
         const token = tokenResponse?.access_token;
         let headers = new HttpHeaders();
         if (token) {
           headers = headers.set('Authorization', `Bearer ${token}`);
         }
         return this.http.post(url, null, { headers, params });
       })
     );
   }
    updateSubcuenta(id: number, descripcion: string): Observable<any> {
     const params = { id, descripcion };
     const url = this.url + environment.conac.subCuenta.update;
     return this.oauth2Service.login().pipe(
       switchMap((tokenResponse: any) => {
         const token = tokenResponse?.access_token;
         let headers = new HttpHeaders();
         if (token) {
           headers = headers.set('Authorization', `Bearer ${token}`);
         }
         return this.http.post(url, null, { headers, params });
       })
     );
   }
    getSubcuentaEjercicio(ejercicio: number, idCuenta: number): Observable<any> {
     const params = { ejercicio, idCuenta };
     const url = this.url + environment.conac.subCuenta.getByEjercicio;
     return this.oauth2Service.login().pipe(
       switchMap((tokenResponse: any) => {
         const token = tokenResponse?.access_token;
         let headers = new HttpHeaders();
         if (token) {
           headers = headers.set('Authorization', `Bearer ${token}`);
         }
         return this.http.get(url, { headers, params });
       })
     );
   }

      /***** Servicios de DatosCuenta ***/
    insertDatosCuenta(idGenero: number, idGrupo: number, idRubro: number, idCuenta: number, idSubCuenta: number, idNaturaleza: number, idEstadoFinanciero: number, idPosicionFinanciera: number, idEstructura: number, inicioVigencia: string, finVigencia: string, ejercicio: number): Observable<any> {
     const params = { idGenero, idGrupo, idRubro, idCuenta, idSubCuenta, idNaturaleza, idEstadoFinanciero, idPosicionFinanciera, idEstructura, inicioVigencia, finVigencia, ejercicio };
     const url = this.url + environment.conac.datosCuenta.insert;
     return this.oauth2Service.login().pipe(
       switchMap((tokenResponse: any) => {
         const token = tokenResponse?.access_token;
         let headers = new HttpHeaders();
         if (token) {
           headers = headers.set('Authorization', `Bearer ${token}`);
         }
         return this.http.post(url, null, { headers, params });
       })
     );
   }

    updateDatosCuenta(idGenero: number, idGrupo: number, idRubro: number, idCuenta: number, idSubcuenta: number, idNaturaleza: number, idEstadoFinanciero: number, idPosicionFinanciera: number, idEstructura: number, inicioVigencia: string, finVigencia: string, ejercicio: number): Observable<any> {
     const params = { 
       idGenero, 
       idGrupo, 
       idRubro, 
       idCuenta, 
       idSubCuenta: idSubcuenta, // El backend espera idSubCuenta con C mayúscula
       idNaturaleza, 
       idEstadoFinanciero, 
       idPosicionFinanciera, 
       idEstructura, 
       inicioVigencia, 
       finVigencia, 
       ejercicio 
     };
     const url = this.url + environment.conac.datosCuenta.update;
     return this.oauth2Service.login().pipe(
       switchMap((tokenResponse: any) => {
         const token = tokenResponse?.access_token;
         let headers = new HttpHeaders();
         if (token) {
           headers = headers.set('Authorization', `Bearer ${token}`);
         }
         return this.http.post(url, null, { headers, params });
       })
     );
   }

   /***** Servicios de Catálogos ***/
   
   getNaturaleza(): Observable<any> {
     const url = this.url + environment.conac.catalogos.naturaleza;
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

   getEstadoFinanciero(): Observable<any> {
     const url = this.url + environment.conac.catalogos.estadoFinanciero;
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

   getPosicion(): Observable<any> {
     const url = this.url + environment.conac.catalogos.posicion;
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

   getEstructura(): Observable<any> {
     const url = this.url + environment.conac.catalogos.estructura;
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