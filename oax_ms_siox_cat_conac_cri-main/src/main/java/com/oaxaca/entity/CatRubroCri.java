package com.oaxaca.entity;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.Data;

@Entity
@Data

@Table(name = "cat_rubro_cri", schema = "siox")
public class CatRubroCri {
    public CatRubroCri(String clave, String nombre, String descripcion, Date inicioVigencia, Date finVigencia,
            Integer ejercicio, Date fechaAlta) {
        this.clave = clave != null ? clave.trim() : null;
        this.nombre = nombre != null ? nombre.trim() : null;
        this.descripcion = descripcion != null ? descripcion.trim() : null;
        this.inicioVigencia = inicioVigencia;
        this.finVigencia = finVigencia;
        this.ejercicio = ejercicio;
        this.fechaAlta = fechaAlta;
    }

    public CatRubroCri() {
        // Constructor vacío requerido por Hibernate
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String clave;
    private String nombre;
    private String descripcion;
    @Column(name = "inicio_vigencia")
    private Date inicioVigencia;
    @Column(name = "fin_vigencia")
    private Date finVigencia;
    private Integer ejercicio;
    @Column(name = "fecha_alta")
    private Date fechaAlta;
}
