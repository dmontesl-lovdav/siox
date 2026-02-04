package com.oaxaca.service;

import java.util.List;

import com.oaxaca.entity.CatGeneroConac;

public interface ICatGeneroConacService {

    public CatGeneroConac insertGeneroConac(String clave, String descripcion, Integer ejercicio);

    public CatGeneroConac updateGeneroConac(Integer id, String descripcion);

    public List<CatGeneroConac> findAllByEjercicio(Integer ejercicio);
}
