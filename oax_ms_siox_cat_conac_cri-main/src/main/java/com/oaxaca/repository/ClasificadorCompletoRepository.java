package com.oaxaca.repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.oaxaca.entity.CatConceptosCri;

@Repository
public interface ClasificadorCompletoRepository extends PagingAndSortingRepository<CatConceptosCri, Integer> {

        @Query(value = "SELECT * FROM siox.get_cri(" +
                        ":ejercicio, " +
                        ":ordenCampo, " +
                        ":tamano, " +
                        ":offset, " +
                        ":clave, " +
                        ":nombre, " +
                        ":descripcion, " +
                        ":claveCompuesta, " +
                        ":fechaAlta, " +
                        ":inicioVigencia, " +
                        ":finVigencia" +
                        ")", nativeQuery = true)
        List<Object[]> findClasificadorCompletoByEjercicio(
                        @Param("ejercicio") Integer ejercicio,
                        @Param("ordenCampo") String ordenCampo,
                        @Param("tamano") Integer tamano,
                        @Param("offset") Integer offset,
                        @Param("clave") String clave,
                        @Param("nombre") String nombre,
                        @Param("descripcion") String descripcion,
                        @Param("claveCompuesta") String claveCompuesta,
                        @Param("fechaAlta") java.sql.Date fechaAlta,
                        @Param("inicioVigencia") java.sql.Date inicioVigencia,
                        @Param("finVigencia") java.sql.Date finVigencia);

        @Query(value = "SELECT COUNT(*) FROM siox.get_cri(:ejercicio)", nativeQuery = true)
        int findClasificadorByejercicio(
                        @Param("ejercicio") Integer ejercicio);

}
