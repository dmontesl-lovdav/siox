package com.oaxaca.service;

import com.oaxaca.entity.CatSubCuentaConac;

public interface ICatSubCuentaConacService {

    CatSubCuentaConac insertarSubcuenta(String clave, String descripcion, Integer ejercicio, Integer idGenero,
            Integer idGrupo, Integer idRubro, Integer idCuenta);

    CatSubCuentaConac updateSubcuenta(Integer id, String descripcion);

    Object findAllByEjercicio(Integer ejercicio, Integer idCuenta);

}
