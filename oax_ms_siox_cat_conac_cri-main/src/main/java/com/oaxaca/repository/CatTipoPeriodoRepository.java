package com.oaxaca.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.oaxaca.entity.CatTipoPeriodo;

@Repository
public interface CatTipoPeriodoRepository extends JpaRepository<CatTipoPeriodo, Integer> {

    @Query(value = "SELECT * FROM siox.get_cat_tipo_periodo(:page, :pageSize, :search, :sort)", nativeQuery = true)
    List<Object[]> getCatTipoPeriodo(
            @Param("page") Integer page,
            @Param("pageSize") Integer pageSize,
            @Param("search") String search,
            @Param("sort") String sort);
}
