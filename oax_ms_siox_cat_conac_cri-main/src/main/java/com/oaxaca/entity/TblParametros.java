
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
@Table(name = "tbl_parametros", schema = "siox")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class TblParametros {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(length = 200, nullable = false)
    private String parametro;

    @Column(length = 200, nullable = false)
    private String valor;

    @Column(length = 1000, nullable = false)
    private String descripcion;

    @Column(name = "id_sistema", nullable = false)
    private Integer idSistema;

    public TblParametros(String parametro, String valor, String descripcion, Integer idSistema) {
        this.parametro = parametro;
        this.valor = valor;
        this.descripcion = descripcion;
        this.idSistema = idSistema;
    }
}
