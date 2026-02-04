
package com.oaxaca.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.oaxaca.dto.ActualizarEstatusRequest;
import com.oaxaca.dto.CatEstadoDTO;
import com.oaxaca.dto.CatEstatusPolizaDTO;
import com.oaxaca.dto.CatEstatusPolizaUpdateDTO;
import com.oaxaca.dto.CatGrupoUnidadesResponsablesDTO;
import com.oaxaca.dto.CatGrupoUnidadesResponsablesUpdateDTO;
import com.oaxaca.dto.CatMomentoContableDTO;
import com.oaxaca.dto.CatMomentoContableUpdateDTO;
import com.oaxaca.dto.CatNombreAsentamientoDTO;
import com.oaxaca.dto.CatPaisDTO;
import com.oaxaca.dto.CatTipoPolizaDTO;
import com.oaxaca.dto.CatTipoPolizaUpdateDTO;
import com.oaxaca.dto.CatTipoSectorGubernamentalDTO;
import com.oaxaca.dto.CatTipoSectorGubernamentalUpdateDTO;
import com.oaxaca.dto.ConsultaRespuesta;
import com.oaxaca.dto.DistritoRegionDTO;
import com.oaxaca.dto.LocalidadDTO;
import com.oaxaca.dto.RegionEstadoDTO;
import com.oaxaca.entity.CatLocalidad;
import com.oaxaca.entity.CatTipoSectorGubernamental;
import com.oaxaca.service.ICatDomicilioService;
import com.oaxaca.service.ICatEstatusPolizaService;
import com.oaxaca.service.ICatGrupoUnidadesResponsablesService;
import com.oaxaca.service.ICatMomentoContableService;
import com.oaxaca.service.ICatTipoPolizaService;
import com.oaxaca.service.ICatTipoSectorGubernamentalService;

@RestController
@RequestMapping("/domicilio")
public class CatDomicilioController {

    @Autowired
    private com.oaxaca.service.ICatNombreAsentamientoService catNombreAsentamientoService;
    @Autowired
    private ICatDomicilioService catDomicilioService;

    @Autowired
    private ICatTipoSectorGubernamentalService catTipoSectorGubernamentalService;

    @Autowired
    private ICatGrupoUnidadesResponsablesService catGrupoUnidadesResponsablesService;

    @Autowired
    private ICatMomentoContableService catMomentoContableService;

    @Autowired
    private ICatEstatusPolizaService catEstatusPolizaService;

    @Autowired
    private ICatTipoPolizaService catTipoPolizaService;

    @Autowired
    private com.oaxaca.service.ICatTipoAsentamientoService catTipoAsentamientoService;

    @GetMapping("/consultar-pais")
    public ConsultaRespuesta<List<CatPaisDTO>> getCatPais(
            @RequestParam(required = false) Integer id,
            @RequestParam(required = false) String nombre,
            @RequestParam(required = false) String fechaAlta,
            @RequestParam(required = false) String sort,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        return catDomicilioService.getCatPais(id, nombre, fechaAlta, sort, page, pageSize);
    }

    @GetMapping("/consultar-estados")
    public ConsultaRespuesta<List<CatEstadoDTO>> getCatEstados(
            @RequestParam(required = false) String pais,
            @RequestParam(required = false) String id,
            @RequestParam(required = false) String estado,
            @RequestParam(required = false) String clave,
            @RequestParam(required = false) String fechaAlta,
            @RequestParam(required = false) String sort,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        return catDomicilioService.getCatEstados(pais, id, estado, clave, fechaAlta, sort, page, pageSize);
    }

