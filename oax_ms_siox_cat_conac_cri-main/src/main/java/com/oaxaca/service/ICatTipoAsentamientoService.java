package com.oaxaca.service;

import com.oaxaca.entity.CatTipoAsentamiento;

public interface ICatTipoAsentamientoService {
    CatTipoAsentamiento guardarTipoAsentamiento(String clave, String descripcion);

    /**
     * Cambia el estatus de un tipo de asentamiento
     * 
     * @param id      ID del tipo asentamiento
     * @param estatus Nuevo estatus
     * @return CatTipoAsentamiento actualizado
     */
    CatTipoAsentamiento cambiarEstatus(Integer id, Boolean estatus);

    /**
     * Actualiza un tipo de asentamiento existente
     * 
     * @param id          ID del tipo de asentamiento
     * @param clave       Nueva clave
     * @param descripcion Nueva descripción
     * @return CatTipoAsentamiento actualizado
     */
    CatTipoAsentamiento actualizarTipoAsentamiento(Integer id, String clave, String descripcion);
}
