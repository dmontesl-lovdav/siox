package com.oaxaca.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.oaxaca.entity.CatTipoAsentamiento;
import com.oaxaca.repository.ICatTipoAsentamientoRepository;
import com.oaxaca.service.ICatTipoAsentamientoService;

@Service
public class CatTipoAsentamientoServiceImpl implements ICatTipoAsentamientoService {
    @Autowired
    private ICatTipoAsentamientoRepository tipoAsentamientoRepository;

    @Override
    public CatTipoAsentamiento guardarTipoAsentamiento(String clave, String descripcion) {
        if (tipoAsentamientoRepository.existsByClave(clave)) {
            throw new IllegalArgumentException("La clave ya existe");
        }
        CatTipoAsentamiento tipo = new CatTipoAsentamiento();
        tipo.setClave(clave);
        tipo.setDescripcion(descripcion);
        tipo.setIdUsuarioCreacion(1);
        tipo.setFechaAlta(new java.util.Date());
        return tipoAsentamientoRepository.save(tipo);
    }

    @Override
    public CatTipoAsentamiento cambiarEstatus(Integer id, Boolean estatus) {
        CatTipoAsentamiento tipo = tipoAsentamientoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Tipo de asentamiento no encontrado"));
        tipo.setEstatus(estatus);
        return tipoAsentamientoRepository.save(tipo);
    }

    /**
     * Actualiza un tipo de asentamiento existente
     * 
     * @param id          ID del tipo de asentamiento
     * @param clave       Nueva clave
     * @param descripcion Nueva descripción
     * @return CatTipoAsentamiento actualizado
     */
    @Override
    public CatTipoAsentamiento actualizarTipoAsentamiento(Integer id, String clave, String descripcion) {
        CatTipoAsentamiento tipo = tipoAsentamientoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Tipo de asentamiento no encontrado"));
        tipo.setClave(clave);
        tipo.setDescripcion(descripcion);
        return tipoAsentamientoRepository.save(tipo);
    }
}
