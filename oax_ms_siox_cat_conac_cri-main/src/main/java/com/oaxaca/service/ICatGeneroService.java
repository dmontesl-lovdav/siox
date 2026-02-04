package com.oaxaca.service;

import java.util.List;
import java.util.Map;

import com.oaxaca.dto.CatGeneroDTO;
import com.oaxaca.dto.CatGeneroUpdateDTO;
import com.oaxaca.dto.ConsultaRespuesta;

public interface ICatGeneroService {

    /*ConsultaRespuesta<List<CatGeneroDTO>> getCatGenero(
            Integer page,
            Integer pageSize,
            String sort,
            String clave,
            String descripcion,
            String fechaAlta);*/

    ConsultaRespuesta<List<CatGeneroDTO>> getCatGenero(
        Map<String, String> filters,
            Integer page,
            Integer pageSize,
            String sort);

    ConsultaRespuesta<String> createGenero(CatGeneroUpdateDTO generoDTO);

    ConsultaRespuesta<String> updateGenero(Integer id, CatGeneroUpdateDTO generoDTO);

    ConsultaRespuesta<String> cambiarEstatus(Integer id, Boolean estatus);
}
