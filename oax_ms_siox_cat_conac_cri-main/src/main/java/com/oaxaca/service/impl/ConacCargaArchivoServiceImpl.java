package com.oaxaca.service.impl;

import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.oaxaca.entity.CatCuentaConac;
import com.oaxaca.entity.CatDatosCuentaConac;
import com.oaxaca.entity.CatEstadoFinanciero;
import com.oaxaca.entity.CatEstructura;
import com.oaxaca.entity.CatGeneroConac;
import com.oaxaca.entity.CatGrupoConac;
import com.oaxaca.entity.CatNaturaleza;
import com.oaxaca.entity.CatPosicion;
import com.oaxaca.entity.CatRubroConac;
import com.oaxaca.entity.CatSubCuentaConac;
import com.oaxaca.repository.CatCuentaConacRepository;
import com.oaxaca.repository.CatDatosCuentaConacRepository;
import com.oaxaca.repository.CatEstadoFinancieroRepository;
import com.oaxaca.repository.CatEstructuraRepository;
import com.oaxaca.repository.CatGeneroConacRepository;
import com.oaxaca.repository.CatGrupoConacRepository;
import com.oaxaca.repository.CatNaturalezaRepository;
import com.oaxaca.repository.CatPosicionRepository;
import com.oaxaca.repository.CatRubroConacRepository;
import com.oaxaca.repository.CatSubCuentaConacRepository;
import com.oaxaca.service.IConacCargaArchivoService;
import com.oaxaca.util.BitacoraErroresUtil;
import com.oaxaca.util.CatalogoValidacionUtil;
import com.oaxaca.util.MensajesConstantes;

import lombok.extern.slf4j.Slf4j;

@Service
@Transactional
@Slf4j
public class ConacCargaArchivoServiceImpl implements IConacCargaArchivoService {

        @Autowired
        private CatGeneroConacRepository generoRepo;
        @Autowired
        private CatGrupoConacRepository grupoRepo;
        @Autowired
        private CatRubroConacRepository rubroRepo;
        @Autowired
        private CatCuentaConacRepository cuentaRepo;
        @Autowired
        private CatSubCuentaConacRepository subcuentaRepo;
        @Autowired
        private CatDatosCuentaConacRepository datosCuentaRepo;
        @Autowired
        private CatNaturalezaRepository naturalezaRepo;
        @Autowired
        private CatEstadoFinancieroRepository estadoFinancieroRepo;
        @Autowired
        private CatEstructuraRepository estructuraRepo;
        @Autowired
        private CatPosicionRepository posicionRepo;

