package com.oaxaca.repository;

import com.oaxaca.entity.CatEstatusPoliza;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CatEstatusPolizaRepository extends JpaRepository<CatEstatusPoliza, Integer> {

    @Query(value = "SELECT * FROM siox.get_cat_estatus_poliza(:p_page, :p_page_size, :p_sort, :p_clave, :p_estatus, :p_activo, :p_bloqueo)", nativeQuery = true)
    List<Object[]> findCatEstatusPoliza(
            @Param("p_page") Integer page,
            @Param("p_page_size") Integer pageSize,
            @Param("p_sort") String sort,
            @Param("p_clave") String clave,
            @Param("p_estatus") String estatus,
            @Param("p_activo") Boolean activo,
            @Param("p_bloqueo") Boolean bloqueo
    );

    Optional<CatEstatusPoliza> findById(Integer id);
}
