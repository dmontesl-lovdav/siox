package com.oaxaca.service;

import java.util.Date;
import java.util.List;

import com.oaxaca.dto.ConacConsultaDTO;
import com.oaxaca.dto.ConsultaRespuesta;

public interface IConacConsultaService {

    ConsultaRespuesta<List<ConacConsultaDTO>> consultarConac(
            String cuenta,
            String descripcion,
            String naturaleza,
            String estructura,
            String estadoFinanciero,
            String posicionFinanciera,
            Date fechaAlta,
            Date inicioVigencia,
            Date finVigencia,
            String estatus,
            Integer ejercicio,
            String sort,
            Integer page,
            Integer pageSize
    );
}