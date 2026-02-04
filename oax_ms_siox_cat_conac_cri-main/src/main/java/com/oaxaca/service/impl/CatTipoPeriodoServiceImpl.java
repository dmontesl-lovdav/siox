package com.oaxaca.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.oaxaca.dto.CatTipoPeriodoDTO;
import com.oaxaca.dto.ConsultaRespuesta;
import com.oaxaca.repository.CatTipoPeriodoRepository;
import com.oaxaca.service.ICatTipoPeriodoService;

@Service
public class CatTipoPeriodoServiceImpl implements ICatTipoPeriodoService {

    @Autowired
    private CatTipoPeriodoRepository repository;

    @Override
    public ConsultaRespuesta<List<CatTipoPeriodoDTO>> getCatTipoPeriodo(
            Integer page,
            Integer pageSize,
            String search,
            String sort) {
        try {
            // Valores por defecto
            if (page == null || page < 1) {
                page = 1;
            }
            if (pageSize == null || pageSize < 1) {
                pageSize = 10;
            }
            if (sort == null || sort.trim().isEmpty()) {
                sort = "id ASC";
            }

            // Llamar a la función de PostgreSQL
            List<Object[]> resultados = repository.getCatTipoPeriodo(page, pageSize, search, sort);

            // Convertir los resultados a DTOs
            List<CatTipoPeriodoDTO> datos = new ArrayList<>();
            Integer totalRegistros = 0;

            for (Object[] row : resultados) {
                CatTipoPeriodoDTO dto = new CatTipoPeriodoDTO();

                // total_registros
                if (row[0] != null) {
                    totalRegistros = ((Number) row[0]).intValue();
                    dto.setTotalRegistros(totalRegistros);
                }

                // id
                if (row[1] != null) {
                    dto.setId(((Number) row[1]).intValue());
                }

                // periodo
                if (row[2] != null) {
                    dto.setPeriodo(row[2].toString());
                }

                datos.add(dto);
            }

            // Crear la respuesta
            ConsultaRespuesta<List<CatTipoPeriodoDTO>> respuesta = new ConsultaRespuesta<>();
            respuesta.setExito(true);
            respuesta.setMensaje("Consulta exitosa");
            respuesta.setDatos(datos);
            respuesta.setTotal(totalRegistros);
            respuesta.setPagina(page);
            respuesta.setTamano(pageSize);

            return respuesta;

        } catch (Exception e) {
            ConsultaRespuesta<List<CatTipoPeriodoDTO>> respuesta = new ConsultaRespuesta<>();
            respuesta.setExito(false);
            respuesta.setMensaje("Error al consultar tipos de periodo: " + e.getMessage());
            respuesta.setDatos(new ArrayList<>());
            respuesta.setTotal(0);
            respuesta.setPagina(page != null ? page : 1);
            respuesta.setTamano(pageSize != null ? pageSize : 10);
            return respuesta;
        }
    }
}
