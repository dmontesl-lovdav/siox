package com.oaxaca.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.oaxaca.entity.CatEstadoFinanciero;

@Repository
public interface CatEstadoFinancieroRepository extends JpaRepository<CatEstadoFinanciero, Integer> {

    CatEstadoFinanciero findBySufijo(String sufijo);
}
