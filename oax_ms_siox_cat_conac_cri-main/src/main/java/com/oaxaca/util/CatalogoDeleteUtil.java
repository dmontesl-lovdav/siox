package com.oaxaca.util;

import com.oaxaca.entity.CatClaseCri;
import com.oaxaca.entity.CatConceptosCri;
import com.oaxaca.entity.CatRubroCri;
import com.oaxaca.entity.CatTipoCri;
import com.oaxaca.repository.CatClaseCriRepository;
import com.oaxaca.repository.CatConceptosCriRepository;
import com.oaxaca.repository.CatRubroCriRepository;
import com.oaxaca.repository.CatTipoCriRepository;
import java.util.List;

public class CatalogoDeleteUtil {
    public static void eliminarEjercicio(
            Integer ejercicio,
            CatRubroCriRepository rubroRepo,
            CatTipoCriRepository tipoRepo,
            CatClaseCriRepository claseRepo,
            CatConceptosCriRepository conceptoRepo) {
        List<CatRubroCri> rubrosEjercicio = rubroRepo.findAll().stream()
                .filter(r -> ejercicio.equals(r.getEjercicio()))
                .toList();
        rubrosEjercicio.forEach(rubro -> {
            List<CatTipoCri> tipos = tipoRepo.findAll().stream()
                    .filter(t -> rubro.getId().equals(t.getIdRubro()))
                    .toList();
            tipos.forEach(tipo -> {
                List<CatClaseCri> clases = claseRepo.findAll().stream()
                        .filter(c -> tipo.getId().equals(c.getIdTipo()))
                        .toList();
                clases.forEach(clase -> {
                    List<CatConceptosCri> conceptos = conceptoRepo.findAll().stream()
                            .filter(con -> clase.getId().equals(con.getIdClase()))
                            .toList();
                    conceptoRepo.deleteAll(conceptos);
                    claseRepo.delete(clase);
                });
                tipoRepo.delete(tipo);
            });
            rubroRepo.delete(rubro);
        });
    }
}
