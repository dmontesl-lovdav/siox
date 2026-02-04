package com.oaxaca.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.oaxaca.entity.CatEstado;

public interface CatDomicilioRepositoryCustom extends JpaRepository<CatEstado, Integer> {

        @Query(value = "SELECT * FROM siox.get_localidades(:p_municipio, :p_clave_localidad, :p_descripcion, :p_usuario_creacion, :p_fecha_alta, :p_sort, :p_page, :p_page_size)", nativeQuery = true)
        List<Object[]> findLocalidadesNative(
                        @Param("p_municipio") String p_municipio,
                        @Param("p_clave_localidad") String p_clave_localidad,
                        @Param("p_descripcion") String p_descripcion,
                        @Param("p_usuario_creacion") String p_usuario_creacion,
                        @Param("p_fecha_alta") String p_fecha_alta,
                        @Param("p_sort") String p_sort,
                        @Param("p_page") Integer p_page,
                        @Param("p_page_size") Integer p_page_size);

        @Query(value = "SELECT * FROM siox.get_cat_estados(:pais, :id, :nombre, :clave, :fechaAlta, :sort, :page, :pageSize)", nativeQuery = true)
        List<Object[]> findCatEstadosNative(
                        @Param("pais") String pais,
                        @Param("id") String id,
                        @Param("nombre") String nombre,
                        @Param("clave") String clave,
                        @Param("fechaAlta") String fechaAlta,
                        @Param("sort") String sort,
                        @Param("page") Integer page,
                        @Param("pageSize") Integer pageSize);

        @Query(value = "SELECT * FROM siox.get_distrito_region(:region, :idDistrito, :nombreDistrito, :fechaAlta, :sort, :page, :pageSize)", nativeQuery = true)
        List<Object[]> findDistritoRegionNative(
                        @Param("region") String region,
                        @Param("idDistrito") String idDistrito,
                        @Param("nombreDistrito") String nombreDistrito,
                        @Param("fechaAlta") String fechaAlta,
                        @Param("sort") String sort,
                        @Param("page") Integer page,
                        @Param("pageSize") Integer pageSize);

        @Query(value = "SELECT * FROM siox.get_municipios_por_distrito(:p_distrito, :p_clave_municipio, :p_municipio, :p_fecha_alta, :p_sort, :p_page, :p_page_size)", nativeQuery = true)
        List<Object[]> findMunicipiosPorDistritoNative(
                        @Param("p_distrito") String p_distrito,
                        @Param("p_clave_municipio") String p_clave_municipio,
                        @Param("p_municipio") String p_municipio,
                        @Param("p_fecha_alta") String p_fecha_alta,
                        @Param("p_sort") String p_sort,
                        @Param("p_page") Integer p_page,
                        @Param("p_page_size") Integer p_page_size);

        @Query(value = "SELECT * FROM siox.get_cat_tipo_vialidad(:p_busqueda, :p_sort, :p_page, :p_page_size)", nativeQuery = true)
        List<Object[]> findVialidadesNative(
                        @Param("p_busqueda") String p_busqueda,
                        @Param("p_sort") String p_sort,
                        @Param("p_page") Integer p_page,
                        @Param("p_page_size") Integer p_page_size);
}
