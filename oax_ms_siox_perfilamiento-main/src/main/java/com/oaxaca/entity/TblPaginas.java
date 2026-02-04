package com.oaxaca.entity;

import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.Data;

@Data
@Entity
@Table(name = "tbl_paginas", schema = "siox")
public class TblPaginas {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(length = 300)
    private String ruta;

    @Column(length = 200)
    private String icono;

    @Column(length = 1000)
    private String descripcion;

    @Temporal(TemporalType.DATE)
    private Date fechaCreacion;

    @Temporal(TemporalType.DATE)
    private Date fechaActualizacion;

    private Boolean activo;

    @ManyToOne
    @JoinColumn(name = "id_sistema")
    private CatSistemas sistema;

    // Getters y setters
}
