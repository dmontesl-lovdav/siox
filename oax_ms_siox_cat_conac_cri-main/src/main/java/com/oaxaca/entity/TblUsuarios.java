package com.oaxaca.entity;

import java.time.LocalDate;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(schema = "siox", name = "tbl_usuarios")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class TblUsuarios {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "nombre", nullable = false, length = 255)
    private String nombre;

    @Column(name = "a_paterno", nullable = false, length = 255)
    private String aPaterno;

    @Column(name = "a_materno", nullable = false, length = 255)
    private String aMaterno;

    @Column(name = "correo", nullable = false, length = 255, unique = true)
    private String correo;

    @Column(name = "secret", length = 255)
    private String secret;

    @Column(name = "password", nullable = false, length = 255)
    private String password;

    @Column(name = "fecha_creacion", nullable = false)
    private LocalDate fechaCreacion;

    @Column(name = "fecha_actualizacion")
    private LocalDate fechaActualizacion;

    @Column(name = "activo", nullable = false)
    private Boolean activo;

    @Column(name = "id_rol", nullable = false)
    private Long idRol;

    @Column(name = "id_licencia", nullable = false)
    private Long idLicencia;
}