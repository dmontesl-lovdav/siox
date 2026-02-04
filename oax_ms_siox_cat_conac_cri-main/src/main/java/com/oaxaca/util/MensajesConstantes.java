package com.oaxaca.util;

public class MensajesConstantes {
    public static final String INICIO_VIGENCIA_VACIO_NO_CONCEPTO = "Inicio de vigencia debe estar vacío para registros distintos a CONCEPTO";
    public static final String FIN_VIGENCIA_VACIO_NO_CONCEPTO = "Fin de vigencia debe estar vacío para registros distintos a CONCEPTO";
    public static final String INICIO_VIGENCIA_VACIO_NO_SUB_CUENTA = "Inicio de vigencia debe estar vacío para registros distintos a SUBCUENTA";
    public static final String FIN_VIGENCIA_VACIO_NO_SUB_CUENTA = "Fin de vigencia debe estar vacío para registros distintos a SUBCUENTA";
    public static final String NATURALEZA_VACIO_NO_SUB_CUENTA = "Naturaleza debe estar vacío para registros distintos a SUBCUENTA";
    public static final String ESTADO_FINANCIERO_VACIO_NO_SUB_CUENTA = "Estado financiero debe estar vacío para registros distintos a SUBCUENTA";
    public static final String POCISION_FINANCIERA_VACIO_NO_SUB_CUENTA = "Posición financiera debe estar vacío para registros distintos a SUBCUENTA";
    public static final String ESTRUCTURA_VACIO_NO_SUB_CUENTA = "Estructura debe estar vacío para registros distintos a SUBCUENTA";

    public static final String KEY_MENSAJE = "mensaje";
    public static final String KEY_ERROR = "error";
    public static final String PREFIJO_FILA = "Fila ";
    public static final String ERROR_ARCHIVO_VACIO = "ERROR: El archivo está vacío.";
    public static final String ERROR_ARCHIVO_SIN_NOMBRE = "ERROR: El archivo no tiene nombre.";
    public static final String ERROR_SOLO_XLSX = "ERROR: Solo se permiten archivos XLSX.";
    public static final String ERROR_PROCESAR_ARCHIVO = "ERROR: No se pudo procesar el archivo. ";
    public static final String ERROR_GENERAR_BITACORA = "ERROR: No se pudo generar la bitácora de errores. ";
    public static final String ERROR_GUARDAR_REGISTROS = "ERROR: No se pudo guardar los registros. ";
    public static final String OK = "OK";
    public static final String MENSAJE_EXITO = "Archivo cargado y validado correctamente";
    public static final String ERROR_BITACORA_DESCARGA = "No se pudo generar la bitácora de errores.";
    public static final String ERROR_INESPERADO = "Error inesperado en la carga de archivo.";
    public static final String ERROR_GUARDAR_RUBRO = "Error inesperado al guardar el rubro";
    public static final String ERROR_ACTUALIZAR_RUBRO = "Error inesperado al actualizar el rubro";
    public static final String EXITO_GUARDAR_RUBRO = "Rubro guardado exitosamente";
    public static final String EXITO_ACTUALIZAR_RUBRO = "Rubro actualizado exitosamente";
    public static final String EXITO_ACTUALIZAR_GENERO = "Género actualizado exitosamente";
    public static final String EXITO_GUARDAR_GENERO = "Género guardado exitosamente";
    public static final String ERROR_GUARDAR_GENERO = "Error inesperado al guardar el género";
    public static final String ERROR_ACTUALIZAR_GENERO = "Error inesperado al actualizar el género";
    // Validaciones de fila
    public static final String TIPO_REGISTRO_INVALIDO = "Tipo de registro inválido. Debe ser RUBRO, TIPO, CLASE o CONCEPTO.";
    public static final String TIPO_REGISTRO_INVALIDO_CONAC = "Tipo de registro inválido. Debe ser GENERO, GRUPO, RUBRO, CUENTA O SUBCUENTA.";
    public static final String EJERCICIO_NO_COINCIDE = "El ejercicio no coincide.";
    public static final String INICIO_VIGENCIA_INCORRECTO = "Inicio de vigencia incorrecto.";
    public static final String FIN_VIGENCIA_INCORRECTO = "Fin de vigencia incorrecto.";
    public static final String RUBRO_REQUERIDO = "Rubro requerido.";
    public static final String RUBRO_TIPO_REQUERIDOS = "Rubro y Tipo requeridos.";
    public static final String RUBRO_TIPO_CLASE_REQUERIDOS = "Rubro, Tipo y Clase requeridos.";
    public static final String RUBRO_TIPO_CLASE_CONCEPTO_REQUERIDOS = "Rubro, Tipo, Clase y Concepto requeridos.";

