package com.oaxaca.util;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.List;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class BitacoraErroresUtil {
    public static String generarBitacoraTxt(List<String> erroresGenerales, List<BitacoraFilaError> erroresPorFila,
            String nombreArchivo) throws IOException {
        StringBuilder sb = new StringBuilder();
        // Errores generales
        for (String err : erroresGenerales) {
            sb.append(err).append("\n\n");
        }
        if (!erroresPorFila.isEmpty()) {
            sb.append("TOTAL DE FILAS CON ERRORES: ").append(erroresPorFila.size()).append("\n\n");
            for (BitacoraFilaError filaError : erroresPorFila) {
                sb.append("FILA ").append(filaError.fila).append(":\n");
                for (BitacoraColumnaError colError : filaError.erroresColumna) {
                    String columnaNombre = "";
                    String mensaje = colError.mensaje;
                    int idx = mensaje.indexOf(":");
                    if (idx > 0) {
                        columnaNombre = mensaje.substring(0, idx).trim();
                        mensaje = mensaje.substring(idx + 1).trim();
                    }
                    // Eliminar cualquier aparición de 'Fila X :' en el mensaje
                    mensaje = mensaje.replaceAll("Fila \\d+ ?: ?", "");
                    log.info("mensaje {}:", mensaje);
                    sb.append("\tCOLUMNA ").append(columnaNombre).append(": ").append(mensaje).append("\n");
                }
            }
        }
        // Guardar archivo temporal
        File file = File.createTempFile("bitacora_errores_", ".txt");
        file.deleteOnExit();
        try (FileWriter writer = new FileWriter(file)) {
            writer.write(sb.toString());
        }
        return file.getAbsolutePath();
    }

    public static class BitacoraFilaError {
        public int fila;
        public List<BitacoraColumnaError> erroresColumna;

        public BitacoraFilaError(int fila, List<BitacoraColumnaError> erroresColumna) {
            this.fila = fila;
            this.erroresColumna = erroresColumna;
        }
    }

    public static class BitacoraColumnaError {
        public int columna;
        public String mensaje;

        public BitacoraColumnaError(int columna, String mensaje) {
            this.columna = columna;
            this.mensaje = mensaje;
        }
    }
}
