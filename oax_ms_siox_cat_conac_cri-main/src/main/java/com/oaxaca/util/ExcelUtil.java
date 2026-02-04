package com.oaxaca.util;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import java.text.SimpleDateFormat;
import java.util.Date;

public class ExcelUtil {
    public static String getCellValue(Row row, Integer colIdx) {
        if (colIdx == null)
            return "";
        Cell cell = row.getCell(colIdx);
        if (cell == null)
            return "";
        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue().trim();
            case NUMERIC:
                // Si la celda es fecha, formatear como dd/MM/yyyy
                if (org.apache.poi.ss.usermodel.DateUtil.isCellDateFormatted(cell)) {
                    Date date = cell.getDateCellValue();
                    return new SimpleDateFormat("dd/MM/yyyy").format(date);
                } else {
                    // Lógica de respaldo: si el valor numérico está en el rango de fechas de Excel, convertirlo
                    double val = cell.getNumericCellValue();
                    // Excel usa 25569 como base para 01/01/1970, pero fechas válidas suelen estar entre 30000 y 60000
                    if (val > 30000 && val < 60000) {
                        Date date = org.apache.poi.ss.usermodel.DateUtil.getJavaDate(val);
                        return new SimpleDateFormat("dd/MM/yyyy").format(date);
                    }
                    // Si es entero, sin decimales
                    if (val == Math.floor(val)) {
                        return String.valueOf((int) val);
                    } else {
                        return String.valueOf(val);
                    }
                }
            default:
                return cell.toString().trim();
        }
    }

    public static Date parseFecha(String fecha) {
        try {
            return new SimpleDateFormat("dd/MM/yyyy").parse(fecha);
        } catch (Exception e) {
            return null;
        }
    }
}
