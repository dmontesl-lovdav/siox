import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export interface ExcelReporteOptions {
  columnas: string[];
  datos: any[];
  nombreArchivo: string;
  logoIzquierdaPath?: string;
  logoDerechaPath?: string;
  tablaStartRow?: number;   // default 7
  tituloTabla: string;     // default 'Catálogo Tipo de Póliza'
}

export class ExcelReporteUtil {
  static async exportarConFormato(options: ExcelReporteOptions): Promise<void> {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('Reporte');

    // ====== CONFIG GENERAL ======
    ws.properties.defaultRowHeight = 15;

    // ====== LAYOUT RESPONSIVO (header fijo vs tabla grande) ======
    const MIN_HEADER_COLS = 11; // A..K (ajústalo si quieres más ancho fijo)
    const tableCols = options.columnas.length;

    // Header: si tabla es chica, header se queda en MIN_HEADER_COLS;
    // si tabla es grande, header se va al ancho real de la tabla.
    const headerCols = Math.max(tableCols, MIN_HEADER_COLS);
    const headerLastCol = ExcelReporteUtil.colLetter(headerCols);

    // Tabla centrada si es chica
    // (ExcelJS usa 1-based para getCell(col))
    let tableStartCol = 1; // A
    if (tableCols < MIN_HEADER_COLS) {
      tableStartCol = Math.floor((MIN_HEADER_COLS - tableCols) / 2) + 1;
    }

    // ====== COLUMNAS ======
    // Creamos columnas hasta headerCols para que el header tenga ancho real.
    // A la tabla le damos anchos "bonitos" empezando en tableStartCol.
    // El resto (relleno del header) queda con ancho base.
    const cols: { width: number }[] = [];
    for (let i = 1; i <= headerCols; i++) cols.push({ width: 14 }); // base

    // Anchos para las columnas reales de la tabla
    for (let i = 0; i < tableCols; i++) {
      const colIndex = tableStartCol + i; // 1-based
      cols[colIndex - 1] = { width: i === 0 ? 14 : 24 };
    }

    ws.columns = cols;

    // ====== HEADER (MERGES A TODO EL ANCHO DEL HEADER) ======
    ws.mergeCells(`A1:${headerLastCol}1`);
    ws.mergeCells(`A2:${headerLastCol}2`);
    ws.mergeCells(`A3:${headerLastCol}3`);

    const headerStyle = {
      font: { bold: true, size: 16 },
      alignment: { vertical: 'middle' as const, horizontal: 'center' as const }
    };


    ws.getCell('A1').value =  'Subsecretaría de Ingresos';
    ws.getCell('A2').value =  'Dirección de Ingresos y Recaudación';
    ws.getCell('A3').value =  'Coordinación Técnica de Ingresos';

    ws.getCell('A1').style = headerStyle;
    ws.getCell('A2').style = headerStyle;
    ws.getCell('A3').style = headerStyle;

    ws.getRow(1).height = 28;
    ws.getRow(2).height = 26;
    ws.getRow(3).height = 26;
    ws.getRow(4).height = 10;

    // Título de tabla centrado a lo ancho del header
    const titulo = options.tituloTabla;
    ws.mergeCells(`A5:${headerLastCol}5`);
    ws.getCell('A5').value = titulo;
    ws.getCell('A5').style = {
      font: { bold: true, size: 12 },
      alignment: { vertical: 'middle', horizontal: 'center' }
    };
    ws.getRow(5).height = 22;
    ws.getRow(6).height = 10;

    // ====== LOGOS (ANCLADOS AL HEADER, NO A LA TABLA) ======
    if (options.logoIzquierdaPath) {
      const leftBuf = await fetch(options.logoIzquierdaPath).then(r => r.arrayBuffer());
      const leftId = wb.addImage({ buffer: leftBuf, extension: 'png' });

      // Escudo: cuadradito, controlado
      ws.addImage(leftId, {
        tl: { col: 0, row: 0 }, // A1
        ext: { width: 120, height: 120 }
      });
    }

    if (options.logoDerechaPath) {
      const rightBuf = await fetch(options.logoDerechaPath).then(r => r.arrayBuffer());
      const rightId = wb.addImage({ buffer: rightBuf, extension: 'png' });

      // Finanzas: horizontal, “max ancho” seguro dentro del header
      // startCol 0-based: headerCols - 4 suele dejar espacio para el texto
      const startCol0 = Math.max(0, headerCols - 4);

      ws.addImage(rightId, {
        tl: { col: startCol0, row: 0.1 },
        ext: { width: 240, height: 90 } // <-- seguro. Si quieres más, sube a 260 y mueve startCol0 a headerCols-5
      });
    }

    // ====== TABLA ======
    const headerRow = options.tablaStartRow ?? 7;
    ws.getRow(headerRow).height = 20;

    // Header de columnas (en tableStartCol)
    for (let i = 0; i < tableCols; i++) {
      const cell = ws.getRow(headerRow).getCell(tableStartCol + i);
      cell.value = options.columnas[i];
      ExcelReporteUtil.applyHeaderCell(cell);
    }

    // Body
    const firstDataRow = headerRow + 1;

    options.datos.forEach((dato, idx) => {
      const r = firstDataRow + idx;
      const row = ws.getRow(r);

      for (let i = 0; i < tableCols; i++) {
        const colKey = options.columnas[i];
        const cell = row.getCell(tableStartCol + i);
        cell.value = ExcelReporteUtil.normalizeValue(dato?.[colKey]);
        ExcelReporteUtil.applyBodyCell(cell);
      }

      row.height = 18;
    });

    // Bordes al rango real de tabla
    const lastDataRow = firstDataRow + options.datos.length - 1;
    ExcelReporteUtil.borderRange(ws, headerRow, lastDataRow, tableStartCol, tableStartCol + tableCols - 1);

    // Congelar hasta headerRow
    // ws.views = [{ state: 'frozen', ySplit: headerRow }];

    // Autofit SOLO a columnas reales de la tabla (para que el “relleno” del header no se vuelva loco)
    ExcelReporteUtil.autofit(ws, tableStartCol, tableCols, headerRow, lastDataRow);

    // ====== EXPORT ======
    const buffer = await wb.xlsx.writeBuffer();
    saveAs(
      new Blob([buffer]),
      options.nombreArchivo.endsWith('.xlsx') ? options.nombreArchivo : `${options.nombreArchivo}.xlsx`
    );
  }

  // ====== Helpers ======

  private static applyHeaderCell(cell: ExcelJS.Cell) {
    cell.font = { bold: true, size: 11 };
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9D9D9' } };
    cell.border = ExcelReporteUtil.thinBorder();
  }

  private static applyBodyCell(cell: ExcelJS.Cell) {
    cell.font = { size: 11 };
    cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
    cell.border = ExcelReporteUtil.thinBorder();
  }

  private static normalizeValue(value: any): string | number {
    if (value === null || value === undefined) return '';

    if (value instanceof Date) {
      return ExcelReporteUtil.formatDate(value);
    }

    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (!trimmed) return '';

      // ISO con zona horaria
      if (trimmed.includes('T')) {
        const datePart = trimmed.split('T')[0];
        const parsed = ExcelReporteUtil.parseYmd(datePart);
        return parsed ? ExcelReporteUtil.formatDate(parsed) : trimmed;
      }

      // yyyy-mm-dd
      if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
        const parsed = ExcelReporteUtil.parseYmd(trimmed);
        return parsed ? ExcelReporteUtil.formatDate(parsed) : trimmed;
      }

      // dd/MM/yyyy o MM/dd/yyyy: dejar tal cual si ya viene formateado
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

  private static thinBorder(): ExcelJS.Borders {
    return {
      top: { style: 'thin', color: { argb: 'FF000000' } },
      left: { style: 'thin', color: { argb: 'FF000000' } },
      bottom: { style: 'thin', color: { argb: 'FF000000' } },
      right: { style: 'thin', color: { argb: 'FF000000' } },
      diagonal: {}
    };
  }

  private static borderRange(ws: ExcelJS.Worksheet, r1: number, r2: number, c1: number, c2: number) {
    for (let r = r1; r <= r2; r++) {
      for (let c = c1; c <= c2; c++) {
        ws.getRow(r).getCell(c).border = ExcelReporteUtil.thinBorder();
      }
    }
  }

  // Autofit solamente para el bloque de tabla (no para todo el header)
  private static autofit(
    ws: ExcelJS.Worksheet,
    tableStartCol: number,
    tableCols: number,
    headerRow: number,
    lastRow: number
  ) {
    for (let i = 0; i < tableCols; i++) {
      const colIndex = tableStartCol + i;
      let max = 10;

      for (let r = headerRow; r <= lastRow; r++) {
        const v = ws.getRow(r).getCell(colIndex).value;
        const t = v == null ? '' : String((v as any).text ?? v);
        max = Math.max(max, t.length);
      }

      ws.getColumn(colIndex).width = Math.min(55, Math.max(12, max + 2));
    }
  }

  private static colLetter(n: number): string {
    let s = '';
    while (n > 0) {
      const m = (n - 1) % 26;
      s = String.fromCharCode(65 + m) + s;
      n = Math.floor((n - 1) / 26);
    }
    return s;
  }
}
