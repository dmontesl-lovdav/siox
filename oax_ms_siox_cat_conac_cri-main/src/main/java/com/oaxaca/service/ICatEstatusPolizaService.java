package com.oaxaca.service;

import com.oaxaca.dto.CatEstatusPolizaDTO;
import com.oaxaca.dto.CatEstatusPolizaUpdateDTO;
import com.oaxaca.dto.ConsultaRespuesta;

import java.util.List;

public interface ICatEstatusPolizaService {

    List<CatEstatusPolizaDTO> consultarCatEstatusPoliza(Integer page, Integer pageSize, String sort, String clave, String estatus, Boolean activo, Boolean bloqueo);

    ConsultaRespuesta<String> crearCatEstatusPoliza(CatEstatusPolizaUpdateDTO dto);

    ConsultaRespuesta<String> actualizarCatEstatusPoliza(Integer id, CatEstatusPolizaUpdateDTO updateDTO);

    ConsultaRespuesta<String> eliminarCatEstatusPoliza(Integer id, Integer idUsuarioBaja);
}
