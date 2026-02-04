package com.oaxaca.service;

import java.util.Date;

import com.oaxaca.entity.CatDatosCuentaConac;

public interface ICatDatosCuentaConacService {

        public CatDatosCuentaConac insertarDatosCuenta(Integer idGenero, Integer idGrupo, Integer idRubro,
                        Integer idCuenta,
                        Integer idSubCuenta, Integer idNaturaleza, Integer idEstadoFinanciero,
                        Integer idPosicionFinanciera,
                        Integer idEstructura, Date inicioVigencia, Date finVigencia, Integer ejercicio);

        public CatDatosCuentaConac updateDatosCuenta(Integer idGenero, Integer idGrupo, Integer idRubro,
                        Integer idCuenta,
                        Integer idSubCuenta, Integer idNaturaleza, Integer idEstadoFinanciero,
                        Integer idPosicionFinanciera,
                        Integer idEstructura, Date inicioVigencia, Date finVigencia, Integer ejercicio);

}
