import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListadoPeriodoComponent } from './listado-periodo/listado-periodo.component';

const routes: Routes = [
  { path: 'listado-periodo', component: ListadoPeriodoComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class CatalogoPeriodoModule {}
