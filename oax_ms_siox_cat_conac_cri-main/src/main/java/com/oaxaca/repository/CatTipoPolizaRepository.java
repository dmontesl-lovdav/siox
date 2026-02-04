package com.oaxaca.repository;

import com.oaxaca.entity.CatTipoPoliza;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CatTipoPolizaRepository extends JpaRepository<CatTipoPoliza, Integer> {

    @Query(value = "SELECT * FROM siox.get_cat_tipo_poliza(:p_page, :p_page_size, :p_sort, :p_clave, :p_tipo, :p_activo)", nativeQuery = true)
    List<Object[]> findCatTipoPoliza(
            @Param("p_page") Integer page,
            @Param("p_page_size") Integer pageSize,
            @Param("p_sort") String sort,
            @Param("p_clave") String clave,
            @Param("p_tipo") String tipo,
            @Param("p_activo") Boolean activo
    );

    Optional<CatTipoPoliza> findById(Integer id);
}
