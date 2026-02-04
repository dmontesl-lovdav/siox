package com.oaxaca.service;

import java.util.List;

import com.oaxaca.entity.CatEstadoFinanciero;
import com.oaxaca.entity.CatEstructura;
import com.oaxaca.entity.CatNaturaleza;
import com.oaxaca.entity.CatPosicion;

public interface ICatalogosService {

    List<CatNaturaleza> findAllNaturaleza();

    List<CatEstadoFinanciero> findAllEstadoFinanciero();

    List<CatPosicion> findAllPosicion();

    List<CatEstructura> findAllEstructura();

}
