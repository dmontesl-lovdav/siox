import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

// ✅ componentes

import { NuevoContableComponent } from './momento-contable/nuevo-contable/nuevo-contable.component';
import { ListadoContableComponent } from './momento-contable/listado-contable/listado-contable.component';


const routes: Routes = [
  { path: 'listado-contable', component: ListadoContableComponent },
  { path: 'nuevo-contable', component: NuevoContableComponent }, // ✅ nuevo
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule]
})
export class MomentoContableModule {}
