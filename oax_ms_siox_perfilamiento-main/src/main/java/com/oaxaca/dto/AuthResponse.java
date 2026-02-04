package com.oaxaca.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    
    private String token;
    private String tipo;
    private Integer userId;
    private Integer licenciaId;
    private String nombre;
    private String correo;
    private String rol;
    private String tipoUsuario; // ROOT o OPERATIVO
    private Boolean requiere2FA;
    private TwoFactorSetupResponse setup2FA;
    private String mensaje;
}
