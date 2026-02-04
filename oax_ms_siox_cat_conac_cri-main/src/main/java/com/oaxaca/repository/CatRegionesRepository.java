package com.oaxaca.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.oaxaca.entity.CatRegion;

@Repository
public interface CatRegionesRepository extends JpaRepository<CatRegion, Integer>, JpaSpecificationExecutor<CatRegion> {
    @Query(value = "SELECT * FROM siox.get_region_estado(:estado, :id, :region, :fechaAlta, :sort, :page, :pageSize)", nativeQuery = true)
    List<Object[]> findCatRegionesNative(
            @Param("estado") String estado,
            @Param("id") String id,
            @Param("region") String region,
            @Param("fechaAlta") String fechaAlta,
            @Param("sort") String sort,
            @Param("page") Integer page,
            @Param("pageSize") Integer pageSize);
}
