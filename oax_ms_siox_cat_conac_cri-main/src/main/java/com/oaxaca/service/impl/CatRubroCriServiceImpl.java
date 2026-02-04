package com.oaxaca.service.impl;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.oaxaca.entity.CatRubroCri;
import com.oaxaca.repository.CatRubroCriRepository;
import com.oaxaca.service.ICatRubroCriService;
import com.oaxaca.util.VigenciaUtils;

@Service
public class CatRubroCriServiceImpl implements ICatRubroCriService {
    @Autowired
    private CatRubroCriRepository repository;

    @Override
    public CatRubroCri insertRubroCri(String clave, String nombre, String descripcion, Integer ejercicio) {
        if (!VigenciaUtils.claveValida(clave)) {
            throw new IllegalArgumentException(
                    "La clave debe tener exactamente dos caracteres alfanuméricos (A-Z, 0-9)");
        }
        // Validar que la clave no exista previamente
        CatRubroCri existente = repository.findByClave(clave);
        if (existente != null) {
            throw new IllegalArgumentException("La clave ingresada ya existe");
        }
        Date inicioVigencia = VigenciaUtils.getInicioVigencia(ejercicio);
        Date finVigencia = VigenciaUtils.getFinVigencia(ejercicio);
        Date fechaAlta = new Date();
        CatRubroCri rubro = new CatRubroCri(clave, nombre, descripcion, inicioVigencia, finVigencia, ejercicio,
                fechaAlta);
        return repository.save(rubro);
    }

    @Override
    public CatRubroCri updateRubroCri(Integer id, String nombre, String descripcion) {

        Optional<CatRubroCri> opt = repository.findById(id);
        if (opt.isEmpty()) {
            throw new IllegalArgumentException("No se encontró el rubro con el id proporcionado");
        }
        CatRubroCri rubro = opt.get();

        rubro.setNombre(nombre);
        rubro.setDescripcion(descripcion);
        return repository.save(rubro);
    }

    @Override
    public Optional<CatRubroCri> findById(Integer id) {
        return repository.findById(id);
    }

    @Override
    public List<CatRubroCri> findAllByEjercicio(Integer ejercicio) {
        return repository.findAllByEjercicio(ejercicio);
    }
}
