import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { RutaNavegacion } from '../../../models/ruta-navegacion.model';
import { CategoriaModulo, Modulo, SubOpcion } from '../../../services/modulos-menu.service';

@Component({
  selector: 'app-submenu-sidebar',
  standalone: true,
  imports: [CommonModule, NzIconModule, RouterModule],
  templateUrl: './submenu-sidebar.component.html',
  styleUrls: ['./submenu-sidebar.component.scss']
})
export class SubmenuSidebarComponent {
  @Input() modulo: Modulo | null = null;
  @Output() cerrar = new EventEmitter<void>();
  @Output() breadcrumbGenerado = new EventEmitter<RutaNavegacion[]>();
  @Output() navegacionTerminada = new EventEmitter<void>();
  // 👉 Referencia al contenedor real del DOM del submenú

  categoriaExpandida: CategoriaModulo | null = null;
  subcategoriaExpandida: string | null = null;
  // Para manejar múltiples niveles de expansión
  expandedPaths: Set<string> = new Set();

  constructor(private router: Router) {}
  
  toggleCategoria(categoria: CategoriaModulo): void {
    if (this.categoriaExpandida === categoria) {
      this.categoriaExpandida = null;
      this.subcategoriaExpandida = null;
      this.expandedPaths.clear();
    } else {
      this.categoriaExpandida = categoria;
      this.subcategoriaExpandida = null;
      this.expandedPaths.clear();
    }
  }

  toggleSubcategoria(nombre: string): void {
    this.subcategoriaExpandida = this.subcategoriaExpandida === nombre ? null : nombre;
  }

  // Método para manejar expansión de subopciones anidadas
  togglePath(path: string): void {
    if (this.expandedPaths.has(path)) {
      this.expandedPaths.delete(path);
    } else {
      this.expandedPaths.add(path);
    }
  }

  isPathExpanded(path: string): boolean {
    return this.expandedPaths.has(path);
  }

  // Helper para construir array de padres + opción actual
  buildOpcionesArray(padres: SubOpcion[], opcion: SubOpcion): SubOpcion[] {
    return [...padres, opcion];
  }

  tieneSubSubopciones(sub: SubOpcion): boolean {
    return !!sub.subopcionesInternas?.length;
  }

  cerrarSubmenu(): void {
    this.cerrar.emit();
  }

navegar(
  modulo: Modulo,
  categoria: CategoriaModulo,
  opciones: SubOpcion[]
): void {
  // Construir breadcrumb dinámicamente
  const breadcrumb: RutaNavegacion[] = [
    { nombre: modulo.titulo },
    { nombre: categoria.nombre }
  ];

  // Agregar todas las opciones intermedias
  opciones.forEach((opcion, index) => {
    if (index === opciones.length - 1) {
      // La última opción es la actual
      breadcrumb.push({ nombre: opcion.nombre, actual: true });
    } else {
      breadcrumb.push({ nombre: opcion.nombre });
    }
  });

  this.breadcrumbGenerado.emit(breadcrumb);

  // Buscar la ruta en la última opción
  const ultimaOpcion = opciones[opciones.length - 1];
  const destino = ultimaOpcion?.ruta;
  
  if (destino) {
    this.router.navigateByUrl(destino).then(() => {
      this.navegacionTerminada.emit();
    });
  }
}


}
