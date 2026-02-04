package com.oaxaca.entity;

import java.util.Date;

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
@Table(name = "rel_rol_pagina_permiso", schema = "siox")
public class RelRolPaginaPermiso {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "id_rol")
    private TblRoles rol;

    @ManyToOne
    @JoinColumn(name = "id_pagina")
    private TblPaginas pagina;

    @ManyToOne
    @JoinColumn(name = "id_permiso")
    private CatPermisos permiso;

    private Boolean estatus;

    @Temporal(TemporalType.DATE)
    private Date fechaCreacion;

    @Temporal(TemporalType.DATE)
    private Date fechaActualizacion;

    // Getters y setters
}
