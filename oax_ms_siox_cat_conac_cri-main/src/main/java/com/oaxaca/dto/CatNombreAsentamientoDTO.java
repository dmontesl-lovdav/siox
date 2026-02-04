package com.oaxaca.dto;

import java.util.Date;

import lombok.Data;

@Data
public class CatNombreAsentamientoDTO {
    private Integer totalRegistros;
    private Integer id;
    private String clave;
    private String descripcion;
    private Date fechaAlta;
    private Integer idTipoAsentamiento;
    private Integer idUsuarioCreacion;
    private Boolean estatus;
    private String tipoClave;
    private String tipoDescripcion;
    private String nombre;
    private String aPaterno;
    private String aMaterno;
    private String usuarioCreacion;

}
