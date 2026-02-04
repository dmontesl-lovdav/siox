package com.oaxaca.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.oaxaca.entity.CatPais;

@Repository
public interface CatPaisRepository extends JpaRepository<CatPais, Integer> {
    @Query(value = "SELECT * FROM siox.get_cat_pais(:id, :nombre, :fechaAlta, :sort, :page, :pageSize)", nativeQuery = true)
    List<Object[]> findCatPaisNative(
            @Param("id") Integer id,
            @Param("nombre") String nombre,
            @Param("fechaAlta") String fechaAlta,
            @Param("sort") String sort,
            @Param("page") Integer page,
            @Param("pageSize") Integer pageSize);
}
