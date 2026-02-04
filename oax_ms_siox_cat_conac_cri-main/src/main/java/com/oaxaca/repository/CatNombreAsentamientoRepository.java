package com.oaxaca.repository;

import java.util.List;
import java.util.Map;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.oaxaca.entity.CatNombreAsentamiento;

@Repository
public interface CatNombreAsentamientoRepository extends JpaRepository<CatNombreAsentamiento, Integer> {
    @Query(value = "SELECT * FROM siox.get_cat_nombre_asentamiento(:busqueda, :sort, :page, :pageSize)", nativeQuery = true)
    List<Map<String, Object>> getCatNombreAsentamientoNative(
            @Param("busqueda") String busqueda,
            @Param("sort") String sort,
            @Param("page") Integer page,
            @Param("pageSize") Integer pageSize);
}
