
package com.oaxaca.service;

import java.util.Date;
import java.util.Optional;

import com.oaxaca.entity.CatConceptosCri;

public interface ICatConceptosCriService {
        CatConceptosCri insertConceptoCri(String clave, String nombre, String descripcion, Integer idRubro,
                        Integer idTipo,
                        Integer idClase, Date inicioVigencia, Date finVigencia, Integer ejercicio);

        CatConceptosCri updateConceptoCri(Integer id, String nombre, String descripcion, Integer idClase,
                        Date inicioVigencia, Date finVigencia);

        Optional<CatConceptosCri> findById(Integer id);

        java.util.List<CatConceptosCri> findAllByEjercicioAndIdClase(Integer ejercicio, Integer idClase);
}
