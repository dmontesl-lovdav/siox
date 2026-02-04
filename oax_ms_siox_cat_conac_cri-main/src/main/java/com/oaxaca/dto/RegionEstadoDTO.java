package com.oaxaca.dto;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegionEstadoDTO {
    //private Integer totalRegistros;
    private Integer id;
    private String estado;
    private String region;
    private String fechaAlta;


    /**
     * @return Integer return the id
     */
    public Integer getId() {
        return id;
    }


    /**
     * @return String return the estado
     */
    public String getEstado() {
        return estado != null ? estado.trim() : null;
    }

    /**
     * @return String return the region
     */
    public String getRegion() {
        return region != null ? region.trim() : null;
    }


    /**
     * @return String return the fechaAlta
     */
    public String getFechaAlta() {
        return fechaAlta;
    }

}