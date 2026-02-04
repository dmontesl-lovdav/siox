package com.oaxaca.service;

import java.util.List;
import java.util.Map;

import com.oaxaca.dto.CatTipoSectorGubernamentalDTO;
import com.oaxaca.dto.CatTipoSectorGubernamentalUpdateDTO;
import com.oaxaca.dto.ConsultaRespuesta;
import com.oaxaca.entity.CatTipoSectorGubernamental;

public interface ICatTipoSectorGubernamentalService {

    /*ConsultaRespuesta<List<CatTipoSectorGubernamentalDTO>> getCatTipoSectorGubernamental(
            Integer page,
            Integer pageSize,
            String sort,
            String clave,
            String sector,
            Boolean activo);*/
    
    ConsultaRespuesta<List<CatTipoSectorGubernamentalDTO>> getCatTipoSectorGubernamental(
            Map<String, String> filters,
            Integer page,
            Integer pageSize,
            String sort);

    ConsultaRespuesta<CatTipoSectorGubernamental> createTipoSectorGubernamental(CatTipoSectorGubernamentalUpdateDTO tipoSectorDTO);

    ConsultaRespuesta<CatTipoSectorGubernamental> updateTipoSectorGubernamental(Integer id, CatTipoSectorGubernamentalUpdateDTO tipoSectorDTO);

    ConsultaRespuesta<String> cambiarActivo(Integer id, Boolean activo, Integer idUsuarioModificacion);
}
