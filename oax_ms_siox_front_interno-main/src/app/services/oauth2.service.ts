import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError, of } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class oauth2Service {
  private url = `${environment.apiBaseUrl}`;

  constructor(private http: HttpClient) {}


   login(): Observable<any> {
        // If OAuth2 disabled in environment, return null token (no Authorization header will be set)
        if (!environment.useOauth2) {
            return of({ access_token: null, token_type: null, expires_in: null });
        }

        // Construir el cuerpo en formato x-www-form-urlencoded
        const body = new URLSearchParams();
        body.set('client_id',environment.oauth2.clientId);
        body.set('client_secret', environment.oauth2.clientSecret);
        body.set('grant_type', environment.oauth2.grantType);
        body.set('scope', environment.oauth2.scope);
        // Configurar encabezados
        const headers = new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded',
        });
        return this.http
            .post(this.url + environment.oauth2.tokenUrl, body.toString(), { headers })
            .pipe(
                tap((response: any) => {
                }
                ),
                catchError((error) => {
                    console.error('Error en la solicitud HTTP:', error);
                    return throwError(() => error);
                })
            );
    }

}
