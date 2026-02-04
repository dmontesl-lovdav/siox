package com.oaxaca.service.impl;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.oaxaca.entity.CatClaseCri;
import com.oaxaca.repository.CatClaseCriRepository;
import com.oaxaca.service.ICatClaseCriService;
import com.oaxaca.util.VigenciaUtils;

@Service
public class CatClaseCriServiceImpl implements ICatClaseCriService {
    @Autowired
    private CatClaseCriRepository repository;
    @Autowired
    private com.oaxaca.repository.CatRubroCriRepository rubroRepository;
    @Autowired
    private com.oaxaca.repository.CatTipoCriRepository tipoRepository;

    @Override
    public CatClaseCri insertClaseCri(String clave, String nombre, String descripcion, Integer idTipo, Integer idRubro,
            Integer ejercicio) {
        if (!VigenciaUtils.claveValida(clave)) {
            throw new IllegalArgumentException(com.oaxaca.util.MensajesConstantes.ERROR_CLAVE_DOS_ALFANUM);
        }
        // Validar que la clave no exista previamente
        CatClaseCri existente = repository.findByClaveAndIdTipo(clave, idTipo);
        if (existente != null) {
            throw new IllegalArgumentException("La clave ingresada ya existe");
        }
        String claveRubro = null;
        String claveTipo = null;
        com.oaxaca.entity.CatRubroCri rubro = rubroRepository.findById(idRubro).orElse(null);
        if (rubro == null)
            throw new IllegalArgumentException(com.oaxaca.util.MensajesConstantes.ERROR_RUBRO_NO_ENCONTRADO);
        claveRubro = rubro.getClave();
        com.oaxaca.entity.CatTipoCri tipo = tipoRepository.findById(idTipo).orElse(null);
        if (tipo == null)
            throw new IllegalArgumentException(com.oaxaca.util.MensajesConstantes.ERROR_TIPO_NO_ENCONTRADO);
        claveTipo = tipo.getClave();
        String claveCompuesta = claveRubro + "." + claveTipo + "." + clave;
        Date inicioVigencia = VigenciaUtils.getInicioVigencia(ejercicio);
        Date finVigencia = VigenciaUtils.getFinVigencia(ejercicio);
        Date fechaAlta = new Date();
        CatClaseCri clase = new CatClaseCri(clave, nombre, descripcion, idTipo, claveCompuesta, inicioVigencia,
                finVigencia, fechaAlta, ejercicio);
        return repository.save(clase);
    }

    @Override
    public CatClaseCri updateClaseCri(Integer id, String nombre, String descripcion) {
        Optional<CatClaseCri> opt = repository.findById(id);
        if (opt.isEmpty()) {
            throw new IllegalArgumentException(com.oaxaca.util.MensajesConstantes.ERROR_CLASE_ID_NO_ENCONTRADO);
        }
        CatClaseCri clase = opt.get();
        clase.setNombre(nombre);
        clase.setDescripcion(descripcion);
        return repository.save(clase);
    }

    @Override
    public Optional<CatClaseCri> findById(Integer id) {
        return repository.findById(id);
    }

    @Override
    public List<CatClaseCri> findAllByEjercicioAndIdTipo(Integer ejercicio, Integer idTipo) {
        return repository.findAllByEjercicioAndIdTipo(ejercicio, idTipo);
    }
}
