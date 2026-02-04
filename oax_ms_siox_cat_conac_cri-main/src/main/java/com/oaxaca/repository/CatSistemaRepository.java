package com.oaxaca.repository;

import com.oaxaca.entity.CatSistema;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CatSistemaRepository extends JpaRepository<CatSistema, Integer> {
    boolean existsById(Integer id);
}
