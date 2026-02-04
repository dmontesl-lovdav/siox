package com.oaxaca.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "cat_estado_financiero", schema = "siox")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CatEstadoFinanciero {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(length = 200)
    private String nombre;

    @Column(length = 4)
    private String sufijo;

    // Lombok genera getters, setters y constructores
}
