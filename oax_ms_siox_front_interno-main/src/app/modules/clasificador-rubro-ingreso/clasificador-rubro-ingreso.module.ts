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
import { CargaMasivaCriComponent } from './carga-masiva-cri/carga-masiva-cri.component';
import { ClasificadorRubroIngresoComponent } from './listado-cri/listado-cri.component';
import { NuevoCriComponent } from './nuevo-cri/nuevo-cri.component';

const routes: Routes = [
  { path: 'listado-cri', component: ClasificadorRubroIngresoComponent },
  { path: 'carga-masiva-cri', component: CargaMasivaCriComponent },
  { path: 'nuevo-cri', component: NuevoCriComponent },
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
export class ClasificadorRubroIngresoModule {}
