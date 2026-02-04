package com.oaxaca.controller;

import java.sql.Date;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.oaxaca.dto.CriTablaDTO;
import com.oaxaca.entity.CatRubroCri;
import com.oaxaca.service.ICriCargaArchivoService;
import com.oaxaca.util.MensajesConstantes;

@RestController
@RequestMapping("/cri")
public class CriController {
    private final com.oaxaca.service.ICatConceptosCriService catConceptosCriService;
    private final ICriCargaArchivoService criCargaArchivoService;
    private final com.oaxaca.service.ICriObtenClasificadorService criTablaService;
    private final com.oaxaca.service.ICatRubroCriService catRubroCriService;
    private final com.oaxaca.service.ICatTipoCriService catTipoCriService;
    private final com.oaxaca.service.ICatClaseCriService catClaseCriService;

    public CriController(ICriCargaArchivoService criCargaArchivoService,
            com.oaxaca.service.ICriObtenClasificadorService criTablaService,
            com.oaxaca.service.ICatRubroCriService catRubroCriService,
            com.oaxaca.service.ICatTipoCriService catTipoCriService,
            com.oaxaca.service.ICatClaseCriService catClaseCriService,
            com.oaxaca.service.ICatConceptosCriService catConceptosCriService) {
        this.criCargaArchivoService = criCargaArchivoService;
        this.criTablaService = criTablaService;
        this.catRubroCriService = catRubroCriService;
        this.catTipoCriService = catTipoCriService;
        this.catClaseCriService = catClaseCriService;
        this.catConceptosCriService = catConceptosCriService;
    }

    @PostMapping("/cargaArchivo")
    public ResponseEntity<?> cargarArchivo(
            @RequestParam("file") MultipartFile file,
            @RequestParam("ejercicio") Integer ejercicio) {
        Object resultado = criCargaArchivoService.validarArchivo(file, ejercicio);
        if (resultado instanceof String) {
            String res = (String) resultado;
            if (res.endsWith(".txt")) {
                java.io.File archivo = new java.io.File(res);
                if (archivo.exists()) {
                    org.springframework.core.io.Resource resource = new org.springframework.core.io.FileSystemResource(
                            archivo);
                    return ResponseEntity.badRequest()
                            .header("Content-Disposition", "attachment; filename=" + archivo.getName())
                            .body(resource);
                } else {
                    return ResponseEntity.badRequest()
                            .body(Map.of(MensajesConstantes.KEY_ERROR, MensajesConstantes.ERROR_BITACORA_DESCARGA));
                }
            } else if (MensajesConstantes.OK.equals(res)) {
                return ResponseEntity.ok(Map.of(MensajesConstantes.KEY_MENSAJE, MensajesConstantes.MENSAJE_EXITO));
            } else {
                return ResponseEntity.badRequest().body(Map.of(MensajesConstantes.KEY_ERROR, res));
            }
        }
        return ResponseEntity.badRequest()
                .body(Map.of(MensajesConstantes.KEY_ERROR, MensajesConstantes.ERROR_INESPERADO));
    }

