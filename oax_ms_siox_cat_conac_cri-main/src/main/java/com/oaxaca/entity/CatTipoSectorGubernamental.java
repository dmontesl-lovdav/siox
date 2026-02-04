package com.oaxaca.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "cat_tipo_sector_gubernamental", schema = "siox")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class CatTipoSectorGubernamental {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_cat_tipo_sector_gub")
    @SequenceGenerator(name = "seq_cat_tipo_sector_gub", sequenceName = "seq_cat_tipo_sector_gub", schema = "siox", allocationSize = 1)
    private Integer id;

    @Column(name = "sector", nullable = false, length = 100)
    private String sector;

    @Column(name = "clave", nullable = false, length = 20)
    private String clave;

    @Column(name = "fecha_inicio_vigencia")
    private LocalDate fechaInicioVigencia;

    @Column(name = "fecha_fin_vigencia")
    private LocalDate fechaFinVigencia;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario_creacion", nullable = false)
    private TblUsuarios usuarioCreacion;

    @Column(name = "fecha_alta")
    private LocalDateTime fechaAlta;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario_modificacion")
    private TblUsuarios usuarioModificacion;

    @Column(name = "fecha_modificacion")
    private LocalDateTime fechaModificacion;

    @Column(name = "activo", nullable = false)
    private Boolean activo;
}