        @Override
        @Transactional
        public Object validarArchivo(MultipartFile archivo, Integer ejercicio) {
                List<String> erroresGenerales = new ArrayList<>();
                List<BitacoraErroresUtil.BitacoraFilaError> erroresPorFila = new ArrayList<>();
                List<Runnable> operacionesPendientes = new ArrayList<>();
                Date fechaAlta = new Date();

                if (archivo == null || archivo.isEmpty()) {
                        erroresGenerales.add(MensajesConstantes.ERROR_ARCHIVO_VACIO);
                } else {
                        String nombre = archivo.getOriginalFilename();
                        if (nombre == null) {
                                erroresGenerales.add(MensajesConstantes.ERROR_ARCHIVO_SIN_NOMBRE);
                        } else if (nombre.endsWith(".xlsx")) {
                                try (InputStream is = archivo.getInputStream();
                                                Workbook workbook = new XSSFWorkbook(is)) {

                                        Sheet sheet = workbook.getSheetAt(0);

                                        IntStream.range(1, sheet.getPhysicalNumberOfRows())
                                                        .mapToObj(sheet::getRow)
                                                        .filter(Objects::nonNull)
                                                        .forEach(row -> {
                                                                int fila = row.getRowNum() + 1;
                                                                String ejercicioCol = com.oaxaca.util.ExcelUtil
                                                                                .getCellValue(row, 0);
                                                                String tipoRegistro = com.oaxaca.util.ExcelUtil
                                                                                .getCellValue(row, 1).toUpperCase();
                                                                String genero = trim(com.oaxaca.util.ExcelUtil
                                                                                .getCellValue(row, 2));
                                                                String grupo = trim(com.oaxaca.util.ExcelUtil
                                                                                .getCellValue(row, 3));
                                                                String rubro = trim(com.oaxaca.util.ExcelUtil
                                                                                .getCellValue(row, 4));
                                                                String cuenta = trim(com.oaxaca.util.ExcelUtil
                                                                                .getCellValue(row, 5));
                                                                String subcuenta = trim(com.oaxaca.util.ExcelUtil
                                                                                .getCellValue(row, 6));
                                                                String descripcion = trim(com.oaxaca.util.ExcelUtil
                                                                                .getCellValue(row, 7));
                                                                String naturaleza = trim(com.oaxaca.util.ExcelUtil
                                                                                .getCellValue(row, 8));
                                                                String estadoFinaciero = trim(com.oaxaca.util.ExcelUtil
                                                                                .getCellValue(row, 9));
                                                                String pocisionFinanciera = trim(
                                                                                com.oaxaca.util.ExcelUtil
                                                                                                .getCellValue(row, 10));
                                                                String estructura = trim(com.oaxaca.util.ExcelUtil
                                                                                .getCellValue(row, 11));
                                                                String inicioVigencia = com.oaxaca.util.ExcelUtil
                                                                                .getCellValue(row, 12);
                                                                String finVigencia = com.oaxaca.util.ExcelUtil
                                                                                .getCellValue(row, 13);

                                                                List<String> filaErrores = CatalogoValidacionUtil
                                                                                .validarFilaConac(
                                                                                                fila, ejercicioCol,
                                                                                                tipoRegistro, genero,
                                                                                                grupo, rubro, cuenta,
                                                                                                subcuenta, descripcion,
                                                                                                naturaleza,
                                                                                                estadoFinaciero,
                                                                                                pocisionFinanciera,
                                                                                                estructura,
                                                                                                inicioVigencia,
                                                                                                finVigencia, ejercicio);

                                                                if (!filaErrores.isEmpty()) {
                                                                        List<BitacoraErroresUtil.BitacoraColumnaError> colErrores = filaErrores
                                                                                        .stream()
                                                                                        .map(err -> new BitacoraErroresUtil.BitacoraColumnaError(
                                                                                                        0, err))
                                                                                        .collect(Collectors.toList());
                                                                        erroresPorFila.add(
                                                                                        new BitacoraErroresUtil.BitacoraFilaError(
                                                                                                        fila,
                                                                                                        colErrores));
                                                                        return;
                                                                }

                                                                Date inicio = com.oaxaca.util.ExcelUtil
                                                                                .parseFecha(inicioVigencia);
                                                                Date fin = com.oaxaca.util.ExcelUtil
                                                                                .parseFecha(finVigencia);

                                                                operacionesPendientes.add(() -> {
                                                                        try {
                                                                                procesarRegistro(tipoRegistro, fila,
                                                                                                genero, grupo, rubro,
                                                                                                cuenta, subcuenta,
                                                                                                descripcion, naturaleza,
                                                                                                estadoFinaciero,
                                                                                                pocisionFinanciera,
                                                                                                estructura, ejercicio,
                                                                                                fechaAlta, inicio, fin,
                                                                                                erroresPorFila);
                                                                        } catch (Exception ex) {
                                                                                log.error("Error en fila {}: {}", fila,
                                                                                                ex.getMessage(), ex);
                                                                                List<BitacoraErroresUtil.BitacoraColumnaError> col = List
                                                                                                .of(
                                                                                                                new BitacoraErroresUtil.BitacoraColumnaError(
                                                                                                                                0,
                                                                                                                                "Error al procesar: "
                                                                                                                                                + ex.getMessage()));
                                                                                erroresPorFila.add(
                                                                                                new BitacoraErroresUtil.BitacoraFilaError(
                                                                                                                fila,
                                                                                                                col));
                                                                        }
                                                                });
                                                        });

                                } catch (Exception e) {
                                        erroresGenerales.add(
                                                        MensajesConstantes.ERROR_PROCESAR_ARCHIVO + e.getMessage());
                                }

                        } else {
                                erroresGenerales.add(MensajesConstantes.ERROR_SOLO_XLSX);
                        }
                }

                // ⚠️ Si hay errores: generar bitácora y salir SIN eliminar ni guardar
                if (!erroresGenerales.isEmpty() || !erroresPorFila.isEmpty()) {
                        String fecha = new SimpleDateFormat("yyyyMMdd_HHmmss").format(new Date());
                        String nombreBitacora = "bitacora_errores_" + fecha + ".txt";
                        try {
                                String ruta = BitacoraErroresUtil.generarBitacoraTxt(
                                                erroresGenerales, erroresPorFila, nombreBitacora);
                                log.info("Bitácora generada en: {}", ruta);
                                return ruta;
                        } catch (Exception e) {
                                return MensajesConstantes.ERROR_GENERAR_BITACORA + e.getMessage();
                        }
                }

                // ✅ Sin errores: eliminar todo y guardar nuevos datos
                eliminarRegistrosPorEjercicio(ejercicio);
                operacionesPendientes.forEach(Runnable::run);

                return MensajesConstantes.OK;
        }

