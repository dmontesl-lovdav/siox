package com.oaxaca.entity;

import lombok.Data;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "cat_estatus_poliza", schema = "siox")
public class CatEstatusPoliza {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "cat_estatus_poliza_seq")
    @SequenceGenerator(name = "cat_estatus_poliza_seq", sequenceName = "siox.cat_estatus_poliza_seq", allocationSize = 1)
    @Column(name = "id")
    private Integer id;

    @Column(name = "clave", nullable = false, length = 1, unique = true)
    private String clave;

    @Column(name = "estatus", nullable = false, length = 250)
    private String estatus;

    @Column(name = "bloqueo", nullable = false)
    private Boolean bloqueo = false;

    @Column(name = "id_usuario_creacion", nullable = false)
    private Integer idUsuarioCreacion;

    @Column(name = "fecha_alta", nullable = false)
    private LocalDateTime fechaAlta;

    @Column(name = "id_usuario_modificacion")
    private Integer idUsuarioModificacion;

    @Column(name = "fecha_modificacion")
    private LocalDateTime fechaModificacion;

    @Column(name = "id_usuario_baja")
    private Integer idUsuarioBaja;

    @Column(name = "fecha_baja")
    private LocalDateTime fechaBaja;

    @Column(name = "activo", nullable = false)
    private Boolean activo = true;

    // Constructors
    public CatEstatusPoliza() {
    }

}
