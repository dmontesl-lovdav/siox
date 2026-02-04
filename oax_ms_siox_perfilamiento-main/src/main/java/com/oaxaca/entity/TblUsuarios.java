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
@Table(name = "tbl_usuarios", schema = "siox")
public class TblUsuarios {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(length = 200)
    private String nombre;

    @Column(length = 200)
    private String aPaterno;

    @Column(length = 200)
    private String aMaterno;

    @Column(length = 200)
    private String correo;

    @Column(length = 200)
    private String secret;

    @Column(length = 200)
    private String password;

    @Temporal(TemporalType.DATE)
    private Date fechaCreacion;

    @Temporal(TemporalType.DATE)
    private Date fechaActualizacion;

    private Boolean activo;

    @ManyToOne
    @JoinColumn(name = "id_rol")
    private TblRoles rol;

    @ManyToOne
    @JoinColumn(name = "id_licencia")
    private TblLicencia licencia;

    // Getters y setters
}
