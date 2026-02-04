package com.oaxaca.service.impl;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.oaxaca.entity.CatTipoCri;
import com.oaxaca.repository.CatTipoCriRepository;
import com.oaxaca.service.ICatTipoCriService;
import com.oaxaca.util.VigenciaUtils;

@Service
public class CatTipoCriServiceImpl implements ICatTipoCriService {
    @Autowired
    private CatTipoCriRepository repository;
    @Autowired
    private com.oaxaca.repository.CatRubroCriRepository rubroRepository;

    @Override
    public CatTipoCri insertTipoCri(String clave, String nombre, String descripcion, Integer idRubro,
            Integer ejercicio) {
        if (!VigenciaUtils.claveValida(clave)) {
            throw new IllegalArgumentException(
                    "La clave debe tener exactamente dos caracteres alfanuméricos (A-Z, 0-9)");
        }
        // Validar que la clave no exista previamente
        CatTipoCri existente = repository.findByClaveAndIdRubro(clave, idRubro);
        if (existente != null) {
            throw new IllegalArgumentException("La clave ingresada ya existe");
        }
        com.oaxaca.entity.CatRubroCri rubro = rubroRepository.findById(idRubro).orElse(null);
        if (rubro == null)
            throw new IllegalArgumentException("No se encontró el rubro");
        String claveRubro = rubro.getClave();
        String claveCompuesta = claveRubro + "." + clave;
        Date inicioVigencia = VigenciaUtils.getInicioVigencia(ejercicio);
        Date finVigencia = VigenciaUtils.getFinVigencia(ejercicio);
        Date fechaAlta = new Date();
        CatTipoCri tipo = new CatTipoCri(clave, nombre, descripcion, idRubro, claveCompuesta, inicioVigencia,
                finVigencia, fechaAlta, ejercicio);
        return repository.save(tipo);
    }

    @Override
    public CatTipoCri updateTipoCri(Integer id, String nombre, String descripcion) {
        Optional<CatTipoCri> opt = repository.findById(id);
        if (opt.isEmpty()) {
            throw new IllegalArgumentException("No se encontró el tipo con el id proporcionado");
        }
        CatTipoCri tipo = opt.get();
        tipo.setNombre(nombre);
        tipo.setDescripcion(descripcion);
        return repository.save(tipo);
    }

    @Override
    public Optional<CatTipoCri> findById(Integer id) {
        return repository.findById(id);
    }

    @Override
    public List<CatTipoCri> findAllByEjercicioAndIdRubro(Integer ejercicio, Integer idRubro) {
        return repository.findAllByEjercicioAndIdRubro(ejercicio, idRubro);
    }
}
