package com.oaxaca.util;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.apache.poi.ss.usermodel.Row;

import com.oaxaca.entity.CatClaseCri;
import com.oaxaca.entity.CatConceptosCri;
import com.oaxaca.entity.CatRubroCri;
import com.oaxaca.entity.CatTipoCri;
import com.oaxaca.repository.CatClaseCriRepository;
import com.oaxaca.repository.CatConceptosCriRepository;
import com.oaxaca.repository.CatRubroCriRepository;
import com.oaxaca.repository.CatTipoCriRepository;

public class CatalogoProcesaUtil {
    public static List<String> procesarFila(Row row, Integer ejercicio,
            CatRubroCriRepository rubroRepo,
            CatTipoCriRepository tipoRepo,
            CatClaseCriRepository claseRepo,
            CatConceptosCriRepository conceptoRepo) {
        List<String> errores = new ArrayList<>();
        String ejercicioCol = ExcelUtil.getCellValue(row, 0);
        String tipoRegistro = ExcelUtil.getCellValue(row, 1);
        String rubro = ExcelUtil.getCellValue(row, 2);
        String tipo = ExcelUtil.getCellValue(row, 3);
        String clase = ExcelUtil.getCellValue(row, 4);
        String concepto = ExcelUtil.getCellValue(row, 5);
        String nombreCol = ExcelUtil.getCellValue(row, 6);
        String descripcion = ExcelUtil.getCellValue(row, 7);
        String inicioVigencia = ExcelUtil.getCellValue(row, 8);
        String finVigencia = ExcelUtil.getCellValue(row, 9);
        int fila = row.getRowNum() + 1;

        List<String> erroresFila = CatalogoValidacionUtil.validarFilaCri(
                fila, ejercicioCol, tipoRegistro, rubro, tipo, clase, concepto, nombreCol, descripcion, inicioVigencia,
                finVigencia, ejercicio);
        errores.addAll(erroresFila);
        if (erroresFila.isEmpty()) {
            Date inicio = ExcelUtil.parseFecha(inicioVigencia);
            Date fin = ExcelUtil.parseFecha(finVigencia);
            Date alta = new Date();
            String claveCompuesta = rubro + tipo + clase + concepto;
            switch (tipoRegistro.toUpperCase()) {
                case "RUBRO":
                    CatRubroCri rubroEntity = new CatRubroCri(rubro, nombreCol, descripcion, inicio,
                            fin, ejercicio, alta);
                    rubroRepo.save(rubroEntity);
                    break;
                case "TIPO":
                    CatRubroCri rubroRef = rubroRepo.findByClave(rubro);
                    CatTipoCri tipoEntity = new CatTipoCri(tipo, nombreCol, descripcion,
                            rubroRef != null ? (Integer) rubroRef.getId() : null, claveCompuesta,
                            inicio,
                            fin, alta, ejercicio);
                    tipoRepo.save(tipoEntity);
                    break;
                case "CLASE":
                    CatTipoCri tipoRef = tipoRepo.findByClave(tipo);
                    CatClaseCri claseEntity = new CatClaseCri(clase, nombreCol, descripcion,
                            tipoRef != null ? tipoRef.getId() : null, claveCompuesta, inicio, fin,
                            alta, ejercicio);
                    claseRepo.save(claseEntity);
                    break;
                case "CONCEPTO": {
                    List<CatClaseCri> clasesRef = claseRepo.findAllByClave(clase);
                    clasesRef.forEach(claseRef -> {
                        claseRef.setInicioVigencia(inicio);
                        claseRef.setFinVigencia(fin);
                        claseRepo.save(claseRef);
                    });
                    tipoRepo.findAllByClave(tipo).forEach(tipoRefUpd -> {
                        tipoRefUpd.setInicioVigencia(inicio);
                        tipoRefUpd.setFinVigencia(fin);
                        tipoRepo.save(tipoRefUpd);
                    });
                    rubroRepo.findAllByClave(rubro).forEach(rubroRefUpd -> {
                        rubroRefUpd.setInicioVigencia(inicio);
                        rubroRefUpd.setFinVigencia(fin);
                        rubroRepo.save(rubroRefUpd);
                    });
                    CatConceptosCri conceptoEntity = new CatConceptosCri(concepto, nombreCol,
                            descripcion, !clasesRef.isEmpty() ? clasesRef.get(0).getId() : null,
                            claveCompuesta, inicio, fin, alta, ejercicio);
                    conceptoRepo.save(conceptoEntity);
                    break;
                }
            }
        }
        return errores;
    }
}
