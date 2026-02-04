package com.oaxaca.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.oaxaca.entity.CatMomentoContable;

@Repository
public interface CatMomentoContableRepository extends JpaRepository<CatMomentoContable, Integer> {

    @Query(value = "SELECT * FROM siox.get_cat_momento_contable(" +
            ":page, :pageSize, :sort, :clave, :momentoContable, :tipoPolizaId, :esPresupuestal, :activo)", nativeQuery = true)
    List<Object[]> getCatMomentoContable(
            @Param("page") Integer page,
            @Param("pageSize") Integer pageSize,
            @Param("sort") String sort,
            @Param("clave") String clave,
            @Param("momentoContable") String momentoContable,
            @Param("tipoPolizaId") Integer tipoPolizaId,
            @Param("esPresupuestal") Boolean esPresupuestal,
            @Param("activo") Boolean activo
    );

    @Query(value = "SELECT COUNT(*) > 0 FROM siox.cat_momento_contable " +
            "WHERE UPPER(clave) = UPPER(:clave) AND activo = true", nativeQuery = true)
    boolean existsByClave(@Param("clave") String clave);

    @Query(value = "SELECT COUNT(*) > 0 FROM siox.cat_momento_contable " +
            "WHERE UPPER(momento_contable) = UPPER(:momentoContable) AND activo = true", nativeQuery = true)
    boolean existsByMomentoContable(@Param("momentoContable") String momentoContable);

    @Query(value = "SELECT COUNT(*) > 0 FROM siox.cat_momento_contable " +
            "WHERE UPPER(clave) = UPPER(:clave) AND id != :id AND activo = true", nativeQuery = true)
    boolean existsByClaveAndIdNot(@Param("clave") String clave, @Param("id") Integer id);

    @Query(value = "SELECT COUNT(*) > 0 FROM siox.cat_momento_contable " +
            "WHERE UPPER(momento_contable) = UPPER(:momentoContable) AND id != :id AND activo = true", nativeQuery = true)
    boolean existsByMomentoContableAndIdNot(@Param("momentoContable") String momentoContable, @Param("id") Integer id);
}
