import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { RutaNavegacion } from '../models/ruta-navegacion.model';

@Injectable({ providedIn: 'root' })
export class BreadcrumbService {
  private readonly STORAGE_KEY = 'breadcrumb';
  private breadcrumbSubject: BehaviorSubject<RutaNavegacion[]>;
  breadcrumb$;

  constructor() {
    const guardado = localStorage.getItem(this.STORAGE_KEY);
    let inicial: RutaNavegacion[] = [];
    if (guardado) {
      try {
        inicial = JSON.parse(guardado);
      } catch (e) {
        inicial = [];
      }
    }
    this.breadcrumbSubject = new BehaviorSubject<RutaNavegacion[]>(inicial);
    this.breadcrumb$ = this.breadcrumbSubject.asObservable();
  }

  setBreadcrumb(ruta: RutaNavegacion[]) {
    const actual = this.breadcrumbSubject.getValue();
    // Concatenar las rutas nuevas al final de las actuales
    const nuevoBreadcrumb = [...actual, ...ruta];
    this.breadcrumbSubject.next(nuevoBreadcrumb);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(nuevoBreadcrumb));
  }

  /**
   * Reemplaza completamente el breadcrumb y actualiza localStorage
   */
  setBreadcrumbReplace(ruta: RutaNavegacion[]) {
    this.breadcrumbSubject.next(ruta);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(ruta));
  }
}
