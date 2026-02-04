package com.oaxaca.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CatEstatusPolizaUpdateDTO {

    private Integer id;
    private String clave;
    private String estatus;
    private Integer idUsuarioModificacion;

}
