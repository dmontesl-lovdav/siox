package com.oaxaca.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.oaxaca.entity.CatGenero;

@Repository
public interface CatGeneroRepository extends JpaRepository<CatGenero, Integer>, JpaSpecificationExecutor<CatGenero> {

        @Query(value = "SELECT * FROM siox.get_cat_genero(" +
                        ":page, :pageSize, :sort, :clave, :descripcion, :fechaAlta)", nativeQuery = true)
        List<Object[]> getCatGenero(
                        @Param("page") Integer page,
                        @Param("pageSize") Integer pageSize,
                        @Param("sort") String sort,
                        @Param("clave") String clave,
                        @Param("descripcion") String descripcion,
                        @Param("fechaAlta") LocalDate fechaAlta);

        @Query(value = "SELECT COUNT(*) > 0 FROM siox.cat_genero WHERE UPPER(clave) = UPPER(:clave)", nativeQuery = true)
        boolean existsByClave(@Param("clave") String clave);

        @Modifying
        @Query(value = "INSERT INTO siox.cat_genero (clave, descripcion, fecha_alta, estatus) " +
                        "VALUES (:clave, :descripcion, :fechaAlta, false)", nativeQuery = true)
        void insertGenero(
                        @Param("clave") String clave,
                        @Param("descripcion") String descripcion,
                        @Param("fechaAlta") LocalDate fechaAlta);

        @Modifying
        @Query(value = "UPDATE siox.cat_genero SET " +
                        "clave = :clave, " +
                        "descripcion = :descripcion " +
                        "WHERE id = :id", nativeQuery = true)
        int updateGenero(
                        @Param("id") Integer id,
                        @Param("clave") String clave,
                        @Param("descripcion") String descripcion);

        @Modifying
        @Query(value = "UPDATE siox.cat_genero SET estatus = :estatus WHERE id = :id", nativeQuery = true)
        int updateEstatus(
                        @Param("id") Integer id,
                        @Param("estatus") Boolean estatus);
}
