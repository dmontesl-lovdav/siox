package com.oaxaca.dto;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CatTipoSectorGubernamentalUpdateDTO {
    private String sector;
    //private String clave;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate fechaInicioVigencia;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate fechaFinVigencia;

    private Integer idUsuarioCreacion;
    private Integer idUsuarioModificacion;
}
