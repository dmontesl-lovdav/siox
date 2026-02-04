package com.oaxaca.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
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

import com.oaxaca.dto.CatEstructuraCuentasDTO;
import com.oaxaca.dto.ConsultaRespuesta;
import com.oaxaca.entity.CatEstructuraCuentas;
import com.oaxaca.service.ICatEstructuraCuentasService;

@RestController
@RequestMapping("/estructuraCuentas")
public class CatEstructuraCuentasController {

    private final ICatEstructuraCuentasService catEstructuraCuentasService;

    public CatEstructuraCuentasController(ICatEstructuraCuentasService catEstructuraCuentasService) {
        this.catEstructuraCuentasService = catEstructuraCuentasService;
    }

    /**
     * Endpoint para obtener el catálogo de estructura de cuentas con paginación y
     * búsqueda
     * 
     * @param page        Número de página (default: 1)
     * @param pageSize    Tamaño de página (default: 10)
     * @param sort        Campo y dirección de ordenamiento (default: "id ASC")
     * @param descripcion Filtro por descripción (opcional)
     * @param niveles     Filtro por niveles (opcional)
     * @param visible     Filtro por visible (opcional)
     * @param estatus     Filtro por estatus (opcional)
     * @param longitud    Filtro por longitud (opcional)
     * @return ResponseEntity con los resultados paginados
     */
    @GetMapping("/consultar")
    public ResponseEntity<?> getCatEstructuraCuentas(
            @RequestParam(value = "page", defaultValue = "1") Integer page,
            @RequestParam(value = "pageSize", defaultValue = "10") Integer pageSize,
            @RequestParam(value = "sort", defaultValue = "id ASC") String sort,
            @RequestParam(value = "descripcion", required = false) String descripcion,
            @RequestParam(value = "niveles", required = false) Integer niveles,
            @RequestParam(value = "visible", required = false) Boolean visible,
            @RequestParam(value = "estatus", required = false) Boolean estatus,
            @RequestParam(value = "longitud", required = false) Integer longitud) {

        try {
            ConsultaRespuesta<List<CatEstructuraCuentasDTO>> respuesta = catEstructuraCuentasService
                    .getCatEstructuraCuentas(page, pageSize, sort, descripcion, niveles, visible, estatus, longitud);

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

    /**
     * Endpoint para obtener un registro por ID
     * 
     * @param id ID del registro
     * @return ResponseEntity con el registro encontrado
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Integer id) {
        try {
            ConsultaRespuesta<CatEstructuraCuentas> respuesta = catEstructuraCuentasService.getById(id);

            if (!respuesta.isExito()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", respuesta.getMensaje()));
            }

            return ResponseEntity.ok(respuesta);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Error al procesar la solicitud: " + e.getMessage()));
        }
    }

    /**
     * Endpoint para crear un nuevo registro
     * 
     * @param catEstructuraCuentas Datos del nuevo registro
     * @return ResponseEntity con el registro creado
     */
    @PostMapping
    public ResponseEntity<?> create(@RequestBody CatEstructuraCuentas catEstructuraCuentas) {
        try {
            ConsultaRespuesta<CatEstructuraCuentas> respuesta = catEstructuraCuentasService
                    .create(catEstructuraCuentas);

            if (!respuesta.isExito()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", respuesta.getMensaje()));
            }

            return ResponseEntity.status(HttpStatus.CREATED).body(respuesta);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Error al procesar la solicitud: " + e.getMessage()));
        }
    }

    /**
     * Endpoint para actualizar un registro existente
     * 
     * @param id                   ID del registro a actualizar
     * @param catEstructuraCuentas Datos actualizados
     * @return ResponseEntity con el registro actualizado
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> update(
            @PathVariable Integer id,
            @RequestBody CatEstructuraCuentas catEstructuraCuentas) {
        try {
            ConsultaRespuesta<CatEstructuraCuentas> respuesta = catEstructuraCuentasService.update(id,
                    catEstructuraCuentas);

            if (!respuesta.isExito()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", respuesta.getMensaje()));
            }

            return ResponseEntity.ok(respuesta);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Error al procesar la solicitud: " + e.getMessage()));
        }
    }

    /**
     * Endpoint para actualizar el campo visible de un registro
     * 
     * @param id      ID del registro a actualizar
     * @param visible Nuevo valor para el campo visible (true o false)
     * @return ResponseEntity con el registro actualizado
     */
    @PutMapping("/{id}/visible")
    public ResponseEntity<?> updateVisible(
            @PathVariable Integer id,
            @RequestParam Boolean visible) {
        try {
            ConsultaRespuesta<CatEstructuraCuentas> respuesta = catEstructuraCuentasService.updateVisible(id,
                    visible);

            if (!respuesta.isExito()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", respuesta.getMensaje()));
            }

            return ResponseEntity.ok(respuesta);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Error al procesar la solicitud: " + e.getMessage()));
        }
    }

    /**
     * Endpoint para eliminar un registro
     * 
     * @param id ID del registro a eliminar
     * @return ResponseEntity con el resultado de la operación
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        try {
            ConsultaRespuesta<Void> respuesta = catEstructuraCuentasService.delete(id);

            if (!respuesta.isExito()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", respuesta.getMensaje()));
            }

            return ResponseEntity.ok(respuesta);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Error al procesar la solicitud: " + e.getMessage()));
        }
    }
}
