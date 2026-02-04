package com.oaxaca.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.oaxaca.entity.CatPosicion;

@Repository
public interface CatPosicionRepository extends JpaRepository<CatPosicion, Integer> {

    CatPosicion findBySufijo(String sufijo);
}
