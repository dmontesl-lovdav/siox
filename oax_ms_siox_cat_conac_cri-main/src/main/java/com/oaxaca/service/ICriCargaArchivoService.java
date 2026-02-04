package com.oaxaca.service;

import org.springframework.web.multipart.MultipartFile;

public interface ICriCargaArchivoService {
    Object validarArchivo(MultipartFile archivo, Integer ejercicio);
}
