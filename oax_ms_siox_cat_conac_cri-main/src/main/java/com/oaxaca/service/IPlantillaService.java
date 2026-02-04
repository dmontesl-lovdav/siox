package com.oaxaca.service;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import com.oaxaca.entity.TblParametros;

public interface IPlantillaService {
    ResponseEntity<Map<String, Object>> guardarPlantilla(MultipartFile archivo, String parametro, String descripcion,
            Integer idSistema);

    List<TblParametros> listarPlantillas(Integer idSistema);

    ResponseEntity<byte[]> descargarArchivoPlantilla(Integer idSistema, String parametro) throws java.io.IOException;
}
