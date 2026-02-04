package com.oaxaca.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CatGeneroUpdateDTO {
    private String clave;
    private String descripcion;
    private LocalDate fechaAlta;
}