    @GetMapping("/consultar-region-estado")
    public ConsultaRespuesta<List<RegionEstadoDTO>> getRegionEstado(
            @RequestParam(required = false) String estado,
            @RequestParam(required = false) String id,
            @RequestParam(required = false) String region,
            @RequestParam(required = false) String fechaAlta,
            @RequestParam(required = false) String sort,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer pageSize) {

        Map<String, String> params = new HashMap<>();

        if (estado != null) {
            params.put("estado", estado);
        }
        if (id != null) {
            params.put("id", id);
        }
        if (region != null) {
            params.put("region", region);
        }
        if (fechaAlta != null) {
            params.put("fechaAlta", fechaAlta);
        }

        return catDomicilioService.getRegionEstadoRespuesta(params, sort, page, pageSize);
    }

    @GetMapping("/consultar-distrito-region")
    public ConsultaRespuesta<List<DistritoRegionDTO>> getDistritoRegion(
            @RequestParam(required = false) String region,
            @RequestParam(required = false) String id,
            @RequestParam(required = false) String nombre,
            @RequestParam(required = false) String fechaAlta,
            @RequestParam(required = false) String sort,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        return catDomicilioService.getDistritoRegionRespuesta(region, id, nombre, fechaAlta, sort, page, pageSize);
    }

    @GetMapping("/consultar-municipios-por-distrito")
    public ConsultaRespuesta<List<com.oaxaca.dto.MunicipioDistritoDTO>> getMunicipiosPorDistrito(
            @RequestParam(required = false) String distrito,
            @RequestParam(required = false) String claveMunicipio,
            @RequestParam(required = false) String municipio,
            @RequestParam(required = false) String fechaAlta,
            @RequestParam(required = false) String sort,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        return catDomicilioService.getMunicipiosPorDistrito(distrito, claveMunicipio, municipio, fechaAlta, sort, page,
                pageSize);
    }

    @GetMapping("/consultar-localidades")
    public ConsultaRespuesta<List<com.oaxaca.dto.LocalidadDTO>> getLocalidades(
            @RequestParam(required = false) String municipio,
            @RequestParam(required = false) String claveLocalidad,
            @RequestParam(required = false) String descripcion,
            @RequestParam(required = false) String usuarioCreacion,
            @RequestParam(required = false) String fechaAlta,
            @RequestParam(required = false) String sort,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        return catDomicilioService.getLocalidades(municipio, claveLocalidad, descripcion, usuarioCreacion, fechaAlta,
                sort, page, pageSize);
    }

    @PostMapping("/localidad")
    public ResponseEntity<ConsultaRespuesta<String>> crearLocalidad(@RequestBody LocalidadDTO localidadDTO) {
        // Mapear DTO a entidad
        CatLocalidad localidad = new CatLocalidad();
        // municipio puede venir como String, convertir a Integer si es necesario
        try {
            localidad.setIdMunicipio(
                    localidadDTO.getMunicipio() != null ? Integer.valueOf(localidadDTO.getMunicipio()) : null);
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(new ConsultaRespuesta<>(false, "Municipio inválido", null));
        }
        try {
            localidad.setClave(
                    localidadDTO.getClaveLocalidad() != null ? Integer.valueOf(localidadDTO.getClaveLocalidad())
                            : null);
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest()
                    .body(new ConsultaRespuesta<>(false, "Clave de localidad inválida", null));
        }
        localidad.setDescripcion(localidadDTO.getDescripcionLocalidad());
        // Otros campos pueden ser seteados aquí si es necesario
        ConsultaRespuesta<String> respuesta = catDomicilioService.insertarLocalidad(localidad);
        if (respuesta.isExito()) {
            return ResponseEntity.ok(respuesta);
        } else {
            return ResponseEntity.badRequest().body(respuesta);
        }
    }

