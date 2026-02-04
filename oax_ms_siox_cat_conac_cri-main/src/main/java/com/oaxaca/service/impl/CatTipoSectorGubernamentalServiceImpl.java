package com.oaxaca.service.impl;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.oaxaca.dto.CatGeneroDTO;
import com.oaxaca.dto.CatTipoSectorGubernamentalDTO;
import com.oaxaca.dto.CatTipoSectorGubernamentalUpdateDTO;
import com.oaxaca.dto.ConsultaRespuesta;
import com.oaxaca.dto.TblUsuariosDto;
import com.oaxaca.entity.CatGenero;
import com.oaxaca.entity.CatTipoSectorGubernamental;
import com.oaxaca.entity.TblUsuarios;
import com.oaxaca.repository.CatTipoSectorGubernamentalRepository;
import com.oaxaca.service.ICatTipoSectorGubernamentalService;
import com.oaxaca.service.TblUsuariosService;
import com.oaxaca.spec.CatGeneroSpec;
import com.oaxaca.spec.CatTipoSectorGubernamentalSpec;
import com.oaxaca.util.ClaveGenerator;

@Service
public class CatTipoSectorGubernamentalServiceImpl implements ICatTipoSectorGubernamentalService {

    @Autowired
    private CatTipoSectorGubernamentalRepository repository;

    @Autowired
    private TblUsuariosService usuariosService;

    /*
     * @Override
     * public ConsultaRespuesta<List<CatTipoSectorGubernamentalDTO>>
     * getCatTipoSectorGubernamental(
     * Integer page,
     * Integer pageSize,
     * String sort,
     * String clave,
     * String sector,
     * Boolean activo) {
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
     * // Llamar a la función de PostgreSQL
     * List<Object[]> resultados = repository.getCatTipoSectorGubernamental(
     * page, pageSize, sort, clave, sector, activo);
     * 
     * // Convertir los resultados a DTOs
     * List<CatTipoSectorGubernamentalDTO> datos = new ArrayList<>();
     * Integer totalRegistros = 0;
     * 
     * for (Object[] row : resultados) {
     * CatTipoSectorGubernamentalDTO dto = new CatTipoSectorGubernamentalDTO();
     * 
     * // total_registros (solo para obtener el valor global)
     * if (row[0] != null) {
     * totalRegistros = ((Number) row[0]).intValue();
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
     * // sector
     * if (row[3] != null) {
     * dto.setSector(row[3].toString().trim());
     * }
     * 
     * // fecha_inicio_vigencia
     * if (row[4] != null) {
     * dto.setFechaInicioVigencia(((java.sql.Date) row[4]).toLocalDate());
     * }
     * 
     * // fecha_fin_vigencia
     * if (row[5] != null) {
     * dto.setFechaFinVigencia(((java.sql.Date) row[5]).toLocalDate());
     * }
     * 
     * // id_usuario_creacion
     * Integer idUsuarioCreacion = null;
     * 
     * 
     * if (row[6] != null) {
     * idUsuarioCreacion = ((Number) row[6]).intValue();
     * TblUsuariosDto user = usuariosService.findOne(idUsuarioCreacion.longValue());
     * if (user != null) {
     * dto.setUsuarioCreacion(user);
     * } else {
     * dto.setUsuarioCreacion(TblUsuariosDto.builder().id(idUsuarioCreacion.
     * longValue()).nombre("Usuario desconocido").build());
     * }
     * }
     * 
     * // fecha_alta
     * if (row[7] != null) {
     * dto.setFechaAlta(((java.sql.Timestamp) row[7]).toLocalDateTime());
     * }
     * 
     * // id_usuario_modificacion
     * Integer idUsuarioModificacion = null;
     * if (row[8] != null) {
     * idUsuarioModificacion = ((Number) row[8]).intValue();
     * TblUsuariosDto user =
     * usuariosService.findOne(idUsuarioModificacion.longValue());
     * if (user != null) {
     * dto.setUsuarioModificacion(user);
     * } else {
     * dto.setUsuarioModificacion(TblUsuariosDto.builder().id(idUsuarioModificacion.
     * longValue()).nombre("Usuario desconocido").build());
     * }
     * }
     * 
     * // fecha_modificacion
     * if (row[9] != null) {
     * dto.setFechaModificacion(((java.sql.Timestamp) row[9]).toLocalDateTime());
     * }
     * 
     * // activo
     * if (row[10] != null) {
     * dto.setActivo((Boolean) row[10]);
     * }
     * 
     * datos.add(dto);
     * }
     * 
     * // Crear la respuesta
     * ConsultaRespuesta<List<CatTipoSectorGubernamentalDTO>> respuesta = new
     * ConsultaRespuesta<>();
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
     * ConsultaRespuesta<List<CatTipoSectorGubernamentalDTO>> respuesta = new
     * ConsultaRespuesta<>();
     * respuesta.setExito(false);
     * respuesta.setMensaje("Error al consultar tipos de sector gubernamental: " +
     * e.getMessage());
     * respuesta.setDatos(new ArrayList<>());
     * respuesta.setTotal(0);
     * respuesta.setPagina(page != null ? page : 1);
     * respuesta.setTamano(pageSize != null ? pageSize : 10);
     * return respuesta;
     * }
     * }
     */

