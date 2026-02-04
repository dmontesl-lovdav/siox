package com.oaxaca.dto;

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
public class ConsultaRespuesta<T> {
    private boolean exito;
    private String mensaje;
    private T datos;
    private int total;
    private int pagina;
    private int tamano;

    public ConsultaRespuesta(boolean exito, String mensaje, T datos) {
        this.exito = exito;
        this.mensaje = mensaje;
        this.datos = datos;
    }

}
