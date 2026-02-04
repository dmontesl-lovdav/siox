package com.oaxaca.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.oaxaca.entity.CatEstructuraCuentas;

@Repository
public interface CatEstructuraCuentasRepository extends JpaRepository<CatEstructuraCuentas, Integer> {

    @Query(value = "SELECT * FROM siox.get_cat_estructura_cuentas(:page, :pageSize, :sort, :descripcion, :niveles, :visible, :estatus, :longitud)", nativeQuery = true)
    List<Object[]> getCatEstructuraCuentas(
            @Param("page") Integer page,
            @Param("pageSize") Integer pageSize,
            @Param("sort") String sort,
            @Param("descripcion") String descripcion,
            @Param("niveles") Integer niveles,
            @Param("visible") Boolean visible,
            @Param("estatus") Boolean estatus,
            @Param("longitud") Integer longitud);

    boolean existsByDescripcionEstructura(String descripcionEstructura);
}
