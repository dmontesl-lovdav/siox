package com.oaxaca.dto;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ConacConsultaDTO {
    private Integer idDatosCuenta;
    private Integer idGenero;
    private Integer idGrupo;
    private Integer idRubro;
    private Integer idCuenta;
    private Integer idSubCuenta;
    private Integer idNaturaleza;
    private Integer idEstructura;
    private Integer idEstadoFinanciero;
    private Integer idPosicion;
    private String cuenta;
    private String descripcion;
    private String naturaleza;
    private String estructura;
    private String estadoFinanciero;
    private String posicionFinanciera;
    private Date fechaAlta;
    private Date inicioVigencia;
    private Date finVigencia;
    private String estatus;
    private Integer ejercicio;
    private String origen;
    private Long totalRegistros;
}