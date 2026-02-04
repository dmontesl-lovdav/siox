package com.oaxaca.service.impl;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.oaxaca.entity.CatDatosCuentaConac;
import com.oaxaca.repository.CatDatosCuentaConacRepository;
import com.oaxaca.service.ICatDatosCuentaConacService;

@Service
public class CatDatosCuentaConacServiceImpl implements ICatDatosCuentaConacService {
    @Autowired
    private CatDatosCuentaConacRepository datosCuentaRepo;

    @Override
    public CatDatosCuentaConac insertarDatosCuenta(Integer idGenero, Integer idGrupo, Integer idRubro, Integer idCuenta,
            Integer idSubCuenta, Integer idNaturaleza, Integer idEstadoFinanciero, Integer idPosicionFinanciera,
            Integer idEstructura, Date inicioVigencia, Date finVigencia, Integer ejercicio) {

        datosCuentaRepo.findByIdGenero(idGenero).forEach(genero -> {
            if (genero.getInicioVigencia() == null || genero.getFinVigencia() == null
                    || genero.getIdNaturaleza() == null ||
                    genero.getIdEstadoFinanciero() == null || genero.getIdPosicion() == null) {
                genero.setInicioVigencia(inicioVigencia);
                genero.setFinVigencia(finVigencia);
                genero.setIdNaturaleza(idNaturaleza);
                genero.setIdEstadoFinanciero(idEstadoFinanciero);
                genero.setIdPosicion(idPosicionFinanciera);
                datosCuentaRepo.save(genero);
            }
        });
        datosCuentaRepo.findByIdGrupo(idGrupo).forEach(grupo -> {
            if (grupo.getInicioVigencia() == null || grupo.getFinVigencia() == null || grupo.getIdNaturaleza() == null
                    ||
                    grupo.getIdEstadoFinanciero() == null || grupo.getIdPosicion() == null) {
                grupo.setInicioVigencia(inicioVigencia);
                grupo.setFinVigencia(finVigencia);
                grupo.setIdNaturaleza(idNaturaleza);
                grupo.setIdEstadoFinanciero(idEstadoFinanciero);
                grupo.setIdPosicion(idPosicionFinanciera);
                datosCuentaRepo.save(grupo);
            }
        });
        datosCuentaRepo.findByIdRubro(idRubro).forEach(rubro -> {
            if (rubro.getInicioVigencia() == null || rubro.getFinVigencia() == null || rubro.getIdNaturaleza() == null
                    ||
                    rubro.getIdEstadoFinanciero() == null || rubro.getIdPosicion() == null) {
                rubro.setInicioVigencia(inicioVigencia);
                rubro.setFinVigencia(finVigencia);
                rubro.setIdNaturaleza(idNaturaleza);
                rubro.setIdEstadoFinanciero(idEstadoFinanciero);
                rubro.setIdPosicion(idPosicionFinanciera);
                datosCuentaRepo.save(rubro);
            }
        });
        datosCuentaRepo.findByIdCuenta(idCuenta).forEach(cuenta -> {
            if (cuenta.getInicioVigencia() == null || cuenta.getFinVigencia() == null
                    || cuenta.getIdNaturaleza() == null ||
                    cuenta.getIdEstadoFinanciero() == null || cuenta.getIdPosicion() == null) {
                cuenta.setInicioVigencia(inicioVigencia);
                cuenta.setFinVigencia(finVigencia);
                cuenta.setIdNaturaleza(idNaturaleza);
                cuenta.setIdEstadoFinanciero(idEstadoFinanciero);
                cuenta.setIdPosicion(idPosicionFinanciera);
                datosCuentaRepo.save(cuenta);
            }
        });
        datosCuentaRepo.findByIdSubCuenta(idSubCuenta).forEach(subCuenta -> {
            subCuenta.setInicioVigencia(inicioVigencia);
            subCuenta.setFinVigencia(finVigencia);
            subCuenta.setIdNaturaleza(idNaturaleza);
            subCuenta.setIdEstadoFinanciero(idEstadoFinanciero);
            subCuenta.setIdPosicion(idPosicionFinanciera);
            subCuenta.setIdEstructura(idEstructura);
            datosCuentaRepo.save(subCuenta);
        });

        // Retornar el último subCuenta actualizado (si existe)
        return datosCuentaRepo.findByIdSubCuenta(idSubCuenta).stream().reduce((first, second) -> second).orElse(null);

    }

    @Override
    public CatDatosCuentaConac updateDatosCuenta(Integer idGenero, Integer idGrupo, Integer idRubro, Integer idCuenta,
            Integer idSubCuenta, Integer idNaturaleza, Integer idEstadoFinanciero, Integer idPosicionFinanciera,
            Integer idEstructura, Date inicioVigencia, Date finVigencia, Integer ejercicio) {
        datosCuentaRepo.findByIdGenero(idGenero).forEach(genero -> {
            genero.setInicioVigencia(inicioVigencia);
            genero.setFinVigencia(finVigencia);
            genero.setIdNaturaleza(idNaturaleza);
            genero.setIdEstadoFinanciero(idEstadoFinanciero);
            genero.setIdPosicion(idPosicionFinanciera);
            datosCuentaRepo.save(genero);
        });
        datosCuentaRepo.findByIdGrupo(idGrupo).forEach(grupo -> {
            grupo.setInicioVigencia(inicioVigencia);
            grupo.setFinVigencia(finVigencia);
            grupo.setIdNaturaleza(idNaturaleza);
            grupo.setIdEstadoFinanciero(idEstadoFinanciero);
            grupo.setIdPosicion(idPosicionFinanciera);
            datosCuentaRepo.save(grupo);
        });
        datosCuentaRepo.findByIdRubro(idRubro).forEach(rubro -> {
            rubro.setInicioVigencia(inicioVigencia);
            rubro.setFinVigencia(finVigencia);
            rubro.setIdNaturaleza(idNaturaleza);
            rubro.setIdEstadoFinanciero(idEstadoFinanciero);
            rubro.setIdPosicion(idPosicionFinanciera);
            datosCuentaRepo.save(rubro);
        });
        datosCuentaRepo.findByIdCuenta(idCuenta).forEach(cuenta -> {
            cuenta.setInicioVigencia(inicioVigencia);
            cuenta.setFinVigencia(finVigencia);
            cuenta.setIdNaturaleza(idNaturaleza);
            cuenta.setIdEstadoFinanciero(idEstadoFinanciero);
            cuenta.setIdPosicion(idPosicionFinanciera);
            datosCuentaRepo.save(cuenta);
        });
        datosCuentaRepo.findByIdSubCuenta(idSubCuenta).forEach(subCuenta -> {
            subCuenta.setInicioVigencia(inicioVigencia);
            subCuenta.setFinVigencia(finVigencia);
            subCuenta.setIdNaturaleza(idNaturaleza);
            subCuenta.setIdEstadoFinanciero(idEstadoFinanciero);
            subCuenta.setIdPosicion(idPosicionFinanciera);
            subCuenta.setIdEstructura(idEstructura);
            datosCuentaRepo.save(subCuenta);
        });

        // Retornar el último subCuenta actualizado (si existe)
        return datosCuentaRepo.findByIdSubCuenta(idSubCuenta).stream().reduce((first, second) -> second).orElse(null);
    }

}
