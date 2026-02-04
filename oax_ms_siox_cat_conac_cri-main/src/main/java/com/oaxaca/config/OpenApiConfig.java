package com.oaxaca.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;

/**
 * Configuración de OpenAPI (Swagger UI) y esquema de seguridad Bearer JWT.
 */
@Configuration
public class OpenApiConfig {
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("SIOX CAT CONAC - Main Service")
                        .version("1.0.0")
                        .description("Microservicio de catálogos de CONAC")
                        .contact(new Contact().name("Equipo SIOX").email("soporte@example.com")));
    }
}
