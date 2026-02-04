package com.oaxaca.controller;

import java.util.Date;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.oaxaca.dto.ConacConsultaDTO;
import com.oaxaca.dto.ConsultaRespuesta;
import com.oaxaca.entity.CatCuentaConac;
import com.oaxaca.entity.CatDatosCuentaConac;
import com.oaxaca.entity.CatGeneroConac;
import com.oaxaca.entity.CatGrupoConac;
import com.oaxaca.entity.CatRubroConac;
import com.oaxaca.entity.CatSubCuentaConac;
import com.oaxaca.service.ICatCuentaConacService;
import com.oaxaca.service.ICatDatosCuentaConacService;
import com.oaxaca.service.ICatGeneroConacService;
import com.oaxaca.service.ICatGrupoConacService;
import com.oaxaca.service.ICatRubroConacService;
import com.oaxaca.service.ICatSubCuentaConacService;
import com.oaxaca.service.ICatalogosService;
import com.oaxaca.service.IConacCargaArchivoService;
import com.oaxaca.service.IConacConsultaService;
import com.oaxaca.util.MensajesConstantes;

@RestController
@RequestMapping("/conac")
public class ConacController {
    @Autowired
    private IConacCargaArchivoService conacCargaArchivoService;
    @Autowired
    private ICatGeneroConacService catGeneroConacService;
    @Autowired
    private ICatGrupoConacService catGrupoConacService;
    @Autowired
    private ICatCuentaConacService catCuentaConacService;
    @Autowired
    private ICatRubroConacService catRubroConacService;
    @Autowired
    private ICatSubCuentaConacService catSubCuentaConacService;
    @Autowired
    private ICatDatosCuentaConacService catDatosCuentaConacService;
    @Autowired
    private ICatalogosService catCatalogosService;
    @Autowired
    private IConacConsultaService conacConsultaService;

