package com.oaxaca.dto;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CatGeneroDTO {
    private Integer id;
    private String clave;
    private String descripcion;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate fechaAlta;

    private Boolean bloqueado;


    

    /**
     * @return Integer return the id
     */
    public Integer getId() {
        return id;
    }

    /**
     * @return String return the clave
     */
    public String getClave() {
        return clave != null ? clave.trim() : null;
    }

    /**
     * @return String return the descripcion
     */
    public String getDescripcion() {
        return descripcion != null ? descripcion.trim() : null;
    }

    /**
     * @return LocalDate return the fechaAlta
     */
    public LocalDate getFechaAlta() {
        return fechaAlta;
    }

    /**
     * @return Boolean return the bloqueado
     */
    public Boolean isBloqueado() {
        return bloqueado;
    }

}
