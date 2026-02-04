import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule, Routes } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { CargaMasivaCriComponent } from './carga-masiva-conac/carga-masiva-conac.component';
import { ListadoConacComponent } from './listado-conac/listado-conac.component';
import { NuevoCriComponent } from './nuevo-conac/nuevo-conac.component';

const routes: Routes = [
  { path: 'listado-conac', component: ListadoConacComponent },
  { path: 'carga-masiva-conac', component: CargaMasivaCriComponent },
  { path: 'nuevo-conac', component: NuevoCriComponent },
];

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCardModule,
    NzFormModule,
    NzGridModule,
    NzInputModule,
    NzButtonModule,
    RouterModule.forChild(routes)
  ],

  exports: [RouterModule]
})
export class CatalogoConacModule {}
