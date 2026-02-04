package com.oaxaca.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CatTipoPolizaUpdateDTO {

    private Integer id;
    private String clave;
    private String tipo;
    private Integer idUsuarioCreacion;
    private Integer idUsuarioModificacion;

}
