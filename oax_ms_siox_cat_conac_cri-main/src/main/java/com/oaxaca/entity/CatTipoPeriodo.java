package com.oaxaca.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.Data;

@Entity
@Data
@Table(name = "cat_tipo_periodo", schema = "siox")
public class CatTipoPeriodo {

    public CatTipoPeriodo() {
        // Constructor vacío requerido por Hibernate
    }

    public CatTipoPeriodo(String periodo) {
        this.periodo = periodo != null ? periodo.trim() : null;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "periodo", nullable = false, length = 250)
    private String periodo;
}