        private String trim(String v) {
                return v != null ? v.trim() : null;
        }

        private void procesarRegistro(String tipo, int fila, String genero, String grupo, String rubro, String cuenta,
                        String subcuenta, String descripcion, String naturaleza, String estadoFinaciero,
                        String pocisionFinanciera, String estructura, Integer ejercicio, Date fechaAlta,
                        Date inicio, Date fin, List<BitacoraErroresUtil.BitacoraFilaError> errores) {

                switch (tipo) {
                        case "GENERO" -> {
                                log.info("[GENERO] Buscando generoRepo.findByClaveAndEjercicio con clave='{}', ejercicio={}",
                                                genero, ejercicio);
                                if (generoRepo.findByClaveAndEjercicio(genero, ejercicio) != null) {
                                        errores.add(new BitacoraErroresUtil.BitacoraFilaError(fila,
                                                        List.of(new BitacoraErroresUtil.BitacoraColumnaError(0,
                                                                        "GENERO: Ya existe el género '" + genero
                                                                                        + "'."))));
                                        return;
                                }
                                CatGeneroConac ent = new CatGeneroConac(genero, descripcion, ejercicio, fechaAlta);
                                Integer id = generoRepo.save(ent).getId();
                                datosCuentaRepo.save(new CatDatosCuentaConac(null, null, null, null, id, null, null,
                                                null, null, inicio, fin, ejercicio));
                        }

                        case "GRUPO" -> {
                                log.info("[GRUPO] Buscando generoRepo.findByClaveAndEjercicio con clave='{}', ejercicio={}",
                                                genero, ejercicio);
                                CatGeneroConac gen = generoRepo.findByClaveAndEjercicio(genero, ejercicio);
                                if (gen == null) {
                                        errores.add(new BitacoraErroresUtil.BitacoraFilaError(fila,
                                                        List.of(new BitacoraErroresUtil.BitacoraColumnaError(0,
                                                                        "GENERO: No existe '" + genero + "'."))));
                                        return;
                                }
                                String clave = genero + "." + grupo;
                                log.info("[GRUPO] Buscando grupoRepo.findByClaveCompuestaAndEjercicio con clave='{}', ejercicio={}",
                                                clave, ejercicio);
                                if (grupoRepo.findByClaveCompuestaAndEjercicio(clave, ejercicio) != null) {
                                        errores.add(new BitacoraErroresUtil.BitacoraFilaError(fila,
                                                        List.of(new BitacoraErroresUtil.BitacoraColumnaError(0,
                                                                        "GRUPO: Ya existe '" + clave + "'."))));
                                        return;
                                }
                                CatGrupoConac g = new CatGrupoConac(genero, descripcion, clave, 0, ejercicio,
                                                fechaAlta);
                                g.setIdgenero(gen.getId());
                                Integer id = grupoRepo.save(g).getId();
                                datosCuentaRepo.save(new CatDatosCuentaConac(null, null, null, null, null, id, null,
                                                null, null, inicio, fin, ejercicio));
                        }

                        case "RUBRO" -> {
                                log.info("[RUBRO] Buscando grupoRepo.findByClaveAndEjercicio con clave='{}', ejercicio={}",
                                                grupo, ejercicio);
                                CatGrupoConac gr = grupoRepo.findByClaveAndEjercicio(grupo, ejercicio);
                                if (gr == null) {
                                        errores.add(new BitacoraErroresUtil.BitacoraFilaError(fila,
                                                        List.of(new BitacoraErroresUtil.BitacoraColumnaError(0,
                                                                        "GRUPO: No existe '" + grupo + "'."))));
                                        return;
                                }
                                String clave = genero + "." + grupo + "." + rubro;
                                log.info("[RUBRO] Buscando rubroRepo.findByClaveCompuestaAndEjercicio con clave='{}', ejercicio={}",
                                                clave, ejercicio);
                                if (rubroRepo.findByClaveCompuestaAndEjercicio(clave, ejercicio) != null) {
                                        errores.add(new BitacoraErroresUtil.BitacoraFilaError(fila,
                                                        List.of(new BitacoraErroresUtil.BitacoraColumnaError(0,
                                                                        "RUBRO: Ya existe '" + clave + "'."))));
                                        return;
                                }
                                CatRubroConac r = new CatRubroConac(rubro, descripcion, clave, 0, ejercicio, fechaAlta);
                                r.setIdGrupo(gr.getId());
                                Integer id = rubroRepo.save(r).getId();
                                datosCuentaRepo.save(new CatDatosCuentaConac(null, null, null, null, null, null, id,
                                                null, null, inicio, fin, ejercicio));
                        }

                        case "CUENTA" -> {
                                log.info("[CUENTA] Buscando rubroRepo.findByClaveAndEjercicio con clave='{}', ejercicio={}",
                                                rubro, ejercicio);
                                CatRubroConac ru = rubroRepo.findByClaveAndEjercicio(rubro, ejercicio);
                                if (ru == null) {
                                        errores.add(new BitacoraErroresUtil.BitacoraFilaError(fila,
                                                        List.of(new BitacoraErroresUtil.BitacoraColumnaError(0,
                                                                        "RUBRO: No existe '" + rubro + "'."))));
                                        return;
                                }
                                String clave = genero + "." + grupo + "." + rubro + "." + cuenta;
                                log.info("[CUENTA] Buscando cuentaRepo.findByClaveCompuestaAndEjercicio con clave='{}', ejercicio={}",
                                                clave, ejercicio);
                                if (cuentaRepo.findByClaveCompuestaAndEjercicio(clave, ejercicio) != null) {
                                        errores.add(new BitacoraErroresUtil.BitacoraFilaError(fila,
                                                        List.of(new BitacoraErroresUtil.BitacoraColumnaError(0,
                                                                        "CUENTA: Ya existe '" + clave + "'."))));
                                        return;
                                }
                                CatCuentaConac c = new CatCuentaConac(cuenta, descripcion, clave, 0, ejercicio,
                                                fechaAlta);
                                c.setIdRubro(ru.getId());
                                Integer id = cuentaRepo.save(c).getId();
                                datosCuentaRepo.save(new CatDatosCuentaConac(null, null, null, null, null, null, null,
                                                id, null, inicio, fin, ejercicio));
                        }

                        case "SUBCUENTA" -> {
                                String claveCuenta = genero + "." + grupo + "." + rubro + "." + cuenta;
                                log.info("[SUBCUENTA] Buscando cuentaRepo.findByClaveCompuestaAndEjercicio con clave='{}', ejercicio={}",
                                                claveCuenta, ejercicio);
                                CatCuentaConac cu = cuentaRepo.findByClaveCompuestaAndEjercicio(claveCuenta,
                                                ejercicio);
                                if (cu == null) {
                                        errores.add(new BitacoraErroresUtil.BitacoraFilaError(fila,
                                                        List.of(new BitacoraErroresUtil.BitacoraColumnaError(0,
                                                                        "CUENTA: No existe '" + cuenta + "'."))));
                                        return;
                                }

                                String clave = genero + "." + grupo + "." + rubro + "." + cuenta + "." + subcuenta;
                                log.info("[SUBCUENTA] Buscando subcuentaRepo.findByClaveCompuestaAndEjercicio con clave='{}', ejercicio={}",
                                                clave, ejercicio);
                                if (subcuentaRepo.findByClaveCompuestaAndEjercicio(clave, ejercicio) != null) {
                                        errores.add(new BitacoraErroresUtil.BitacoraFilaError(fila,
                                                        List.of(new BitacoraErroresUtil.BitacoraColumnaError(0,
                                                                        "SUBCUENTA: Ya existe '" + clave + "'."))));
                                        return;
                                }

                                log.info("[SUBCUENTA] Buscando naturalezaRepo.findBySufijo con sufijo='{}'",
                                                naturaleza);
                                CatNaturaleza natu = naturalezaRepo.findBySufijo(naturaleza);
                                log.info("[SUBCUENTA] Buscando estadoFinancieroRepo.findBySufijo con sufijo='{}'",
                                                estadoFinaciero);
                                CatEstadoFinanciero efin = estadoFinancieroRepo.findBySufijo(estadoFinaciero);
                                log.info("[SUBCUENTA] Buscando posicionRepo.findBySufijo con sufijo='{}'",
                                                pocisionFinanciera);
                                CatPosicion pfin = posicionRepo.findBySufijo(pocisionFinanciera);
                                log.info("[SUBCUENTA] Buscando estructuraRepo.findBySufijo con sufijo='{}'",
                                                estructura);
                                CatEstructura estr = estructuraRepo.findBySufijo(estructura);

                                if (natu == null || efin == null || pfin == null || estr == null) {
                                        errores.add(new BitacoraErroresUtil.BitacoraFilaError(fila,
                                                        List.of(new BitacoraErroresUtil.BitacoraColumnaError(0,
                                                                        "CATÁLOGOS: Alguno de los catálogos (Naturaleza, Estado Financiero, Posición, Estructura) no existe."))));
                                        return;
                                }

                                CatSubCuentaConac s = new CatSubCuentaConac(subcuenta, descripcion, clave, 0, ejercicio,
                                                fechaAlta);
                                s.setIdCuenta(cu.getId());
                                Integer id = subcuentaRepo.save(s).getId();
                                datosCuentaRepo.save(new CatDatosCuentaConac(
                                                natu.getId(), efin.getId(), pfin.getId(), estr.getId(),
                                                null, null, null, null, id, inicio, fin, ejercicio));

                                CatGeneroConac gen = generoRepo.findByClaveAndEjercicio(genero, ejercicio);
                                CatGrupoConac gru = grupoRepo.findByClaveAndEjercicio(grupo, ejercicio);
                                CatRubroConac rub = rubroRepo.findByClaveAndEjercicio(rubro, ejercicio);
                                CatCuentaConac cue = cuentaRepo.findByClaveAndEjercicio(cuenta, ejercicio);

                                List<CatDatosCuentaConac> dgeneroList = datosCuentaRepo.findByIdGenero(gen.getId());
                                if (dgeneroList != null && !dgeneroList.isEmpty()) {
                                        dgeneroList.forEach(dgenero -> {
                                                if (dgenero.getInicioVigencia() == null
                                                                || dgenero.getFinVigencia() == null
                                                                || dgenero.getIdNaturaleza() == null ||
                                                                dgenero.getIdEstadoFinanciero() == null
                                                                || dgenero.getIdPosicion() == null) {
                                                        dgenero.setInicioVigencia(inicio);
                                                        dgenero.setFinVigencia(fin);
                                                        dgenero.setIdNaturaleza(natu.getId());
                                                        dgenero.setIdEstadoFinanciero(efin.getId());
                                                        dgenero.setIdPosicion(pfin.getId());
                                                        datosCuentaRepo.save(dgenero);
                                                }
                                        });
                                }

                                List<CatDatosCuentaConac> dgrupoList = datosCuentaRepo.findByIdGrupo(gru.getId());
                                if (dgrupoList != null && !dgrupoList.isEmpty()) {
                                        dgrupoList.forEach(dgrupo -> {
                                                if (dgrupo.getInicioVigencia() == null
                                                                || dgrupo.getFinVigencia() == null
                                                                || dgrupo.getIdNaturaleza() == null ||
                                                                dgrupo.getIdEstadoFinanciero() == null
                                                                || dgrupo.getIdPosicion() == null) {
                                                        dgrupo.setInicioVigencia(inicio);
                                                        dgrupo.setFinVigencia(fin);
                                                        dgrupo.setIdNaturaleza(natu.getId());
                                                        dgrupo.setIdEstadoFinanciero(efin.getId());
                                                        dgrupo.setIdPosicion(pfin.getId());
                                                        datosCuentaRepo.save(dgrupo);
                                                }
                                        });
                                }

                                List<CatDatosCuentaConac> drubroList = datosCuentaRepo.findByIdRubro(rub.getId());
                                if (drubroList != null && !drubroList.isEmpty()) {
                                        drubroList.forEach(drubro -> {
                                                if (drubro.getInicioVigencia() == null
                                                                || drubro.getFinVigencia() == null
                                                                || drubro.getIdNaturaleza() == null ||
                                                                drubro.getIdEstadoFinanciero() == null
                                                                || drubro.getIdPosicion() == null) {
                                                        drubro.setInicioVigencia(inicio);
                                                        drubro.setFinVigencia(fin);
                                                        drubro.setIdNaturaleza(natu.getId());
                                                        drubro.setIdEstadoFinanciero(efin.getId());
                                                        drubro.setIdPosicion(pfin.getId());
                                                        datosCuentaRepo.save(drubro);
                                                }
                                        });
                                }

                                List<CatDatosCuentaConac> dcuentaList = datosCuentaRepo.findByIdCuenta(cue.getId());
                                if (dcuentaList != null && !dcuentaList.isEmpty()) {
                                        dcuentaList.forEach(dcuenta -> {
                                                if (dcuenta.getInicioVigencia() == null
                                                                || dcuenta.getFinVigencia() == null
                                                                || dcuenta.getIdNaturaleza() == null ||
                                                                dcuenta.getIdEstadoFinanciero() == null
                                                                || dcuenta.getIdPosicion() == null) {
                                                        dcuenta.setInicioVigencia(inicio);
                                                        dcuenta.setFinVigencia(fin);
                                                        dcuenta.setIdNaturaleza(natu.getId());
                                                        dcuenta.setIdEstadoFinanciero(efin.getId());
                                                        dcuenta.setIdPosicion(pfin.getId());
                                                        datosCuentaRepo.save(dcuenta);
                                                }
                                        });
                                }
                        }
                }
        }

