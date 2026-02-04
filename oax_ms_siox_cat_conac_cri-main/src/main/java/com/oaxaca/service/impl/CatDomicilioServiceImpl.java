package com.oaxaca.service.impl;

import java.sql.Date;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;

import com.oaxaca.dto.CatEstadoDTO;
import com.oaxaca.dto.CatPaisDTO;
import com.oaxaca.dto.ConsultaRespuesta;
import com.oaxaca.dto.DistritoRegionDTO;
import com.oaxaca.dto.RegionEstadoDTO;
import com.oaxaca.dto.TblUsuariosDto;
import com.oaxaca.entity.CatLocalidad;
import com.oaxaca.entity.CatRegion;
import com.oaxaca.entity.TblUsuarios;
import com.oaxaca.repository.CatDomicilioRepositoryCustom;
import com.oaxaca.repository.CatPaisRepository;
import com.oaxaca.repository.CatRegionesRepository;
import com.oaxaca.service.ICatDomicilioService;
import com.oaxaca.spec.CatRegionesSpec;
import com.oaxaca.spec.TblUsuariosSpec;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class CatDomicilioServiceImpl implements ICatDomicilioService {

    @Autowired
    private com.oaxaca.repository.CatLocalidadRepository catLocalidadRepository;

    @Autowired
    private CatPaisRepository catPaisRepository;
    @Autowired
    private CatDomicilioRepositoryCustom catDomicilioRepositoryCustom;
    @Autowired
    CatRegionesRepository catRegionesRepository;
    @Autowired
    private com.oaxaca.repository.CatTipoVialidadRepository catTipoVialidadRepository;

    @Autowired
    private com.oaxaca.repository.CatTipoAsentamientoRepository catTipoAsentamientoRepository;

     ModelMapper modelMapper = new ModelMapper();

    public ConsultaRespuesta<List<com.oaxaca.dto.TipoAsentamientoDTO>> consultarTipoAsentamiento(
            String busqueda,
            String sort,
            Integer page,
            Integer pageSize) {
        ConsultaRespuesta<List<com.oaxaca.dto.TipoAsentamientoDTO>> respuesta = new ConsultaRespuesta<>();
        try {
            if (page == null || page < 1) {
                page = 1;
            }
            if (pageSize == null || pageSize < 1) {
                pageSize = 10;
            }
            if (sort == null || sort.trim().isEmpty()) {
                sort = "id ASC";
            }

            List<Map<String, Object>> results = catTipoAsentamientoRepository.getCatTipoAsentamientoNative(
                    busqueda, sort, page, pageSize);

            List<com.oaxaca.dto.TipoAsentamientoDTO> datos = results.stream().map(obj -> {
                com.oaxaca.dto.TipoAsentamientoDTO dto = new com.oaxaca.dto.TipoAsentamientoDTO();
                dto.setTotalRegistros(
                        obj.get("total_registros") != null ? ((Number) obj.get("total_registros")).intValue() : null);
                dto.setId(obj.get("id") != null ? ((Number) obj.get("id")).intValue() : null);
                dto.setClave(obj.get("clave") != null ? obj.get("clave").toString() : null);
                dto.setDescripcion(obj.get("descripcion") != null ? obj.get("descripcion").toString() : null);
                dto.setFechaAlta(obj.get("fecha_alta") instanceof java.sql.Date
                        ? new java.util.Date(((java.sql.Date) obj.get("fecha_alta")).getTime())
                        : null);
                dto.setIdUsuarioCreacion(
                        obj.get("id_usuario_creacion") != null ? ((Number) obj.get("id_usuario_creacion")).intValue()
                                : null);
                dto.setNombre(obj.get("nombre") != null ? obj.get("nombre").toString() : null);
                dto.setaPaterno(obj.get("a_paterno") != null ? obj.get("a_paterno").toString() : null);
                dto.setaMaterno(obj.get("a_materno") != null ? obj.get("a_materno").toString() : null);
                dto.setUsuarioCreacion(
                        obj.get("usuario_creacion") != null ? obj.get("usuario_creacion").toString() : null);
                dto.setEstatus(obj.get("estatus") != null ? Boolean.valueOf(obj.get("estatus").toString()) : null);
                return dto;
            }).collect(Collectors.toList());

            int totalRegistros = datos.isEmpty() ? 0
                    : (datos.get(0).getTotalRegistros() != null ? datos.get(0).getTotalRegistros() : 0);

            respuesta.setExito(true);
            respuesta.setMensaje("Consulta exitosa");
            respuesta.setDatos(datos);
            respuesta.setTotal(totalRegistros);
            respuesta.setPagina(page);
            respuesta.setTamano(pageSize);
        } catch (Exception e) {
            respuesta.setExito(false);
            respuesta.setMensaje("Error en la consulta: " + e.getMessage());
            respuesta.setDatos(java.util.Collections.emptyList());
            respuesta.setTotal(0);
            respuesta.setPagina(page != null ? page : 1);
            respuesta.setTamano(pageSize != null ? pageSize : 10);
        }
        return respuesta;
    }

    @Override
    public ConsultaRespuesta<List<DistritoRegionDTO>> getDistritoRegionRespuesta(String region, String id,
            String nombre, String fechaAlta, String sort, Integer page, Integer pageSize) {
        ConsultaRespuesta<List<DistritoRegionDTO>> respuesta = new ConsultaRespuesta<>();
        try {
            if (page == null || page < 1) {
                page = 1;
            }
            if (pageSize == null || pageSize < 1) {
                pageSize = 10;
            }
            if (sort == null || sort.trim().isEmpty()) {
                sort = "id_distrito ASC";
            }

            // Aquí deberías tener un repository que ejecute la función nativa
            // get_distrito_region
            // Por ejemplo: List<Object[]> results =
            // catDomicilioRepositoryCustom.findDistritoRegionNative(...)
            List<Object[]> results = catDomicilioRepositoryCustom.findDistritoRegionNative(
                    region, id, nombre, fechaAlta, sort, page, pageSize);

            List<DistritoRegionDTO> datos = results.stream().map(obj -> {
                DistritoRegionDTO dto = new DistritoRegionDTO();
                dto.setTotalRegistros(obj[0] != null ? ((Number) obj[0]).intValue() : null);
                dto.setIdDistrito(obj[1] != null ? ((Number) obj[1]).intValue() : null);
                dto.setDistrito(obj[2] != null ? obj[2].toString() : null);
                dto.setRegion(obj[3] != null ? obj[3].toString() : null);
                dto.setFechaAlta(
                        obj[4] instanceof java.sql.Date ? new java.util.Date(((java.sql.Date) obj[4]).getTime())
                                : null);
                return dto;
            }).collect(Collectors.toList());

            int totalRegistros = datos.isEmpty() ? 0
                    : (datos.get(0).getTotalRegistros() != null ? datos.get(0).getTotalRegistros() : 0);

            respuesta.setExito(true);
            respuesta.setMensaje("Consulta exitosa");
            respuesta.setDatos(datos);
            respuesta.setTotal(totalRegistros);
            respuesta.setPagina(page);
            respuesta.setTamano(pageSize);
        } catch (Exception e) {
            respuesta.setExito(false);
            respuesta.setMensaje("Error en la consulta: " + e.getMessage());
            respuesta.setDatos(null);
            respuesta.setTotal(0);
            respuesta.setPagina(page);
            respuesta.setTamano(pageSize);
        }
        return respuesta;
    }

    @Override
    public ConsultaRespuesta<List<CatPaisDTO>> getCatPais(Integer id, String nombre, String fechaAlta,
            String sort, Integer page, Integer pageSize) {
        ConsultaRespuesta<List<CatPaisDTO>> respuesta = new ConsultaRespuesta<>();
        try {
            if (page == null || page < 1) {
                page = 1;
            }
            if (pageSize == null || pageSize < 1) {
                pageSize = 10;
            }
            if (sort == null || sort.trim().isEmpty()) {
                sort = "id ASC";
            }

            List<Object[]> results = catPaisRepository.findCatPaisNative(
                    id,
                    nombre,
                    fechaAlta,
                    sort,
                    page,
                    pageSize);

            List<CatPaisDTO> datos = results.stream().map(obj -> {
                CatPaisDTO dto = new CatPaisDTO(
                        obj[0] != null ? ((Number) obj[0]).intValue() : null,
                        obj[1] != null ? ((Number) obj[1]).intValue() : null,
                        obj[2] != null ? obj[2].toString() : null,
                        obj[3] != null ? ((Date) obj[3]).toLocalDate() : null,
                        obj[4] != null ? ((Number) obj[4]).intValue() : null);
                return dto;
            }).collect(Collectors.toList());

            int totalRegistros = datos.isEmpty() ? 0
                    : (datos.get(0).getTotalRegistros() != null ? datos.get(0).getTotalRegistros() : 0);

            respuesta.setExito(true);
            respuesta.setMensaje("Consulta exitosa");
            respuesta.setDatos(datos);
            respuesta.setTotal(totalRegistros);
            respuesta.setPagina(page);
            respuesta.setTamano(pageSize);
        } catch (Exception e) {
            respuesta.setExito(false);
            respuesta.setMensaje("Error al consultar países: " + e.getMessage());
            respuesta.setDatos(List.of());
            respuesta.setTotal(0);
            respuesta.setPagina(page != null ? page : 1);
            respuesta.setTamano(pageSize != null ? pageSize : 10);
        }
        return respuesta;
    }

    @Override
    public ConsultaRespuesta<List<CatEstadoDTO>> getCatEstados(String pais, String id, String estado, String clave,
            String fechaAlta, String sort, Integer page, Integer pageSize) {
        ConsultaRespuesta<List<CatEstadoDTO>> respuesta = new ConsultaRespuesta<>();
        try {
            if (page == null || page < 1) {
                page = 1;
            }
            if (pageSize == null || pageSize < 1) {
                pageSize = 10;
            }
            if (sort == null || sort.trim().isEmpty()) {
                sort = "id DESC";
            }

            List<Object[]> results = catDomicilioRepositoryCustom.findCatEstadosNative(
                    pais, id != null ? String.valueOf(id) : null, estado, clave, fechaAlta, sort, page, pageSize);

            List<CatEstadoDTO> datos = results.stream().map(obj -> {
                CatEstadoDTO dto = new CatEstadoDTO();
                dto.setTotalRegistros(obj[0] != null ? ((Number) obj[0]).intValue() : null);
                dto.setId(obj[1] != null ? ((Number) obj[1]).intValue() : null);
                dto.setEstado(obj[2] != null ? obj[2].toString() : null);
                dto.setClave(obj[3] != null ? obj[3].toString() : null);
                dto.setFechaAlta(
                        obj[4] instanceof java.sql.Date ? new java.util.Date(((java.sql.Date) obj[4]).getTime())
                                : null);
                dto.setIdUsuarioCreacion(obj[5] != null ? ((Number) obj[5]).intValue() : null);
                dto.setIdPais(obj[6] != null ? ((Number) obj[6]).intValue() : null);
                dto.setPais(obj[7] != null ? obj[7].toString() : null);
                return dto;
            }).collect(Collectors.toList());

            int totalRegistros = datos.isEmpty() ? 0
                    : (datos.get(0).getTotalRegistros() != null ? datos.get(0).getTotalRegistros() : 0);

            respuesta.setExito(true);
            respuesta.setMensaje("Consulta exitosa");
            respuesta.setDatos(datos);
            respuesta.setTotal(totalRegistros);
            respuesta.setPagina(page);
            respuesta.setTamano(pageSize);
        } catch (Exception e) {
            respuesta.setExito(false);
            respuesta.setMensaje("Error al consultar estados: " + e.getMessage());
            respuesta.setDatos(List.of());
            respuesta.setTotal(0);
            respuesta.setPagina(page != null ? page : 1);
            respuesta.setTamano(pageSize != null ? pageSize : 10);
        }
        return respuesta;
    }

    @Override
    public ConsultaRespuesta<List<RegionEstadoDTO>> getRegionEstadoRespuesta(Map<String, String> params, String sort,
            Integer page, Integer pageSize) {
        // -------------------------
    // SORT SEGURO
    // -------------------------
    Sort sortBy = Sort.unsorted();

    if (sort != null && !sort.isBlank()) {
        String[] sortParams = sort.split("\\s+");

        if (sortParams.length == 2) {
            sortBy = Sort.by(
                    Sort.Direction.fromString(sortParams[1]),
                    sortParams[0]
            );
        }
    }

    // -------------------------
    // PAGINACIÓN BASE 1 → BASE 0
    // -------------------------
    int pageNumber = Math.max(page - 1, 0);

    Pageable pageable = PageRequest.of(pageNumber, pageSize, sortBy);

    Page<RegionEstadoDTO> pageResult = catRegionesRepository
            .findAll(filterWithParameters(params), pageable)
            .map(this::mapperDto);

    return ConsultaRespuesta.<List<RegionEstadoDTO>>builder()
            .exito(true)
            .mensaje("Consulta exitosa")
            .datos(pageResult.getContent())
            .total((int) pageResult.getTotalElements())
            .pagina(pageResult.getNumber() + 1) // regresamos base 1
            .tamano(pageResult.getSize())
            .build();
    }

    private RegionEstadoDTO mapperDto(CatRegion source) {
        return RegionEstadoDTO.builder()
        .id(source.getId())
        .estado(source.getEstados().stream()
            .map(e -> e.getEstado().getNombre())
            .findFirst()
            .orElse(null))
        .region(source.getNombre())
        .fechaAlta(source.getFechaAlta().toString())
        .build();
    }

    public Specification<CatRegion> filterWithParameters(Map<String, String> params) {
        return new CatRegionesSpec().getSpecificationByFilters(params);
    }

    /*@Override
    public ConsultaRespuesta<List<RegionEstadoDTO>> getRegionEstadoRespuesta(String estado, String id, String region,
            String fechaAlta, String sort, Integer page, Integer pageSize) {
        ConsultaRespuesta<List<RegionEstadoDTO>> respuesta = new ConsultaRespuesta<>();
        try {
            if (page == null || page < 1) {
                page = 1;
            }
            if (pageSize == null || pageSize < 1) {
                pageSize = 10;
            }
            if (sort == null || sort.trim().isEmpty()) {
                sort = "id DESC";
            }

            List<Object[]> results = catRegionesRepository.findCatRegionesNative(
                    estado, id != null ? String.valueOf(id) : null, region, fechaAlta, sort, page, pageSize);

            List<RegionEstadoDTO> datos = results.stream().map(obj -> {
                RegionEstadoDTO dto = new RegionEstadoDTO();
                dto.setTotalRegistros(obj[0] != null ? ((Number) obj[0]).intValue() : null);

                dto.setEstado(obj[1] != null ? obj[1].toString() : null);
                dto.setId(obj[2] != null ? Integer.valueOf(obj[2].toString()) : null);
                dto.setRegion(obj[3] != null ? obj[3].toString() : null);
                dto.setFechaAlta(
                        obj[4] instanceof java.sql.Date ? new java.util.Date(((java.sql.Date) obj[4]).getTime())
                                : null);
                return dto;
            }).collect(Collectors.toList());

            int totalRegistros = datos.isEmpty() ? 0
                    : (datos.get(0).getTotalRegistros() != null ? datos.get(0).getTotalRegistros() : 0);

            respuesta.setExito(true);
            respuesta.setMensaje("Consulta exitosa");
            respuesta.setDatos(datos);
            respuesta.setTotal(totalRegistros);
            respuesta.setPagina(page);
            respuesta.setTamano(pageSize);
        } catch (Exception e) {
            respuesta.setExito(false);
            respuesta.setMensaje("Error al consultar regiones: " + e.getMessage());
            respuesta.setDatos(List.of());
            respuesta.setTotal(0);
            respuesta.setPagina(page != null ? page : 1);
            respuesta.setTamano(pageSize != null ? pageSize : 10);
            log.error("Error al consultar regiones", e);
        }
        return respuesta;
    }*/

    @Override
    public ConsultaRespuesta<List<com.oaxaca.dto.MunicipioDistritoDTO>> getMunicipiosPorDistrito(
            String distrito,
            String claveMunicipio,
            String municipio,
            String fechaAlta,
            String sort,
            Integer page,
            Integer pageSize) {
        ConsultaRespuesta<List<com.oaxaca.dto.MunicipioDistritoDTO>> respuesta = new ConsultaRespuesta<>();
        try {
            if (page == null || page < 1) {
                page = 1;
            }
            if (pageSize == null || pageSize < 1) {
                pageSize = 10;
            }
            if (sort == null || sort.trim().isEmpty()) {
                sort = "clave_municipio ASC";
            }

            List<Object[]> results = catDomicilioRepositoryCustom.findMunicipiosPorDistritoNative(
                    distrito, claveMunicipio, municipio, fechaAlta, sort, page, pageSize);

            List<com.oaxaca.dto.MunicipioDistritoDTO> datos = results.stream().map(obj -> {
                com.oaxaca.dto.MunicipioDistritoDTO dto = new com.oaxaca.dto.MunicipioDistritoDTO();
                // total_registros (integer)
                dto.setTotalRegistros(obj[0] != null ? ((Number) obj[0]).intValue() : null);
                // distrito (text)
                dto.setDistrito(obj[1] != null ? obj[1].toString() : null);
                // clave_municipio (text)
                dto.setClaveMunicipio(obj[2] != null ? obj[2].toString() : null);
                // municipio (text)
                dto.setMunicipio(obj[3] != null ? obj[3].toString() : null);
                // fecha_alta (date)
                dto.setFechaAlta(
                        obj[4] instanceof java.sql.Date ? new java.util.Date(((java.sql.Date) obj[4]).getTime())
                                : null);
                return dto;
            }).collect(Collectors.toList());

            int totalRegistros = datos.isEmpty() ? 0
                    : (datos.get(0).getTotalRegistros() != null ? datos.get(0).getTotalRegistros() : 0);

            respuesta.setExito(true);
            respuesta.setMensaje("Consulta exitosa");
            respuesta.setDatos(datos);
            respuesta.setTotal(totalRegistros);
            respuesta.setPagina(page);
            respuesta.setTamano(pageSize);
        } catch (Exception e) {
            respuesta.setExito(false);
            respuesta.setMensaje("Error en la consulta: " + e.getMessage());
            respuesta.setDatos(null);
            respuesta.setTotal(0);
            respuesta.setPagina(page);
            respuesta.setTamano(pageSize);
            log.error("Error al consultar municipios por distrito", e);
        }
        return respuesta;
    }

    @Override
    public ConsultaRespuesta<List<com.oaxaca.dto.LocalidadDTO>> getLocalidades(
            String municipio,
            String claveLocalidad,
            String descripcion,
            String usuarioCreacion,
            String fechaAlta,
            String sort,
            Integer page,
            Integer pageSize) {
        ConsultaRespuesta<List<com.oaxaca.dto.LocalidadDTO>> respuesta = new ConsultaRespuesta<>();
        try {
            if (page == null || page < 1) {
                page = 1;
            }
            if (pageSize == null || pageSize < 1) {
                pageSize = 10;
            }
            if (sort == null || sort.trim().isEmpty()) {
                sort = "clave ASC";
            }

            List<Object[]> results = catDomicilioRepositoryCustom.findLocalidadesNative(
                    municipio, claveLocalidad, descripcion, usuarioCreacion, fechaAlta, sort, page, pageSize);

            List<com.oaxaca.dto.LocalidadDTO> datos = results.stream().map(obj -> {
                com.oaxaca.dto.LocalidadDTO dto = new com.oaxaca.dto.LocalidadDTO();
                dto.setTotalRegistros(obj[0] != null ? ((Number) obj[0]).intValue() : null);
                dto.setId(obj[1] != null ? ((Number) obj[1]).intValue() : null);
                dto.setMunicipio(obj[2] != null ? obj[2].toString() : null);
                dto.setClaveLocalidad(obj[3] != null ? obj[3].toString() : null);
                dto.setDescripcionLocalidad(obj[4] != null ? obj[4].toString() : null);
                dto.setEstatus(obj[7] != null ? Boolean.valueOf(obj[7].toString()) : null);
                dto.setFechaAlta(
                        obj[5] instanceof java.sql.Date ? new java.util.Date(((java.sql.Date) obj[5]).getTime())
                                : null);
                dto.setUsuarioCreacion(obj[6] != null ? obj[6].toString() : null);
                return dto;
            }).collect(Collectors.toList());

            int totalRegistros = datos.isEmpty() ? 0
                    : (datos.get(0).getTotalRegistros() != null ? datos.get(0).getTotalRegistros() : 0);

            respuesta.setExito(true);
            respuesta.setMensaje("Consulta exitosa");
            respuesta.setDatos(datos);
            respuesta.setTotal(totalRegistros);
            respuesta.setPagina(page);
            respuesta.setTamano(pageSize);
        } catch (Exception e) {
            respuesta.setExito(false);
            respuesta.setMensaje("Error en la consulta: " + e.getMessage());
            respuesta.setDatos(null);
            respuesta.setTotal(0);
            respuesta.setPagina(page);
            respuesta.setTamano(pageSize);
        }
        return respuesta;
    }

    public ConsultaRespuesta<String> insertarLocalidad(CatLocalidad localidad) {
        ConsultaRespuesta<String> respuesta = new ConsultaRespuesta<>();
        try {
            if (localidad.getClave() == null) {
                respuesta.setExito(false);
                respuesta.setMensaje("La clave es requerida");
                return respuesta;
            }
            if (catLocalidadRepository.existsByClave(localidad.getClave())) {
                respuesta.setExito(false);
                respuesta.setMensaje("Ya existe una localidad con la clave: " + localidad.getClave());
                return respuesta;
            }
            localidad.setFechaAlta(new java.util.Date());
            localidad.setEstatus(false);
            localidad.setIdUsuarioCreac(1);

            catLocalidadRepository.save(localidad);
            respuesta.setExito(true);
            respuesta.setMensaje("Registro Guardado de Forma Correcta");
            respuesta.setDatos("Clave: " + localidad.getClave());
        } catch (Exception e) {
            respuesta.setExito(false);
            respuesta.setMensaje("Error al crear la localidad: " + e.getMessage());
        }
        return respuesta;
    }

    public CatLocalidad actualizarLocalidad(Integer id, CatLocalidad localidad) {
        CatLocalidad existente = catLocalidadRepository.findById(id != null ? id : 0).orElse(null);
        if (existente != null) {
            existente.setDescripcion(localidad.getDescripcion());
            existente.setClave(localidad.getClave());
            existente.setEstatus(localidad.getEstatus());
            existente.setFechaAlta(localidad.getFechaAlta());
            return catLocalidadRepository.save(existente);
        }
        return null;
    }

    public boolean existeClaveLocalidad(Integer clave) {
        if (clave == null)
            return false;
        return catLocalidadRepository.existsByClave(clave);
    }

    @Override
    public boolean existeClaveLocalidadEnOtros(Integer id, Integer clave) {
        if (clave == null)
            return false;
        return catLocalidadRepository.existsByClaveAndIdNot(clave, id);
    }

    @Override
    public ConsultaRespuesta<String> actualizarEstatusLocalidades(java.util.List<Integer> ids, Boolean estatus) {
        ConsultaRespuesta<String> respuesta = new ConsultaRespuesta<>();
        try {
            if (ids == null || ids.isEmpty()) {
                respuesta.setExito(false);
                respuesta.setMensaje("Debe proporcionar al menos un ID");
                return respuesta;
            }
            if (estatus == null) {
                respuesta.setExito(false);
                respuesta.setMensaje("Debe proporcionar el valor de estatus");
                return respuesta;
            }
            int actualizados = 0;
            for (Integer id : ids) {
                CatLocalidad localidad = catLocalidadRepository.findById(id).orElse(null);
                if (localidad != null) {
                    Boolean estatusActual = estatus == false ? true : false;
                    localidad.setEstatus(estatusActual);
                    catLocalidadRepository.save(localidad);
                    actualizados++;
                }
            }
            respuesta.setExito(true);
            respuesta.setMensaje("Estatus actualizado para " + actualizados + " localidades");
            respuesta.setDatos("IDs: " + ids);
        } catch (Exception e) {
            respuesta.setExito(false);
            respuesta.setMensaje("Error al actualizar estatus: " + e.getMessage());
        }
        return respuesta;
    }

    @Override
    public ConsultaRespuesta<List<com.oaxaca.dto.VialidadDTO>> consultarVialidad(
            String busqueda,
            String sort,
            Integer page,
            Integer pageSize) {
        ConsultaRespuesta<List<com.oaxaca.dto.VialidadDTO>> respuesta = new ConsultaRespuesta<>();
        try {
            if (page == null || page < 1) {
                page = 1;
            }
            if (pageSize == null || pageSize < 1) {
                pageSize = 10;
            }
            if (sort == null || sort.trim().isEmpty()) {
                sort = "id ASC";
            }

            List<Map<String, Object>> results = catTipoVialidadRepository.getCatTipoVialidadNative(
                    busqueda, sort, page, pageSize);

            List<com.oaxaca.dto.VialidadDTO> datos = results.stream().map(obj -> {
                com.oaxaca.dto.VialidadDTO dto = new com.oaxaca.dto.VialidadDTO();
                dto.setTotalRegistros(
                        obj.get("total_registros") != null ? ((Number) obj.get("total_registros")).intValue() : null);
                dto.setId(obj.get("id") != null ? ((Number) obj.get("id")).intValue() : null);
                dto.setDescripcion(obj.get("descripcion") != null ? obj.get("descripcion").toString() : null);
                dto.setEstatus(obj.get("estatus") != null ? Boolean.valueOf(obj.get("estatus").toString()) : null);
                dto.setFechaAlta(obj.get("fecha_alta") instanceof java.sql.Date
                        ? new java.util.Date(((java.sql.Date) obj.get("fecha_alta")).getTime())
                        : null);
                dto.setUsuarioCreacion(
                        obj.get("usuario_creacion") != null ? ((String) obj.get("usuario_creacion")).toString()
                                : null);
                return dto;
            }).collect(Collectors.toList());

            int totalRegistros = datos.isEmpty() ? 0
                    : (datos.get(0).getTotalRegistros() != null ? datos.get(0).getTotalRegistros() : 0);

            respuesta.setExito(true);
            respuesta.setMensaje("Consulta exitosa");
            respuesta.setDatos(datos);
            respuesta.setTotal(totalRegistros);
            respuesta.setPagina(page);
            respuesta.setTamano(pageSize);
        } catch (Exception e) {
            respuesta.setExito(false);
            respuesta.setMensaje("Error en la consulta: " + e.getMessage());
            respuesta.setDatos(java.util.Collections.emptyList());
            respuesta.setTotal(0);
            respuesta.setPagina(page != null ? page : 1);
            respuesta.setTamano(pageSize != null ? pageSize : 10);
        }
        return respuesta;
    }

    @Override
    public ConsultaRespuesta<Integer> guardarVialidad(Map<String, String> body) {
        ConsultaRespuesta<Integer> respuesta = new ConsultaRespuesta<>();
        try {
            String descripcion = body.get("descripcion");
            if (descripcion == null || descripcion.trim().isEmpty()) {
                respuesta.setExito(false);
                respuesta.setMensaje("La descripción es obligatoria");
                return respuesta;
            }
            com.oaxaca.entity.CatTipoVialidad vialidad = new com.oaxaca.entity.CatTipoVialidad();
            vialidad.setDescripcion(descripcion);
            vialidad.setFechaAlta(new java.util.Date());
            vialidad.setEstatus(false);
            vialidad.setIdUsuarioCreacion(1);

            com.oaxaca.entity.CatTipoVialidad guardado = catTipoVialidadRepository.save(vialidad);
            respuesta.setExito(true);
            respuesta.setMensaje("Guardado exitoso");
            respuesta.setDatos(guardado.getId());
        } catch (Exception e) {
            respuesta.setExito(false);
            respuesta.setMensaje("Error al guardar: " + e.getMessage());
        }
        return respuesta;
    }

    @Override
    public ConsultaRespuesta<Boolean> actualizarEstatusVialidad(Integer id, Map<String, Boolean> body) {
        ConsultaRespuesta<Boolean> respuesta = new ConsultaRespuesta<>();
        try {
            Boolean estatus = body.get("estatus");
            com.oaxaca.entity.CatTipoVialidad vialidad = catTipoVialidadRepository.findById(id).orElse(null);
            if (vialidad == null) {
                respuesta.setExito(false);
                respuesta.setMensaje("No se encontró la vialidad");
                return respuesta;
            }
            vialidad.setEstatus(estatus);
            catTipoVialidadRepository.save(vialidad);
            respuesta.setExito(true);
            respuesta.setMensaje("Estatus actualizado");
            respuesta.setDatos(estatus);
        } catch (Exception e) {
            respuesta.setExito(false);
            respuesta.setMensaje("Error al actualizar estatus: " + e.getMessage());
        }
        return respuesta;
    }

    @Override
    public ConsultaRespuesta<String> actualizarDetalleVialidad(Integer id, Map<String, String> body) {
        ConsultaRespuesta<String> respuesta = new ConsultaRespuesta<>();
        try {
            String detalle = body.get("descripcion");
            com.oaxaca.entity.CatTipoVialidad vialidad = catTipoVialidadRepository.findById(id).orElse(null);
            if (vialidad == null) {
                respuesta.setExito(false);
                respuesta.setMensaje("No se encontró la vialidad");
                return respuesta;
            }
            vialidad.setDescripcion(detalle);
            catTipoVialidadRepository.save(vialidad);
            respuesta.setExito(true);
            respuesta.setMensaje("Detalle actualizado");
            respuesta.setDatos(detalle);
        } catch (Exception e) {
            respuesta.setExito(false);
            respuesta.setMensaje("Error al actualizar detalle: " + e.getMessage());
        }
        return respuesta;
    }

    
}
