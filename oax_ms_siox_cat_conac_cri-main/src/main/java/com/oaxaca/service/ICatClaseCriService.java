package com.oaxaca.service;

import java.util.Optional;

import com.oaxaca.entity.CatClaseCri;

public interface ICatClaseCriService {
        CatClaseCri insertClaseCri(String clave, String nombre, String descripcion, Integer idTipo, Integer idRubro,
                        Integer ejercicio);

        CatClaseCri updateClaseCri(Integer id, String nombre, String descripcion);

        Optional<CatClaseCri> findById(Integer id);

        java.util.List<CatClaseCri> findAllByEjercicioAndIdTipo(Integer ejercicio, Integer idTipo);
}
