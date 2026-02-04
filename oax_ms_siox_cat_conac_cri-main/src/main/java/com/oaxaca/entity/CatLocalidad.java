package com.oaxaca.entity;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "cat_localidad", schema = "siox")
@Data
@NoArgsConstructor
public class CatLocalidad {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(length = 100)
    private String descripcion;

    @Column(length = 5)
    private Integer clave;

    @Column(name = "id_municipio")
    private Integer idMunicipio;

    @Column(name = "id_usuario_creacion")
    private Integer idUsuarioCreac;

    private Boolean estatus;

    @Column(name = "fecha_alta", insertable = false, updatable = false)
    private Date fechaAlta;

}
