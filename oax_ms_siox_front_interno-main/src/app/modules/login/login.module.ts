import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzQRCodeModule } from 'ng-zorro-antd/qr-code';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { noAuthGuard } from '../../guards/no-auth.guard';
import { LoginComponent } from './components/login.component';
import { Reset2faComponent } from './components/reset-2fa.component';
import { Setup2faComponent } from './components/setup-2fa.component';
import { Validate2faComponent } from './components/validate-2fa.component';

const routes: Routes = [
  { 
    path: '', 
    component: LoginComponent,
    canActivate: [noAuthGuard]
  },
  { 
    path: 'setup-2fa', 
    component: Setup2faComponent,
    canActivate: [noAuthGuard]
  },
  { 
    path: 'validate-2fa', 
    component: Validate2faComponent,
    canActivate: [noAuthGuard]
  },
  { 
    path: 'reset-2fa', 
    component: Reset2faComponent,
    canActivate: [noAuthGuard]
  }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    // Ng-Zorro Modules
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzCardModule,
    NzAlertModule,
    NzIconModule,
    NzSpinModule,
    NzStepsModule,
    NzQRCodeModule,
    NzDividerModule,
    // Componentes standalone
    LoginComponent,
    Setup2faComponent,
    Validate2faComponent,
    Reset2faComponent
  ],
  exports: [RouterModule]
})
export class LoginModule {}
