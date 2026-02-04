package com.oaxaca.service;

import com.oaxaca.entity.CatCuentaConac;

public interface ICatCuentaConacService {

    CatCuentaConac insertarCuenta(String clave, String descripcion, Integer ejercicio, Integer idGenero,
            Integer idGrupo,
            Integer idRubro);

    CatCuentaConac updateCuenta(Integer id, String descripcion);

    Object findAllByEjercicio(Integer ejercicio, Integer idRubro);

}
