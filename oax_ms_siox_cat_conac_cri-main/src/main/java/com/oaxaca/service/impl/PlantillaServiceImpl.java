
package com.oaxaca.service.impl;

import java.io.File;
import java.nio.file.Files;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.oaxaca.entity.TblParametros;
import com.oaxaca.repository.CatSistemaRepository;
import com.oaxaca.repository.TblParametrosRepository;
import com.oaxaca.service.IPlantillaService;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class PlantillaServiceImpl implements IPlantillaService {

    @Value("${archivo.base-path}")
    private String rutaVolumen;

    private final TblParametrosRepository parametrosRepository;
    private final CatSistemaRepository catSistemaRepository;

    public PlantillaServiceImpl(TblParametrosRepository parametrosRepository,
            CatSistemaRepository catSistemaRepository) {
        this.parametrosRepository = parametrosRepository;
        this.catSistemaRepository = catSistemaRepository;
    }

    @Override
    public ResponseEntity<Map<String, Object>> guardarPlantilla(MultipartFile archivo, String parametro,
            String descripcion,
            Integer idSistema) {
        Map<String, Object> respuesta = new HashMap<>();
        try {
            if (!catSistemaRepository.existsById(idSistema)) {
                log.warn("No existe el sistema con id: {}", idSistema);
                respuesta.put("error", "No existe el sistema con id: " + idSistema);
                return ResponseEntity.badRequest().body(respuesta);
            }
            if (parametrosRepository.findByIdSistemaAndParametro(idSistema, parametro).isPresent()) {
                log.warn("Ya existe un parámetro '{}' para el sistema {}", parametro, idSistema);
                respuesta.put("error", "Ya existe un parámetro con ese nombre para el sistema");
                return ResponseEntity.badRequest().body(respuesta);
            }
            String nombreArchivo = archivo.getOriginalFilename();
            if (nombreArchivo != null) {
                nombreArchivo = nombreArchivo.trim().replaceAll("\\s+", "");
            } else {
                nombreArchivo = "archivo_subido";
            }
            // Generar nombre de carpeta aleatorio
            String nombreCarpeta = idSistema.toString();
            File directorioRandom = new File(rutaVolumen, nombreCarpeta);
            if (!directorioRandom.exists()) {
                boolean creado = directorioRandom.mkdirs();
                if (creado) {
                    log.info("Directorio aleatorio creado: {}", directorioRandom.getAbsolutePath());
                } else {
                    log.error("No se pudo crear el directorio aleatorio: {}", directorioRandom.getAbsolutePath());
                }
            }
            File destino = new File(directorioRandom, nombreArchivo);
            archivo.transferTo(destino);

            String valor = destino.getAbsolutePath();
            TblParametros plantilla = new TblParametros(
                    parametro,
                    valor,
                    descripcion,
                    idSistema);
            TblParametros guardado = parametrosRepository.save(plantilla);
            log.info("Plantilla guardada: {}", guardado);
            respuesta.put("mensaje", "Plantilla guardada exitosamente");
            respuesta.put("plantilla", guardado);
            return ResponseEntity.ok(respuesta);
        } catch (Exception e) {
            log.error("Error al guardar plantilla: {}", e.getMessage(), e);
            respuesta.put("error", "Error al guardar plantilla: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(respuesta);
        }
    }

    @Override
    public List<TblParametros> listarPlantillas(Integer idSistema) {
        return parametrosRepository.findAll().stream()
                .filter(p -> p.getIdSistema().equals(idSistema))
                .toList();
    }

    @Override
    public ResponseEntity<byte[]> descargarArchivoPlantilla(Integer idSistema, String parametro) {
        try {
            TblParametros plantilla = parametrosRepository.findByIdSistemaAndParametro(idSistema, parametro)
                    .orElse(null);
            String rutaArchivo = (plantilla != null && plantilla.getValor() != null)
                    ? plantilla.getValor().trim().replaceAll("\\s+", "")
                    : null;
            log.info("Buscando plantilla: idSistema={}, parametro={}, ruta={} ", idSistema, parametro, rutaArchivo);
            if (plantilla != null && rutaArchivo != null) {
                java.io.File archivo = new java.io.File(rutaArchivo);
                if (archivo.exists()) {
                    byte[] archivoBytes = Files.readAllBytes(archivo.toPath());
                    HttpHeaders headers = new HttpHeaders();
                    headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
                    headers.setContentDisposition(ContentDisposition.builder("attachment")
                            .filename(archivo.getName())
                            .build());
                    log.info("Descarga exitosa de plantilla: {}", archivo.getName());
                    return new ResponseEntity<>(archivoBytes, headers, HttpStatus.OK);
                } else {
                    log.warn("Archivo no encontrado en ruta: {}", rutaArchivo);
                    return new ResponseEntity<>(HttpStatus.NOT_FOUND);
                }
            } else {
                log.warn("No se encontró plantilla para idSistema={} y parametro={}", idSistema, parametro);
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            log.error("Error al descargar plantilla: {}", e.getMessage(), e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
