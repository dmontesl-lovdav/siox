package com.oaxaca.repository;

import java.util.List;
import java.util.Map;

public interface CatTipoVialidadRepositoryCustom {
    List<Map<String, Object>> getCatTipoVialidadCustom(String busqueda, String sort, Integer page, Integer pageSize);
}