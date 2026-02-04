package com.oaxaca.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CatTipoSectorGubernamentalDTO {
    private Integer id;
    private String clave;
    private String sector;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate fechaInicioVigencia;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate fechaFinVigencia;

    private TblUsuariosDto usuarioCreacion;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime fechaAlta;

    private TblUsuariosDto usuarioModificacion;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime fechaModificacion;

    private Boolean activo;
}