    @PostMapping("/cargaArchivo")
    public ResponseEntity<?> cargarArchivo(
            @RequestParam("file") MultipartFile file,
            @RequestParam("ejercicio") Integer ejercicio) {
        Object resultado = conacCargaArchivoService.validarArchivo(file, ejercicio);
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

    /* Genero Service */
    @PostMapping("/genero/insertarGenero")
    public ResponseEntity<?> insertarGenero(
            @RequestParam("clave") String clave,
            @RequestParam("descripcion") String descripcion,
            @RequestParam("ejercicio") Integer ejercicio) {
        try {
            CatGeneroConac genero = catGeneroConacService.insertGeneroConac(clave, descripcion, ejercicio);
            return ResponseEntity.ok(Map.of(
                    MensajesConstantes.KEY_MENSAJE, MensajesConstantes.EXITO_GUARDAR_GENERO,
                    "genero", genero));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of(MensajesConstantes.KEY_ERROR, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of(MensajesConstantes.KEY_ERROR, MensajesConstantes.ERROR_GUARDAR_GENERO));
        }
    }

    @PostMapping("/genero/updateGenero")
    public ResponseEntity<?> updateGenero(
            @RequestParam("id") Integer id,
            @RequestParam("descripcion") String descripcion) {
        try {
            CatGeneroConac genero = catGeneroConacService.updateGeneroConac(id, descripcion);
            return ResponseEntity.ok(Map.of(
                    MensajesConstantes.KEY_MENSAJE, MensajesConstantes.EXITO_ACTUALIZAR_GENERO,
                    "genero", genero));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of(MensajesConstantes.KEY_ERROR, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of(MensajesConstantes.KEY_ERROR, MensajesConstantes.ERROR_ACTUALIZAR_GENERO));
        }
    }

    @GetMapping("/genero/getGeneroEjercicio")
    public Object getGeneroEjercicio(@RequestParam Integer ejercicio) {
        return catGeneroConacService != null ? catGeneroConacService.findAllByEjercicio(ejercicio) : null;
    }

    /* Grupo service */

    @PostMapping("/grupo/insertarGrupo")
    public ResponseEntity<?> insertarGrupo(
            @RequestParam("clave") String clave,
            @RequestParam("idGenero") Integer idGenero,
            @RequestParam("descripcion") String descripcion,
            @RequestParam("ejercicio") Integer ejercicio) {
        try {
            CatGrupoConac grupo = catGrupoConacService.insertarGrupo(clave, descripcion, ejercicio, idGenero);
            return ResponseEntity.ok(Map.of(
                    MensajesConstantes.KEY_MENSAJE, MensajesConstantes.EXITO_GUARDAR_GRUPO,
                    "grupo", grupo));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of(MensajesConstantes.KEY_ERROR, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of(MensajesConstantes.KEY_ERROR, MensajesConstantes.ERROR_GUARDAR_GRUPO));
        }
    }

    @PostMapping("/grupo/updateGrupo")
    public ResponseEntity<?> updateGupdateGrupoenero(
            @RequestParam("id") Integer id,
            @RequestParam("descripcion") String descripcion) {
        try {
            CatGrupoConac grupo = catGrupoConacService.updateGrupo(id, descripcion);
            return ResponseEntity.ok(Map.of(
                    MensajesConstantes.KEY_MENSAJE, MensajesConstantes.EXITO_ACTUALIZAR_GRUPO,
                    "grupo", grupo));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of(MensajesConstantes.KEY_ERROR, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of(MensajesConstantes.KEY_ERROR, MensajesConstantes.ERROR_ACTUALIZAR_GRUPO));
        }
    }

    @GetMapping("/grupo/getGrupoEjercicio")
    public Object getGrupoEjercicio(@RequestParam Integer ejercicio, @RequestParam Integer idGenero) {
        return catGrupoConacService != null ? catGrupoConacService.findAllByEjercicio(ejercicio, idGenero) : null;
    }

    /* Rubro service */

    @PostMapping("/rubro/insertarRubro")
    public ResponseEntity<?> insertarRubro(
            @RequestParam("clave") String clave,
            @RequestParam("idGenero") Integer idGenero,
            @RequestParam("idGrupo") Integer idGrupo,
            @RequestParam("descripcion") String descripcion,
            @RequestParam("ejercicio") Integer ejercicio) {
        try {
            CatRubroConac rubro = catRubroConacService.insertarRubro(clave, descripcion, ejercicio, idGrupo, idGenero);
            return ResponseEntity.ok(Map.of(
                    MensajesConstantes.KEY_MENSAJE, MensajesConstantes.EXITO_GUARDAR_RUBRO,
                    "cuenta", rubro));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of(MensajesConstantes.KEY_ERROR, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of(MensajesConstantes.KEY_ERROR, MensajesConstantes.ERROR_GUARDAR_RUBRO));
        }
    }

    @PostMapping("/rubro/updateRubro")
    public ResponseEntity<?> updateRubro(
            @RequestParam("id") Integer id,
            @RequestParam("descripcion") String descripcion) {
        try {
            CatRubroConac rubro = catRubroConacService.updateRubro(id, descripcion);
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
    public Object getRubroEjercicio(@RequestParam Integer ejercicio, @RequestParam Integer idGrupo) {
        return catRubroConacService != null ? catRubroConacService.findAllByEjercicio(ejercicio, idGrupo) : null;
    }

    /* Cuenta service */

    @PostMapping("/cuenta/insertarCuenta")
    public ResponseEntity<?> insertarGrupo(
            @RequestParam("clave") String clave,
            @RequestParam("idGenero") Integer idGenero,
            @RequestParam("idGrupo") Integer idGrupo,
            @RequestParam("idRubro") Integer idRubro,
            @RequestParam("descripcion") String descripcion,
            @RequestParam("ejercicio") Integer ejercicio) {
        try {
            CatCuentaConac cuenta = catCuentaConacService.insertarCuenta(clave, descripcion, ejercicio, idGenero,
                    idGrupo,
                    idRubro);
            return ResponseEntity.ok(Map.of(
                    MensajesConstantes.KEY_MENSAJE, MensajesConstantes.EXITO_GUARDAR_CUENTA,
                    "cuenta", cuenta));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of(MensajesConstantes.KEY_ERROR, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of(MensajesConstantes.KEY_ERROR, MensajesConstantes.ERROR_GUARDAR_CUENTA));
        }
    }

    @PostMapping("/cuenta/updateCuenta")
    public ResponseEntity<?> updateCuenta(
            @RequestParam("id") Integer id,
            @RequestParam("descripcion") String descripcion) {
        try {
            CatCuentaConac cuenta = catCuentaConacService.updateCuenta(id, descripcion);
            return ResponseEntity.ok(Map.of(
                    MensajesConstantes.KEY_MENSAJE, MensajesConstantes.EXITO_ACTUALIZAR_CUENTA,
                    "cuenta", cuenta));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of(MensajesConstantes.KEY_ERROR, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of(MensajesConstantes.KEY_ERROR, MensajesConstantes.ERROR_ACTUALIZAR_CUENTA));
        }
    }

    @GetMapping("/cuenta/getCuentaEjercicio")
    public Object getCuentaEjercicio(@RequestParam Integer ejercicio, @RequestParam Integer idRubro) {
        return catCuentaConacService != null ? catCuentaConacService.findAllByEjercicio(ejercicio, idRubro) : null;
    }

    /* Sub Cuenta service */

    @PostMapping("/subcuenta/insertarSubcuenta")
    public ResponseEntity<?> insertarSubcuenta(
            @RequestParam("clave") String clave,
            @RequestParam("idGenero") Integer idGenero,
            @RequestParam("idGrupo") Integer idGrupo,
            @RequestParam("idRubro") Integer idRubro,
            @RequestParam("idCuenta") Integer idCuenta,
            @RequestParam("descripcion") String descripcion,
            @RequestParam("ejercicio") Integer ejercicio) {
        try {
            CatSubCuentaConac subcuenta = catSubCuentaConacService.insertarSubcuenta(clave, descripcion, ejercicio,
                    idGenero, idGrupo, idRubro, idCuenta);
            return ResponseEntity.ok(Map.of(
                    MensajesConstantes.KEY_MENSAJE, MensajesConstantes.EXITO_GUARDAR_SUBCUENTA,
                    "subcuenta", subcuenta));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of(MensajesConstantes.KEY_ERROR, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of(MensajesConstantes.KEY_ERROR, MensajesConstantes.ERROR_GUARDAR_SUBCUENTA));
        }
    }

    @PostMapping("/subcuenta/updateSubcuenta")
    public ResponseEntity<?> updateSubcuenta(
            @RequestParam("id") Integer id,
            @RequestParam("descripcion") String descripcion) {
        try {
            CatSubCuentaConac subcuenta = catSubCuentaConacService.updateSubcuenta(id, descripcion);
            return ResponseEntity.ok(Map.of(
                    MensajesConstantes.KEY_MENSAJE, MensajesConstantes.EXITO_ACTUALIZAR_SUBCUENTA,
                    "subcuenta", subcuenta));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of(MensajesConstantes.KEY_ERROR, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of(MensajesConstantes.KEY_ERROR, MensajesConstantes.ERROR_ACTUALIZAR_SUBCUENTA));
        }
    }

    @GetMapping("/subcuenta/getSubcuentaEjercicio")
    public Object getSubcuentaEjercicio(@RequestParam Integer ejercicio, @RequestParam Integer idCuenta) {
        return catSubCuentaConacService != null ? catSubCuentaConacService.findAllByEjercicio(ejercicio, idCuenta)
                : null;
    }

    /* Datos Cuenta service */

    @PostMapping("/datosCuenta/insertarDatosCuenta")
    public ResponseEntity<?> insertarDatosCuenta(
            @RequestParam("idGenero") Integer idGenero,
            @RequestParam("idGrupo") Integer idGrupo,
            @RequestParam("idRubro") Integer idRubro,
            @RequestParam("idCuenta") Integer idCuenta,
            @RequestParam("idSubCuenta") Integer idSubCuenta,
            @RequestParam("idNaturaleza") Integer idNaturaleza,
            @RequestParam("idEstadoFinanciero") Integer idEstadoFinanciero,
            @RequestParam("idPosicionFinanciera") Integer idPosicionFinanciera,
            @RequestParam("idEstructura") Integer idEstructura,
            @RequestParam("inicioVigencia") String inicioVigencia,
            @RequestParam("finVigencia") String finVigencia,
            @RequestParam("ejercicio") Integer ejercicio) {
        try {
            java.util.Date inicio = new java.util.Date(inicioVigencia);
            java.util.Date fin = new java.util.Date(finVigencia);
            CatDatosCuentaConac datosCuenta = catDatosCuentaConacService.insertarDatosCuenta(idGenero, idGrupo, idRubro,
                    idCuenta, idSubCuenta, idNaturaleza, idEstadoFinanciero, idPosicionFinanciera, idEstructura,
                    inicio, fin, ejercicio);
            return ResponseEntity.ok(Map.of(
                    MensajesConstantes.KEY_MENSAJE, MensajesConstantes.EXITO_GUARDAR_DATOS_CUENTA,
                    "datosCuenta", datosCuenta));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of(MensajesConstantes.KEY_ERROR, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of(MensajesConstantes.KEY_ERROR,
                            MensajesConstantes.ERROR_GUARDAR_DATOS_CUENTA + e.getMessage()));
        }
    }

    @PostMapping("/datosCuenta/updateDatosCuenta")
    public ResponseEntity<?> updateDatosCuenta(
            @RequestParam("idGenero") Integer idGenero,
            @RequestParam("idGrupo") Integer idGrupo,
            @RequestParam("idRubro") Integer idRubro,
            @RequestParam("idCuenta") Integer idCuenta,
            @RequestParam("idSubCuenta") Integer idSubCuenta,
            @RequestParam("idNaturaleza") Integer idNaturaleza,
            @RequestParam("idEstadoFinanciero") Integer idEstadoFinanciero,
            @RequestParam("idPosicionFinanciera") Integer idPosicionFinanciera,
            @RequestParam("idEstructura") Integer idEstructura,
            @RequestParam("inicioVigencia") String inicioVigencia,
            @RequestParam("finVigencia") String finVigencia,
            @RequestParam("ejercicio") Integer ejercicio) {
        try {
            // Parsear fechas en formato ISO 8601
            java.util.Date inicio = java.util.Date.from(java.time.Instant.parse(inicioVigencia));
            java.util.Date fin = java.util.Date.from(java.time.Instant.parse(finVigencia));
            CatDatosCuentaConac datosCuenta = catDatosCuentaConacService.updateDatosCuenta(idGenero, idGrupo, idRubro,
                    idCuenta, idSubCuenta, idNaturaleza, idEstadoFinanciero, idPosicionFinanciera, idEstructura,
                    inicio, fin, ejercicio);
            
            // Crear respuesta usando HashMap para permitir valores null si es necesario
            java.util.Map<String, Object> response = new java.util.HashMap<>();
            response.put(MensajesConstantes.KEY_MENSAJE, MensajesConstantes.EXITO_ACTUALIZAR_DATOS_CUENTA);
            if (datosCuenta != null) {
                response.put("datosCuenta", datosCuenta);
            }
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of(MensajesConstantes.KEY_ERROR, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of(MensajesConstantes.KEY_ERROR, MensajesConstantes.ERROR_ACTUALIZAR_DATOS_CUENTA));
        }
    }

    @GetMapping("/catalogos/getNaturaleza")
    public Object getNaturaleza() {
        return catCatalogosService != null ? catCatalogosService.findAllNaturaleza() : null;
    }

    @GetMapping("/catalogos/getEstadoFinanciero")
    public Object getEstadoFinanciero() {
        return catCatalogosService != null ? catCatalogosService.findAllEstadoFinanciero() : null;
    }

    @GetMapping("/catalogos/getPosicion")
    public Object getPosicion() {
        return catCatalogosService != null ? catCatalogosService.findAllPosicion() : null;
    }

    @GetMapping("/catalogos/getEstructura")
    public Object getEstructura() {
        return catCatalogosService != null ? catCatalogosService.findAllEstructura() : null;
    }

    @GetMapping("/consultar")
    public ResponseEntity<?> consultarConac(
            @RequestParam(required = false) String cuenta,
            @RequestParam(required = false) String descripcion,
            @RequestParam(required = false) String naturaleza,
            @RequestParam(required = false) String estructura,
            @RequestParam(required = false) String estadoFinanciero,
            @RequestParam(required = false) String posicionFinanciera,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") Date fechaAlta,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") Date inicioVigencia,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") Date finVigencia,
            @RequestParam(required = false) String estatus,
            @RequestParam(required = true) Integer ejercicio,
            @RequestParam(required = false, defaultValue = "cuenta ASC") String sort,
            @RequestParam(required = true, defaultValue = "1") Integer page,
            @RequestParam(required = true, defaultValue = "10") Integer pageSize) {

        try {
            ConsultaRespuesta<List<ConacConsultaDTO>> resultado = conacConsultaService.consultarConac(
                    cuenta, descripcion, naturaleza, estructura, estadoFinanciero,
                    posicionFinanciera, fechaAlta, inicioVigencia, finVigencia,
                    estatus, ejercicio, sort, page, pageSize);

            if (resultado.isExito()) {
                return ResponseEntity.ok(resultado);
            } else {
                return ResponseEntity.badRequest().body(
                        Map.of(MensajesConstantes.KEY_ERROR, resultado.getMensaje()));
            }

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    Map.of(MensajesConstantes.KEY_ERROR,
                            "Error al consultar datos de CONAC: " + e.getMessage()));
        }
    }
}