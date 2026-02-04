import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'listado-genero',
    loadComponent: () =>
      import('./genero/listado-genero/listado-genero.component')
        .then(m => m.ListadoGeneroComponent)
  },
    {
    path: 'listado-gubernamental',
    loadComponent: () =>
      import('./sector-gubernamental/listado-gubernamental/listado-gubernamental.component')
        .then(m => m.ListadoGubernamentalComponent)
  },
  {
    path: '',
    redirectTo: 'listado-genero',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClasificadorCatalogoModule {}
