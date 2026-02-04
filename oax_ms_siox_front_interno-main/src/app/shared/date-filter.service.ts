import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateFilterService {
  toYMD(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  parseDate(value: any): Date | null {
    if (!value) return null;
    if (value instanceof Date) return isNaN(+value) ? null : value;

    if (typeof value === 'string') {
      // Si viene en formato ISO con hora (ej: "2026-01-24T06:00:00.000Z")
      // Extraer solo la parte de la fecha para evitar problemas de zona horaria
      let dateStr = value;
      if (value.includes('T')) {
        dateStr = value.split('T')[0];
      }
      
      const m = dateStr.match(/^([0-9]{4})-([0-9]{2})-([0-9]{2})$/);
      if (m) {
        const y = Number(m[1]);
        const mo = Number(m[2]) - 1;
        const d = Number(m[3]);
        return new Date(y, mo, d);
      }
    }

    // Fallback: intentar parsear como Date, pero extraer solo la fecha
    const dateStr = String(value);
    if (dateStr.includes('T')) {
      const parts = dateStr.split('T')[0].split('-');
      if (parts.length === 3) {
        return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
      }
    }
    
    const d = new Date(value);
    return isNaN(+d) ? null : d;
  }

  normalizeDateFilterValue(value: any): any {
    const dateValue = this.parseDate(value);
    return dateValue ? this.toYMD(dateValue) : value;
  }
}
