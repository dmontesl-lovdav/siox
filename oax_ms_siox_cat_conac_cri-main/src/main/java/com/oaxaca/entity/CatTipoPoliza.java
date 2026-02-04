package com.oaxaca.entity;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "cat_tipo_poliza", schema = "siox")
public class CatTipoPoliza {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "cat_tipo_poliza_seq")
    @SequenceGenerator(name = "cat_tipo_poliza_seq", sequenceName = "siox.cat_tipo_poliza_seq", allocationSize = 1)
    @Column(name = "id")
    private Integer id;

    @Column(name = "clave", nullable = false, length = 1, unique = true)
    private String clave;

    @Column(name = "tipo", nullable = false, length = 250)
    private String tipo;

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
    public CatTipoPoliza() {
    }

    public CatTipoPoliza(Integer id, String clave, String tipo, Integer idUsuarioCreacion, LocalDateTime fechaAlta,
                         Integer idUsuarioModificacion, LocalDateTime fechaModificacion, Integer idUsuarioBaja,
                         LocalDateTime fechaBaja, Boolean activo) {
        this.id = id;
        this.clave = clave;
        this.tipo = tipo;
        this.idUsuarioCreacion = idUsuarioCreacion;
        this.fechaAlta = fechaAlta;
        this.idUsuarioModificacion = idUsuarioModificacion;
        this.fechaModificacion = fechaModificacion;
        this.idUsuarioBaja = idUsuarioBaja;
        this.fechaBaja = fechaBaja;
        this.activo = activo;
    }

    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getClave() {
        return clave;
    }

    public void setClave(String clave) {
        this.clave = clave;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public Integer getIdUsuarioCreacion() {
        return idUsuarioCreacion;
    }

    public void setIdUsuarioCreacion(Integer idUsuarioCreacion) {
        this.idUsuarioCreacion = idUsuarioCreacion;
    }

    public LocalDateTime getFechaAlta() {
        return fechaAlta;
    }

    public void setFechaAlta(LocalDateTime fechaAlta) {
        this.fechaAlta = fechaAlta;
    }

    public Integer getIdUsuarioModificacion() {
        return idUsuarioModificacion;
    }

    public void setIdUsuarioModificacion(Integer idUsuarioModificacion) {
        this.idUsuarioModificacion = idUsuarioModificacion;
    }

    public LocalDateTime getFechaModificacion() {
        return fechaModificacion;
    }

    public void setFechaModificacion(LocalDateTime fechaModificacion) {
        this.fechaModificacion = fechaModificacion;
    }

    public Integer getIdUsuarioBaja() {
        return idUsuarioBaja;
    }

    public void setIdUsuarioBaja(Integer idUsuarioBaja) {
        this.idUsuarioBaja = idUsuarioBaja;
    }

    public LocalDateTime getFechaBaja() {
        return fechaBaja;
    }

    public void setFechaBaja(LocalDateTime fechaBaja) {
        this.fechaBaja = fechaBaja;
    }

    public Boolean getActivo() {
        return activo;
    }

    public void setActivo(Boolean activo) {
        this.activo = activo;
    }
}
