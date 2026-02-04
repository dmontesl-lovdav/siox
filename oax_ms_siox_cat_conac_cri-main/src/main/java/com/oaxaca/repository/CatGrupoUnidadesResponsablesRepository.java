package com.oaxaca.repository;

import java.util.List;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CatGrupoUnidadesResponsablesRepository extends JpaRepository<com.oaxaca.entity.CatGrupoUnidadesResponsables, Integer> {

    // Consulta paginada vía función: total_registros viene en row[0] (igual que tu patrón)
    @Query(value = "SELECT * FROM siox.get_cat_grupo_unidades_responsables(:page, :pageSize, :sort, :clave, :grupoUnidadResponsable, :activo)", nativeQuery = true)
    List<Object[]> getCatGrupoUnidadesResponsables(
            @Param("page") Integer page,
            @Param("pageSize") Integer pageSize,
            @Param("sort") String sort,
            @Param("clave") String clave,
            @Param("grupoUnidadResponsable") String grupoUnidadResponsable,
            @Param("activo") Boolean activo);

    @Query(value = "SELECT COUNT(*) > 0 FROM siox.cat_grupo_unidades_responsables WHERE clave = :clave AND activo = true", nativeQuery = true)
    boolean existsByClaveActiva(@Param("clave") String clave);

    @Query(value = "SELECT COUNT(*) > 0 FROM siox.cat_grupo_unidades_responsables WHERE clave = :clave AND id != :id AND activo = true", nativeQuery = true)
    boolean existsByClaveActivaAndIdNot(@Param("clave") String clave, @Param("id") Integer id);
}
