package com.oaxaca.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CatTipoPeriodoDTO {
    private Integer totalRegistros;
    private Integer id;
    private String periodo;
}
