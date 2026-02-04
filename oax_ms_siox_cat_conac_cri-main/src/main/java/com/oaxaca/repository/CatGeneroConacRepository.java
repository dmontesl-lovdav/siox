package com.oaxaca.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.oaxaca.entity.CatGeneroConac;

@Repository
public interface CatGeneroConacRepository extends JpaRepository<CatGeneroConac, Integer> {

    CatGeneroConac findByClaveAndEjercicio(String clave, Integer ejercicio);

    List<CatGeneroConac> findAllByEjercicio(Integer ejercicio);
}
