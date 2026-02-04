package com.oaxaca.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.oaxaca.entity.CatClaseCri;

@Repository
public interface CatClaseCriRepository extends JpaRepository<CatClaseCri, Integer> {
    java.util.List<CatClaseCri> findAllByClave(String clave);

    CatClaseCri findByClave(String clave);

    CatClaseCri findByClaveAndIdTipo(String clave, Integer idTipo);

    CatClaseCri findByClaveAndIdTipoAndEjercicio(String clave, Integer idTipo, Integer ejercicio);

    CatClaseCri findByClaveAndEjercicio(String clave, Integer ejercicio);

    java.util.List<CatClaseCri> findAllByEjercicioAndIdTipo(Integer ejercicio, Integer idTipo);

}
