package com.oaxaca.service;

import java.util.List;

import com.oaxaca.dto.CatEstructuraCuentasDTO;
import com.oaxaca.dto.ConsultaRespuesta;
import com.oaxaca.entity.CatEstructuraCuentas;

public interface ICatEstructuraCuentasService {

    ConsultaRespuesta<List<CatEstructuraCuentasDTO>> getCatEstructuraCuentas(
            Integer page,
            Integer pageSize,
            String sort,
            String descripcion,
            Integer niveles,
            Boolean visible,
            Boolean estatus,
            Integer longitud);

    ConsultaRespuesta<CatEstructuraCuentas> getById(Integer id);

    ConsultaRespuesta<CatEstructuraCuentas> create(CatEstructuraCuentas catEstructuraCuentas);

    ConsultaRespuesta<CatEstructuraCuentas> update(Integer id, CatEstructuraCuentas catEstructuraCuentas);

    ConsultaRespuesta<CatEstructuraCuentas> updateVisible(Integer id, Boolean visible);

    ConsultaRespuesta<Void> delete(Integer id);
}
