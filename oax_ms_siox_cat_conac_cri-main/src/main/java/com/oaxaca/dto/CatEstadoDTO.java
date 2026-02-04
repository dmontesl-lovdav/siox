package com.oaxaca.dto;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CatEstadoDTO {
    private Integer totalRegistros;
    private Integer id;
    private String estado;
    private String clave;
    private Date fechaAlta;
    private Integer idUsuarioCreacion;
    private Integer idPais;
    private String pais;

}
