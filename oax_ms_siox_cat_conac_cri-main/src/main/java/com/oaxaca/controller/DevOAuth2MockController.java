package com.oaxaca.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.springframework.context.annotation.Profile;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller mock para OAuth2 - SOLO DISPONIBLE EN PERFIL DEV
 * Simula el endpoint de token OAuth2 para desarrollo local
 */
@RestController
@RequestMapping("/cri/login/login/oauth2")
@Profile("dev")
public class DevOAuth2MockController {

    /**
     * Endpoint mock para obtener token OAuth2
     * Simula la respuesta de un servidor OAuth2 real
     */
    @PostMapping(value = "/token", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    public ResponseEntity<Map<String, Object>> getToken(
            @RequestParam(value = "client_id", required = false) String clientId,
            @RequestParam(value = "client_secret", required = false) String clientSecret,
            @RequestParam(value = "grant_type", required = false) String grantType,
            @RequestParam(value = "scope", required = false) String scope) {

        // Generar token dummy
        String accessToken = "dev_token_" + UUID.randomUUID().toString().replace("-", "");

        Map<String, Object> response = new HashMap<>();
        response.put("access_token", accessToken);
        response.put("token_type", "Bearer");
        response.put("expires_in", 3600);
        response.put("scope", scope != null ? scope : "write");

        return ResponseEntity.ok(response);
    }
}
