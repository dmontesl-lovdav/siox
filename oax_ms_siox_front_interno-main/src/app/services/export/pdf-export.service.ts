import { Injectable } from '@angular/core';
import { PdfReporteUtil, PdfReporteOptions } from '../../shared/pdf-reporte.util';

@Injectable({ providedIn: 'root' })
export class PdfExportService {
  private readonly defaultLeft = 'assets/logo_izquierda_reporte.png';
  private readonly defaultRight = 'assets/logo_derecha_reporte.png';

  private loadImageAsDataUrl(path: string): Promise<string | null> {
    if (!path) return Promise.resolve(null);
    return fetch(path)
      .then((resp) => {
        if (!resp.ok) return null;
        return resp.blob();
      })
      .then((blob) => {
        if (!blob) return null;
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = (e) => reject(e);
          reader.readAsDataURL(blob);
        });
      });
  }

  async exportarConFormato(options: PdfReporteOptions): Promise<void> {
    const left = (options as any).logoIzquierdaPath || this.defaultLeft;
    const right = (options as any).logoDerechaPath || this.defaultRight;

    try {
      const [leftData, rightData] = await Promise.all([
        this.loadImageAsDataUrl(left),
        this.loadImageAsDataUrl(right),
      ]);

      const newOptions: any = { ...options };
      if (leftData) newOptions.logoIzquierdaBase64 = leftData;
      if (rightData) newOptions.logoDerechaBase64 = rightData;

      PdfReporteUtil.exportarConFormato(newOptions);
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }
  }
}
