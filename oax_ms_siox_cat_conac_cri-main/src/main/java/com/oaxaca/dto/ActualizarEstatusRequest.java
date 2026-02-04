package com.oaxaca.dto;

import java.util.List;

import lombok.Data;

@Data
public class ActualizarEstatusRequest {
    private List<Integer> ids;
    private Boolean estatus;

}
