package com.oaxaca.entity;

import lombok.Data;

import java.time.LocalDateTime;
import javax.persistence.*;

@Entity
@Data
@Table(name = "cat_grupo_unidades_responsables", schema = "siox")
public class CatGrupoUnidadesResponsables {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "cat_grupo_unidades_responsables_seq")
    @SequenceGenerator(name = "cat_grupo_unidades_responsables_seq", sequenceName = "cat_grupo_unidades_responsables_seq", schema = "siox", allocationSize = 1)
    private Integer id;

    @Column(name = "clave", nullable = false, length = 1)
    private String clave;

    @Column(name = "grupo_unidad_responsable", nullable = false, length = 40)
    private String grupoUnidadResponsable;

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
    private Boolean activo;


}
