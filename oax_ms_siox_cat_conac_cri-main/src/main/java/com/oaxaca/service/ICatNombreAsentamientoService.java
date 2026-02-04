package com.oaxaca.service;

import java.util.List;

import com.oaxaca.dto.CatNombreAsentamientoDTO;
import com.oaxaca.dto.ConsultaRespuesta;

public interface ICatNombreAsentamientoService {
    ConsultaRespuesta<List<CatNombreAsentamientoDTO>> buscarNombreAsentamiento(String busqueda, String sort,
            Integer page,
            Integer pageSize);

    // Nuevo método para guardar
    com.oaxaca.entity.CatNombreAsentamiento guardarNombreAsentamiento(Integer idTipoAsentamiento, String clave,
            String descripcion);

    // Método para actualizar
    com.oaxaca.entity.CatNombreAsentamiento actualizarNombreAsentamiento(Integer id, Integer idTipoAsentamiento, String clave, String descripcion);

    // Método para actualizar estatus
    com.oaxaca.entity.CatNombreAsentamiento actualizarEstatusNombreAsentamiento(Integer id, Boolean estatus);
}