    @Override
    public ConsultaRespuesta<List<CatTipoSectorGubernamentalDTO>> getCatTipoSectorGubernamental(
            Map<String, String> filters, Integer page, Integer pageSize, String sort) {
        try {
            Pageable pageable = PageRequest.of(
                    Math.max((page != null ? page : 1) - 1, 0),
                    pageSize != null ? pageSize : 10,
                    buildSort(sort));

            Page<CatTipoSectorGubernamentalDTO> pageResult = repository
                    .findAll(filterWithParameters(filters), pageable)
                    .map(this::mapperDto);

            return ConsultaRespuesta.<List<CatTipoSectorGubernamentalDTO>>builder()
                    .exito(true)
                    .mensaje("Consulta exitosa")
                    .datos(pageResult.getContent())
                    .total((int) pageResult.getTotalElements())
                    .pagina(pageResult.getNumber() + 1)
                    .tamano(pageResult.getSize())
                    .build();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    private CatTipoSectorGubernamentalDTO mapperDto(CatTipoSectorGubernamental source) {
        return CatTipoSectorGubernamentalDTO.builder()
                .id(source.getId())
                .clave(source.getClave())
                .sector(source.getSector())
                .fechaInicioVigencia(source.getFechaInicioVigencia())
                .fechaFinVigencia(source.getFechaFinVigencia())
                .fechaAlta(source.getFechaAlta())
                .usuarioCreacion(source.getUsuarioCreacion() == null
                ? null
                : TblUsuariosDto.builder()
                    .id(source.getUsuarioCreacion().getId())
                    .nombre(source.getUsuarioCreacion().getNombre())
                    .aPaterno(source.getUsuarioCreacion().getAPaterno())
                    .aMaterno(source.getUsuarioCreacion().getAMaterno())
                    .correo(source.getUsuarioCreacion().getCorreo())
                    .fechaCreacion(source.getUsuarioCreacion().getFechaCreacion())
                    .fechaActualizacion(source.getUsuarioCreacion().getFechaActualizacion())
                    .activo(source.getUsuarioCreacion().getActivo())
                    .build())
                .usuarioModificacion(source.getUsuarioModificacion() == null
                ? null
                : TblUsuariosDto.builder()
                    .id(source.getUsuarioModificacion().getId())
                    .nombre(source.getUsuarioModificacion().getNombre())
                    .aPaterno(source.getUsuarioModificacion().getAPaterno())
                    .aMaterno(source.getUsuarioModificacion().getAMaterno())
                        .correo(source.getUsuarioModificacion().getCorreo())
                        .fechaCreacion(source.getUsuarioModificacion().getFechaCreacion())
                        .fechaActualizacion(source.getUsuarioModificacion().getFechaActualizacion())
                        .activo(source.getUsuarioModificacion().getActivo())
                        .build())
                .activo(source.getActivo())
                .build();
    }

    public Specification<CatTipoSectorGubernamental> filterWithParameters(Map<String, String> params) {
        return new CatTipoSectorGubernamentalSpec().getSpecificationByFilters(params);
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
    public ConsultaRespuesta<CatTipoSectorGubernamental> createTipoSectorGubernamental(
            CatTipoSectorGubernamentalUpdateDTO tipoSectorDTO) {
        ConsultaRespuesta<CatTipoSectorGubernamental> respuesta = new ConsultaRespuesta<>();
        try {
            // Validar datos requeridos

            if (tipoSectorDTO.getSector() == null || tipoSectorDTO.getSector().trim().isEmpty()) {
                respuesta.setExito(false);
                respuesta.setMensaje("El sector es requerido");
                return respuesta;
            }

            if (tipoSectorDTO.getSector().trim().length() > 100) {
                respuesta.setExito(false);
                respuesta.setMensaje("El sector no puede exceder 100 caracteres");
                return respuesta;
            }

            if (tipoSectorDTO.getFechaInicioVigencia() == null) {
                respuesta.setExito(false);
                respuesta.setMensaje("La fecha de inicio de vigencia es requerida");
                return respuesta;
            }

            if (tipoSectorDTO.getIdUsuarioCreacion() == null) {
                tipoSectorDTO.setIdUsuarioCreacion(1); // Usuario por defecto
            }

            // Validar que el sector no exista
            if (repository.existsBySector(tipoSectorDTO.getSector().trim())) {
                respuesta.setExito(false);
                respuesta.setMensaje(
                        "Ya existe un tipo de sector gubernamental con el sector: " + tipoSectorDTO.getSector());
                return respuesta;
            }

            // Validar fechas de vigencia
            if (tipoSectorDTO.getFechaFinVigencia() != null) {
                if (tipoSectorDTO.getFechaFinVigencia().isBefore(tipoSectorDTO.getFechaInicioVigencia())) {
                    respuesta.setExito(false);
                    respuesta.setMensaje(
                            "La fecha fin de vigencia debe ser mayor o igual a la fecha de inicio de vigencia");
                    return respuesta;
                }
            }
            // buscar usuario
            // solo esta temporal
            if(tipoSectorDTO.getIdUsuarioCreacion() == null){
                tipoSectorDTO.setIdUsuarioCreacion(1); // Usuario por defecto
            }
            Integer idUsuarioCreacion = tipoSectorDTO.getIdUsuarioCreacion();
            TblUsuarios usuarioCreacion = usuariosService.findUser(idUsuarioCreacion.longValue());

            // Insertar el nuevo tipo de sector gubernamental
            CatTipoSectorGubernamental entity = new CatTipoSectorGubernamental();

            entity.setClave(ClaveGenerator.generateClave());
            entity.setSector(tipoSectorDTO.getSector().trim());
            entity.setFechaInicioVigencia(tipoSectorDTO.getFechaInicioVigencia());
            entity.setFechaFinVigencia(tipoSectorDTO.getFechaFinVigencia());


            entity.setUsuarioCreacion(usuarioCreacion);
            entity.setFechaAlta(LocalDateTime.now());
            entity.setActivo(true);
            repository.saveAndFlush(entity);

            respuesta.setExito(true);
            respuesta.setMensaje("Tipo de sector gubernamental creado exitosamente");
            respuesta.setDatos(entity);

        } catch (Exception e) {
            e.printStackTrace();
            respuesta.setExito(false);
            respuesta.setMensaje("Error al crear el tipo de sector gubernamental: " + e.getMessage());
        }
        return respuesta;
    }

    @Override
    @Transactional
    public ConsultaRespuesta<CatTipoSectorGubernamental> updateTipoSectorGubernamental(Integer id,
            CatTipoSectorGubernamentalUpdateDTO tipoSectorDTO) {
        ConsultaRespuesta<CatTipoSectorGubernamental> respuesta = new ConsultaRespuesta<>();

        try {
            // Validar que el ID existe
            Optional<CatTipoSectorGubernamental> opt = repository.findById(id);
            if (!opt.isPresent()) {
                respuesta.setExito(false);
                respuesta.setMensaje("No se encontró el tipo de sector gubernamental con ID: " + id);
                return respuesta;
            }

            CatTipoSectorGubernamental entity = opt.get();

            // Validar datos requeridos

            if (tipoSectorDTO.getSector() == null || tipoSectorDTO.getSector().trim().isEmpty()) {
                respuesta.setExito(false);
                respuesta.setMensaje("El sector es requerido");
                return respuesta;
            }

            if (tipoSectorDTO.getSector().trim().length() > 100) {
                respuesta.setExito(false);
                respuesta.setMensaje("El sector no puede exceder 100 caracteres");
                return respuesta;
            }

            if (tipoSectorDTO.getFechaInicioVigencia() == null) {
                respuesta.setExito(false);
                respuesta.setMensaje("La fecha de inicio de vigencia es requerida");
                return respuesta;
            }

            if (tipoSectorDTO.getIdUsuarioModificacion() == null) {
                tipoSectorDTO.setIdUsuarioModificacion(1); // Usuario por defecto
            }

            // Validar que el sector no exista en otro registro
            String sectorNuevo = tipoSectorDTO.getSector().trim();
            if (repository.existsBySectorIgnoreCaseAndIdNot(sectorNuevo, id)) {
                respuesta.setExito(false);
                respuesta.setMensaje(
                        "Ya existe otro tipo de sector gubernamental con el sector: " + tipoSectorDTO.getSector());
                return respuesta;
            }

            // Validar fechas de vigencia
            if (tipoSectorDTO.getFechaFinVigencia() != null) {
                if (tipoSectorDTO.getFechaFinVigencia().isBefore(tipoSectorDTO.getFechaInicioVigencia())) {
                    respuesta.setExito(false);
                    respuesta.setMensaje(
                            "La fecha fin de vigencia debe ser mayor o igual a la fecha de inicio de vigencia");
                    return respuesta;
                }
            }

            // buscar usuario
            // solo esta temporal
            if(tipoSectorDTO.getIdUsuarioModificacion() == null){
                tipoSectorDTO.setIdUsuarioModificacion(1); // Usuario por defecto
            }
            Integer idUsuarioModificacion = tipoSectorDTO.getIdUsuarioModificacion();
            TblUsuarios usuarioModificacion = usuariosService.findUser(idUsuarioModificacion.longValue());

            // Actualizar el tipo de sector gubernamental
            entity.setSector(sectorNuevo);
            entity.setFechaInicioVigencia(tipoSectorDTO.getFechaInicioVigencia());
            entity.setFechaFinVigencia(tipoSectorDTO.getFechaFinVigencia());
            entity.setUsuarioModificacion(usuarioModificacion);
            entity.setFechaModificacion(LocalDateTime.now());
            repository.save(entity);

            respuesta.setExito(true);
            respuesta.setMensaje("Tipo de sector gubernamental actualizado exitosamente");
            respuesta.setDatos(entity);
        } catch (Exception e) {
            e.printStackTrace();
            respuesta.setExito(false);
            respuesta.setMensaje("Error al actualizar el tipo de sector gubernamental: " + e.getMessage());
        }

        return respuesta;
    }

    @Override
    @Transactional
    public ConsultaRespuesta<String> cambiarActivo(Integer id, Boolean activo, Integer idUsuarioModificacion) {
        ConsultaRespuesta<String> respuesta = new ConsultaRespuesta<>();
        try {
            // Validar que el ID existe
            Optional<CatTipoSectorGubernamental> tipoSectorExistente = repository.findById(id);
            if (!tipoSectorExistente.isPresent()) {
                respuesta.setExito(false);
                respuesta.setMensaje("No se encontró el tipo de sector gubernamental con ID: " + id);
                return respuesta;
            }

            // Validar activo
            if (activo == null) {
                respuesta.setExito(false);
                respuesta.setMensaje("El estatus activo es requerido");
                return respuesta;
            }

            // Validar usuario modificación
            if (idUsuarioModificacion == null) {
                idUsuarioModificacion = 1; // Usuario por defecto
            }
            TblUsuarios usuarioModificacion = usuariosService.findUser(idUsuarioModificacion.longValue());

            // Actualizar el estatus activo
            CatTipoSectorGubernamental entity = tipoSectorExistente.get();
            entity.setActivo(activo);
            entity.setUsuarioModificacion(usuarioModificacion);

            repository.save(entity);

            respuesta.setExito(true);
            respuesta.setMensaje("Estatus actualizado exitosamente");
            respuesta.setDatos("ID actualizado: " + id + ", Nuevo estatus: " +
                    (activo ? "Activo" : "Inactivo"));

        } catch (Exception e) {
            e.printStackTrace();
            respuesta.setExito(false);
            respuesta.setMensaje("Error al cambiar el estatus: " + e.getMessage());
        }
        return respuesta;
    }

}
