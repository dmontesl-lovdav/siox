package com.oaxaca.dto;

import lombok.Data;

@Data
public class CatGrupoUnidadesResponsablesUpdateDTO {

    private String clave;
    private String grupoUnidadResponsable;

    private Integer idUsuarioCreacion;
    private Integer idUsuarioModificacion;
    private Integer idUsuarioBaja;


}
