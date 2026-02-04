package com.oaxaca.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TwoFactorSetupResponse {
    
    private String secret;
    private String qrCodeUrl;
    private String manualEntryKey;
    private String mensaje;
}
