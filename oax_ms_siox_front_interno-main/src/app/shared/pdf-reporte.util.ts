import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface PdfReporteOptions {
  columnas: string[]; // headers visibles
  datos: any[]; // objetos con keys igual a columnas
  nombreArchivo: string; // .pdf
  titulo?: string;
  orientacion?: 'p' | 'l';
}

export class PdfReporteUtil {
  static exportarConFormato(options: PdfReporteOptions) {
    const doc = new jsPDF({
      orientation: options.orientacion ?? 'l',
      unit: 'pt',
      format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth();

    // Dibujar logos si vinieron como base64
    const imgWidth = 50;
    const imgHeight = 50;
    const imgTop = 20;
    try {
      if ((options as any).logoIzquierdaBase64) {
        doc.addImage((options as any).logoIzquierdaBase64, 'PNG', 25, imgTop, imgWidth, imgHeight);
      }
      if ((options as any).logoDerechaBase64) {
        doc.addImage((options as any).logoDerechaBase64, 'PNG', pageWidth - 25 - 150, imgTop, 150, imgHeight);
      }
    } catch (err) {
      // Si hay problemas con la imagen no detener la generación del PDF
      console.warn('No se pudieron dibujar los logos en el PDF', err);
    }

    // Encabezados institucionales (alineados verticalmente con los logos)
    const textStartY = imgTop + 8;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);

              let encabezados = [
            ['', 'Subsecretaría de Ingresos', ''],
            ['', 'Dirección de Ingresos y Recaudación', ''],
            ['', 'Coordinación Técnica de Ingresos', ''],
      
          ];

    let y = textStartY;
    for (const fila of encabezados ?? []) {
      // unir celdas no vacías
      const text = fila.filter(Boolean).join(' ');
      if (text.trim()) {
        doc.text(text, pageWidth / 2, y, { align: 'center' });
        y += 12;
      }
    }

    if (options.titulo) {
      y += 4;
      doc.setFontSize(12);
      doc.text(options.titulo, pageWidth / 2, y, { align: 'center' });
      y += 16;
    } else {
      y = imgTop + imgHeight + 12; // si no hay título, asegurarse de estar debajo de los logos
    }

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);

    const head = [options.columnas];
    const body = (options.datos ?? []).map((row) =>
      options.columnas.map((c) => PdfReporteUtil.normalizeValue(row?.[c]))
    );

    autoTable(doc, {
      head,
      body,
      startY: y + 10,
      styles: {
        font: 'helvetica',
        fontSize: 9,
        cellPadding: 6,
        overflow: 'linebreak',
      },
      headStyles: {
        fillColor: [230, 230, 230],
        textColor: 20,
        fontStyle: 'bold',
        halign: 'center',
      },
      bodyStyles: {
        halign: 'left',
      },
      theme: 'grid',
      margin: { left: 30, right: 30 },
    });

    doc.save(options.nombreArchivo);
  }

  private static normalizeValue(value: any): string | number {
    if (value === null || value === undefined) return '';

    if (value instanceof Date) {
      return PdfReporteUtil.formatDate(value);
    }

    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (!trimmed) return '';

      if (trimmed.includes('T')) {
        const datePart = trimmed.split('T')[0];
        const parsed = PdfReporteUtil.parseYmd(datePart);
        return parsed ? PdfReporteUtil.formatDate(parsed) : trimmed;
      }

      if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
        const parsed = PdfReporteUtil.parseYmd(trimmed);
        return parsed ? PdfReporteUtil.formatDate(parsed) : trimmed;
      }

      if (/^\d{2}\/\d{2}\/\d{4}$/.test(trimmed)) {
        return trimmed;
      }

      return trimmed;
    }

    return value;
  }

  private static parseYmd(value: string): Date | null {
    const parts = value.split('-');
    if (parts.length !== 3) return null;
    const [y, m, d] = parts.map(Number);
    if (!y || !m || !d) return null;
    const date = new Date(y, m - 1, d);
    return isNaN(date.getTime()) ? null : date;
  }

  private static formatDate(date: Date): string {
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  }
}
