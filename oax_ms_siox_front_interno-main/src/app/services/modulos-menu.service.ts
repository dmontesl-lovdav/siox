import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface SubOpcion {
  nombre: string;
  ruta?: string;
  subopcionesInternas?: SubOpcion[];
}

export interface CategoriaModulo {
  nombre: string;
  subopciones?: SubOpcion[];
}

export interface Modulo {
  id: number;
  titulo: string;
  icono: string;
  categorias?: CategoriaModulo[];
}

@Injectable({ providedIn: 'root' })
export class ModulosMenuService {
  obtenerModulos(): Observable<Modulo[]> {
    return of([
      {
        id: 1,
        titulo: 'ADMINISTRADOR CONTABLE DE INGRESOS',
        icono: 'menu',
        categorias: [
          {
            nombre: 'CLASIFICADOR Y CATÁLOGOS',
            subopciones: [
              { nombre: 'CLASIFICADOR POR RUBRO DE INGRESOS', ruta: '/clasificador-rubro-ingreso/listado-cri' },
              {
                nombre: 'CATÁLOGOS CONTABLES',
                subopcionesInternas: [
                  { nombre: 'Catálogo CONAC', ruta: '/catalogo-conac/listado-conac' }
                ]
              }
            ]
          },
        ]
      },
    {
        id: 2,
        titulo: 'CONTROL DE INGRESOS',
        icono: 'menu',
        categorias: [
          {
            nombre: 'ADMINISTRACIÓN CONTABLE DE INGRESOS',
            subopciones: [
  
              {
                nombre: 'CLASIFICADORES Y CATÁLOGOS ',
                subopcionesInternas: [
                  { 
                    nombre: 'CATÁLOGO DE APOYO',
                    subopcionesInternas: [
                      { nombre: 'TIPO DE PERIODO', ruta: '/tipo-periodo/listado-periodo' },
                      { nombre: 'ESTRUCTURA DE CUENTA', ruta: '/estructura-cuenta/listado-estructura-cuenta' },
                      { nombre: 'LISTADO CONTABLE', ruta: '/catalogo-apoyo/listado-contable' },
                    ]
                  },
                ]
              }
            ]
          },
        ]
      },
  {
        id: 3,
        titulo: 'ADMINISTRACIÓN DE CONTRIBUYENTES',
        icono: 'menu',
        categorias: [
          {
            nombre: 'CATÁLOGOS PARA IDENTIFICACIÓN',
            subopciones: [
  
              {
                nombre: 'ADMINISTRACIÓN DE CATALOGO DE GENERO', ruta: 'clasificador-catalogo/listado-genero',
               
              },
               {
                nombre: 'ADMINISTRADOR DE CATÁLOGO DE TIPO DE SECTOR GUBERNAMENTAL', ruta: '/clasificador-catalogo/listado-gubernamental',
  }
            ]
          },

           {
  nombre: 'CATÁLOGOS PARA DOMICILIO',
  subopciones: [

    {
      nombre: 'CONSULTA DE CATÁLOGOS DE PAÍSES', ruta: '/catalogo-domicilio/listado-pais'
    },

    {
      nombre: 'CONSULTA DE CATÁLOGOS DE ESTADOS', ruta: '/catalogo-domicilio/listado-estado'
    },

    {
      nombre: 'CONSULTA DE CATÁLOGOS DE REGIONES', ruta: '/catalogo-domicilio/listado-regiones'
    },

    {
      nombre: 'CONSULTA DE CATÁLOGOS DE DISTRITOS', ruta: '/catalogo-domicilio/listado-distritos'
    },

    {
      nombre: 'CONSULTA DE CATÁLOGOS DE MUNICIPIOS', ruta: '/catalogo-domicilio/listado-municipios'
    },
 
    {
      nombre: 'ADMINISTRADOR DE CATÁLOGOS DE LOCALIDADES', ruta: '/catalogo-domicilio/listado-localidad'
    },
    {
      nombre: 'CATALOGO TIPO DE VIALIDAD', ruta: '/catalogo-domicilio/listado-vialidad'
    },
    {
      nombre: 'ADMINISTRADOR DE CATÁLOGOS DE TIPO DE ASENTAMIENTOS', ruta: '/catalogo-domicilio/listado-asentamiento'
    },
     {
      nombre: 'ADMINISTRADOR DE CATÁLOGOS DE NOMBRE DE ASENTAMIENTO', ruta: '/catalogo-domicilio/listado-nombre-asentamiento'
    },
     { nombre: 'ADMINISTRADOR DE CATÁLOGO DE TIPO DE INMUEBLE', ruta: '/catalogo-domicilio/listado-inmueble' },

  ]
},

        ]
      },
      {
        id: 4,
        titulo: 'ADMINISTRACIÓN',
        icono: 'skin', // o 'menu', como prefieras
        categorias: [
          {
            nombre: 'APARIENCIA',
            subopciones: [
              { nombre: 'Administración de temas', ruta: '/administracion-temas' }
            ]
          }
        ]
      }
    ]);
  }
}
