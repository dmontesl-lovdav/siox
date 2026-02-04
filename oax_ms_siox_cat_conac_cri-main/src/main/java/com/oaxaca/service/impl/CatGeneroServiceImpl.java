package com.oaxaca.service.impl;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import javax.transaction.Transactional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.oaxaca.dto.CatGeneroDTO;
import com.oaxaca.dto.CatGeneroUpdateDTO;
import com.oaxaca.dto.ConsultaRespuesta;
import com.oaxaca.entity.CatGenero;
import com.oaxaca.repository.CatGeneroRepository;
import com.oaxaca.service.ICatGeneroService;
import com.oaxaca.spec.CatGeneroSpec;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CatGeneroServiceImpl implements ICatGeneroService {

    private final CatGeneroRepository repository;

    /*
     * @Override
     * public ConsultaRespuesta<List<CatGeneroDTO>> getCatGenero(
     * Integer page,
     * Integer pageSize,
     * String sort,
     * String clave,
     * String descripcion,
     * String fechaAlta) {
     * try {
     * // Valores por defecto
     * if (page == null || page < 1) {
     * page = 1;
     * }
     * if (pageSize == null || pageSize < 1) {
     * pageSize = 10;
     * }
     * if (sort == null || sort.trim().isEmpty()) {
     * sort = "id ASC";
     * }
     * 
     * // Convertir fechaAlta de String a LocalDate si viene el parámetro
     * LocalDate fechaAltaDate = null;
     * if (fechaAlta != null && !fechaAlta.trim().isEmpty()) {
     * try {
     * fechaAltaDate = LocalDate.parse(fechaAlta);
     * } catch (Exception e) {
     * // Si hay error en el formato, dejamos null
     * fechaAltaDate = null;
     * }
     * }
     * 
     * // Llamar a la función de PostgreSQL
     * List<Object[]> resultados = repository.getCatGenero(
     * page, pageSize, sort, clave, descripcion, fechaAltaDate);
     * 
     * // Convertir los resultados a DTOs
     * List<CatGeneroDTO> datos = new ArrayList<>();
     * Integer totalRegistros = 0;
     * 
     * for (Object[] row : resultados) {
     * CatGeneroDTO dto = new CatGeneroDTO();
     * 
     * // total_registros
     * if (row[0] != null) {
     * totalRegistros = ((Number) row[0]).intValue();
     * dto.setTotalRegistros(totalRegistros);
     * }
     * 
     * // id
     * if (row[1] != null) {
     * dto.setId(((Number) row[1]).intValue());
     * }
     * 
     * // clave
     * if (row[2] != null) {
     * dto.setClave(row[2].toString().trim());
     * }
     * 
     * // descripcion
     * if (row[3] != null) {
     * dto.setDescripcion(row[3].toString().trim());
     * }
     * 
     * // fecha_alta
     * if (row[4] != null) {
     * dto.setFechaAlta(((java.sql.Date) row[4]).toLocalDate());
     * }
     * 
     * // estatus
     * if (row[5] != null) {
     * dto.setEstatus((Boolean) row[5]);
     * }
     * 
     * datos.add(dto);
     * }
     * 
     * // Crear la respuesta
     * ConsultaRespuesta<List<CatGeneroDTO>> respuesta = new ConsultaRespuesta<>();
     * respuesta.setExito(true);
     * respuesta.setMensaje("Consulta exitosa");
     * respuesta.setDatos(datos);
     * respuesta.setTotal(totalRegistros);
     * respuesta.setPagina(page);
     * respuesta.setTamano(pageSize);
     * 
     * return respuesta;
     * 
     * } catch (Exception e) {
     * ConsultaRespuesta<List<CatGeneroDTO>> respuesta = new ConsultaRespuesta<>();
     * respuesta.setExito(false);
     * respuesta.setMensaje("Error al consultar géneros: " + e.getMessage());
     * respuesta.setDatos(new ArrayList<>());
     * respuesta.setTotal(0);
     * respuesta.setPagina(page != null ? page : 1);
     * respuesta.setTamano(pageSize != null ? pageSize : 10);
     * return respuesta;
     * }
     * }
     */

    @Override
    public ConsultaRespuesta<List<CatGeneroDTO>> getCatGenero(Map<String, String> filters, Integer page,
            Integer pageSize, String sort) {
        Pageable pageable = PageRequest.of(
                Math.max((page != null ? page : 1) - 1, 0),
                pageSize != null ? pageSize : 10,
                buildSort(sort));

        Page<CatGeneroDTO> pageResult = repository
                .findAll(filterWithParameters(filters), pageable)
                .map(this::mapperDto);

        return ConsultaRespuesta.<List<CatGeneroDTO>>builder()
                .exito(true)
                .mensaje("Consulta exitosa")
                .datos(pageResult.getContent())
                .total((int) pageResult.getTotalElements())
                .pagina(pageResult.getNumber() + 1)
                .tamano(pageResult.getSize())
                .build();
    }

    private CatGeneroDTO mapperDto(CatGenero source) {
        return CatGeneroDTO.builder()
                .id(source.getId())
                .clave(source.getClave())
                .descripcion(source.getDescripcion())
                .fechaAlta(source.getFechaAlta())
                .bloqueado(source.getBloqueado())
                .build();
    }

    public Specification<CatGenero> filterWithParameters(Map<String, String> params) {
        return new CatGeneroSpec().getSpecificationByFilters(params);
    }

    private Sort buildSort(String sort) {
        if (sort == null || sort.isBlank()) {
            return Sort.unsorted();
        }
        String[] params = sort.trim().split("\\s+");

        if (params.length != 2) {
            return Sort.unsorted();
        }
        return Sort.by(
                Sort.Direction.fromOptionalString(params[1]).orElse(Sort.Direction.ASC),
                params[0]);
    }

    @Override
    @Transactional
    public ConsultaRespuesta<String> createGenero(CatGeneroUpdateDTO generoDTO) {
        ConsultaRespuesta<String> respuesta = new ConsultaRespuesta<>();
        try {
            // Validar datos requeridos
            if (generoDTO.getClave() == null || generoDTO.getClave().trim().isEmpty()) {
                respuesta.setExito(false);
                respuesta.setMensaje("La clave es requerida");
                return respuesta;
            }

            if (generoDTO.getDescripcion() == null || generoDTO.getDescripcion().trim().isEmpty()) {
                respuesta.setExito(false);
                respuesta.setMensaje("La descripción es requerida");
                return respuesta;
            }

            // Validar que la clave no exista
            if (repository.existsByClave(generoDTO.getClave().trim())) {
                respuesta.setExito(false);
                respuesta.setMensaje("Ya existe un género con la clave: " + generoDTO.getClave());
                return respuesta;
            }

            // Establecer fecha de alta si no viene
            LocalDate fechaAlta = generoDTO.getFechaAlta() != null ? generoDTO.getFechaAlta() : LocalDate.now();

            // Insertar el nuevo género (preservar mayúsculas/minúsculas tal como las envía
            // el frontend)
            repository.insertGenero(
                    generoDTO.getClave().trim(),
                    generoDTO.getDescripcion().trim(),
                    fechaAlta);

            respuesta.setExito(true);
            respuesta.setMensaje("Género creado exitosamente");
            respuesta.setDatos("Clave: " + generoDTO.getClave());

        } catch (Exception e) {
            respuesta.setExito(false);
            respuesta.setMensaje("Error al crear el género: " + e.getMessage());
        }
        return respuesta;
    }

    @Override
    @Transactional
    public ConsultaRespuesta<String> updateGenero(Integer id, CatGeneroUpdateDTO generoDTO) {
        ConsultaRespuesta<String> respuesta = new ConsultaRespuesta<>();
        try {
            // Validar que el ID existe
            Optional<CatGenero> generoExistente = repository.findById(id);
            if (!generoExistente.isPresent()) {
                respuesta.setExito(false);
                respuesta.setMensaje("No se encontró el género con ID: " + id);
                return respuesta;
            }

            // Validar datos requeridos
            if (generoDTO.getClave() == null || generoDTO.getClave().trim().isEmpty()) {
                respuesta.setExito(false);
                respuesta.setMensaje("La clave es requerida");
                return respuesta;
            }

            if (generoDTO.getDescripcion() == null || generoDTO.getDescripcion().trim().isEmpty()) {
                respuesta.setExito(false);
                respuesta.setMensaje("La descripción es requerida");
                return respuesta;
            }

            // Actualizar el género
            int filasActualizadas = repository.updateGenero(
                    id,
                    generoDTO.getClave().trim(),
                    generoDTO.getDescripcion().trim());

            if (filasActualizadas > 0) {
                respuesta.setExito(true);
                respuesta.setMensaje("Género actualizado exitosamente");
                respuesta.setDatos("ID actualizado: " + id);
            } else {
                respuesta.setExito(false);
                respuesta.setMensaje("No se pudo actualizar el género");
            }

        } catch (Exception e) {
            respuesta.setExito(false);
            respuesta.setMensaje("Error al actualizar el género: " + e.getMessage());
        }
        return respuesta;
    }

    @Override
    @Transactional
    public ConsultaRespuesta<String> cambiarEstatus(Integer id, Boolean estatus) {
        ConsultaRespuesta<String> respuesta = new ConsultaRespuesta<>();
        try {
            // Validar que el ID existe
            Optional<CatGenero> generoExistente = repository.findById(id);
            if (!generoExistente.isPresent()) {
                respuesta.setExito(false);
                respuesta.setMensaje("No se encontró el género con ID: " + id);
                return respuesta;
            }

            // Validar estatus
            if (estatus == null) {
                respuesta.setExito(false);
                respuesta.setMensaje("El estatus es requerido");
                return respuesta;
            }

            // Actualizar el estatus
            int filasActualizadas = repository.updateEstatus(id, estatus);

            if (filasActualizadas > 0) {
                respuesta.setExito(true);
                respuesta.setMensaje("Estatus actualizado exitosamente");
                respuesta.setDatos("ID actualizado: " + id + ", Nuevo estatus: " +
                        (estatus ? "Activo" : "Inactivo"));
            } else {
                respuesta.setExito(false);
                respuesta.setMensaje("No se pudo actualizar el estatus");
            }

        } catch (Exception e) {
            respuesta.setExito(false);
            respuesta.setMensaje("Error al cambiar el estatus: " + e.getMessage());
        }
        return respuesta;
    }

}