    @PutMapping("/localidad/{id}")
    public ResponseEntity<CatLocalidad> actualizarLocalidad(@PathVariable Integer id,
            @RequestBody LocalidadDTO localidadDTO) {
        // Mapear DTO a entidad
        CatLocalidad localidad = new CatLocalidad();
        // municipio puede venir como String, convertir a Integer si es necesario
        try {
            localidad.setIdMunicipio(
                    localidadDTO.getMunicipio() != null ? Integer.valueOf(localidadDTO.getMunicipio()) : null);
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().build();
        }
        try {
            localidad.setClave(
                    localidadDTO.getClaveLocalidad() != null ? Integer.valueOf(localidadDTO.getClaveLocalidad())
                            : null);
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().build();
        }
        localidad.setDescripcion(localidadDTO.getDescripcionLocalidad());
        // Otros campos pueden ser seteados aquí si es necesario
        CatLocalidad actualizada = catDomicilioService.actualizarLocalidad(id, localidad);
        if (actualizada != null) {
            return ResponseEntity.ok(actualizada);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/localidad/existe-clave/{clave}")
    public ResponseEntity<Boolean> existeClaveLocalidad(@PathVariable Integer clave) {
        boolean existe = catDomicilioService.existeClaveLocalidad(clave);
        return ResponseEntity.ok(existe);
    }

    @PutMapping("/localidad/estatus")
    public ResponseEntity<ConsultaRespuesta<String>> actualizarEstatusLocalidades(
            @RequestBody ActualizarEstatusRequest request) {
        ConsultaRespuesta<String> respuesta = catDomicilioService.actualizarEstatusLocalidades(request.getIds(),
                request.getEstatus());
        if (respuesta.isExito()) {
            return ResponseEntity.ok(respuesta);
        } else {
            return ResponseEntity.badRequest().body(respuesta);
        }
    }

    // ==================== TIPO SECTOR GUBERNAMENTAL ====================

    /**
     * Endpoint para obtener el catálogo de tipos de sector gubernamental con
     * paginación y filtros
     */
    @GetMapping("/consultar-tipo-sector-gubernamental")
    public ResponseEntity<?> getTipoSectorGubernamental(
            @RequestParam(value = "page", defaultValue = "1") Integer page,
            @RequestParam(value = "pageSize", defaultValue = "10") Integer pageSize,
            @RequestParam(value = "sort", defaultValue = "id ASC") String sort,
            @RequestParam(value = "clave", required = false) String clave,
            @RequestParam(value = "sector", required = false) String sector,
            @RequestParam(value = "activo", required = false) String activo) {

        try {
            Map<String, String> params = buildFilters(
                clave, sector, activo);
            ConsultaRespuesta<List<CatTipoSectorGubernamentalDTO>> respuesta = catTipoSectorGubernamentalService
                    .getCatTipoSectorGubernamental(params, page, pageSize, sort);

            if (!respuesta.isExito()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", respuesta.getMensaje()));
            }

            if (respuesta.getDatos() == null || respuesta.getDatos().isEmpty()) {
                return ResponseEntity.noContent().build();
            }

            return ResponseEntity.ok(respuesta);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Error al procesar la solicitud: " + e.getMessage()));
        }
    }

    private Map<String, String> buildFilters(
            String clave,
            String sector,
            String activo) {

        Map<String, String> params = new HashMap<>();

        if (clave != null && !clave.isBlank()) {
            params.put("clave", clave);
        }
        if (sector != null && !sector.isBlank()) {
            params.put("sector", sector);
        }
        if (activo != null && !activo.isBlank()) {
            params.put("activo", activo);
        }

        return params;
    }

    /**
     * Endpoint para registrar un nuevo tipo de sector gubernamental
     */
    @PostMapping("/tipo-sector-gubernamental")
    public ResponseEntity<?> createTipoSectorGubernamental(
            @RequestBody CatTipoSectorGubernamentalUpdateDTO tipoSectorDTO) {

        try {
            ConsultaRespuesta<CatTipoSectorGubernamental> respuesta = catTipoSectorGubernamentalService
                    .createTipoSectorGubernamental(tipoSectorDTO);

            if (!respuesta.isExito()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", respuesta.getMensaje()));
            }

            return ResponseEntity.ok(respuesta);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Error al crear el tipo de sector gubernamental: " + e.getMessage()));
        }
    }

    /**
     * Endpoint para actualizar un tipo de sector gubernamental
     */
    @PutMapping("/tipo-sector-gubernamental/{id}")
    public ResponseEntity<?> updateTipoSectorGubernamental(
            @PathVariable Integer id,
            @RequestBody CatTipoSectorGubernamentalUpdateDTO tipoSectorDTO) {

        try {
            ConsultaRespuesta<CatTipoSectorGubernamental> respuesta = catTipoSectorGubernamentalService
                    .updateTipoSectorGubernamental(id, tipoSectorDTO);

            if (!respuesta.isExito()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", respuesta.getMensaje()));
            }

            return ResponseEntity.ok(respuesta);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Error al actualizar el tipo de sector gubernamental: " + e.getMessage()));
        }
    }

    /**
     * Endpoint para cambiar el estatus de un tipo de sector gubernamental
     * (activar/desactivar)
     */
    @PutMapping("/tipo-sector-gubernamental-activo/{id}")
    public ResponseEntity<?> cambiarActivoTipoSectorGubernamental(
            @PathVariable Integer id,
            @RequestParam Boolean activo,
            @RequestParam Integer idUsuarioModificacion) {

        try {
            ConsultaRespuesta<String> respuesta = catTipoSectorGubernamentalService
                    .cambiarActivo(id, activo, idUsuarioModificacion);

            if (!respuesta.isExito()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", respuesta.getMensaje()));
            }

            return ResponseEntity.ok(respuesta);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Error al cambiar el estatus: " + e.getMessage()));
        }
    }

    // ==================== GRUPO UNIDADES RESPONSABLES ====================

    /**
     * Endpoint para consultar grupos de unidades responsables
     */
    @GetMapping("/consultar-grupo-unidades-responsables")
    public ResponseEntity<?> getGrupoUnidadesResponsables(
            @RequestParam(value = "page", defaultValue = "1") Integer page,
            @RequestParam(value = "pageSize", defaultValue = "10") Integer pageSize,
            @RequestParam(value = "sort", defaultValue = "clave DESC") String sort,
            @RequestParam(value = "clave", required = false) String clave,
            @RequestParam(value = "grupoUnidadResponsable", required = false) String grupoUnidadResponsable,
            @RequestParam(value = "activo", required = false) Boolean activo) {

        try {
            ConsultaRespuesta<List<CatGrupoUnidadesResponsablesDTO>> resp = catGrupoUnidadesResponsablesService
                    .getCatGrupoUnidadesResponsables(page, pageSize, sort, clave, grupoUnidadResponsable, activo);

            if (!resp.isExito()) {
                return ResponseEntity.badRequest().body(Map.of("error", resp.getMensaje()));
            }

            if (resp.getDatos() == null || resp.getDatos().isEmpty()) {
                return ResponseEntity.noContent().build();
            }

            return ResponseEntity.ok(resp);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Error al procesar la solicitud: " + e.getMessage()));
        }
    }

    /**
     * Endpoint para registrar un nuevo grupo de unidades responsables
     */
    @PostMapping("/grupo-unidades-responsables")
    public ResponseEntity<?> createGrupoUnidadesResponsables(@RequestBody CatGrupoUnidadesResponsablesUpdateDTO dto) {
        try {
            ConsultaRespuesta<String> resp = catGrupoUnidadesResponsablesService.createGur(dto);

            if (!resp.isExito()) {
                return ResponseEntity.badRequest().body(Map.of("error", resp.getMensaje()));
            }
            return ResponseEntity.ok(resp);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Error al registrar: " + e.getMessage()));
        }
    }

    /**
     * Endpoint para actualizar un grupo de unidades responsables
     */
    @PutMapping("/grupo-unidades-responsables/{id}")
    public ResponseEntity<?> updateGrupoUnidadesResponsables(@PathVariable Integer id,
            @RequestBody CatGrupoUnidadesResponsablesUpdateDTO dto) {
        try {
            ConsultaRespuesta<String> resp = catGrupoUnidadesResponsablesService.updateGur(id, dto);

            if (!resp.isExito()) {
                return ResponseEntity.badRequest().body(Map.of("error", resp.getMensaje()));
            }
            return ResponseEntity.ok(resp);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Error al actualizar: " + e.getMessage()));
        }
    }

    /**
     * Endpoint para eliminar (borrado lógico) un grupo de unidades responsables
     */
    @DeleteMapping("/grupo-unidades-responsables/{id}")
    public ResponseEntity<?> deleteGrupoUnidadesResponsables(@PathVariable Integer id,
            @RequestParam(value = "idUsuarioBaja") Integer idUsuarioBaja) {
        try {
            ConsultaRespuesta<String> resp = catGrupoUnidadesResponsablesService.deleteGur(id, idUsuarioBaja);

            if (!resp.isExito()) {
                return ResponseEntity.badRequest().body(Map.of("error", resp.getMensaje()));
            }
            return ResponseEntity.ok(resp);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Error al eliminar: " + e.getMessage()));
        }
    }

    // ==================== MOMENTO CONTABLE ====================

    /**
     * Endpoint para consultar momentos contables con paginación y filtros
     */
    @GetMapping("/consultar-momento-contable")
    public ResponseEntity<?> getMomentoContable(
            @RequestParam(value = "page", defaultValue = "1") Integer page,
            @RequestParam(value = "pageSize", defaultValue = "10") Integer pageSize,
            @RequestParam(value = "sort", defaultValue = "id ASC") String sort,
            @RequestParam(value = "clave", required = false) String clave,
            @RequestParam(value = "momentoContable", required = false) String momentoContable,
            @RequestParam(value = "tipoPolizaId", required = false) Integer tipoPolizaId,
            @RequestParam(value = "esPresupuestal", required = false) Boolean esPresupuestal,
            @RequestParam(value = "activo", required = false) Boolean activo) {
        try {
            ConsultaRespuesta<List<CatMomentoContableDTO>> respuesta = catMomentoContableService.getCatMomentoContable(
                    page, pageSize, sort, clave, momentoContable, tipoPolizaId, esPresupuestal, activo);

            if (!respuesta.isExito()) {
                return ResponseEntity.badRequest().body(Map.of("error", respuesta.getMensaje()));
            }

            if (respuesta.getDatos() == null || respuesta.getDatos().isEmpty()) {
                return ResponseEntity.noContent().build();
            }

            return ResponseEntity.ok(respuesta);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Error al procesar la solicitud: " + e.getMessage()));
        }
    }

    /**
     * Endpoint para registrar un nuevo momento contable
     */
    @PostMapping("/momento-contable")
    public ResponseEntity<?> createMomentoContable(@RequestBody CatMomentoContableUpdateDTO dto) {
        try {
            ConsultaRespuesta<String> respuesta = catMomentoContableService.createMomentoContable(dto);

            if (!respuesta.isExito()) {
                return ResponseEntity.badRequest().body(Map.of("error", respuesta.getMensaje()));
            }

            return ResponseEntity.ok(respuesta);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Error al crear el momento contable: " + e.getMessage()));
        }
    }

    /**
     * Endpoint para actualizar un momento contable
     */
    @PutMapping("/momento-contable/{id}")
    public ResponseEntity<?> updateMomentoContable(
            @PathVariable Integer id,
            @RequestBody CatMomentoContableUpdateDTO dto) {
        try {
            ConsultaRespuesta<String> respuesta = catMomentoContableService.updateMomentoContable(id, dto);

            if (!respuesta.isExito()) {
                return ResponseEntity.badRequest().body(Map.of("error", respuesta.getMensaje()));
            }

            return ResponseEntity.ok(respuesta);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Error al actualizar el momento contable: " + e.getMessage()));
        }
    }

    /**
     * Endpoint para eliminar (borrado lógico) un momento contable
     */
    @PutMapping("/momento-contable-eliminar/{id}")
    public ResponseEntity<?> deleteMomentoContable(
            @PathVariable Integer id,
            @RequestParam Integer idUsuarioBaja) {
        try {
            ConsultaRespuesta<String> respuesta = catMomentoContableService.deleteMomentoContable(id, idUsuarioBaja);

            if (!respuesta.isExito()) {
                return ResponseEntity.badRequest().body(Map.of("error", respuesta.getMensaje()));
            }

            return ResponseEntity.ok(respuesta);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Error al eliminar el momento contable: " + e.getMessage()));
        }
    }

    // ==================== ESTATUS POLIZA ====================

    @GetMapping("/consultar-estatus-poliza")
    public ResponseEntity<?> consultarEstatusPoliza(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(defaultValue = "id ASC") String sort,
            @RequestParam(required = false) String clave,
            @RequestParam(required = false) String estatus,
            @RequestParam(required = false) Boolean activo,
            @RequestParam(required = false) Boolean bloqueo) {
        try {
            List<CatEstatusPolizaDTO> resultado = catEstatusPolizaService.consultarCatEstatusPoliza(
                    page, pageSize, sort, clave, estatus, activo, bloqueo);
            return ResponseEntity.ok(resultado);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Error al consultar estatus de póliza: " + e.getMessage()));
        }
    }

    @PostMapping("/estatus-poliza")
    public ResponseEntity<?> crearEstatusPoliza(@RequestBody CatEstatusPolizaUpdateDTO dto) {
        try {
            ConsultaRespuesta<String> respuesta = catEstatusPolizaService.crearCatEstatusPoliza(dto);

            if (!respuesta.isExito()) {
                return ResponseEntity.badRequest().body(Map.of("error", respuesta.getMensaje()));
            }

            return ResponseEntity.ok(respuesta);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Error al crear estatus de póliza: " + e.getMessage()));
        }
    }

    @PutMapping("/estatus-poliza/{id}")
    public ResponseEntity<?> actualizarEstatusPoliza(
            @PathVariable Integer id,
            @RequestBody CatEstatusPolizaUpdateDTO updateDTO) {
        try {
            ConsultaRespuesta<String> respuesta = catEstatusPolizaService.actualizarCatEstatusPoliza(id, updateDTO);

            if (!respuesta.isExito()) {
                return ResponseEntity.badRequest().body(Map.of("error", respuesta.getMensaje()));
            }

            return ResponseEntity.ok(respuesta);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Error al actualizar estatus de póliza: " + e.getMessage()));
        }
    }

    @DeleteMapping("/estatus-poliza/{id}")
    public ResponseEntity<?> eliminarEstatusPoliza(
            @PathVariable Integer id,
            @RequestParam Integer idUsuarioBaja) {
        try {
            ConsultaRespuesta<String> respuesta = catEstatusPolizaService.eliminarCatEstatusPoliza(id, idUsuarioBaja);

            if (!respuesta.isExito()) {
                return ResponseEntity.badRequest().body(Map.of("error", respuesta.getMensaje()));
            }

            return ResponseEntity.ok(respuesta);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Error al eliminar estatus de póliza: " + e.getMessage()));
        }
    }

    @GetMapping("/vialidad/consultar-vialidad")
    public ConsultaRespuesta<List<com.oaxaca.dto.VialidadDTO>> consultarVialidad(
            @RequestParam(value = "busqueda", required = false) String busqueda,
            @RequestParam(value = "sort", required = false) String sort,
            @RequestParam(value = "page", defaultValue = "1") Integer page,
            @RequestParam(value = "pageSize", defaultValue = "10") Integer pageSize) {
        return catDomicilioService.consultarVialidad(busqueda, sort, page, pageSize);
    }

    @PostMapping("/vialidad")
    public ConsultaRespuesta<Integer> guardarVialidad(@RequestBody Map<String, String> body) {
        return catDomicilioService.guardarVialidad(body);
    }

    @PutMapping("/vialidad/{id}/estatus")
    public ConsultaRespuesta<Boolean> actualizarEstatusVialidad(@PathVariable Integer id,
            @RequestBody Map<String, Boolean> body) {
        return catDomicilioService.actualizarEstatusVialidad(id, body);
    }

    @PutMapping("/vialidad/{id}/detalle")
    public ConsultaRespuesta<String> actualizarDetalleVialidad(@PathVariable Integer id,
            @RequestBody Map<String, String> body) {
        return catDomicilioService.actualizarDetalleVialidad(id, body);
    }

    // ==================== TIPO POLIZA ====================

    @GetMapping("/consultar-tipo-poliza")
    public ResponseEntity<?> consultarTipoPoliza(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(defaultValue = "id ASC") String sort,
            @RequestParam(required = false) String clave,
            @RequestParam(required = false) String tipo,
            @RequestParam(required = false) Boolean activo) {
        try {
            List<CatTipoPolizaDTO> resultado = catTipoPolizaService.consultarCatTipoPoliza(
                    page, pageSize, sort, clave, tipo, activo);
            return ResponseEntity.ok(resultado);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Error al consultar tipo de póliza: " + e.getMessage()));
        }
    }

    @PostMapping("/tipo-poliza")
    public ResponseEntity<?> crearTipoPoliza(@RequestBody CatTipoPolizaUpdateDTO dto) {
        try {
            ConsultaRespuesta<String> respuesta = catTipoPolizaService.crearCatTipoPoliza(dto);

            if (!respuesta.isExito()) {
                return ResponseEntity.badRequest().body(Map.of("error", respuesta.getMensaje()));
            }

            return ResponseEntity.ok(respuesta);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Error al crear tipo de póliza: " + e.getMessage()));
        }
    }

    @PutMapping("/tipo-poliza")
    public ResponseEntity<?> actualizarTipoPoliza(@RequestBody CatTipoPolizaUpdateDTO updateDTO) {
        try {
            ConsultaRespuesta<String> respuesta = catTipoPolizaService.actualizarCatTipoPoliza(updateDTO);

            if (!respuesta.isExito()) {
                return ResponseEntity.badRequest().body(Map.of("error", respuesta.getMensaje()));
            }

            return ResponseEntity.ok(respuesta);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Error al actualizar tipo de póliza: " + e.getMessage()));
        }
    }

    @DeleteMapping("/tipo-poliza/{id}")
    public ResponseEntity<?> eliminarTipoPoliza(
            @PathVariable Integer id,
            @RequestParam Integer idUsuarioBaja) {
        try {
            ConsultaRespuesta<String> respuesta = catTipoPolizaService.eliminarCatTipoPoliza(id, idUsuarioBaja);

            if (!respuesta.isExito()) {
                return ResponseEntity.badRequest().body(Map.of("error", respuesta.getMensaje()));
            }

            return ResponseEntity.ok(respuesta);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Error al eliminar tipo de póliza: " + e.getMessage()));
        }
    }

    @GetMapping("/asentamiento/consultar-tipo-asentamiento")
    public ConsultaRespuesta<List<com.oaxaca.dto.TipoAsentamientoDTO>> consultarTipoAsentamiento(
            @RequestParam(value = "busqueda", required = false) String busqueda,
            @RequestParam(value = "sort", required = false) String sort,
            @RequestParam(value = "page", defaultValue = "1") Integer page,
            @RequestParam(value = "pageSize", defaultValue = "10") Integer pageSize) {
        return catDomicilioService.consultarTipoAsentamiento(busqueda, sort, page, pageSize);
    }

    @GetMapping("/localidad/existe-clave-otros/{id}/{clave}")
    public ResponseEntity<Boolean> existeClaveLocalidadEnOtros(@PathVariable Integer id, @PathVariable Integer clave) {
        boolean existe = catDomicilioService.existeClaveLocalidadEnOtros(id, clave);
        return ResponseEntity.ok(existe);
    }

    @PostMapping("/tipo-asentamiento")
    public ResponseEntity<?> guardarTipoAsentamiento(@RequestBody com.oaxaca.dto.CatTipoAsentamientoRequest request) {
        try {
            var tipo = catTipoAsentamientoService.guardarTipoAsentamiento(request.getClave(), request.getDescripcion());
            return ResponseEntity.ok(tipo);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/tipo-asentamiento/{id}/estatus")
    public ResponseEntity<?> cambiarEstatusTipoAsentamiento(@PathVariable Integer id, @RequestParam Boolean estatus) {
        try {
            var tipo = catTipoAsentamientoService.cambiarEstatus(id, estatus);
            return ResponseEntity.ok(tipo);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/tipo-asentamiento/{id}")
    public ResponseEntity<?> actualizarTipoAsentamiento(@PathVariable Integer id,
            @RequestBody com.oaxaca.dto.CatTipoAsentamientoRequest request) {
        try {
            var actualizado = catTipoAsentamientoService.actualizarTipoAsentamiento(id, request.getClave(),
                    request.getDescripcion());
            return ResponseEntity.ok(actualizado);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Endpoint para consultar cat_nombre_asentamiento usando la función
     * siox.get_cat_nombre_asentamiento
     */
    @GetMapping("/asentamiento/consultar-nombre-asentamiento")
    public ConsultaRespuesta<List<CatNombreAsentamientoDTO>> consultarNombreAsentamiento(
            @RequestParam(value = "busqueda", required = false) String busqueda,
            @RequestParam(value = "sort", required = false) String sort,
            @RequestParam(value = "page", defaultValue = "1") Integer page,
            @RequestParam(value = "pageSize", defaultValue = "10") Integer pageSize) {
        return catNombreAsentamientoService.buscarNombreAsentamiento(busqueda, sort, page, pageSize);
    }

    @PostMapping("/nombre-asentamiento/guardar")
    public ResponseEntity<?> guardarNombreAsentamiento(@RequestBody Map<String, Object> body) {
        try {
            Integer idTipoAsentamiento = (Integer) body.get("idTipoAsentamiento");
            String clave = (String) body.get("clave");
            String descripcion = (String) body.get("descripcion");
            if (idTipoAsentamiento == null || clave == null || descripcion == null) {
                return ResponseEntity.badRequest().body("Faltan datos requeridos");
            }
            var entidad = catNombreAsentamientoService.guardarNombreAsentamiento(idTipoAsentamiento, clave,
                    descripcion);
            return ResponseEntity.ok(entidad);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error al guardar: " + e.getMessage());
        }
    }

    @PutMapping("/nombre-asentamiento/actualizar/{id}")
    public ResponseEntity<?> actualizarNombreAsentamiento(@PathVariable Integer id,
            @RequestBody Map<String, Object> body) {
        try {
            Integer idTipoAsentamiento = (Integer) body.get("idTipoAsentamiento");
            String clave = (String) body.get("clave");
            String descripcion = (String) body.get("descripcion");
            var entidad = catNombreAsentamientoService.actualizarNombreAsentamiento(id, idTipoAsentamiento, clave,
                    descripcion);
            return ResponseEntity.ok(entidad);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error al actualizar: " + e.getMessage());
        }
    }

    @PutMapping("/nombre-asentamiento/estatus/{id}")
    public ResponseEntity<?> actualizarEstatusNombreAsentamiento(@PathVariable Integer id,
            @RequestBody Map<String, Object> body) {
        try {
            Boolean estatus = (Boolean) body.get("estatus");
            if (estatus == null) {
                return ResponseEntity.badRequest().body("Estatus requerido");
            }
            var entidad = catNombreAsentamientoService.actualizarEstatusNombreAsentamiento(id, estatus);
            return ResponseEntity.ok(entidad);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error al actualizar estatus: " + e.getMessage());
        }
    }
}
