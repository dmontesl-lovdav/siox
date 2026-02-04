package com.oaxaca.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CatMomentoContableDTO {
    private Integer totalRegistros;

    private Integer id;
    private String clave;
    private String momentoContable;
    private Integer tipoPolizaId;
    private Boolean esPresupuestal;

    private Integer idUsuarioCreacion;
    private LocalDateTime fechaAlta;

    private Integer idUsuarioModificacion;
    private LocalDateTime fechaModificacion;

    private Integer idUsuarioBaja;
    private LocalDateTime fechaBaja;

    private Boolean activo;
}
