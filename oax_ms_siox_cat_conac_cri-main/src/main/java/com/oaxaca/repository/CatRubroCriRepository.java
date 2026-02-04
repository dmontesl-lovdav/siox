package com.oaxaca.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.oaxaca.entity.CatRubroCri;

@Repository
public interface CatRubroCriRepository extends JpaRepository<CatRubroCri, Integer> {
    java.util.List<CatRubroCri> findAllByClave(String clave);
    CatRubroCri findByClave(String clave);
    CatRubroCri findByClaveAndEjercicio(String clave, Integer ejercicio);

    java.util.List<CatRubroCri> findAllByEjercicio(Integer ejercicio);
}
