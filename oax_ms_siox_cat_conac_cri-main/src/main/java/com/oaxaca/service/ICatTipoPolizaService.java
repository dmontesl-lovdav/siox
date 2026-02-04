package com.oaxaca.service;

import com.oaxaca.dto.CatTipoPolizaDTO;
import com.oaxaca.dto.CatTipoPolizaUpdateDTO;
import com.oaxaca.dto.ConsultaRespuesta;

import java.util.List;

public interface ICatTipoPolizaService {

    List<CatTipoPolizaDTO> consultarCatTipoPoliza(Integer page, Integer pageSize, String sort, String clave, String tipo, Boolean activo);

    ConsultaRespuesta<String> crearCatTipoPoliza(CatTipoPolizaUpdateDTO dto);

    ConsultaRespuesta<String> actualizarCatTipoPoliza(CatTipoPolizaUpdateDTO updateDTO);

    ConsultaRespuesta<String> eliminarCatTipoPoliza(Integer id, Integer idUsuarioBaja);
}
