import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { environment } from '../../environments/environment';
import { oauth2Service } from './oauth2.service';

@Injectable({
  providedIn: 'root'
})
export class CargaMasivaCriService {
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
        return this.http.post(this.url + environment.cri.cargaArchivo, formData, { headers });
      })
    );
  }
  
  descargarPlantilla(idSistema: string, parametro: string): Observable<any> {
    // Obtener token antes de hacer la petición
    return this.oauth2Service.login().pipe(
      switchMap((tokenResponse: any) => {
        const token = tokenResponse?.access_token;
        let headers = new HttpHeaders();
        if (token) {
          headers = headers.set('Authorization', `Bearer ${token}`);
        }
        // Enviar parámetros como query params
        const params = {
          idSistema,
          parametro
        };
        return this.http.get(
          this.url + environment.cri.descargaPlantilla,
          {
            headers,
            params,
            observe: 'response',
            responseType: 'blob' as 'json',
          }
        );
      })
    );
  }


  getClasificadorRubroPaginado(ejercicio: string, pagina: number, tamano: number): Observable<any> {
    const params = {
      ejercicio: ejercicio,
      pagina: pagina.toString(),
      tamano: tamano.toString()
    };
    const url = this.url + environment.cri.getClasificadorRubroPaginado;
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

    buscarClasificadorPaginadoServicio(
      clave: string | null,
      nombre: string | null,
      descripcion: string | null,
      claveCompuesta: string | null,
      fechaAlta: string | null,
      inicioVigencia: string | null,
      finVigencia: string | null,
      ejercicio: string,
      pagina: number,
      tamano: number,
      ordenCampo: string | null
    ): Observable<any> {
      const params: any = {
        ejercicio: ejercicio,
        pagina: pagina.toString(),
        tamano: tamano.toString()
      };
      if (clave) params.clave = clave;
      if (nombre) params.nombre = nombre;
      if (descripcion) params.descripcion = descripcion;
      if (claveCompuesta) params.claveCompuesta = claveCompuesta;
      if (fechaAlta) params.fechaAlta = fechaAlta;
      if (inicioVigencia) params.inicioVigencia = inicioVigencia;
      if (finVigencia) params.finVigencia = finVigencia;
      if (ordenCampo) params.ordenCampo = ordenCampo;

      const url = this.url + environment.cri.buscarClasificadorPaginado;
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



    // --- Rubro ---

      insertCatRubroCri(clave: string, nombre: string, descripcion: string, ejercicio: number): Observable<any> {
        const params = { clave, nombre, descripcion, ejercicio };
        const url = this.url + environment.cri.rubro.insert;
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

      updateCatRubroCri(id: number, nombre: string, descripcion: string): Observable<any> {
        const params = { id, nombre, descripcion };
        const url = this.url + environment.cri.rubro.update;
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

    getRubroEjercicio(ejercicio: number): Observable<any> {
      const params = { ejercicio };
      const url = this.url + environment.cri.rubro.getByEjercicio;
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

    // --- Tipo ---
    buscarTipoPorEjercicio(ejercicio: number, idRubro: number): Observable<any> {
      const params = { ejercicio, idRubro };
      const url = this.url + environment.cri.tipo.buscarPorEjercicio;
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

    insertarTipo(clave: string, nombre: string, descripcion: string, idRubro: number, ejercicio: number): Observable<any> {
      const params = { clave, nombre, descripcion, idRubro, ejercicio };
      const url = this.url + environment.cri.tipo.insertar;
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

    actualizarTipo(id: number, nombre: string, descripcion: string): Observable<any> {
      const params = { id, nombre, descripcion };
      const url = this.url + environment.cri.tipo.actualizar;
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

    // --- Clase ---
    buscarClasePorEjercicio(ejercicio: number, idTipo: number): Observable<any> {
      const params = { ejercicio, idTipo };
      const url = this.url + environment.cri.clase.buscarPorEjercicio;
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

    insertarClase(clave: string, nombre: string, descripcion: string, idTipo: number, idRubro: number, ejercicio: number): Observable<any> {
      const params = { clave, nombre, descripcion, idTipo, idRubro, ejercicio };
      const url = this.url + environment.cri.clase.insertar;
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

    actualizarClase(id: number, nombre: string, descripcion: string): Observable<any> {
      const params = { id, nombre, descripcion };
      const url = this.url + environment.cri.clase.actualizar;
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

    // --- Concepto ---
    buscarConceptoPorEjercicio(ejercicio: number, idClase: number): Observable<any> {
      const params = { ejercicio, idClase };
      const url = this.url + environment.cri.concepto.buscarPorEjercicio;
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

    insertarConcepto(clave: string, nombre: string, descripcion: string, idRubro: number, idTipo: number, idClase: number, inicioVigencia: string, finVigencia: string, ejercicio: number): Observable<any> {
      const params = { clave, nombre, descripcion, idRubro, idTipo, idClase, inicioVigencia, finVigencia, ejercicio };
      const url = this.url + environment.cri.concepto.insertar;
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

    actualizarConcepto(id: number, nombre: string, descripcion: string, idClase: number, inicioVigencia: string, finVigencia: string): Observable<any> {
      const params = { id, nombre, descripcion, idClase, inicioVigencia, finVigencia };
      const url = this.url + environment.cri.concepto.actualizar;
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

    getAllExport(ejercicio:string){
      const params: any = {
        ejercicio: ejercicio,
      };

      const url = this.url + environment.cri.buscarClasificadorPaginado;
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


  
}
