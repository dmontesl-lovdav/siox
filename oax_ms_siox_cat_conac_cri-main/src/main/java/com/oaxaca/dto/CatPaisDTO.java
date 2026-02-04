package com.oaxaca.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CatPaisDTO {
    private Integer totalRegistros;
    private Integer id;
    private String nombre;
    private LocalDate fechaAlta;
    private Integer idUsuarioCreacion;

}
