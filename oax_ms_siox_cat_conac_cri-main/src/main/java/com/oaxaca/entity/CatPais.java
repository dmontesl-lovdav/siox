
package com.oaxaca.entity;

import java.time.LocalDate;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;

import lombok.Data;

@Entity
@Data
public class CatPais {
    @Id
    @Column(name = "id")
    private Integer id;

    @Column(name = "nombre")
    private String nombre;

    @Column(name = "fecha_alta")
    private LocalDate fechaAlta;

    @Column(name = "id_usuario_creacion")
    private Integer idUsuarioCreacion;
}
