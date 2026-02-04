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
@Table(name = "cat_clase_cri", schema = "siox")
public class CatClaseCri {
    public CatClaseCri() {
        // Constructor vacío requerido por Hibernate
    }
    public CatClaseCri(String clave, String nombre, String descripcion, Integer idTipo, String claveCompuesta,
            Date inicioVigencia, Date finVigencia, Date fechaAlta, Integer ejercicio) {
        this.clave = clave != null ? clave.trim() : null;
        this.nombre = nombre != null ? nombre.trim() : null;
        this.descripcion = descripcion != null ? descripcion.trim() : null;
        this.idTipo = idTipo;
        this.claveCompuesta = claveCompuesta;
        this.inicioVigencia = inicioVigencia;
        this.finVigencia = finVigencia;
        this.fechaAlta = fechaAlta;
        this.ejercicio = ejercicio;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String clave;
    private String nombre;
    private String descripcion;
    @Column(name = "id_tipo")
    private Integer idTipo;
    @Column(name = "clave_compuesta")
    private String claveCompuesta;
    @Column(name = "inicio_vigencia")
    private Date inicioVigencia;
    @Column(name = "fin_vigencia")
    private Date finVigencia;
    @Column(name = "fecha_alta")
    private Date fechaAlta;
    @Column(name = "ejercicio")
    private Integer ejercicio;
}
