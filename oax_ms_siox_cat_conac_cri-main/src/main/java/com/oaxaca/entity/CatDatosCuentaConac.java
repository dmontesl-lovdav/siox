package com.oaxaca.entity;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "datos_cuenta_conac", schema = "siox")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CatDatosCuentaConac {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "id_naturaleza")
    private Integer idNaturaleza;

    @Column(name = "id_estado_financiero")
    private Integer idEstadoFinanciero;

    @Column(name = "id_posicion")
    private Integer idPosicion;

    @Column(name = "id_estructura")
    private Integer idEstructura;

    @Column(name = "id_genero")
    private Integer idGenero;

    @Column(name = "id_grupo")
    private Integer idGrupo;

    @Column(name = "id_rubro")
    private Integer idRubro;

    @Column(name = "id_cuenta")
    private Integer idCuenta;

    @Column(name = "id_sub_cuenta")
    private Integer idSubCuenta;

    @Temporal(TemporalType.DATE)
    @Column(name = "inicio_vigencia")
    private Date inicioVigencia;

    @Temporal(TemporalType.DATE)
    @Column(name = "fin_vigencia")
    private Date finVigencia;

    @Column(name = "ejercicio")
    private Integer ejercicio;

    public CatDatosCuentaConac(Integer idNaturaleza, Integer idEstadoFinanciero, Integer idPosicion,
            Integer idEstructura, Integer idGenero, Integer idGrupo, Integer idRubro, Integer idCuenta,
            Integer idSubCuenta, Date inicioVigencia, Date finVigencia, Integer ejercicio) {
        this.idNaturaleza = idNaturaleza;
        this.idEstadoFinanciero = idEstadoFinanciero;
        this.idPosicion = idPosicion;
        this.idEstructura = idEstructura;
        this.idGenero = idGenero;
        this.idGrupo = idGrupo;
        this.idRubro = idRubro;
        this.idCuenta = idCuenta;
        this.idSubCuenta = idSubCuenta;
        this.inicioVigencia = inicioVigencia;
        this.finVigencia = finVigencia;
        this.ejercicio = ejercicio;
    }

    // Lombok genera getters, setters y constructores
}
