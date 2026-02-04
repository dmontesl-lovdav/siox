package com.oaxaca.dto;

import java.util.Date;

import lombok.Data;

@Data
public class VialidadDTO {
    private Integer totalRegistros;
    private Integer id;
    private String descripcion;
    private Boolean estatus;
    private Date fechaAlta;
    private String usuarioCreacion;

}