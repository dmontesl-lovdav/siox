package com.oaxaca.dto;

import java.util.Date;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class MunicipioDistritoDTO {
    private Integer totalRegistros;
    private String distrito;
    private String claveMunicipio;
    private String municipio;
    private Date fechaAlta;

}
