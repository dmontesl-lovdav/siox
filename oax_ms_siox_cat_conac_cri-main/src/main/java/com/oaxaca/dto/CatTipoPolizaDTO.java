package com.oaxaca.dto;

import java.time.LocalDateTime;

public class CatTipoPolizaDTO {
    private Integer totalRegistros;
    private Integer id;
    private String clave;
    private String tipo;
    private Integer idUsuarioCreacion;
    private LocalDateTime fechaAlta;
    private Integer idUsuarioModificacion;
    private LocalDateTime fechaModificacion;
    private Integer idUsuarioBaja;
    private LocalDateTime fechaBaja;
    private Boolean activo;

    // Constructors
    public CatTipoPolizaDTO() {
    }

    public CatTipoPolizaDTO(Integer totalRegistros, Integer id, String clave, String tipo,
                            Integer idUsuarioCreacion, LocalDateTime fechaAlta, Integer idUsuarioModificacion,
                            LocalDateTime fechaModificacion, Integer idUsuarioBaja, LocalDateTime fechaBaja, Boolean activo) {
        this.totalRegistros = totalRegistros;
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
    public Integer getTotalRegistros() {
        return totalRegistros;
    }

    public void setTotalRegistros(Integer totalRegistros) {
        this.totalRegistros = totalRegistros;
    }

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
