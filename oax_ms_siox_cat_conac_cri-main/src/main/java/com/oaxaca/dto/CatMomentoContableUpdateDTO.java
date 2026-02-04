package com.oaxaca.dto;

import lombok.Data;

@Data
public class CatMomentoContableUpdateDTO {
    private String clave;
    private String momentoContable;
    private Integer tipoPolizaId;
    private Boolean esPresupuestal;

    private Integer idUsuarioCreacion;
    private Integer idUsuarioModificacion;

}
