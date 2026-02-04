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
@Table(name = "tbl_licencia", schema = "siox")
public class TblLicencia {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(length = 100)
    private String nombre;

    @Column(length = 250)
    private String descripcion;

    @Temporal(TemporalType.DATE)
    private Date inicioVigencia;

    @Temporal(TemporalType.DATE)
    private Date finVigencia;

    @Temporal(TemporalType.DATE)
    private Date fechaAlta;

    private Boolean estatus;

    @Column(length = 100)
    private String correo;

    @Column(length = 100)
    private String contrasenia;

    @ManyToOne
    @JoinColumn(name = "id_sistema")
    private CatSistemas sistema;

    @Column(length = 200)
    private String secret;

    // Getters y setters
}
