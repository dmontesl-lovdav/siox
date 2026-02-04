package com.oaxaca.service;

import com.oaxaca.entity.CatGrupoConac;

public interface ICatGrupoConacService {

    public CatGrupoConac insertarGrupo(String clave, String descripcion, Integer ejercicio, Integer idGenero);

    public CatGrupoConac updateGrupo(Integer id, String descripcion);

    public Object findAllByEjercicio(Integer ejercicio, Integer idGenero);

}
