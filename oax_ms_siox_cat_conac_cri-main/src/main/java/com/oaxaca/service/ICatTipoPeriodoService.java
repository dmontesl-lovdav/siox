package com.oaxaca.service;

import java.util.List;

import com.oaxaca.dto.CatTipoPeriodoDTO;
import com.oaxaca.dto.ConsultaRespuesta;

public interface ICatTipoPeriodoService {
    ConsultaRespuesta<List<CatTipoPeriodoDTO>> getCatTipoPeriodo(
            Integer page,
            Integer pageSize,
            String search,
            String sort);
}
