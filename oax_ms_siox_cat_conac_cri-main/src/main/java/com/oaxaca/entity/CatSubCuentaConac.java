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
@Table(name = "cat_sub_cuenta_conac", schema = "siox")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CatSubCuentaConac {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(length = 2)
    private String clave;

    @Column(length = 500)
    private String descripcion;

    @Column(name = "clave_compuesta", length = 100)
    private String claveCompuesta;

    @Column(name = "id_cuenta")
    private Integer idCuenta;

    @Temporal(TemporalType.DATE)
    @Column(name = "fecha_alta")
    private Date fechaAlta;
    @Column(name = "ejercicio")
    private Integer ejercicio;

    public CatSubCuentaConac(String clave, String descripcion, String claveCompuesta, Integer idCuenta,
            Integer ejercicio, Date fechaAlta) {
        this.clave = clave;
        this.descripcion = descripcion;
        this.claveCompuesta = claveCompuesta;
        this.idCuenta = idCuenta;
        this.ejercicio = ejercicio;
        this.fechaAlta = fechaAlta;
    }
    // Lombok genera getters, setters y constructores
}
