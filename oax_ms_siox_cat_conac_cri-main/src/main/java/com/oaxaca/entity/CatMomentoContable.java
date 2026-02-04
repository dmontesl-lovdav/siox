package com.oaxaca.entity;
import lombok.Data;

import java.time.LocalDateTime;
import javax.persistence.*;
@Entity
@Data
@Table(name = "cat_momento_contable", schema = "siox")
public class CatMomentoContable {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "cat_momento_contable_seq")
    @SequenceGenerator(name = "cat_momento_contable_seq", sequenceName = "cat_momento_contable_seq", schema = "siox", allocationSize = 1)
    private Integer id;

    @Column(name = "clave", nullable = false, length = 1)
    private String clave;

    @Column(name = "momento_contable", nullable = false, length = 250)
    private String momentoContable;

    @Column(name = "tipo_poliza_id", nullable = false)
    private Integer tipoPolizaId;

    @Column(name = "es_presupuestal", nullable = false)
    private Boolean esPresupuestal;

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
