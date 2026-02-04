import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { AdministracionTemasComponent } from './modules/administracion-temas/administracion-temas.component';
import { MenuComponent } from './modules/menu/menu.component';


export const routes: Routes = [
  { 
    path: 'login', 
    loadChildren: () => import('./modules/login/login.module').then(m => m.LoginModule) 
  },
  {
    path: '',
    component: MenuComponent,
    canActivate: [authGuard],
 children: [
  { path: '', redirectTo: 'catalogo-conac/listado-conac', pathMatch: 'full' },
  { path: 'catalogo-conac', loadChildren: () => import('./modules/catalogo-conac/catalogoConac.module').then(m => m.CatalogoConacModule) },
  { path: 'clasificador-rubro-ingreso', loadChildren: () => import('./modules/clasificador-rubro-ingreso/clasificador-rubro-ingreso.module').then(m => m.ClasificadorRubroIngresoModule) },
  { path: 'tipo-periodo', loadChildren: () => import('./modules/tipo-periodo/catalogoPeriodo.module').then(m => m.CatalogoPeriodoModule) },
  { path: 'estructura-cuenta', loadChildren: () => import('./modules/estructura-cuentas/catalogoEstructuraCuenta.module').then(m => m.CatalogoEstructuraCuentaModule) },
  { path: 'clasificador-catalogo', loadChildren: () => import('./modules/clasificador-catalogo/clasificador-catalogo.module').then(m => m.ClasificadorCatalogoModule) },
  //{ path: 'catalogo-apoyo', loadChildren: () => import('./modules/clasificador-catalogo/catalogo-apoyo/catalogo-apoyo.module').then(m => m.CatalogoApoyoModule) },
  { path: 'catalogo-domicilio', loadChildren: () => import('./modules/catalogo-domicilio/catalogo-domicilio.module').then(m => m.CatalogoDomicilioModule) },
  { path: 'administracion-temas', component: AdministracionTemasComponent },
],

  },
  { path: '**', redirectTo: 'login' },
];
