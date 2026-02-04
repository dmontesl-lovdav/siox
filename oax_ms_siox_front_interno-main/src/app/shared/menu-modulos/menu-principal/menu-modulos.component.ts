import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { RouterModule } from '@angular/router';
import { ModulosMenuService, Modulo } from '../../../services/modulos-menu.service';

@Component({
  selector: 'app-menu-modulos',
  standalone: true,
  imports: [CommonModule, NzButtonModule, NzIconModule, RouterModule],
  templateUrl: './menu-modulos.component.html',
  styleUrls: ['./menu-modulos.component.scss']
})
export class MenuModulosComponent implements OnInit {
  @Output() cerrarMenu = new EventEmitter<void>();
  @Output() abrirSubmenu = new EventEmitter<Modulo>();

  private menuService = inject(ModulosMenuService);
  modulos: Modulo[] = [];

  ngOnInit(): void {
    this.menuService.obtenerModulos().subscribe((data) => {
      this.modulos = data;
    });
  }

  cerrar(): void {
    this.cerrarMenu.emit();
  }

  seleccionarModulo(modulo: Modulo): void {
    this.abrirSubmenu.emit(modulo); // Emitimos el módulo al componente padre
  }
}
