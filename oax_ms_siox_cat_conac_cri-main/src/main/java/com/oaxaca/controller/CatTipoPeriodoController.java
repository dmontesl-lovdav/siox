package com.oaxaca.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.oaxaca.dto.CatTipoPeriodoDTO;
import com.oaxaca.dto.ConsultaRespuesta;
import com.oaxaca.service.ICatTipoPeriodoService;

@RestController
@RequestMapping("/tipoPeriodo")
public class CatTipoPeriodoController {

    private final ICatTipoPeriodoService catTipoPeriodoService;

    public CatTipoPeriodoController(ICatTipoPeriodoService catTipoPeriodoService) {
        this.catTipoPeriodoService = catTipoPeriodoService;
    }

    /**
     * Endpoint para obtener el catálogo de tipo periodo con paginación y búsqueda
     * 
     * @param page     Número de página (default: 1)
     * @param pageSize Tamaño de página (default: 10)
     * @param search   Término de búsqueda (opcional)
     * @param sort     Campo y dirección de ordenamiento (default: "id ASC")
     * @return ResponseEntity con los resultados paginados
     */
    @GetMapping("/consultar")
    public ResponseEntity<?> getCatTipoPeriodo(
            @RequestParam(value = "page", defaultValue = "1") Integer page,
            @RequestParam(value = "pageSize", defaultValue = "10") Integer pageSize,
            @RequestParam(value = "search", required = false) String search,
            @RequestParam(value = "sort", defaultValue = "id ASC") String sort) {

        try {
            ConsultaRespuesta<List<CatTipoPeriodoDTO>> respuesta = catTipoPeriodoService.getCatTipoPeriodo(
                    page, pageSize, search, sort);

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
}
