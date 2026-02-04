package com.oaxaca.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.oaxaca.entity.CatNaturaleza;

@Repository
public interface CatNaturalezaRepository extends JpaRepository<CatNaturaleza, Integer> {

    CatNaturaleza findBySufijo(String sufijo);
}
