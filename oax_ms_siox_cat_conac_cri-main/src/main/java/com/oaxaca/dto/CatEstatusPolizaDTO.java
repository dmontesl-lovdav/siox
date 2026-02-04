package com.oaxaca.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CatEstatusPolizaDTO {
    private Integer totalRegistros;
    private Integer id;
    private String clave;
    private String estatus;
    private Boolean bloqueo;
    private Integer idUsuarioCreacion;
    private LocalDateTime fechaAlta;
    private Integer idUsuarioModificacion;
    private LocalDateTime fechaModificacion;
    private Integer idUsuarioBaja;
    private LocalDateTime fechaBaja;
    private Boolean activo;

    // Constructors
    public CatEstatusPolizaDTO() {
    }

    public CatEstatusPolizaDTO(Integer totalRegistros, Integer id, String clave, String estatus, Boolean bloqueo,
                               Integer idUsuarioCreacion, LocalDateTime fechaAlta, Integer idUsuarioModificacion,
                               LocalDateTime fechaModificacion, Integer idUsuarioBaja, LocalDateTime fechaBaja, Boolean activo) {
        this.totalRegistros = totalRegistros;
        this.id = id;
        this.clave = clave;
        this.estatus = estatus;
        this.bloqueo = bloqueo;
        this.idUsuarioCreacion = idUsuarioCreacion;
        this.fechaAlta = fechaAlta;
        this.idUsuarioModificacion = idUsuarioModificacion;
        this.fechaModificacion = fechaModificacion;
        this.idUsuarioBaja = idUsuarioBaja;
        this.fechaBaja = fechaBaja;
        this.activo = activo;
    }
}
