package com.oaxaca.util;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class CatalogoValidacionUtil {

    public static List<String> validarFilaCri(int fila, String ejercicioCol, String tipoRegistro, String rubro,
            String tipo, String clase, String concepto, String nombreCol, String descripcion, String inicioVigencia,
            String finVigencia, Integer ejercicio) {
        List<String> errores = new ArrayList<>();
        if (!List.of("RUBRO", "TIPO", "CLASE", "CONCEPTO").contains(tipoRegistro.toUpperCase())) {
            errores.add(MensajesConstantes.PREFIJO_FILA + fila + ": " + MensajesConstantes.TIPO_REGISTRO_INVALIDO);
        }
        if (!ejercicioCol.equals(ejercicio.toString())) {
            errores.add(MensajesConstantes.PREFIJO_FILA + fila + ": " + MensajesConstantes.EJERCICIO_NO_COINCIDE);
        }
        // Validación de fechas de vigencia solo para tipo CONCEPTO
        if ("CONCEPTO".equalsIgnoreCase(tipoRegistro)) {
            try {
                SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
                if (inicioVigencia != null && !inicioVigencia.trim().isEmpty()
                        && inicioVigencia.matches("\\d{2}/\\d{2}/\\d{4}")) {
                    Date fechaInicio = sdf.parse(inicioVigencia);
                    java.util.Calendar calInicio = java.util.Calendar.getInstance();
                    calInicio.setTime(fechaInicio);
                    int anioInicio = calInicio.get(java.util.Calendar.YEAR);
                    if (anioInicio != ejercicio) {
                        errores.add(MensajesConstantes.PREFIJO_FILA + fila + ": "
                                + MensajesConstantes.INICIO_VIGENCIA_INCORRECTO);
                    }
                } else {
                    errores.add(MensajesConstantes.PREFIJO_FILA + fila + ": " + MensajesConstantes.CAMPO_OBLIGATORIO
                            + " (Inicio de vigencia)");
                }
                if (finVigencia != null && !finVigencia.trim().isEmpty()
                        && finVigencia.matches("\\d{2}/\\d{2}/\\d{4}")) {
                    Date fechaFin = sdf.parse(finVigencia);
                    java.util.Calendar calFin = java.util.Calendar.getInstance();
                    calFin.setTime(fechaFin);
                    int anioFin = calFin.get(java.util.Calendar.YEAR);
                    if (anioFin != ejercicio) {
                        errores.add(MensajesConstantes.PREFIJO_FILA + fila + ": "
                                + MensajesConstantes.FIN_VIGENCIA_INCORRECTO);
                    }
                } else {
                    errores.add(MensajesConstantes.PREFIJO_FILA + fila + ": " + MensajesConstantes.CAMPO_OBLIGATORIO
                            + " (Fin de vigencia)");
                }

                // Validaciones para Inicio de Vigencia
                Date fechaAlta = new Date();
                Date fechaInicio = null;
                Date fechaFin = null;
                if (inicioVigencia == null || inicioVigencia.trim().isEmpty()) {
                    errores.add(MensajesConstantes.PREFIJO_FILA + fila + ": " + MensajesConstantes.CAMPO_OBLIGATORIO
                            + " (Inicio de vigencia)");
                } else {
                    if (!inicioVigencia.matches("\\d{2}/\\d{2}/\\d{4}")) {
                        errores.add(MensajesConstantes.PREFIJO_FILA + fila + ": "
                                + MensajesConstantes.FORMATO_FECHA_DDMMYYYY
                                + " (Inicio de vigencia)");
                    } else {
                        try {
                            fechaInicio = sdf.parse(inicioVigencia);
                            if (fechaInicio.before(sdf.parse(sdf.format(fechaAlta)))) {
                                errores.add(MensajesConstantes.PREFIJO_FILA + fila + ": "
                                        + MensajesConstantes.FECHA_INICIO_IGUAL_O_POSTERIOR_ALTA);
                            }
                        } catch (Exception e) {
                            errores.add(MensajesConstantes.PREFIJO_FILA + fila + ": "
                                    + MensajesConstantes.FORMATO_FECHA_DDMMYYYY + " (Inicio de vigencia)");
                        }
                    }
                }
                // Validaciones para Fin de Vigencia
                if (finVigencia == null || finVigencia.trim().isEmpty()) {
                    errores.add(MensajesConstantes.PREFIJO_FILA + fila + ": " + MensajesConstantes.CAMPO_OBLIGATORIO
                            + " (Fin de vigencia)");
                } else {
                    if (!finVigencia.matches("\\d{2}/\\d{2}/\\d{4}")) {
                        errores.add(MensajesConstantes.PREFIJO_FILA + fila + ": "
                                + MensajesConstantes.FORMATO_FECHA_DDMMYYYY
                                + " (Fin de vigencia)");
                    } else {
                        try {
                            fechaFin = sdf.parse(finVigencia);
                            if (fechaInicio != null && !fechaFin.after(fechaInicio)) {
                                errores.add(MensajesConstantes.PREFIJO_FILA + fila + ": "
                                        + MensajesConstantes.FECHA_FIN_POSTERIOR_INICIO);
                            }
                        } catch (Exception e) {
                            errores.add(MensajesConstantes.PREFIJO_FILA + fila + ": "
                                    + MensajesConstantes.FORMATO_FECHA_DDMMYYYY + " (Fin de vigencia)");
                        }
                    }
                }
            } catch (Exception e) {
                // Si hay error de formato, ya se valida en otra parte
            }
        } else {
            // Si no es CONCEPTO, ambos campos deben venir vacíos
            if (inicioVigencia != null && !inicioVigencia.trim().isEmpty()) {
                errores.add(MensajesConstantes.PREFIJO_FILA + fila + ": "
                        + MensajesConstantes.INICIO_VIGENCIA_VACIO_NO_CONCEPTO);
            }
            if (finVigencia != null && !finVigencia.trim().isEmpty()) {
                errores.add(MensajesConstantes.PREFIJO_FILA + fila + ": "
                        + MensajesConstantes.FIN_VIGENCIA_VACIO_NO_CONCEPTO);
            }
        }
        switch (tipoRegistro.toUpperCase()) {
            case "RUBRO":
                if (rubro.isEmpty()) {
                    errores.add(MensajesConstantes.PREFIJO_FILA + fila + ": " + MensajesConstantes.RUBRO_REQUERIDO);
                }
                break;
            case "TIPO":
                if (rubro.isEmpty() || tipo.isEmpty()) {
                    errores.add(
                            MensajesConstantes.PREFIJO_FILA + fila + ": " + MensajesConstantes.RUBRO_TIPO_REQUERIDOS);
                }
                break;
            case "CLASE":
                if (rubro.isEmpty() || tipo.isEmpty() || clase.isEmpty()) {
                    errores.add(MensajesConstantes.PREFIJO_FILA + fila + ": "
                            + MensajesConstantes.RUBRO_TIPO_CLASE_REQUERIDOS);
                }
                break;
            case "CONCEPTO":
                if (rubro.isEmpty() || tipo.isEmpty() || clase.isEmpty() || concepto.isEmpty()) {
                    errores.add(MensajesConstantes.PREFIJO_FILA + fila + ": "
                            + MensajesConstantes.RUBRO_TIPO_CLASE_CONCEPTO_REQUERIDOS);
                }
                break;
        }
        if (!rubro.matches("[A-Z0-9]*")) {
            errores.add(MensajesConstantes.PREFIJO_FILA + fila + ": " + MensajesConstantes.RUBRO_FORMATO_INVALIDO);
        }
        if (!tipo.matches("[A-Z0-9]*")) {
            errores.add(MensajesConstantes.PREFIJO_FILA + fila + ": " + MensajesConstantes.TIPO_FORMATO_INVALIDO);
        }
        if (!clase.matches("[A-Z0-9]*")) {
            errores.add(MensajesConstantes.PREFIJO_FILA + fila + ": " + MensajesConstantes.CLASE_FORMATO_INVALIDO);
        }
        if (!concepto.matches("[A-Z0-9]*")) {
            errores.add(MensajesConstantes.PREFIJO_FILA + fila + ": " + MensajesConstantes.CONCEPTO_FORMATO_INVALIDO);
        }
        // Validaciones para Nombre
        if (nombreCol == null || nombreCol.trim().isEmpty()) {
            errores.add(
                    MensajesConstantes.PREFIJO_FILA + fila + ": " + MensajesConstantes.CAMPO_OBLIGATORIO + " (Nombre)");
        } else {
            if (!nombreCol.matches("[A-Za-zÁÉÍÓÚáéíóúÑñ0-9 ]+")) {
                errores.add(MensajesConstantes.PREFIJO_FILA + fila + ": "
                        + MensajesConstantes.SOLO_LETRAS_NUMEROS_ESPACIOS_ACENTOS + " (Nombre)");
            }
            if (nombreCol.length() < 5) {
                errores.add(MensajesConstantes.PREFIJO_FILA + fila + ": " + MensajesConstantes.LONGITUD_MINIMA_5
                        + " (Nombre)");
            }
            if (nombreCol.length() > 250) {
                errores.add(MensajesConstantes.PREFIJO_FILA + fila + ": " + MensajesConstantes.LONGITUD_MAXIMA_250
                        + " (Nombre)");
            }
        }
        // Validaciones para Descripción
        if (descripcion == null || descripcion.trim().isEmpty()) {
            errores.add(MensajesConstantes.PREFIJO_FILA + fila + ": " + MensajesConstantes.CAMPO_OBLIGATORIO
                    + " (Descripción)");
        } else {
            if (!descripcion.matches("[A-Za-zÁÉÍÓÚáéíóúÑñ0-9 ]+")) {
                errores.add(MensajesConstantes.PREFIJO_FILA + fila + ": "
                        + MensajesConstantes.SOLO_LETRAS_NUMEROS_ESPACIOS_ACENTOS + " (Descripción)");
            }
            if (descripcion.length() < 5) {
                errores.add(MensajesConstantes.PREFIJO_FILA + fila + ": " + MensajesConstantes.LONGITUD_MINIMA_5
                        + " (Descripción)");
            }
            if (descripcion.length() > 250) {
                errores.add(MensajesConstantes.PREFIJO_FILA + fila + ": " + MensajesConstantes.LONGITUD_MAXIMA_250
                        + " (Descripción)");
            }
        }

        return errores;
    }

    public static List<String> validarFilaConac(int fila, String ejercicioCol, String tipoRegistro, String genero,
            String grupo, String rubro, String cuenta, String subcuenta, String descripcion, String naturaleza,
            String estadoFinaciero, String pocisionFinanciera, String estructura, String inicioVigencia,
            String finVigencia, Integer ejercicio) {
        List<String> errores = new ArrayList<>();
        if (!List.of("GENERO", "GRUPO", "RUBRO", "CUENTA", "SUBCUENTA").contains(tipoRegistro.toUpperCase())) {
            errores.add(
                    MensajesConstantes.PREFIJO_FILA + fila + ": " + MensajesConstantes.TIPO_REGISTRO_INVALIDO_CONAC);
        }
        if (!ejercicioCol.equals(ejercicio.toString())) {
            errores.add(MensajesConstantes.PREFIJO_FILA + fila + ": " + MensajesConstantes.EJERCICIO_NO_COINCIDE);
        }
        // Validación de fechas de vigencia solo para tipo SUBCUENTA
        if ("SUBCUENTA".equalsIgnoreCase(tipoRegistro)) {
            try {
                SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
                if (inicioVigencia != null && !inicioVigencia.trim().isEmpty()
                        && inicioVigencia.matches("\\d{2}/\\d{2}/\\d{4}")) {
                    Date fechaInicio = sdf.parse(inicioVigencia);
                    java.util.Calendar calInicio = java.util.Calendar.getInstance();
                    calInicio.setTime(fechaInicio);
                    int anioInicio = calInicio.get(java.util.Calendar.YEAR);
                    if (anioInicio != ejercicio) {
                        errores.add(MensajesConstantes.PREFIJO_FILA + fila + ": "
                                + MensajesConstantes.INICIO_VIGENCIA_INCORRECTO);
                    }
                } else {
                    errores.add(MensajesConstantes.PREFIJO_FILA + fila + ": " + MensajesConstantes.CAMPO_OBLIGATORIO
                            + " (Inicio de vigencia)");
                }
                if (finVigencia != null && !finVigencia.trim().isEmpty()
                        && finVigencia.matches("\\d{2}/\\d{2}/\\d{4}")) {
                    Date fechaFin = sdf.parse(finVigencia);
                    java.util.Calendar calFin = java.util.Calendar.getInstance();
                    calFin.setTime(fechaFin);
                    int anioFin = calFin.get(java.util.Calendar.YEAR);
                    if (anioFin != ejercicio) {
                        errores.add(MensajesConstantes.PREFIJO_FILA + fila + ": "
                                + MensajesConstantes.FIN_VIGENCIA_INCORRECTO);
                    }
                } else {
                    errores.add(MensajesConstantes.PREFIJO_FILA + fila + ": " + MensajesConstantes.CAMPO_OBLIGATORIO
                            + " (Fin de vigencia)");
                }

                // Validaciones para Inicio de Vigencia
                Date fechaAlta = new Date();
                Date fechaInicio = null;
                Date fechaFin = null;
                if (inicioVigencia == null || inicioVigencia.trim().isEmpty()) {
                    errores.add(MensajesConstantes.PREFIJO_FILA + fila + ": " + MensajesConstantes.CAMPO_OBLIGATORIO
                            + " (Inicio de vigencia)");
                } else {
                    if (!inicioVigencia.matches("\\d{2}/\\d{2}/\\d{4}")) {
                        errores.add(MensajesConstantes.PREFIJO_FILA + fila + ": "
                                + MensajesConstantes.FORMATO_FECHA_DDMMYYYY
                                + " (Inicio de vigencia)");
                    } else {
                        try {
                            fechaInicio = sdf.parse(inicioVigencia);
                            if (fechaInicio.before(sdf.parse(sdf.format(fechaAlta)))) {
                                errores.add(MensajesConstantes.PREFIJO_FILA + fila + ": "
                                        + MensajesConstantes.FECHA_INICIO_IGUAL_O_POSTERIOR_ALTA);
                            }
                        } catch (Exception e) {
                            errores.add(MensajesConstantes.PREFIJO_FILA + fila + ": "
                                    + MensajesConstantes.FORMATO_FECHA_DDMMYYYY + " (Inicio de vigencia)");
                        }
                    }
                }
                // Validaciones para Fin de Vigencia
                if (finVigencia == null || finVigencia.trim().isEmpty()) {
                    errores.add(MensajesConstantes.PREFIJO_FILA + fila + ": " + MensajesConstantes.CAMPO_OBLIGATORIO
                            + " (Fin de vigencia)");
                } else {
                    if (!finVigencia.matches("\\d{2}/\\d{2}/\\d{4}")) {
                        errores.add(MensajesConstantes.PREFIJO_FILA + fila + ": "
                                + MensajesConstantes.FORMATO_FECHA_DDMMYYYY
                                + " (Fin de vigencia)");
                    } else {
                        try {
                            fechaFin = sdf.parse(finVigencia);
                            if (fechaInicio != null && !fechaFin.after(fechaInicio)) {
                                errores.add(MensajesConstantes.PREFIJO_FILA + fila + ": "
                                        + MensajesConstantes.FECHA_FIN_POSTERIOR_INICIO);
                            }
                        } catch (Exception e) {
                            errores.add(MensajesConstantes.PREFIJO_FILA + fila + ": "
                                    + MensajesConstantes.FORMATO_FECHA_DDMMYYYY + " (Fin de vigencia)");
                        }
                    }
                }
                // Validación de Naturaleza
                if (naturaleza == null || naturaleza.length() != 1
                        || !(naturaleza.equals("H") || naturaleza.equals("D"))) {
                    errores.add(MensajesConstantes.PREFIJO_FILA + fila
                            + ": Naturaleza inválida. Debe ser 'H' o 'D' y tener longitud 1.");
                }

                // Validación de Estado financiero
                if (estadoFinaciero == null || estadoFinaciero.length() != 1 || !(estadoFinaciero.matches("[12]"))) {
                    errores.add(MensajesConstantes.PREFIJO_FILA + fila
                            + ": Estado financiero inválido. Debe ser '1' o '2' y tener longitud 1.");
                }

                // Validación de Posición financiera
                if (pocisionFinanciera == null || pocisionFinanciera.length() != 1
                        || !(pocisionFinanciera.matches("[APHOCH]"))) {
                    errores.add(MensajesConstantes.PREFIJO_FILA + fila
                            + ": Posición financiera inválida. Debe ser una letra válida (A, P, H, O, C) y tener longitud 1.");
                }

                // Validación de Estructura
                if (estructura == null || estructura.trim().isEmpty()) {
                    errores.add(MensajesConstantes.PREFIJO_FILA + fila + ": Estructura es obligatoria.");
                } else {
                    String[] patrones = {
                            "^\\[\\d{5}\\]\\.\\[\\d{3}\\]\\.\\[\\d{3}\\]\\.\\[\\d{3}\\]\\.\\[\\d{2}\\]\\.\\[\\d{4}\\]$", // [00000].[000].[000].[000].[00].[0000]
                            "^\\[\\d{5}\\]\\.\\[\\d{3}\\]\\.\\[\\d{3}\\]\\.\\[\\d{4}\\]$", // [00000].[000].[000].[0000]
                            "^\\[\\d{5}\\]\\.\\[\\d{3}\\]\\.\\[\\d{3}\\]\\.\\[\\d{3}\\]\\.\\[\\d{4}\\]$", // [00000].[000].[000].[000].[0000]
                            "^\\[\\d{5}\\]\\.\\[\\d{3}\\]\\.\\[\\d{3}\\]\\.\\[\\d{4}\\]$", // [00000].[000].[000].[0000]
                            "^\\[\\d{5}\\]\\.\\[\\d{3}\\]\\.\\[\\d{3}\\]\\.\\[\\d{3}\\]\\.\\[\\d{4}\\]$" // [00000].[000].[000].[000].[0000]
                    };
                    boolean estructuraValida = false;
                    for (String patron : patrones) {
                        if (estructura.matches(patron)) {
                            estructuraValida = true;
                            break;
                        }
                    }
                    if (!estructuraValida) {
                        errores.add(MensajesConstantes.PREFIJO_FILA + fila
                                + ": Estructura inválida. No cumple con los formatos permitidos.");
                    }
                }

            } catch (Exception e) {
                // Si hay error de formato, ya se valida en otra parte
            }
        } else {
            // Si no es CONCEPTO, ambos campos deben venir vacíos
            if (inicioVigencia != null && !inicioVigencia.trim().isEmpty()) {
                errores.add(MensajesConstantes.PREFIJO_FILA + fila + ": "
                        + MensajesConstantes.INICIO_VIGENCIA_VACIO_NO_SUB_CUENTA);
            }
            if (finVigencia != null && !finVigencia.trim().isEmpty()) {
                errores.add(MensajesConstantes.PREFIJO_FILA + fila + ": "
                        + MensajesConstantes.FIN_VIGENCIA_VACIO_NO_SUB_CUENTA);
            }
            if (naturaleza != null && !naturaleza.trim().isEmpty()) {
                errores.add(MensajesConstantes.PREFIJO_FILA + fila + ": "
                        + MensajesConstantes.NATURALEZA_VACIO_NO_SUB_CUENTA);
            }
            if (estadoFinaciero != null && !estadoFinaciero.trim().isEmpty()) {
                errores.add(MensajesConstantes.PREFIJO_FILA + fila + ": "
                        + MensajesConstantes.ESTADO_FINANCIERO_VACIO_NO_SUB_CUENTA);
            }
            if (pocisionFinanciera != null && !pocisionFinanciera.trim().isEmpty()) {
                errores.add(MensajesConstantes.PREFIJO_FILA + fila + ": "
                        + MensajesConstantes.POCISION_FINANCIERA_VACIO_NO_SUB_CUENTA);
            }
            if (estructura != null && !estructura.trim().isEmpty()) {
                errores.add(MensajesConstantes.PREFIJO_FILA + fila + ": "
                        + MensajesConstantes.ESTRUCTURA_VACIO_NO_SUB_CUENTA);
            }
        }
        switch (tipoRegistro.toUpperCase()) {
            case "GENERO":
                if (genero.isEmpty()) {
                    errores.add(MensajesConstantes.PREFIJO_FILA + fila + ": " + MensajesConstantes.GENERO_REQUERIDO);
                }
                break;
            case "GRUPO":
                if (genero.isEmpty() || grupo.isEmpty()) {
                    errores.add(
                            MensajesConstantes.PREFIJO_FILA + fila + ": " + MensajesConstantes.GENERO_GRUPO_REQUERIDOS);
                }
                break;
            case "RUBRO":
                if (genero.isEmpty() || grupo.isEmpty() || rubro.isEmpty()) {
                    errores.add(
                            MensajesConstantes.PREFIJO_FILA + fila + ": "
                                    + MensajesConstantes.GENERO_GRUPO_RUBRO_REQUERIDOS);
                }
                break;

            case "CUENTA":
                if (genero.isEmpty() || grupo.isEmpty() || rubro.isEmpty() || cuenta.isEmpty()) {
                    errores.add(MensajesConstantes.PREFIJO_FILA + fila + ": "
                            + MensajesConstantes.GENERO_GRUPO_RUBRO_CUENTA_REQUERIDOS);
                }
                break;
            case "SUBCUENTA":
                if (genero.isEmpty() || grupo.isEmpty() || rubro.isEmpty() || cuenta.isEmpty() || subcuenta.isEmpty()) {
                    errores.add(MensajesConstantes.PREFIJO_FILA + fila + ": "
                            + MensajesConstantes.GENERO_GRUPO_RUBRO_CUENTA__SUBCUENTA_REQUERIDOS);
                }
                break;
        }
        if (!genero.matches("[A-Z0-9]*")) {
            errores.add(MensajesConstantes.PREFIJO_FILA + fila + ": " + MensajesConstantes.GENERO_FORMATO_INVALIDO);
        }
        if (!grupo.matches("[A-Z0-9]*")) {
            errores.add(MensajesConstantes.PREFIJO_FILA + fila + ": " + MensajesConstantes.GRUPO_FORMATO_INVALIDO);
        }
        if (!rubro.matches("[A-Z0-9]*")) {
            errores.add(MensajesConstantes.PREFIJO_FILA + fila + ": " + MensajesConstantes.RUBRO_FORMATO_INVALIDO);
        }
        if (!cuenta.matches("[A-Z0-9]*")) {
            errores.add(MensajesConstantes.PREFIJO_FILA + fila + ": " + MensajesConstantes.CUENTA_FORMATO_INVALIDO);
        }
        if (!subcuenta.matches("[A-Z0-9]*")) {
            errores.add(MensajesConstantes.PREFIJO_FILA + fila + ": " + MensajesConstantes.SUB_CUENTA_FORMATO_INVALIDO);
        }

        // Validaciones para Descripción
        if (descripcion == null || descripcion.trim().isEmpty()) {
            errores.add(MensajesConstantes.PREFIJO_FILA + fila + ": " + MensajesConstantes.CAMPO_OBLIGATORIO
                    + " (Descripción)");
        } else {
            if (!descripcion.matches("[A-Za-zÁÉÍÓÚáéíóúÑñ0-9 ]+")) {
                errores.add(MensajesConstantes.PREFIJO_FILA + fila + ": "
                        + MensajesConstantes.SOLO_LETRAS_NUMEROS_ESPACIOS_ACENTOS + " (Descripción)");
            }
            if (descripcion.length() < 5) {
                errores.add(MensajesConstantes.PREFIJO_FILA + fila + ": " + MensajesConstantes.LONGITUD_MINIMA_5
                        + " (Descripción)");
            }
            if (descripcion.length() > 250) {
                errores.add(MensajesConstantes.PREFIJO_FILA + fila + ": " + MensajesConstantes.LONGITUD_MAXIMA_250
                        + " (Descripción)");
            }
        }

        return errores;
    }
}
