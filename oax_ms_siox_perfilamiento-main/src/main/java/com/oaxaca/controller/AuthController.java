package com.oaxaca.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.oaxaca.dto.AuthResponse;
import com.oaxaca.dto.LoginRequest;
import com.oaxaca.dto.TwoFactorRequest;
import com.oaxaca.dto.TwoFactorSetupResponse;
import com.oaxaca.service.AuthenticationService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthenticationService authenticationService;

    /**
     * Endpoint de login - Valida credenciales contra licencias y usuarios
     * Si es primera vez, retorna configuración 2FA
     * Si ya tiene 2FA, requiere el código
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        log.info("Intento de login para: {}", request.getCorreo());
        AuthResponse response = authenticationService.login(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint para validar código 2FA y obtener token JWT
     */
    @PostMapping("/validate-2fa")
    public ResponseEntity<AuthResponse> validateTwoFactor(@Valid @RequestBody TwoFactorRequest request) {
        log.info("Validación de código 2FA para: {}", request.getCorreo());
        AuthResponse response = authenticationService.validateTwoFactorCode(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint para reconfigurar 2FA (en caso de pérdida del dispositivo)
     */
    @PostMapping("/reset-2fa")
    public ResponseEntity<TwoFactorSetupResponse> resetTwoFactor(@Valid @RequestBody LoginRequest request) {
        log.info("Reconfiguración de 2FA para: {}", request.getCorreo());
        TwoFactorSetupResponse response = authenticationService.resetTwoFactorAuthentication(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint de health check
     */
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Auth service is running");
    }

    /**
     * Endpoint de prueba (público)
     */
    @GetMapping("/public/test")
    public ResponseEntity<String> publicTest() {
        return ResponseEntity.ok("Endpoint público funcionando correctamente");
    }
}
