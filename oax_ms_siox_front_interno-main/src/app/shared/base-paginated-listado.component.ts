import { Directive } from '@angular/core';

/**
 * Clase base para componentes de listado con paginación servidor-side
 * Centraliza la lógica común de paginación y manejo de índices
 */
@Directive()
export abstract class BasePaginatedListadoComponent {
  // ===== PAGINACIÓN =====
  pageIndex = 0;      // 0-based internamente
  pageSize = 10;

  // ===== MÉTODOS DE CICLO DE VIDA =====
  /**
   * Llamar en ngOnInit para cargar datos iniciales
   */
  abstract cargarDatos(): void;

  /**
   * Método abstracto que debe ser implementado por el componente derivado
   * Este método realiza la búsqueda usando los parámetros configurados
   */
  protected abstract buscarPaginado(): void;

  // ===== MANEJADORES DE PAGINACIÓN =====
  /**
   * Manejador de cambio de página (recibe page 1-based desde la tabla)
   * Convierte a 0-based internamente y realiza búsqueda
   */
  onPageChange(page: number): void {
    this.pageIndex = page - 1;  // Convertir a 0-based
    this.buscarPaginado();
  }

  /**
   * Manejador de cambio de tamaño de página
   * Reinicia paginación y realiza búsqueda
   */
  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.pageIndex = 0;  // Reiniciar a primera página
    this.buscarPaginado();
  }

  // ===== UTILIDADES =====
  /**
   * Obtener número de página 1-based para enviar al servicio
   * @returns Página 1-based (comienza en 1)
   */
  getPageNumber(): number {
    return this.pageIndex + 1;
  }

  /**
   * Obtener número de página visual para la tabla (1-based)
   * @returns Página 1-based para mostrar en UI
   */
  getPageIndexForTable(): number {
    return this.pageIndex + 1;
  }

  /**
   * Resetear paginación a primera página
   */
  resetPagination(): void {
    this.pageIndex = 0;
  }
}