    public static final String GENERO_REQUERIDO = "Género requerido.";
    public static final String GENERO_GRUPO_REQUERIDOS = "Género y Grupo requeridos.";
    public static final String GENERO_GRUPO_RUBRO_REQUERIDOS = "Género,Grupo y Rubro requeridos.";
    public static final String GENERO_GRUPO_RUBRO_CUENTA_REQUERIDOS = "Género, Grupo, Rubro y Cuenta requeridos.";
    public static final String GENERO_GRUPO_RUBRO_CUENTA__SUBCUENTA_REQUERIDOS = "Género, Grupo, Rubro,Cuenta y Sub Cuenta requeridos.";

    public static final String RUBRO_FORMATO_INVALIDO = "Rubro con formato inválido.";
    public static final String TIPO_FORMATO_INVALIDO = "Tipo con formato inválido.";
    public static final String CLASE_FORMATO_INVALIDO = "Clase con formato inválido.";
    public static final String CONCEPTO_FORMATO_INVALIDO = "Concepto con formato inválido.";

    public static final String GENERO_FORMATO_INVALIDO = "Género con formato inválido.";
    public static final String GRUPO_FORMATO_INVALIDO = "Grupo con formato inválido.";
    public static final String CUENTA_FORMATO_INVALIDO = "Cuenta con formato inválido.";
    public static final String SUB_CUENTA_FORMATO_INVALIDO = "Sub Cuenta con formato inválido.";

    public static final String NOMBRE_REQUERIDO = "Nombre requerido.";
    public static final String DESCRIPCION_REQUERIDA = "Descripción requerida.";

    // Validaciones específicas de campos
    public static final String CAMPO_OBLIGATORIO = "Este campo es obligatorio";
    public static final String SOLO_LETRAS_NUMEROS_ESPACIOS_ACENTOS = "Solo se permiten letras, números, espacios y acentos";
    public static final String LONGITUD_MINIMA_5 = "Este campo debe contener como mínimo 5 caracteres";
    public static final String LONGITUD_MAXIMA_250 = "Este campo debe contener como máximo 250 caracteres";
    public static final String FECHA_INICIO_IGUAL_O_POSTERIOR_ALTA = "La fecha de inicio debe ser igual o posterior a la fecha de alta";
    public static final String FORMATO_FECHA_DDMMYYYY = "El valor es distinto al formato requerido";
    public static final String FECHA_FIN_POSTERIOR_INICIO = "La fecha debe ser posterior a la fecha de inicio de vigencia";
    public static final String ERROR_RUBRO_NO_ENCONTRADO = "No se encontró el rubro";

    public static final String ERROR_CLAVE_DOS_ALFANUM = "La clave debe tener exactamente dos caracteres alfanuméricos (A-Z, 0-9)";
    public static final String ERROR_TIPO_NO_ENCONTRADO = "No se encontró el tipo";
    public static final String ERROR_CLASE_ID_NO_ENCONTRADO = "No se encontró la clase con el id proporcionado";
    public static final String EXITO_GUARDAR_GRUPO = "Grupo guardado exitosamente.";
    public static final String ERROR_GUARDAR_GRUPO = "Error al guardar el grupo.";
    public static final String EXITO_ACTUALIZAR_GRUPO = "Grupo actualizado exitosamente.";
    public static final String ERROR_ACTUALIZAR_GRUPO = "Error al actualizar el grupo.";
    public static final Object EXITO_GUARDAR_CUENTA = "Cuenta guardada exitosamente.";
    public static final Object ERROR_GUARDAR_CUENTA = "Error al guardar la cuenta.";
    public static final Object EXITO_ACTUALIZAR_CUENTA = "Cuenta actualizada exitosamente.";
    public static final Object ERROR_ACTUALIZAR_CUENTA = "Error al actualizar la cuenta.";
    public static final Object EXITO_GUARDAR_SUBCUENTA = "Subcuenta guardada exitosamente.";
    public static final Object ERROR_GUARDAR_SUBCUENTA = "Error al guardar la subcuenta.";
    public static final Object EXITO_ACTUALIZAR_SUBCUENTA = "Subcuenta actualizada exitosamente.";
    public static final Object ERROR_ACTUALIZAR_SUBCUENTA = "Error al actualizar la subcuenta.";
    public static final Object EXITO_GUARDAR_DATOS_CUENTA = "Datos de cuenta guardados exitosamente.";
    public static final Object ERROR_GUARDAR_DATOS_CUENTA = "Error al guardar los datos de la cuenta.";
    public static final Object EXITO_ACTUALIZAR_DATOS_CUENTA = "Datos de cuenta actualizados exitosamente.";
    public static final Object ERROR_ACTUALIZAR_DATOS_CUENTA = "Error al actualizar los datos de la cuenta.";

}
