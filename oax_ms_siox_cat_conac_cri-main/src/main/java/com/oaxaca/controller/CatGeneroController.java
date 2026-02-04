package com.oaxaca.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.oaxaca.dto.CatGeneroDTO;
import com.oaxaca.dto.CatGeneroUpdateDTO;
import com.oaxaca.dto.ConsultaRespuesta;
import com.oaxaca.service.ICatGeneroService;

@RestController
@RequestMapping("/genero")
public class CatGeneroController {

    private final ICatGeneroService catGeneroService;

    public CatGeneroController(ICatGeneroService catGeneroService) {
        this.catGeneroService = catGeneroService;
    }

    /**
     * Endpoint para obtener el catálogo de géneros con paginación y filtros
     * 
     * @param page        Número de página (default: 1)
     * @param pageSize    Tamaño de página (default: 10)
     * @param sort        Campo y dirección de ordenamiento (default: "id ASC")
     * @param clave       Filtro por clave (opcional)
     * @param descripcion Filtro por descripción (opcional)
     * @param fechaAlta   Filtro por fecha de alta (opcional)
     * @return ResponseEntity con los resultados paginados
     */
    @GetMapping("/consultar")
    public ResponseEntity<?> getCatGenero(
            @RequestParam(value = "page", defaultValue = "1") Integer page,
            @RequestParam(value = "pageSize", defaultValue = "10") Integer pageSize,
            @RequestParam(value = "sort", defaultValue = "id ASC") String sort,
            @RequestParam(value = "clave", required = false) String clave,
            @RequestParam(value = "descripcion", required = false) String descripcion,
            @RequestParam(value = "fechaAlta", required = false) String fechaAlta,
            @RequestParam(value = "bloqueado", required = false) String bloqueado) {
        Map<String, String> params = buildFilters(
                clave, descripcion, fechaAlta, bloqueado);

        ConsultaRespuesta<List<CatGeneroDTO>> respuesta = catGeneroService.getCatGenero(params, page, pageSize, sort);

        if (!respuesta.isExito()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", respuesta.getMensaje()));
        }

        if (respuesta.getDatos() == null || respuesta.getDatos().isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(respuesta);
    }

    private Map<String, String> buildFilters(
            String clave,
            String descripcion,
            String fechaAlta,
            String bloqueado) {

        Map<String, String> params = new HashMap<>();

        if (clave != null && !clave.isBlank()) {
            params.put("clave", clave);
        }
        if (descripcion != null && !descripcion.isBlank()) {
            params.put("descripcion", descripcion);
        }
        if (fechaAlta != null && !fechaAlta.isBlank()) {
            params.put("fechaAlta", fechaAlta);
        }
        if (bloqueado != null && !bloqueado.isBlank()) {
            params.put("bloqueado", bloqueado);
        }

        return params;
    }

    /**
     * Endpoint para registrar un nuevo género
     * 
     * @param generoDTO Datos del género a crear
     * @return ResponseEntity con el resultado de la operación
     */
    @PostMapping("/registrar")
    public ResponseEntity<?> createGenero(
            @RequestBody CatGeneroUpdateDTO generoDTO) {

        try {
            ConsultaRespuesta<String> respuesta = catGeneroService.createGenero(generoDTO);

            if (!respuesta.isExito()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", respuesta.getMensaje()));
            }

            return ResponseEntity.ok(respuesta);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Error al crear el género: " + e.getMessage()));
        }
    }

    /**
     * Endpoint para actualizar un género
     * 
     * @param id        ID del género a actualizar
     * @param generoDTO Datos del género a actualizar
     * @return ResponseEntity con el resultado de la operación
     */
    @PutMapping("/actualizar/{id}")
    public ResponseEntity<?> updateGenero(
            @PathVariable Integer id,
            @RequestBody CatGeneroUpdateDTO generoDTO) {

        try {
            ConsultaRespuesta<String> respuesta = catGeneroService.updateGenero(id, generoDTO);

            if (!respuesta.isExito()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", respuesta.getMensaje()));
            }

            return ResponseEntity.ok(respuesta);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Error al actualizar el género: " + e.getMessage()));
        }
    }

    /**
     * Endpoint para cambiar el estatus de un género (activar/desactivar)
     * 
     * @param id      ID del género
     * @param estatus Nuevo estatus (true = activo, false = inactivo)
     * @return ResponseEntity con el resultado de la operación
     */
    @PutMapping("/estatus/{id}")
    public ResponseEntity<?> cambiarEstatus(
            @PathVariable Integer id,
            @RequestParam Boolean estatus) {

        try {
            ConsultaRespuesta<String> respuesta = catGeneroService.cambiarEstatus(id, estatus);

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
}
