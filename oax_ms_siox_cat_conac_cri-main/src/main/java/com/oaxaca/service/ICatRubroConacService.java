package com.oaxaca.service;

import java.util.List;

import com.oaxaca.entity.CatRubroConac;

public interface ICatRubroConacService {

    CatRubroConac insertarRubro(String clave, String descripcion, Integer ejercicio, Integer idGrupo, Integer idGenero);

    CatRubroConac updateRubro(Integer id, String descripcion);

    List<CatRubroConac> findAllByEjercicio(Integer ejercicio, Integer idGrupo);

}
