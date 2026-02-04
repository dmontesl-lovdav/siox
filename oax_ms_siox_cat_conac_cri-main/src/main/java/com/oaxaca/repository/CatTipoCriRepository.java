package com.oaxaca.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.oaxaca.entity.CatTipoCri;

@Repository
public interface CatTipoCriRepository extends JpaRepository<CatTipoCri, Integer> {
    List<CatTipoCri> findAllByClave(String clave);

    CatTipoCri findByClave(String clave);

    CatTipoCri findByClaveAndIdRubro(String clave, Integer idRubro);

    CatTipoCri findByClaveAndIdRubroAndEjercicio(String clave, Integer idRubro, Integer ejercicio);

    CatTipoCri findByClaveAndEjercicio(String clave, Integer ejercicio);

    java.util.List<CatTipoCri> findAllByEjercicioAndIdRubro(Integer ejercicio, Integer idRubro);

}
