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
@Table(name = "cat_estructura_cuentas", schema = "siox")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CatEstructuraCuentas {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "descripcion_estructura", length = 50)
    private String descripcionEstructura;

    @Column(length = 5)
    private String n1;

    @Column(name = "des_n1", length = 50)
    private String desN1;

    @Column(length = 3)
    private String n2;

    @Column(name = "des_n2", length = 50)
    private String desN2;

    @Column(length = 3)
    private String n3;

    @Column(name = "des_n3", length = 50)
    private String desN3;

    @Column(length = 10)
    private String n4;

    @Column(name = "des_n4", length = 50)
    private String desN4;

    @Column(length = 10)
    private String n5;

    @Column(name = "des_n5", length = 50)
    private String desN5;

    @Column(length = 10)
    private String n6;

    @Column(name = "des_n6", length = 50)
    private String desN6;

    @Column(length = 100)
    private String secuencia;

    @Column
    private Integer longitud;

    @Column
    private Integer niveles;

    @Column(name = "fecha_creacion")
    @Temporal(TemporalType.DATE)
    private Date fechaCreacion;

    @Column(columnDefinition = "boolean default false")
    private Boolean estatus;

    @Column(columnDefinition = "boolean default true")
    private Boolean visible;
}
