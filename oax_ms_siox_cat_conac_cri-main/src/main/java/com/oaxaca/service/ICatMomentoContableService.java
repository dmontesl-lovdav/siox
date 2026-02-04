package com.oaxaca.service;

import java.util.List;

import com.oaxaca.dto.CatMomentoContableDTO;
import com.oaxaca.dto.CatMomentoContableUpdateDTO;
import com.oaxaca.dto.ConsultaRespuesta;

public interface ICatMomentoContableService {

    ConsultaRespuesta<List<CatMomentoContableDTO>> getCatMomentoContable(
            Integer page,
            Integer pageSize,
            String sort,
            String clave,
            String momentoContable,
            Integer tipoPolizaId,
            Boolean esPresupuestal,
            Boolean activo
    );

    ConsultaRespuesta<String> createMomentoContable(CatMomentoContableUpdateDTO dto);

    ConsultaRespuesta<String> updateMomentoContable(Integer id, CatMomentoContableUpdateDTO dto);

    ConsultaRespuesta<String> deleteMomentoContable(Integer id, Integer idUsuarioBaja);
}
