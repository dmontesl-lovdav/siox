package com.oaxaca.service;

import java.sql.Date;
import java.util.List;

import com.oaxaca.dto.ConsultaRespuesta;
import com.oaxaca.dto.CriTablaDTO;

public interface ICriObtenClasificadorService {
  ConsultaRespuesta<List<CriTablaDTO>> obtenerTablaCombinada(Integer ejercicio);

  ConsultaRespuesta<List<CriTablaDTO>> buscarClasificadorPaginado(
      Integer ejercicio, String ordenCampo, Integer tamano, Integer pagina,
      String clave, String nombre, String descripcion, String claveCompuesta, Date fechaAltaDate,
      Date inicioVigenciaDate,
      Date finVigenciaDate);
}