        @Transactional
        public int eliminarRegistrosPorEjercicio(Integer ejercicio) {
                int total = 0;
                List<CatDatosCuentaConac> datos = datosCuentaRepo.findByEjercicio(ejercicio);
                if (!datos.isEmpty()) {
                        datosCuentaRepo.deleteAll(datos);
                        total += datos.size();
                }

                List<CatSubCuentaConac> sub = subcuentaRepo.findAll().stream()
                                .filter(s -> ejercicio.equals(s.getEjercicio())).collect(Collectors.toList());
                if (!sub.isEmpty()) {
                        subcuentaRepo.deleteAll(sub);
                        total += sub.size();
                }

                List<CatCuentaConac> cue = cuentaRepo.findAll().stream()
                                .filter(s -> ejercicio.equals(s.getEjercicio())).collect(Collectors.toList());
                if (!cue.isEmpty()) {
                        cuentaRepo.deleteAll(cue);
                        total += cue.size();
                }

                List<CatRubroConac> rub = rubroRepo.findAll().stream()
                                .filter(s -> ejercicio.equals(s.getEjercicio())).collect(Collectors.toList());
                if (!rub.isEmpty()) {
                        rubroRepo.deleteAll(rub);
                        total += rub.size();
                }

                List<CatGrupoConac> gru = grupoRepo.findAll().stream()
                                .filter(s -> ejercicio.equals(s.getEjercicio())).collect(Collectors.toList());
                if (!gru.isEmpty()) {
                        grupoRepo.deleteAll(gru);
                        total += gru.size();
                }

                List<CatGeneroConac> gen = generoRepo.findAll().stream()
                                .filter(s -> ejercicio.equals(s.getEjercicio())).collect(Collectors.toList());
                if (!gen.isEmpty()) {
                        generoRepo.deleteAll(gen);
                        total += gen.size();
                }

                log.info("Total de registros eliminados para el ejercicio {}: {}", ejercicio, total);
                return total;
        }
}
