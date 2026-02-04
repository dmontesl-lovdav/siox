package com.oaxaca.service;

import java.util.List;

import com.oaxaca.dto.CatGrupoUnidadesResponsablesDTO;
import com.oaxaca.dto.CatGrupoUnidadesResponsablesUpdateDTO;
import com.oaxaca.dto.ConsultaRespuesta;

public interface ICatGrupoUnidadesResponsablesService {

    ConsultaRespuesta<List<CatGrupoUnidadesResponsablesDTO>> getCatGrupoUnidadesResponsables(
            Integer page,
            Integer pageSize,
            String sort,
            String clave,
            String grupoUnidadResponsable,
            Boolean activo);

    ConsultaRespuesta<String> createGur(CatGrupoUnidadesResponsablesUpdateDTO dto);

    ConsultaRespuesta<String> updateGur(Integer id, CatGrupoUnidadesResponsablesUpdateDTO dto);

    ConsultaRespuesta<String> deleteGur(Integer id, Integer idUsuarioBaja);
}
