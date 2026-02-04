import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListadoEstructuraCuentaComponent } from './listado-estructura-cuenta/listado-estructura-cuenta.component';
import { NuevoEstructuraCuentaComponent } from './nuevo-estructura-cuenta/nuevo-estructura-cuenta.component';

const routes: Routes = [
  { path: 'listado-estructura-cuenta', component: ListadoEstructuraCuentaComponent },
  { path: 'nueva', component: NuevoEstructuraCuentaComponent },
  { path: 'editar/:id', component: NuevoEstructuraCuentaComponent },
  { path: 'detalle/:id', component: NuevoEstructuraCuentaComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class CatalogoEstructuraCuentaModule {}
