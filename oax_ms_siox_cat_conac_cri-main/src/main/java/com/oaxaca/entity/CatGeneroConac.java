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
@Table(name = "cat_genero_conac", schema = "siox")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CatGeneroConac {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(length = 2)
    private String clave;

    @Column(length = 250)
    private String descripcion;

    @Temporal(TemporalType.DATE)
    @Column(name = "fecha_alta")
    private Date fechaAlta;
    @Column(name = "ejercicio")
    private Integer ejercicio;

    // Constructor personalizado sin ID (para crear nuevas entidades)
    public CatGeneroConac(String clave, String descripcion, Integer ejercicio, Date fechaAlta) {
        this.clave = clave;
        this.descripcion = descripcion;
        this.ejercicio = ejercicio;
        this.fechaAlta = fechaAlta;
    }

}
