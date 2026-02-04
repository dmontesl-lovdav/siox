package com.oaxaca.service.impl;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.oaxaca.dto.ConacConsultaDTO;
import com.oaxaca.dto.ConsultaRespuesta;
import com.oaxaca.repository.ConacConsultaRepository;
import com.oaxaca.service.IConacConsultaService;

@Service
@Transactional
public class ConacConsultaServiceImpl implements IConacConsultaService {

    @Autowired
    private ConacConsultaRepository conacConsultaRepository;

    @Override
    public ConsultaRespuesta<List<ConacConsultaDTO>> consultarConac(
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
            Integer pageSize) {

        try {
            // Validaciones de parámetros
            if (page == null || page < 1)
                page = 1;
            if (pageSize == null || pageSize < 1)
                pageSize = 10;
            if (sort == null || sort.trim().isEmpty())
                sort = "cuenta ASC";

            // Ejecutar la función PostgreSQL
            List<Object[]> resultados = conacConsultaRepository.getConacData(
                    cuenta, descripcion, naturaleza, estructura, estadoFinanciero,
                    posicionFinanciera, fechaAlta, inicioVigencia, finVigencia,
                    estatus, ejercicio, sort, page, pageSize);

            // Mapear resultados a DTO
            List<ConacConsultaDTO> datos = resultados.stream()
                    .map(this::mapearResultado)
                    .collect(Collectors.toList());

            // Obtener total de registros (viene en el resultado)
            Long totalRegistros = datos.isEmpty() ? 0L : datos.get(0).getTotalRegistros();

            return new ConsultaRespuesta<>(
                    true,
                    "Consulta ejecutada exitosamente",
                    datos,
                    totalRegistros != null ? totalRegistros.intValue() : 0,
                    page,
                    pageSize);

        } catch (Exception e) {
            return new ConsultaRespuesta<>(
                    false,
                    "Error al ejecutar la consulta: " + e.getMessage(),
                    null,
                    0,
                    page != null ? page : 1,
                    pageSize != null ? pageSize : 10);
        }
    }

    private ConacConsultaDTO mapearResultado(Object[] resultado) {
        ConacConsultaDTO dto = new ConacConsultaDTO();

        // Mapear según el orden de columnas en la función PostgreSQL
        // id_genero, id_grupo, id_rubro, id_cuenta, id_sub_cuenta,
        // id_naturaleza, id_estructura, id_estado_financiero, id_posicion,
        // cuenta, descripcion, naturaleza, estructura, estado_financiero,
        // posicion_financiera, fecha_alta, inicio_vigencia, fin_vigencia,
        // estatus, ejercicio, origen, total_registros
        dto.setIdDatosCuenta(resultado[0] != null ? (Integer) resultado[0] : null);
        dto.setIdGenero(resultado[1] != null ? (Integer) resultado[1] : null);
        dto.setIdGrupo(resultado[2] != null ? (Integer) resultado[2] : null);
        dto.setIdRubro(resultado[3] != null ? (Integer) resultado[3] : null);
        dto.setIdCuenta(resultado[4] != null ? (Integer) resultado[4] : null);
        dto.setIdSubCuenta(resultado[5] != null ? (Integer) resultado[5] : null);
        dto.setIdNaturaleza(resultado[6] != null ? (Integer) resultado[6] : null);
        dto.setIdEstructura(resultado[7] != null ? (Integer) resultado[7] : null);
        dto.setIdEstadoFinanciero(resultado[8] != null ? (Integer) resultado[8] : null);
        dto.setIdPosicion(resultado[9] != null ? (Integer) resultado[9] : null);
        dto.setCuenta(resultado[10] != null ? (String) resultado[10] : null);
        dto.setDescripcion(resultado[11] != null ? (String) resultado[11] : null);
        dto.setNaturaleza(resultado[12] != null ? (String) resultado[12] : null);
        dto.setEstructura(resultado[13] != null ? (String) resultado[13] : null);
        dto.setEstadoFinanciero(resultado[14] != null ? (String) resultado[14] : null);
        dto.setPosicionFinanciera(resultado[15] != null ? (String) resultado[15] : null);
        dto.setFechaAlta(resultado[16] != null ? (Date) resultado[16] : null);
        dto.setInicioVigencia(resultado[17] != null ? (Date) resultado[17] : null);
        dto.setFinVigencia(resultado[18] != null ? (Date) resultado[18] : null);
        dto.setEstatus(resultado[19] != null ? (String) resultado[19] : null);
        dto.setEjercicio(resultado[20] != null ? (Integer) resultado[20] : null);
        dto.setOrigen(resultado[21] != null ? (String) resultado[21] : null);

        // Manejar correctamente el casting de BigInteger a Long para total_registros
        if (resultado[22] != null) {
            if (resultado[22] instanceof java.math.BigInteger) {
                dto.setTotalRegistros(((java.math.BigInteger) resultado[22]).longValue());
            } else if (resultado[22] instanceof Long) {
                dto.setTotalRegistros((Long) resultado[22]);
            } else if (resultado[22] instanceof Integer) {
                dto.setTotalRegistros(((Integer) resultado[22]).longValue());
            } else {
                // Intentar convertir como String si es otro tipo
                dto.setTotalRegistros(Long.valueOf(resultado[22].toString()));
            }
        } else {
            dto.setTotalRegistros(0L);
        }

        return dto;
    }
}