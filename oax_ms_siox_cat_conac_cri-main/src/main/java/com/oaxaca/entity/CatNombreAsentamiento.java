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
@Table(name = "cat_nombre_asentamiento", schema = "siox")
@Data
public class CatNombreAsentamiento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "id_tipo_asentamiento")
    private Integer idTipoAsentamiento;

    @Column(length = 50)
    private String clave;

    @Column(length = 250)
    private String descripcion;

    @Column(name = "fecha_alta")
    private Date fechaAlta;

    @Column(name = "id_usuario")
    private Integer idUsuario;

    @Column(name = "estatus")
    private Boolean estatus;
}
