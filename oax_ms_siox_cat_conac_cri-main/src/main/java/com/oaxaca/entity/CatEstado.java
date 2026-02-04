package com.oaxaca.entity;

import java.time.LocalDate;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "cat_estados", schema = "siox")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CatEstado {
    @Id
    @Column(name = "id")
    private Integer id;

    @Column(name = "nombre")
    private String nombre;

    @Column(name = "clave")
    private String clave;

    @Column(name = "fecha_alta")
    private LocalDate fechaAlta;

    @Column(name = "id_usuario_creacion")
    private Integer idUsuarioCreacion;

    @Column(name = "id_pais")
    private Integer idPais;

    @OneToMany(mappedBy = "estado", fetch = FetchType.LAZY)
    private Set<RelRegionEstado> regiones;

}
