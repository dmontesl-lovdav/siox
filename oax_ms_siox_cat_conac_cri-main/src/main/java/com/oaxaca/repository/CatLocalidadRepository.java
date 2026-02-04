package com.oaxaca.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.oaxaca.entity.CatLocalidad;

@Repository
public interface CatLocalidadRepository extends JpaRepository<CatLocalidad, Integer> {
    boolean existsByClaveAndIdNot(Integer clave, Integer id);

    boolean existsByClave(Integer clave);
}
