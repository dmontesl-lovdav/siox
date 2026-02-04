import { Injectable } from '@angular/core';
import { ExcelReporteUtil, ExcelReporteOptions } from '../../shared/excel-reporte.util';

@Injectable({ providedIn: 'root' })
export class ExcelExportService {
  private readonly defaultLeft = 'assets/logo_izquierda_reporte.png';
  private readonly defaultRight = 'assets/logo_derecha_reporte.png';

  exportarConFormato(options: ExcelReporteOptions): Promise<void> {
    options.logoIzquierdaPath ??= this.defaultLeft;
    options.logoDerechaPath ??= this.defaultRight;

    return ExcelReporteUtil.exportarConFormato(options); // <-- aquí ya espera real
  }
}