    @GetMapping("/getClasificadorRubroPaginado")
    public ResponseEntity<?> getClasificadorRubro(
            @RequestParam("ejercicio") Integer ejercicio) {
        var respuesta = criTablaService.obtenerTablaCombinada(ejercicio);
        if (!respuesta.isExito()) {
            return ResponseEntity.badRequest().body(Map.of("error", respuesta.getMensaje()));
        }
        if (respuesta.getDatos() == null || respuesta.getDatos().isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(respuesta);
    }

    /**
     * Endpoint para búsqueda avanzada con paginador y filtros.
     */
    @GetMapping("/buscarClasificadorPaginado")
    public ResponseEntity<?> buscarClasificadorPaginado(
            @RequestParam(value = "ejercicio", required = true) Integer ejercicio,
            @RequestParam(value = "ordenCampo", required = false, defaultValue = "clave ASC") String ordenCampo,
            @RequestParam(value = "tamano", defaultValue = "10") int tamano,
            @RequestParam(value = "pagina", defaultValue = "0") int pagina,
            @RequestParam(value = "clave", required = false) String clave,
            @RequestParam(value = "nombre", required = false) String nombre,
            @RequestParam(value = "descripcion", required = false) String descripcion,
            @RequestParam(value = "claveCompuesta", required = false) String claveCompuesta,
            @RequestParam(value = "fechaAlta", required = false) String fechaAlta,
            @RequestParam(value = "inicioVigencia", required = false) String inicioVigencia,
            @RequestParam(value = "finVigencia", required = false) String finVigencia) {
        CriTablaDTO req = new CriTablaDTO();
        Date fechaAltaDate = req.parseFecha(fechaAlta);
        Date inicioVigenciaDate = req.parseFecha(inicioVigencia);
        Date finVigenciaDate = req.parseFecha(finVigencia);
        var respuesta = criTablaService.buscarClasificadorPaginado(
                ejercicio, ordenCampo, tamano, pagina,
                clave, nombre, descripcion, claveCompuesta, fechaAltaDate, inicioVigenciaDate, finVigenciaDate);
        if (!respuesta.isExito()) {
            return ResponseEntity.badRequest().body(Map.of("error", respuesta.getMensaje()));
        }
        if (respuesta.getDatos() == null || respuesta.getDatos().isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(respuesta);
    }

    @PostMapping("/rubro/insertCatRubroCri")
    public ResponseEntity<?> insertCatRubroCri(
            @RequestParam("clave") String clave,
            @RequestParam("nombre") String nombre,
            @RequestParam("descripcion") String descripcion,
            @RequestParam("ejercicio") Integer ejercicio) {
        try {
            CatRubroCri rubro = catRubroCriService.insertRubroCri(clave, nombre, descripcion, ejercicio);
            return ResponseEntity.ok(Map.of(
                    MensajesConstantes.KEY_MENSAJE, MensajesConstantes.EXITO_GUARDAR_RUBRO,
                    "rubro", rubro));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of(MensajesConstantes.KEY_ERROR, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of(MensajesConstantes.KEY_ERROR, MensajesConstantes.ERROR_GUARDAR_RUBRO));
        }
    }

    @PostMapping("/rubro/updateCatRubroCri")
    public ResponseEntity<?> updateCatRubroCri(
            @RequestParam("id") Integer id,
            @RequestParam("nombre") String nombre,
            @RequestParam("descripcion") String descripcion) {
        try {
            CatRubroCri rubro = catRubroCriService.updateRubroCri(id, nombre, descripcion);
            return ResponseEntity.ok(Map.of(
                    MensajesConstantes.KEY_MENSAJE, MensajesConstantes.EXITO_ACTUALIZAR_RUBRO,
                    "rubro", rubro));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of(MensajesConstantes.KEY_ERROR, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of(MensajesConstantes.KEY_ERROR, MensajesConstantes.ERROR_ACTUALIZAR_RUBRO));
        }
    }

    @GetMapping("/rubro/getRubroEjercicio")
    public Object buscarRubrosPorEjercicio(@RequestParam Integer ejercicio) {
        return catRubroCriService != null ? catRubroCriService.findAllByEjercicio(ejercicio) : null;
    }

    // --- CatTipoCri ---
    @GetMapping("/tipo/buscarPorEjercicio")
    public ResponseEntity<?> buscarTipoPorEjercicio(@RequestParam Integer ejercicio, @RequestParam Integer idRubro) {
        return ResponseEntity.ok(catTipoCriService.findAllByEjercicioAndIdRubro(ejercicio, idRubro));
    }

    @PostMapping("/tipo/insertar")
    public ResponseEntity<?> insertarTipo(
            @RequestParam String clave,
            @RequestParam String nombre,
            @RequestParam String descripcion,
            @RequestParam Integer idRubro,
            @RequestParam Integer ejercicio) {
        try {
            return ResponseEntity.ok(catTipoCriService.insertTipoCri(clave, nombre, descripcion, idRubro, ejercicio));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/tipo/actualizar")
    public ResponseEntity<?> actualizarTipo(
            @RequestParam Integer id,
            @RequestParam String nombre,
            @RequestParam String descripcion) {
        try {
            return ResponseEntity
                    .ok(catTipoCriService.updateTipoCri(id, nombre, descripcion));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // --- CatClaseCri ---
    @GetMapping("/clase/buscarPorEjercicio")
    public ResponseEntity<?> buscarClasePorEjercicio(@RequestParam Integer ejercicio, @RequestParam Integer idTipo) {
        return ResponseEntity.ok(catClaseCriService.findAllByEjercicioAndIdTipo(ejercicio, idTipo));
    }

    @PostMapping("/clase/insertar")
    public ResponseEntity<?> insertarClase(
            @RequestParam String clave,
            @RequestParam String nombre,
            @RequestParam String descripcion,
            @RequestParam Integer idTipo,
            @RequestParam Integer idRubro,
            @RequestParam Integer ejercicio) {
        try {
            return ResponseEntity
                    .ok(catClaseCriService.insertClaseCri(clave, nombre, descripcion, idTipo, idRubro, ejercicio));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/clase/actualizar")
    public ResponseEntity<?> actualizarClase(
            @RequestParam Integer id,
            @RequestParam String nombre,
            @RequestParam String descripcion) {
        try {
            return ResponseEntity
                    .ok(catClaseCriService.updateClaseCri(id, nombre, descripcion));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // --- CatConceptosCri ---
    @GetMapping("/concepto/buscarPorEjercicio")
    public ResponseEntity<?> buscarConceptoPorEjercicio(@RequestParam Integer ejercicio,
            @RequestParam Integer idClase) {
        return ResponseEntity.ok(catConceptosCriService.findAllByEjercicioAndIdClase(ejercicio, idClase));
    }

    @PostMapping("/concepto/insertar")
    public ResponseEntity<?> insertarConcepto(
            @RequestParam String clave,
            @RequestParam String nombre,
            @RequestParam String descripcion,
            @RequestParam Integer idRubro,
            @RequestParam Integer idTipo,
            @RequestParam Integer idClase,
            @RequestParam String inicioVigencia,
            @RequestParam String finVigencia,
            @RequestParam Integer ejercicio) {
        try {
            java.util.Date inicio = new java.util.Date(inicioVigencia);
            java.util.Date fin = new java.util.Date(finVigencia);
            return ResponseEntity.ok(catConceptosCriService.insertConceptoCri(clave, nombre, descripcion, idRubro,
                    idTipo, idClase, inicio, fin, ejercicio));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/concepto/actualizar")
    public ResponseEntity<?> actualizarConcepto(
            @RequestParam Integer id,
            @RequestParam String nombre,
            @RequestParam String descripcion,
            @RequestParam Integer idClase,
            @RequestParam String inicioVigencia,
            @RequestParam String finVigencia) {
        try {
            java.text.SimpleDateFormat sdf = new java.text.SimpleDateFormat("yyyy-MM-dd");
            java.util.Date inicio = null;
            java.util.Date fin = null;
            if (inicioVigencia != null && !inicioVigencia.isEmpty()) {
                try {
                    inicio = sdf.parse(inicioVigencia);
                } catch (java.text.ParseException pe) {
                    return ResponseEntity.badRequest()
                            .body(java.util.Map.of("error", "Formato de fecha inválido para inicioVigencia"));
                }
            }
            if (finVigencia != null && !finVigencia.isEmpty()) {
                try {
                    fin = sdf.parse(finVigencia);
                } catch (java.text.ParseException pe) {
                    return ResponseEntity.badRequest()
                            .body(java.util.Map.of("error", "Formato de fecha inválido para finVigencia"));
                }
            }
            return ResponseEntity
                    .ok(catConceptosCriService.updateConceptoCri(id, nombre, descripcion, idClase, inicio, fin));
        } catch (Exception e) {
            String msg = e.getMessage() != null ? e.getMessage() : "Error inesperado";
            return ResponseEntity.badRequest().body(java.util.Map.of("error", msg));
        }
    }

}
