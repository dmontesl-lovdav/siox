import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'listado-pais',
    loadComponent: () => import('./listado-pais/listado-pais.component').then(m => m.ListadoPaisComponent)
  },
   {
    path: 'listado-estado',
    loadComponent: () => import('./listado-estado/listado-estado.component').then(m => m.ListadoEstadoComponent)
  },
    {
    path: 'listado-regiones',
    loadComponent: () => import('./listado-regiones/listado-regiones.component').then(m => m.ListadoRegionesComponent)
  },

    {
    path: 'listado-distritos',
    loadComponent: () => import('./listado-distritos/listado-distritos.component').then(m => m.ListadoDistritosComponent)
  },
    {
    path: 'listado-municipios',
    loadComponent: () => import('./listado-municipios/listado-municipios.component').then(m => m.ListadoMunicipiosComponent)
  },
   {
    path: 'listado-localidad',
    loadComponent: () => import('./localidad/listado-localidad/listado-localidad.component').then(m => m.ListadoLocalidadComponent)
  },
  {
    path: 'listado-asentamiento',
    loadComponent: () =>
      import('./catalogo-asentamiento/listado-asentamiento/listado-asentamiento.component').then(m => m.ListadoAsentamientoComponent)
  },
  {
  path: 'listado-nombre-asentamiento',
  loadComponent: () =>
    import('./nombre-asentamiento/listado-nombre-asentamiento/listado-nombre-asentamiento.component').then(m => m.ListadoNombreAsentamientoComponent)
},

  {
    path: 'listado-vialidad',
    loadComponent: () =>
      import('./catalogo-vialidad/listado-vialidad/listado-vialidad.component').then(m => m.ListadoVialidadComponent)
  },
  {
  path: 'listado-inmueble',
  loadComponent: () =>
    import('./catalogo-inmueble/listado-inmueble/listado-inmueble.component').then(m => m.ListadoInmuebleComponent)
},

  {
    path: '',
    redirectTo: 'listado',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalogoDomicilioModule { }
