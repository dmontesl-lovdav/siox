package com.oaxaca.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.oaxaca.entity.CatConceptosCri;

@Repository
public interface CatConceptosCriRepository extends JpaRepository<CatConceptosCri, Integer> {
	CatConceptosCri findByClave(String clave);

	CatConceptosCri findByClaveAndIdClase(String clave, Integer idClase);

	CatConceptosCri findByClaveAndIdClaseAndEjercicio(String clave, Integer idClase, Integer ejercicio);

	CatConceptosCri findByClaveAndEjercicio(String clave, Integer ejercicio);

	java.util.List<CatConceptosCri> findAllByEjercicioAndIdClase(Integer ejercicio, Integer idClase);

}
