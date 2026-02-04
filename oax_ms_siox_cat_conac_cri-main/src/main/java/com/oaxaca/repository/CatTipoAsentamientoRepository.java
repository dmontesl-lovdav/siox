package com.oaxaca.repository;

import java.util.List;
import java.util.Map;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.oaxaca.entity.CatTipoAsentamiento;

public interface CatTipoAsentamientoRepository extends JpaRepository<CatTipoAsentamiento, Integer> {
    @Query(value = "SELECT * FROM siox.get_cat_tipo_asentamiento(:busqueda, :sort, :page, :pageSize)", nativeQuery = true)
    List<Map<String, Object>> getCatTipoAsentamientoNative(
            @Param("busqueda") String busqueda,
            @Param("sort") String sort,
            @Param("page") Integer page,
            @Param("pageSize") Integer pageSize);
}
