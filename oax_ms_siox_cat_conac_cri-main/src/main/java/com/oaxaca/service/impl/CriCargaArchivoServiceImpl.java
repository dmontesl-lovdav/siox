package com.oaxaca.service.impl;

import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.IntStream;

import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.oaxaca.repository.CatClaseCriRepository;
import com.oaxaca.repository.CatConceptosCriRepository;
import com.oaxaca.repository.CatRubroCriRepository;
import com.oaxaca.repository.CatTipoCriRepository;
import com.oaxaca.service.ICriCargaArchivoService;
import com.oaxaca.util.BitacoraErroresUtil;
import com.oaxaca.util.CatalogoDeleteUtil;
import com.oaxaca.util.CatalogoValidacionUtil;
import com.oaxaca.util.MensajesConstantes;

import lombok.extern.slf4j.Slf4j;

@Service
@Transactional
@Slf4j
public class CriCargaArchivoServiceImpl implements ICriCargaArchivoService {

    @Autowired
    private CatRubroCriRepository rubroRepo;
    @Autowired
    private CatTipoCriRepository tipoRepo;
    @Autowired
    private CatClaseCriRepository claseRepo;
    @Autowired
    private CatConceptosCriRepository conceptoRepo;

    @Override
    public Object validarArchivo(MultipartFile archivo, Integer ejercicio) {
        List<String> erroresGenerales = new java.util.ArrayList<>();
        List<BitacoraErroresUtil.BitacoraFilaError> erroresPorFila = new java.util.ArrayList<>();

        // Listas para agrupar los registros
        List<com.oaxaca.entity.CatRubroCri> rubros = new java.util.ArrayList<>();
        List<com.oaxaca.entity.CatTipoCri> tipos = new java.util.ArrayList<>();
        List<com.oaxaca.entity.CatClaseCri> clases = new java.util.ArrayList<>();
        List<com.oaxaca.entity.CatConceptosCri> conceptos = new java.util.ArrayList<>();

        // Mapas de trazabilidad de fila
        Map<com.oaxaca.entity.CatRubroCri, Integer> filaRubro = new java.util.HashMap<>();
        Map<com.oaxaca.entity.CatTipoCri, Integer> filaTipo = new java.util.HashMap<>();
        Map<com.oaxaca.entity.CatClaseCri, Integer> filaClase = new java.util.HashMap<>();
        Map<com.oaxaca.entity.CatConceptosCri, Integer> filaConcepto = new java.util.HashMap<>();

        int anioActual = java.time.LocalDate.now().getYear();
        if (ejercicio < anioActual || ejercicio > anioActual + 1) {
            return ("El ejercicio " + ejercicio
                    + " no es válido. Solo se permiten el vigente (" + anioActual
                    + ") o el próximo (" + (anioActual + 1) + ").");
        }

        if (archivo == null || archivo.isEmpty()) {
            erroresGenerales.add(MensajesConstantes.ERROR_ARCHIVO_VACIO);
        } else {
            String nombre = archivo.getOriginalFilename();
            if (nombre == null) {
                erroresGenerales.add(MensajesConstantes.ERROR_ARCHIVO_SIN_NOMBRE);
            } else if (nombre.endsWith(".xlsx")) {
                try (InputStream is = archivo.getInputStream(); Workbook workbook = new XSSFWorkbook(is)) {
                    Sheet sheet = workbook.getSheetAt(0);

                    IntStream.range(1, sheet.getPhysicalNumberOfRows())
                            .mapToObj(sheet::getRow)
                            .filter(Objects::nonNull)
                            .forEach(row -> {
                                int fila = row.getRowNum() + 1; // número real de fila del Excel
                                try {
                                    String ejercicioCol = com.oaxaca.util.ExcelUtil.getCellValue(row, 0);
                                    String tipoRegistro = com.oaxaca.util.ExcelUtil.getCellValue(row, 1).toUpperCase();
                                    String rubro = com.oaxaca.util.ExcelUtil.getCellValue(row, 2);
                                    if (rubro != null)
                                        rubro = rubro.trim();
                                    String tipo = com.oaxaca.util.ExcelUtil.getCellValue(row, 3);
                                    if (tipo != null)
                                        tipo = tipo.trim();
                                    String clase = com.oaxaca.util.ExcelUtil.getCellValue(row, 4);
                                    if (clase != null)
                                        clase = clase.trim();
                                    String concepto = com.oaxaca.util.ExcelUtil.getCellValue(row, 5);
                                    if (concepto != null)
                                        concepto = concepto.trim();
                                    String nombreCol = com.oaxaca.util.ExcelUtil.getCellValue(row, 6);
                                    if (nombreCol != null)
                                        nombreCol = nombreCol.trim();
                                    String descripcion = com.oaxaca.util.ExcelUtil.getCellValue(row, 7);
                                    if (descripcion != null)
                                        descripcion = descripcion.trim();
                                    String inicioVigencia = com.oaxaca.util.ExcelUtil.getCellValue(row, 8);
                                    String finVigencia = com.oaxaca.util.ExcelUtil.getCellValue(row, 9);

                                    List<String> filaErrores = CatalogoValidacionUtil.validarFilaCri(
                                            fila, ejercicioCol, tipoRegistro, rubro, tipo, clase, concepto, nombreCol,
                                            descripcion, inicioVigencia, finVigencia, ejercicio);

                                    if (!filaErrores.isEmpty()) {
                                        List<BitacoraErroresUtil.BitacoraColumnaError> colErrores = new java.util.ArrayList<>();
                                        filaErrores.forEach(err -> colErrores
                                                .add(new BitacoraErroresUtil.BitacoraColumnaError(0, err)));
                                        erroresPorFila.add(new BitacoraErroresUtil.BitacoraFilaError(fila, colErrores));
                                    } else {
                                        CatalogoDeleteUtil.eliminarEjercicio(ejercicio, rubroRepo, tipoRepo, claseRepo,
                                                conceptoRepo);
                                        Date inicio = com.oaxaca.util.ExcelUtil.parseFecha(inicioVigencia);
                                        Date fin = com.oaxaca.util.ExcelUtil.parseFecha(finVigencia);
                                        Date alta = new Date();

                                        switch (tipoRegistro) {
                                            case "RUBRO": {
                                                var entidad = new com.oaxaca.entity.CatRubroCri(rubro, nombreCol,
                                                        descripcion, inicio, fin, ejercicio, alta);
                                                rubros.add(entidad);
                                                filaRubro.put(entidad, fila);
                                                break;
                                            }
                                            case "TIPO": {
                                                String claveCompuesta = rubro + "." + tipo;
                                                var rubroRef = rubroRepo.findByClaveAndEjercicio(rubro, ejercicio);
                                                var entidad = new com.oaxaca.entity.CatTipoCri(tipo, nombreCol,
                                                        descripcion,
                                                        rubroRef != null ? rubroRef.getId() : null, claveCompuesta,
                                                        inicio, fin, alta, ejercicio);
                                                tipos.add(entidad);
                                                filaTipo.put(entidad, fila);
                                                break;
                                            }
                                            case "CLASE": {
                                                String claveCompuesta = rubro + "." + tipo + "." + clase;
                                                var tipoRef = tipoRepo.findByClaveAndEjercicio(tipo, ejercicio);
                                                var entidad = new com.oaxaca.entity.CatClaseCri(clase, nombreCol,
                                                        descripcion,
                                                        tipoRef != null ? tipoRef.getId() : null, claveCompuesta,
                                                        inicio, fin, alta, ejercicio);
                                                clases.add(entidad);
                                                filaClase.put(entidad, fila);
                                                break;
                                            }
                                            case "CONCEPTO": {
                                                String claveCompuesta = rubro + "." + tipo + "." + clase + "."
                                                        + concepto;
                                                var claseRef = claseRepo.findByClaveAndEjercicio(clase, ejercicio);
                                                var entidad = new com.oaxaca.entity.CatConceptosCri(concepto, nombreCol,
                                                        descripcion,
                                                        claseRef != null ? claseRef.getId() : null, claveCompuesta,
                                                        inicio, fin, alta, ejercicio);
                                                conceptos.add(entidad);
                                                filaConcepto.put(entidad, fila);
                                                break;
                                            }
                                        }
                                    }
                                } catch (Exception e) {
                                    erroresPorFila.add(new BitacoraErroresUtil.BitacoraFilaError(fila,
                                            java.util.Arrays.asList(new BitacoraErroresUtil.BitacoraColumnaError(0,
                                                    "Error inesperado en la fila " + fila + ": " + e.getMessage()))));
                                }
                            });

                    try {
                        // Guardar Rubros
                        rubros.forEach(rubro -> {
                            int fila = filaRubro.getOrDefault(rubro, -1);
                            try {
                                var duplicado = rubroRepo.findByClaveAndEjercicio(rubro.getClave(),
                                        rubro.getEjercicio());
                                if (duplicado != null) {
                                    erroresPorFila.add(new BitacoraErroresUtil.BitacoraFilaError(fila,
                                            java.util.Arrays.asList(new BitacoraErroresUtil.BitacoraColumnaError(0,
                                                    "Rubro: '" + rubro.getClave() + "' ya existe para el ejercicio "
                                                            + rubro.getEjercicio()))));
                                } else {
                                    rubroRepo.save(rubro);
                                }
                            } catch (Exception ex) {
                                erroresPorFila.add(new BitacoraErroresUtil.BitacoraFilaError(fila,
                                        java.util.Arrays.asList(new BitacoraErroresUtil.BitacoraColumnaError(0,
                                                "Error al guardar Rubro '" + rubro.getClave() + "': "
                                                        + ex.getMessage()))));
                            }
                        });

                        // Guardar Tipos
                        tipos.forEach(tipo -> {
                            int fila = filaTipo.getOrDefault(tipo, -1);
                            try {
                                String rubroClave = obtenerClavePorNivel(tipo.getClaveCompuesta(), "RUBRO");
                                var rubroExistente = rubroRepo.findByClaveAndEjercicio(rubroClave, tipo.getEjercicio());
                                if (rubroExistente == null) {
                                    erroresPorFila.add(new BitacoraErroresUtil.BitacoraFilaError(fila,
                                            java.util.Arrays.asList(new BitacoraErroresUtil.BitacoraColumnaError(0,
                                                    "Tipo: El rubro '" + rubroClave + "' no existe para el ejercicio "
                                                            + tipo.getEjercicio()))));
                                } else {
                                    tipo.setIdRubro(rubroExistente.getId());
                                    var duplicado = tipoRepo.findByClaveAndIdRubroAndEjercicio(tipo.getClave(),
                                            rubroExistente.getId(), tipo.getEjercicio());
                                    if (duplicado != null) {
                                        erroresPorFila.add(new BitacoraErroresUtil.BitacoraFilaError(fila,
                                                java.util.Arrays.asList(new BitacoraErroresUtil.BitacoraColumnaError(0,
                                                        "Tipo: '" + tipo.getClave() + "' ya existe para el ejercicio "
                                                                + tipo.getEjercicio()))));
                                    } else {
                                        tipoRepo.save(tipo);
                                    }
                                }
                            } catch (Exception ex) {
                                erroresPorFila.add(new BitacoraErroresUtil.BitacoraFilaError(fila,
                                        java.util.Arrays.asList(new BitacoraErroresUtil.BitacoraColumnaError(0,
                                                "Error al guardar Tipo '" + tipo.getClave() + "': "
                                                        + ex.getMessage()))));
                            }
                        });

                        // Guardar Clases
                        clases.forEach(clase -> {
                            int fila = filaClase.getOrDefault(clase, -1);
                            try {
                                String tipoClave = obtenerClavePorNivel(clase.getClaveCompuesta(), "TIPO");
                                var tipoExistente = tipoRepo.findByClaveAndEjercicio(tipoClave, clase.getEjercicio());
                                if (tipoExistente == null) {
                                    erroresPorFila.add(new BitacoraErroresUtil.BitacoraFilaError(fila,
                                            java.util.Arrays.asList(new BitacoraErroresUtil.BitacoraColumnaError(0,
                                                    "Clase: El tipo '" + tipoClave + "' no existe para el ejercicio "
                                                            + clase.getEjercicio()))));
                                } else {
                                    clase.setIdTipo(tipoExistente.getId());
                                    var duplicada = claseRepo.findByClaveAndIdTipoAndEjercicio(clase.getClave(),
                                            tipoExistente.getId(), clase.getEjercicio());
                                    if (duplicada != null) {
                                        erroresPorFila.add(new BitacoraErroresUtil.BitacoraFilaError(fila,
                                                java.util.Arrays.asList(new BitacoraErroresUtil.BitacoraColumnaError(0,
                                                        "Clase: '" + clase.getClave() + "' ya existe para el ejercicio "
                                                                + clase.getEjercicio()))));
                                    } else {
                                        claseRepo.save(clase);
                                    }
                                }
                            } catch (Exception ex) {
                                erroresPorFila.add(new BitacoraErroresUtil.BitacoraFilaError(fila,
                                        java.util.Arrays.asList(new BitacoraErroresUtil.BitacoraColumnaError(0,
                                                "Error al guardar Clase '" + clase.getClave() + "': "
                                                        + ex.getMessage()))));
                            }
                        });

                        // Guardar Conceptos
                        conceptos.forEach(concepto -> {
                            int fila = filaConcepto.getOrDefault(concepto, -1);
                            try {
                                String claseClave = obtenerClavePorNivel(concepto.getClaveCompuesta(), "CLASE");
                                var claseExistente = claseRepo.findByClaveAndEjercicio(claseClave,
                                        concepto.getEjercicio());
                                if (claseExistente == null) {
                                    erroresPorFila.add(new BitacoraErroresUtil.BitacoraFilaError(fila,
                                            java.util.Arrays.asList(new BitacoraErroresUtil.BitacoraColumnaError(0,
                                                    "Concepto: La clase '" + claseClave
                                                            + "' no existe para el ejercicio "
                                                            + concepto.getEjercicio()))));
                                } else {
                                    concepto.setIdClase(claseExistente.getId());
                                    var duplicado = conceptoRepo.findByClaveAndIdClaseAndEjercicio(concepto.getClave(),
                                            claseExistente.getId(), concepto.getEjercicio());
                                    if (duplicado != null) {
                                        erroresPorFila.add(new BitacoraErroresUtil.BitacoraFilaError(fila,
                                                java.util.Arrays.asList(new BitacoraErroresUtil.BitacoraColumnaError(0,
                                                        "Concepto: '" + concepto.getClave()
                                                                + "' ya existe para el ejercicio "
                                                                + concepto.getEjercicio()))));
                                    } else {
                                        conceptoRepo.save(concepto);
                                    }
                                }
                            } catch (Exception ex) {
                                erroresPorFila.add(new BitacoraErroresUtil.BitacoraFilaError(fila,
                                        java.util.Arrays.asList(new BitacoraErroresUtil.BitacoraColumnaError(0,
                                                "Error al guardar Concepto '" + concepto.getClave() + "': "
                                                        + ex.getMessage()))));
                            }
                        });

                    } catch (Exception e) {
                        erroresGenerales.add(MensajesConstantes.ERROR_GUARDAR_REGISTROS + e.getMessage());
                    }

                } catch (Exception e) {
                    erroresGenerales.add(MensajesConstantes.ERROR_PROCESAR_ARCHIVO + e.getMessage());
                }
            } else {
                erroresGenerales.add(MensajesConstantes.ERROR_SOLO_XLSX);
            }
        }

        if (!erroresGenerales.isEmpty() || !erroresPorFila.isEmpty()) {
            String fecha = new SimpleDateFormat("yyyyMMdd_HHmmss").format(new Date());
            String nombreBitacora = "bitacora_errores_" + fecha + ".txt";
            try {
                String ruta = BitacoraErroresUtil.generarBitacoraTxt(erroresGenerales, erroresPorFila, nombreBitacora);
                return ruta;
            } catch (Exception e) {
                return MensajesConstantes.ERROR_GENERAR_BITACORA + e.getMessage();
            }
        }

        return MensajesConstantes.OK;
    }

    public static String obtenerClavePorNivel(String claveCompuesta, String nivel) {
        if (claveCompuesta == null || claveCompuesta.isEmpty()) {
            return null;
        }

        String[] partes = claveCompuesta.split("\\.");

        switch (nivel.toUpperCase()) {
            case "RUBRO": // primer elemento
                return partes.length >= 1 ? partes[0] : null;
            case "TIPO": // segundo elemento
                return partes.length >= 2 ? partes[1] : null;
            case "CLASE": // tercer elemento
                return partes.length >= 3 ? partes[2] : null;
            case "CONCEPTO": // cuarto elemento
                return partes.length >= 4 ? partes[3] : null;
            default:
                return null;
        }
    }
}
