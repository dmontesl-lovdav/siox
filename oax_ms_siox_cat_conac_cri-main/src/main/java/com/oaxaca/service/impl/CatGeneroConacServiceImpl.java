package com.oaxaca.service.impl;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.oaxaca.entity.CatDatosCuentaConac;
import com.oaxaca.entity.CatGeneroConac;
import com.oaxaca.repository.CatDatosCuentaConacRepository;
import com.oaxaca.repository.CatGeneroConacRepository;
import com.oaxaca.service.ICatGeneroConacService;
import com.oaxaca.util.VigenciaUtils;

@Service
public class CatGeneroConacServiceImpl implements ICatGeneroConacService {
    @Autowired
    private CatGeneroConacRepository generoRepository;
    @Autowired
    private CatDatosCuentaConacRepository datosCuentaRepo;

    @Override
    public CatGeneroConac insertGeneroConac(String clave, String descripcion, Integer ejercicio) {
        if (!VigenciaUtils.claveValida(clave)) {
            throw new IllegalArgumentException(
                    "La clave debe tener exactamente dos caracteres alfanuméricos (A-Z, 0-9)");
        }
        CatGeneroConac generoExistente = generoRepository.findByClaveAndEjercicio(clave, ejercicio);
        if (generoExistente != null) {
            throw new IllegalArgumentException(
                    "La clave ingresada ya existe para el ejercicio " + ejercicio);
        }
        Date fechaAlta = new Date();
        CatGeneroConac generoEntidad = new CatGeneroConac(clave,
                descripcion, ejercicio, fechaAlta);
        Integer idGenero = generoRepository.save(generoEntidad).getId();

        CatDatosCuentaConac datosCuenta = new CatDatosCuentaConac(
                null, // idNaturaleza
                null, // idEstadoFinanciero
                null, // idPosicion
                null, // idEstructura
                idGenero, // idGenero
                null, // idGrupo
                null, // idRubro
                null, // idCuenta
                null, // idSubCuenta
                null, // inicioVigencia
                null, // finVigencia
                generoEntidad.getEjercicio()); // ejercicio
        datosCuentaRepo.save(datosCuenta);
        return generoEntidad;
    }

    @Override
    public CatGeneroConac updateGeneroConac(Integer id, String descripcion) {
        Optional<CatGeneroConac> generoExistente = generoRepository.findById(id);
        if (generoExistente.isEmpty()) {
            throw new IllegalArgumentException(
                    "No se encontró el género con id " + id);
        }
        CatGeneroConac genero = generoExistente.get();
        genero.setDescripcion(descripcion);
        return generoRepository.save(genero);
    }

    @Override
    public List<CatGeneroConac> findAllByEjercicio(Integer ejercicio) {
        return generoRepository.findAllByEjercicio(ejercicio);
    }

}
