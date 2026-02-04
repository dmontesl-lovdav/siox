package com.oaxaca.dto;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CatEstructuraCuentasDTO {

    private Integer totalRegistros;
    private Integer id;
    private String descripcionEstructura;
    private String n1;
    private String desN1;
    private String n2;
    private String desN2;
    private String n3;
    private String desN3;
    private String n4;
    private String desN4;
    private String n5;
    private String desN5;
    private String n6;
    private String desN6;
    private String secuencia;
    private Integer longitud;
    private Integer niveles;

    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "America/Mexico_City")
    private Date fechaCreacion;

    private Boolean estatus;
    private Boolean visible;
}
