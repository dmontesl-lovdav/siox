package com.oaxaca.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.oaxaca.entity.CatEstructura;

@Repository
public interface CatEstructuraRepository extends JpaRepository<CatEstructura, Integer> {

    CatEstructura findBySufijo(String sufijo);
}
