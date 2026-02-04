package com.oaxaca.service;

import java.util.Optional;

import com.oaxaca.entity.CatTipoCri;

public interface ICatTipoCriService {
    CatTipoCri insertTipoCri(String clave, String nombre, String descripcion, Integer idRubro, Integer ejercicio);

    CatTipoCri updateTipoCri(Integer id, String nombre, String descripcion);

    Optional<CatTipoCri> findById(Integer id);

    java.util.List<CatTipoCri> findAllByEjercicioAndIdRubro(Integer ejercicio, Integer idRubro);
}
