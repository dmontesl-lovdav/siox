package com.oaxaca.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.oaxaca.dto.TblUsuariosDto;
import com.oaxaca.service.TblUsuariosService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
public class TblUsuariosController {
    private final TblUsuariosService tblUsuariosService;

    /**
     * Obtener un usuario por ID
     * Ejemplo: GET /api/usuarios/1
     */
    @GetMapping("/{id}")
    public ResponseEntity<TblUsuariosDto> findOne(@PathVariable Long id) {
        TblUsuariosDto user = tblUsuariosService.findOne(id);
        if (user != null) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Obtener usuarios con filtros dinámicos
     * Ejemplo: GET /api/usuarios?nombre=Juan&activo=true&idRol=2
     */
    @GetMapping
    public ResponseEntity<List<TblUsuariosDto>> find(
            @RequestParam Map<String, String> params) {
        return ResponseEntity.ok(tblUsuariosService.find(params));
    }
}
