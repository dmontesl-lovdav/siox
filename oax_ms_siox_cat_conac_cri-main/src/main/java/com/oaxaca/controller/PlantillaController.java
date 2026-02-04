package com.oaxaca.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.oaxaca.entity.TblParametros;
import com.oaxaca.service.IPlantillaService;

@RestController
@RequestMapping("/plantillas")
public class PlantillaController {

    @Autowired
    private IPlantillaService plantillaService;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadPlantilla(
            @RequestParam("archivo") MultipartFile archivo,
            @RequestParam("parametro") String parametro,
            @RequestParam("descripcion") String descripcion,
            @RequestParam("idSistema") Integer idSistema) {
        return plantillaService.guardarPlantilla(archivo, parametro, descripcion, idSistema);
    }

    @GetMapping
    public ResponseEntity<List<TblParametros>> listarPlantillas(@RequestParam("idSistema") Integer idSistema) {
        List<TblParametros> plantillas = plantillaService.listarPlantillas(idSistema);
        return ResponseEntity.ok(plantillas);
    }

    @GetMapping("/descargaPlantilla")
    public ResponseEntity<byte[]> descargaPlantilla(
            @RequestParam("idSistema") Integer idSistema,
            @RequestParam("parametro") String parametro) throws IOException {
        return plantillaService.descargarArchivoPlantilla(idSistema, parametro);
    }
}
