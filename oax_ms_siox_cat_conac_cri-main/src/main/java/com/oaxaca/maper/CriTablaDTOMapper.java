package com.oaxaca.maper;

import com.oaxaca.dto.CriTablaDTO;

public class CriTablaDTOMapper {

    // Método que convierte un Object[] a CriTablaDTO
    public static CriTablaDTO mapToDto(Object[] row) {
        if (row == null)
            return null;

        return new CriTablaDTO(
                row[0] != null ? ((Number) row[0]).intValue() : null, // total
                (String) row[1], // clave
                (String) row[2], // nombreClasificador
                (String) row[3], // descripcion
                row[4] != null ? row[4].toString() : null, // fechaAlta
                row[5] != null ? row[5].toString() : null, // inicioVigencia
                row[6] != null ? row[6].toString() : null, // finVigencia
                (String) row[7], // estatus
                row[8] != null ? ((Number) row[8]).intValue() : null, // idPrincipal
                row[9] != null ? ((Number) row[9]).intValue() : null, // fk
                (String) row[10], // origenTabla
                row[11] != null ? ((Number) row[11]).intValue() : null // ejercicio
        );
    }

}
