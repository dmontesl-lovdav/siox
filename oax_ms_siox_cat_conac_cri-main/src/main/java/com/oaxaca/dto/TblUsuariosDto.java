package com.oaxaca.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TblUsuariosDto {
    private Long id;
    private String nombre;
    private String aPaterno;
    private String aMaterno;
    private String correo;
    private LocalDate fechaCreacion;
    private LocalDate fechaActualizacion;
    private Boolean activo;

    public String getNombre() {
        return nombre != null ? nombre.trim() : null;
    }

    public String getaPaterno() {
        return aPaterno != null ? aPaterno.trim() : null;
    }

    public String getaMaterno() {
        return aMaterno != null ? aMaterno.trim() : null;
    }

    public String getCorreo() {
        return correo != null ? correo.trim() : null;
    }
}
