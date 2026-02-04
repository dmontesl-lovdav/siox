package com.oaxaca.dto;

import java.sql.Date;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class CriTablaDTO {
    private Integer total;
    private String clave;
    private String nombreClasificador;
    private String descripcion;
    private String fechaAlta;
    private String inicioVigencia;
    private String finVigencia;
    private String estatus;
    private Integer id;
    private Integer fk;
    private String origenTabla;
    private Integer ejercicio;

    // Constructor para mapeo directo desde native query de la función get_cri
    public CriTablaDTO(Integer total, String clave, String nombreClasificador, String descripcion, String fechaAlta,
            String inicioVigencia, String finVigencia, String estatus, Integer id,
            Integer fk, String origenTabla, Integer ejercicio) {
        this.total = total;
        this.clave = clave;
        this.nombreClasificador = nombreClasificador;
        this.descripcion = descripcion;
        this.fechaAlta = fechaAlta;
        this.inicioVigencia = inicioVigencia;
        this.finVigencia = finVigencia;
        this.estatus = estatus;
        this.id = id;
        this.fk = fk;
        this.origenTabla = origenTabla;
        this.ejercicio = ejercicio;
    }

    public Date parseFecha(String fecha) {
        if (fecha == null || fecha.isBlank())
            return null;
        try {
            return Date.valueOf(fecha); // formato esperado: yyyy-MM-dd
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}
