package com.oaxaca.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.oaxaca.dto.ConsultaRespuesta;
import com.oaxaca.dto.CriTablaDTO;
import com.oaxaca.maper.CriTablaDTOMapper;
import com.oaxaca.repository.ClasificadorCompletoRepository;
import com.oaxaca.service.ICriObtenClasificadorService;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j

public class CriObtenClasificadorServiceImpl implements ICriObtenClasificadorService {
    @Autowired
    private ClasificadorCompletoRepository clasificadorCompletoRepo;

    public ConsultaRespuesta<List<CriTablaDTO>> buscarClasificadorPaginado(Integer ejercicio, String ordenCampo,
            Integer tamano, Integer pagina, String clave, String nombre, String descripcion, String claveCompuesta,
            java.sql.Date fechaAltaDate, java.sql.Date inicioVigenciaDate, java.sql.Date finVigenciaDate) {
        try {
            if (ejercicio == null) {
                return new ConsultaRespuesta<>(false, "El parámetro ejercicio es obligatorio", null);
            }

            // Convertir strings vacíos a null
            clave = (clave == null || clave.isBlank()) ? null : clave;
            nombre = (nombre == null || nombre.isBlank()) ? null : nombre;
            descripcion = (descripcion == null || descripcion.isBlank()) ? null : descripcion;
            claveCompuesta = (claveCompuesta == null || claveCompuesta.isBlank()) ? null : claveCompuesta;

            // Calcular offset para la función PostgreSQL
            Integer offset = (pagina != null && tamano != null) ? pagina * tamano : null;

            List<Object[]> resultados = clasificadorCompletoRepo.findClasificadorCompletoByEjercicio(ejercicio,
                    ordenCampo, tamano, offset, clave, nombre, descripcion, claveCompuesta, fechaAltaDate,
                    inicioVigenciaDate, finVigenciaDate);

            // Mapear Object[] a DTO usando lambda y constructor
            List<CriTablaDTO> datos = resultados.stream()
                    .map(CriTablaDTOMapper::mapToDto)
                    .toList();

            // Obtener el total del primer registro (todos tienen el mismo total)
            int total = datos.isEmpty() ? 0 : datos.get(0).getTotal();
            int paginaActual = (pagina != null) ? pagina : 0;
            int tamanoActual = (tamano != null) ? tamano : 10;

            return new ConsultaRespuesta<>(true, "Consulta exitosa", datos, total, paginaActual, tamanoActual);
        } catch (Exception e) {
            log.error("Error en la consulta: {}", e.getMessage(), e);
            return new ConsultaRespuesta<>(false, "Error en la consulta: " + e.getMessage(), null);
        }
    }

    public ConsultaRespuesta<List<CriTablaDTO>> obtenerTablaCombinada(Integer ejercicio) {
        try {
            List<Object[]> resultados = clasificadorCompletoRepo.findClasificadorCompletoByEjercicio(ejercicio, null,
                    null, null, null, null, null, null, null, null, null);
            // Mapear Object[] a DTO usando lambda y constructor
            List<CriTablaDTO> datos = resultados.stream()
                    .map(CriTablaDTOMapper::mapToDto)
                    .toList();

            // Obtener el total del primer registro
            int total = datos.isEmpty() ? 0 : datos.get(0).getTotal();

            return new ConsultaRespuesta<>(true, "Consulta exitosa", datos, total, 0, datos.size());
        } catch (Exception e) {
            log.error("Error en la consulta: {}", e.getMessage(), e);
            return new ConsultaRespuesta<>(false, "Error en la consulta: " + e.getMessage(), null);
        }
    }

}
