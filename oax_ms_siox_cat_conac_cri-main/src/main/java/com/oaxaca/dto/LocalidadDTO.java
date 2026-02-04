package com.oaxaca.dto;

import java.util.Date;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class LocalidadDTO {
    private Integer id;
    private Integer totalRegistros;
    private String municipio;
    private String claveLocalidad;
    private String descripcionLocalidad;
    private Date fechaAlta;
    private String usuarioCreacion;
    private Boolean estatus;
}
