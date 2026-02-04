package com.oaxaca.service;

import java.util.Optional;

import com.oaxaca.entity.CatRubroCri;

public interface ICatRubroCriService {
    CatRubroCri insertRubroCri(String clave, String nombre, String descripcion, Integer ejercicio);

    CatRubroCri updateRubroCri(Integer id, String nombre, String descripcion);

    Optional<CatRubroCri> findById(Integer id);

    java.util.List<CatRubroCri> findAllByEjercicio(Integer ejercicio);
}
