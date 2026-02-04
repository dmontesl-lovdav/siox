package com.oaxaca.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.oaxaca.entity.CatTipoSectorGubernamental;

@Repository
public interface CatTipoSectorGubernamentalRepository extends JpaRepository<CatTipoSectorGubernamental, Integer>, JpaSpecificationExecutor<CatTipoSectorGubernamental> {

    @Query(value = "SELECT * FROM siox.get_cat_tipo_sector_gubernamental(" +
                    ":page, :pageSize, :sort, :clave, :sector, :activo)", nativeQuery = true)
    List<Object[]> getCatTipoSectorGubernamental(
                    @Param("page") Integer page,
                    @Param("pageSize") Integer pageSize,
                    @Param("sort") String sort,
                    @Param("clave") String clave,
                    @Param("sector") String sector,
                    @Param("activo") Boolean activo);

    @Query(value = "SELECT COUNT(*) > 0 FROM siox.cat_tipo_sector_gubernamental " +
                   "WHERE UPPER(clave) = UPPER(:clave) AND activo = true", nativeQuery = true)
    boolean existsByClave(@Param("clave") String clave);

    @Query(value = "SELECT COUNT(*) > 0 FROM siox.cat_tipo_sector_gubernamental " +
                   "WHERE UPPER(sector) = UPPER(:sector) AND activo = true", nativeQuery = true)
    boolean existsBySector(@Param("sector") String sector);

    @Query(value = "SELECT COUNT(*) > 0 FROM siox.cat_tipo_sector_gubernamental " +
                   "WHERE UPPER(clave) = UPPER(:clave) AND id != :id AND activo = true", nativeQuery = true)
    boolean existsByClaveAndIdNot(@Param("clave") String clave, @Param("id") Integer id);

    @Query(value = "SELECT COUNT(*) > 0 FROM siox.cat_tipo_sector_gubernamental " +
                   "WHERE UPPER(sector) = UPPER(:sector) AND id != :id AND activo = true", nativeQuery = true)
    boolean existsBySectorAndIdNot(@Param("sector") String sector, @Param("id") Integer id);

    boolean existsByClaveIgnoreCaseAndIdNot(String clave, Integer id);
    boolean existsBySectorIgnoreCaseAndIdNot(String sector, Integer id);

}
