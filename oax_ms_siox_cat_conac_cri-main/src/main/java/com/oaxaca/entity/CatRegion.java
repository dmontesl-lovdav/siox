package com.oaxaca.entity;

import java.time.LocalDate;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "cat_regiones", schema = "siox")
@ToString
public class CatRegion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Column(name = "nombre")
    private String nombre;
    @Column(name = "fecha_alta")
    private LocalDate fechaAlta;
    @Column(name = "id_usuario_creacion")
    private Integer idUsuarioCreacion;

    @OneToMany(mappedBy = "region", fetch = FetchType.LAZY)
    private Set<RelRegionEstado> estados;
}
