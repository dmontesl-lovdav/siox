package com.oaxaca.entity;

import javax.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "cat_sistemas", schema = "siox")
@Data
@NoArgsConstructor
public class CatSistema {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(length = 200, nullable = false)
    private String nombre;

    @Column(length = 1000, nullable = false)
    private String descripcion;
}
