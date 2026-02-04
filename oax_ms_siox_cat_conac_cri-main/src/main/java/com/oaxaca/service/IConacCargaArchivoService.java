package com.oaxaca.service;

import org.springframework.web.multipart.MultipartFile;

public interface IConacCargaArchivoService {
    Object validarArchivo(MultipartFile archivo, Integer ejercicio);
}
