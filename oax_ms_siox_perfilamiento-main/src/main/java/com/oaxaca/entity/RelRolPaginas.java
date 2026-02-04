package com.oaxaca.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "rel_rol_paginas", schema = "siox")
public class RelRolPaginas {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "id_rol")
    private TblRoles rol;

    @ManyToOne
    @JoinColumn(name = "id_pagina")
    private TblPaginas pagina;

    // Getters y setters
}
